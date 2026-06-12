// ============================================================
// PlanningIntel AI — Scraper Orchestrator
// Coordinates scraping, AI analysis, and database storage
// ============================================================

import { ScraperConfig, ScrapeResult, ScrapedPage, AiChangeAnalysis, LpaInfo } from './types';
import { LPA_DIRECTORY, hasRealUrl } from './lpa-list';
import { scrapeRealLpa } from './providers/real';
import { scrapeMockLpa } from './providers/mock';
import { analyzeChange, shouldCreateOpportunity, generateOpportunityTitle, getOpportunityCategory } from './ai/change-detector';
import {
  upsertLocalPlan,
  upsertCallForSites,
  insertVersion,
  insertOpportunity,
  insertScrapeLog,
  getPreviousContent,
} from './storage';

export interface ScrapeRunReport {
  startedAt: string;
  completedAt: string;
  totalLpas: number;
  successful: number;
  failed: number;
  changesDetected: number;
  opportunitiesCreated: number;
  errors: string[];
  durationMs: number;
}

const DEFAULT_CONFIG: ScraperConfig = {
  mode: 'hybrid',
  minOpportunityScore: 30,
};

/**
 * Run a full scraping cycle across all LPAs
 * For 'real' mode: scrapes actual LPA websites
 * For 'mock' mode: generates realistic simulated content
 * For 'hybrid' mode: real for known URLs, mock for others
 */
export async function runScrapeCycle(config: Partial<ScraperConfig> = {}): Promise<ScrapeRunReport> {
  const cfg: ScraperConfig = { ...DEFAULT_CONFIG, ...config };
  const report: ScrapeRunReport = {
    startedAt: new Date().toISOString(),
    completedAt: '',
    totalLpas: 0,
    successful: 0,
    failed: 0,
    changesDetected: 0,
    opportunitiesCreated: 0,
    errors: [],
    durationMs: 0,
  };

  const startTime = Date.now();

  // Determine which LPAs to process
  let lpasToScrape: LpaInfo[];
  if (cfg.targetLpas && cfg.targetLpas.length > 0) {
    lpasToScrape = LPA_DIRECTORY.filter((l) => cfg.targetLpas!.includes(l.id));
    // If some target LPAs weren't found by ID, try to match by name
    const foundIds = new Set(lpasToScrape.map((l) => l.id));
    for (const target of cfg.targetLpas) {
      if (!foundIds.has(target)) {
        const byName = LPA_DIRECTORY.find(
          (l) => l.name.toLowerCase().includes(target.toLowerCase())
        );
        if (byName && !foundIds.has(byName.id)) {
          lpasToScrape.push(byName);
        }
      }
    }
  } else {
    // Limit scope for performance — process a representative sample
    lpasToScrape = LPA_DIRECTORY.filter((l) => hasRealUrl(l)).slice(0, 5);
    lpasToScrape.push(...LPA_DIRECTORY.filter((l) => !hasRealUrl(l)).slice(0, 10));
  }

  report.totalLpas = lpasToScrape.length;

  // Process each LPA
  for (const lpa of lpasToScrape) {
    try {
      await processLpa(lpa, cfg, report);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      report.errors.push(`${lpa.name}: ${msg}`);
      report.failed++;
    }
  }

  report.completedAt = new Date().toISOString();
  report.durationMs = Date.now() - startTime;

  console.log(`\n[ScrapeCycle] Complete: ${report.successful}/${report.totalLpas} successful`);
  console.log(`[ScrapeCycle] Changes: ${report.changesDetected}, Opportunities: ${report.opportunitiesCreated}`);
  console.log(`[ScrapeCycle] Duration: ${report.durationMs}ms`);

  return report;
}

/**
 * Process a single LPA — scrape, analyze, store
 */
async function processLpa(
  lpa: LpaInfo,
  config: ScraperConfig,
  report: ScrapeRunReport
): Promise<void> {
  const pageTypes: Array<'local_plan' | 'call_for_sites' | 'monitoring'> = [
    'local_plan',
    'call_for_sites',
  ];

  for (const pageType of pageTypes) {
    let result: ScrapeResult;

    if (config.mode === 'real' || (config.mode === 'hybrid' && hasRealUrl(lpa))) {
      result = await scrapeRealLpa(lpa, pageType);
    } else {
      result = await scrapeMockLpa(lpa, pageType);
    }

    // Log the scrape
    await insertScrapeLog({
      lpaName: lpa.name,
      sourceType: pageType,
      status: result.success ? 'success' : 'failed',
      changesDetected: result.changesDetected,
      errorMessage: result.errorMessage,
      pagesScraped: result.pagesScraped,
      durationMs: result.durationMs,
      scrapedAt: new Date().toISOString(),
    });

    if (!result.success || !result.scrapedContent) {
      if (!result.success) {
        report.errors.push(`${lpa.name}/${pageType}: ${result.errorMessage}`);
        report.failed++;
      }
      continue;
    }

    report.successful++;

    // Get previous content for comparison
    const prevContent = await getPreviousContent(lpa.name, pageType === 'local_plan' ? 'local_plan' : 'call_for_site');

    // Run AI analysis
    let analysis: AiChangeAnalysis;
    try {
      analysis = await analyzeChange({
        lpaName: lpa.name,
        pageType,
        newContent: result.scrapedContent.textContent,
        oldContent: prevContent?.content,
      });
    } catch (aiError) {
      console.warn(`[${lpa.name}] AI analysis failed, using defaults:`, aiError);
      analysis = {
        changeType: 'minor_update',
        summary: `Scraped content from ${lpa.name} ${pageType} page.`,
        whatChanged: 'Content was scraped successfully.',
        whyItMatters: 'Monitor this LPA for future planning opportunities.',
        impactLevel: 'low',
        opportunityScore: 25,
        recommendedAction: 'Continue monitoring this LPA.',
        keyOpportunities: [],
        risks: [],
        confidenceScore: 50,
      };
    }

    // Store the scraped data
    const dbResult = pageType === 'local_plan'
      ? await upsertLocalPlan(lpa.name, result.scrapedContent.textContent, analysis.summary, result.scrapedContent.sourceUrl)
      : await upsertCallForSites(lpa.name, result.scrapedContent.textContent, result.scrapedContent.sourceUrl, analysis.summary);

    // Track changes if we had previous content
    if (prevContent && dbResult) {
      const versionStored = await insertVersion({
        parentType: pageType === 'local_plan' ? 'local_plan' : 'call_for_site',
        parentId: dbResult.id,
        oldContent: prevContent.content,
        newContent: result.scrapedContent.textContent,
        aiDiffSummary: analysis.summary,
      });

      if (versionStored && analysis.changeType !== 'no_change') {
        report.changesDetected++;
      }
    }

    // Create opportunity if high-value
    if (shouldCreateOpportunity(analysis) && analysis.opportunityScore >= (config.minOpportunityScore || 30)) {
      const title = generateOpportunityTitle(lpa.name, analysis);
      const category = getOpportunityCategory(analysis.changeType);

      const opportunityStored = await insertOpportunity({
        title,
        authorityName: lpa.name,
        description: `Impact: ${analysis.impactLevel}\n\n${analysis.summary}\n\nWhat changed:\n${analysis.whatChanged}\n\nWhy it matters:\n${analysis.whyItMatters}\n\nRecommended action:\n${analysis.recommendedAction}`,
        opportunityScore: analysis.opportunityScore,
        category,
        status: analysis.changeType === 'call_for_sites' || analysis.changeType === 'consultation_opening' ? 'active' : 'active',
      });

      if (opportunityStored) {
        report.opportunitiesCreated++;
      }
    }
  }
}