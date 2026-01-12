-- ============================================================================
-- SUBSCRIPTIONS PAGE METRICS TABLES
-- Plan-alytics SaaS Analytics Platform
-- 
-- These tables store pre-calculated metrics that feed the dashboard.
-- Your ETL job will populate these tables nightly.
-- ============================================================================

-- Create app schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS app;

-- ============================================================================
-- TABLE 1: Main Subscription Metrics (Snapshot-level)
-- Stores the high-level KPIs displayed on the Overview tab
-- One row per org per snapshot date
-- ============================================================================
CREATE TABLE app.tb_app_subscription_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Main KPI Cards
  active_subscriptions INTEGER NOT NULL,
  active_subscriptions_change_pct DECIMAL(5,2),
  
  mrr DECIMAL(12,2) NOT NULL,
  mrr_change_pct DECIMAL(5,2),
  
  arpu DECIMAL(12,2) NOT NULL,
  arpu_change_pct DECIMAL(5,2),
  
  churn_rate DECIMAL(5,2) NOT NULL,
  churn_rate_change_pct DECIMAL(5,2),
  
  -- Plan Breakdown - Basic
  basic_customers INTEGER,
  basic_revenue DECIMAL(12,2),
  basic_avg_revenue DECIMAL(12,2),
  basic_churn_rate DECIMAL(5,2),
  basic_growth_pct DECIMAL(5,2),
  
  -- Plan Breakdown - Pro
  pro_customers INTEGER,
  pro_revenue DECIMAL(12,2),
  pro_avg_revenue DECIMAL(12,2),
  pro_churn_rate DECIMAL(5,2),
  pro_growth_pct DECIMAL(5,2),
  
  -- Plan Breakdown - Enterprise
  enterprise_customers INTEGER,
  enterprise_revenue DECIMAL(12,2),
  enterprise_avg_revenue DECIMAL(12,2),
  enterprise_churn_rate DECIMAL(5,2),
  enterprise_growth_pct DECIMAL(5,2),
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_subscription_metrics_org_date 
  ON app.tb_app_subscription_metrics(org_id, snapshot_date DESC);

COMMENT ON TABLE app.tb_app_subscription_metrics IS 
  'Main subscription KPIs displayed on dashboard Overview tab';

-- ============================================================================
-- TABLE 2: Subscription Trend Time Series (Monthly aggregates)
-- Stores historical monthly data for growth trend charts
-- One row per org per month
-- ============================================================================
CREATE TABLE app.tb_app_subscription_trends (
  trend_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  month_date DATE NOT NULL, -- First day of month
  
  total_subscriptions INTEGER NOT NULL,
  new_subscriptions INTEGER NOT NULL,
  churned_subscriptions INTEGER NOT NULL,
  mrr DECIMAL(12,2) NOT NULL,
  churn_rate DECIMAL(5,2) NOT NULL,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, month_date)
);

CREATE INDEX idx_subscription_trends_org_month 
  ON app.tb_app_subscription_trends(org_id, month_date DESC);

COMMENT ON TABLE app.tb_app_subscription_trends IS 
  'Monthly subscription trends for time series charts';

-- ============================================================================
-- TABLE 3: Cohort Analysis (Cohort-level)
-- Stores retention percentages for each cohort by month
-- One row per org per cohort month
-- ============================================================================
CREATE TABLE app.tb_app_subscription_cohorts (
  cohort_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  cohort_month DATE NOT NULL, -- Month cohort joined (first day of month)
  
  initial_customers INTEGER NOT NULL,
  total_revenue DECIMAL(12,2) NOT NULL,
  
  -- Retention by month (0-11 months after joining)
  month_0_retention_pct DECIMAL(5,2) DEFAULT 100.00,
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
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, cohort_month)
);

CREATE INDEX idx_subscription_cohorts_org_month 
  ON app.tb_app_subscription_cohorts(org_id, cohort_month DESC);

COMMENT ON TABLE app.tb_app_subscription_cohorts IS 
  'Cohort retention analysis for Cohort Analysis tab';

-- ============================================================================
-- TABLE 4: Churn Predictions (Customer-level)
-- Stores individual customer churn risk scores
-- One row per org per customer per snapshot date
-- ============================================================================
CREATE TABLE app.tb_app_churn_predictions (
  prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  customer_id UUID NOT NULL, -- References actual customer
  snapshot_date DATE NOT NULL,
  
  customer_name VARCHAR(255) NOT NULL,
  churn_probability DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
  risk_category VARCHAR(20) NOT NULL, -- 'High', 'Medium', 'Low'
  
  -- Customer attributes
  last_login_days INTEGER,
  support_tickets_count INTEGER,
  usage_score DECIMAL(5,2),
  plan VARCHAR(50),
  months_subscribed INTEGER,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, customer_id, snapshot_date)
);

CREATE INDEX idx_churn_predictions_org_date_risk 
  ON app.tb_app_churn_predictions(org_id, snapshot_date DESC, risk_category);

COMMENT ON TABLE app.tb_app_churn_predictions IS 
  'Individual customer churn predictions for Churn Prediction tab';

