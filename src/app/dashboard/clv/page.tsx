'use client'

import React, { useState, useMemo } from 'react'
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
  BarChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Area,
  ReferenceLine,
} from 'recharts'

import { 
  generateFakeCustomers, 
  generateCLVModelData
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
import { Progress } from '@/components/ui/progress'
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
  LineChart,
  Sigma,
  Calculator,
  Filter,
  Sparkles,
  Zap,
  Activity,
  Crown,
  ChevronsUp,
  ChevronsDown,
} from 'lucide-react'

// ————————————————————————
// Utility functions
// ————————————————————————

const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
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

const formatCurrency = (value: number) => {
  if (typeof value !== 'number' || isNaN(value) || value === null || value === undefined) {
    return '$0'
  }
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

const calculateMean = (values: number[]) =>
  values.reduce((acc, val) => acc + val, 0) / values.length

const calculateStandardDeviation = (values: number[]) => {
  const mean = calculateMean(values)
  const squareDiffs = values.map(value => Math.pow(value - mean, 2))
  return Math.sqrt(calculateMean(squareDiffs))
}

const calculateTrend = (values: number[]) => {
  if (values.length < 2) return 0
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  return ((lastValue - firstValue) / firstValue) * 100
}

const formatTimeLabel = (index: number, timeframe: string) => {
  if (timeframe === 'daily') return `Day ${index + 1}`
  if (timeframe === 'monthly') return `Month ${index + 1}`
  return `Week ${index + 1}`
}

const metricLabels: Record<string, string> = {
  clv: 'Customer Lifetime Value',
  cac: 'Customer Acquisition Cost',
  revenue: 'Revenue',
  baseline: 'Baseline',
  value: 'Customer Lifetime Value (CLV)',
  mrr: 'Monthly Recurring Revenue',
  customers: 'Customer Count',
  retention: 'Retention Rate',
  churn: 'Churn Rate',
}

// ————————————————————————
// New Components
// ————————————————————————

const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohortData = useMemo(() => {
    // Generate cohort data based on acquisition period
    const cohorts: Record<string, any> = {}
    
    data.forEach((customer, idx) => {
      const cohort = `Cohort ${Math.floor(idx / 10) + 1}`
      if (!cohorts[cohort]) {
        cohorts[cohort] = {
          name: cohort,
          customers: 0,
          totalClv: 0,
          avgClv: 0,
          retention: 0,
        }
      }
      
      cohorts[cohort].customers += 1
      cohorts[cohort].totalClv += customer.clv
      cohorts[cohort].avgClv = cohorts[cohort].totalClv / cohorts[cohort].customers
      cohorts[cohort].retention = 80 + (idx % 20) // Simulated retention
    })
    
    return Object.values(cohorts)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
        <CardDescription>
          Customer value and retention by acquisition cohort
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => 
                  name === 'avgClv' ? [formatCurrency(Number(value)), 'Average CLV'] : 
                  name === 'retention' ? [`${Number(value).toFixed(1)}%`, 'Retention Rate'] : 
                  [value, 'Customers']
                } 
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="avgClv" 
                fill="#4f46e5" 
                name="Average CLV" 
              />
              <Bar 
                yAxisId="right" 
                dataKey="retention" 
                fill="#00C49F" 
                name="Retention Rate (%)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const ParetoAnalysis = ({ data }: { data: any[] }) => {
  const paretoData = useMemo(() => {
    // Sort customers by CLV descending
    const sortedData = [...data].sort((a, b) => b.clv - a.clv)
    
    // Calculate cumulative percentages
    let cumulativeValue = 0
    const totalValue = sortedData.reduce((sum, item) => sum + item.clv, 0)
    
    return sortedData.map((item, index) => {
      cumulativeValue += item.clv
      return {
        rank: index + 1,
        clv: item.clv,
        cumulativeValue,
        percentage: (cumulativeValue / totalValue) * 100,
        customerPercentage: ((index + 1) / sortedData.length) * 100
      }
    })
  }, [data])

  // Find the 80/20 point (closest to 80% of value from 20% of customers)
  const paretoPoint = paretoData.find(item => item.customerPercentage >= 20) || paretoData[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Analysis</CardTitle>
        <CardDescription>
          Value concentration across customer base (80/20 rule)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="customerPercentage" 
                label={{ value: '% of Customers', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Cumulative % of Value', angle: -90, position: 'insideLeft' }} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'CLV', angle: -90, position: 'insideRight' }} 
              />
              <Tooltip 
                formatter={(value, name) => 
                  name === 'percentage' ? [`${Number(value).toFixed(1)}%`, 'Cumulative Value %'] : 
                  name === 'clv' ? [formatCurrency(Number(value)), 'CLV'] : 
                  [`${Number(value).toFixed(1)}%`, 'Customer %']
                } 
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="percentage"
                stroke="#4f46e5"
                strokeWidth={2}
                name="Cumulative Value %"
                dot={false}
              />
              <Bar
                yAxisId="right"
                dataKey="clv"
                fill="#cbd5e1"
                name="Individual CLV"
                fillOpacity={0.6}
              />
              <ReferenceLine 
                x={20} 
                stroke="#ff7300" 
                strokeDasharray="3 3" 
                label="80/20 Threshold" 
              />
              <ReferenceLine 
                yAxisId="left" 
                y={80} 
                stroke="#ff7300" 
                strokeDasharray="3 3" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Pareto Insight:</strong> Top {Math.round(paretoPoint.customerPercentage)}% of customers 
            generate {Math.round(paretoPoint.percentage)}% of total value
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const CLVDecomposition = ({ data }: { data: any[] }) => {
  const decomposition = useMemo(() => {
    const frequencyMean = calculateMean(data.map(d => d.frequency || 2.5))
    const monetaryMean = calculateMean(data.map(d => d.monetary || d.clv / 12))
    const retentionMean = calculateMean(data.map(d => d.retention || 85))
    
    return {
      frequency: frequencyMean,
      monetary: monetaryMean,
      retention: retentionMean,
      calculatedClv: frequencyMean * monetaryMean * (retentionMean / (1 - retentionMean/100))
    }
  }, [data])

  return (
  <Card>
  <CardHeader>
    <CardTitle>CLV Decomposition</CardTitle>
    <CardDescription>
      Breakdown of CLV into frequency, monetary value, and retention components
    </CardDescription>
  </CardHeader>
  <CardContent>

 




  <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">Purchase Frequency</p>
        <p className="text-xl font-bold">{decomposition.frequency.toFixed(1)}</p>
        <p className="text-xs text-muted-foreground">avg purchases/period</p>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">Monetary Value</p>
        <p className="text-xl font-bold">{formatCurrency(data.reduce((acc, d) => acc + d.monetary, 0) / data.length)}</p>
        <p className="text-xs text-muted-foreground">avg order value</p>
      </div>
       <div className="text-center p-3 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800">Retention Rate</p>
        <p className="text-xl font-bold">{(data.reduce((acc, d) => acc + d.retention, 0) / data.length).toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">customer retention</p>
      </div>
       <div className="text-center p-3 bg-amber-50 rounded-lg">
        <p className="text-sm text-amber-800">Usage Score</p>
        <p className="text-xl font-bold">{(data.reduce((acc, d) => acc + d.usageScore, 0) / data.length).toFixed(1)}</p>
        <p className="text-xs text-muted-foreground">engagement level</p>
      </div>
    </div>
    
    <div className="space-y-4">
  <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-slate-400">
    <h4 className="text-sm font-semibold mb-3 text-slate-700">High Impact Opportunities</h4>
    <ul className="text-sm text-muted-foreground space-y-2">
      <li>• Increase purchase frequency → +15% CLV per additional purchase</li>
      <li>• Improve retention by 5% → +25% CLV increase</li>
      <li>• Boost usage scores → Higher retention & expansion</li>
    </ul>
  </div>
  <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-slate-600">
    <h4 className="text-sm font-semibold mb-3 text-slate-700">Actionable Insights</h4>
    <ul className="text-sm text-muted-foreground space-y-2">
      <li>• Focus on high-frequency, low-retention segments</li>
      <li>• Target low-usage customers for engagement</li>
      <li>• Optimize pricing for monetary value growth</li>
    </ul>
  </div>
</div>
  </CardContent>

  </CardContent>
</Card>
  )
}

const InterventionSimulator = ({ baseClv }: { baseClv: number }) => {
  const [improvementRetention, setImprovementRetention] = useState(10)
  const [improvementFrequency, setImprovementFrequency] = useState(10)
  const [improvementMonetary, setImprovementMonetary] = useState(10)
  const [cost, setCost] = useState(50000)

  const impact = useMemo(() => {
    const newRetention = 85 * (1 + improvementRetention / 100)
    const newFrequency = 2.5 * (1 + improvementFrequency / 100)
    const newMonetary = baseClv / 12 * (1 + improvementMonetary / 100)
    
    const newClv = newFrequency * newMonetary * (newRetention / (100 - newRetention))
    const clvIncrease = newClv - baseClv
    const roi = (clvIncrease * 1000 - cost) / cost // Assuming 1000 customers
    
    return {
      newClv,
      clvIncrease,
      roi: roi * 100,
      profitable: roi > 0
    }
  }, [improvementRetention, improvementFrequency, improvementMonetary, cost, baseClv])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Simulator</CardTitle>
        <CardDescription>
          Simulate the impact of different strategies on CLV and ROI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Retention Improvement (%)</label>
              <Input 
                type="number" 
                value={improvementRetention} 
                onChange={(e) => setImprovementRetention(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Frequency Improvement (%)</label>
              <Input 
                type="number" 
                value={improvementFrequency} 
                onChange={(e) => setImprovementFrequency(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Monetary Value Improvement (%)</label>
              <Input 
                type="number" 
                value={improvementMonetary} 
                onChange={(e) => setImprovementMonetary(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Intervention Cost ($)</label>
              <Input 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current CLV</p>
              <p className="text-2xl font-bold">{formatCurrency(baseClv)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Projected CLV</p>
              <p className="text-2xl font-bold">{formatCurrency(impact.newClv)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">CLV Increase</p>
              <p className="text-2xl font-bold">+{formatCurrency(impact.clvIncrease)}</p>
            </div>
            <div className={`p-4 rounded-lg ${impact.profitable ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm">Projected ROI</p>
              <p className={`text-2xl font-bold ${impact.profitable ? 'text-green-800' : 'text-red-800'}`}>
                {impact.roi.toFixed(1)}%
              </p>
              <p className="text-xs">{impact.profitable ? 'Profitable' : 'Not Profitable'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SeasonalityAnalysis = ({ data }: { data: any[] }) => {
  const seasonalityData = useMemo(() => {
    return data.map((item, index) => {
      // Simulate seasonal pattern
      const seasonalFactor = 1 + 0.2 * Math.sin(index / 52 * 2 * Math.PI) // Annual cycle
      return {
        period: item.fiscalWeek,
        actual: item.clv,
        trend: item.clv * 0.95 + (index * 5), // Simulated trend
        seasonal: item.clv * seasonalFactor,
      }
    })
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonality Analysis</CardTitle>
        <CardDescription>
          Identifying recurring patterns in customer value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={seasonalityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#4f46e5"
                strokeWidth={2}
                name="Actual CLV"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#cbd5e1"
                strokeWidth={2}
                name="Trend"
                dot={false}
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="seasonal"
                stroke="#ff7300"
                strokeWidth={2}
                name="Seasonal Pattern"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomerEquityCalculator = ({ data }: { data: any[] }) => {
  const equity = useMemo(() => {
    const totalClv = data.reduce((sum, customer) => sum + customer.clv, 0)
    const avgRetention = calculateMean(data.map(d => d.retention || 85))
    const discountRate = 0.1 // 10% discount rate
    
    // Simplified customer equity calculation
    const equity = totalClv * (avgRetention / 100) / (1 + discountRate - (avgRetention / 100))
    
    return {
      totalClv,
      avgRetention,
      discountRate,
      equity
    }
  }, [data])

  return (
   <Card>
  <CardHeader>
    <CardTitle>Customer Equity Calculation</CardTitle>
    <CardDescription>
      Total discounted lifetime value of your customer base
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">Sum of CLV</p>
        <p className="text-xl font-bold">{formatCurrency(equity.totalClv)}</p>
      </div>
    
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">Avg Retention</p>
        <p className="text-xl font-bold">{equity.avgRetention.toFixed(1)}%</p>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800">Discount Rate</p>
        <p className="text-xl font-bold">{(equity.discountRate * 100).toFixed(1)}%</p>
      </div>
      <div className="text-center p-3 bg-amber-50 rounded-lg">
        <p className="text-sm text-amber-800">Customer Equity</p>
        <p className="text-xl font-bold">{formatCurrency(equity.equity)}</p>
      </div>
    </div>
   
    <div className="p-3 bg-muted rounded-lg">
      <h4 className="text-sm font-semibold mb-2">Calculation Formula</h4>
      <p className="text-sm text-muted-foreground">
        Customer Equity = Σ(CLV) × (Retention Rate) / (1 + Discount Rate - Retention Rate)
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        This calculation estimates the total net present value of all future cash flows from your current customer base,
        accounting for retention rates and the time value of money.
      </p>
    </div>
  </CardContent>
</Card>
  )
}

// ————————————————————————
// Existing Components (with minor updates)
// ————————————————————————

const KPIOverview = ({ data, modelData }: { data: any[]; modelData: any }) => {
  const kpis = useMemo(() => {
    const clvValues = data.map(d => d.clv).filter(v => v !== null)
    const currentClv = clvValues[clvValues.length - 1] || 0
    const previousClv = clvValues[clvValues.length - 2] || 0
    const change = ((currentClv - previousClv) / previousClv) * 100
    
    const cacValues = data.map(d => d.cac).filter(v => v !== null)
    const currentCac = cacValues[cacValues.length - 1] || 0
    
    const ltvCacRatio = currentCac > 0 ? currentClv / currentCac : 0
    
    const paybackPeriod = currentCac > 0 ? currentCac / (currentClv * 0.1) : 0 // Assuming 10% monthly revenue
    
    return {
      clv: currentClv,
      clvChange: isFinite(change) ? change : 0,
      cac: currentCac,
      ltvCacRatio,
      paybackPeriod,
      min: Math.min(...clvValues),
      max: Math.max(...clvValues),
      heterogeneity: modelData.heterogeneityIndex,
      predictedClv: modelData.predictedClv,
    }
  }, [data, modelData])

  const isPositive = kpis.clvChange >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.clv)}</div>
          <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{kpis.clvChange.toFixed(1)}% from previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Predicted CLV</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.predictedClv)}</div>
          <p className="text-xs text-muted-foreground">
            Model-based estimation
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">LTV:CAC Ratio</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.ltvCacRatio.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            {kpis.ltvCacRatio > 3 ? 'Healthy' : kpis.ltvCacRatio > 1 ? 'Acceptable' : 'Concerning'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Heterogeneity Index</CardTitle>
          <Sigma className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.heterogeneity.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {kpis.heterogeneity > 0.7 ? 'High variance' : kpis.heterogeneity > 0.4 ? 'Moderate variance' : 'Low variance'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.paybackPeriod.toFixed(1)} mos</div>
          <p className="text-xs text-muted-foreground">
            Months to recover CAC
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
const StatisticalInsights = ({
  data,
  metric,
  setMetric,
  timeframe,
}: {
  data: any[]
  metric: string
  setMetric: (value: string) => void
  timeframe: string
}) => {
const getMetricValue = (d, metric) => {
    if (metric === 'mrr') {
      // Convert weekly revenue to monthly (multiply by ~4.33 weeks per month)
      return d.revenue * 4.33;
    }
    if (metric === 'revenue') {
    // Total revenue = revenue per customer * number of customers
    return d.revenue * d.customers;
  }    
    return d[metric];
  };
  const stats = useMemo(() => {
    const values = data.map(d => getMetricValue(d, metric)).filter(v => v !== null && v !== undefined && !isNaN(v))
    
    if (values.length === 0) {
      return {
        mean: 0,
        median: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        trend: 0,
      }
    }

    const sortedValues = [...values].sort((a, b) => a - b)
    return {
      mean: calculateMean(values),
      median: sortedValues[Math.floor(sortedValues.length / 2)],
      stdDev: calculateStandardDeviation(values),
      min: Math.min(...values),
      max: Math.max(...values),
      trend: calculateTrend(values),
    }
  }, [data, metric])

  const formatValue = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value === null || value === undefined) {
      return '0'
    }
    
    if (metric === 'retention' || metric === 'churn') {
      return `${value.toFixed(1)}%`
    }
    
    if (metric === 'customers') {
      return value.toLocaleString()
    }
    
    return formatCurrency(value)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{metricLabels[metric] || metric.toUpperCase()} Metrics</CardTitle>
            <CardDescription>
              Performance summary 
            </CardDescription>
          </div>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clv">CLV</SelectItem>
              <SelectItem value="cac">CAC</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="mrr">MRR</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
              <SelectItem value="churn">Churn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Mean</p>
          <p className="text-2xl font-bold">{formatValue(stats.mean)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Median</p>
          <p className="text-2xl font-bold">{formatValue(stats.median)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Std Dev</p>
          <p className="text-2xl font-bold">{formatValue(stats.stdDev)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Range</p>
          <p className="text-lg font-bold">{formatValue(stats.min)} - {formatValue(stats.max)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trend</p>
          <p className="text-2xl font-bold">{stats.trend.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  )
}


const CLVHeterogeneityChart = ({ modelData }: { modelData: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Value Heterogeneity</CardTitle>
        <CardDescription>
          Distribution of customer lifetime values showing statistical heterogeneity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={modelData.valueDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="value" 
                label={{ value: 'Customer Lifetime Value', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => [Number(value).toFixed(4), 'Density']} />
              <Legend />
              <Bar
                dataKey="density"
                fill="#8884d8"
                name="Empirical Distribution"
                fillOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="gamma"
                stroke="#ff7300"
                strokeWidth={2}
                name="Gamma Distribution Fit"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Gamma Shape (α)</p>
            <p className="text-xl font-bold">{modelData.gammaParams.shape.toFixed(3)}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Gamma Scale (β)</p>
            <p className="text-xl font-bold">{modelData.gammaParams.scale.toFixed(3)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ProbabilisticModels = ({ modelData }: { modelData: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Probabilistic CLV Models</CardTitle>
        <CardDescription>
          BG/NBD and Gamma-Gamma model parameters for customer lifetime value prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">BG/NBD Model Parameters</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">r (Shape)</span>
                <span className="font-bold">{modelData.bgnbdParams.r.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">α (Shape)</span>
                <span className="font-bold">{modelData.bgnbdParams.alpha.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">a (Shape)</span>
                <span className="font-bold">{modelData.bgnbdParams.a.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">b (Shape)</span>
                <span className="font-bold">{modelData.bgnbdParams.b.toFixed(3)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Gamma-Gamma Model Parameters</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">p (Shape)</span>
                <span className="font-bold">{modelData.ggParams.p.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">q (Shape)</span>
                <span className="font-bold">{modelData.ggParams.q.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">γ (Scale)</span>
                <span className="font-bold">{modelData.ggParams.gamma.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Model Interpretation</h4>
          <p className="text-sm text-muted-foreground">
            The BG/NBD model estimates purchase frequency and dropout rate, while the Gamma-Gamma model
            estimates monetary value. Combined, they provide a robust prediction of customer lifetime value
            accounting for heterogeneity in customer behavior.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const CLVPredictionChart = ({ modelData }: { modelData: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV Prediction Over Time</CardTitle>
        <CardDescription>
          Projected customer lifetime value with confidence intervals based on probabilistic models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={modelData.prediction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.3}
                name="95% Confidence Upper"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.3}
                name="95% Confidence Lower"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#4f46e5"
                strokeWidth={3}
                name="Predicted CLV"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomerSegmentationMatrix = ({ modelData }: { modelData: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV-Based Customer Segmentation</CardTitle>
        <CardDescription>
          Four-quadrant matrix for strategic customer management based on predicted value and loyalty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="frequency" 
                name="Purchase Frequency" 
                label={{ value: 'Purchase Frequency', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                type="number" 
                dataKey="value" 
                name="Monetary Value" 
                label={{ value: 'Monetary Value', angle: -90, position: 'insideLeft' }} 
              />
              <ZAxis 
                type="number" 
                dataKey="clv" 
                range={[50, 300]} 
                name="CLV" 
              />
              <Tooltip 
                formatter={(value, name) => 
                  name === 'clv' ? [formatCurrency(Number(value)), 'CLV'] : 
                  name === 'value' ? [formatCurrency(Number(value)), 'Avg Value'] : 
                  [Number(value).toFixed(1), 'Frequency']
                } 
                cursor={{ strokeDasharray: '3 3' }} 
              />
              <Legend />
              <Scatter 
                name="Champions" 
                data={modelData.segments.champions} 
                fill="#00C49F" 
              />
              <Scatter 
                name="Loyal Customers" 
                data={modelData.segments.loyal} 
                fill="#0088FE" 
              />
              <Scatter 
                name="At Risk" 
                data={modelData.segments.atRisk} 
                fill="#FFBB28" 
              />
              <Scatter 
                name="Need Attention" 
                data={modelData.segments.needAttention} 
                fill="#FF8042" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-green-100 rounded">
            <p className="font-semibold text-green-800">Champions</p>
            <p className="text-xs">High Value, High Frequency</p>
          </div>
          <div className="text-center p-2 bg-blue-100 rounded">
            <p className="font-semibold text-blue-800">Loyal Customers</p>
            <p className="text-xs">High Value, Lower Frequency</p>
          </div>
          <div className="text-center p-2 bg-yellow-100 rounded">
            <p className="font-semibold text-yellow-800">At Risk</p>
            <p className="text-xs">High Frequency, Lower Value</p>
          </div>
          <div className="text-center p-2 bg-orange-100 rounded">
            <p className="font-semibold text-orange-800">Need Attention</p>
            <p className="text-xs">Low Value, Low Frequency</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CLVDriversAnalysis = ({ data }: { data: any[] }) => {
  const drivers = useMemo(() => {
    const planData = [
      { plan: 'Basic', avgClv: 1200, customers: data.filter(d => d.plan === 'Basic').length },
      { plan: 'Pro', avgClv: 2800, customers: data.filter(d => d.plan === 'Pro').length },
      { plan: 'Enterprise', avgClv: 7500, customers: data.filter(d => d.plan === 'Enterprise').length },
    ]
    
    const usageData = [
      { usage: 'Low', avgClv: 900, customers: data.filter(d => d.usageScore < 33).length },
      { usage: 'Medium', avgClv: 2200, customers: data.filter(d => d.usageScore >= 33 && d.usageScore < 66).length },
      { usage: 'High', avgClv: 4500, customers: data.filter(d => d.usageScore >= 66).length },
    ]
    
    return { planData, usageData }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV Drivers Analysis</CardTitle>
        <CardDescription>
          Factors influencing Customer Lifetime Value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">By Subscription Plan</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drivers.planData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="plan" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => 
                    name === 'avgClv' ? [formatCurrency(Number(value)), 'Average CLV'] : [value, 'Customers']
                  } />
                  <Legend />
                  <Bar dataKey="avgClv" fill="#4f46e5" name="Average CLV" />
                  <Bar dataKey="customers" fill="#cbd5e1" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">By Usage Level</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drivers.usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="usage" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => 
                    name === 'avgClv' ? [formatCurrency(Number(value)), 'Average CLV'] : [value, 'Customers']
                  } />
                  <Legend />
                  <Bar dataKey="avgClv" fill="#00C49F" name="Average CLV" />
                  <Bar dataKey="customers" fill="#cbd5e1" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PatternRecognitionChart = ({
  data,
  metric,
}: {
  data: any[]
  metric: string
}) => {
  const processedData = useMemo(() => {
    const values = data.map(d => d[metric])
    const mean = calculateMean(values)
    const stdDev = calculateStandardDeviation(values)

    return data.map(d => ({
      ...d,
      isAnomaly: Math.abs(d[metric] - mean) > 2 * stdDev,
    }))
  }, [data, metric])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern Recognition</CardTitle>
         <CardDescription>
          Detected anomalies in {metricLabels[metric] || metric.toUpperCase()} distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), metricLabels[metric]]} />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                fill="#4f46e5"
                stroke="#4f46e5"
                fillOpacity={0.1}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const PredictiveAnalytics = ({
  historicalData,
  timeframe,
  metric,
}: {
  historicalData: any[]
  timeframe: string
  metric: string
}) => {
  const projectedData = useMemo(() => {
    const currentPeriod = historicalData.length
    const trend = calculateTrend(historicalData.map(d => d[metric]))
    const base = historicalData[historicalData.length - 1]?.[metric] || 1000

    return Array.from({ length: 12 }).map((_, i) => {
      const index = currentPeriod + i
      const predictedValue = base * Math.pow(1 + trend / 100, (i + 1) / 4)
      return {
        fiscalWeek: formatTimeLabel(index, timeframe),
        predicted: predictedValue,
        lowerBound: predictedValue * 0.9,
        upperBound: predictedValue * 1.1,
      }
    })
  }, [historicalData, timeframe, metric])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
        <CardDescription>
          Forecasts based on {metricLabels[metric] || metric.toUpperCase()} with confidence bands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={projectedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.2}
                name="Confidence Interval"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.2}
                hide
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#4f46e5"
                strokeWidth={2}
                name={`Predicted ${metric.toUpperCase()}`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 text-right">
          <Button
            variant="outline"
            onClick={() => exportCSV(projectedData, 'predicted_forecast.csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
const CustomerSegmentation = ({ data }: { data: CustomerData[] }) => {
  const analysis = useMemo(() => {
    if (!data.length) return null;

    const values = data.map(d => d.clv).sort((a, b) => b - a);
    const total = values.length;
    
    // Use quartiles for more meaningful segmentation
    const q1 = values[Math.floor(total * 0.25)];
    const q3 = values[Math.floor(total * 0.75)];
    const median = values[Math.floor(total * 0.5)];
    
    const segments = [
      {
        name: 'Champions',
        icon: '👑',
        description: 'Top 25% highest value customers',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `> ${formatCurrency(q1)}`,
        color: '#10B981',
        action: 'Reward & retain with VIP treatment'
      },
      {
        name: 'Loyal Customers',
        icon: '💎',
        description: 'Above median CLV, reliable spenders',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `${formatCurrency(median)} - ${formatCurrency(q1)}`,
        color: '#3B82F6',
        action: 'Cross-sell & upsell opportunities'
      },
      {
        name: 'Potential Loyalists',
        icon: '📈',
        description: 'Below median, room for growth',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `${formatCurrency(q3)} - ${formatCurrency(median)}`,
        color: '#F59E0B',
        action: 'Targeted engagement campaigns'
      },
      {
        name: 'At Risk',
        icon: '⚠️',
        description: 'Bottom 25%, needs attention',
        count: total - Math.floor(total * 0.75),
        percentage: 25,
        threshold: `< ${formatCurrency(q3)}`,
        color: '#EF4444',
        action: 'Win-back campaigns & support'
      }
    ];

    const totalValue = values.reduce((sum, val) => sum + val, 0);
    const avgCLV = totalValue / total;

    return { segments, totalValue, avgCLV, total };
  }, [data]);

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>No customer data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Value Segments
        </CardTitle>
        <CardDescription>
          Strategic segmentation of {analysis.total.toLocaleString()} customers by CLV quartiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.totalValue)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Customer Value</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(analysis.avgCLV)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Average CLV</p>
          </div>
        </div>

        {/* Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.segments.map((segment, index) => (
            <div 
              key={segment.name} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{segment.icon}</span>
                  <h3 className="font-semibold">{segment.name}</h3>
                </div>
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: `${segment.color}20`, color: segment.color }}
                >
                  {segment.percentage}%
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customers</span>
                  <span className="font-medium">{segment.count.toLocaleString()}</span>
                </div>
                <Progress 
                  value={segment.percentage} 
                  className="h-2"
                  style={{ 
                    background: `${segment.color}20`,
                  }}
                />
                <div className="text-xs text-gray-500">
                  CLV Range: {segment.threshold}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{segment.description}</p>
              
              <div className="text-xs p-2 bg-gray-50 rounded border-l-2" 
                   style={{ borderLeftColor: segment.color }}>
                <strong>Action:</strong> {segment.action}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Insights */}
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-medium text-blue-900 mb-2">💡 Key Insights</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Focus retention efforts on Champions ({analysis.segments[0].count} customers)</li>
            <li>• {analysis.segments[2].count} customers have growth potential</li>
            <li>• {analysis.segments[3].count} at-risk customers need immediate attention</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Main CLV Dashboard Page
// ————————————————————————

export default function CLVPage() {
  const customers = useMemo(() => generateFakeCustomers(365), [])
   const [dateRange, setDateRange] = useState({ start: '', end: '' })
   const [timeframe, setTimeframe] = useState('6m') // or whatever default value you want
  const [metric, setMetric] = useState('clv')
  const [segmentFilter, setSegmentFilter] = useState('all')

  const clvData = useMemo(() => {
    let length = 52
    if (timeframe === 'daily') length = 90
    else if (timeframe === 'monthly') length = 12

    return customers.slice(0, length).map((c, i) => {
      const customerSeed = 12345 + i
      let seedCounter = customerSeed
      const random = () => seededRandom(seedCounter++)

      return {
        fiscalWeek: formatTimeLabel(i, timeframe),
        clv: c.clv,
        cac: c.clv * (0.2 + random() * 0.3),
        revenue: c.clv * 0.75 + random() * 50,
        baseline: c.clv * 0.95 + random() * 50,
        plan: c.plan,
        usageScore: c.usageScore,
        customers: Math.floor(50 + random() * 50),
        retention: 85 + random() * 15,
        churn: 5 + random() * 10,
        frequency: 2 + random() * 2, // Added for CLV decomposition
        monetary: c.clv / 12, // Added for CLV decomposition
      }
    })
  }, [timeframe, customers])

  const modelData = useMemo(() => generateCLVModelData(customers), [customers])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Lifetime Value Analysis</h1>
          <p className="text-muted-foreground">
            Advanced probabilistic modeling of customer value with heterogeneity analysis
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

    
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex overflow-x-auto md:grid md:grid-cols-6 w-full">  
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>          
          <TabsTrigger value="heterogeneity">Heterogeneity</TabsTrigger>
          <TabsTrigger value="segments">Segmentation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Models</TabsTrigger>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <KPIOverview data={clvData} modelData={modelData} />
          <StatisticalInsights data={clvData} metric={metric} setMetric={setMetric} />
          <CLVDriversAnalysis data={clvData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CLVDecomposition data={clvData} />
            <CustomerEquityCalculator data={clvData} />
          </div>
        </TabsContent>

        <TabsContent value="heterogeneity">
          <CLVHeterogeneityChart modelData={modelData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProbabilisticModels modelData={modelData} />
            <ParetoAnalysis data={clvData} />
          </div>
          <CohortAnalysis data={clvData} />
        </TabsContent>

        <TabsContent value="prediction">
          <CLVPredictionChart modelData={modelData} />
          <PredictiveAnalytics 
            historicalData={clvData} 
            timeframe={timeframe} 
            metric={metric} 
          />
          <InterventionSimulator baseClv={clvData[clvData.length - 1]?.clv || 0} />
        </TabsContent>

        <TabsContent value="segments">
          <CustomerSegmentationMatrix modelData={modelData} />
          <CustomerSegmentation data={clvData} />
        </TabsContent>

   <TabsContent value="advanced" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </div>
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

  
          <PatternRecognitionChart data={clvData} metric={metric} />
          <SeasonalityAnalysis data={clvData} />
        </TabsContent>


        <TabsContent value="definitions">
          <Card>
            <CardHeader>
              <CardTitle>Definitions</CardTitle>
              <CardDescription>
                Glossary of terms used in Customer Lifetime Value analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">CLV (Customer Lifetime Value)</h4>
                <p className="text-sm text-muted-foreground">
                  The predicted net revenue attributed to the entire future relationship with a customer.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">CAC (Customer Acquisition Cost)</h4>
                <p className="text-sm text-muted-foreground">
                  The total cost of acquiring a new customer, including marketing and sales expenses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Retention Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Percentage of customers retained over a given period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Churn Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Percentage of customers lost during a specific timeframe.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">LTV:CAC Ratio</h4>
                <p className="text-sm text-muted-foreground">
                  The ratio of customer lifetime value to acquisition cost, used to evaluate efficiency of growth investments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Heterogeneity Index</h4>
                <p className="text-sm text-muted-foreground">
                  A measure of variance across customers, reflecting differences in value, frequency, and loyalty.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">BG/NBD Model</h4>
                <p className="text-sm text-muted-foreground">
                  Beta-Geometric/Negative Binomial Distribution model for estimating purchase frequency and dropout rate.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Gamma-Gamma Model</h4>
                <p className="text-sm text-muted-foreground">
                  Model for estimating monetary value of customer transactions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Customer Equity</h4>
                <p className="text-sm text-muted-foreground">
                  The total discounted lifetime values of all the firm's current and future customers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}