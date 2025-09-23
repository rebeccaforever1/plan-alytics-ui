'use client'

import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
  Area,
  ComposedChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'

import {
  formatCurrency,
  calculateTrend,
  formatTimeLabel,
  exportCSV,
} from '@/lib/utils'

// ————————————————————————
// CLV Prediction Chart
// ————————————————————————
const CLVPredictionChart = ({ modelData }: { modelData: any }) => {
  if (!modelData?.prediction) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>CLV Prediction Over Time</CardTitle>
        <CardDescription>
          Projected customer lifetime value with confidence intervals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={modelData.prediction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'CLV']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.3}
                name="95% Upper"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.3}
                name="95% Lower"
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

// ————————————————————————
// Predictive Analytics
// ————————————————————————
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
    const trend = calculateTrend(historicalData.map((d) => d[metric]))
    const base = historicalData[historicalData.length - 1]?.[metric] || 1000

    return Array.from({ length: 12 }).map((_, i) => {
      const index = historicalData.length + i
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
          Forecasts based on {metric.toUpperCase()} with confidence bands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={projectedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Value']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.2}
                name="Confidence Interval"
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

// ————————————————————————
// Intervention Simulator
// ————————————————————————
const InterventionSimulator = ({ baseClv }: { baseClv: number }) => {
  const [improvementRetention, setImprovementRetention] = useState(10)
  const [improvementFrequency, setImprovementFrequency] = useState(10)
  const [improvementMonetary, setImprovementMonetary] = useState(10)
  const [cost, setCost] = useState(50000)

  const impact = useMemo(() => {
    const newRetention = 85 * (1 + improvementRetention / 100)
    const newFrequency = 2.5 * (1 + improvementFrequency / 100)
    const newMonetary = (baseClv / 12) * (1 + improvementMonetary / 100)

    const newClv = newFrequency * newMonetary * (newRetention / (100 - newRetention))
    const clvIncrease = newClv - baseClv
    const roi = (clvIncrease * 1000 - cost) / cost

    return {
      newClv,
      clvIncrease,
      roi: roi * 100,
      profitable: roi > 0,
    }
  }, [improvementRetention, improvementFrequency, improvementMonetary, cost, baseClv])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Simulator</CardTitle>
        <CardDescription>
          Simulate the impact of strategies on CLV and ROI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Retention Improvement (%)</label>
              <Input
                type="number"
                value={improvementRetention}
                onChange={(e) => setImprovementRetention(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Frequency Improvement (%)</label>
              <Input
                type="number"
                value={improvementFrequency}
                onChange={(e) => setImprovementFrequency(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Monetary Value Improvement (%)</label>
              <Input
                type="number"
                value={improvementMonetary}
                onChange={(e) => setImprovementMonetary(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Intervention Cost ($)</label>
              <Input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Results */}
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

// ————————————————————————
// PredictionTab
// ————————————————————————
function PredictionTab({
  clvData,
  modelData,
  metric,
  timeframe,
}: {
  clvData: any[]
  modelData: any
  metric: string
  timeframe: string
}) {
  const baseClv = clvData[clvData.length - 1]?.clv || 1000

  return (
    <div className="space-y-8">
      <CLVPredictionChart modelData={modelData} />
      <PredictiveAnalytics historicalData={clvData} timeframe={timeframe} metric={metric} />
      <InterventionSimulator baseClv={baseClv} />
    </div>
  )
}

export default PredictionTab
