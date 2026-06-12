// ============================================================
// PlanningIntel AI — Real Scraper Provider
// Fetches actual content from LPA planning pages via HTTP
// ============================================================

import { ScrapedPage, ScrapeResult } from '../types';
import { LpaInfo } from '../types';

const USER_AGENT =
  'Mozilla/5.0 (compatible; PlanningIntelAI/1.0; +https://planningintel.ai/bot)';

interface FetchOptions {
  timeout?: number;
  maxRedirects?: number;
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<{ html: string; finalUrl: string }> {
  const { timeout = 15000, maxRedirects = 5 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return { html, finalUrl: response.url };
  } finally {
    clearTimeout(timer);
  }
}

function extractTextContent(html: string): string {
  // Strip HTML tags and extract meaningful text content
  const withoutScripts = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
  const withoutStyles = withoutScripts.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
  const withoutTags = withoutStyles.replace(/<[^>]+>/g, ' ');
  
  // Decode common HTML entities
  let text = withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&pound;/g, '£');

  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Extract meaningful lines (remove lines that are too short or are navigation)
  const lines = text.split('\n').filter((line) => {
    const trimmed = line.trim();
    if (trimmed.length < 3) return false;
    // Skip common navigation/boilerplate
    if (/^(cookie|skip to|search|menu|footer|©|all rights reserved)/i.test(trimmed)) return false;
    return true;
  });

  // Take the most content-rich portion (usually the middle 60%)
  const contentStart = Math.floor(lines.length * 0.1);
  const contentEnd = Math.floor(lines.length * 0.9);
  const mainContent = lines.slice(contentStart, contentEnd);

  return mainContent.join('\n').substring(0, 15000); // Limit to 15k chars
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (match) {
    return match[1].trim();
  }
  // Try Open Graph title
  const ogMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  if (ogMatch) {
    return ogMatch[1].trim();
  }
  return 'Unknown Page';
}

export async function scrapeRealLpa(
  lpa: LpaInfo,
  pageType: 'local_plan' | 'call_for_sites' | 'monitoring'
): Promise<ScrapeResult> {
  const startTime = Date.now();

  // Determine which URL to scrape
  let url: string | undefined;
  switch (pageType) {
    case 'local_plan':
      url = lpa.planPageUrl || lpa.monitoringPageUrl || lpa.websiteUrl;
      break;
    case 'call_for_sites':
      url = lpa.callForSitesUrl || lpa.planPageUrl;
      break;
    case 'monitoring':
      url = lpa.monitoringPageUrl || lpa.planPageUrl;
      break;
  }

  if (!url) {
    return {
      lpaName: lpa.name,
      success: false,
      pageType,
      pagesScraped: 0,
      changesDetected: false,
      errorMessage: `No URL available for ${lpa.name} ${pageType}`,
      durationMs: Date.now() - startTime,
    };
  }

  try {
    const { html, finalUrl } = await fetchWithRetry(url);

    const textContent = extractTextContent(html);
    const title = extractTitle(html);

    if (textContent.length < 50) {
      return {
        lpaName: lpa.name,
        success: false,
        pageType,
        pagesScraped: 1,
        changesDetected: false,
        errorMessage: `Insufficient content extracted from ${url}`,
        durationMs: Date.now() - startTime,
      };
    }

    return {
      lpaName: lpa.name,
      success: true,
      pageType,
      pagesScraped: 1,
      changesDetected: true, // Will be confirmed by AI comparison
      durationMs: Date.now() - startTime,
      scrapedContent: {
        lpaName: lpa.name,
        sourceUrl: finalUrl,
        pageType,
        textContent,
        title,
        scrapedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown scraping error';

    return {
      lpaName: lpa.name,
      success: false,
      pageType,
      pagesScraped: 0,
      changesDetected: false,
      errorMessage,
      durationMs: Date.now() - startTime,
    };
  }
}