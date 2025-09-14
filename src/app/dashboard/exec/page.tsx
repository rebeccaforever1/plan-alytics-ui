'use client'

import React, { useMemo, useState } from 'react'
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts'

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Heart,
  AlertCircle,
  BarChart3,
  CreditCard,
  RefreshCw,
  Crown,
  Sparkles,
  Gem,
  Activity,
  ChevronDown
} from 'lucide-react'

// Seeded random for consistent data
const seededRandom = (seed) => {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Generate subscription data based on timeframe
const generateSubscriptionData = (timeframe) => {
  let seedCounter = 88888 + timeframe.length
  const random = () => seededRandom(seedCounter++)
  
  let periods, dataPoints, baseCustomers
  
  if (timeframe === 'weekly') {
    periods = Array.from({ length: 12 }, (_, i) => `W${i + 1}`)
    dataPoints = 12
    baseCustomers = 125000
  } else if (timeframe === 'monthly') {
    periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    dataPoints = 12
    baseCustomers = 135000
  } else if (timeframe === 'quarterly') {
    periods = ['Q1', 'Q2', 'Q3', 'Q4']
    dataPoints = 4
    baseCustomers = 145000
  } else { // YTD
    const currentMonth = new Date().getMonth()
    periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, currentMonth + 1)
    dataPoints = currentMonth + 1
    baseCustomers = 140000
  }
  
  return periods.slice(0, dataPoints).map((period, index) => {
    const trendMultiplier = 1 + (index * 0.02) // 2% growth trend
    
    // Base metrics
    const activeCustomers = Math.floor(baseCustomers * trendMultiplier + random() * 5000)
    const enrollments = Math.floor((15000 + random() * 5000) * trendMultiplier)
    const opportunities = Math.floor((8000 + random() * 3000) * trendMultiplier)
    const cancels = Math.floor((1200 + random() * 400) * trendMultiplier)
    const trialExpires = Math.floor((800 + random() * 300) * trendMultiplier)
    const conversions = Math.floor((6500 + random() * 2000) * trendMultiplier)
    const renewals = Math.floor((11000 + random() * 4000) * trendMultiplier)
    const revenue = (450000 + random() * 150000) * trendMultiplier
    
    // Derived metrics
    const losses = cancels + trialExpires
    const conversionRate = (conversions / enrollments) * 100
    const churnRate = (losses / activeCustomers) * 100
    
    return {
      period,
      activeCustomers,
      enrollments,
      opportunities,
      losses,
      cancels,
      trialExpires,
      conversions,
      conversionRate,
      renewals,
      revenue: revenue / 1000, // Convert to thousands for display
      churnRate
    }
  })
}

// Generate KPI summary data
const generateKPISummary = (timeframe, subscriptionData) => {
  let seedCounter = 99999
  const random = () => seededRandom(seedCounter++)
  
  const currentData = subscriptionData[subscriptionData.length - 1]
  const previousData = subscriptionData[subscriptionData.length - 2] || subscriptionData[0]
  
  // Calculate NRR (simplified)
  const expansionRevenue = currentData.revenue * 0.15 * (1 + random() * 0.1)
  const churnedRevenue = currentData.revenue * (currentData.churnRate / 100)
  const startingRevenue = previousData.revenue
  const nrr = ((startingRevenue + expansionRevenue - churnedRevenue) / startingRevenue) * 100
  
  // Calculate CLV (simplified)
  const avgRevenuePerUser = currentData.revenue * 1000 / currentData.activeCustomers
  const avgLifespanMonths = 24 + random() * 12
  const clv = avgRevenuePerUser * avgLifespanMonths
  
  // Calculate other KPIs
  const grr = 100 - currentData.churnRate
  const ltvCacRatio = 4.5 + random() * 1.5
  const cacPayback = 14 + random() * 6
  
  // Goals
  const nrrGoal = 110
  const clvGoal = 1200
  const grrGoal = 92
  const ltvCacGoal = 5.0
  const cacPaybackGoal = 12
  
  return {
    nrr: {
      value: nrr,
      goal: nrrGoal,
      trend: nrr - (subscriptionData.length > 1 ? ((subscriptionData[subscriptionData.length - 2]?.nrr || nrr - 2)) : nrr - 2)
    },
    clv: {
      value: clv,
      goal: clvGoal,
      trend: clv - (subscriptionData.length > 1 ? ((subscriptionData[subscriptionData.length - 2]?.clv || clv - 50)) : clv - 50)
    },
    grr: {
      value: grr,
      goal: grrGoal,
      trend: grr - (subscriptionData.length > 1 ? ((subscriptionData[subscriptionData.length - 2]?.grr || grr - 1)) : grr - 1)
    },
    ltvCacRatio: {
      value: ltvCacRatio,
      goal: ltvCacGoal,
      trend: ltvCacRatio - (subscriptionData.length > 1 ? ((subscriptionData[subscriptionData.length - 2]?.ltvCacRatio || ltvCacRatio - 0.3)) : ltvCacRatio - 0.3)
    },
    cacPayback: {
      value: cacPayback,
      goal: cacPaybackGoal,
      trend: cacPayback - (subscriptionData.length > 1 ? ((subscriptionData[subscriptionData.length - 2]?.cacPayback || cacPayback + 1)) : cacPayback + 1)
    },
    activeCustomers: currentData.activeCustomers,
    revenue: currentData.revenue * 1000,
    conversionRate: currentData.conversionRate,
    churnRate: currentData.churnRate
  }
}

