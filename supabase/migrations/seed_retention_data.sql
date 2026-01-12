-- ============================================================================
-- SEED DATA FOR RETENTION & SEGMENTATION
-- Aligns with $800K → $1.16M MRR growth story
-- ============================================================================

-- ============================================================================
-- Customer Segments (Dec 2025 snapshot)
-- ============================================================================
INSERT INTO public.tb_app_customer_segments (
  org_id, snapshot_date, segment_name, segment_category,
  customer_count, total_revenue, avg_revenue_per_customer,
  retention_rate, churn_rate, avg_tenure_months,
  risk_score, clv, engagement_score
) VALUES
-- Value-Based Segments
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Platinum', 'value-based',
 853, 340560, 399, 96.8, 3.2, 18.5, 15.2, 9576, 92.3),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Gold', 'value-based',
 1706, 341200, 200, 94.7, 5.3, 14.2, 22.8, 5200, 84.6),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Silver', 'value-based',
 2559, 255900, 100, 92.3, 7.7, 10.8, 31.5, 2400, 76.2),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Bronze', 'value-based',
 3411, 204660, 60, 88.9, 11.1, 7.3, 42.6, 1440, 65.8),

-- Lifecycle Stages
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'New', 'lifecycle-stage',
 1706, 102360, 60, 87.2, 12.8, 2.1, 48.3, 1440, 72.5),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Growing', 'lifecycle-stage',
 2559, 409440, 160, 93.8, 6.2, 8.5, 25.7, 3840, 85.2),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Mature', 'lifecycle-stage',
 3411, 511650, 150, 95.4, 4.6, 22.7, 18.9, 4500, 89.7),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'At-Risk', 'lifecycle-stage',
 853, 136480, 160, 78.5, 21.5, 16.3, 78.2, 2880, 45.3),

-- Engagement Levels
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'High-Engagement', 'engagement',
 2559, 460620, 180, 96.2, 3.8, 16.8, 14.6, 5040, 94.8),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Medium-Engagement', 'engagement',
 4265, 426500, 100, 91.7, 8.3, 11.5, 28.4, 2400, 78.3),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Low-Engagement', 'engagement',
 1706, 102360, 60, 82.3, 17.7, 8.2, 58.9, 1440, 52.7);


-- ============================================================================
-- Segment Cohorts (Platinum segment, 12 cohorts)
-- ============================================================================
INSERT INTO public.tb_app_segment_cohorts (
  org_id, segment_name, cohort_month, initial_customers,
  month_0_retention_pct, month_1_retention_pct, month_2_retention_pct,
  month_3_retention_pct, month_4_retention_pct, month_5_retention_pct,
  month_6_retention_pct, month_7_retention_pct, month_8_retention_pct,
  month_9_retention_pct, month_10_retention_pct, month_11_retention_pct
) VALUES
-- Platinum Segment Cohorts (best retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2025-01-01', 65,
 100, 98.5, 97.2, 96.5, 96.0, 95.6, 95.2, 95.0, 94.8, 94.6, 94.5, 94.3),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2025-02-01', 68,
 100, 98.5, 97.3, 96.6, 96.1, 95.7, 95.4, 95.2, 95.0, 94.8, 94.7, NULL),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2025-03-01', 70,
 100, 98.6, 97.4, 96.7, 96.2, 95.9, 95.5, 95.3, 95.1, 95.0, NULL, NULL),

-- Gold Segment Cohorts (good retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2025-01-01', 130,
 100, 96.9, 94.6, 93.1, 92.3, 91.7, 91.2, 90.8, 90.5, 90.2, 90.0, 89.8),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2025-02-01', 136,
 100, 97.1, 94.9, 93.4, 92.6, 92.0, 91.5, 91.1, 90.8, 90.6, 90.4, NULL),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2025-03-01', 141,
 100, 97.2, 95.0, 93.6, 92.8, 92.2, 91.7, 91.4, 91.1, 90.9, NULL, NULL),

