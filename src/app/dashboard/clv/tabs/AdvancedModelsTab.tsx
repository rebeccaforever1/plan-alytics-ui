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
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Line,
  Scatter,
} from 'recharts'

import { formatCurrency } from '@/lib/utils'
import { generateAdvancedPredictionData } from '@/lib/fakeData' 

// ————————————————————————
// Pattern Recognition
// ————————————————————————
const PatternRecognitionChart = ({ data, metric }: { data: any[]; metric: string }) => {
  const processed = useMemo(() => {
    if (!data || data.length === 0) return []
    const values = data.map((d) => d[metric] || 0)

    // rolling average (window=3)
    const rolling = values.map((v, i, arr) => {
      const slice = arr.slice(Math.max(0, i - 2), i + 1)
      return slice.reduce((a, b) => a + b, 0) / slice.length
    })

    return values.map((v, i) => ({
      period: i + 1,
      value: v,
      avg: rolling[i],
      anomaly: Math.abs(v - rolling[i]) > rolling[i] * 0.25 ? v : null, // mark outliers
    }))
  }, [data, metric])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern Recognition</CardTitle>
        <CardDescription>Detecting anomalies in {metric.toUpperCase()} trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), metric]} />
              <Legend />
              <Line dataKey="value" stroke="#4f46e5" name="Actual" dot={false} />
              <Line dataKey="avg" stroke="#22c55e" strokeDasharray="4 4" name="Rolling Avg" dot={false} />
              <Scatter dataKey="anomaly" fill="#ef4444" name="Anomalies" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Seasonality Analysis (index-based months if no real date)
// ————————————————————————
const SeasonalityAnalysis = ({ data }: { data: any[] }) => {
  const seasonal = useMemo(() => {
    if (!data || data.length === 0) return []

    // use either `d.date` if available, else fallback to index
    return data.map((d, i) => {
      const monthIndex = i % 12 // cycle through Jan–Dec
      const month = new Date(2000, monthIndex, 1).toLocaleString('en-US', {
        month: 'short',
      })
      return { month, avgClv: d.clv }
    })
  }, [data])

  // group by month and average
  const grouped = useMemo(() => {
    const acc: Record<string, number[]> = {}
    seasonal.forEach((row) => {
      if (!acc[row.month]) acc[row.month] = []
      acc[row.month].push(row.avgClv)
    })
    return Object.entries(acc).map(([month, vals]) => ({
      month,
      avgClv: vals.reduce((a, b) => a + b, 0) / vals.length,
    }))
  }, [seasonal])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonality Analysis</CardTitle>
        <CardDescription>Average CLV by month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={grouped}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Avg CLV']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgClv"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


// ————————————————————————
// AdvancedModelsTab
// ————————————————————————
function AdvancedModelsTab({
  clvData,
  modelData,
  metric,
}: {
  clvData: any[]
  modelData: any
  metric: string
}) {
const predictionData = generateAdvancedPredictionData()

  return (
    <div className="space-y-8">
    
      {/* existing cards … (recommendations, heterogeneity, etc.) */}

      {/* CLV Prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifetime Value Prediction</CardTitle>
          <CardDescription>12-month forward-looking CLV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'CLV']} />
                <Legend />
                <Area dataKey="confidence_upper" stroke="transparent" fill="#e0e7ff" fillOpacity={0.4} />
                <Area dataKey="confidence_lower" stroke="transparent" fill="#fff" fillOpacity={1} />
                <Line dataKey="predicted" stroke="#4f46e5" strokeWidth={3} dot={false} />
                <Line dataKey="actual" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* New charts */}
      <PatternRecognitionChart data={clvData} metric={metric} />
      <SeasonalityAnalysis data={clvData} />
    </div>
  )
}

export default AdvancedModelsTab
