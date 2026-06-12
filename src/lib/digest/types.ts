// ============================================================
// PlanningIntel AI — Weekly Digest Type Definitions
// ============================================================

export interface DigestSection {
  title: string;
  icon: string;
  items: DigestItem[];
}

export interface DigestItem {
  id: string;
  lpaName: string;
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  date: string;
  type: 'call_for_sites' | 'plan_update' | 'opportunity' | 'appeal' | 'consultation';
  link?: string;
}

export interface WeeklyDigest {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  totalChanges: number;
  newCallForSites: number;
  planUpdates: number;
  newOpportunities: number;
  pendingAppeals: number;
  sections: DigestSection[];
  summary: string;
}

export interface DigestConfig {
  /**
   * Number of days to look back for digest (default: 7)
   */
  lookbackDays?: number;
  /**
   * Maximum items per section (default: 10)
   */
  maxItemsPerSection?: number;
}

export interface NotificationPayload {
  userId: string;
  type: 'daily_digest' | 'weekly_digest' | 'urgent_alert' | 'opportunity_alert';
  title: string;
  message: string;
  digestId?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationChannel {
  name: string;
  send(payload: NotificationPayload, digest: WeeklyDigest): Promise<boolean>;
}