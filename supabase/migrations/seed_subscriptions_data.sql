-- ============================================================================
-- SEED DATA FOR SUBSCRIPTIONS PAGE METRICS
-- Plan-alytics Demo Data
-- 
-- Growth Story: $800K → $1.16M MRR over 12 months (45% growth)
-- Org ID: d4f7e485-b4e0-4d43-adac-8c7496f134d2
-- 
-- Narrative: SaaS company scaling from early PMF to growth stage
-- Q1: Healthy fundamentals, organic growth
-- Q2: Scaling challenges, churn increases
-- Q3: Optimization & retention focus
-- Q4: Strong finish, improved unit economics
-- ============================================================================

-- ============================================================================
-- TABLE 1: MAIN SUBSCRIPTION METRICS (Monthly snapshots)
-- ============================================================================

INSERT INTO app.tb_app_subscription_metrics (
  org_id, snapshot_date,
  active_subscriptions, active_subscriptions_change_pct,
  mrr, mrr_change_pct,
  arpu, arpu_change_pct,
  churn_rate, churn_rate_change_pct,
  basic_customers, basic_revenue, basic_avg_revenue, basic_churn_rate, basic_growth_pct,
  pro_customers, pro_revenue, pro_avg_revenue, pro_churn_rate, pro_growth_pct,
  enterprise_customers, enterprise_revenue, enterprise_avg_revenue, enterprise_churn_rate, enterprise_growth_pct
) VALUES
-- January 2025 (Baseline)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-01-31',
 5882, NULL, 800000, NULL, 136, NULL, 5.8, NULL,
 3530, 212000, 60, 6.2, NULL,
 1765, 353000, 200, 5.5, NULL,
 587, 235000, 400, 4.8, NULL),

-- February 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-02-28',
 6094, 3.6, 830000, 3.8, 136, 0.0, 5.9, 1.7,
 3648, 219000, 60, 6.3, 3.3,
 1829, 366000, 200, 5.6, 3.6,
 617, 245000, 397, 4.9, 5.1),

-- March 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-03-31',
 6318, 3.7, 865000, 4.2, 137, 0.7, 6.0, 1.7,
 3780, 227000, 60, 6.4, 3.6,
 1895, 379000, 200, 5.7, 3.6,
 643, 259000, 403, 5.0, 4.2),

-- April 2025 (Scaling phase begins)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-04-30',
 6558, 3.8, 905000, 4.6, 138, 0.7, 6.2, 3.3,
 3924, 235000, 60, 6.6, 3.8,
 1965, 393000, 200, 5.9, 3.7,
 669, 277000, 414, 5.1, 4.0),

-- May 2025 (Growing pains)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-05-31',
 6812, 3.9, 945000, 4.4, 139, 0.7, 6.4, 3.2,
 4074, 244000, 60, 6.8, 3.8,
 2038, 408000, 200, 6.1, 3.7,
 700, 293000, 419, 5.3, 4.6),

-- June 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-06-30',
 7082, 4.0, 988000, 4.6, 139, 0.0, 6.5, 1.6,
 4236, 254000, 60, 7.0, 4.0,
 2118, 424000, 200, 6.2, 3.9,
 728, 310000, 426, 5.4, 4.0),

-- July 2025 (Optimization begins)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-07-31',
 7347, 3.7, 1028000, 4.0, 140, 0.7, 6.4, -1.5,
 4394, 264000, 60, 6.9, 3.7,
 2204, 441000, 200, 6.1, 4.1,
 749, 323000, 431, 5.3, 2.9),

-- August 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-08-31',
 7629, 3.8, 1071000, 4.2, 140, 0.0, 6.3, -1.6,
 4564, 274000, 60, 6.8, 3.9,
 2290, 458000, 200, 6.0, 3.9,
 775, 339000, 437, 5.2, 3.5),

-- September 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-09-30',
 7918, 3.8, 1113000, 3.9, 141, 0.7, 6.2, -1.6,
 4740, 284000, 60, 6.7, 3.9,
 2375, 475000, 200, 5.9, 3.7,
 803, 354000, 441, 5.1, 3.6),

