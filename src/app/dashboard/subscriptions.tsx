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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts'

import { generateFakeCustomers, generateCohortData } from '@/lib/fakeData'
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

// Generate subscription-specific data
const generateSubscriptionData = () => {
  const customers = generateFakeCustomers(1000)
  
  // Generate subscription metrics
  const subscriptionMetrics = customers.map((customer, index) => ({
    ...customer,
    subscriptionStart: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    subscriptionStatus: Math.random() > 0.15 ? 'active' : Math.random() > 0.5 ? 'churned' : 'paused',
    monthlyRecurringRevenue: customer.plan === 'Basic' ? 29 : customer.plan === 'Pro' ? 99 : 299,
    churnRisk: Math.random(),
    lifetimeMonths: Math.floor(Math.random() * 36) + 1,
    lastPayment: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    paymentMethod: ['card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
    trialLength: Math.floor(Math.random() * 30) + 7,
    activationScore: Math.random() * 100,
  }))
  
  return subscriptionMetrics
}

// Generate cohort retention data
const generateCohortRetentionData = () => {
  const cohorts = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  for (let cohortMonth = 0; cohortMonth < 12; cohortMonth++) {
    const cohortData = {
      cohort: months[cohortMonth],
      size: Math.floor(Math.random() * 200) + 50,
    }
    
    // Generate retention rates for each subsequent month
    let retentionRate = 100
    for (let month = 0; month <= 11; month++) {
      const monthKey = `month${month}`
      if (month === 0) {
        cohortData[monthKey] = 100
      } else {
        retentionRate *= (0.85 + Math.random() * 0.1) // 85-95% retention month over month
        cohortData[monthKey] = Math.max(retentionRate, 10)
      }
    }
    
    cohorts.push(cohortData)
  }
  
  return cohorts
}

// Generate churn prediction data
const generateChurnPredictionData = (customers: any[]) => {
  return customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    churnProbability: customer.churnRisk,
    riskCategory: customer.churnRisk > 0.7 ? 'High' : customer.churnRisk > 0.4 ? 'Medium' : 'Low',
    lastLogin: Math.floor(Math.random() * 30),
    supportTickets: Math.floor(Math.random() * 5),
    usageScore: customer.usageScore,
    plan: customer.plan,
    monthsSubscribed: customer.lifetimeMonths,
  }))
}

// Generate pricing sensitivity data
const generatePricingSensitivityData = () => {
  const pricePoints = []
  for (let price = 10; price <= 200; price += 10) {
    const demand = Math.max(100 - (price * 0.5) + Math.random() * 20, 5)
    const revenue = price * demand
    pricePoints.push({
      price,
      demand: Math.floor(demand),
      revenue: Math.floor(revenue),
      acceptanceRate: Math.max(95 - (price * 0.4), 5) + Math.random() * 10,
    })
  }
  return pricePoints
}

// ————————————————————————
// Components
// ————————————————————————