-- Silver Segment Cohorts (moderate retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2025-01-01', 195,
 100, 94.9, 91.3, 89.2, 87.9, 87.0, 86.3, 85.7, 85.2, 84.8, 84.5, 84.2),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2025-02-01', 204,
 100, 95.1, 91.7, 89.7, 88.4, 87.5, 86.8, 86.2, 85.7, 85.3, 85.0, NULL),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2025-03-01', 212,
 100, 95.3, 92.0, 90.0, 88.7, 87.9, 87.2, 86.6, 86.1, 85.7, NULL, NULL),

-- Bronze Segment Cohorts (lower retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2025-01-01', 261,
 100, 91.6, 86.2, 83.5, 81.8, 80.6, 79.7, 79.0, 78.4, 77.9, 77.5, 77.2),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2025-02-01', 272,
 100, 92.0, 86.8, 84.2, 82.5, 81.4, 80.5, 79.8, 79.2, 78.7, 78.3, NULL),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2025-03-01', 283,
 100, 92.3, 87.2, 84.7, 83.0, 81.9, 81.1, 80.4, 79.8, 79.4, NULL, NULL);


-- ============================================================================
-- Intervention Strategies
-- ============================================================================
INSERT INTO public.tb_app_intervention_strategies (
  org_id, snapshot_date, segment_name, strategy_name,
  effort_level, expected_impact_pct, estimated_cost,
  customers_targeted, expected_revenue_lift, roi,
  tactics
) VALUES
-- Platinum Segment
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Platinum', 'White-Glove Service',
 'High', 15.0, 50000, 853, 51084, 102.2,
 ARRAY['Dedicated account manager', 'Quarterly business reviews', 'Priority support', 'Early access to features']),

-- Gold Segment
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Gold', 'Proactive Engagement',
 'Medium', 12.0, 30000, 1706, 40944, 136.5,
 ARRAY['Monthly check-ins', 'Usage optimization workshops', 'Feature training', 'Success metrics tracking']),

-- Silver Segment
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Silver', 'Automated Nurture',
 'Low', 8.0, 15000, 2559, 20472, 136.5,
 ARRAY['Email campaigns', 'In-app messaging', 'Self-service resources', 'Community engagement']),

-- Bronze Segment
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Bronze', 'Re-activation Campaign',
 'Medium', 10.0, 20000, 3411, 20466, 102.3,
 ARRAY['Win-back offers', 'Feature highlights', 'Onboarding refresher', 'Usage incentives']),

-- At-Risk Customers
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'At-Risk', 'Retention Blitz',
 'High', 25.0, 40000, 853, 34120, 85.3,
 ARRAY['Executive outreach', 'Custom solutions', 'Discount offers', 'Contract renegotiation']);


-- ============================================================================
-- Segment Projections (Next 12 months, Baseline scenario)
-- ============================================================================
INSERT INTO public.tb_app_segment_projections (
  org_id, segment_name, forecast_month,
  projected_customers, projected_revenue, projected_retention_rate, projected_churn_rate,
  scenario
) VALUES
-- Platinum Segment Projections
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-01-01', 870, 347130, 96.9, 3.1, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-02-01', 887, 353913, 97.0, 3.0, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-03-01', 905, 361095, 97.0, 3.0, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-04-01', 923, 368277, 97.1, 2.9, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-05-01', 941, 375459, 97.1, 2.9, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Platinum', '2026-06-01', 960, 383040, 97.2, 2.8, 'baseline'),

-- Gold Segment Projections  
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2026-01-01', 1740, 348000, 94.8, 5.2, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2026-02-01', 1775, 355000, 94.9, 5.1, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Gold', '2026-03-01', 1810, 362000, 94.9, 5.1, 'baseline'),

-- Silver Segment Projections
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2026-01-01', 2610, 261000, 92.5, 7.5, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2026-02-01', 2662, 266200, 92.6, 7.4, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Silver', '2026-03-01', 2714, 271400, 92.6, 7.4, 'baseline'),

-- Bronze Segment Projections
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2026-01-01', 3480, 208800, 89.2, 10.8, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2026-02-01', 3515, 210900, 89.4, 10.6, 'baseline'),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', 'Bronze', '2026-03-01', 3550, 213000, 89.5, 10.5, 'baseline');