-- October 2025 (Strong finish begins)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-10-31',
 8165, 3.1, 1150000, 3.3, 141, 0.0, 6.1, -1.6,
 4888, 293000, 60, 6.6, 3.1,
 2448, 490000, 200, 5.8, 3.1,
 829, 367000, 443, 5.0, 3.2),

-- November 2025
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-11-30',
 8347, 2.2, 1158000, 0.7, 139, -1.4, 6.0, -1.6,
 4998, 300000, 60, 6.5, 2.3,
 2499, 500000, 200, 5.7, 2.1,
 850, 358000, 421, 4.9, 2.5),

-- December 2025 (Current)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31',
 8529, 2.2, 1163000, 0.4, 136, -2.2, 5.9, -1.7,
 5106, 306000, 60, 6.4, 2.2,
 2559, 512000, 200, 5.6, 2.4,
 864, 345000, 399, 4.8, 1.6);

-- ============================================================================
-- TABLE 2: SUBSCRIPTION TRENDS (Time series for charts)
-- ============================================================================

INSERT INTO app.tb_app_subscription_trends (
  org_id, month_date,
  total_subscriptions, new_subscriptions, churned_subscriptions,
  mrr, churn_rate
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-01-01', 5882, 385, 341, 800000, 5.8),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-02-01', 6094, 398, 360, 830000, 5.9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-03-01', 6318, 413, 379, 865000, 6.0),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-04-01', 6558, 429, 407, 905000, 6.2),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-05-01', 6812, 446, 436, 945000, 6.4),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-06-01', 7082, 464, 460, 988000, 6.5),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-07-01', 7347, 482, 470, 1028000, 6.4),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-08-01', 7629, 500, 481, 1071000, 6.3),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-09-01', 7918, 519, 491, 1113000, 6.2),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-10-01', 8165, 536, 498, 1150000, 6.1),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-11-01', 8347, 502, 501, 1158000, 6.0),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-01', 8529, 518, 503, 1163000, 5.9);

-- ============================================================================
-- TABLE 3: COHORT ANALYSIS (12 cohorts, 12 months retention each)
-- ============================================================================

INSERT INTO app.tb_app_subscription_cohorts (
  org_id, cohort_month, initial_customers, total_revenue,
  month_0_retention_pct, month_1_retention_pct, month_2_retention_pct,
  month_3_retention_pct, month_4_retention_pct, month_5_retention_pct,
  month_6_retention_pct, month_7_retention_pct, month_8_retention_pct,
  month_9_retention_pct, month_10_retention_pct, month_11_retention_pct
) VALUES
-- Jan 2025 cohort (oldest, most complete data)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-01-01', 385, 52360,
 100.00, 94.20, 90.13, 87.01, 84.42, 82.08, 79.74, 77.66, 75.84, 74.29, 72.99, 71.95),

-- Feb 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-02-01', 398, 54148,
 100.00, 94.10, 89.95, 86.68, 83.92, 81.41, 79.15, 77.14, 75.38, 73.87, 72.61, NULL),

-- Mar 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-03-01', 413, 56176,
 100.00, 94.00, 89.83, 86.44, 83.54, 80.87, 78.45, 76.27, 74.34, 72.64, NULL, NULL),

-- Apr 2025 cohort (scaling phase, slightly worse retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-04-01', 429, 58364,
 100.00, 93.70, 89.28, 85.55, 82.28, 79.35, 76.69, 74.29, 72.14, NULL, NULL, NULL),

-- May 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-05-01', 446, 60674,
 100.00, 93.60, 89.01, 85.11, 81.66, 78.57, 75.78, 73.26, NULL, NULL, NULL, NULL),

-- Jun 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-06-01', 464, 63124,
 100.00, 93.50, 88.79, 84.70, 81.09, 77.85, 74.92, NULL, NULL, NULL, NULL, NULL),

-- Jul 2025 cohort (optimization begins, improving retention)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-07-01', 482, 65576,
 100.00, 93.80, 89.21, 85.27, 81.81, 78.72, NULL, NULL, NULL, NULL, NULL, NULL),

