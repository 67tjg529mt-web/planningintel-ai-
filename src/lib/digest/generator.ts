// ============================================================
// PlanningIntel AI — Weekly Intelligence Digest Generator
// Consolidates changes, consultations, and opportunities
// ============================================================

import { WeeklyDigest, DigestSection, DigestItem, DigestConfig } from './types';
import { renderDigestHtml } from './templates';

const DEFAULT_CONFIG: DigestConfig = {
  lookbackDays: 7,
  maxItemsPerSection: 10,
};

interface DataSource {
  getCallForSites: () => DigestItem[];
  getLocalPlanUpdates: () => DigestItem[];
  getOpportunities: () => DigestItem[];
  getAppeals: () => DigestItem[];
}

/**
 * Mock data source — returns realistic sample data
 */
function createMockDataSource(): DataSource {
  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  return {
    getCallForSites: () => [
      { id: 'cfs-1', lpaName: 'Birmingham City Council', title: 'Development Plan — Call for Sites 2026', summary: 'Residential allocations sought. Green Belt sites within 5km of city centre. Deadline: 15 Aug 2026.', impact: 'high', date: daysAgo(1), type: 'call_for_sites' },
      { id: 'cfs-2', lpaName: 'Cornwall Council', title: 'Climate Emergency DPD — Call for Sites', summary: 'Renewable energy and biodiversity net gain sites sought.', impact: 'medium', date: daysAgo(3), type: 'call_for_sites' },
      { id: 'cfs-3', lpaName: 'Leeds City Council', title: 'Site Allocations Plan — Additional Sites', summary: '15 additional sites sought for allocation. Mixed-use and residential.', impact: 'high', date: daysAgo(5), type: 'call_for_sites' },
    ],
    getLocalPlanUpdates: () => [
      { id: 'lp-1', lpaName: 'Greater Manchester CA', title: 'Places for Everyone — Reg. 19 Modifications', summary: 'Regulation 19 modifications published. Changes to employment land designations and housing trajectory.', impact: 'high', date: daysAgo(2), type: 'plan_update' },
      { id: 'lp-2', lpaName: 'Essex County Council', title: 'Minerals Local Plan — Safeguarding Amendments', summary: 'Minor amendments to minerals safeguarding areas published.', impact: 'low', date: daysAgo(4), type: 'plan_update' },
      { id: 'lp-3', lpaName: 'Cambs County Council', title: 'Local Transport Plan — New Corridors', summary: 'Regulation 19 publication. New sustainable transport corridors proposed.', impact: 'medium', date: daysAgo(6), type: 'plan_update' },
    ],
    getOpportunities: () => [
      { id: 'opp-1', lpaName: 'Birmingham City Council', title: 'Green Belt Review Sites', summary: 'High-value opportunity to submit Green Belt review sites within commuter belt.', impact: 'high', date: daysAgo(1), type: 'opportunity' },
      { id: 'opp-2', lpaName: 'Greater Manchester CA', title: 'Employment Land Policy Shift', summary: 'Increased demand for employment land in Salford and Trafford.', impact: 'high', date: daysAgo(2), type: 'opportunity' },
      { id: 'opp-3', lpaName: 'Cornwall Council', title: 'Renewable Energy Land', summary: 'Growing council appetite for solar and wind energy sites.', impact: 'medium', date: daysAgo(3), type: 'opportunity' },
    ],
    getAppeals: () => [
      { id: 'app-1', lpaName: 'Leeds City Council', title: 'APP/K2420 — Residential 48 Units Allowed', summary: 'Appeal allowed on housing land supply shortfall grounds. Costs awarded to appellant.', impact: 'high', date: daysAgo(1), type: 'appeal' },
      { id: 'app-2', lpaName: 'Birmingham City Council', title: 'APP/B4560 — Office to Residential Dismissed', summary: 'Dismissed due to loss of employment land, insufficient marketing.', impact: 'medium', date: daysAgo(3), type: 'appeal' },
    ],
  };
}

/**
 * Generate a weekly intelligence digest
 */