-- ============================================================================
-- TABLE 5: Churn Model Performance (Model-level)
-- Stores ML model performance metrics and feature importance
-- One row per org per snapshot date
-- ============================================================================
CREATE TABLE app.tb_app_churn_model_metrics (
  model_metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Model performance
  accuracy_pct DECIMAL(5,2) NOT NULL,
  precision_pct DECIMAL(5,2) NOT NULL,
  recall_pct DECIMAL(5,2),
  f1_score DECIMAL(5,4),
  
  -- Feature importance (stored as JSONB for flexibility)
  -- Example: [{"feature": "usage_score", "importance": 0.35, "trend": "up"}, ...]
  feature_importance JSONB NOT NULL,
  
  -- Summary stats
  total_at_risk INTEGER,
  predicted_churn_count INTEGER,
  saved_this_month INTEGER,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_churn_model_metrics_org_date 
  ON app.tb_app_churn_model_metrics(org_id, snapshot_date DESC);

COMMENT ON TABLE app.tb_app_churn_model_metrics IS 
  'Churn prediction model performance metrics';

-- ============================================================================
-- TABLE 6: Price Sensitivity Analysis (Price-level)
-- Stores demand and revenue at different price points
-- One row per org per snapshot date per price point
-- ============================================================================
CREATE TABLE app.tb_app_price_sensitivity (
  price_point_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  price DECIMAL(10,2) NOT NULL,
  demand INTEGER NOT NULL,
  revenue DECIMAL(12,2) NOT NULL,
  acceptance_rate DECIMAL(5,2) NOT NULL,
  
  -- Westendorp pricing metrics (null for individual price points)
  is_optimal_price BOOLEAN DEFAULT FALSE,
  is_indifference_point BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, price)
);

CREATE INDEX idx_price_sensitivity_org_date 
  ON app.tb_app_price_sensitivity(org_id, snapshot_date DESC);

COMMENT ON TABLE app.tb_app_price_sensitivity IS 
  'Price sensitivity analysis for Price Sensitivity tab';

-- ============================================================================
-- TABLE 7: AARRR Funnel Metrics (Stage-level)
-- Stores pirate metrics funnel data
-- One row per org per snapshot date
-- ============================================================================
CREATE TABLE app.tb_app_aarrr_funnel (
  funnel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Funnel stages (Acquisition, Activation, Retention, Referral, Revenue)
  acquisition_value INTEGER NOT NULL,
  acquisition_change_pct DECIMAL(5,2),
  
  activation_value INTEGER NOT NULL,
  activation_change_pct DECIMAL(5,2),
  
  retention_value INTEGER NOT NULL,
  retention_change_pct DECIMAL(5,2),
  
  referral_value INTEGER NOT NULL,
  referral_change_pct DECIMAL(5,2),
  
  revenue_value DECIMAL(12,2) NOT NULL,
  revenue_change_pct DECIMAL(5,2),
  
  -- Conversion rates between stages
  visitors_to_signups_pct DECIMAL(5,2),
  signups_to_activated_pct DECIMAL(5,2),
  activated_to_retained_pct DECIMAL(5,2),
  retained_to_referring_pct DECIMAL(5,2),
  retained_to_paying_pct DECIMAL(5,2),
  
  -- Revenue optimization metrics
  arpu DECIMAL(10,2),
  expansion_mrr DECIMAL(12,2),
  upsell_opportunities INTEGER,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_aarrr_funnel_org_date 
  ON app.tb_app_aarrr_funnel(org_id, snapshot_date DESC);

COMMENT ON TABLE app.tb_app_aarrr_funnel IS 
  'AARRR (Pirate Metrics) funnel data for AARRR Funnel tab';

-- ============================================================================
-- TABLE 8: Acquisition Channels (Channel-level)
-- Stores performance metrics by acquisition channel
-- One row per org per snapshot date per channel
-- ============================================================================
CREATE TABLE app.tb_app_acquisition_channels (
  channel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  channel_name VARCHAR(100) NOT NULL,
  customers INTEGER NOT NULL,
  cost DECIMAL(12,2) NOT NULL,
  ltv DECIMAL(12,2) NOT NULL,
  cac DECIMAL(12,2), -- Customer Acquisition Cost
  roi DECIMAL(5,2), -- Return on Investment
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, channel_name)
);

CREATE INDEX idx_acquisition_channels_org_date 
  ON app.tb_app_acquisition_channels(org_id, snapshot_date DESC);

COMMENT ON TABLE app.tb_app_acquisition_channels IS 
  'Acquisition channel performance for AARRR Funnel tab';

-- ============================================================================
-- GRANT PERMISSIONS (Adjust based on your security requirements)
-- ============================================================================

-- Grant read access to authenticated users (adjust as needed)
-- GRANT SELECT ON ALL TABLES IN SCHEMA app TO authenticated;

-- Grant write access to service role for ETL jobs
-- GRANT ALL ON ALL TABLES IN SCHEMA app TO service_role;

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after creating tables to verify structure
-- ============================================================================

-- Count tables created
-- SELECT COUNT(*) as table_count 
-- FROM information_schema.tables 
-- WHERE table_schema = 'app';

-- List all tables with comments
-- SELECT 
--   table_name,
--   obj_description((table_schema||'.'||table_name)::regclass, 'pg_class') as description
-- FROM information_schema.tables
-- WHERE table_schema = 'app'
-- ORDER BY table_name;