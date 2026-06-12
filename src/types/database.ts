// ============================================================
// PlanningIntel AI — Database Types
// ============================================================

export interface LocalPlanningAuthority {
  id: string;
  name: string;
  region: string | null;
  website_url: string | null;
  plan_page_url: string | null;
  monitoring_page_url: string | null;
  call_for_sites_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LocalPlan {
  id: string;
  lpa_id: string;
  title: string;
  description: string | null;
  status: 'emerging' | 'regulation_18' | 'regulation_19' | 'submission' | 'adopted' | 'review';
  stage: string | null;
  last_updated: string | null;
  next_review_date: string | null;
  summary: string | null;
  ai_summary: string | null;
  change_log: ChangeLogEntry[] | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChangeLogEntry {
  date: string;
  change_type: 'update' | 'new_stage' | 'adoption' | 'consultation';
  description: string;
  ai_impact_summary: string | null;
}

export interface CallForSites {
  id: string;
  lpa_id: string;
  title: string;
  description: string | null;
  status: 'open' | 'closed' | 'upcoming';
  open_date: string | null;
  close_date: string | null;
  url: string | null;
  details: Record<string, unknown> | null;
  ai_summary: string | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanningOpportunity {
  id: string;
  lpa_id: string;
  call_for_sites_id: string | null;
  local_plan_id: string | null;
  title: string;
  description: string | null;
  opportunity_type: 'call_for_sites' | 'policy_change' | 'plan_adoption' | 'site_allocation';
  impact_level: 'high' | 'medium' | 'low';
  status: 'active' | 'expired' | 'upcoming';
  deadline: string | null;
  location: string | null;
  site_area_hectares: number | null;
  ai_analysis: AiAnalysis | null;
  created_at: string;
  updated_at: string;
}

export interface AiAnalysis {
  summary: string;
  key_opportunities: string[];
  risks: string[];
  recommended_action: string;
  confidence_score: number;
}

export interface UserAlert {
  id: string;
  user_id: string;
  alert_type: 'new_call_for_sites' | 'plan_update' | 'opportunity' | 'deadline_approaching';
  title: string;
  description: string | null;
  related_entity_type: 'lpa' | 'local_plan' | 'call_for_sites' | 'opportunity';
  related_entity_id: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Dashboard types
export interface DashboardStats {
  total_lpas: number;
  active_call_for_sites: number;
  new_opportunities: number;
  unread_alerts: number;
  recent_updates: number;
  opportunities_by_region: { region: string; count: number }[];
  opportunities_by_impact: { impact: string; count: number }[];
}