// Generate additional metrics data
const generateAdditionalMetrics = (timeframe) => {
  let seedCounter = 77777
  const random = () => seededRandom(seedCounter++)
  
  // Customer Health & Behavior
  const mau = Math.floor(125000 + random() * 15000)
  const dau = Math.floor(85000 + random() * 10000)
  const adoptionRate = 62 + random() * 10
  const ttfv = 2.8 + random() * 1.2
  
  // Operational & Efficiency
  const supportTickets = Math.floor(1250 + random() * 350)
  const costToServe = 18.5 + random() * 6
  const fcr = 78 + random() * 8
  
  // Client Experience
  const nps = 45 + random() * 15
  const csat = 88 + random() * 6
  const ces = 2.4 + random() * 0.8
  
  return {
    mau, dau, adoptionRate, ttfv,
    supportTickets, costToServe, fcr,
    nps, csat, ces
  }
}

// Generate churn analysis data
const generateChurnAnalysis = (timeframe) => {
  let seedCounter = 66666
  const random = () => seededRandom(seedCounter++)
  
  let periods
  
  if (timeframe === 'weekly') {
    periods = Array.from({ length: 12 }, (_, i) => `W${i + 1}`)
  } else if (timeframe === 'monthly') {
    periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  } else if (timeframe === 'quarterly') {
    periods = ['Q1', 'Q2', 'Q3', 'Q4']
  } else { // YTD
    const currentMonth = new Date().getMonth()
    periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, currentMonth + 1)
  }
  
  return periods.map((period, i) => {
    return {
      period,
      price: 35 + random() * 10 - i * 0.5,
      features: 25 + random() * 8 - i * 0.3,
      competitor: 15 + random() * 5 + i * 0.2,
      service: 12 + random() * 4 - i * 0.1,
      usage: 8 + random() * 3 + i * 0.1,
      other: 5 + random() * 2 - i * 0.05
    }
  })
}

