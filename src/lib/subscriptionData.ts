// src/lib/subscriptionData.ts
import { supabase } from './supabase'

// Org ID for demo data (replace with dynamic org_id from auth later)
const DEMO_ORG_ID = 'd4f7e485-b4e0-4d43-adac-8c7496f134d2'

/**
 * Fetch main subscription KPIs (for the 4 cards at the top)
 */
export async function getSubscriptionKPIs() {
  const { data, error } = await supabase
    .from('tb_app_subscription_metrics')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching subscription KPIs:', error)
    return null
  }

  return {
    activeSubscriptions: data.active_subscriptions,
    activeSubscriptionsChange: data.active_subscriptions_change_pct,
    mrr: data.mrr,
    mrrChange: data.mrr_change_pct,
    arpu: data.arpu,
    arpuChange: data.arpu_change_pct,
    churnRate: data.churn_rate,
    churnRateChange: data.churn_rate_change_pct,
  }
}

/**
 * Fetch subscription growth trends (for the time series chart)
 */
export async function getSubscriptionGrowthData() {
  const { data, error } = await supabase
    .from('tb_app_subscription_trends')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('month_date', { ascending: true })

  if (error) {
    console.error('Error fetching subscription trends:', error)
    return []
  }

  return data.map(row => ({
    month: new Date(row.month_date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    totalSubscriptions: row.total_subscriptions,
    newSubscriptions: row.new_subscriptions,
    churnedSubscriptions: row.churned_subscriptions,
    mrr: row.mrr,
    churnRate: row.churn_rate,
  }))
}

/**
 * Fetch revenue & churn rate data (for the combined chart)
 */
export async function getRevenueChurnData() {
  const { data, error } = await supabase
    .from('tb_app_subscription_trends')
    .select('month_date, mrr, churn_rate')
    .eq('org_id', DEMO_ORG_ID)
    .order('month_date', { ascending: true })

  if (error) {
    console.error('Error fetching revenue/churn data:', error)
    return []
  }

  return data.map(row => ({
    month: new Date(row.month_date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    mrr: row.mrr,
    churnRate: row.churn_rate,
  }))
}

/**
 * Fetch plan breakdown data (Basic, Pro, Enterprise cards)
 */
export async function getPlanBreakdownData() {
  const { data, error } = await supabase
    .from('tb_app_subscription_metrics')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching plan breakdown:', error)
    return []
  }

  return [
    {
      plan: 'Basic',
      customers: data.basic_customers,
      revenue: data.basic_revenue,
      avgRevenue: data.basic_avg_revenue,
      churnRate: data.basic_churn_rate,
      growth: data.basic_growth_pct,
    },
    {
      plan: 'Pro',
      customers: data.pro_customers,
      revenue: data.pro_revenue,
      avgRevenue: data.pro_avg_revenue,
      churnRate: data.pro_churn_rate,
      growth: data.pro_growth_pct,
    },
    {
      plan: 'Enterprise',
      customers: data.enterprise_customers,
      revenue: data.enterprise_revenue,
      avgRevenue: data.enterprise_avg_revenue,
      churnRate: data.enterprise_churn_rate,
      growth: data.enterprise_growth_pct,
    },
  ]
}

/**
 * Fetch cohort retention data (for Cohort Analysis tab)
 */
export async function getCohortData() {
  const { data, error } = await supabase
    .from('tb_app_subscription_cohorts')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('cohort_month', { ascending: false })

  if (error) {
    console.error('Error fetching cohort data:', error)
    return []
  }

  return data.map(row => ({
    cohort: new Date(row.cohort_month).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    initialCustomers: row.initial_customers,
    totalRevenue: row.total_revenue,
    retention: [
      row.month_0_retention_pct,
      row.month_1_retention_pct,
      row.month_2_retention_pct,
      row.month_3_retention_pct,
      row.month_4_retention_pct,
      row.month_5_retention_pct,
      row.month_6_retention_pct,
      row.month_7_retention_pct,
      row.month_8_retention_pct,
      row.month_9_retention_pct,
      row.month_10_retention_pct,
      row.month_11_retention_pct,
    ].filter(val => val !== null), // Remove nulls for incomplete cohorts
  }))
}

/**
 * Fetch churn predictions (for Churn Prediction tab)
 */
export async function getChurnPredictions() {
  const { data, error } = await supabase
    .from('tb_app_churn_predictions')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('churn_probability', { ascending: false })

  if (error) {
    console.error('Error fetching churn predictions:', error)
    return []
  }

  return data.map(row => ({
    id: row.customer_id,
    name: row.customer_name,
    churnProbability: row.churn_probability,
    riskCategory: row.risk_category,
    lastLoginDays: row.last_login_days,
    supportTickets: row.support_tickets_count,
    usageScore: row.usage_score,
    plan: row.plan,
    monthsSubscribed: row.months_subscribed,
  }))
}

/**
 * Fetch churn model metrics (for model performance section)
 */
export async function getChurnModelMetrics() {
  const { data, error } = await supabase
    .from('tb_app_churn_model_metrics')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching churn model metrics:', error)
    return null
  }

  return {
    accuracy: data.accuracy_pct,
    precision: data.precision_pct,
    recall: data.recall_pct,
    f1Score: data.f1_score,
    featureImportance: data.feature_importance,
    totalAtRisk: data.total_at_risk,
    predictedChurn: data.predicted_churn_count,
    savedThisMonth: data.saved_this_month,
  }
}

/**
 * Fetch price sensitivity data (for Price Sensitivity tab)
 */
export async function getPriceSensitivityData() {
  const { data, error } = await supabase
    .from('tb_app_price_sensitivity')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching price sensitivity:', error)
    return []
  }

  return data.map(row => ({
    price: row.price,
    demand: row.demand,
    revenue: row.revenue,
    acceptanceRate: row.acceptance_rate,
    isOptimal: row.is_optimal_price,
    isIndifference: row.is_indifference_point,
  }))
}

/**
 * Fetch AARRR funnel metrics (for AARRR Funnel tab)
 */
export async function getAARRRFunnelData() {
  const { data, error } = await supabase
    .from('tb_app_aarrr_funnel')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching AARRR funnel:', error)
    return null
  }

  return {
    acquisition: {
      value: data.acquisition_value,
      change: data.acquisition_change_pct,
    },
    activation: {
      value: data.activation_value,
      change: data.activation_change_pct,
    },
    retention: {
      value: data.retention_value,
      change: data.retention_change_pct,
    },
    referral: {
      value: data.referral_value,
      change: data.referral_change_pct,
    },
    revenue: {
      value: data.revenue_value,
      change: data.revenue_change_pct,
    },
    conversionRates: {
      visitorsToSignups: data.visitors_to_signups_pct,
      signupsToActivated: data.signups_to_activated_pct,
      activatedToRetained: data.activated_to_retained_pct,
      retainedToReferring: data.retained_to_referring_pct,
      retainedToPaying: data.retained_to_paying_pct,
    },
    revenueOptimization: {
      arpu: data.arpu,
      expansionMrr: data.expansion_mrr,
      upsellOpportunities: data.upsell_opportunities,
    },
  }
}

/**
 * Fetch acquisition channels (for AARRR Funnel tab)
 */
export async function getAcquisitionChannels() {
  const { data, error } = await supabase
    .from('tb_app_acquisition_channels')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('roi', { ascending: false })

  if (error) {
    console.error('Error fetching acquisition channels:', error)
    return []
  }

  return data.map(row => ({
    channel: row.channel_name,
    customers: row.customers,
    cost: row.cost,
    ltv: row.ltv,
    cac: row.cac,
    roi: row.roi,
  }))
}

/**
 * Fetch customer interventions (for Recent Intervention Results)
 */
export async function getCustomerInterventions() {
  const { data, error } = await supabase
    .from('tb_app_customer_interventions')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('intervention_date', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching customer interventions:', error)
    return []
  }

  return data.map(row => ({
    customer: row.customer_name,
    risk: row.risk_level,
    intervention: row.intervention_type,
    date: new Date(row.intervention_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }),
    result: row.result,
  }))
}

/**
 * Fetch pricing analysis (for Van Westendorp Results)
 */
export async function getPricingAnalysis() {
  const { data, error } = await supabase
    .from('tb_app_pricing_analysis')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching pricing analysis:', error)
    return {
      recommendations: [],
      westendorpResults: {
        cheapness: 0,
        expensiveness: 0,
        optimal: 0,
        indifference: 0,
      }
    }
  }

  const recommendations = data.map(row => ({
    title: `${row.plan_type} Plan Pricing`,
    description: `Current: $${row.current_price}. Optimal: $${row.recommended_price}. Potential lift: ${row.potential_revenue_lift_pct}%`,
    color: row.plan_type === 'Basic' ? 'blue' : row.plan_type === 'Pro' ? 'green' : 'purple'
  }))

  // Use Basic plan for Van Westendorp display
  const basicPlan = data.find(d => d.plan_type === 'Basic') || data[0]

  return {
    recommendations,
    westendorpResults: {
      cheapness: basicPlan.point_marginal_cheapness,
      expensiveness: basicPlan.point_marginal_expensiveness,
      optimal: basicPlan.optimal_price_point,
      indifference: basicPlan.indifference_price_point,
    }
  }
}

/**
 * Fetch revenue distribution (for Revenue Concentration)
 */
export async function getRevenueDistribution() {
  const { data, error } = await supabase
    .from('tb_app_revenue_distribution')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching revenue distribution:', error)
    return null
  }

  return {
    top1Pct: data.top_1_pct_revenue_pct,
    top5Pct: data.top_5_pct_revenue_pct,
    top10Pct: data.top_10_pct_revenue_pct,
    top20Pct: data.top_20_pct_revenue_pct,
    zipfExponent: data.zipf_exponent,
    zipfRSquared: data.zipf_r_squared,
    shannonEntropy: data.shannon_entropy,
    giniCoefficient: data.gini_coefficient,
    top1PctCustomers: data.top_1_pct_customers,
    top5PctCustomers: data.top_5_pct_customers,
    top10PctCustomers: data.top_10_pct_customers,
    top20PctCustomers: data.top_20_pct_customers,
  }
}