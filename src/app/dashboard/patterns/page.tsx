'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Scatter,
  ReferenceLine,
} from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { generateFakeCustomers } from '@/lib/fakeData'
import { useMemo } from 'react'

// Utilities
const calculateMean = (values: number[]) =>
  values.reduce((acc, val) => acc + val, 0) / values.length

const calculateStandardDeviation = (values: number[]) => {
  const mean = calculateMean(values)
  const squareDiffs = values.map(value => Math.pow(value - mean, 2))
  return Math.sqrt(calculateMean(squareDiffs))
}

// Page Component
export default function PatternRecognitionPage() {
  const customers = useMemo(() => generateFakeCustomers(52), [])

  const chartData = useMemo(() => {
    const values = customers.map(c => c.clv)
    const mean = calculateMean(values)
    const stdDev = calculateStandardDeviation(values)

    return customers.map((c, i) => {
      const isAnomaly = Math.abs(c.clv - mean) > 2 * stdDev
      return {
        week: `Week ${i + 1}`,
        value: c.clv,
        isAnomaly,
        mean,
      }
    })
  }, [customers])

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pattern Recognition</h1>
        <p className="text-muted-foreground">
          Detecting anomalies in CLV distribution across weekly cohorts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CLV Outlier Detection</CardTitle>
          <CardDescription>
            Red dots indicate values that exceed ±2 standard deviations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine
                  y={chartData[0]?.mean}
                  stroke="#82ca9d"
                  strokeDasharray="4 4"
                  label={{ value: 'Mean CLV', position: 'insideTopRight', fill: '#82ca9d' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="CLV"
                  dot={false}
                />
                <Scatter
                  data={chartData.filter(d => d.isAnomaly)}
                  fill="red"
                  dataKey="value"
                  name="Anomaly"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
