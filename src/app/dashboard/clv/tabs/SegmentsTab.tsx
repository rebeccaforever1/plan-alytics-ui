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
import { Progress } from '@/components/ui/progress'
import { DollarSign, TrendingUp, Users } from 'lucide-react'
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
  ZAxis,
} from 'recharts'

import { formatCurrency } from '@/lib/utils'

// ————————————————————————
// CustomerSegmentationMatrix
// ————————————————————————
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


// ————————————————————————
// CustomerSegmentation
// ————————————————————————
const CustomerSegmentation = ({ data }: { data: any[] }) => {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null

    // safe copy before sorting
    const values = [...data.map((d) => d.clv)].sort((a, b) => a - b)
    const total = values.length
    if (total === 0) return null

    const median = values[Math.floor(total / 2)]
    const q1 = values[Math.floor(total * 0.75)]
    const q3 = values[Math.floor(total * 0.25)]

    const segments = [
      {
        name: 'Champions',
        icon: '👑',
        description: 'Top 25% highest value customers',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `> ${formatCurrency(q1)}`,
        color: '#10B981',
        action: 'Reward & retain with VIP treatment',
      },
      {
        name: 'Loyal Customers',
        icon: '💎',
        description: 'Above median CLV, reliable spenders',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `${formatCurrency(median)} - ${formatCurrency(q1)}`,
        color: '#3B82F6',
        action: 'Cross-sell & upsell opportunities',
      },
      {
        name: 'Potential Loyalists',
        icon: '📈',
        description: 'Below median, room for growth',
        count: Math.floor(total * 0.25),
        percentage: 25,
        threshold: `${formatCurrency(q3)} - ${formatCurrency(median)}`,
        color: '#F59E0B',
        action: 'Targeted engagement campaigns',
      },
      {
        name: 'At Risk',
        icon: '⚠️',
        description: 'Bottom 25%, needs attention',
        count: total - Math.floor(total * 0.75),
        percentage: 25,
        threshold: `< ${formatCurrency(q3)}`,
        color: '#EF4444',
        action: 'Win-back campaigns & support',
      },
    ]

    const totalValue = values.reduce((sum, val) => sum + val, 0)
    const avgCLV = totalValue / total

    return { segments, totalValue, avgCLV, total }
  }, [data])

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>No customer data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Value Segments
        </CardTitle>
        <CardDescription>
          Strategic segmentation of {analysis.total.toLocaleString()} customers by CLV quartiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.totalValue)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Customer Value</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(analysis.avgCLV)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Average CLV</p>
          </div>
        </div>

        {/* Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.segments.map((segment) => (
            <div
              key={segment.name}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{segment.icon}</span>
                  <h3 className="font-semibold">{segment.name}</h3>
                </div>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${segment.color}20`,
                    color: segment.color,
                  }}
                >
                  {segment.percentage}%
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customers</span>
                  <span className="font-medium">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={segment.percentage}
                  className="h-2"
                  style={{ background: `${segment.color}20` }}
                />
                <div className="text-xs text-gray-500">
                  CLV Range: {segment.threshold}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{segment.description}</p>

              <div
                className="text-xs p-2 bg-gray-50 rounded border-l-2"
                style={{ borderLeftColor: segment.color }}
              >
                <strong>Action:</strong> {segment.action}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Insights */}
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-medium text-blue-900 mb-2">💡 Key Insights</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Focus retention efforts on Champions ({analysis.segments[0].count} customers)</li>
            <li>• {analysis.segments[2].count} customers have growth potential</li>
            <li>• {analysis.segments[3].count} at-risk customers need immediate attention</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// SegmentsTab
// ————————————————————————
function SegmentsTab({ clvData, modelData }: { clvData: any[]; modelData: any }) {
  return (
    <div className="space-y-8">
      <CustomerSegmentationMatrix modelData={modelData} />
      <CustomerSegmentation data={clvData} />
    </div>
  )
}

export default SegmentsTab
