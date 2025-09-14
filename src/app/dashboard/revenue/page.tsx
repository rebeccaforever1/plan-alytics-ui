// src/app/dashboard/revenue/page.tsx
'use client'

import React, { useState, useMemo, useCallback } from 'react'
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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts'

import { generateFakeCustomers } from '@/lib/fakeData'
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
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Zap,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Layers,
  Globe,
  Calculator,
  Brain,
} from 'lucide-react'

// ————————————————————————
// Constants and Type Definitions
// ————————————————————————

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEGMENTS = ['Basic', 'Pro', 'Enterprise']
const REGIONS = ['North America', 'Europe', 'Asia', 'Other']
const CHANNELS = ['Direct', 'Partner', 'Online', 'Reseller']

interface RevenueDataPoint {
  month: string
  recurringRevenue: number
  oneTimeRevenue: number
  totalRevenue: number
  predictability: number
  volatility: number
  rqi: number
  growthRate: number
  marginExpansion: number
}

interface Customer {
  id: string
  name: string
  email: string
  plan: string
  clv: number
  signupDate: string
  region: string
}

interface ZipfDataPoint {
  rank: number
  revenue: number
  expectedZipf: number
  logRank: number
  logRevenue: number
  plan: string
}

interface BassDataPoint {
  month: number
  cumulativeRevenue: number
  monthlyRevenue: number
  adoptionRate: number
  growthRate: number
  innovators: number
  imitators: number
}

interface SegmentRevenue {
  segment: string
  revenue: number
  count: number
}

interface GeoDistribution {
  region: string
  revenue: number
  customers: number
}

interface ChannelDistribution {
  channel: string
  revenue: number
  margin: number
  efficiency: number
}

interface EntropyData {
  segmentRevenue: SegmentRevenue[]
  entropy: number
  maxEntropy: number
  diversificationIndex: number
  geoDistribution: GeoDistribution[]
  channelDistribution: ChannelDistribution[]
}

interface KanoFeature {
  name: string
  category: string
  satisfaction: number
  revenue_impact: number
  implementation_cost: number
  efficiency_ratio: number
  priority_score: number
}

// ————————————————————————
// Utility Functions
// ————————————————————————

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

const getRqiInterpretation = (rqi: number): string => {
  if (rqi > 80) return 'Excellent'
  if (rqi > 60) return 'Good'
  return 'Needs Improvement'
}

const getPredictabilityInterpretation = (predictability: number): string => {
  if (predictability > 85) return 'Highly Predictable'
  if (predictability > 70) return 'Moderately Predictable'
  return 'Volatile'
}

// ————————————————————————
// Data Generation Functions
// ————————————————————————

const generateRevenueQualityData = (): RevenueDataPoint[] => {
  return MONTHS.map((month, index) => {
    const recurringRevenue = 45000 + (index * 3200) + (Math.random() * 5000)
    const oneTimeRevenue = 8000 + (Math.random() * 12000)
    const totalRevenue = recurringRevenue + oneTimeRevenue
    const predictability = (recurringRevenue / totalRevenue) * 100
    const volatility = 15 + (Math.random() * 20)
    const rqi = (predictability * 0.6) + ((100 - volatility) * 0.4)
    
    return {
      month,
      recurringRevenue,
      oneTimeRevenue,
      totalRevenue,
      predictability,
      volatility,
      rqi,
      growthRate: 8 + (Math.random() * 10),
      marginExpansion: 2 + (Math.random() * 8),
    }
  })
}

const generateZipfAnalysis = (customers: Customer[]): ZipfDataPoint[] => {
  const sortedCustomers = [...customers].sort((a, b) => b.clv - a.clv)
  
  return sortedCustomers.slice(0, 100).map((customer, index) => ({
    rank: index + 1,
    revenue: customer.clv,
    expectedZipf: sortedCustomers[0].clv / (index + 1),
    logRank: Math.log(index + 1),
    logRevenue: Math.log(customer.clv),
    plan: customer.plan,
  }))
}

