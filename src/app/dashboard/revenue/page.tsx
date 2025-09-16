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
  AreaChart,
  LineChart,
  BarChart,
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
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react'

// [All the existing constants, interfaces, and utility functions remain the same]
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

// Utility Functions
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

// Data Generation Functions
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

// Monte Carlo simulation for revenue forecasting
const generateMonteCarloForecast = (baseMrr: number, growthRate: number, volatility: number, periods: number, simulations: number = 1000) => {
  const results = [];
  
  for (let i = 0; i < simulations; i++) {
    const path = [];
    let current = baseMrr;
    
    for (let j = 0; j < periods; j++) {
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      current = current * (1 + growthRate * randomFactor);
      path.push(current);
    }
    
    results.push(path);
  }
  
  const percentiles = [];
  for (let i = 0; i < periods; i++) {
    const values = results.map(path => path[i]).sort((a, b) => a - b);
    percentiles.push({
      period: i + 1,
      p10: values[Math.floor(simulations * 0.10)],
      p50: values[Math.floor(simulations * 0.50)],
      p90: values[Math.floor(simulations * 0.90)],
      min: values[0],
      max: values[simulations - 1]
    });
  }
  
  return percentiles;
};

// Generate forecast data
const generateForecastData = () => {
  const baseMrr = 450000;
  const baseGrowth = 0.08;
  const volatility = 0.15;
  
  const monteCarlo = generateMonteCarloForecast(baseMrr, baseGrowth, volatility, 12);
  
  return {
    revenueForecast: monteCarlo.map((point, index) => ({
      month: `Month ${index + 1}`,
      conservative: point.p10,
      expected: point.p50,
      optimistic: point.p90,
      worstCase: point.min,
      bestCase: point.max
    })),
    churnForecast: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      current: 12 - (i * 0.8),
      withInterventions: 12 - (i * 1.2),
      goal: 8 - (i * 0.5)
    })),
    scenarioAnalysis: [
      { scenario: 'Base Case', revenue: 6850000, customers: 1650, retention: 88, probability: 60 },
      { scenario: 'Optimistic', revenue: 7820000, customers: 1850, retention: 92, probability: 25 },
      { scenario: 'Pessimistic', revenue: 5420000, customers: 1450, retention: 82, probability: 15 }
    ]
  };
};

// Custom Hooks
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

// Optimized Components
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

// [Include all other component definitions with React.memo...]