-- Aug 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-08-01', 500, 68000,
 100.00, 94.00, 89.52, 85.71, 82.32, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- Sep 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-09-01', 519, 70584,
 100.00, 94.20, 89.79, 86.09, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- Oct 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-10-01', 536, 72896,
 100.00, 94.40, 90.11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- Nov 2025 cohort
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-11-01', 502, 68272,
 100.00, 94.60, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- Dec 2025 cohort (newest)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-01', 518, 70448,
 100.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ============================================================================
-- TABLE 4: CHURN PREDICTIONS (Current snapshot - 50 at-risk customers)
-- ============================================================================

INSERT INTO app.tb_app_churn_predictions (
  org_id, customer_id, snapshot_date,
  customer_name, churn_probability, risk_category,
  last_login_days, support_tickets_count, usage_score, plan, months_subscribed
) VALUES
-- High Risk (15 customers)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Acme Corp', 0.8523, 'High', 45, 8, 23.5, 'Enterprise', 18),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'TechStart Inc', 0.8234, 'High', 38, 6, 31.2, 'Pro', 14),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'DataFlow Systems', 0.7998, 'High', 42, 9, 28.7, 'Enterprise', 22),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'CloudBridge LLC', 0.7845, 'High', 51, 7, 25.3, 'Pro', 16),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'NextGen Analytics', 0.7723, 'High', 36, 10, 32.8, 'Enterprise', 11),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Innovate Digital', 0.7612, 'High', 48, 5, 29.4, 'Pro', 19),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'SwiftCode Co', 0.7534, 'High', 33, 8, 34.1, 'Pro', 13),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Vertex Solutions', 0.7489, 'High', 44, 6, 27.9, 'Enterprise', 20),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Quantum Labs', 0.7401, 'High', 40, 9, 30.6, 'Pro', 15),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'MetricFlow Inc', 0.7356, 'High', 47, 7, 26.2, 'Enterprise', 17),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Synapse Tech', 0.7298, 'High', 35, 11, 33.5, 'Pro', 12),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Catalyst Ventures', 0.7245, 'High', 52, 8, 24.8, 'Enterprise', 21),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Fusion Apps', 0.7189, 'High', 39, 6, 31.7, 'Pro', 14),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Nexus Platform', 0.7134, 'High', 46, 10, 28.3, 'Enterprise', 19),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Prism Solutions', 0.7082, 'High', 34, 7, 32.9, 'Pro', 13),

-- Medium Risk (20 customers)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Apex Industries', 0.6845, 'Medium', 28, 5, 45.6, 'Pro', 9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Bright Future Co', 0.6734, 'Medium', 31, 4, 42.3, 'Basic', 11),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'CoreLogic Systems', 0.6623, 'Medium', 26, 6, 47.1, 'Pro', 8),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Dynamic Insights', 0.6512, 'Medium', 33, 5, 43.8, 'Enterprise', 10),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'EcoTech Partners', 0.6401, 'Medium', 29, 7, 44.5, 'Pro', 12),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Frontier Data', 0.6290, 'Medium', 24, 4, 48.9, 'Basic', 7),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'GrowthHack Inc', 0.6179, 'Medium', 32, 6, 41.2, 'Pro', 11),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Harbor Solutions', 0.6068, 'Medium', 27, 5, 46.7, 'Pro', 9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Insight Metrics', 0.5957, 'Medium', 30, 8, 43.4, 'Enterprise', 13),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Junction Labs', 0.5846, 'Medium', 25, 4, 49.2, 'Basic', 8),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Keystone Digital', 0.5735, 'Medium', 34, 7, 40.8, 'Pro', 14),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Lighthouse Tech', 0.5624, 'Medium', 28, 5, 45.1, 'Pro', 10),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Momentum Apps', 0.5513, 'Medium', 31, 6, 42.6, 'Enterprise', 12),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Navigator Systems', 0.5402, 'Medium', 26, 4, 47.8, 'Basic', 9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Orbit Solutions', 0.5291, 'Medium', 29, 7, 44.3, 'Pro', 11),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Pinnacle Data', 0.5180, 'Medium', 23, 5, 50.1, 'Pro', 7),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Quest Analytics', 0.5069, 'Medium', 32, 8, 41.5, 'Enterprise', 13),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Ripple Tech', 0.4958, 'Medium', 27, 4, 46.9, 'Basic', 10),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Summit Partners', 0.4847, 'Medium', 30, 6, 43.7, 'Pro', 12),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Threshold Labs', 0.4736, 'Medium', 24, 5, 48.4, 'Pro', 8),

