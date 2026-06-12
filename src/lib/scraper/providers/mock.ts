// ============================================================
// PlanningIntel AI — Mock Scraper Provider
// Generates realistic simulated LPA planning page content
// ============================================================

import { ScrapedPage, ScrapeResult, MockTemplate } from '../types';
import { LpaInfo } from '../types';

const PLAN_STAGES = ['adopted', 'draft', 'consultation'] as const;
const PLAN_STAGE_LABELS: Record<string, string> = {
  adopted: 'Adopted Local Plan',
  draft: 'Draft Local Plan (Regulation 18)',
  consultation: 'Publication (Regulation 19)',
};

const STATUS_OPTIONS: ('open' | 'closed' | 'upcoming')[] = ['open', 'closed', 'upcoming'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDays: number, endDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + randomInt(startDays, endDays));
  return d.toISOString().split('T')[0];
}

function generateLocalPlanContent(lpa: LpaInfo, template: MockTemplate): string {
  const stage = template.planStage;
  const stageLabel = PLAN_STAGE_LABELS[stage] || 'Local Plan';

  return [
    `${lpa.name} — ${stageLabel}`,
    '',
    `Plan Title: ${template.planTitle}`,
    `Status: ${template.planStatus}`,
    `Stage: ${stageLabel}`,
    `Last Updated: ${template.lastUpdated}`,
    '',
    '--- Policy Overview ---',
    `The plan contains ${template.policiesCount} planning policies covering:`,
    '- Housing delivery and affordable housing requirements',
    '- Employment land and economic development',
    '- Green Belt and countryside protection',
    '- Transport and infrastructure',
    '- Climate change and sustainability',
    '- Design quality and placemaking',
    '',
    '--- Site Allocations ---',
    `${template.siteAllocations} sites are allocated for development:`,
    `- ${Math.ceil(template.siteAllocations * 0.4)} residential sites (${randomInt(2000, 5000)} homes)`,
    `- ${Math.ceil(template.siteAllocations * 0.25)} mixed-use sites`,
    `- ${Math.ceil(template.siteAllocations * 0.2)} employment sites`,
    `- ${Math.ceil(template.siteAllocations * 0.15)} green infrastructure sites`,
    '',
    '--- Key Policy Changes ---',
    generatePolicyChanges(stage),
    '',
    '--- Next Steps ---',
    generateNextSteps(stage, template.lastUpdated),
  ].join('\n');
}

function generatePolicyChanges(stage: string): string {
  const changes: Record<string, string[]> = {
    adopted: [
      'Plan formally adopted by Full Council on ' + randomDate(-180, -1),
      'All policies now have full weight in decision-making',
      'Supplementary planning documents being prepared for key sites',
    ],
    draft: [
      'New housing target proposed: ' + randomInt(800, 5000) + ' homes per annum',
      'Updated Green Belt assessment methodology published',
      'Revised affordable housing threshold: ' + randomInt(10, 15) + '+ units',
      'New climate resilience policies added',
    ],
    consultation: [
      'Publication draft submitted for representation period',
      'Schedule of modifications published for consultation',
      'Updated evidence base documents available for review',
      'Sustainability appraisal addendum published',
    ],
  };
  return (changes[stage] || changes.draft).map((c) => '- ' + c).join('\n');
}

function generateNextSteps(stage: string, lastUpdated: string): string {
  const steps: Record<string, string> = {
    adopted: 'Five-year review due by ' + randomDate(365, 730) + '. Monitoring report to be published annually.',
    draft: 'Regulation 19 publication anticipated in ' + randomDate(60, 180) + '. Representations invited following publication.',
    consultation: 'Submission to Secretary of State planned for ' + randomDate(90, 200) + '. Examination in public expected within 6 months of submission.',
  };
  return steps[stage] || steps.draft;
}

