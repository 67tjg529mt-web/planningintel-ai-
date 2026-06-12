// ============================================================
// PlanningIntel AI — Scraper Storage Layer
// Reads from and writes to the database (Supabase)
// ============================================================

import { createClient } from '@/lib/supabase/server';
import { ScrapeLogRecord, VersionRecord, OpportunityRecord, AiChangeAnalysis } from './types';

/**
 * Store or update a local_plans record from scraped data
 */
export async function upsertLocalPlan(
  authorityName: string,
  content: string,
  aiSummary: string | null,
  sourceUrl: string
): Promise<{ id: string; isNew: boolean } | null> {
  const supabase = await createClient();

  // Find existing plan for this authority
  const { data: existing } = await supabase
    .from('local_plans')
    .select('id, content_text, status')
    .eq('authority_name', authorityName)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    // Extract status from content if possible
    const status = extractStatusFromContent(content);

    const { error } = await supabase
      .from('local_plans')
      .update({
        content_text: content,
        last_updated: now,
        source_url: sourceUrl,
        ai_summary: aiSummary,
        status,
        ...(aiSummary ? { ai_summary: aiSummary } : {}),
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`Failed to update local plan for ${authorityName}:`, error);
      return null;
    }

    return { id: existing.id, isNew: false };
  } else {
    const status = extractStatusFromContent(content);

    const { data, error } = await supabase
      .from('local_plans')
      .insert({
        authority_name: authorityName,
        content_text: content,
        source_url: sourceUrl,
        ai_summary: aiSummary,
        status,
        last_updated: now,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to insert local plan for ${authorityName}:`, error);
      return null;
    }

    return { id: data.id, isNew: true };
  }
}

function extractStatusFromContent(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('adopted')) return 'adopted';
  if (lower.includes('consultation') || lower.includes('regulation 19') || lower.includes('publication')) return 'consultation';
  if (lower.includes('draft') || lower.includes('regulation 18')) return 'draft';
  return 'draft';
}

/**
 * Store or update a call_for_sites record
 */
export async function upsertCallForSites(
  authorityName: string,
  content: string,
  sourceUrl: string,
  aiSummary: string | null
): Promise<{ id: string; isNew: boolean } | null> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('call_for_sites')
    .select('id, description')
    .eq('authority_name', authorityName)
    .single();

  const now = new Date().toISOString();
  const status = extractCallForSitesStatus(content);
  const dates = extractCallForSitesDates(content);

  if (existing) {
    const { error } = await supabase
      .from('call_for_sites')
      .update({
        description: content,
        source_url: sourceUrl,
        ai_summary: aiSummary,
        status,
        opening_date: dates.openingDate,
        closing_date: dates.closingDate,
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`Failed to update call for sites for ${authorityName}:`, error);
      return null;
    }
    return { id: existing.id, isNew: false };
  } else {
    const { data, error } = await supabase
      .from('call_for_sites')
      .insert({
        authority_name: authorityName,
        description: content,
        source_url: sourceUrl,
        ai_summary: aiSummary,
        status,
        opening_date: dates.openingDate,
        closing_date: dates.closingDate,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to insert call for sites for ${authorityName}:`, error);
      return null;
    }
    return { id: data.id, isNew: true };
  }
}

function extractCallForSitesStatus(content: string): 'open' | 'closed' | 'upcoming' {
  const lower = content.toLowerCase();
  if (lower.includes('status: closed')) return 'closed';
  if (lower.includes('status: upcoming')) return 'upcoming';
  if (lower.includes('status: open')) return 'open';
  // Heuristic
  if (lower.includes('deadline') || lower.includes('closing date')) return 'open';
  if (lower.includes('coming soon') || lower.includes('anticipated')) return 'upcoming';
  return 'open';
}

function extractCallForSitesDates(content: string): { openingDate: string | null; closingDate: string | null } {
  const datePattern = /\d{4}-\d{2}-\d{2}/g;
  const dates = content.match(datePattern);
  return {
    openingDate: dates && dates.length > 0 ? dates[0] : null,
    closingDate: dates && dates.length > 1 ? dates[1] : null,
  };
}

/**
 * Insert a record into the versions table for change tracking
 */
export async function insertVersion(record: VersionRecord): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from('versions').insert({
    parent_id: record.parentId,
    parent_type: record.parentType,
    old_content: record.oldContent,
    new_content: record.newContent,
    ai_diff_summary: record.aiDiffSummary,
  });

  if (error) {
    console.error('Failed to insert version:', error);
    return false;
  }
  return true;
}

/**
 * Insert a planning opportunity
 */
export async function insertOpportunity(record: OpportunityRecord): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from('planning_opportunities').insert({
    title: record.title,
    authority_name: record.authorityName,
    description: record.description,
    opportunity_score: record.opportunityScore,
    category: record.category,
    status: record.status,
  });

  if (error) {
    console.error('Failed to insert opportunity:', error);
    return false;
  }
  return true;
}

/**
 * Log a scrape operation
 */
export async function insertScrapeLog(record: ScrapeLogRecord): Promise<boolean> {
  // We don't have a scrape_logs table in the lead's schema,
  // so we'll log to console and could create one if needed
  console.log(`[ScrapeLog] ${record.lpaName} | ${record.sourceType} | ${record.status} | ${record.durationMs}ms`);
  return true;
}

/**
 * Get previous content for change comparison
 */
export async function getPreviousContent(
  authorityName: string,
  type: 'local_plan' | 'call_for_site'
): Promise<{ id: string; content: string } | null> {
  const supabase = await createClient();

  if (type === 'local_plan') {
    const { data } = await supabase
      .from('local_plans')
      .select('id, content_text')
      .eq('authority_name', authorityName)
      .single();
    return data ? { id: data.id, content: data.content_text || '' } : null;
  }

  if (type === 'call_for_site') {
    const { data } = await supabase
      .from('call_for_sites')
      .select('id, description')
      .eq('authority_name', authorityName)
      .single();
    return data ? { id: data.id, content: data.description || '' } : null;
  }

  return null;
}