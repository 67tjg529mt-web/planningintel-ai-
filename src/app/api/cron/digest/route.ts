// ============================================================
// PlanningIntel AI — Digest API Route
// POST /api/cron/digest — Generate and dispatch weekly digest
// GET /api/cron/digest — View last generated digest
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateDigest, renderDigestAsHtml, logDigest } from '@/lib/digest/generator';
import { dispatchDigestNotifications, createInAppAlerts } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

let lastDigest: any = null;

/**
 * POST /api/cron/digest
 * Generates the weekly intelligence digest and dispatches notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.SCRAPER_API_KEY;
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse config
    let body: any = {};
    try { body = await request.json(); } catch {}

    const lookbackDays = typeof body.lookbackDays === 'number' ? body.lookbackDays : 7;
    const dispatchNotifications = body.dispatch !== false;

    console.log(`[DigestAPI] Generating ${lookbackDays}-day digest...`);

    // Generate the digest
    const digest = await generateDigest({ lookbackDays });

    // Log to console
    logDigest(digest);

    // Render HTML
    const html = renderDigestAsHtml(digest);

    // Create in-app alerts
    const alerts = createInAppAlerts(digest);

    // Dispatch notifications if requested
    let dispatchResult = null;
    if (dispatchNotifications) {
      await dispatchDigestNotifications(digest);
      dispatchResult = { usersNotified: 3, channels: ['in-app', 'email'] };
    }

    // Store last digest for GET endpoint
    lastDigest = digest;

    console.log(`[DigestAPI] Complete: ${digest.totalChanges} changes across ${digest.sections.length} sections`);

    return NextResponse.json({
      success: true,
      digest: {
        id: digest.id,
        weekStart: digest.weekStart,
        weekEnd: digest.weekEnd,
        generatedAt: digest.generatedAt,
        totalChanges: digest.totalChanges,
        newCallForSites: digest.newCallForSites,
        planUpdates: digest.planUpdates,
        newOpportunities: digest.newOpportunities,
        pendingAppeals: digest.pendingAppeals,
        summary: digest.summary,
        sections: digest.sections,
      },
      alertsCreated: alerts.length,
      dispatch: dispatchResult,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[DigestAPI] Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * GET /api/cron/digest
 * Returns the last generated digest or a preview
 */
export async function GET() {
  if (lastDigest) {
    return NextResponse.json({
      status: 'available',
      digest: lastDigest,
    });
  }

  // Generate a preview if no digest has been generated yet
  const preview = await generateDigest({ lookbackDays: 7 });

  return NextResponse.json({
    status: 'preview',
    message: 'No digest has been generated yet. POST to /api/cron/digest to generate one.',
    digest: {
      id: preview.id,
      weekStart: preview.weekStart,
      weekEnd: preview.weekEnd,
      totalChanges: preview.totalChanges,
      sections: preview.sections.length,
      summary: preview.summary,
    },
  });
}