export default function RevenuePage() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showUncertainty, setShowUncertainty] = useState(true)
  
  const customers = useMemo(() => generateFakeCustomers(1000), [])
  const revenueQualityData = useMemo(() => generateRevenueQualityData(), [])
  const zipfData = useMemo(() => generateZipfAnalysis(customers), [customers])
  const bassData = useMemo(() => generateBassDiffusionData(), [])
  const entropyData = useMemo(() => generateRevenueEntropyData(customers), [customers])
  const kanoData = useMemo(() => generateKanoAnalysis(), [])
  const forecastData = useMemo(() => generateForecastData(), [])
  const rSquared = useZipfRSquared(zipfData)

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

  // Weibull data generation
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Revenue quality, forecasting, and optimization. 
          </p>
        </div>
        <div className="flex gap-4">
         
          
          <Button variant="outline" onClick={() => exportCSV(revenueQualityData, 'revenue_analytics.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex overflow-x-auto md:grid md:grid-cols-6 w-full">  
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Revenue Quality</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting & Modeling</TabsTrigger>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
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
    {/* Reduced height to be more efficient and modern */}
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={entropyData.segmentRevenue}
          // This layout puts the bars vertically, best for category names
          layout="vertical"
          margin={{ left: 60 }} // Give plenty of space for segment names
        >
          {/* CartesianGrid provides light reference lines */}
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            // Format the X-axis (the numbers) as currency
            tickFormatter={(value) => `$${value / 1000}k`} // Converts 100000 to "$100k"
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="segment" // This uses your segment names on the Y-axis
            axisLine={false}
            tickLine={false} // Removes the little ticks on the labels
          />
          {/* The Bar is the star of the show. It's easy to compare lengths. */}
          <Bar
            dataKey="revenue"
            radius={[0, 4, 4, 0]} // Rounds the right side of the bars
          >
            {entropyData.segmentRevenue.map((entry, index) => (
              // Use a more modern, appealing color palette
              <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} />
            ))}
          </Bar>
          {/* A tooltip is still essential for precise values */}
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
            // This cursor provides a highlight on hover
            cursor={{ fill: '#f3f4f6' }}
          />
          {/* Re-add a legend if you have many segments, but it's often redundant here */}
          {/* <Legend /> */}
        </BarChart>
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Diversification Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {(entropyData.diversificationIndex * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Risk reduction score</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {/* Revenue Quality Analysis */}
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
                  <ComposedChart data={revenueQualityData}>
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

          {/* Revenue Distribution Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution Laws</CardTitle>
                <CardDescription>
                  Power law analysis reveals 80/20 patterns and market dynamics
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Zipf Fit (R²)</p>
                    <p className="text-xl font-bold text-blue-600">{rSquared.toFixed(3)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">80/20 Ratio</p>
                    <p className="text-xl font-bold text-green-600">78.9/20</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-800 text-sm">Strategic Insight</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Strong power law distribution indicates natural market segmentation. 
                    Focus resources on top 20% of customers who drive ~80% of revenue.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Entropy & Diversification</CardTitle>
                <CardDescription>Risk assessment through revenue concentration analysis</CardDescription>
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
                      <p className="text-2xl font-bold text-blue-600">{(entropyData.diversificationIndex * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Risk reduction score</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Revenue Concentration</h4>
                    {[
                      { percentile: 'Top 1%', share: 23.4 },
                      { percentile: 'Top 5%', share: 45.7 },
                      { percentile: 'Top 10%', share: 61.2 },
                      { percentile: 'Top 20%', share: 78.9 },
                    ].map((item) => (
                      <div key={item.percentile} className="flex justify-between text-sm mb-2">
                        <span>{item.percentile} of customers</span>
                        <span className="font-medium">{item.share}% of revenue</span>
                      </div>
                    ))}
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
          </div>

          {/* Feature Optimization using Kano Model */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Revenue Optimization (Kano Model)</CardTitle>
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
                        {['Basic', 'Performance', 'Excitement'].map((category, index) => (
                          <Scatter 
                            key={category}
                            name={category}
                            data={kanoData.filter(d => d.category === category)}
                            fill={['#6b7280', '#3b82f6', '#10b981'][index]}
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
                                className={
                                  feature.category === 'Basic' ? 'bg-gray-100 text-gray-700' :
                                  feature.category === 'Performance' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }
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
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
           <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800">Forecast Range</h4>
                      <p className="text-lg font-bold">
                        ${Math.round(forecastData.revenueForecast[11].conservative / 1000).toLocaleString()}k - ${Math.round(forecastData.revenueForecast[11].optimistic / 1000).toLocaleString()}k
                      </p>
                      <p className="text-xs text-muted-foreground">Month 12 range</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800">Volatility</h4>
                      <p className="text-lg font-bold">±18.5%</p>
                      <p className="text-xs text-muted-foreground">Monthly variation</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800">Success Probability</h4>
                      <p className="text-lg font-bold">72%</p>
                      <p className="text-xs text-muted-foreground">Meeting targets</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

  {/* Scenario Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>Probability-weighted outcomes under different conditions</CardDescription>
            </CardHeader>
            <CardContent>
                            <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Strategic Recommendations</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Focus on customer retention to mitigate downside risk</p>
                  <p>• Invest in product development for high-value segments</p>
                  <p>• Maintain service levels to protect revenue quality</p>
                  <p>• Develop contingency plans for pessimistic scenario triggers</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {forecastData.scenarioAnalysis.map((scenario) => (
                  <Card key={scenario.scenario} className={
                    scenario.scenario === 'Optimistic' ? 'ring-2 ring-green-500' :
                    scenario.scenario === 'Pessimistic' ? 'ring-2 ring-red-500' : ''
                  }>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">{scenario.scenario}</h3>
                        <Badge variant="secondary" className="mb-4">
                          {scenario.probability}% probability
                        </Badge>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            ${(scenario.revenue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-600">Annual Revenue</div>
                          <div className="text-lg font-semibold">{scenario.customers} customers</div>
                          <div className="text-sm text-gray-600">Customer Count</div>
                          <div className="text-lg font-semibold">{scenario.retention}%</div>
                          <div className="text-sm text-gray-600">Retention Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>


            </CardContent>
          </Card>

          {/* Revenue Forecast with Uncertainty */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Revenue Forecast with Uncertainty</CardTitle>
                  <CardDescription>Monte Carlo simulation showing probable outcomes</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowUncertainty(!showUncertainty)}>
                  {showUncertainty ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showUncertainty ? 'Hide Uncertainty' : 'Show Uncertainty'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData.revenueForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`${Math.round(Number(value)).toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Area type="monotone" dataKey="expected" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Expected" />
                    {showUncertainty && (
                      <>
                        <Area type="monotone" dataKey="optimistic" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Optimistic (90%)" />
                        <Area type="monotone" dataKey="conservative" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Conservative (10%)" />
                      </>
                    )}
                    <ReferenceLine y={450000} stroke="#6b7280" strokeDasharray="3 3" label="Current" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
             
            </CardContent>
          </Card>
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
                      <p className="text-2xl font-bold text-orange-600">8</p>
                      <p className="text-xs text-muted-foreground">Maximum adoption rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

          {/* Bass Diffusion Model */}
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
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
             
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Model Interpretation</h4>
                <p className="text-sm text-muted-foreground">
                  High q/p ratio (12.7) indicates strong word-of-mouth effects. Revenue growth will peak around month 8, 
                  after which growth rate naturally declines as market saturation approaches. Focus on referral programs during early phases.
                </p>
              </div>
            </CardContent>
          </Card>


  
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
        </TabsContent>

        <TabsContent value="definitions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Revenue Quality Index (RQI)</h4>
                  <p className="text-xs text-muted-foreground">
                    Composite score measuring revenue sustainability through predictability (60%) and volatility (40%). 
                    Scores 80+ indicate excellent quality, 60-79 good, below 60 concerning.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Revenue Predictability</h4>
                  <p className="text-xs text-muted-foreground">
                    Percentage of revenue from recurring sources. Higher percentages indicate more stable, 
                    predictable cash flows. Target &gt85% for SaaS, &gt70% for marketplace models.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Revenue Volatility</h4>
                  <p className="text-xs text-muted-foreground">
                    Measure of month-to-month revenue variation. Lower volatility indicates stability. 
                    &lt15% excellent, &lt25% acceptable, &gt25% concerning for most business models.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Annual Recurring Revenue (ARR)</h4>
                  <p className="text-xs text-muted-foreground">
                    Annualized value of recurring revenue streams. Key metric for SaaS and subscription businesses 
                    to measure predictable revenue growth and business health.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Net Revenue Retention (NRR)</h4>
                  <p className="text-xs text-muted-foreground">
                    Measures revenue growth from existing customers through upsells, cross-sells, minus churn. 
                    &gt00% indicates growth from existing base, &gt110% is excellent.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistical Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Zipf's Law</h4>
                  <p className="text-xs text-muted-foreground">
                    Power law stating that the nth largest item is 1/n the size of the largest. 
                    In revenue context, predicts customer concentration patterns and 80/20 distributions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Shannon Entropy</h4>
                  <p className="text-xs text-muted-foreground">
                    Information theory measure of uncertainty/randomness. In revenue analysis, 
                    measures diversification - higher entropy indicates lower concentration risk.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Bass Diffusion Model</h4>
                  <p className="text-xs text-muted-foreground">
                    Mathematical model describing product adoption over time through innovation (p) 
                    and imitation (q) coefficients. Predicts growth curves and peak adoption timing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Weibull Distribution</h4>
                  <p className="text-xs text-muted-foreground">
                    Survival analysis model measuring time-to-event (churn). Shape parameter indicates 
                    whether hazard rate increases, decreases, or remains constant over time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Monte Carlo Simulation</h4>
                  <p className="text-xs text-muted-foreground">
                    Statistical technique using random sampling to model uncertainty and risk. 
                    Generates probability distributions for revenue forecasts under various scenarios.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Frameworks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Kano Model</h4>
                  <p className="text-xs text-muted-foreground">
                    Prioritization framework categorizing features as Basic (expected), Performance (linear satisfaction), 
                    or Excitement (unexpected delight). Guides product development and revenue optimization.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Pareto Principle (80/20 Rule)</h4>
                  <p className="text-xs text-muted-foreground">
                    Empirical observation that 80% of effects come from 20% of causes. 
                    In revenue context, typically 20% of customers drive 80% of revenue.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Customer Lifetime Value (CLV)</h4>
                  <p className="text-xs text-muted-foreground">
                    Prediction of total revenue from a customer over their entire relationship. 
                    Key metric for acquisition spending, retention investment, and segment prioritization.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Churn Rate</h4>
                  <p className="text-xs text-muted-foreground">
                    Percentage of customers who stop using service in a given period. 
                    Critical metric for subscription businesses - small improvements have large revenue impact.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Diversification Index</h4>
                  <p className="text-xs text-muted-foreground">
                    Ratio of actual entropy to maximum possible entropy. Measures how evenly 
                    revenue is distributed across segments. Higher values indicate lower concentration risk.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Power Law Exponent</h4>
                  <p className="text-xs text-muted-foreground">
                    In customer revenue distributions, describes steepness of concentration. 
                    Typical values around -0.8 to -1.2 indicate natural market segmentation patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">R-Squared (Coefficient of Determination)</h4>
                  <p className="text-xs text-muted-foreground">
                    Statistical measure of how well data fits a model. Values closer to 1.0 indicate 
                    better fit. Used to validate Zipf distribution and other predictive models.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Hazard Rate</h4>
                  <p className="text-xs text-muted-foreground">
                    Instantaneous probability of churn at any given time. Increasing hazard rates 
                    suggest customers become more likely to churn over time (subscription fatigue).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Confidence Intervals</h4>
                  <p className="text-xs text-muted-foreground">
                    Statistical ranges indicating uncertainty in forecasts. 90% confidence means 
                    90% probability the actual value falls within the specified range.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Academic Foundations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 text-sm mb-2">Information Theory</h4>
                    <p className="text-xs text-blue-700">
                      Claude Shannon's mathematical framework for quantifying information content and uncertainty. 
                      Applied to revenue analysis to measure portfolio diversification and concentration risk.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm mb-2">Power Law Distributions</h4>
                    <p className="text-xs text-green-700">
                      Mathematical relationships where one quantity varies as a power of another. 
                      Zipf's law reveals natural customer segmentation patterns for targeted resource allocation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm mb-2">Survival Analysis</h4>
                    <p className="text-xs text-purple-700">
                      Statistical methods for analyzing time-to-event data. Weibull modeling predicts 
                      customer lifecycle patterns and revenue timing for cash flow planning.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-sm mb-2">Behavioral Economics</h4>
                    <p className="text-xs text-orange-700">
                      Study of psychological factors in economic decisions. Kano model applies customer 
                      psychology and satisfaction curves to prioritize features for revenue optimization.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Diffusion Theory</h4>
                    <p className="text-xs text-gray-700">
                      Mathematical models of how innovations spread through populations. Bass model 
                      forecasts adoption patterns and optimal marketing timing for new products and features.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 text-sm mb-2">Stochastic Processes</h4>
                    <p className="text-xs text-red-700">
                      Mathematical models incorporating randomness over time. Monte Carlo simulations 
                      use random sampling to model uncertainty and generate probabilistic forecasts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}