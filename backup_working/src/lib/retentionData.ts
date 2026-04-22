// src/lib/retentionData.ts - COMPLETE VERSION
import { supabase } from './supabase'

const DEMO_ORG_ID = 'd4f7e485-b4e0-4d43-adac-8c7496f134d2'

/**
 * TAB 1: SEGMENTS - User Segments Table
 */
export async function getUserSegmentsForTable() {
  const { data, error } = await supabase
    .from('tb_app_customer_segments')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .eq('segment_category', 'value-based')
    .order('avg_revenue_per_customer', { ascending: false })

  if (error) {
    console.error('Error fetching user segments:', error)
    return []
  }

  return data.map((row, idx) => ({
    id: row.segment_name.toLowerCase(),
    segment: row.segment_name,
    category: 'Value-Based',
    users: row.customer_count,
    clv: row.clv,
    retention: row.retention_rate,
    impact: Math.round(row.total_revenue / 1000), // in thousands
    date: new Date(2025, 0, 1 + idx).toISOString().split('T')[0],
    risk: row.risk_score > 40 ? 'High' : row.risk_score > 25 ? 'Medium' : 'Low',
  }))
}

/**
 * TAB 1: SEGMENTS - AI-Discovered Segments Table
 */
export async function getAutoDiscoveredSegmentsForTable() {
  const { data, error } = await supabase
    .from('tb_app_autodiscovered_segments')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('opportunity_score', { ascending: false })

  if (error) {
    console.error('Error fetching auto-discovered segments:', error)
    return []
  }

  return data.map((row, idx) => ({
    id: row.segment_id,
    label: row.segment_label,
    description: row.segment_description,
    category: 'behavioral',
    impactScore: row.opportunity_score,
    discoveredDate: new Date(2025, 11, 1 + idx).toISOString().split('T')[0],
    userCount: row.customer_count,
    avgCLV: row.avg_revenue * 24, // Monthly to 2-year CLV
    retentionRate: row.retention_rate,
    keyBehaviors: Object.entries(row.defining_behaviors).slice(0, 3).map(([k, v]) => `${k}: ${v}`),
  }))
}

/**
 * TAB 1: SEGMENTS - Pie Chart Data
 */
export async function getSegmentChartData() {
  const { data, error } = await supabase
    .from('tb_app_customer_segments')
    .select('segment_name, total_revenue, customer_count')
    .eq('org_id', DEMO_ORG_ID)
    .eq('segment_category', 'value-based')

  if (error) {
    console.error('Error fetching chart data:', error)
    return []
  }

  return data.map(row => ({
    segment: row.segment_name,
    value: row.total_revenue,
    users: row.customer_count,
  }))
}

/**
 * TAB 2: RETENTION STRATEGY - Complete segments data structure
 */
export async function getCompleteSegmentsData() {
  // Get all segment categories
  const { data: segments, error } = await supabase
    .from('tb_app_customer_segments')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)

  if (error) {
    console.error('Error fetching complete segments:', error)
    return {}
  }

  // Group by category
  const categories: any = {}
  
  segments.forEach(seg => {
    const category = seg.segment_category
    if (!categories[category]) {
      categories[category] = {
        name: category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `Customer segmentation based on ${category.replace('-', ' ')}`,
        segments: []
      }
    }
    
    // Create segment with sub-segments (risk-based stratification)
    const segment = {
      id: seg.segment_name.toLowerCase(),
      name: seg.segment_name,
      totalCustomers: seg.customer_count,
      avgMrr: Math.round(seg.avg_revenue_per_customer),
      retentionRate: seg.retention_rate,
      subSegments: [
        {
          id: `${seg.segment_name.toLowerCase()}-high-risk`,
          name: `${seg.segment_name} - High Risk`,
          customers: Math.round(seg.customer_count * 0.15),
          riskLevel: 'high',
          recommendedEffort: 'high',
          intervention: 'white-glove-service'
        },
        {
          id: `${seg.segment_name.toLowerCase()}-medium-risk`,
          name: `${seg.segment_name} - Medium Risk`,
          customers: Math.round(seg.customer_count * 0.30),
          riskLevel: 'medium',
          recommendedEffort: 'medium',
          intervention: 'proactive-engagement'
        },
        {
          id: `${seg.segment_name.toLowerCase()}-low-risk`,
          name: `${seg.segment_name} - Low Risk`,
          customers: Math.round(seg.customer_count * 0.55),
          riskLevel: 'low',
          recommendedEffort: 'low',
          intervention: 'automated-nurture'
        }
      ]
    }
    
    categories[category].segments.push(segment)
  })

  return categories
}

