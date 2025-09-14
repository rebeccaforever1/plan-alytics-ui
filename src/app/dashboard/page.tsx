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
} from 'recharts'

import ExecutiveOverview from './exec/page'

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
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
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

const metricLabels: Record<string, string> = {
  value: 'Customer Lifetime Value (CLV)',
  revenue: 'Revenue',
  mrr: 'Monthly Recurring Revenue',
  customers: 'Customer Count',
  retention: 'Retention Rate',
  churn: 'Churn Rate',
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

const KPIOverview = ({ data, metric }: { data: any[]; metric: string }) => {
  const kpis = useMemo(() => {
    const values = data.map(d => d[metric]).filter(v => v !== null)
    const currentValue = values[values.length - 1] || 0
    const previousValue = values[values.length - 2] || 0
    const change = ((currentValue - previousValue) / previousValue) * 100
    
    return {
      current: currentValue,
      previous: previousValue,
      change: isFinite(change) ? change : 0,
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }, [data, metric])

  const isPositive = kpis.change >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current {metricLabels[metric]}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.current)}</div>
          <p className="text-xs text-muted-foreground">
            vs {formatCurrency(kpis.previous)} previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Change</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{kpis.change.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {isPositive ? 'Increase' : 'Decrease'} from previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minimum</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.min)}</div>
          <p className="text-xs text-muted-foreground">
            Lowest value in selected period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maximum</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.max)}</div>
          <p className="text-xs text-muted-foreground">
            Highest value in selected period
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const StatisticalInsights = ({
  data,
  metric,
}: {
  data: any[]
  metric: string
}) => {
  const stats = useMemo(() => {
    const values = data.map(d => d[metric]).filter(v => v !== null)
    return {
      mean: calculateMean(values),
      stdDev: calculateStandardDeviation(values),
      trend: calculateTrend(values),
    }
  }, [data, metric])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Analysis</CardTitle>
        <CardDescription>
          Key statistical indicators for {metricLabels[metric] || metric.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Mean</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.mean)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Standard Deviation</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.stdDev)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trend</p>
          <p className="text-2xl font-bold">{stats.trend.toFixed(1)}%</p>
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

const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohortData = useMemo(() => generateCohortData(data), [data])
  const [selectedCohort, setSelectedCohort] = useState(cohortData[0]?.cohort)

  const currentCohort = cohortData.find(c => c.cohort === selectedCohort) || cohortData[0]
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
        <CardDescription>
          Customer retention and revenue by acquisition cohort
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
            <h3 className="text-lg font-semibold mb-4">Retention Rate by Period</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentCohort.retention}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={value => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                  <Legend />
                  <Bar dataKey="rate" fill="#8884d8" name="Retention Rate" />
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
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Retention Matrix</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Customers</TableHead>
                {currentCohort.retention.map((r, i) => (
                  <TableHead key={i}>Period {i + 1}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohortData.map(cohort => (
                <TableRow key={cohort.cohort} className={cohort.cohort === selectedCohort ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{cohort.cohort}</TableCell>
                  <TableCell>{cohort.initialCustomers}</TableCell>
                  {cohort.retention.map((r, i) => (
                    <TableCell key={i}>
                      <div className="flex flex-col">
                        <span>{r.rate}%</span>
                        <Progress value={r.rate} className="h-1 mt-1" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomerSegmentation = ({ data }: { data: any[] }) => {
  const segments = useMemo(() => {
    const values = data.map(d => d.value)
    const mean = calculateMean(values)
    const stdDev = calculateStandardDeviation(values)
    
    return {
      low: values.filter(v => v < mean - stdDev).length,
      medium: values.filter(v => v >= mean - stdDev && v <= mean + stdDev).length,
      high: values.filter(v => v > mean + stdDev).length,
      mean,
      stdDev,
    }
  }, [data])

  const segmentData = [
    { name: 'Low Value', value: segments.low, color: '#FF8042' },
    { name: 'Medium Value', value: segments.medium, color: '#FFBB28' },
    { name: 'High Value', value: segments.high, color: '#00C49F' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>
          Distribution of customers by CLV segments
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
                High Value Customers
              </h4>
              <p className="text-sm text-muted-foreground">
                {segments.high} customers ({((segments.high / data.length) * 100).toFixed(1)}%)
              </p>
              <p className="text-sm">CLV &gt; {formatCurrency(segments.mean + segments.stdDev)}</p>
            </div>
            <div>
              <h4 className="font-medium flex items-center">
                <Badge className="mr-2" style={{ backgroundColor: '#FFBB28' }} />
                Medium Value Customers
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
                Low Value Customers
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

// ————————————————————————
// Main Dashboard Page
// ————————————————————————

export default function OverviewPage() {
  const customers = useMemo(() => generateFakeCustomers(365), [])
  const [timeframe, setTimeframe] = useState('weekly')
  const [metric, setMetric] = useState('value')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [segmentFilter, setSegmentFilter] = useState('all')

  const clvData = useMemo(() => {
    let length = 52
    if (timeframe === 'daily') length = 90
    else if (timeframe === 'monthly') length = 12

    return customers.slice(0, length).map((c, i) => ({
      fiscalWeek: formatTimeLabel(i, timeframe),
      value: c.clv,
      revenue: c.clv * 0.75 + Math.random() * 50,
      mrr: c.clv * 0.1 + Math.random() * 5,
      baseline: c.clv * 0.95 + Math.random() * 50,
      customers: Math.floor(50 + Math.random() * 50),
      retention: 85 + Math.random() * 15,
      churn: 5 + Math.random() * 10,
    }))
  }, [customers, timeframe])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Advanced analytics of customer behavior and value metrics
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
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">CLV</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="mrr">MRR</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
              <SelectItem value="churn">Churn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="high">High Value</SelectItem>
              <SelectItem value="medium">Medium Value</SelectItem>
              <SelectItem value="low">Low Value</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportCSV(clvData, 'customer_analysis.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <KPIOverview data={clvData} metric={metric} />

      <Tabs defaultValue="exec" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exec">Executive Overview</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="exec">
          <ExecutiveOverview />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <StatisticalInsights data={clvData} metric={metric} />
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>
                Historical performance of {metricLabels[metric] || metric.toUpperCase()} over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={clvData}>
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
        </TabsContent>

        <TabsContent value="cohort">
          <CohortAnalysis data={clvData} />
        </TabsContent>

        <TabsContent value="segmentation">
          <CustomerSegmentation data={clvData} />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternRecognitionChart data={clvData} metric={metric} />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveAnalytics
            historicalData={clvData}
            timeframe={timeframe}
            metric={metric}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}