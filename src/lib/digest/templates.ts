// ============================================================
// PlanningIntel AI — Digest HTML Email Templates
// ============================================================

import { WeeklyDigest } from './types';

export function renderDigestHtml(digest: WeeklyDigest): string {
  const impactColors: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6',
  };

  const typeIcons: Record<string, string> = {
    call_for_sites: '📍',
    plan_update: '📋',
    opportunity: '💡',
    appeal: '⚖️',
    consultation: '🗳️',
  };

  const sectionHtml = digest.sections
    .map(
      (section) => `
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px">
      <tr>
        <td style="font-size:16px;font-weight:700;color:#111;padding:12px 0;border-bottom:2px solid #2563eb;">
          ${section.icon} ${section.title}
        </td>
      </tr>
      ${section.items
        .map(
          (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" style="width:100%">
            <tr>
              <td style="width:24px;font-size:14px;">${typeIcons[item.type] || '•'}</td>
              <td>
                <div style="font-size:13px;font-weight:600;color:#111;margin-bottom:2px;">
                  ${item.lpaName} — ${item.title}
                </div>
                <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">${item.summary}</div>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;color:white;background:${impactColors[item.impact] || '#6b7280'};text-transform:uppercase;">
                      ${item.impact}
                    </td>
                    <td style="padding-left:8px;font-size:11px;color:#9ca3af;">${item.date}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      `
        )
        .join('')}
    </table>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlanningIntel AI Weekly Digest</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;">
    <!-- Header -->
    <tr>
      <td style="background:#0a0a0f;padding:24px 32px;border-radius:8px 8px 0 0;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#2563eb;width:32px;height:32px;border-radius:6px;text-align:center;font-size:14px;font-weight:700;color:white;">PI</td>
            <td style="padding-left:12px;">
              <div style="font-size:14px;font-weight:700;color:white;letter-spacing:1px;text-transform:uppercase;">PlanningIntel AI</div>
              <div style="font-size:11px;color:#9ca3af;">Weekly Intelligence Digest</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Period -->
    <tr>
      <td style="background:white;padding:24px 32px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">WEEKLY REPORT</div>
        <div style="font-size:18px;font-weight:700;color:#111;margin-bottom:4px;">
          ${digest.weekStart} — ${digest.weekEnd}
        </div>
        <div style="font-size:12px;color:#9ca3af;">
          Generated ${new Date(digest.generatedAt).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </td>
    </tr>

    <!-- Stats -->
    <tr>
      <td style="background:white;padding:0 32px 24px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr>
            ${[
              { label: 'Changes', value: digest.totalChanges, color: '#2563eb' },
              { label: 'Call for Sites', value: digest.newCallForSites, color: '#059669' },
              { label: 'Opportunities', value: digest.newOpportunities, color: '#7c3aed' },
              { label: 'Appeals', value: digest.pendingAppeals, color: '#d97706' },
            ]
              .map(
                (stat) => `
              <td style="text-align:center;padding:8px;background:#f9fafb;border-radius:6px;">
                <div style="font-size:22px;font-weight:700;color:${stat.color};">${stat.value}</div>
                <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${stat.label}</div>
              </td>
              `
              )
              .join('<td style="width:8px;"></td>')}
          </tr>
        </table>
      </td>
    </tr>

    <!-- Executive Summary -->
    <tr>
      <td style="background:white;padding:0 32px 24px;">
        <div style="background:#eff6ff;border-left:3px solid #2563eb;padding:12px 16px;border-radius:4px;">
          <div style="font-size:11px;font-weight:600;color:#2563eb;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Executive Summary</div>
          <div style="font-size:13px;color:#374151;line-height:1.5;">${digest.summary}</div>
        </div>
      </td>
    </tr>

    <!-- Sections -->
    <tr>
      <td style="background:white;padding:0 32px 32px;border-radius:0 0 8px 8px;">
        ${sectionHtml}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:16px 32px;text-align:center;">
        <div style="font-size:11px;color:#9ca3af;">
          <span style="font-weight:600;color:#6b7280;">PlanningIntel AI</span> — Automated Planning Intelligence<br>
          This is an automated digest. ${digest.totalChanges > 0 ? 'Act on opportunities before they expire.' : ''}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}