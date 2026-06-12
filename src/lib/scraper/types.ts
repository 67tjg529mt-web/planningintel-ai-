// ============================================================
// PlanningIntel AI — Scraper Type Definitions
// ============================================================

export interface ScraperConfig {
  /** OpenAI API key for AI analysis */
  openaiApiKey?: string;
  /** OpenAI model to use (default: gpt-4o) */
  openaiModel?: string;
  /** Whether to run real scraper or simulated */
  mode: 'real' | 'mock' | 'hybrid';
  /** LPAs to scrape (empty = all) */
  targetLpas?: string[];
  /** Minimum opportunity score to trigger alert (1-100) */
  minOpportunityScore?: number;
}

export interface LpaInfo {
  id: string;
  name: string;
  region: string;
  planPageUrl?: string;
  monitoringPageUrl?: string;
  callForSitesUrl?: string;
  websiteUrl?: string;
}

export interface ScrapedPage {
  lpaName: string;
  sourceUrl: string;
  pageType: 'local_plan' | 'call_for_sites' | 'monitoring';
  rawHtml?: string;
  textContent: string;
  title: string;
  scrapedAt: string;
}

export interface ScrapeResult {
  lpaName: string;
  success: boolean;
  pageType: 'local_plan' | 'call_for_sites' | 'monitoring';
  pagesScraped: number;
  changesDetected: boolean;
  errorMessage?: string;
  durationMs: number;
  scrapedContent?: ScrapedPage;
}

export interface AiChangeAnalysis {
  changeType: 'policy_change' | 'stage_update' | 'consultation_opening' | 'call_for_sites' | 'plan_adoption' | 'minor_update' | 'no_change';
  summary: string;
  whatChanged: string;
  whyItMatters: string;
  impactLevel: 'high' | 'medium' | 'low';
  opportunityScore: number; // 1-100
  recommendedAction: string;
  keyOpportunities: string[];
  risks: string[];
  confidenceScore: number; // 1-100
}

export interface ScrapeLogRecord {
  lpaName: string;
  sourceType: 'local_plan' | 'call_for_sites' | 'monitoring';
  status: 'success' | 'partial' | 'failed';
  changesDetected: boolean;
  errorMessage?: string;
  pagesScraped: number;
  durationMs: number;
  scrapedAt: string;
}

export interface VersionRecord {
  parentType: 'local_plan' | 'call_for_site';
  parentId: string;
  oldContent: string;
  newContent: string;
  aiDiffSummary: string;
}

export interface OpportunityRecord {
  title: string;
  authorityName: string;
  description: string;
  opportunityScore: number;
  category: string;
  status: 'active' | 'expired' | 'upcoming';
  callForSitesDeadline?: string;
}

// Simulated HTML/markup patterns for realistic mock scraping
export interface MockTemplate {
  lpaName: string;
  planStatus: string;
  planTitle: string;
  planStage: string;
  lastUpdated: string;
  hasCallForSites: boolean;
  callForSitesStatus?: 'open' | 'closed' | 'upcoming';
  callForSitesDeadline?: string;
  siteAllocations: number;
  policiesCount: number;
}