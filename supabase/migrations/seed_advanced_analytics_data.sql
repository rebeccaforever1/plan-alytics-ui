-- ============================================================================
-- SEED DATA FOR ADVANCED ANALYTICS
-- ============================================================================

-- ============================================================================
-- Customer Interventions (20 recent interventions)
-- ============================================================================
INSERT INTO public.tb_app_customer_interventions (
  org_id, customer_id, customer_name, risk_level, intervention_type, intervention_date, result
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Acme Corp', 'High', 'Executive outreach call', '2025-12-15', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'TechStart Inc', 'High', 'Dedicated success manager', '2025-12-14', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Global Systems', 'High', 'Custom training session', '2025-12-13', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'DataFlow Solutions', 'Medium', 'Product demo of new features', '2025-12-12', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'CloudNine Tech', 'High', 'Priority support upgrade', '2025-12-11', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Innovate Labs', 'Medium', 'Check-in call', '2025-12-10', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Metro Dynamics', 'High', 'Executive outreach call', '2025-12-09', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Fusion Analytics', 'Medium', 'Usage optimization workshop', '2025-12-08', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Apex Industries', 'High', 'Custom training session', '2025-12-07', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Velocity Corp', 'Medium', 'Product demo of new features', '2025-12-06', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Summit Partners', 'High', 'Dedicated success manager', '2025-12-05', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Quantum Ventures', 'Medium', 'Check-in call', '2025-12-04', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Nexus Group', 'High', 'Priority support upgrade', '2025-12-03', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Horizon Systems', 'Medium', 'Usage optimization workshop', '2025-12-02', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Cascade Technologies', 'High', 'Executive outreach call', '2025-12-01', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Vertex Solutions', 'Medium', 'Product demo of new features', '2025-11-30', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Phoenix Enterprises', 'High', 'Custom training session', '2025-11-29', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Sterling Corp', 'Medium', 'Check-in call', '2025-11-28', 'Engaged'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Atlas Group', 'High', 'Dedicated success manager', '2025-11-27', 'Retained'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), 'Titan Industries', 'Medium', 'Usage optimization workshop', '2025-11-26', 'Engaged');


-- ============================================================================
-- Revenue Distribution Analysis (Monthly snapshots)
-- Based on realistic Pareto distribution with 68% Gini coefficient
-- ============================================================================
INSERT INTO public.tb_app_revenue_distribution (
  org_id, snapshot_date,
  top_1_pct_customers, top_1_pct_revenue_pct,
  top_5_pct_customers, top_5_pct_revenue_pct,
  top_10_pct_customers, top_10_pct_revenue_pct,
  top_20_pct_customers, top_20_pct_revenue_pct,
  zipf_exponent, zipf_r_squared,
  shannon_entropy, gini_coefficient
) VALUES
-- Jan 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-01-31',
 59, 8.2, 294, 22.4, 588, 35.1, 1176, 51.8,
 1.245, 0.9823, 6.842, 0.6842),

-- Feb 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-02-28',
 61, 8.0, 305, 22.1, 610, 34.8, 1220, 51.5,
 1.238, 0.9831, 6.891, 0.6819),

-- Mar 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-03-31',
 63, 7.9, 318, 21.9, 636, 34.6, 1272, 51.2,
 1.231, 0.9838, 6.938, 0.6795),

-- Apr 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-04-30',
 66, 7.7, 331, 21.6, 662, 34.3, 1324, 50.9,
 1.224, 0.9845, 6.984, 0.6771),

-- May 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-05-31',
 68, 7.6, 344, 21.4, 689, 34.1, 1378, 50.7,
 1.218, 0.9851, 7.028, 0.6748),

-- Jun 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-06-30',
 71, 7.4, 358, 21.2, 717, 33.9, 1434, 50.4,
 1.212, 0.9857, 7.071, 0.6725),

-- Jul 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-07-31',
 74, 7.3, 372, 21.0, 744, 33.7, 1488, 50.2,
 1.206, 0.9863, 7.112, 0.6703),

-- Aug 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-08-31',
 76, 7.1, 386, 20.8, 772, 33.5, 1544, 50.0,
 1.200, 0.9868, 7.152, 0.6681),

-- Sep 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-09-30',
 79, 7.0, 401, 20.6, 802, 33.3, 1604, 49.8,
 1.195, 0.9873, 7.191, 0.6660),

-- Oct 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-10-31',
 82, 6.9, 414, 20.5, 829, 33.1, 1658, 49.6,
 1.190, 0.9877, 7.228, 0.6640),

-- Nov 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-11-30',
 85, 6.8, 425, 20.3, 850, 33.0, 1700, 49.5,
 1.186, 0.9881, 7.253, 0.6635),

-- Dec 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31',
 85, 6.7, 426, 20.2, 853, 32.9, 1706, 49.4,
 1.183, 0.9884, 7.267, 0.6631);


-- ============================================================================
-- Pricing Analysis (Van Westendorp for each plan)
-- ============================================================================
INSERT INTO public.tb_app_pricing_analysis (
  org_id, snapshot_date, plan_type,
  point_marginal_cheapness, point_marginal_expensiveness,
  optimal_price_point, indifference_price_point,
  current_price, recommended_price, potential_revenue_lift_pct
) VALUES
-- Basic Plan
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Basic',
 45, 85, 69, 65, 60, 69, 15.0),

-- Pro Plan
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Pro',
 160, 280, 219, 205, 200, 219, 9.5),

-- Enterprise Plan
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Enterprise',
 320, 580, 449, 425, 399, 449, 12.5);


-- Verification
SELECT 'Customer Interventions' as table_name, COUNT(*) as rows FROM public.tb_app_customer_interventions
UNION ALL
SELECT 'Revenue Distribution', COUNT(*) FROM public.tb_app_revenue_distribution
UNION ALL
SELECT 'Pricing Analysis', COUNT(*) FROM public.tb_app_pricing_analysis;