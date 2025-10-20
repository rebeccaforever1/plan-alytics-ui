// changed to subscriptions content instead of overview as that should be teh default-


// src/app/dashboard/subscriptions/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  ReferenceLine,
} from 'recharts'

import { 
  generateFakeCustomers, 
  generateCohortData,
  generateCohortRetentionData,
  generateSubscriptionKPIs,         
  generateSubscriptionTrendData,
  generatePlanDistributionData,
  generateChurnPredictionData,      
  generatePricingSensitivityData,
  generateChurnHeaderMetrics,
  generateChurnModelMetrics ,
  generatePreventionStrategies,
  generateInterventionResults,
  generatePricingRecommendations,
  generateAARRRMetrics,           
} from '@/lib/fakeData'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  UserCheck,
  UserX,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Filter,
  Sparkles, 
  Bell, 
  CircleAlert, 
  Minus, 
  ArrowRight, 
  ChevronDown,
} from 'lucide-react'

// ————————————————————————
// Utility functions & Data Generation
// ————————————————————————

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

const exportCSV = (data: any[], filename: string) => {
  const csvHeader = Object.keys(data[0]).join(',') + '\n'
  const csvRows = data.map(row =>
    Object.values(row).map(val => `"${val}"`).join(',')
  )
  const csvString = csvHeader + csvRows.join('\n')

  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

const exportEnhancedCSV = (data: any[], filters: any, filename: string) => {
  const enhancedData = data.map(item => ({
    ...item,
    exportDate: new Date().toISOString(),
    appliedFilters: JSON.stringify(filters)
  }))
  
  exportCSV(enhancedData, filename)
}

// Generate subscription-specific data
const generateSubscriptionData = () => {
  return generateFakeCustomers(18853)
}





// ————————————————————————
// Components
// ————————————————————————
const SubscriptionExecutiveSummary = ({ data, metric }: { data: any[]; metric: string }) => {
  const kpis = useMemo(() => {
    return generateSubscriptionKPIs(data)
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Active Subscriptions Card */}
     <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{kpis.activeSubscriptions.current.toLocaleString()}</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500">+{kpis.activeSubscriptions.change.toFixed(1)}%</span>
            <span className="text-muted-foreground ml-1">vs previous</span>
          </div>
        </CardContent>
      </Card>

      {/* MRR Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(kpis.mrr.current)}</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500">+{kpis.mrr.change.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* ARPU Card */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Revenue Per User</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(kpis.arpu.current)}</div>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500">+{kpis.arpu.change.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Churn Rate Card */}
      <Card className="border-l-4 border-l-orange-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <UserX className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{kpis.churnRate.current.toFixed(1)}%</div>
          <div className="flex items-center text-xs">
            <TrendingDown className="h-3 w-3 text-green-700 mr-1" />
            <span className="text-green-500">{kpis.churnRate.change.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const SubscriptionTrendsChart = ({ data }: { data: any[] }) => {
  const trendData = useMemo(() => {
    return generateSubscriptionTrendData()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Growth Trends</CardTitle>
          <CardDescription>Monthly subscription acquisition and churn patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="newSubscriptions" fill="#22c55e" name="New Subscriptions" />
                <Bar yAxisId="left" dataKey="churnedSubscriptions" fill="#ef9744ff" name="Churned Subscriptions" />
                <Line yAxisId="right" type="monotone" dataKey="totalSubscriptions" stroke="#3b82f6" strokeWidth={3} name="Total Active" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue & Churn Rate</CardTitle>
          <CardDescription>Monthly recurring revenue and churn correlation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => 
                  name === 'mrr' ? [formatCurrency(Number(value)), 'MRR'] : 
                  [Number(value).toFixed(1) + '%', 'Churn Rate']
                } />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="mrr" fill="#8b5cf6" fillOpacity={0.6} stroke="#8b5cf6" name="MRR" />
                <Line yAxisId="right" type="monotone" dataKey="churnRate" stroke="#f59e0b" strokeWidth={3} name="Churn Rate %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const PlanDistributionCharts = ({ data }: { data: any[] }) => {
  const planData = useMemo(() => {
    return generatePlanDistributionData(data)
  }, [data])

  const COLORS = {
    Basic: '#10b981',      // Fresh emerald green
    Pro: '#6366f1',        // Professional indigo  
    Enterprise: '#8b5cf6'   // Premium purple
  }

  const totalRevenue = planData.reduce((sum, item) => sum + item.revenue, 0)

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {planData.map((plan) => {
        const percentage = totalRevenue > 0 ? (plan.revenue / totalRevenue) * 100 : 0;
        return (
          <Card key={plan.plan} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {/* Color accent bar */}
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: COLORS[plan.plan] }}
            />
            
            <CardContent>
              <div className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{plan.plan}</h4>
                  <div className="flex items-center text-xs">
                    {plan.growth > 0 ? (
                      <span className="text-emerald-600 flex items-center">
                        ↗ {formatPercent(plan.growth)}
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        ↘ {formatPercent(Math.abs(plan.growth))}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(plan.revenue)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {percentage.toFixed(1)}% of total revenue
                    </div>
                  </div>
                  
                  {/* Elegant progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: COLORS[plan.plan]
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{plan.customers} customers</span>
                    <span>{plan.customers > 0 ? formatCurrency(plan.avgRevenue) : '$0'} avg</span>
                  </div>

                  {/* Churn indicator */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Churn Rate</span>
                      <span className={`font-medium ${
                        plan.churnRate > 20 ? 'text-red-600' : 
                        plan.churnRate > 10 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {formatPercent(plan.churnRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
  })}
</div>

  )
}


const CohortRetentionHeatmap = ({ cohortData }: { cohortData: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
        <CardDescription>
          Retention rates by signup cohort - each row represents customers who joined in that month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border">Cohort</th>
                <th className="text-left p-2 border">Size</th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className="text-center p-2 border">Month {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, rowIndex) => (
                <tr key={cohort.cohort}>
                  <td className="p-2 border font-medium">{cohort.cohort}</td>
                  <td className="p-2 border">{cohort.size}</td>
                  {Array.from({ length: 12 }, (_, i) => {
                    const value = cohort[`month${i}`]
                    const intensity = value / 100
                    const bgColor = value ? `rgba(34, 197, 94, ${intensity})` : 'transparent'
                    return (
                      <td key={i} className="p-2 border text-center" style={{ backgroundColor: bgColor }}>
                        {value ? `${value.toFixed(0)}%` : '-'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200" />
            <span>Low Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500" />
            <span>High Retention</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ChurnRiskDashboard = ({ churnData }: { churnData: any[] }) => {
  const riskDistribution = useMemo(() => {
    const high = churnData.filter(c => c.riskCategory === 'High').length
    const medium = churnData.filter(c => c.riskCategory === 'Medium').length
    const low = churnData.filter(c => c.riskCategory === 'Low').length
    
    return [
      { risk: 'High', count: high, color: '#ef4444' },
      { risk: 'Medium', count: medium, color: '#f59e0b' },
      { risk: 'Low', count: low, color: '#22c55e' },
    ]
  }, [churnData])

  const highRiskCustomers = churnData
    .filter(c => c.riskCategory === 'High')
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, 10)

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Distribution</CardTitle>
          <CardDescription>Customer segmentation by churn probability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-35">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    
    </div>
  )
}

const PricingSensitivityAnalysis = ({ pricingData }: { pricingData: any[] }) => {
  const optimalPrice = useMemo(() => {
    return pricingData.reduce((max, current) => 
      current.revenue > max.revenue ? current : max
    )
  }, [pricingData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Sensitivity Analysis</CardTitle>
        <CardDescription>
          Van Westendorp Price Sensitivity Meter - optimal pricing based on customer acceptance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pricingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="price" label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Demand', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="demand" fill="#8884d8" name="Demand" fillOpacity={0.6} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={3} name="Revenue" />
              <Line yAxisId="left" type="monotone" dataKey="acceptanceRate" stroke="#00C49F" strokeWidth={2} name="Acceptance Rate %" />
              <ReferenceLine x={optimalPrice.price} stroke="#ef4444" strokeDasharray="5 5" label="Optimal Price" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Optimal Pricing Recommendation</h4>
          <p className="text-sm">
            Based on the price sensitivity analysis, the optimal price point is <strong>${optimalPrice.price}</strong>, 
            generating <strong>{formatCurrency(optimalPrice.revenue)}</strong> in projected revenue with  
            <strong>{optimalPrice.demand}</strong> customers at <strong>{optimalPrice.acceptanceRate.toFixed(1)}%</strong> acceptance rate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Main Subscriptions Dashboard
// ————————————————————————

export default function SubscriptionsPage() {

  const [timeframe, setTimeframe] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [metric, setMetric] = useState('mrr')
  const [filters, setFilters] = useState({
    plan: 'all',
    status: 'all'
  })
  
  const subscriptionData = useMemo(() => generateSubscriptionData(), [])
  const kpis = generateSubscriptionKPIs(subscriptionData)
  const headerMetrics = generateChurnHeaderMetrics(kpis)
  const cohortData = useMemo(() => generateCohortRetentionData(), [])
  const churnData = useMemo(() => generateChurnPredictionData(subscriptionData), [subscriptionData])
  const modelMetrics = generateChurnModelMetrics()
  const pricingData = useMemo(() => generatePricingSensitivityData(), [])
  const strategies = generatePreventionStrategies()
  const interventionResults = generateInterventionResults()
  const pricingRecs = generatePricingRecommendations()
  const aarrrData = generateAARRRMetrics()
// Generate churn prediction data



      const transformCohortData = (cohorts: any[]) => {
  const result: { month: number; [key: string]: number }[] = []

  for (let i = 0; i < 12; i++) {
    const row: { month: number; [key: string]: number } = { month: i }
    cohorts.forEach((cohort) => {
      row[cohort.cohort] = cohort[`month${i}`]
    })
    result.push(row)
  }

  return result
}

const prepareSurvivalChartData = (cohorts: any[]) => {
  const months = 12
  const result = []

  for (let i = 0; i < months; i++) {
    const row: { month: number; [key: string]: number } = { month: i }
    cohorts.forEach((cohort) => {
      const cohortLabel = cohort.cohort || `Cohort ${i}`
      row[cohortLabel] = cohort[`month${i}`] ?? 0
    })
    result.push(row)
  }

  return result
}

  const filteredData = useMemo(() => {
    return subscriptionData.filter(customer => {
      const planMatch = filters.plan === 'all' || customer.plan === filters.plan
      const statusMatch = filters.status === 'all' || customer.status === filters.status
      return planMatch && statusMatch
    })
  }, [subscriptionData, filters])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-muted-foreground">
            Subscription metrics with churn prediction and pricing analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
      
 
          
          <Button variant="outline" onClick={() => exportEnhancedCSV(filteredData, filters, 'subscription_data.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex overflow-x-auto md:grid md:grid-cols-6 w-full">  
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
          <TabsTrigger value="pricing">Price Sensitivity</TabsTrigger>
          <TabsTrigger value="funnel">AARRR Funnel</TabsTrigger>
         
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SubscriptionExecutiveSummary data={filteredData} metric={metric} />
          <SubscriptionTrendsChart data={filteredData} />
          <PlanDistributionCharts data={filteredData} />
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <CohortRetentionHeatmap cohortData={cohortData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     
<Card>
  <CardHeader>
    <CardTitle>Cohort Survival Curves</CardTitle>
    <CardDescription>Kaplan-Meier survival analysis by signup month</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transformCohortData(cohortData.slice(0, 6))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {cohortData.slice(0, 6).map((cohort, index) => (
            <Line
              key={cohort.cohort}
              type="monotone"
              dataKey={cohort.cohort}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


            <Card>
              <CardHeader>
                <CardTitle>Cohort Performance Summary</CardTitle>
                <CardDescription>Key metrics by cohort for strategic insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Initial Size</TableHead>
                      <TableHead>6-Month Retention</TableHead>
                      <TableHead>12-Month Retention</TableHead>
                      <TableHead>Quality Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cohortData.slice(0, 8).map((cohort) => (
                      <TableRow key={cohort.cohort}>
                        <TableCell className="font-medium">{cohort.cohort}</TableCell>
                        <TableCell>{cohort.size}</TableCell>
                        <TableCell>{cohort.month6 ? `${cohort.month6.toFixed(1)}%` : 'N/A'}</TableCell>
                        <TableCell>{cohort.month11 ? `${cohort.month11.toFixed(1)}%` : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={cohort.month6 > 60 ? 'default' : cohort.month6 > 40 ? 'secondary' : 'destructive'}>
                            {cohort.month6 > 60 ? 'Excellent' : cohort.month6 > 40 ? 'Good' : 'Needs Attention'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      <TabsContent value="churn" className="space-y-6">
  {/* Enhanced Dashboard Header with Key Metrics */}


<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
  <div>
    <h2 className="text-2xl font-bold text-gray-800">Customer Churn Prediction</h2>
    <p className="text-sm text-muted-foreground">
      Proactively identify at-risk customers and take preventive actions
    </p>
  </div>
  <div className="flex flex-wrap gap-4">
    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
      <p className="text-sm text-muted-foreground">Total At-Risk</p>
      <p className="text-2xl font-bold text-amber-600">{headerMetrics.totalAtRisk}</p>
    </div>
    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
      <p className="text-sm text-muted-foreground">Churn Rate</p>
      <p className="text-2xl font-bold text-red-600">{headerMetrics.churnRate}%</p>
    </div>
    <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
      <p className="text-sm text-muted-foreground">Saved This Month</p>
      <p className="text-2xl font-bold text-green-600">{headerMetrics.savedThisMonth}</p>
    </div>
  </div>
</div>
  
  {/* Enhanced Dashboard Component */}
  <ChurnRiskDashboard churnData={churnData} />
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Enhanced Model Performance Card */}
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Churn Prediction Model Performance</CardTitle>
            <CardDescription>Machine learning model accuracy and feature importance</CardDescription>
          </div>
          <div className="relative">
            <select className="text-xs p-2 pr-8 rounded border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </CardHeader>
     <CardContent className="pt-6">
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-muted-foreground">Model Accuracy</p>
        <p className="text-2xl font-bold text-blue-600">{modelMetrics.accuracy}%</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${modelMetrics.accuracy}%` }}></div>
        </div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
        <p className="text-sm text-muted-foreground">Precision</p>
        <p className="text-2xl font-bold text-green-600">{modelMetrics.precision}%</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${modelMetrics.precision}%` }}></div>
        </div>
      </div>
    </div>
    
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Feature Importance</h4>
        <span className="text-xs text-muted-foreground">Impact on churn prediction</span>
      </div>
      <div className="space-y-3">
        {modelMetrics.featureImportance.map((item) => (
          <div key={item.feature} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-md ${
                item.trend === 'up' ? 'bg-red-100 text-red-600' : 
                item.trend === 'down' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                 item.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
                 <Minus className="h-4 w-4" />}
              </div>
              <span className="text-sm">{item.feature}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                  style={{ width: `${item.importance}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-8">{item.importance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="pt-2 border-t">
      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
        <span>View detailed model metrics</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
</CardContent>
    </Card>

    {/* Enhanced Prevention Strategies Card */}
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Churn Prevention Strategies</CardTitle>
            <CardDescription>Recommended actions based on risk factors</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Actions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
  <div className="space-y-4">
    {strategies.map((strategy) => (
      <div key={strategy.risk} className={`p-4 bg-${strategy.color}-50 border border-${strategy.color}-200 rounded-lg transition-transform hover:scale-[1.01]`}>
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-semibold text-${strategy.color}-800`}>{strategy.risk} Risk ({strategy.risk === 'High' ? 'Immediate Action' : strategy.risk === 'Medium' ? 'Proactive' : 'Nurture'})</h4>
          <Badge variant={strategy.risk === 'High' ? 'destructive' : strategy.risk === 'Medium' ? 'secondary' : 'outline'} 
                 className={`ml-2 ${strategy.risk === 'Medium' ? 'bg-amber-200 text-amber-900' : strategy.risk === 'Low' ? 'bg-green-200 text-green-900' : ''}`}>
            {strategy.customerCount} customers
          </Badge>
        </div>
        <ul className={`text-sm text-${strategy.color}-700 space-y-2`}>
          {strategy.actions.map((action, index) => (
            <li key={index} className="flex items-start">
              {strategy.risk === 'High' ? <CircleAlert className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" /> :
               strategy.risk === 'Medium' ? <Bell className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" /> :
               <Sparkles className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />}
              <span>{action}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-3 pt-2 border-t border-${strategy.color}-200`}>
          <Button variant="outline" size="sm" className={`text-${strategy.color}-700 border-${strategy.color}-300 hover:bg-${strategy.color}-100`}>
            {strategy.risk === 'High' ? 'Create Action Plan' : 
             strategy.risk === 'Medium' ? 'Schedule Campaign' : 
             'View Opportunities'}
          </Button>
        </div>
      </div>
    ))}
  </div>
</CardContent>
    </Card>
  </div>
  
  {/* Additional Section: Recent Interventions */}
  <Card>
  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
    <CardTitle>Recent Intervention Results</CardTitle>
    <CardDescription>Outcomes of recently executed churn prevention strategies</CardDescription>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left font-medium">Customer</th>
            <th className="py-3 px-4 text-left font-medium">Risk Level</th>
            <th className="py-3 px-4 text-left font-medium">Intervention</th>
            <th className="py-3 px-4 text-left font-medium">Date</th>
            <th className="py-3 px-4 text-left font-medium">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {interventionResults.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">{item.customer}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.risk === "High" ? "bg-red-100 text-red-800" :
                  item.risk === "Medium" ? "bg-amber-100 text-amber-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {item.risk}
                </span>
              </td>
              <td className="py-3 px-4">{item.intervention}</td>
              <td className="py-3 px-4">{item.date}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.result === "Retained" ? "bg-green-100 text-green-800" :
                  item.result === "Engaged" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {item.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
</TabsContent>


        <TabsContent value="pricing" className="space-y-6">
          <PricingSensitivityAnalysis pricingData={pricingData} />
          
<div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Price Elasticity Analysis</CardTitle>
      <CardDescription>How demand responds to price changes across segments</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pricingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="price" 
              label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }}
              
            />
            <YAxis 
              label={{ value: 'Units / Rate (%)', angle: -90, position: 'insideLeft' }}
              
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Acceptance Rate') return [`${value}%`, name];
                return [value, name];
              }}
            />
            <Legend 
             verticalAlign='top'
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#8884d8" 
              strokeWidth={2} 
              name="Demand (Units)" 
            />
            <Line 
              type="monotone" 
              dataKey="acceptanceRate" 
              stroke="#82ca9d" 
              strokeWidth={2} 
              name="Acceptance Rate (%)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  
  <CardHeader>
   

  </CardHeader>
  <CardContent>
    <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
      <strong>Model Assumptions:</strong> This analysis uses a linear demand curve 
      where demand = 100 - (price × 0.5). In production, use actual historical 
      pricing data and customer response rates.
    </div>
    {/* Chart here */}
  </CardContent>
</Card>
</div>
           <Card>
  <CardHeader>
    <CardTitle>Pricing Strategy Recommendations</CardTitle>
    <CardDescription>Data-driven pricing insights and next steps</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {pricingRecs.recommendations.map((rec) => (
          <div key={rec.title} className={`p-3 ${rec.color === 'blue' ? 'bg-blue-50' : rec.color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-lg`}>
            <h4 className="font-semibold mb-1">{rec.title}</h4>
            <p className="text-sm text-muted-foreground">{rec.description}</p>
          </div>
        ))}
      </div>
      

      <div className="border-t pt-3">
        <h4 className="font-semibold mb-2">Van Westendorp Results</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Point of Marginal Cheapness: <strong>${pricingRecs.westendorpResults.cheapness}</strong></div>
          <div>Point of Marginal Expensiveness: <strong>${pricingRecs.westendorpResults.expensiveness}</strong></div>
          <div>Optimal Price Point: <strong>${pricingRecs.westendorpResults.optimal}</strong></div>
          <div>Indifference Price Point: <strong>${pricingRecs.westendorpResults.indifference}</strong></div>
        </div>
      </div>
    </div>
    
  </CardContent>
</Card>

</TabsContent>

<TabsContent value="funnel" className="space-y-6">
<Card>
  <CardHeader>
    <CardTitle>AARRR Pirate Metrics Funnel</CardTitle>
    <CardDescription>Acquisition, Activation, Retention, Referral, Revenue metrics for subscription optimization</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
      {aarrrData.funnel.map((metric) => (
        <Card key={metric.stage} className={`border-l-4 ${metric.color === 'blue' ? 'border-l-blue-500' : metric.color === 'green' ? 'border-l-green-500' : metric.color === 'purple' ? 'border-l-purple-500' : metric.color === 'orange' ? 'border-l-orange-500' : 'border-l-red-500'}`}>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">{metric.stage}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-xs ${metric.color === 'blue' ? 'text-blue-600' : metric.color === 'green' ? 'text-green-600' : metric.color === 'purple' ? 'text-purple-600' : metric.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>{metric.change} vs last month</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={aarrrData.chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Users" />
          <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ff7300" strokeWidth={3} name="Conversion %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Acquisition Channels</CardTitle>
      <CardDescription>Customer acquisition source performance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {aarrrData.acquisitionChannels.map((channel) => (
          <div key={channel.channel} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-medium">{channel.channel}</p>
              <p className="text-xs text-muted-foreground">{channel.customers} customers</p>
            </div>
            <div className="text-right">
              <p className="text-sm">CAC: ${channel.cost}</p>
              <p className="text-xs text-muted-foreground">LTV: ${channel.ltv}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Activation Metrics</CardTitle>
      <CardDescription>Key user activation indicators</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {aarrrData.activationMetrics.map((item) => (
          <div key={item.metric} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.metric}</span>
              <span>{item.rate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${item.rate >= item.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${item.rate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Target: {item.target}%</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Revenue Optimization</CardTitle>
      <CardDescription>Revenue per customer improvements</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-xs text-muted-foreground">ARPU</p>
            <p className="font-bold text-green-600">${aarrrData.revenueOptimization.arpu}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-xs text-muted-foreground">Expansion MRR</p>
            <p className="font-bold text-blue-600">${aarrrData.revenueOptimization.expansionMRR}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Upsell Opportunities</h4>
          <div className="text-xs space-y-1">
            {aarrrData.revenueOptimization.upsellOpportunities.map((opp) => (
              <div key={`${opp.from}-${opp.to}`} className="flex justify-between">
                <span>{opp.from} {opp.to && `→ ${opp.to}`}</span>
                <span className="font-medium">{opp.customers} customers</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  </div>
 
        </TabsContent>
      </Tabs>
    </div>
    
  )
}