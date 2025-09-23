'use client'

import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ReferenceLine,
  ComposedChart,
  BarChart,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

// ————————————————————————
// KPIOverview
// ————————————————————————

const KPIOverview = ({ data, modelData }: { data: any[]; modelData: any }) => {
  const kpis = useMemo(() => {
    const clvValues = data.map(d => d.clv).filter(v => v !== null)
    const currentClv = clvValues.at(-1) || 0
    const previousClv = clvValues.at(-2) || 0
    const change = previousClv ? ((currentClv - previousClv) / previousClv) * 100 : 0

    const currentCac = data.map(d => d.cac).filter(v => v !== null).at(-1) || 0
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI Overview</CardTitle>
        <CardDescription>Key CLV performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Current CLV</p>
            <p className="text-2xl font-bold">{formatCurrency(kpis.clv)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Change</p>
            <p
              className={`text-2xl font-bold ${
                kpis.clvChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {kpis.clvChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Executive Summary & Key Insights
// ————————————————————————
const ExecutiveSummary = ({ clvData, modelData }: { clvData: any[]; modelData: any }) => {
  const insights = useMemo(() => {
    const clvValues = clvData.map(d => d.clv).filter(v => v !== null)
    const sorted = [...clvValues].sort((a, b) => b - a)
    const totalValue = sorted.reduce((sum, val) => sum + val, 0)

    const top20Count = Math.floor(sorted.length * 0.2)
    const top20Value = sorted.slice(0, top20Count).reduce((sum, val) => sum + val, 0)
    const top20Share = (top20Value / totalValue) * 100

    const heterogeneity = modelData.heterogeneityIndex || 0

    let recommendation = ''
    let priority = ''
    if (heterogeneity > 0.7) {
      recommendation = 'High value concentration – protect top customers'
      priority = 'high'
    } else if (heterogeneity > 0.4) {
      recommendation = 'Balanced distribution – optimize mid-tier growth'
      priority = 'medium'
    } else {
      recommendation = 'Uniform base – explore segmentation opportunities'
      priority = 'low'
    }

    return {
      heterogeneityScore: Math.round(heterogeneity * 100),
      top20Share: Math.round(top20Share),
      recommendation,
      priority,
      avgCLV: totalValue / sorted.length,
    }
  }, [clvData, modelData])

  const priorityColor = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customer Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{insights.heterogeneityScore}</div>
              <div className="text-sm text-gray-600">Heterogeneity Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{insights.top20Share}%</div>
              <div className="text-sm text-gray-600">Top 20% Value Share</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{formatCurrency(insights.avgCLV)}</div>
              <div className="text-sm text-gray-600">Average CLV</div>
            </div>
          </div>

          <div
            className={`p-3 rounded border ${priorityColor[insights.priority as keyof typeof priorityColor]}`}
          >
            <div className="font-medium mb-1">Recommendation</div>
            <div className="text-sm">{insights.recommendation}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge variant="secondary" className="mt-1">1</Badge>
              <div>
                <div className="font-medium">Value Concentration</div>
                <div className="text-sm text-gray-600">
                  {insights.top20Share}% of value comes from the top 20% of customers
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge variant="secondary" className="mt-1">2</Badge>
              <div>
                <div className="font-medium">Segmentation Opportunity</div>
                <div className="text-sm text-gray-600">
                  {insights.heterogeneityScore > 70
                    ? 'High variance suggests strong potential for tiered strategies'
                    : 'Test personalized approaches for different segments'}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge variant="secondary" className="mt-1">3</Badge>
              <div>
                <div className="font-medium">Risk Assessment</div>
                <div className="text-sm text-gray-600">
                  {insights.top20Share > 80
                    ? 'High dependency on top customers – retention focus needed'
                    : 'Balanced distribution reduces concentration risk'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ————————————————————————
// CLVHeterogeneityChart
// ————————————————————————
const CLVHeterogeneityChart = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer Value Heterogeneity</CardTitle>
      <CardDescription>Distribution of customer lifetime values</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={modelData.valueDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="density" fill="#8884d8" name="Distribution" />
            <Line type="monotone" dataKey="gamma" stroke="#ff7300" dot={false} name="Gamma Fit" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)

// ————————————————————————
// ProbabilisticModels, CohortAnalysis, ParetoAnalysis
// (keep the versions we had)
// ————————————————————————
const ProbabilisticModels = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Probabilistic CLV Models</CardTitle>
      <CardDescription>
        BG/NBD and Gamma-Gamma model parameters with visual interpretation
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Parameter Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 bg-indigo-50 rounded text-center">
          <p className="text-xs text-gray-600">BG/NBD r</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.r?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded text-center">
          <p className="text-xs text-gray-600">BG/NBD α</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.alpha?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded text-center">
          <p className="text-xs text-gray-600">BG/NBD a</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.a?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded text-center">
          <p className="text-xs text-gray-600">BG/NBD b</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.b?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded text-center">
          <p className="text-xs text-gray-600">Gamma p</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.p?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded text-center">
          <p className="text-xs text-gray-600">Gamma q</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.q?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded text-center">
          <p className="text-xs text-gray-600">Gamma γ</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.gamma?.toFixed(3) ?? '—'}
          </p>
        </div>
      </div>



      {/* Key Interpretation */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2"> Interpretation</h4>
        <p className="text-sm text-blue-700">
          The <strong>BG/NBD</strong> parameters model purchase frequency and churn. 
          The <strong>Gamma-Gamma</strong> parameters capture spend variability. 
          Together they provide a forward-looking CLV estimate that accounts for customer heterogeneity.
        </p>
      </div>
    </CardContent>
  </Card>
)


const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohorts = useMemo(() => {
    return data.map((d, i) => ({
      name: `Cohort ${Math.floor(i / 10) + 1}`,
      avgClv: d.clv,
      retention: 80 + (i % 20),
    }))
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohorts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgClv" fill="#4f46e5" />
              <Bar dataKey="retention" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const ParetoAnalysis = ({ data }: { data: any[] }) => {
  const paretoData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.clv - a.clv)
    let cum = 0
    const total = sorted.reduce((s, d) => s + d.clv, 0)
    return sorted.map((d, i) => {
      cum += d.clv
      return { rank: i + 1, clv: d.clv, percentage: (cum / total) * 100 }
    })
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rank" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percentage" stroke="#4f46e5" />
              <Bar dataKey="clv" fill="#cbd5e1" />
              <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// HeterogeneityTab (default export)
// ————————————————————————
function HeterogeneityTab({ clvData, modelData }: { clvData: any[]; modelData: any }) {
  return (
    <div className="space-y-8">
      <ExecutiveSummary clvData={clvData} modelData={modelData} />
      <KPIOverview data={clvData} modelData={modelData} />
      <CLVHeterogeneityChart modelData={modelData} />
      <ProbabilisticModels modelData={modelData} />
      <CohortAnalysis data={clvData} />
      <ParetoAnalysis data={clvData} />
    </div>
  )
}

export default HeterogeneityTab