const generateBassDiffusionData = (): BassDataPoint[] => {
  const p = 0.03
  const q = 0.38
  const m = 10000
  
  return Array.from({ length: 24 }, (_, t) => {
    const time = t + 1
    const adoption = m * (1 - Math.exp(-(p + q) * time)) / (1 + (q/p) * Math.exp(-(p + q) * time))
    const revenue = adoption * 150
    const prevAdoption = t > 0 ? 
      m * (1 - Math.exp(-(p + q) * t)) / (1 + (q/p) * Math.exp(-(p + q) * t)) : 0
    const growthRate = t > 0 ? ((adoption - prevAdoption) / adoption) * 100 : 0
    
    return {
      month: time,
      cumulativeRevenue: revenue,
      monthlyRevenue: t > 0 ? revenue - (prevAdoption * 150) : revenue,
      adoptionRate: (adoption / m) * 100,
      growthRate,
      innovators: adoption * 0.025,
      imitators: adoption * 0.975,
    }
  })
}

const generateRevenueEntropyData = (customers: Customer[]): EntropyData => {
  const segmentRevenue = SEGMENTS.map(segment => {
    const segmentCustomers = customers.filter(c => c.plan === segment)
    const revenue = segmentCustomers.reduce((sum, c) => sum + c.clv, 0)
    return { segment, revenue, count: segmentCustomers.length }
  })
  
  const totalRevenue = segmentRevenue.reduce((sum, s) => sum + s.revenue, 0)
  
  const entropy = -segmentRevenue.reduce((sum, s) => {
    const p = s.revenue / totalRevenue
    return sum + (p > 0 ? p * Math.log2(p) : 0)
  }, 0)
  
  const geoDistribution = REGIONS.map(region => ({
    region,
    revenue: totalRevenue * (0.1 + Math.random() * 0.4),
    customers: Math.floor(customers.length * (0.1 + Math.random() * 0.4)),
  }))
  
  const channelDistribution = CHANNELS.map(channel => ({
    channel,
    revenue: totalRevenue * (0.15 + Math.random() * 0.3),
    margin: 15 + Math.random() * 25,
    efficiency: 60 + Math.random() * 35,
  }))
  
  return {
    segmentRevenue,
    entropy,
    maxEntropy: Math.log2(SEGMENTS.length),
    diversificationIndex: entropy / Math.log2(SEGMENTS.length),
    geoDistribution,
    channelDistribution,
  }
}

const generateKanoAnalysis = (): KanoFeature[] => {
  const features = [
    { name: 'Core Dashboard', category: 'Basic', satisfaction: 85, revenue_impact: 45, implementation_cost: 15 },
    { name: 'Advanced Analytics', category: 'Performance', satisfaction: 92, revenue_impact: 78, implementation_cost: 65 },
    { name: 'API Access', category: 'Performance', satisfaction: 88, revenue_impact: 85, implementation_cost: 45 },
    { name: 'White Labeling', category: 'Excitement', satisfaction: 94, revenue_impact: 95, implementation_cost: 85 },
    { name: 'Mobile App', category: 'Performance', satisfaction: 89, revenue_impact: 72, implementation_cost: 55 },
    { name: 'AI Insights', category: 'Excitement', satisfaction: 96, revenue_impact: 88, implementation_cost: 90 },
    { name: 'Data Export', category: 'Basic', satisfaction: 78, revenue_impact: 35, implementation_cost: 20 },
    { name: 'Custom Integrations', category: 'Performance', satisfaction: 91, revenue_impact: 82, implementation_cost: 70 },
  ]
  
  return features.map(feature => ({
    ...feature,
    efficiency_ratio: feature.revenue_impact / feature.implementation_cost,
    priority_score: (feature.satisfaction * 0.3) + (feature.revenue_impact * 0.5) + ((100 - feature.implementation_cost) * 0.2),
  }))
}

// ————————————————————————
// Custom Hooks
// ————————————————————————

const useRevenueKPIs = (data: RevenueDataPoint[]) => {
  return useMemo(() => {
    if (data.length < 2) return null
    
    const currentMonth = data[data.length - 1]
    const previousMonth = data[data.length - 2]
    
    const totalRevenue = currentMonth.totalRevenue
    const revenueGrowth = ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100
    const rqi = currentMonth.rqi
    const predictability = currentMonth.predictability

    const arr = currentMonth.recurringRevenue * 12
    const nrr = 108 + Math.random() * 15

    return {
      totalRevenue,
      revenueGrowth,
      arr,
      nrr,
      rqi,
      predictability,
    }
  }, [data])
}