/**
 * TAB 3: INVESTMENT ANALYSIS - Investment data
 */
export async function getInvestmentData() {
  const { data, error } = await supabase
    .from('tb_app_intervention_strategies')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)

  if (error) {
    console.error('Error fetching investment data:', error)
    return []
  }

  // Create investment breakdown by segment and sub-segment
  const investments: any[] = []
  
  data.forEach(strategy => {
    const subSegments = ['High Risk', 'Medium Risk', 'Low Risk']
    const effortSplit = [0.5, 0.3, 0.2] // How investment is split across risk levels
    
    subSegments.forEach((subSeg, idx) => {
      investments.push({
        segment: strategy.segment_name,
        subSegment: `${strategy.segment_name} - ${subSeg}`,
        recommendedInvestment: Math.round(strategy.estimated_cost * effortSplit[idx]),
        expectedROI: strategy.roi,
        timeframe: '12 months'
      })
    })
  })

  return investments
}

/**
 * TAB 4: INTERVENTION PLAN - Intervention strategies
 */
export async function getInterventionStrategiesData() {
  const { data, error } = await supabase
    .from('tb_app_intervention_strategies')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('roi', { ascending: false })

  if (error) {
    console.error('Error fetching interventions:', error)
    return {}
  }

  const strategies: any = {}
  
  data.forEach(row => {
    const key = row.strategy_name.toLowerCase().replace(/\s+/g, '-')
    strategies[key] = {
      name: row.strategy_name,
      effort: row.effort_level.toLowerCase(),
      impact: row.expected_impact_pct,
      description: row.tactics.join(', '),
      roi: row.roi,
    }
  })

  return strategies
}

/**
 * Effort levels configuration
 */
export function getEffortLevels() {
  return {
    high: { label: 'High Touch', color: 'bg-red-100 text-red-800', icon: 'Crown' },
    medium: { label: 'Medium Touch', color: 'bg-yellow-100 text-yellow-800', icon: 'Star' },
    low: { label: 'Low Touch', color: 'bg-green-100 text-green-800', icon: 'Zap' }
  }
}

/**
 * Risk levels configuration
 */
export function getRiskLevels() {
  return {
    high: { label: 'High Risk', color: 'bg-red-100 text-red-800', icon: 'AlertTriangle' },
    medium: { label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800', icon: 'Activity' },
    low: { label: 'Low Risk', color: 'bg-green-100 text-green-800', icon: 'Shield' }
  }
}

/**
 * Get segment insights
 */
export async function getSegmentInsightsData() {
  const { data, error } = await supabase
    .from('tb_app_segment_insights')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .order('confidence_score', { ascending: false })

  if (error) {
    console.error('Error fetching insights:', error)
    return []
  }

  return data.map(row => ({
    id: `${row.segment_name}-${row.insight_type}`,
    segment: row.segment_name,
    type: row.insight_type,
    priority: row.priority,
    title: row.title,
    description: row.description,
    impact: row.potential_revenue_impact,
    confidence: row.confidence_score,
    actions: row.recommended_actions,
  }))
}

/**
 * Get forecast/projection data
 */
export async function getForecastData() {
  const { data, error } = await supabase
    .from('tb_app_segment_projections')
    .select('*')
    .eq('org_id', DEMO_ORG_ID)
    .eq('scenario', 'baseline')
    .order('forecast_month', { ascending: true })

  if (error) {
    console.error('Error fetching forecast:', error)
    return []
  }

  return data.map(row => ({
    month: new Date(row.forecast_month).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    segment: row.segment_name,
    customers: row.projected_customers,
    revenue: row.projected_revenue,
  }))
}