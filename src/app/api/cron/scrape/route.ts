// ============================================================
// PlanningIntel AI — Scrape API Route (POST /api/cron/scrape)
// Triggers a scraping run. Can be called manually or via cron.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { runScrapeCycle } from '@/lib/scraper';

export const maxDuration = 300; // 5 minutes for longer scraping runs
export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/scrape
 * Triggers a scraping cycle with the given configuration.
 *
 * Body (optional):
 * - mode: "real" | "mock" | "hybrid" (default: "hybrid")
 * - targetLpas: string[] (optional list of LPA IDs to target)
 * - minOpportunityScore: number (default: 30)
 *
 * Returns a ScrapeRunReport with results.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key for automated triggers (cron, etc.)
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SCRAPER_API_KEY;

    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Set SCRAPER_API_KEY or provide valid Bearer token.' },
        { status: 401 }
      );
    }

    // Parse configuration from request body
    let config: Record<string, unknown> = {};
    try {
      const body = await request.json();
      config = body;
    } catch {
      // No body or invalid JSON — use defaults
    }

    // Validate mode
    const mode = config.mode as string;
    if (mode && !['real', 'mock', 'hybrid'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "real", "mock", or "hybrid".' },
        { status: 400 }
      );
    }

    // Validate targetLpas if provided
    const targetLpas = config.targetLpas as string[] | undefined;
    if (targetLpas && (!Array.isArray(targetLpas) || targetLpas.length === 0)) {
      return NextResponse.json(
        { error: 'targetLpas must be a non-empty array of LPA IDs.' },
        { status: 400 }
      );
    }

    // Validate opportunity score
    const minScore = config.minOpportunityScore as number | undefined;
    if (minScore !== undefined && (typeof minScore !== 'number' || minScore < 1 || minScore > 100)) {
      return NextResponse.json(
        { error: 'minOpportunityScore must be between 1 and 100.' },
        { status: 400 }
      );
    }

    console.log('[ScrapeAPI] Starting scrape cycle with config:', {
      mode: mode || 'hybrid',
      targetLpas: targetLpas || 'all',
      minScore: minScore || 30,
    });

    // Run the scrape cycle
    const report = await runScrapeCycle({
      mode: (mode as 'real' | 'mock' | 'hybrid') || 'hybrid',
      targetLpas,
      minOpportunityScore: minScore || 30,
    });

    return NextResponse.json({
      success: true,
      report,
      summary: {
        totalLpas: report.totalLpas,
        successful: report.successful,
        failed: report.failed,
        changesDetected: report.changesDetected,
        opportunitiesCreated: report.opportunitiesCreated,
        durationMs: report.durationMs,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[ScrapeAPI] Fatal error:', error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/scrape
 * Quick health check for the scraper endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: process.env.OPENAI_API_KEY ? 'ai-ready' : 'no-ai-key',
    scraperVersion: '1.0.0',
    lpaCount: (await import('@/lib/scraper/lpa-list')).LPA_DIRECTORY.length,
  });
}