// ============================================================
// PlanningIntel AI — Notification Dispatch System
// Supports in-app notifications and mock email dispatch
// ============================================================

import { NotificationPayload, NotificationChannel, WeeklyDigest } from '../digest/types';

// ============================================================
// Notification Channels
// ============================================================

/**
 * In-app notification channel — logs to console and stores in memory
 */
export class InAppChannel implements NotificationChannel {
  name = 'in-app';

  async send(payload: NotificationPayload, digest: WeeklyDigest): Promise<boolean> {
    console.log(`[InApp] Notification for user ${payload.userId}:`);
    console.log(`  Type: ${payload.type}`);
    console.log(`  Title: ${payload.title}`);
    console.log(`  Digest: ${digest.weekStart} → ${digest.weekEnd} (${digest.totalChanges} changes)`);
    return true;
  }
}

/**
 * Mock email channel — logs formatted email to console
 */
export class MockEmailChannel implements NotificationChannel {
  name = 'email';

  async send(payload: NotificationPayload, digest: WeeklyDigest): Promise<boolean> {
    const dateStr = new Date().toLocaleString('en-GB');
    console.log('');
    console.log('📧 EMAIL DISPATCH');
    console.log('='.repeat(60));
    console.log(`To: user-${payload.userId}@planningintel.ai`);
    console.log(`Subject: ${payload.title}`);
    console.log(`Sent: ${dateStr}`);
    console.log('-'.repeat(60));
    console.log(`Weekly Digest: ${digest.weekStart} → ${digest.weekEnd}`);
    console.log(`Changes: ${digest.totalChanges}`);
    console.log(`Sections: ${digest.sections.length}`);
    console.log('='.repeat(60));
    console.log('');
    return true;
  }
}

// ============================================================
// Notification Dispatcher
// ============================================================

export class NotificationDispatcher {
  private channels: NotificationChannel[] = [];
  private sentNotifications: Set<string> = new Set();

  constructor() {
    this.channels.push(new InAppChannel());
    this.channels.push(new MockEmailChannel());
  }

  /**
   * Register a custom channel
   */
  registerChannel(channel: NotificationChannel): void {
    this.channels.push(channel);
  }

  /**
   * Send notification across all registered channels
   */
  async dispatch(payload: NotificationPayload, digest: WeeklyDigest): Promise<{
    success: boolean;
    channelResults: { channel: string; ok: boolean }[];
  }> {
    const results: { channel: string; ok: boolean }[] = [];

    for (const channel of this.channels) {
      try {
        await channel.send(payload, digest);
        results.push({ channel: channel.name, ok: true });
      } catch (error) {
        console.error(`[Notifications] Channel ${channel.name} failed:`, error);
        results.push({ channel: channel.name, ok: false });
      }
    }

    const dedupKey = `${payload.userId}:${payload.type}:${digest.weekStart}`;
    this.sentNotifications.add(dedupKey);

    return {
      success: results.every((r) => r.ok),
      channelResults: results,
    };
  }

  /**
   * Check if a notification has already been sent (dedup)
   */
  hasBeenSent(userId: string, type: string, weekStart: string): boolean {
    return this.sentNotifications.has(`${userId}:${type}:${weekStart}`);
  }
}

// ============================================================
// Convenience: send digest notification
// ============================================================

/**
 * Build and dispatch digest notifications to simulated users
 */
export async function dispatchDigestNotifications(
  digest: WeeklyDigest,
  userIds: string[] = ['user-001', 'user-002', 'user-003']
): Promise<void> {
  const dispatcher = new NotificationDispatcher();

  for (const userId of userIds) {
    const payload: NotificationPayload = {
      userId,
      type: 'weekly_digest',
      title: `PlanningIntel AI — Weekly Digest (${digest.weekStart})`,
      message: digest.summary.substring(0, 200),
      digestId: digest.id,
      metadata: {
        totalChanges: digest.totalChanges,
        newCallForSites: digest.newCallForSites,
        planUpdates: digest.planUpdates,
        newOpportunities: digest.newOpportunities,
      },
    };

    const result = await dispatcher.dispatch(payload, digest);
    if (result.success) {
      console.log(`[Dispatch] ✓ ${userId} notified via ${result.channelResults.length} channels`);
    } else {
      console.warn(`[Dispatch] ⚠ ${userId} partial delivery`);
    }
  }
}

/**
 * Create in-app alert records (stored locally for the dashboard)
 */
export function createInAppAlerts(digest: WeeklyDigest): Array<{
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}> {
  const alerts: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }> = [];

  for (const section of digest.sections) {
    for (const item of section.items) {
      if (item.impact === 'high') {
        alerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: item.type === 'call_for_sites' ? 'new_call_for_sites' : 'opportunity',
          title: `${item.lpaName} — ${item.title}`,
          message: item.summary,
          time: new Date().toISOString(),
          read: false,
        });
      }
    }
  }

  return alerts;
}