// Utility functions
const formatCurrency = (value, compact = true) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(compact ? 1 : 2)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(compact ? 0 : 1)}K`
  return `$${value.toFixed(0)}`
}

const formatNumber = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toFixed(0)
}

const formatPercentage = (value) => `${value.toFixed(1)}%`

const getTrendIndicator = (value) => {
  if (value > 0) {
    return { icon: ArrowUpRight, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' }
  } else if (value < 0) {
    return { icon: ArrowDownRight, color: 'text-rose-400', bgColor: 'bg-rose-400/10' }
  } else {
    return { icon: ArrowUpRight, color: 'text-gray-400', bgColor: 'bg-gray-400/10' }
  }
}

const getPerformanceColor = (value, goal, reverse = false) => {
  const percentage = (value / goal) * 100
  if (reverse) {
    if (percentage >= 100) return 'text-rose-400 bg-rose-400/10'
    if (percentage >= 90) return 'text-amber-400 bg-amber-400/10'
    return 'text-emerald-400 bg-emerald-400/10'
  } else {
    if (percentage >= 100) return 'text-emerald-400 bg-emerald-400/10'
    if (percentage >= 90) return 'text-amber-400 bg-amber-400/10'
    return 'text-rose-400 bg-rose-400/10'
  }
}

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
    {children}
  </h3>
)

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">
    {children}
  </p>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-blue-400/20 text-blue-300",
    success: "bg-emerald-400/20 text-emerald-300",
    warning: "bg-amber-400/20 text-amber-300",
    danger: "bg-rose-400/20 text-rose-300",
    neutral: "bg-gray-400/20 text-gray-300"
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

const MetricCard = ({ title, value, format = "number", trend, goal, reverseTrend = false, icon, className = "", size = "normal" }) => {
  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : ArrowUpRight
  const trendColor = trend > 0 ? "text-emerald-400" : trend < 0 ? "text-rose-400" : "text-gray-400"
  const goalPercentage = goal ? (value / goal) * 100 : null
  const goalVariant = goalPercentage >= 100 ? "success" : goalPercentage >= 90 ? "warning" : "danger"
  
  return (
    <Card className={`${className} relative overflow-hidden`}>
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-white rounded-full -mr-16 -mt-16 opacity-40"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-50 to-white rounded-full -ml-12 -mb-12 opacity-40"></div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className={`font-bold text-gray-900 mt-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>
              {format === "currency" ? formatCurrency(value) : 
               format === "percentage" ? formatPercentage(value) : 
               format === "number" ? formatNumber(value) : value}
            </div>
          </div>
          {icon && <div className="p-2 bg-blue-300/10 rounded-lg text-blue-400">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex justify-between items-center">
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${trendColor}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              {format === "percentage" ? `${Math.abs(trend).toFixed(1)}%` : 
               format === "currency" ? formatCurrency(Math.abs(trend), true) : 
               `${Math.abs(trend).toFixed(0)}`}
            </div>
          )}
          {goal && (
            <Badge variant={goalVariant}>
              Goal: {format === "currency" ? formatCurrency(goal, true) : 
                    format === "percentage" ? formatPercentage(goal) : 
                    format === "number" ? formatNumber(goal) : goal}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Timeframe selector component
const TimeframeSelector = ({ value, onChange }) => (
  <div className="flex bg-gray-100 p-1 rounded-lg">
    {['weekly', 'monthly', 'quarterly', 'ytd'].map((period) => (
      <button
        key={period}
        onClick={() => onChange(period)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
          value === period
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {period === 'ytd' ? 'YTD' : period}
      </button>
    ))}
  </div>
)

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('%') ? `${entry.value}%` : 
                          entry.name.includes('Revenue') ? formatCurrency(entry.value * 1000) : 
                          formatNumber(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Main Dashboard Component
const ExecutiveSubscriptionDashboard = () => {
  const [timeframe, setTimeframe] = useState('weekly')
  
  const subscriptionData = useMemo(() => generateSubscriptionData(timeframe), [timeframe])
  const kpiSummary = useMemo(() => generateKPISummary(timeframe, subscriptionData), [timeframe, subscriptionData])
  const additionalMetrics = useMemo(() => generateAdditionalMetrics(timeframe), [timeframe])
  const churnAnalysis = useMemo(() => generateChurnAnalysis(timeframe), [timeframe])
  
  const npsStatus = additionalMetrics.nps >= 50 ? "good" : additionalMetrics.nps >= 0 ? "neutral" : "poor"
  const npsColor = npsStatus === "good" ? "text-emerald-400" : npsStatus === "neutral" ? "text-amber-400" : "text-rose-400"

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Crown className="h-6 w-6 mr-2 text-blue-400" />
            Subscription Analytics Dashboard
          </h1>
          <p className="text-gray-600">Executive overview of subscription performance and retention metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          <button className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Top 6 KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard 
          title="Active Customers" 
          value={kpiSummary.activeCustomers} 
          format="number"
          trend={kpiSummary.activeCustomers - (subscriptionData.length > 1 ? subscriptionData[subscriptionData.length - 2].activeCustomers : kpiSummary.activeCustomers * 0.95)}
          icon={<Users className="h-5 w-5" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Revenue" 
          value={kpiSummary.revenue} 
          format="currency"
          trend={kpiSummary.revenue - (subscriptionData.length > 1 ? subscriptionData[subscriptionData.length - 2].revenue * 1000 : kpiSummary.revenue * 0.94)}
          icon={<DollarSign className="h-5 w-5" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={kpiSummary.conversionRate} 
          format="percentage"
          trend={kpiSummary.conversionRate - (subscriptionData.length > 1 ? subscriptionData[subscriptionData.length - 2].conversionRate : kpiSummary.conversionRate - 2)}
          icon={<RefreshCw className="h-5 w-5" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Churn Rate" 
          value={kpiSummary.churnRate} 
          format="percentage"
          trend={kpiSummary.churnRate - (subscriptionData.length > 1 ? subscriptionData[subscriptionData.length - 2].churnRate : kpiSummary.churnRate + 0.5)}
          reverseTrend={true}
          icon={<AlertCircle className="h-5 w-5" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Net Revenue Retention" 
          value={kpiSummary.nrr.value} 
          format="percentage"
          trend={kpiSummary.nrr.trend}
          goal={kpiSummary.nrr.goal}
          icon={<TrendingUp className="h-5 w-5" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Lifetime Value" 
          value={kpiSummary.clv.value} 
          format="currency"
          trend={kpiSummary.clv.trend}
          goal={kpiSummary.clv.goal}
          icon={<CreditCard className="h-5 w-5" />}
          className="col-span-1"
        />
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle><BarChart3 className="h-5 w-5 mr-2" /> Subscription Trends</CardTitle>
            <CardDescription>Active customers, enrollments, and conversions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={subscriptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="activeCustomers" fill="#3B82F6" name="Active Customers" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="enrollments" fill="#10B981" name="Enrollments" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="conversions" fill="#8B5CF6" name="Conversions" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#F59E0B" strokeWidth={2} name="Conversion Rate %" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle><Activity className="h-5 w-5 mr-2" /> Revenue & Churn Analysis</CardTitle>
            <CardDescription>Revenue performance alongside churn metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={subscriptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="losses" fill="#EF4444" name="Losses" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="churnRate" stroke="#F59E0B" strokeWidth={2} name="Churn Rate %" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary Metrics and Churn Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <MetricCard 
            title="Gross Revenue Retention" 
            value={kpiSummary.grr.value} 
            format="percentage"
            trend={kpiSummary.grr.trend}
            goal={kpiSummary.grr.goal}
            className="col-span-1"
          />
          <MetricCard 
            title="LTV:CAC Ratio" 
            value={kpiSummary.ltvCacRatio.value} 
            format="number"
            trend={kpiSummary.ltvCacRatio.trend}
            goal={kpiSummary.ltvCacRatio.goal}
            className="col-span-1"
          />
          <MetricCard 
            title="CAC Payback" 
            value={kpiSummary.cacPayback.value} 
            format="number"
            trend={kpiSummary.cacPayback.trend}
            goal={kpiSummary.cacPayback.goal}
            reverseTrend={true}
            className="col-span-1"
          />
          <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="text-gray-900 font-medium mb-3">Customer Health Score</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mr-3">
                  <Heart className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{additionalMetrics.nps}</div>
                  <div className="text-sm text-gray-600">NPS Score</div>
                </div>
              </div>
              <div className={`text-sm px-3 py-1 rounded-full ${npsColor} bg-opacity-10`}>
                {npsStatus === "good" ? "Excellent" : npsStatus === "neutral" ? "Needs Improvement" : "Critical"}
              </div>
            </div>
          </div>
        </div>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle><Zap className="h-5 w-5 mr-2" /> Churn Reasons Over Time</CardTitle>
            <CardDescription>Primary reasons for customer churn by period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={churnAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="price" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Price" />
                  <Area type="monotone" dataKey="features" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Features" />
                  <Area type="monotone" dataKey="competitor" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Competitor" />
                  <Area type="monotone" dataKey="service" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Service" />
                  <Area type="monotone" dataKey="usage" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Usage" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExecutiveSubscriptionDashboard