// src/lib/revenueData.ts
import { supabase } from './supabase'

const DEMO_ORG_ID = 'd4f7e485-b4e0-4d43-adac-8c7496f134d2'

/**
 * Fetch main revenue KPIs
 */
export async function getRevenueKPIs() {
  // Get latest month for current metrics
  const { data: latestData, error: latestError } = await supabase
    .from('tb_app_revenue_metrics')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (latestError) {
    console.error('Error fetching latest revenue KPIs:', latestError)
    return null
  }

  // Get all months for YTD calculation
  const { data: allMonths, error: allMonthsError } = await supabase
    .from('tb_app_revenue_metrics')
    .select('total_revenue, snapshot_date')
    .eq('org_id', DEMO_ORG_ID)
    .gte('snapshot_date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
    .order('snapshot_date', { ascending: true })

  if (allMonthsError) {
    console.error('Error fetching YTD revenue:', allMonthsError)
    return null
  }

  // Calculate YTD Total Revenue (sum of all months this year)
  const ytdTotalRevenue = allMonths.reduce((sum, month) => sum + parseFloat(month.total_revenue), 0)

  // Calculate YTD growth by comparing to previous period
  const currentYearMonths = allMonths.length
  const { data: lastYearData, error: lastYearError } = await supabase
    .from('tb_app_revenue_metrics')
    .select('total_revenue')
    .eq('org_id', DEMO_ORG_ID)
    .lt('snapshot_date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
    .order('snapshot_date', { ascending: false })
    .limit(currentYearMonths)

  let revenueGrowth = 0
  if (!lastYearError && lastYearData && lastYearData.length > 0) {
    const lastYearTotal = lastYearData.reduce((sum, month) => sum + parseFloat(month.total_revenue), 0)
    if (lastYearTotal > 0) {
      revenueGrowth = ((ytdTotalRevenue - lastYearTotal) / lastYearTotal) * 100
    }
  } else {
    // If no prior year data, use month-over-month from latest
    revenueGrowth = latestData.revenue_growth_pct || 0
  }

  return {
    totalRevenue: ytdTotalRevenue, // YTD sum
    revenueGrowth: revenueGrowth,
    arr: latestData.arr,
    nrr: latestData.nrr_pct,
    rqi: latestData.revenue_quality_index,
    predictability: latestData.revenue_predictability_pct,
    recurringRevenue: latestData.recurring_revenue,
    onetimeRevenue: latestData.onetime_revenue,
    recurringPct: latestData.recurring_pct,
  }
}

/**
 * Fetch revenue time series (all months)
 */
export async function getRevenueTimeSeries() {
  const { data, error } = await supabase
    .from('tb_app_revenue_metrics')
    .select('snapshot_date, total_revenue, recurring_revenue, onetime_revenue, revenue_quality_index, revenue_growth_pct, arr, nrr_pct, revenue_predictability_pct')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: true })

  if (error) {
    console.error('Error fetching revenue time series:', error)
    return []
  }

  // Calculate volatility from growth rates
  const growthRates = data.map(row => row.revenue_growth_pct || 0).filter(rate => rate !== 0)
  const avgGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
  const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - avgGrowth, 2), 0) / growthRates.length
  const volatility = Math.sqrt(variance)

  return data.map((row, index) => ({
    month: new Date(row.snapshot_date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    totalRevenue: row.total_revenue,
    recurringRevenue: row.recurring_revenue,
    oneTimeRevenue: row.onetime_revenue,
    rqi: row.revenue_quality_index,
    growthRate: row.revenue_growth_pct || 0,
    volatility: volatility,
    arr: row.arr,
    nrr: row.nrr_pct,
    predictability: row.revenue_predictability_pct,
    // Add calculated fields that the component might expect
    revenue: row.total_revenue,
    date: new Date(row.snapshot_date),
  }))
}

/**
 * Fetch revenue by segment
 */
