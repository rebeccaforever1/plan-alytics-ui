-- ============================================================================
-- CUSTOMER SEGMENTATION & RETENTION TABLES
-- Complete customer lifecycle and segment tracking
-- ============================================================================

-- ============================================================================
-- TABLE 1: Customer Segments (Value-based tiers)
-- ============================================================================
CREATE TABLE public.tb_app_customer_segments (
  segment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  segment_name VARCHAR(50) NOT NULL, -- Platinum, Gold, Silver, Bronze
  segment_category VARCHAR(50) NOT NULL, -- value-based, lifecycle-stage, engagement, etc.
  
  -- Metrics
  customer_count INTEGER NOT NULL,
  total_revenue DECIMAL(12,2) NOT NULL,
  avg_revenue_per_customer DECIMAL(10,2) NOT NULL,
  retention_rate DECIMAL(5,2) NOT NULL,
  churn_rate DECIMAL(5,2) NOT NULL,
  avg_tenure_months DECIMAL(5,1) NOT NULL,
  
  -- Risk & Value
  risk_score DECIMAL(5,2) NOT NULL, -- 0-100
  clv DECIMAL(10,2) NOT NULL,
  engagement_score DECIMAL(5,2) NOT NULL,
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, segment_name, segment_category)
);

CREATE INDEX idx_segments_org_date ON public.tb_app_customer_segments(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE 2: Segment Cohorts (Retention curves by segment)
-- ============================================================================
CREATE TABLE public.tb_app_segment_cohorts (
  cohort_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  segment_name VARCHAR(50) NOT NULL,
  cohort_month DATE NOT NULL,
  
  initial_customers INTEGER NOT NULL,
  
  -- Monthly retention percentages
  month_0_retention_pct DECIMAL(5,2) DEFAULT 100,
  month_1_retention_pct DECIMAL(5,2),
  month_2_retention_pct DECIMAL(5,2),
  month_3_retention_pct DECIMAL(5,2),
  month_4_retention_pct DECIMAL(5,2),
  month_5_retention_pct DECIMAL(5,2),
  month_6_retention_pct DECIMAL(5,2),
  month_7_retention_pct DECIMAL(5,2),
  month_8_retention_pct DECIMAL(5,2),
  month_9_retention_pct DECIMAL(5,2),
  month_10_retention_pct DECIMAL(5,2),
  month_11_retention_pct DECIMAL(5,2),
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, segment_name, cohort_month)
);

CREATE INDEX idx_segment_cohorts_org ON public.tb_app_segment_cohorts(org_id, segment_name, cohort_month DESC);

-- ============================================================================
-- TABLE 3: Intervention Strategies
-- ============================================================================
CREATE TABLE public.tb_app_intervention_strategies (
  strategy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  segment_name VARCHAR(50) NOT NULL,
  strategy_name VARCHAR(100) NOT NULL,
  
  -- Effort & Impact
  effort_level VARCHAR(20) NOT NULL, -- Low, Medium, High
  expected_impact_pct DECIMAL(5,2) NOT NULL,
  estimated_cost DECIMAL(10,2) NOT NULL,
  
  -- Results
  customers_targeted INTEGER NOT NULL,
  expected_revenue_lift DECIMAL(10,2) NOT NULL,
  roi DECIMAL(8,2) NOT NULL,
  
  -- Tactics
  tactics TEXT[], -- Array of specific actions
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, segment_name, strategy_name)
);

CREATE INDEX idx_strategies_org_date ON public.tb_app_intervention_strategies(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE 4: Segment Projections (12-month forecast)
-- ============================================================================
CREATE TABLE public.tb_app_segment_projections (
  projection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  segment_name VARCHAR(50) NOT NULL,
  forecast_month DATE NOT NULL,
  
  projected_customers INTEGER NOT NULL,
  projected_revenue DECIMAL(12,2) NOT NULL,
  projected_retention_rate DECIMAL(5,2) NOT NULL,
  projected_churn_rate DECIMAL(5,2) NOT NULL,
  
  -- Scenarios
  scenario VARCHAR(20) NOT NULL, -- baseline, optimistic, pessimistic
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, segment_name, forecast_month, scenario)
);

CREATE INDEX idx_projections_org ON public.tb_app_segment_projections(org_id, segment_name, forecast_month);

-- ============================================================================
-- TABLE 5: Auto-Discovered Segments (ML-based clustering)
-- ============================================================================
CREATE TABLE public.tb_app_autodiscovered_segments (
  discovery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  segment_id VARCHAR(50) NOT NULL,
  segment_label VARCHAR(100) NOT NULL,
  segment_description TEXT NOT NULL,
  
  customer_count INTEGER NOT NULL,
  avg_revenue DECIMAL(10,2) NOT NULL,
  retention_rate DECIMAL(5,2) NOT NULL,
  
  -- Key characteristics
  defining_behaviors JSONB NOT NULL, -- {behavior: value}
  opportunity_score DECIMAL(5,2) NOT NULL,
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, segment_id)
);

CREATE INDEX idx_autodiscovered_org_date ON public.tb_app_autodiscovered_segments(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE 6: Segment Insights (AI-generated recommendations)
-- ============================================================================
CREATE TABLE public.tb_app_segment_insights (
  insight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  generated_date DATE NOT NULL,
  
  segment_name VARCHAR(50) NOT NULL,
  insight_type VARCHAR(50) NOT NULL, -- opportunity, risk, trend, behavior
  priority VARCHAR(20) NOT NULL, -- High, Medium, Low
  
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Impact
  potential_revenue_impact DECIMAL(10,2),
  customers_affected INTEGER,
  confidence_score DECIMAL(5,2), -- 0-100
  
  -- Recommendations
  recommended_actions TEXT[],
  
  calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_org_date ON public.tb_app_segment_insights(org_id, generated_date DESC);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON public.tb_app_customer_segments TO anon, authenticated;
GRANT SELECT ON public.tb_app_segment_cohorts TO anon, authenticated;
GRANT SELECT ON public.tb_app_intervention_strategies TO anon, authenticated;
GRANT SELECT ON public.tb_app_segment_projections TO anon, authenticated;
GRANT SELECT ON public.tb_app_autodiscovered_segments TO anon, authenticated;
GRANT SELECT ON public.tb_app_segment_insights TO anon, authenticated;