const useZipfRSquared = (zipfData: ZipfDataPoint[]) => {
  return useMemo(() => {
    const n = zipfData.length
    const sumX = zipfData.reduce((sum, d) => sum + d.logRank, 0)
    const sumY = zipfData.reduce((sum, d) => sum + d.logRevenue, 0)
    const sumXY = zipfData.reduce((sum, d) => sum + (d.logRank * d.logRevenue), 0)
    const sumXX = zipfData.reduce((sum, d) => sum + (d.logRank * d.logRank), 0)
    const sumYY = zipfData.reduce((sum, d) => sum + (d.logRevenue * d.logRevenue), 0)
    
    const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    return correlation * correlation
  }, [zipfData])
}

// ————————————————————————
// Optimized Components
// ————————————————————————

const RevenueKPIOverview = React.memo(({ data }: { data: RevenueDataPoint[] }) => {
  const kpis = useRevenueKPIs(data)
  
  if (!kpis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(kpis.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center ${kpis.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpis.revenueGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(kpis.revenueGrowth).toFixed(1)}% vs last month
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Recurring Revenue</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(kpis.arr)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-blue-500 flex items-center">
              <Target className="h-3 w-3 mr-1" />
              NRR: {kpis.nrr.toFixed(1)}%
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Quality Index</CardTitle>
          <Brain className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{kpis.rqi.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-purple-500">
              {getRqiInterpretation(kpis.rqi)}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Predictability</CardTitle>
          <Calculator className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{formatPercentage(kpis.predictability)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-orange-500">
              {getPredictabilityInterpretation(kpis.predictability)}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
})

RevenueKPIOverview.displayName = 'RevenueKPIOverview'

const RevenueQualityChart = React.memo(({ data }: { data: RevenueDataPoint[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Quality Analysis</CardTitle>
        <CardDescription>
          Academic framework measuring revenue sustainability through predictability and composition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => 
                name === 'rqi' ? [Number(value).toFixed(1), 'RQI Score'] :
                name === 'predictability' ? [Number(value).toFixed(1) + '%', 'Predictability'] :
                name === 'volatility' ? [Number(value).toFixed(1) + '%', 'Volatility'] :
                [formatCurrency(Number(value)), name]
              } />
              <Legend />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="recurringRevenue" 
                stackId="1" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.7}
                name="Recurring Revenue"
              />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="oneTimeRevenue" 
                stackId="1" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.7}
                name="One-time Revenue"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="rqi" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                name="Revenue Quality Index"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="predictability" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                name="Predictability %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground">RQI Interpretation</p>
            <p className="text-xs mt-1">80+ Excellent, 60-79 Good, Below 60 Concerning</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Predictability Target</p>
            <p className="text-xs mt-1">&gt;85% for SaaS,  &gt;70% for marketplace</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Volatility Benchmark</p>
            <p className="text-xs mt-1">&lt;15% excellent, &lt;25% acceptable</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

RevenueQualityChart.displayName = 'RevenueQualityChart'

const ZipfLawAnalysis = React.memo(({ zipfData }: { zipfData: ZipfDataPoint[] }) => {
  const rSquared = useZipfRSquared(zipfData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zipf's Law Revenue Distribution</CardTitle>
        <CardDescription>
          Power law analysis of customer revenue concentration - predicts 80/20 patterns and market dynamics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Revenue Rank Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={zipfData.slice(0, 50)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="rank" 
                    scale="log" 
                    domain={['dataMin', 'dataMax']}
                    label={{ value: 'Customer Rank (log)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="revenue" 
                    scale="log" 
                    domain={['dataMin', 'dataMax']}
                    label={{ value: 'Revenue (log)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value, name) => 
                    name === 'revenue' ? [formatCurrency(Number(value)), 'Revenue'] : 
                    [Number(value), 'Rank']
                  } />
                  <Scatter name="Actual" dataKey="revenue" fill="#3b82f6" />
                  <Scatter name="Zipf Prediction" dataKey="expectedZipf" fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Distribution Analysis</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Zipf Fit (R²)</p>
                  <p className="text-xl font-bold text-blue-600">{rSquared.toFixed(3)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Power Law Exponent</p>
                  <p className="text-xl font-bold text-green-600">-0.87</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Revenue Concentration</h4>
                {[
                  { percentile: 'Top 1%', share: 23.4 },
                  { percentile: 'Top 5%', share: 45.7 },
                  { percentile: 'Top 10%', share: 61.2 },
                  { percentile: 'Top 20%', share: 78.9 },
                ].map((item) => (
                  <div key={item.percentile} className="flex justify-between text-sm">
                    <span>{item.percentile} of customers</span>
                    <span className="font-medium">{item.share}% of revenue</span>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-800 text-sm">Strategic Insight</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Strong Zipf distribution (R² &gt; 0.85) indicates natural market segmentation. 
                  Focus resources on top 20% of customers who drive ~80% of revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ZipfLawAnalysis.displayName = 'ZipfLawAnalysis'

const BassDiffusionModel = React.memo(({ bassData }: { bassData: BassDataPoint[] }) => {
  const peakMonth = useMemo(() => 
    bassData.reduce((max, current) => 
      current.monthlyRevenue > max.monthlyRevenue ? current : max
    ), [bassData]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bass Diffusion Model - Revenue Growth Prediction</CardTitle>
        <CardDescription>
          Academic framework modeling innovation adoption and revenue growth through innovators and imitators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={bassData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Growth Rate (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value, name) => 
                name.includes('Revenue') ? [formatCurrency(Number(value)), name] : 
                [Number(value).toFixed(1) + '%', name]
              } />
              <Legend />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="innovators" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Innovator Revenue"
              />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="imitators" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Imitator Revenue"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="growthRate" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                name="Growth Rate %"
              />
              <ReferenceLine x={peakMonth.month} stroke="#ef4444" strokeDasharray="5 5" label="Peak Growth" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-blue-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <h4 className="font-semibold text-blue-800">Innovation Coefficient (p)</h4>
                <p className="text-2xl font-bold text-blue-600">0.030</p>
                <p className="text-xs text-muted-foreground">External influence strength</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-green-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <h4 className="font-semibold text-green-800">Imitation Coefficient (q)</h4>
                <p className="text-2xl font-bold text-green-600">0.380</p>
                <p className="text-xs text-muted-foreground">Word-of-mouth effect</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-orange-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <h4 className="font-semibold text-orange-800">Peak Growth Month</h4>
                <p className="text-2xl font-bold text-orange-600">{peakMonth.month}</p>
                <p className="text-xs text-muted-foreground">Maximum adoption rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Model Interpretation</h4>
          <p className="text-sm text-muted-foreground">
            High q/p ratio (12.7) indicates strong word-of-mouth effects. Revenue growth will peak around month {peakMonth.month}, 
            after which growth rate naturally declines as market saturation approaches. Focus on referral programs during early phases.
          </p>
        </div>
      </CardContent>
    </Card>
  )
})

BassDiffusionModel.displayName = 'BassDiffusionModel'

const RevenueEntropyDashboard = React.memo(({ entropyData }: { entropyData: EntropyData }) => {
  const diversificationHealth = (entropyData.diversificationIndex * 100).toFixed(1)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Entropy Analysis</CardTitle>
          <CardDescription>
            Information theory applied to revenue diversification - measures risk through concentration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Shannon Entropy</p>
                <p className="text-2xl font-bold text-purple-600">{entropyData.entropy.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground">Information bits</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Diversification Index</p>
                <p className="text-2xl font-bold text-blue-600">{diversificationHealth}%</p>
                <p className="text-xs text-muted-foreground">Risk reduction score</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Segment Revenue Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={entropyData.segmentRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, revenue }) => `${segment}: ${((revenue / entropyData.segmentRevenue.reduce((sum, s) => sum + s.revenue, 0)) * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {entropyData.segmentRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm">Risk Assessment</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {entropyData.diversificationIndex > 0.8 ? 
                  'Excellent diversification - low concentration risk' :
                  entropyData.diversificationIndex > 0.6 ?
                  'Good diversification - moderate risk' :
                  'High concentration risk - consider diversification strategies'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic & Channel Distribution</CardTitle>
          <CardDescription>Revenue source diversification analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Geographic Revenue</h4>
              <div className="space-y-2">
                {entropyData.geoDistribution.map((geo, index) => (
                  <div key={geo.region} className="flex items-center justify-between">
                    <span className="text-sm">{geo.region}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${(geo.revenue / entropyData.geoDistribution.reduce((sum, g) => sum + g.revenue, 0)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-16">{formatCurrency(geo.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Channel Performance</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entropyData.channelDistribution.map((channel) => (
                    <TableRow key={channel.channel}>
                      <TableCell className="font-medium">{channel.channel}</TableCell>
                      <TableCell>{formatCurrency(channel.revenue)}</TableCell>
                      <TableCell>{channel.margin.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge variant={channel.efficiency > 80 ? 'default' : channel.efficiency > 60 ? 'secondary' : 'destructive'}>
                          {channel.efficiency.toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

RevenueEntropyDashboard.displayName = 'RevenueEntropyDashboard'

const KanoFeatureAnalysis = React.memo(({ kanoData }: { kanoData: KanoFeature[] }) => {
  const categoryColors = {
    'Basic': '#6b7280',
    'Performance': '#3b82f6', 
    'Excitement': '#10b981'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kano Model - Feature Revenue Impact</CardTitle>
        <CardDescription>
          Academic framework prioritizing features based on customer satisfaction vs. revenue impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Satisfaction vs Revenue Impact</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={kanoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="satisfaction" 
                    domain={[70, 100]}
                    label={{ value: 'Customer Satisfaction', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="revenue_impact" 
                    domain={[30, 100]}
                    label={{ value: 'Revenue Impact', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis dataKey="implementation_cost" range={[50, 400]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-semibold">{data.name}</p>
                            <p>Satisfaction: {data.satisfaction}%</p>
                            <p>Revenue Impact: {data.revenue_impact}%</p>
                            <p>Implementation Cost: {data.implementation_cost}%</p>
                            <p>Category: {data.category}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter 
                    name="Features" 
                    dataKey="revenue_impact" 
                    fill={(entry) => categoryColors[entry.category] || '#8884d8'}
                  />
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <Scatter 
                      key={category}
                      name={category}
                      data={kanoData.filter(d => d.category === category)}
                      fill={color}
                    />
                  ))}
                  <ReferenceLine x={85} stroke="#ef4444" strokeDasharray="3 3" label="High Satisfaction" />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="High Revenue Impact" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Feature Prioritization Matrix</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority Score</TableHead>
                  <TableHead>ROI Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kanoData
                  .sort((a, b) => b.priority_score - a.priority_score)
                  .slice(0, 8)
                  .map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: `${categoryColors[feature.category]}20`, color: categoryColors[feature.category] }}
                        >
                          {feature.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{feature.priority_score.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge variant={feature.efficiency_ratio > 1.5 ? 'default' : feature.efficiency_ratio > 1 ? 'secondary' : 'destructive'}>
                          {feature.efficiency_ratio.toFixed(2)}x
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 space-y-2">
              <div className="p-2 bg-gray-50 border rounded text-xs">
                <strong>Basic:</strong> Must-have features - customers expect them but don't drive satisfaction
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <strong>Performance:</strong> Linear satisfaction increase - more is better
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                <strong>Excitement:</strong> Delight features - unexpected value that drives loyalty
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

KanoFeatureAnalysis.displayName = 'KanoFeatureAnalysis'

const AdvancedRevenueModeling = React.memo(({ customers }: { customers: Customer[] }) => {
  const weibullData = useMemo(() => {
    return Array.from({ length: 36 }, (_, t) => {
      const time = t + 1
      const shape = 1.8
      const scale = 24
      
      const survival = Math.exp(-Math.pow(time / scale, shape))
      const hazard = (shape / scale) * Math.pow(time / scale, shape - 1)
      const revenueAtRisk = survival * 50000 * (1 + time * 0.03)
      
      return {
        month: time,
        survival: survival * 100,
        hazard: hazard * 100,
        revenueAtRisk,
        cumulativeRevenue: 50000 * (1 - survival) * (1 + time * 0.03),
      }
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weibull Survival Analysis - Revenue Lifecycle</CardTitle>
        <CardDescription>
          Advanced statistical modeling of customer revenue survival and churn hazard rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={weibullData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Survival %', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value, name) => 
                name.includes('Revenue') || name.includes('revenue') ? [formatCurrency(Number(value)), name] : 
                [Number(value).toFixed(2) + '%', name]
              } />
              <Legend />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="survival" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name="Survival Rate %"
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="hazard" 
                stroke="#ef4444" 
                strokeWidth={3} 
                name="Churn Hazard %"
              />
              <Area 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenueAtRisk" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.4}
                name="Revenue at Risk"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Shape Parameter (k)</p>
            <p className="text-xl font-bold text-blue-600">1.80</p>
            <p className="text-xs text-muted-foreground">Increasing hazard rate</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Scale Parameter (λ)</p>
            <p className="text-xl font-bold text-green-600">24 mos</p>
            <p className="text-xs text-muted-foreground">Characteristic lifetime</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean Lifetime</p>
            <p className="text-xl font-bold text-orange-600">21.4 mos</p>
            <p className="text-xs text-muted-foreground">Expected duration</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Median Lifetime</p>
            <p className="text-xl font-bold text-purple-600">19.7 mos</p>
            <p className="text-xs text-muted-foreground">50% survival point</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

AdvancedRevenueModeling.displayName = 'AdvancedRevenueModeling'

// ————————————————————————
// Main Revenue Dashboard
// ————————————————————————

export default function RevenuePage() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  
  const customers = useMemo(() => generateFakeCustomers(1000), [])
  const revenueQualityData = useMemo(() => generateRevenueQualityData(), [])
  const zipfData = useMemo(() => generateZipfAnalysis(customers), [customers])
  const bassData = useMemo(() => generateBassDiffusionData(), [])
  const entropyData = useMemo(() => generateRevenueEntropyData(customers), [customers])
  const kanoData = useMemo(() => generateKanoAnalysis(), [])

  const exportCSV = useCallback((data: any[], filename: string) => {
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
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Advanced Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Academic frameworks for revenue quality, predictability, and optimization
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
          <Button variant="outline" onClick={() => exportCSV(revenueQualityData, 'revenue_analytics.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Revenue Quality</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Laws</TabsTrigger>
          <TabsTrigger value="growth">Growth Models</TabsTrigger>
          <TabsTrigger value="optimization">Feature Optimization</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <RevenueKPIOverview data={revenueQualityData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Composition Trends</CardTitle>
                <CardDescription>Monthly breakdown of recurring vs. one-time revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueQualityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="recurringRevenue" stackId="a" fill="#22c55e" name="Recurring Revenue" />
                      <Bar dataKey="oneTimeRevenue" stackId="a" fill="#f59e0b" name="One-time Revenue" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Customer Segment</CardTitle>
                <CardDescription>Performance across subscription tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={entropyData.segmentRevenue}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, revenue }) => `${segment}: ${formatCurrency(revenue)}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {entropyData.segmentRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {revenueQualityData[revenueQualityData.length - 1]?.growthRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Month-over-month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Margin Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  +{revenueQualityData[revenueQualityData.length - 1]?.marginExpansion.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Efficiency gains</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customer Concentration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">78.9%</div>
                <p className="text-xs text-muted-foreground">Top 20% revenue share</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {revenueQualityData[revenueQualityData.length - 1]?.volatility.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Stability measure</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <RevenueQualityChart data={revenueQualityData} />
          <RevenueEntropyDashboard entropyData={entropyData} />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <ZipfLawAnalysis zipfData={zipfData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pareto Principle Validation</CardTitle>
                <CardDescription>80/20 rule applied to customer revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">80/20 Ratio</p>
                      <p className="text-2xl font-bold text-blue-600">78.9/20</p>
                      <p className="text-xs text-muted-foreground">Close to Pareto ideal</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Power Law Fit</p>
                      <p className="text-2xl font-bold text-green-600">Strong</p>
                      <p className="text-xs text-muted-foreground">R² = 0.89</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800 text-sm">Information Theory Applications</h4>
                    <p className="text-xs text-blue-700">Shannon entropy measures revenue diversification risk and guides portfolio optimization strategies.</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm">Power Law Distributions</h4>
                    <p className="text-xs text-green-700">Zipf's law reveals natural customer segmentation patterns for targeted resource allocation.</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm">Survival Analysis</h4>
                    <p className="text-xs text-purple-700">Weibull modeling predicts customer lifecycle and revenue timing for cash flow planning.</p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-sm">Behavioral Economics</h4>
                    <p className="text-xs text-orange-700">Kano model prioritizes features based on customer psychology and satisfaction curves.</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 text-sm">Diffusion Theory</h4>
                    <p className="text-xs text-gray-700">Bass model forecasts adoption patterns and optimal marketing timing for new products.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <BassDiffusionModel bassData={bassData} />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <KanoFeatureAnalysis kanoData={kanoData} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedRevenueModeling customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}