function generateCallForSitesContent(lpa: LpaInfo, template: MockTemplate): string | null {
  if (!template.hasCallForSites) return null;

  const status = template.callForSitesStatus || 'upcoming';
  const deadline = template.callForSitesDeadline || randomDate(30, 120);

  return [
    `${lpa.name} — Call for Sites`,
    '',
    `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `Opening Date: ${randomDate(-30, 0)}`,
    `Closing Date: ${deadline}`,
    '',
    '--- What We Are Seeking ---',
    'The council invites submissions of sites for potential allocation in the Local Plan:',
    '',
    'Sites sought:',
    '- Residential sites (0.25ha minimum)',
    '- Mixed-use development sites',
    '- Employment land (1ha minimum)',
    '- Renewable energy sites',
    '- Green infrastructure and biodiversity net gain sites',
    '',
    '--- Submission Criteria ---',
    'All submissions must include:',
    '- Site location plan (1:1250 or 1:2500)',
    '- Site area in hectares',
    '- Current use and proposed use',
    '- Availability and deliverability assessment',
    '- Any known constraints (flood risk, contamination, etc.)',
    '',
    '--- Assessment Process ---',
    'Sites will be assessed against:',
    '- Suitability (policy compliance, environmental constraints)',
    '- Availability (landowner willingness, legal issues)',
    '- Achievability (viability, infrastructure capacity)',
    '- Development timescales (0-5 years, 6-10 years, 11-15 years)',
  ].join('\n');
}

function generateMonitoringContent(lpa: LpaInfo, template: MockTemplate): string {
  return [
    `${lpa.name} — Local Plan Monitoring Report`,
    '',
    `Reporting Period: ${randomDate(-365, -1)} to ${template.lastUpdated}`,
    '',
    '--- Key Indicators ---',
    `- Housing delivery: ${randomInt(60, 120)}% of annual target`,
    `- Affordable homes completed: ${randomInt(100, 800)} units`,
    `- Employment land delivered: ${randomInt(5, 50)} hectares`,
    `- Five-year housing land supply: ${(Math.random() * 5 + 1).toFixed(1)} years`,
    '',
    '--- Plan Progress ---',
    '- Local Plan stage: ' + (PLAN_STAGE_LABELS[template.planStage] || template.planStage),
    '- Neighbourhood plans adopted: ' + randomInt(2, 15),
    '- SPDs adopted: ' + randomInt(3, 12),
    '',
    '--- Appeals Summary ---',
    `- Appeals lodged: ${randomInt(10, 80)}`,
    `- Allowed: ${randomInt(3, 30)}`,
    `- Dismissed: ${randomInt(5, 50)}`,
    `- Pending: ${randomInt(2, 15)}`,
  ].join('\n');
}

export async function scrapeMockLpa(
  lpa: LpaInfo,
  pageType: 'local_plan' | 'call_for_sites' | 'monitoring'
): Promise<ScrapeResult> {
  const startTime = Date.now();
  const template: MockTemplate = {
    lpaName: lpa.name,
    planStatus: randomPick(['Adopted', 'Emerging', 'Under Review']),
    planTitle: `${lpa.name} Local Plan ${randomInt(2016, 2040)}`,
    planStage: randomPick([...PLAN_STAGES]),
    lastUpdated: randomDate(-90, 0),
    hasCallForSites: Math.random() > 0.4,
    callForSitesStatus: randomPick(STATUS_OPTIONS),
    callForSitesDeadline: randomDate(30, 180),
    siteAllocations: randomInt(15, 80),
    policiesCount: randomInt(25, 80),
  };

  let textContent: string;
  let title: string;

  switch (pageType) {
    case 'local_plan':
      textContent = generateLocalPlanContent(lpa, template);
      title = `${lpa.name} - ${PLAN_STAGE_LABELS[template.planStage]}`;
      break;
    case 'call_for_sites':
      textContent = generateCallForSitesContent(lpa, template) || generateLocalPlanContent(lpa, template);
      title = `${lpa.name} - Call for Sites`;
      break;
    case 'monitoring':
      textContent = generateMonitoringContent(lpa, template);
      title = `${lpa.name} - Monitoring Report`;
      break;
  }

  // Simulate network delay
  await new Promise((r) => setTimeout(r, randomInt(50, 200)));

  return {
    lpaName: lpa.name,
    success: true,
    pageType,
    pagesScraped: 1,
    changesDetected: Math.random() > 0.6,
    durationMs: Date.now() - startTime,
    scrapedContent: {
      lpaName: lpa.name,
      sourceUrl: lpa.planPageUrl || lpa.websiteUrl || '',
      pageType,
      textContent,
      title,
      scrapedAt: new Date().toISOString(),
    },
  };
}