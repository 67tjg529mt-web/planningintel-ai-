-- ============================================================
-- PlanningIntel AI — Database Schema
-- Contains tables for local_plans, call_for_sites,
-- planning_opportunities, appeals, user_alerts, and versions.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Local Plans
CREATE TABLE local_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('adopted', 'draft', 'consultation')),
    last_updated TIMESTAMPTZ,
    source_url TEXT,
    content_text TEXT,
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_local_plans_authority ON local_plans(authority_name);
CREATE INDEX idx_local_plans_status ON local_plans(status);

-- 2. Call for Sites
CREATE TABLE call_for_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority_name TEXT NOT NULL,
    opening_date TIMESTAMPTZ,
    closing_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('open', 'closed', 'upcoming')),
    source_url TEXT,
    description TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_call_for_sites_authority ON call_for_sites(authority_name);
CREATE INDEX idx_call_for_sites_status ON call_for_sites(status);
CREATE INDEX idx_call_for_sites_closing ON call_for_sites(closing_date);

-- 3. Planning Opportunities
CREATE TABLE planning_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authority_name TEXT NOT NULL,
    description TEXT,
    opportunity_score INTEGER NOT NULL CHECK (opportunity_score >= 1 AND opportunity_score <= 100),
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'upcoming')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_authority ON planning_opportunities(authority_name);
CREATE INDEX idx_opportunities_score ON planning_opportunities(opportunity_score);
CREATE INDEX idx_opportunities_status ON planning_opportunities(status);

-- 4. Appeals
CREATE TABLE appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_reference TEXT NOT NULL,
    authority_name TEXT NOT NULL,
    site_address TEXT,
    description TEXT,
    decision_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('allowed', 'dismissed', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appeals_authority ON appeals(authority_name);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_appeals_case_ref ON appeals(case_reference);

-- 5. User Alerts
CREATE TABLE user_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_user_id ON user_alerts(user_id);
CREATE INDEX idx_alerts_unread ON user_alerts(user_id, is_read) WHERE NOT is_read;

-- 6. Versions (change tracking)
CREATE TABLE versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    parent_type TEXT NOT NULL CHECK (parent_type IN ('local_plan', 'call_for_site')),
    old_content TEXT,
    new_content TEXT,
    ai_diff_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_versions_parent ON versions(parent_id, parent_type);
CREATE INDEX idx_versions_created ON versions(created_at);