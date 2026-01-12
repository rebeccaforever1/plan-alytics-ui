-- ============================================================================
-- ADVANCED ANALYTICS TABLES
-- Additional tables for complete data migration
-- ============================================================================

-- ============================================================================
-- TABLE: Customer Interventions (for Recent Intervention Results)
-- ============================================================================
CREATE TABLE public.tb_app_customer_interventions (
  intervention_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  risk_level VARCHAR(20) NOT NULL, -- High, Medium, Low
  intervention_type VARCHAR(100) NOT NULL,
  intervention_date DATE NOT NULL,
  result VARCHAR(50) NOT NULL, -- Retained, Engaged, Pending, Churned
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, customer_id, intervention_date)
);

CREATE INDEX idx_interventions_org_date ON public.tb_app_customer_interventions(org_id, intervention_date DESC);

-- ============================================================================
-- TABLE: Revenue Distribution Analysis (Zipf/Pareto/80-20)
-- ============================================================================
CREATE TABLE public.tb_app_revenue_distribution (
  distribution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Pareto Analysis
  top_1_pct_customers INTEGER NOT NULL,
  top_1_pct_revenue_pct DECIMAL(5,2) NOT NULL,
  top_5_pct_customers INTEGER NOT NULL,
  top_5_pct_revenue_pct DECIMAL(5,2) NOT NULL,
  top_10_pct_customers INTEGER NOT NULL,
  top_10_pct_revenue_pct DECIMAL(5,2) NOT NULL,
  top_20_pct_customers INTEGER NOT NULL,
  top_20_pct_revenue_pct DECIMAL(5,2) NOT NULL,
  
  -- Zipf Analysis
  zipf_exponent DECIMAL(5,3) NOT NULL,
  zipf_r_squared DECIMAL(5,4) NOT NULL,
  
  -- Diversity metrics
  shannon_entropy DECIMAL(5,3) NOT NULL,
  gini_coefficient DECIMAL(5,4) NOT NULL,
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date)
);

CREATE INDEX idx_distribution_org_date ON public.tb_app_revenue_distribution(org_id, snapshot_date DESC);

-- ============================================================================
-- TABLE: Pricing Analysis (Van Westendorp)
-- ============================================================================
CREATE TABLE public.tb_app_pricing_analysis (
  analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  plan_type VARCHAR(50) NOT NULL, -- Basic, Pro, Enterprise
  
  -- Van Westendorp Price Points
  point_marginal_cheapness DECIMAL(8,2) NOT NULL,
  point_marginal_expensiveness DECIMAL(8,2) NOT NULL,
  optimal_price_point DECIMAL(8,2) NOT NULL,
  indifference_price_point DECIMAL(8,2) NOT NULL,
  
  -- Current pricing vs optimal
  current_price DECIMAL(8,2) NOT NULL,
  recommended_price DECIMAL(8,2) NOT NULL,
  potential_revenue_lift_pct DECIMAL(5,2),
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(org_id, snapshot_date, plan_type)
);

CREATE INDEX idx_pricing_org_date ON public.tb_app_pricing_analysis(org_id, snapshot_date DESC);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON public.tb_app_customer_interventions TO anon, authenticated;
GRANT SELECT ON public.tb_app_revenue_distribution TO anon, authenticated;
GRANT SELECT ON public.tb_app_pricing_analysis TO anon, authenticated;