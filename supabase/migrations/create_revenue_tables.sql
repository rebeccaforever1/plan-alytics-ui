-- ============================================================================
-- REVENUE PAGE METRICS TABLES
-- Plan-alytics - Revenue Analytics
-- Aligns with subscription story: $800K → $1.16M MRR (Jan-Dec 2025)
-- ============================================================================

-- ============================================================================
-- TABLE 1: Revenue Metrics (Main KPIs)
-- ============================================================================
CREATE TABLE public.tb_app_revenue_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Main KPIs
  total_revenue DECIMAL(12,2) NOT NULL,
  revenue_growth_pct DECIMAL(5,2),
  arr DECIMAL(12,2) NOT NULL,
  nrr_pct DECIMAL(5,2) NOT NULL,
  revenue_quality_index DECIMAL(5,2) NOT NULL,
  revenue_predictability_pct DECIMAL(5,2) NOT NULL,
  
  -- Revenue composition
  recurring_revenue DECIMAL(12,2) NOT NULL,
  onetime_revenue DECIMAL(12,2) NOT NULL,
  recurring_pct DECIMAL(5,2) NOT NULL,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_revenue_metrics_org_date ON public.tb_app_revenue_metrics(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE 2: Revenue by Segment (Monthly breakdown)
-- ============================================================================
CREATE TABLE public.tb_app_revenue_by_segment (
  segment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  month_date DATE NOT NULL,
  segment_name VARCHAR(50) NOT NULL,
  
  revenue DECIMAL(12,2) NOT NULL,
  customers INTEGER NOT NULL,
  growth_pct DECIMAL(5,2),
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, month_date, segment_name)
);

CREATE INDEX idx_revenue_segment_org_date ON public.tb_app_revenue_by_segment(org_id, month_date DESC);

-- ============================================================================
-- TABLE 3: Revenue Concentration (Top customers analysis)
-- ============================================================================
CREATE TABLE public.tb_app_revenue_concentration (
  concentration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Zipf's Law / Pareto Analysis
  top_10_pct_revenue DECIMAL(12,2) NOT NULL,
  top_20_pct_revenue DECIMAL(12,2) NOT NULL,
  gini_coefficient DECIMAL(5,4) NOT NULL,
  herfindahl_index DECIMAL(5,4) NOT NULL,
  
  -- Risk metrics
  concentration_risk_score DECIMAL(5,2) NOT NULL,
  diversification_index DECIMAL(5,2) NOT NULL,
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_revenue_concentration_org_date ON public.tb_app_revenue_concentration(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE 4: Revenue Forecast (Predictive models)
-- ============================================================================
CREATE TABLE public.tb_app_revenue_forecast (
  forecast_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  forecast_month DATE NOT NULL,
  
  -- Forecast values
  forecast_revenue DECIMAL(12,2) NOT NULL,
  lower_bound DECIMAL(12,2) NOT NULL,
  upper_bound DECIMAL(12,2) NOT NULL,
  confidence_interval DECIMAL(5,2) NOT NULL,
  
  -- Model info
  model_type VARCHAR(50) NOT NULL, -- 'ARIMA', 'Prophet', 'Monte Carlo'
  accuracy_pct DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, forecast_month, model_type)
);

CREATE INDEX idx_revenue_forecast_org_month ON public.tb_app_revenue_forecast(org_id, forecast_month);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON public.tb_app_revenue_metrics TO anon, authenticated;
GRANT SELECT ON public.tb_app_revenue_by_segment TO anon, authenticated;
GRANT SELECT ON public.tb_app_revenue_concentration TO anon, authenticated;
GRANT SELECT ON public.tb_app_revenue_forecast TO anon, authenticated;