export async function generateDigest(
  config: DigestConfig = {},
  dataSource?: DataSource
): Promise<WeeklyDigest> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const source = dataSource || createMockDataSource();

  const now = new Date();
  const weekEnd = now.toISOString().split('T')[0];
  const weekStartDate = new Date(now);
  weekStartDate.setDate(weekStartDate.getDate() - (cfg.lookbackDays || 7));
  const weekStart = weekStartDate.toISOString().split('T')[0];

  // Collect data from all sources
  const callForSites = source.getCallForSites().slice(0, cfg.maxItemsPerSection);
  const planUpdates = source.getLocalPlanUpdates().slice(0, cfg.maxItemsPerSection);
  const opportunities = source.getOpportunities().slice(0, cfg.maxItemsPerSection);
  const appeals = source.getAppeals().slice(0, cfg.maxItemsPerSection);

  // Build sections
  const sections: DigestSection[] = [];

  if (callForSites.length > 0) {
    sections.push({
      title: 'New & Active Call for Sites',
      icon: '📍',
      items: callForSites,
    });
  }

  if (planUpdates.length > 0) {
    sections.push({
      title: 'Local Plan Updates',
      icon: '📋',
      items: planUpdates,
    });
  }

  if (opportunities.length > 0) {
    sections.push({
      title: 'AI-Identified Opportunities',
      icon: '💡',
      items: opportunities,
    });
  }

  if (appeals.length > 0) {
    sections.push({
      title: 'Notable Appeal Decisions',
      icon: '⚖️',
      items: appeals,
    });
  }

  // Compute totals
  const totalChanges = callForSites.length + planUpdates.length + opportunities.length + appeals.length;

  // Generate executive summary using AI-like logic
  const highImpact = [...callForSites, ...planUpdates, ...opportunities, ...appeals]
    .filter((i) => i.impact === 'high');

  const summary = highImpact.length > 0
    ? `This week features ${highImpact.length} high-impact development${
        highImpact.length === 1 ? '' : 's'
      }: ${highImpact.map((i) => i.title).join(', ')}. ${
        callForSites.length > 0
          ? `${callForSites.length} new Call for Sites ${
              callForSites.length === 1 ? 'is' : 'are'
            } open for submissions. `
          : ''
      }${
        opportunities.length > 0
          ? `AI analysis identified ${opportunities.length} key planning opportunities.`
          : ''
      }`
    : 'No high-impact changes detected this week. Routine monitoring continues across all LPAs.';

  return {
    id: `digest-${weekStart}`,
    weekStart,
    weekEnd,
    generatedAt: now.toISOString(),
    totalChanges,
    newCallForSites: callForSites.length,
    planUpdates: planUpdates.length,
    newOpportunities: opportunities.length,
    pendingAppeals: appeals.length,
    sections,
    summary,
  };
}

/**
 * Render digest as HTML (for email or web)
 */
export function renderDigestAsHtml(digest: WeeklyDigest): string {
  return renderDigestHtml(digest);
}

/**
 * Render digest as markdown (for logging or plain text)
 */
export function renderDigestAsMarkdown(digest: WeeklyDigest): string {
  const lines: string[] = [
    `# PlanningIntel AI — Weekly Intelligence Digest`,
    ``,
    `**Week:** ${digest.weekStart} to ${digest.weekEnd}`,
    `**Generated:** ${new Date(digest.generatedAt).toLocaleString('en-GB')}`,
    ``,
    `## Executive Summary`,
    ``,
    digest.summary,
    ``,
    `**Total Changes:** ${digest.totalChanges}`,
    `**New Call for Sites:** ${digest.newCallForSites}`,
    `**Plan Updates:** ${digest.planUpdates}`,
    `**New Opportunities:** ${digest.newOpportunities}`,
    `**Appeals:** ${digest.pendingAppeals}`,
    ``,
  ];

  for (const section of digest.sections) {
    lines.push(`## ${section.icon} ${section.title}`);
    lines.push('');
    for (const item of section.items) {
      lines.push(`### ${item.title}`);
      lines.push(`**LPA:** ${item.lpaName}`);
      lines.push(`**Impact:** ${item.impact.toUpperCase()}`);
      lines.push(`**Date:** ${item.date}`);
      lines.push(`**Summary:** ${item.summary}`);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('*Generated by PlanningIntel AI*');

  return lines.join('\n');
}

/**
 * Log digest to console (mock dispatch)
 */
export function logDigest(digest: WeeklyDigest): void {
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 WEEKLY INTELLIGENCE DIGEST');
  console.log('='.repeat(60));
  console.log(`Period: ${digest.weekStart} → ${digest.weekEnd}`);
  console.log(`Generated: ${digest.generatedAt}`);
  console.log('-'.repeat(60));
  console.log(digest.summary);
  console.log('-'.repeat(60));
  console.log(`Call for Sites: ${digest.newCallForSites}`);
  console.log(`Plan Updates: ${digest.planUpdates}`);
  console.log(`Opportunities: ${digest.newOpportunities}`);
  console.log(`Appeals: ${digest.pendingAppeals}`);
  console.log(`Total Changes: ${digest.totalChanges}`);
  console.log('='.repeat(60));
  console.log('');
}