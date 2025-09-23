'use client'

import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Calculator, BarChart3, Calendar, Sigma } from 'lucide-react'

import { formatCurrency, calculateMean, calculateStandardDeviation, calculateTrend } from '@/lib/utils'

// ————————————————————————
// KPIOverview
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
    const paybackPeriod = currentCac > 0 ? currentCac / (currentClv * 0.1) : 0

    return {
      clv: currentClv,
      clvChange: isFinite(change) ? change : 0,
      cac: currentCac,
      ltvCacRatio,
      paybackPeriod,
      heterogeneity: modelData.heterogeneityIndex,
      predictedClv: modelData.predictedClv,
    }
  }, [data, modelData])

  const isPositive = kpis.clvChange >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Predicted CLV</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.predictedClv)}</div>
          <p className="text-xs text-muted-foreground">Model-based estimation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">LTV:CAC Ratio</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.ltvCacRatio.toFixed(1)}</div>
          <p className="text-xs">
            {kpis.ltvCacRatio > 3 ? 'Healthy' : kpis.ltvCacRatio > 1 ? 'Acceptable' : 'Concerning'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.paybackPeriod.toFixed(1)} mos</div>
          <p className="text-xs text-muted-foreground">Months to recover CAC</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ————————————————————————
// StatisticalInsights
// ————————————————————————
const metricLabels: Record<string, string> = {
  clv: 'Customer Lifetime Value',
  cac: 'Customer Acquisition Cost',
  revenue: 'Revenue',
  mrr: 'Monthly Recurring Revenue',
  customers: 'Customer Count',
  retention: 'Retention Rate',
  churn: 'Churn Rate',
}

const StatisticalInsights = ({
  data,
  metric,
  setMetric,
}: {
  data: any[]
  metric: string
  setMetric: (value: string) => void
}) => {
  const stats = useMemo(() => {
    const values = data.map(d => d[metric]).filter(v => typeof v === 'number')
    if (!values.length) return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, trend: 0 }

    const sorted = [...values].sort((a, b) => a - b)
    return {
      mean: calculateMean(values),
      median: sorted[Math.floor(sorted.length / 2)],
      stdDev: calculateStandardDeviation(values),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      trend: calculateTrend(values),
    }
  }, [data, metric])

  const formatValue = (v: number) => {
    if (metric === 'retention' || metric === 'churn') return `${v.toFixed(1)}%`
    if (metric === 'customers') return v.toLocaleString()
    return formatCurrency(v)
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>{metricLabels[metric]}</CardTitle>
          <CardDescription>Performance summary</CardDescription>
        </div>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(metricLabels).map(key => (
              <SelectItem key={key} value={key}>{metricLabels[key]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div><p className="text-sm">Mean</p><p className="text-2xl font-bold">{formatValue(stats.mean)}</p></div>
        <div><p className="text-sm">Median</p><p className="text-2xl font-bold">{formatValue(stats.median)}</p></div>
        <div><p className="text-sm">Std Dev</p><p className="text-2xl font-bold">{formatValue(stats.stdDev)}</p></div>
        <div><p className="text-sm">Range</p><p className="text-lg font-bold">{formatValue(stats.min)} - {formatValue(stats.max)}</p></div>
        <div><p className="text-sm">Trend</p><p className="text-2xl font-bold">{stats.trend.toFixed(1)}%</p></div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// CLVDriversAnalysis
// ————————————————————————
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
        <CardDescription>Factors influencing Customer Lifetime Value</CardDescription>
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
                  <Tooltip />
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
                  <Tooltip />
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
// CLVDecomposition + CustomerEquityCalculator
// ————————————————————————
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
        <CardDescription>Breakdown of CLV into frequency, monetary value, and retention components</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Purchase Frequency</p>
          <p className="text-xl font-bold">{decomposition.frequency.toFixed(1)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Monetary Value</p>
          <p className="text-xl font-bold">{formatCurrency(decomposition.monetary)}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">Retention Rate</p>
          <p className="text-xl font-bold">{decomposition.retention.toFixed(1)}%</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">Calculated CLV</p>
          <p className="text-xl font-bold">{formatCurrency(decomposition.calculatedClv)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomerEquityCalculator = ({ data }: { data: any[] }) => {
  const equity = useMemo(() => {
    const totalClv = data.reduce((sum, customer) => sum + customer.clv, 0)
    const avgRetention = calculateMean(data.map(d => d.retention || 85))
    const discountRate = 0.1
    const equity = totalClv * (avgRetention / 100) / (1 + discountRate - (avgRetention / 100))
    return { totalClv, avgRetention, discountRate, equity }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Equity Calculation</CardTitle>
        <CardDescription>Total discounted lifetime value of your customer base</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// OverviewTab export
// ————————————————————————
function OverviewTab({ clvData, modelData, metric, setMetric }) {
  return (
    <div className="space-y-8">
      <KPIOverview data={clvData} modelData={modelData} />
      <StatisticalInsights data={clvData} metric={metric} setMetric={setMetric} />
      <CLVDriversAnalysis data={clvData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CLVDecomposition data={clvData} />
        <CustomerEquityCalculator data={clvData} />
      </div>
    </div>
  )
}

export default OverviewTab