-- Low Risk (15 customers)
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Unity Platforms', 0.3512, 'Low', 15, 2, 67.8, 'Enterprise', 6),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Velocity Apps', 0.3401, 'Low', 18, 3, 64.2, 'Pro', 7),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Wavelength Co', 0.3290, 'Low', 12, 1, 71.5, 'Pro', 5),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Xcelerate Tech', 0.3179, 'Low', 20, 4, 62.9, 'Enterprise', 8),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Zenith Solutions', 0.3068, 'Low', 16, 2, 68.7, 'Pro', 6),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Alpha Metrics', 0.2957, 'Low', 14, 3, 69.3, 'Basic', 9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Beacon Digital', 0.2846, 'Low', 19, 2, 65.1, 'Pro', 7),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Cascade Systems', 0.2735, 'Low', 13, 1, 72.8, 'Enterprise', 5),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Delta Insights', 0.2624, 'Low', 17, 4, 66.4, 'Pro', 8),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Elevate Partners', 0.2513, 'Low', 11, 2, 74.2, 'Basic', 4),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Forge Analytics', 0.2402, 'Low', 21, 3, 63.7, 'Enterprise', 9),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Gateway Tech', 0.2291, 'Low', 15, 1, 70.5, 'Pro', 6),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Horizon Labs', 0.2180, 'Low', 18, 4, 65.9, 'Pro', 7),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Impact Solutions', 0.2069, 'Low', 12, 2, 73.1, 'Enterprise', 5),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', gen_random_uuid(), '2025-12-31', 'Journey Apps', 0.1958, 'Low', 16, 3, 67.6, 'Basic', 8);

-- ============================================================================
-- TABLE 5: CHURN MODEL METRICS
-- ============================================================================

INSERT INTO app.tb_app_churn_model_metrics (
  org_id, snapshot_date,
  accuracy_pct, precision_pct, recall_pct, f1_score,
  feature_importance, total_at_risk, predicted_churn_count, saved_this_month
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31',
 87.3, 84.2, 89.1, 0.8665,
 '[
   {"feature": "usage_score", "importance": 0.342, "trend": "stable"},
   {"feature": "last_login_days", "importance": 0.278, "trend": "up"},
   {"feature": "support_tickets", "importance": 0.196, "trend": "down"},
   {"feature": "months_subscribed", "importance": 0.184, "trend": "stable"}
 ]'::jsonb,
 503, 298, 67);

-- ============================================================================
-- TABLE 6: PRICE SENSITIVITY ANALYSIS
-- ============================================================================

INSERT INTO app.tb_app_price_sensitivity (
  org_id, snapshot_date, price, demand, revenue, acceptance_rate,
  is_optimal_price, is_indifference_point
) VALUES
-- Basic tier price points
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 49, 6200, 303800, 88.5, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 59, 5400, 318600, 77.1, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 69, 4850, 334650, 69.3, TRUE, FALSE),  -- Optimal for Basic
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 79, 4200, 331800, 60.0, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 89, 3600, 320400, 51.4, FALSE, FALSE),

-- Pro tier price points
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 149, 3100, 461900, 88.6, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 179, 2750, 492250, 78.6, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 199, 2580, 513420, 73.7, FALSE, TRUE),  -- Indifference point
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 219, 2400, 525600, 68.6, TRUE, FALSE),  -- Optimal for Pro
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 249, 2100, 522900, 60.0, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 279, 1800, 502200, 51.4, FALSE, FALSE),

