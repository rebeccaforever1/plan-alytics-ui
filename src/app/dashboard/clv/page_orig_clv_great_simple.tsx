// src/app/dashboard/clv/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

import { generateFakeCustomers, generateCohortData } from '@/lib/fakeData'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
} from 'lucide-react'

// ————————————————————————
// Utility functions
// ————————————————————————

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

// ————————————————————————
// Components
// ————————————————————————

const KPIOverview = ({ data }: { data: any[] }) => {
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
    }
  }, [data])

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
          <CardTitle className="text-sm font-medium">CAC</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.cac)}</div>
          <p className="text-xs text-muted-foreground">
            Customer Acquisition Cost
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CLV Range</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.min)}-{formatCurrency(kpis.max)}</div>
          <p className="text-xs text-muted-foreground">
            Min-Max values
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const CLVTrendChart = ({ data, timeframe }: { data: any[]; timeframe: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV Trend Over Time</CardTitle>
        <CardDescription>
          Historical customer lifetime value performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="clv"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
                name="Customer Lifetime Value"
              />
              <Area
                type="monotone"
                dataKey="baseline"
                fill="#4f46e5"
                stroke="#4f46e5"
                fillOpacity={0.1}
                name="Expected Range"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const CLVSegmentation = ({ data }: { data: any[] }) => {
  const segments = useMemo(() => {
    const clvValues = data.map(d => d.clv)
    const mean = calculateMean(clvValues)
    const stdDev = calculateStandardDeviation(clvValues)
    
    return {
      low: clvValues.filter(v => v < mean - stdDev).length,
      medium: clvValues.filter(v => v >= mean - stdDev && v <= mean + stdDev).length,
      high: clvValues.filter(v => v > mean + stdDev).length,
      mean,
      stdDev,
    }
  }, [data])

  const segmentData = [
    { name: 'Low CLV', value: segments.low, color: '#FF8042' },
    { name: 'Medium CLV', value: segments.medium, color: '#FFBB28' },
    { name: 'High CLV', value: segments.high, color: '#00C49F' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV Segmentation</CardTitle>
        <CardDescription>
          Distribution of customers by lifetime value segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center">
                <Badge className="mr-2" style={{ backgroundColor: '#00C49F' }} />
                High CLV Customers
              </h4>
              <p className="text-sm text-muted-foreground">
                {segments.high} customers ({((segments.high / data.length) * 100).toFixed(1)}%)
              </p>
              <p className="text-sm">CLV &gt; {formatCurrency(segments.mean + segments.stdDev)}</p>
              <p className="text-sm text-green-500">
                Generate {((segments.high * (segments.mean + segments.stdDev * 1.5)) / data.reduce((sum, d) => sum + d.clv, 0) * 100).toFixed(0)}% of total value
              </p>
            </div>
            <div>
              <h4 className="font-medium flex items-center">
                <Badge className="mr-2" style={{ backgroundColor: '#FFBB28' }} />
                Medium CLV Customers
              </h4>
              <p className="text-sm text-muted-foreground">
                {segments.medium} customers ({((segments.medium / data.length) * 100).toFixed(1)}%)
              </p>
              <p className="text-sm">
                CLV between {formatCurrency(segments.mean - segments.stdDev)} and {formatCurrency(segments.mean + segments.stdDev)}
              </p>
            </div>
            <div>
              <h4 className="font-medium flex items-center">
                <Badge className="mr-2" style={{ backgroundColor: '#FF8042' }} />
                Low CLV Customers
              </h4>
              <p className="text-sm text-muted-foreground">
                {segments.low} customers ({((segments.low / data.length) * 100).toFixed(1)}%)
              </p>
              <p className="text-sm">CLV &lt; {formatCurrency(segments.mean - segments.stdDev)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CohortCLVAnalysis = ({ data }: { data: any[] }) => {
  const cohortData = useMemo(() => generateCohortData(data), [data])
  const [selectedCohort, setSelectedCohort] = useState(cohortData[0]?.cohort)

  const currentCohort = cohortData.find(c => c.cohort === selectedCohort) || cohortData[0]
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort CLV Analysis</CardTitle>
        <CardDescription>
          Customer lifetime value by acquisition cohort over time
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              {cohortData.map(cohort => (
                <SelectItem key={cohort.cohort} value={cohort.cohort}>
                  {cohort.cohort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">CLV by Cohort</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#8884d8" name="Total CLV" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Cohort Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cohortData.map((cohort, index) => ({
                      name: cohort.cohort,
                      value: cohort.totalRevenue,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {cohortData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PredictiveCLV = ({ historicalData, timeframe }: { historicalData: any[]; timeframe: string }) => {
  const projectedData = useMemo(() => {
    const currentPeriod = historicalData.length
    const trend = calculateTrend(historicalData.map(d => d.clv))
    const base = historicalData[historicalData.length - 1]?.clv || 1000

    return Array.from({ length: 12 }).map((_, i) => {
      const index = currentPeriod + i
      const predictedValue = base * Math.pow(1 + trend / 100, (i + 1) / 4)
      return {
        fiscalWeek: formatTimeLabel(index, timeframe),
        predicted: predictedValue,
        lowerBound: predictedValue * 0.85,
        upperBound: predictedValue * 1.15,
      }
    })
  }, [historicalData, timeframe])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive CLV Analytics</CardTitle>
        <CardDescription>
          Forecasted customer lifetime value with confidence intervals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={projectedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'CLV']} />
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
                name="Predicted CLV"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 text-right">
          <Button
            variant="outline"
            onClick={() => exportCSV(projectedData, 'predicted_clv.csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const CLVDriversAnalysis = ({ data }: { data: any[] }) => {
  // Analyze what drives CLV
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
          Factors influencing customer lifetime value
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

// ————————————————————————
// Main CLV Dashboard Page
// ————————————————————————

export default function CLVPage() {
  const customers = useMemo(() => generateFakeCustomers(365), [])
  const [timeframe, setTimeframe] = useState('weekly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const clvData = useMemo(() => {
    let length = 52
    if (timeframe === 'daily') length = 90
    else if (timeframe === 'monthly') length = 12

    return customers.slice(0, length).map((c, i) => ({
      fiscalWeek: formatTimeLabel(i, timeframe),
      clv: c.clv,
      cac: c.clv * (0.2 + Math.random() * 0.3), // Simulate CAC as 20-50% of CLV
      revenue: c.clv * 0.75 + Math.random() * 50,
      baseline: c.clv * 0.95 + Math.random() * 50,
      plan: c.plan,
      usageScore: c.usageScore,
    }))
  }, [customers, timeframe])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Lifetime Value</h1>
          <p className="text-muted-foreground">
            Analysis of customer value, retention, and profitability
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
          <Button variant="outline" onClick={() => exportCSV(clvData, 'clv_analysis.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <KPIOverview data={clvData} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="drivers">Value Drivers</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CLVTrendChart data={clvData} timeframe={timeframe} />
          <CLVDriversAnalysis data={customers} />
        </TabsContent>

        <TabsContent value="segmentation">
          <CLVSegmentation data={customers} />
        </TabsContent>

        <TabsContent value="cohort">
          <CohortCLVAnalysis data={clvData} />
        </TabsContent>

        <TabsContent value="drivers">
          <CLVDriversAnalysis data={customers} />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveCLV historicalData={clvData} timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  )
}