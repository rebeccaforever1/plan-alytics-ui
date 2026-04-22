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
  LineChart,
  Line,
  Cell,
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

import { 
  generateOverviewKPIs,
  generateStatisticalStats, 
  generateCLVDrivers,
  generateCLVDecomposition,
  generateCustomerEquity,
  generateTrendData,
  generateHistogramData
} from '@/lib/fakeData'


// ————————————————————————
// KPIOverview
// ————————————————————————
const KPIOverview = ({ data, modelData }: { data: any[]; modelData: any }) => {
  const kpis = generateOverviewKPIs(data, modelData);

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
// TrendCharts - NEW COMPONENT
// ————————————————————————
const TrendCharts = ({ data }: { data: any[] }) => {
  const trendData = generateTrendData(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics Trends</CardTitle>
        <CardDescription>Historical performance of critical CLV metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-center">Average CLV Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="avgClv" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-center">Average CAC Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="avgCac" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-center">LTV:CAC Ratio Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => value.toFixed(2)} />
                  <Line type="monotone" dataKey="ltvCacRatio" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  const stats = generateStatisticalStats(data, metric);
  const histogramData = generateHistogramData(data, metric);

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
          <CardDescription>Performance summary and distribution</CardDescription>
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
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div><p className="text-sm">Mean</p><p className="text-2xl font-bold">{formatValue(stats.mean)}</p></div>
          <div><p className="text-sm">Median</p><p className="text-2xl font-bold">{formatValue(stats.median)}</p></div>
          <div><p className="text-sm">Std Dev</p><p className="text-2xl font-bold">{formatValue(stats.stdDev)}</p></div>
          <div><p className="text-sm">Range</p><p className="text-lg font-bold">{formatValue(stats.min)} - {formatValue(stats.max)}</p></div>
          <div>
            <p className="text-sm">Growth Rate</p>
            <p className="text-2xl font-bold">{stats.trend.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Period-over-period</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Distribution Histogram</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" fontSize={11} />
                <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Count">
                  {histogramData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#4f46e5" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// CLVDriversAnalysis
// ————————————————————————
const CLVDriversAnalysis = ({ data }: { data: any[] }) => {
    const drivers = generateCLVDrivers(data);

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
  const decomposition = generateCLVDecomposition(data);

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
  const equity = generateCustomerEquity(data);

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
      <TrendCharts data={clvData} />
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