export async function getRevenueBySegment() {
  const { data, error } = await supabase
    .from('tb_app_revenue_by_segment')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('month_date', { ascending: true })

  if (error) {
    console.error('Error fetching revenue by segment:', error)
    return []
  }

  // Group by month
  const byMonth: any = {}
  data.forEach(row => {
    const month = new Date(row.month_date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
    if (!byMonth[month]) {
      byMonth[month] = { month }
    }
    byMonth[month][row.segment_name] = row.revenue
  })

  return Object.values(byMonth)
}

/**
 * Fetch revenue concentration data
 */
export async function getRevenueConcentration() {
  const { data, error } = await supabase
    .from('tb_app_revenue_concentration')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching revenue concentration:', error)
    return null
  }

  return {
    top10PctRevenue: data.top_10_pct_revenue,
    top20PctRevenue: data.top_20_pct_revenue,
    giniCoefficient: data.gini_coefficient,
    herfindahlIndex: data.herfindahl_index,
    concentrationRiskScore: data.concentration_risk_score,
    diversificationIndex: data.diversification_index,
  }
}

/**
 * Fetch revenue forecast
 */
export async function getRevenueForecast() {
  const { data, error } = await supabase
    .from('tb_app_revenue_forecast')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .eq('model_type', 'ARIMA')
    .order('forecast_month', { ascending: true })

  if (error) {
    console.error('Error fetching revenue forecast:', error)
    return []
  }

  return data.map(row => ({
    month: new Date(row.forecast_month).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    forecast: row.forecast_revenue,
    lowerBound: row.lower_bound,
    upperBound: row.upper_bound,
    confidence: row.confidence_interval,
  }))
}

/**
 * Fetch all forecast models for comparison
 */
export async function getAllForecastModels() {
  const { data, error } = await supabase
    .from('tb_app_revenue_forecast')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('forecast_month', { ascending: true })

  if (error) {
    console.error('Error fetching forecast models:', error)
    return []
  }

  // Group by month, then by model
  const byMonth: any = {}
  data.forEach(row => {
    const month = new Date(row.forecast_month).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
    if (!byMonth[month]) {
      byMonth[month] = { month }
    }
    const modelKey = row.model_type.toLowerCase().replace(' ', '_')
    byMonth[month][modelKey] = row.forecast_revenue
    byMonth[month][`${modelKey}_lower`] = row.lower_bound
    byMonth[month][`${modelKey}_upper`] = row.upper_bound
  })

  return Object.values(byMonth)
}

/**
 * Fetch revenue distribution for concentration analysis
 */
export async function getRevenueDistributionData() {
  const { data, error } = await supabase
    .from('tb_app_revenue_distribution')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching revenue distribution:', error)
    return {
      concentrationData: [],
      zipfData: { rSquared: 0, exponent: 0 },
      entropyData: { 
        entropy: 0, 
        diversificationIndex: 0, 
        gini: 0,
        segmentRevenue: []
      }
    }
  }

  // Get segment data for entropy calculation
  const { data: segmentData } = await supabase
    .from('tb_app_revenue_by_segment')
    .select('segment_name, revenue')
    .eq('org_id', DEMO_ORG_ID)
    .order('month_date', { ascending: false })
    .limit(4)

  const segmentRevenue = segmentData ? segmentData.map(s => ({
    segment: s.segment_name,
    revenue: s.revenue
  })) : []

  return {
    concentrationData: [
      { percentile: 'Top 1%', customers: data.top_1_pct_customers, revenue: data.top_1_pct_revenue_pct },
      { percentile: 'Top 5%', customers: data.top_5_pct_customers, revenue: data.top_5_pct_revenue_pct },
      { percentile: 'Top 10%', customers: data.top_10_pct_customers, revenue: data.top_10_pct_revenue_pct },
      { percentile: 'Top 20%', customers: data.top_20_pct_customers, revenue: data.top_20_pct_revenue_pct },
    ],
    zipfData: {
      rSquared: data.zipf_r_squared,
      exponent: data.zipf_exponent
    },
    entropyData: {
      entropy: data.shannon_entropy,
      diversificationIndex: data.gini_coefficient,
      gini: data.gini_coefficient,
      segmentRevenue: segmentRevenue
    }
  }
}