-- ============================================================================
-- Auto-Discovered Segments
-- ============================================================================
INSERT INTO public.tb_app_autodiscovered_segments (
  org_id, snapshot_date, segment_id, segment_label, segment_description,
  customer_count, avg_revenue, retention_rate,
  defining_behaviors, opportunity_score
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'power-users', 'Power Users',
 'High-frequency users with deep feature adoption across all modules',
 682, 320, 97.8,
 '{"daily_logins": 25, "features_used": 18, "api_calls": 5000, "integrations": 5}'::jsonb, 92.5),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'seasonal-spike', 'Seasonal Spikes',
 'Usage spikes during specific months, likely tied to business cycles',
 1024, 150, 88.3,
 '{"peak_months": ["Q4"], "usage_variance": 3.2, "predictable": true}'::jsonb, 78.6),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'integration-heavy', 'Integration-Heavy',
 'Heavy reliance on API and third-party integrations',
 512, 280, 95.2,
 '{"api_calls": 8000, "webhooks": 12, "integrations": 8}'::jsonb, 88.9),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'support-dependent', 'Support Dependent',
 'Frequent support ticket submitters, may indicate product friction',
 768, 180, 82.7,
 '{"monthly_tickets": 3.5, "resolution_time": 24, "satisfaction": 3.8}'::jsonb, 65.4),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'dormant-valuable', 'Dormant but Valuable',
 'Low recent activity but historically high-value customers',
 341, 250, 76.5,
 '{"last_login_days": 45, "historical_revenue": 400, "engagement_drop": 60}'::jsonb, 82.1);


-- ============================================================================
-- Segment Insights
-- ============================================================================
INSERT INTO public.tb_app_segment_insights (
  org_id, generated_date, segment_name, insight_type, priority,
  title, description,
  potential_revenue_impact, customers_affected, confidence_score,
  recommended_actions
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Platinum', 'opportunity', 'High',
 'Upsell Opportunity: Advanced Analytics Module',
 'Analysis shows 78% of Platinum customers are using basic reporting but not advanced analytics. Cross-sell opportunity of $150/month per customer.',
 99684, 664, 87.3,
 ARRAY['Launch targeted email campaign', 'Offer trial period', 'Schedule product demos', 'Create case studies']),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Gold', 'risk', 'High',
 'Churn Risk: Integration Failures',
 'Gold segment showing 23% increase in support tickets related to integration issues. Correlates with 8% churn spike.',
 68240, 391, 92.1,
 ARRAY['Audit integration reliability', 'Proactive outreach to affected customers', 'Enhanced integration docs', 'Dedicated integration support']),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Silver', 'behavior', 'Medium',
 'Engagement Drop After 90 Days',
 'Silver customers show 45% decrease in daily active usage after 90-day mark. Retention drops from 95% to 89%.',
 51180, 2559, 84.7,
 ARRAY['90-day check-in campaign', 'Feature refresh training', 'Success milestone celebration', 'Community program invitation']),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Bronze', 'opportunity', 'High',
 'Upgrade Path: Quick Wins',
 'Bronze customers who use >3 features have 3.2x higher upgrade rate. Currently only 42% are multi-feature users.',
 81864, 1435, 89.5,
 ARRAY['Feature discovery campaign', 'In-app feature tours', 'Use case templates', 'Quick-start guides']),

('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'At-Risk', 'risk', 'Critical',
 'High-Value Customers at Critical Churn Risk',
 '127 high-CLV customers (avg $280/mo) showing signs of imminent churn. Combined MRR at risk: $35,560.',
 426720, 127, 94.8,
 ARRAY['Immediate executive outreach', 'Custom retention offers', 'Root cause analysis', 'Dedicated recovery team']);


-- Verification
SELECT 'Customer Segments' as table_name, COUNT(*) as rows FROM public.tb_app_customer_segments
UNION ALL
SELECT 'Segment Cohorts', COUNT(*) FROM public.tb_app_segment_cohorts
UNION ALL
SELECT 'Intervention Strategies', COUNT(*) FROM public.tb_app_intervention_strategies
UNION ALL
SELECT 'Segment Projections', COUNT(*) FROM public.tb_app_segment_projections
UNION ALL
SELECT 'Auto-Discovered Segments', COUNT(*) FROM public.tb_app_autodiscovered_segments
UNION ALL
SELECT 'Segment Insights', COUNT(*) FROM public.tb_app_segment_insights;