-- Enterprise tier price points
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 349, 1050, 366450, 87.5, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 399, 950, 379050, 79.2, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 449, 880, 395120, 73.3, TRUE, FALSE),  -- Optimal for Enterprise
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 499, 800, 399200, 66.7, FALSE, FALSE),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 549, 720, 395280, 60.0, FALSE, FALSE);

-- ============================================================================
-- TABLE 7: AARRR FUNNEL METRICS
-- ============================================================================

INSERT INTO app.tb_app_aarrr_funnel (
  org_id, snapshot_date,
  acquisition_value, acquisition_change_pct,
  activation_value, activation_change_pct,
  retention_value, retention_change_pct,
  referral_value, referral_change_pct,
  revenue_value, revenue_change_pct,
  visitors_to_signups_pct, signups_to_activated_pct,
  activated_to_retained_pct, retained_to_referring_pct,
  retained_to_paying_pct,
  arpu, expansion_mrr, upsell_opportunities
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31',
 8529, 2.2,     -- Acquisition (total signups)
 7382, 3.1,     -- Activation (completed onboarding)
 6950, 2.8,     -- Retention (30-day active)
 1821, 5.2,     -- Referral (referred others)
 1163000, 0.4,  -- Revenue (MRR)
 12.4,          -- 12.4% visitor to signup conversion
 86.6,          -- 86.6% signup to activated
 94.1,          -- 94.1% activated to retained
 26.2,          -- 26.2% retained referring
 81.5,          -- 81.5% retained paying
 136.35,        -- ARPU
 58150,         -- Expansion MRR this month
 342);          -- Upsell opportunities identified

-- ============================================================================
-- TABLE 8: ACQUISITION CHANNELS
-- ============================================================================

INSERT INTO app.tb_app_acquisition_channels (
  org_id, snapshot_date, channel_name, customers, cost, ltv, cac, roi
) VALUES
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Organic Search', 2130, 12500, 1842, 5.87, 147.36),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Content Marketing', 1704, 28000, 1956, 16.43, 69.85),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Paid Search', 1364, 95000, 1728, 69.66, 18.19),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Paid Social', 1108, 87000, 1614, 78.52, 14.55),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Referral', 853, 8500, 2184, 9.97, 119.00),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Email Marketing', 682, 15000, 1890, 22.00, 58.90),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Direct', 426, 5000, 2340, 11.74, 99.32),
('d4f7e485-b4e0-4d43-adac-8c7496f134d2', '2025-12-31', 'Partnerships', 262, 42000, 2520, 160.31, 7.71);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check row counts
SELECT 'tb_app_subscription_metrics' as table_name, COUNT(*) as row_count FROM app.tb_app_subscription_metrics
UNION ALL
SELECT 'tb_app_subscription_trends', COUNT(*) FROM app.tb_app_subscription_trends
UNION ALL
SELECT 'tb_app_subscription_cohorts', COUNT(*) FROM app.tb_app_subscription_cohorts
UNION ALL
SELECT 'tb_app_churn_predictions', COUNT(*) FROM app.tb_app_churn_predictions
UNION ALL
SELECT 'tb_app_churn_model_metrics', COUNT(*) FROM app.tb_app_churn_model_metrics
UNION ALL
SELECT 'tb_app_price_sensitivity', COUNT(*) FROM app.tb_app_price_sensitivity
UNION ALL
SELECT 'tb_app_aarrr_funnel', COUNT(*) FROM app.tb_app_aarrr_funnel
UNION ALL
SELECT 'tb_app_acquisition_channels', COUNT(*) FROM app.tb_app_acquisition_channels
ORDER BY table_name;

-- Verify latest metrics
SELECT 
  snapshot_date,
  active_subscriptions,
  mrr,
  arpu,
  churn_rate
FROM app.tb_app_subscription_metrics
WHERE org_id = 'd4f7e485-b4e0-4d43-adac-8c7496f134d2'
ORDER BY snapshot_date DESC
LIMIT 1;