const SubscriptionKPIOverview = ({ data }: { data: any[] }) => {
  const kpis = useMemo(() => {
    const activeSubscriptions = data.filter(d => d.subscriptionStatus === 'active').length
    const totalRevenue = data.reduce((sum, d) => sum + (d.subscriptionStatus === 'active' ? d.monthlyRecurringRevenue : 0), 0)
    const avgRevenuePerUser = totalRevenue / activeSubscriptions
    const churnedThisMonth = data.filter(d => d.subscriptionStatus === 'churned').length
    const churnRate = (churnedThisMonth / data.length) * 100
    const avgLifetime = data.reduce((sum, d) => sum + d.lifetimeMonths, 0) / data.length
    const highRiskCustomers = data.filter(d => d.churnRisk > 0.7).length
    
    return {
      activeSubscriptions,
      totalRevenue,
      avgRevenuePerUser,
      churnRate,
      avgLifetime,
      highRiskCustomers,
      growthRate: 12.5, // Simulated
      netRevenueRetention: 108, // Simulated
    }
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{kpis.activeSubscriptions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{kpis.growthRate}% vs last month
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(kpis.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              NRR: {kpis.netRevenueRetention}%
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(kpis.avgRevenuePerUser)}</div>
          <p className="text-xs text-muted-foreground">
            Avg lifetime: {kpis.avgLifetime.toFixed(1)} months
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{kpis.churnRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-500 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {kpis.highRiskCustomers} high-risk customers
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const SubscriptionTrendsChart = ({ data }: { data: any[] }) => {
  const trendData = useMemo(() => {
    const monthlyData = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    let totalSubs = 800
    let mrr = 45000
    
    months.forEach(month => {
      const newSubs = Math.floor(Math.random() * 50) + 80
      const churnedSubs = Math.floor(Math.random() * 30) + 20
      const netGrowth = newSubs - churnedSubs
      
      totalSubs += netGrowth
      mrr += netGrowth * 65 // Average subscription value
      
      monthlyData.push({
        month,
        totalSubscriptions: totalSubs,
        newSubscriptions: newSubs,
        churnedSubscriptions: churnedSubs,
        mrr: mrr,
        churnRate: (churnedSubs / totalSubs) * 100,
      })
    })
    
    return monthlyData
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
                <Bar yAxisId="left" dataKey="churnedSubscriptions" fill="#ef4444" name="Churned Subscriptions" />
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
    const plans = ['Basic', 'Pro', 'Enterprise']
    return plans.map(plan => {
      const planCustomers = data.filter(d => d.plan === plan && d.subscriptionStatus === 'active')
      const revenue = planCustomers.reduce((sum, c) => sum + c.monthlyRecurringRevenue, 0)
      return {
        plan,
        customers: planCustomers.length,
        revenue,
        avgRevenue: revenue / planCustomers.length || 0,
        churnRate: (data.filter(d => d.plan === plan && d.subscriptionStatus === 'churned').length / data.filter(d => d.plan === plan).length) * 100,
      }
    })
  }, [data])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution by Plan</CardTitle>
          <CardDescription>Breakdown of monthly recurring revenue by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ plan, revenue }) => `${plan}: ${formatCurrency(revenue)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Performance Metrics</CardTitle>
          <CardDescription>Key metrics across subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Avg Revenue</TableHead>
                <TableHead>Churn Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planData.map((plan) => (
                <TableRow key={plan.plan}>
                  <TableCell className="font-medium">{plan.plan}</TableCell>
                  <TableCell>{plan.customers}</TableCell>
                  <TableCell>{formatCurrency(plan.avgRevenue)}</TableCell>
                  <TableCell>
                    <Badge variant={plan.churnRate > 20 ? 'destructive' : plan.churnRate > 10 ? 'secondary' : 'default'}>
                      {plan.churnRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const CohortRetentionHeatmap = ({ cohortData }: { cohortData: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Retention Analysis</CardTitle>
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
      { risk: 'High Risk', count: high, color: '#ef4444' },
      { risk: 'Medium Risk', count: medium, color: '#f59e0b' },
      { risk: 'Low Risk', count: low, color: '#22c55e' },
    ]
  }, [churnData])

  const highRiskCustomers = churnData
    .filter(c => c.riskCategory === 'High')
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, 10)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Distribution</CardTitle>
          <CardDescription>Customer segmentation by churn probability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
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

      <Card>
        <CardHeader>
          <CardTitle>High Risk Customers</CardTitle>
          <CardDescription>Customers most likely to churn - requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRiskCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {Math.round(customer.churnProbability * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell>{customer.lastLogin} days ago</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Contact</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
  
  const subscriptionData = useMemo(() => generateSubscriptionData(), [])
  const cohortData = useMemo(() => generateCohortRetentionData(), [])
  const churnData = useMemo(() => generateChurnPredictionData(subscriptionData), [subscriptionData])
  const pricingData = useMemo(() => generatePricingSensitivityData(), [])

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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive subscription metrics with academic frameworks for churn prediction and retention analysis
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-32"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              placeholder="End date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-32"
            />
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportCSV(subscriptionData, 'subscription_data.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
          <TabsTrigger value="pricing">Price Sensitivity</TabsTrigger>
          <TabsTrigger value="funnel">AARRR Funnel</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SubscriptionKPIOverview data={subscriptionData} />
          <SubscriptionTrendsChart data={subscriptionData} />
          <PlanDistributionCharts data={subscriptionData} />
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
                    <LineChart data={cohortData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cohort" />
                      <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      {cohortData.slice(0, 6).map((cohort, index) => (
                        <Line
                          key={cohort.cohort}
                          type="monotone"
                          dataKey={`month11`}
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          strokeWidth={2}
                          name={cohort.cohort}
                          data={Array.from({ length: 12 }, (_, i) => ({
                            month: i,
                            value: cohort[`month${i}`]
                          }))}
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
          <ChurnRiskDashboard churnData={churnData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Prediction Model Performance</CardTitle>
                <CardDescription>Machine learning model accuracy and feature importance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Model Accuracy</p>
                      <p className="text-2xl font-bold text-blue-600">87.3%</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Precision</p>
                      <p className="text-2xl font-bold text-green-600">82.1%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Feature Importance</h4>
                    <div className="space-y-2">
                      {[
                        { feature: 'Days Since Last Login', importance: 89 },
                        { feature: 'Usage Score Decline', importance: 76 },
                        { feature: 'Support Tickets', importance: 62 },
                        { feature: 'Payment Failures', importance: 54 },
                        { feature: 'Feature Adoption', importance: 43 },
                      ].map((item) => (
                        <div key={item.feature} className="flex items-center justify-between">
                          <span className="text-sm">{item.feature}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${item.importance}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{item.importance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Prevention Strategies</CardTitle>
                <CardDescription>Recommended actions based on risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">High Risk (Immediate Action)</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Personal outreach within 24 hours</li>
                      <li>• Offer discount or plan downgrade</li>
                      <li>• Schedule product demo or training</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Medium Risk (Proactive)</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Send engagement email campaign</li>
                      <li>• Highlight unused features</li>
                      <li>• Provide success stories and tips</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Low Risk (Nurture)</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Regular newsletter and updates</li>
                      <li>• Upsell opportunities</li>
                      <li>• Loyalty program enrollment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PricingSensitivityAnalysis pricingData={pricingData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <XAxis dataKey="price" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="demand" stroke="#8884d8" strokeWidth={2} name="Demand" />
                      <Line type="monotone" dataKey="acceptanceRate" stroke="#82ca9d" strokeWidth={2} name="Acceptance Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategy Recommendations</CardTitle>
                <CardDescription>Data-driven pricing insights and next steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-1">Current Price Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Current pricing is below optimal. Consider 15-20% increase for Pro plan.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-1">Market Positioning</h4>
                      <p className="text-sm text-muted-foreground">
                        Enterprise tier has room for premium positioning with enhanced features.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-1">A/B Testing Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        Test $119 Pro pricing with 10% of new signups for 30 days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2">Van Westendorp Results</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Point of Marginal Cheapness: <strong>$19</strong></div>
                      <div>Point of Marginal Expensiveness: <strong>$159</strong></div>
                      <div>Optimal Price Point: <strong>$89</strong></div>
                      <div>Indifference Price Point: <strong>$119</strong></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AARRR Pirate Metrics Funnel</CardTitle>
              <CardDescription>Acquisition, Activation, Retention, Referral, Revenue metrics for subscription optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                {[
                  { stage: 'Acquisition', value: '2,340', change: '+12%', color: 'blue' },
                  { stage: 'Activation', value: '1,872', change: '+8%', color: 'green' },
                  { stage: 'Retention', value: '1,498', change: '+15%', color: 'purple' },
                  { stage: 'Referral', value: '234', change: '+22%', color: 'orange' },
                  { stage: 'Revenue', value: '$89K', change: '+18%', color: 'red' },
                ].map((metric) => (
                  <Card key={metric.stage} className={`border-l-4 border-l-${metric.color}-500`}>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">{metric.stage}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className={`text-xs text-${metric.color}-600`}>{metric.change} vs last month</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { stage: 'Visitors', count: 10000, conversion: 100 },
                    { stage: 'Signups', count: 2340, conversion: 23.4 },
                    { stage: 'Activated', count: 1872, conversion: 18.7 },
                    { stage: 'Retained', count: 1498, conversion: 15.0 },
                    { stage: 'Referring', count: 234, conversion: 2.3 },
                    { stage: 'Paying', count: 1200, conversion: 12.0 },
                  ]}>
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
                  {[
                    { channel: 'Organic Search', customers: 1240, cost: 89, ltv: 2340 },
                    { channel: 'Paid Search', customers: 560, cost: 156, ltv: 1890 },
                    { channel: 'Social Media', customers: 340, cost: 78, ltv: 1560 },
                    { channel: 'Email Marketing', customers: 200, cost: 23, ltv: 2100 },
                  ].map((channel) => (
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
                  {[
                    { metric: 'Profile Completed', rate: 87, target: 90 },
                    { metric: 'First Feature Used', rate: 73, target: 80 },
                    { metric: 'Integration Setup', rate: 45, target: 60 },
                    { metric: 'Team Invited', rate: 32, target: 40 },
                  ].map((item) => (
                    <div key={item.metric} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.metric}</span>
                        <span>{item.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.rate >= item.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${(item.rate / 100) * 100}%` }}
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
                      <p className="font-bold text-green-600">$127</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-muted-foreground">Expansion MRR</p>
                      <p className="font-bold text-blue-600">$12K</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Upsell Opportunities</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Basic → Pro</span>
                        <span className="font-medium">234 customers</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pro → Enterprise</span>
                        <span className="font-medium">67 customers</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Add-on Features</span>
                        <span className="font-medium">445 customers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pareto/NBD Model Results</CardTitle>
                <CardDescription>Probabilistic customer lifetime value modeling using academic frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Model Parameters</p>
                      <p className="text-xs mt-1">r = 0.243, α = 4.414</p>
                      <p className="text-xs">s = 0.793, β = 2.426</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Model Fit</p>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Expected Customer Behavior</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Avg Expected Lifetime</span>
                        <span className="font-medium">28.4 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Transactions</span>
                        <span className="font-medium">12.7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Probability Alive (90 days)</span>
                        <span className="font-medium">73.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gamma-Gamma Model</CardTitle>
                <CardDescription>Monetary value modeling for heterogeneous customer spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Shape Parameters</p>
                      <p className="text-xs mt-1">p = 6.25, q = 3.74</p>
                      <p className="text-xs">γ = 15.44</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Expected Spending</p>
                      <p className="text-2xl font-bold text-orange-600">$142</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Spending Distribution</h4>
                    <div className="space-y-2">
                      {[
                        { percentile: '10th', value: 67 },
                        { percentile: '25th', value: 89 },
                        { percentile: '50th', value: 127 },
                        { percentile: '75th', value: 186 },
                        { percentile: '90th', value: 267 },
                      ].map((item) => (
                        <div key={item.percentile} className="flex justify-between text-sm">
                          <span>{item.percentile} percentile</span>
                          <span className="font-medium">${item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Lifetime Value Prediction</CardTitle>
              <CardDescription>12-month forward-looking CLV using combined Pareto/NBD and Gamma-Gamma models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    predicted: 2240 + (i * 45) + (Math.random() * 100),
                    actual: i < 6 ? 2180 + (i * 52) + (Math.random() * 120) : null,
                    confidence_upper: 2340 + (i * 48) + (Math.random() * 80),
                    confidence_lower: 2140 + (i * 42) + (Math.random() * 80),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'Months from Now', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'CLV ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="confidence_upper" 
                      stroke="transparent" 
                      fill="#e0e7ff" 
                      fillOpacity={0.4}
                      name="95% Confidence Interval"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="confidence_lower" 
                      stroke="transparent" 
                      fill="#ffffff" 
                      fillOpacity={1}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#4f46e5" 
                      strokeWidth={3} 
                      name="Predicted CLV"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#059669" 
                      strokeWidth={2} 
                      name="Actual CLV"
                      strokeDasharray="5 5"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Validation</CardTitle>
                <CardDescription>Statistical tests and model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { test: 'Kolmogorov-Smirnov', pValue: 0.127, result: 'Pass' },
                    { test: 'Anderson-Darling', pValue: 0.089, result: 'Pass' },
                    { test: 'Chi-Square GOF', pValue: 0.234, result: 'Pass' },
                    { test: 'Mean Absolute Error', pValue: 12.4, result: '$12.40' },
                  ].map((test) => (
                    <div key={test.test} className="flex justify-between items-center">
                      <span className="text-sm">{test.test}</span>
                      <Badge variant={test.result === 'Pass' ? 'default' : 'secondary'}>
                        {test.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heterogeneity Analysis</CardTitle>
                <CardDescription>Customer behavior variance and segmentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Heterogeneity Index</p>
                    <p className="text-2xl font-bold text-blue-600">0.68</p>
                    <p className="text-xs text-muted-foreground">Moderate variance</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Behavioral Segments</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Heavy Users (top 20%)</span>
                        <span className="font-medium">67% of revenue</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regular Users (60%)</span>
                        <span className="font-medium">29% of revenue</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Light Users (bottom 20%)</span>
                        <span className="font-medium">4% of revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Recommendations</CardTitle>
                <CardDescription>Strategic insights from academic models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <p className="font-semibold text-green-800 text-sm">Focus on Heavy Users</p>
                    <p className="text-xs text-green-700">Top 20% generate 67% of revenue - prioritize retention</p>
                  </div>
                  
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-semibold text-blue-800 text-sm">Upgrade Regular Users</p>
                    <p className="text-xs text-blue-700">60% of users have growth potential with targeted campaigns</p>
                  </div>
                  
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="font-semibold text-amber-800 text-sm">Re-engage Light Users</p>
                    <p className="text-xs text-amber-700">Bottom 20% need activation programs or should be deprioritized</p>
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