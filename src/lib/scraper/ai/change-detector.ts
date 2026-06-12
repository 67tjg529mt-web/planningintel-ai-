// ============================================================
// PlanningIntel AI — AI Change Detection & Opportunity Scoring
// Uses OpenAI to analyze scraped content, detect changes,
// assess impact, and compute opportunity scores.
// ============================================================

import { AiChangeAnalysis } from '../types';
import { callOpenAI } from './openai';

const ANALYST_SYSTEM_PROMPT = `You are a senior UK planning consultant AI assistant. Your role is to analyze changes to Local Plans and Call for Sites consultations, and provide actionable intelligence to property developers and planning consultancies.

For each piece of content, you must:
1. Identify what has changed (compared to the previous version, if available)
2. Categorize the type of change
3. Assess the impact level for developers
4. Calculate an opportunity score (1-100)
5. Recommend specific actions
6. Identify key opportunities and risks

Be specific, use real planning terminology, and provide monetizable insights.`;

const CHANGE_DETECTION_PROMPT = `Analyze the following Local Planning Authority content and provide a structured analysis of what changed and what it means for developers and land promoters.

Respond with a JSON object containing:
- changeType: one of "policy_change", "stage_update", "consultation_opening", "call_for_sites", "plan_adoption", "minor_update", "no_change"
- summary: 2-3 sentence plain-English summary of what happened
- whatChanged: specific bullet points of what changed
- whyItMatters: why this matters to developers/land promoters
- impactLevel: "high", "medium", or "low"
- opportunityScore: integer 1-100
- recommendedAction: what the user should do next
- keyOpportunities: array of 1-3 specific opportunities
- risks: array of 1-3 risks to be aware of
- confidenceScore: integer 1-100 indicating confidence in this analysis`;

interface ChangeDetectionInput {
  lpaName: string;
  pageType: string;
  newContent: string;
  oldContent?: string;
}

export async function analyzeChange(input: ChangeDetectionInput): Promise<AiChangeAnalysis> {
  const contentDiff = buildContentDiff(input);

  const result = await callOpenAI<AiChangeAnalysis>(
    ANALYST_SYSTEM_PROMPT,
    `${CHANGE_DETECTION_PROMPT}\n\n${contentDiff}`,
    { type: 'json_object' },
    0.3
  );

  return {
    changeType: result.changeType || 'minor_update',
    summary: result.summary || 'No significant changes detected.',
    whatChanged: result.whatChanged || 'No specific changes identified.',
    whyItMatters: result.whyItMatters || 'No material impact identified.',
    impactLevel: result.impactLevel || 'low',
    opportunityScore: clampScore(result.opportunityScore),
    recommendedAction: result.recommendedAction || 'Continue monitoring.',
    keyOpportunities: result.keyOpportunities || [],
    risks: result.risks || [],
    confidenceScore: clampScore(result.confidenceScore),
  };
}

function buildContentDiff(input: ChangeDetectionInput): string {
  let diff = `LPA: ${input.lpaName}\n`;
  diff += `Page Type: ${input.pageType}\n\n`;

  if (input.oldContent) {
    diff += '=== PREVIOUS VERSION (old) ===\n';
    diff += input.oldContent.substring(0, 8000);
    diff += '\n\n=== NEW VERSION (current) ===\n';
    diff += input.newContent.substring(0, 8000);
  } else {
    diff += '=== CURRENT CONTENT ===\n';
    diff += input.newContent.substring(0, 8000);
    diff += '\n\nNote: This is the first scrape — no previous version available for comparison.';
  }

  return diff;
}

function clampScore(score: number): number {
  if (typeof score !== 'number' || isNaN(score)) return 50;
  return Math.max(1, Math.min(100, Math.round(score)));
}

/**
 * Generate a title for a planning opportunity based on the analysis
 */
export function generateOpportunityTitle(
  lpaName: string,
  analysis: AiChangeAnalysis
): string {
  const prefixes: Record<string, string> = {
    call_for_sites: 'Call for Sites',
    consultation_opening: 'Consultation Open',
    policy_change: 'Policy Change',
    plan_adoption: 'Plan Adopted',
    stage_update: 'Plan Stage Update',
    minor_update: 'Update',
    no_change: 'Monitoring',
  };

  const prefix = prefixes[analysis.changeType] || 'Opportunity';
  return `${lpaName} — ${prefix}: ${analysis.summary.substring(0, 60)}`;
}

/**
 * Determine opportunity category based on change type
 */
export function getOpportunityCategory(changeType: string): string {
  const categories: Record<string, string> = {
    call_for_sites: 'call_for_sites',
    consultation_opening: 'consultation',
    policy_change: 'policy_change',
    plan_adoption: 'plan_adoption',
    stage_update: 'plan_progress',
    minor_update: 'information',
    no_change: 'monitoring',
  };
  return categories[changeType] || 'information';
}

/**
 * Determine if an opportunity should trigger an alert based on score
 */
export function shouldCreateOpportunity(analysis: AiChangeAnalysis): boolean {
  return (
    analysis.opportunityScore >= 30 &&
    analysis.changeType !== 'no_change' &&
    analysis.changeType !== 'minor_update'
  );
}