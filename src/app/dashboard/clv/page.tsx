// src/app/dashboard/clv/page.tsx
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
} from 'recharts'

import { 
  generateFakeCustomers, 
  generateCohortData, 
  generateCLVModelData,
  generateCLVData 
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
  LineChart,
  Sigma,
  Calculator,
} from 'lucide-react'


//export default function CLVPage() {
//  const data = useMemo(() => generateCLVData(), [])}

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
  const data = useMemo(() => generateCLVData(), [])
  const [timeframe, setTimeframe] = useState('weekly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

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
    }
  })
}, [timeframe, customers])  // ← close useMemo correctly

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

      <KPIOverview data={clvData} modelData={modelData} />

      <Tabs defaultValue="heterogeneity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="heterogeneity">Value Heterogeneity</TabsTrigger>
          <TabsTrigger value="models">Probabilistic Models</TabsTrigger>
          <TabsTrigger value="prediction">CLV Prediction</TabsTrigger>
          <TabsTrigger value="segmentation">Customer Segmentation</TabsTrigger>
          <TabsTrigger value="drivers">Value Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="heterogeneity" className="space-y-6">
          <CLVHeterogeneityChart modelData={modelData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Heterogeneity Statistics</CardTitle>
                <CardDescription>
                  Statistical measures of customer value distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Measure</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Gini Coefficient</TableCell>
                      <TableCell>{modelData.inequality.gini.toFixed(3)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pareto Ratio (80/20)</TableCell>
                      <TableCell>{modelData.inequality.pareto.toFixed(3)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Top 10% Share</TableCell>
                      <TableCell>{formatPercentage(modelData.inequality.top10Share)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Top 1% Share</TableCell>
                      <TableCell>{formatPercentage(modelData.inequality.top1Share)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Strategic Implications</CardTitle>
                <CardDescription>
                  How to leverage heterogeneity in customer value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold">High-Value Customers</h4>
                  <p className="text-sm">Focus retention efforts on the top {Math.round(modelData.inequality.top10Share * 100)}% of customers who generate {Math.round(modelData.inequality.top10Value * 100)}% of value</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold">Personalization</h4>
                  <p className="text-sm">Tailor marketing messages based on predicted customer value and behavior patterns</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold">Resource Allocation</h4>
                  <p className="text-sm">Align customer service and marketing resources with customer value potential</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <ProbabilisticModels modelData={modelData} />
        </TabsContent>

        <TabsContent value="prediction">
          <CLVPredictionChart modelData={modelData} />
        </TabsContent>

        <TabsContent value="segmentation">
          <CustomerSegmentationMatrix modelData={modelData} />
        </TabsContent>

        <TabsContent value="drivers">
          <CLVDriversAnalysis data={customers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}