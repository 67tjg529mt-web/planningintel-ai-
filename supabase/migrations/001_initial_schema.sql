-- ============================================================
-- PlanningIntel AI — Initial Database Schema Migration
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Local Planning Authorities
CREATE TABLE local_planning_authorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    region TEXT,
    website_url TEXT,
    plan_page_url TEXT,
    monitoring_page_url TEXT,
    call_for_sites_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lpas_status ON local_planning_authorities(status);
CREATE INDEX idx_lpas_region ON local_planning_authorities(region);

-- 2. Local Plans
CREATE TABLE local_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lpa_id UUID NOT NULL REFERENCES local_planning_authorities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'emerging' 
        CHECK (status IN ('emerging', 'regulation_18', 'regulation_19', 'submission', 'adopted', 'review')),
    stage TEXT,
    last_updated TIMESTAMPTZ,
    next_review_date DATE,
    summary TEXT,
    ai_summary TEXT,
    change_log JSONB DEFAULT '[]'::jsonb,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_local_plans_lpa_id ON local_plans(lpa_id);
CREATE INDEX idx_local_plans_status ON local_plans(status);

-- 3. Call for Sites
CREATE TABLE call_for_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lpa_id UUID NOT NULL REFERENCES local_planning_authorities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' 
        CHECK (status IN ('open', 'closed', 'upcoming')),
    open_date TIMESTAMPTZ,
    close_date TIMESTAMPTZ,
    url TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ai_summary TEXT,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_call_for_sites_lpa_id ON call_for_sites(lpa_id);
CREATE INDEX idx_call_for_sites_status ON call_for_sites(status);
CREATE INDEX idx_call_for_sites_close_date ON call_for_sites(close_date);

-- 4. Scrape Logs (track scraping history and reliability)
CREATE TABLE scrape_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lpa_id UUID REFERENCES local_planning_authorities(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('local_plan', 'call_for_sites', 'monitoring')),
    status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
    changes_detected BOOLEAN NOT NULL DEFAULT FALSE,
    error_message TEXT,
    pages_scraped INT DEFAULT 0,
    duration_ms INT,
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scrape_logs_lpa_id ON scrape_logs(lpa_id);
CREATE INDEX idx_scrape_logs_scraped_at ON scrape_logs(scraped_at);

-- 5. Planning Opportunities (AI-flagged)
CREATE TABLE planning_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lpa_id UUID NOT NULL REFERENCES local_planning_authorities(id) ON DELETE CASCADE,
    call_for_sites_id UUID REFERENCES call_for_sites(id) ON DELETE SET NULL,
    local_plan_id UUID REFERENCES local_plans(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    opportunity_type TEXT NOT NULL 
        CHECK (opportunity_type IN ('call_for_sites', 'policy_change', 'plan_adoption', 'site_allocation')),
    impact_level TEXT NOT NULL DEFAULT 'medium' 
        CHECK (impact_level IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'expired', 'upcoming')),
    deadline TIMESTAMPTZ,
    location TEXT,
    site_area_hectares NUMERIC(10, 2),
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_lpa_id ON planning_opportunities(lpa_id);
CREATE INDEX idx_opportunities_status ON planning_opportunities(status);
CREATE INDEX idx_opportunities_type ON planning_opportunities(opportunity_type);
CREATE INDEX idx_opportunities_impact ON planning_opportunities(impact_level);

-- 6. User Alerts
CREATE TABLE user_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL 
        CHECK (alert_type IN ('new_call_for_sites', 'plan_update', 'opportunity', 'deadline_approaching')),
    title TEXT NOT NULL,
    description TEXT,
    related_entity_type TEXT 
        CHECK (related_entity_type IN ('lpa', 'local_plan', 'call_for_sites', 'opportunity')),
    related_entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_user_id ON user_alerts(user_id);
CREATE INDEX idx_alerts_unread ON user_alerts(user_id, is_read) WHERE NOT is_read;

-- 7. User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL DEFAULT 'free' 
        CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_tier ON user_subscriptions(subscription_tier);

-- 8. User LPA Subscriptions (which LPAs each user is monitoring)
CREATE TABLE user_lpa_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lpa_id UUID NOT NULL REFERENCES local_planning_authorities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lpa_id)
);

CREATE INDEX idx_user_lpa_subs_user ON user_lpa_subscriptions(user_id);
CREATE INDEX idx_user_lpa_subs_lpa ON user_lpa_subscriptions(lpa_id);

-- 9. Daily Intelligence Digest (archived digests)
CREATE TABLE intelligence_digests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    digest_date DATE NOT NULL,
    summary TEXT NOT NULL,
    highlights JSONB DEFAULT '[]'::jsonb,
    opportunities_count INT DEFAULT 0,
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_digests_user_date ON intelligence_digests(user_id, digest_date);

-- ============================================================
-- Triggers for updated_at auto-update
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lpas_updated_at
    BEFORE UPDATE ON local_planning_authorities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_local_plans_updated_at
    BEFORE UPDATE ON local_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_call_for_sites_updated_at
    BEFORE UPDATE ON call_for_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON planning_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all user-facing tables
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lpa_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_digests ENABLE ROW LEVEL SECURITY;

-- User Alerts: users can only read their own alerts
CREATE POLICY user_alerts_select ON user_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY user_alerts_update ON user_alerts FOR UPDATE
    USING (auth.uid() = user_id);

-- User Subscriptions: users can only see their own subscription
CREATE POLICY user_subscriptions_select ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- User LPA Subscriptions: users manage their own subscriptions
CREATE POLICY user_lpa_subscriptions_select ON user_lpa_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY user_lpa_subscriptions_insert ON user_lpa_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_lpa_subscriptions_delete ON user_lpa_subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Intelligence Digests: users see their own digests
CREATE POLICY digests_select ON intelligence_digests FOR SELECT
    USING (auth.uid() = user_id);

-- Public tables (read-only for authenticated users)
ALTER TABLE local_planning_authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_for_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY lpas_select ON local_planning_authorities FOR SELECT
    USING (auth.role() IS NOT NULL);

CREATE POLICY local_plans_select ON local_plans FOR SELECT
    USING (auth.role() IS NOT NULL);

CREATE POLICY call_for_sites_select ON call_for_sites FOR SELECT
    USING (auth.role() IS NOT NULL);

CREATE POLICY opportunities_select ON planning_opportunities FOR SELECT
    USING (auth.role() IS NOT NULL);