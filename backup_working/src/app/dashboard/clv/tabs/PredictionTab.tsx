'use client'

import React, { useMemo, useState, useEffect } from 'react'
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
  ReferenceLine
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
import { generateProjectedData } from '@/lib/fakeData'

// ————————————————————————
// SEGMENTED CLV PREDICTION WITH USAGE SCORE
// Based on Fader's acquisition-time predictability
// ————————————————————————
const SegmentCLVChart = ({ 
  segment, 
  segmentData 
}: { 
  segment: string
  segmentData: any[]
}) => {
  
  const getSegmentConfig = (segment: string) => {
    const configs = {
      champions: {
        color: "#10b981",
        description: "High early usage predicts sustained high value"
      },
      loyal_customers: {
        color: "#3b82f6",  
        description: "Moderate but consistent usage patterns"
      },
      at_risk: {
        color: "#f59e0b",
        description: "High initial usage that fails to monetize"
      },
      need_attention: {
        color: "#ef4444",
        description: "Low usage from acquisition indicates low future value"
      }
    }
    return configs[segment as keyof typeof configs]
  }

  const config = getSegmentConfig(segment)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{segment.replace('_', ' ')}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ value: 'Months as Customer', position: 'insideBottom' }} 
              />
              
              {/* Primary Y-Axis: CLV */}
              <YAxis 
                yAxisId="clv"
                label={{ value: 'CLV (USD)', angle: -90, position: 'insideLeft' }}
                width={80}
              />
              
              {/* Secondary Y-Axis: Usage Score */}
              <YAxis 
                yAxisId="usage"
                orientation="right"
                label={{ value: 'Usage Score', angle: -90, position: 'insideRight' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                width={80}
              />
              
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'CLV') return [formatCurrency(Number(value)), name]
                  if (name === 'Usage Score') return [`${value}%`, name]
                  if (name === 'Critical Zone') return ['At risk period', name]
                  return [value, name]
                }}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />

              {/* CLV Prediction Line - The Outcome */}
              <Line
                yAxisId="clv"
                type="monotone"
                dataKey="clv"
                stroke={config.color}
                strokeWidth={3}
                name="Predicted CLV"
                dot={{ r: 4, fill: config.color }}
              />

              {/* Usage Score - The Predictor */}
              <Line
                yAxisId="usage"
                type="monotone"
                dataKey="usage_score"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Usage Score"
                dot={{ r: 3, fill: "#6b7280" }}
              />

              {/* Critical Usage Thresholds */}
              <ReferenceLine 
                yAxisId="usage"
                y={30}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'At-Risk', position: 'right' }}
              />
              <ReferenceLine 
                yAxisId="usage"
                y={70}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: 'Healthy', position: 'right' }}
              />

              {/* Key Milestone Markers */}
              {segmentData.map((point, index) => (
                point.milestone && (
                  <ReferenceLine 
                    key={index}
                    x={point.month}
                    stroke="#8b5cf6"
                    strokeDasharray="3 3"
                    label={{ value: point.milestone, position: 'top' }}
                  />
                )
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Fader-Style Acquisition Insights */}
        <div className="mt-4 p-3 border rounded-lg text-sm" style={{ borderColor: config.color }}>
          <div className="font-semibold mb-2">Acquisition Predictors:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-600">Month 1 Usage</div>
              <div className="font-semibold">{segmentData[0]?.usage_score}%</div>
            </div>
            <div>
              <div className="text-gray-600">Usage → CLV Correlation</div>
              <div className="font-semibold">{calculateCorrelation(segmentData)}</div>
            </div>
            <div>
              <div className="text-gray-600">Critical Period</div>
              <div className="font-semibold">Months {getCriticalPeriod(segmentData)}</div>
            </div>
            <div>
              <div className="text-gray-600">Predictive Power</div>
              <div className="font-semibold">{getPredictiveStrength(segment)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions for Fader-style insights
const calculateCorrelation = (data: any[]) => {
  // Simplified correlation calculation
  const usage = data.map(d => d.usage_score)
  const clv = data.map(d => d.clv / 100) // normalize
  const n = usage.length
  
  const sumU = usage.reduce((a, b) => a + b, 0)
  const sumC = clv.reduce((a, b) => a + b, 0)
  const sumUC = usage.reduce((sum, u, i) => sum + u * clv[i], 0)
  const sumU2 = usage.reduce((sum, u) => sum + u * u, 0)
  const sumC2 = clv.reduce((sum, c) => sum + c * c, 0)
  
  const correlation = (n * sumUC - sumU * sumC) / 
    Math.sqrt((n * sumU2 - sumU * sumU) * (n * sumC2 - sumC * sumC))
  
  return correlation > 0.7 ? "Strong" : correlation > 0.4 ? "Moderate" : "Weak"
}

const getCriticalPeriod = (data: any[]) => {
  const critical = data.findIndex(d => d.usage_score < 30)
  return critical > 0 ? `1-${critical}` : "6+"
}

const getPredictiveStrength = (segment: string) => {
  const strengths = {
    champions: "Very High",
    loyal_customers: "High", 
    at_risk: "Moderate",
    need_attention: "Low"
  }
  return strengths[segment as keyof typeof strengths]
}

// Usage with sample data structure
const sampleSegmentData = [
  { month: 1, clv: 50, usage_score: 85, milestone: "Onboard" },
  { month: 2, clv: 120, usage_score: 78 },
  { month: 3, clv: 210, usage_score: 82 },
  { month: 4, clv: 320, usage_score: 45, milestone: "Usage Drop" },
  { month: 5, clv: 380, usage_score: 40 },
  { month: 6, clv: 450, usage_score: 65, milestone: "Recovery" }
]
// ————————————————————————
// Intervention Simulator
// ————————————————————————
const InterventionSimulator = ({ baseClv }: { baseClv: number }) => {
  const [selectedSegment, setSelectedSegment] = useState('champions')
  const [strategyPreset, setStrategyPreset] = useState('moderate')
  const [improvementRetention, setImprovementRetention] = useState(10)
  const [improvementFrequency, setImprovementFrequency] = useState(10)
  const [improvementMonetary, setImprovementMonetary] = useState(10)
  const [cost, setCost] = useState(50000)

  // Strategy presets - auto-populate values based on selected approach
  const strategyPresets = {
    conservative: {
      name: "Conservative",
      description: "Low cost, incremental improvements",
      retention: 5,
      frequency: 3,
      monetary: 5,
      cost: 25000
    },
    moderate: {
      name: "Moderate", 
      description: "Balanced approach with reasonable investment",
      retention: 10,
      frequency: 8,
      monetary: 10,
      cost: 50000
    },
    aggressive: {
      name: "Aggressive",
      description: "High investment for maximum impact",
      retention: 15,
      frequency: 15,
      monetary: 15,
      cost: 100000
    },
    retention_focus: {
      name: "Retention Focus",
      description: "Primarily improve customer retention",
      retention: 12,
      frequency: 5,
      monetary: 3,
      cost: 40000
    },
    frequency_focus: {
      name: "Frequency Focus", 
      description: "Increase purchase/usage frequency",
      retention: 3,
      frequency: 15,
      monetary: 5,
      cost: 35000
    },
    monetary_focus: {
      name: "Monetary Focus",
      description: "Boost average spending per customer",
      retention: 5,
      frequency: 5,
      monetary: 20,
      cost: 60000
    },
    custom: {
      name: "Custom",
      description: "Manually set all values",
      retention: improvementRetention,
      frequency: improvementFrequency,
      monetary: improvementMonetary,
      cost: cost
    }
  }

  // Segment-specific base metrics
  const segmentMetrics = {
    champions: {
      baseRetention: 92,
      baseFrequency: 4.2,
      baseMonetary: baseClv * 1.8 / 12,
      description: "High value customers - focus on premium experiences"
    },
    loyal_customers: {
      baseRetention: 85,
      baseFrequency: 2.8,
      baseMonetary: baseClv * 1.2 / 12,
      description: "Reliable customers - focus on loyalty programs"
    },
    at_risk: {
      baseRetention: 65,
      baseFrequency: 3.1,
      baseMonetary: baseClv * 0.7 / 12,
      description: "Active but low spend - focus on monetization"
    },
    need_attention: {
      baseRetention: 45,
      baseFrequency: 1.2,
      baseMonetary: baseClv * 0.4 / 12,
      description: "Low engagement - focus on reactivation"
    }
  }

  // Auto-apply preset when selection changes
  useEffect(() => {
    if (strategyPreset !== 'custom') {
      const preset = strategyPresets[strategyPreset as keyof typeof strategyPresets]
      setImprovementRetention(preset.retention)
      setImprovementFrequency(preset.frequency)
      setImprovementMonetary(preset.monetary)
      setCost(preset.cost)
    }
  }, [strategyPreset])

  const currentMetrics = segmentMetrics[selectedSegment as keyof typeof segmentMetrics]
  const currentPreset = strategyPresets[strategyPreset as keyof typeof strategyPresets]

  const impact = useMemo(() => {
    const newRetention = Math.min(98, currentMetrics.baseRetention * (1 + improvementRetention / 100))
    const newFrequency = currentMetrics.baseFrequency * (1 + improvementFrequency / 100)
    const newMonetary = currentMetrics.baseMonetary * (1 + improvementMonetary / 100)

    const newClv = newFrequency * newMonetary * (newRetention / (100 - newRetention))
    const segmentBaseClv = currentMetrics.baseFrequency * currentMetrics.baseMonetary * (currentMetrics.baseRetention / (100 - currentMetrics.baseRetention))
    const clvIncrease = newClv - segmentBaseClv
    
    const segmentSizes = {
      champions: 250,
      loyal_customers: 500,
      at_risk: 300,
      need_attention: 450
    }
    const customerCount = segmentSizes[selectedSegment as keyof typeof segmentSizes]
    const roi = ((clvIncrease * customerCount) - cost) / cost

    return {
      newClv,
      clvIncrease,
      roi: roi * 100,
      profitable: roi > 0,
      segmentBaseClv,
      customerCount,
      totalImpact: clvIncrease * customerCount
    }
  }, [improvementRetention, improvementFrequency, improvementMonetary, cost, selectedSegment, currentMetrics])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Simulator</CardTitle>
        <CardDescription>
          Simulate the impact of strategies on CLV and ROI by customer segment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Strategy & Segment Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Segment</label>
            <select 
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="champions">Champions (High Value, High Frequency)</option>
              <option value="loyal_customers">Loyal Customers (High Value, Lower Frequency)</option>
              <option value="at_risk">At Risk (High Frequency, Lower Value)</option>
              <option value="need_attention">Need Attention (Low Value, Low Frequency)</option>
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              {currentMetrics.description}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Strategy Approach</label>
            <select 
              value={strategyPreset}
              onChange={(e) => setStrategyPreset(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
              <option value="retention_focus">Retention Focus</option>
              <option value="frequency_focus">Frequency Focus</option>
              <option value="monetary_focus">Monetary Focus</option>
              <option value="custom">Custom</option>
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              {currentPreset.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Retention Improvement (%) 
                <span className="text-muted-foreground ml-2">
                  (Base: {currentMetrics.baseRetention}%)
                </span>
              </label>
              <Input
                type="number"
                value={improvementRetention}
                onChange={(e) => {
                  setImprovementRetention(Number(e.target.value))
                  setStrategyPreset('custom')
                }}
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Frequency Improvement (%)
                <span className="text-muted-foreground ml-2">
                  (Base: {currentMetrics.baseFrequency}x/month)
                </span>
              </label>
              <Input
                type="number"
                value={improvementFrequency}
                onChange={(e) => {
                  setImprovementFrequency(Number(e.target.value))
                  setStrategyPreset('custom')
                }}
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Monetary Value Improvement (%)
                <span className="text-muted-foreground ml-2">
                  (Base: {formatCurrency(currentMetrics.baseMonetary)}/month)
                </span>
              </label>
              <Input
                type="number"
                value={improvementMonetary}
                onChange={(e) => {
                  setImprovementMonetary(Number(e.target.value))
                  setStrategyPreset('custom')
                }}
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Intervention Cost ($)</label>
              <Input
                type="number"
                value={cost}
                onChange={(e) => {
                  setCost(Number(e.target.value))
                  setStrategyPreset('custom')
                }}
                min="0"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Segment CLV</p>
              <p className="text-2xl font-bold">{formatCurrency(impact.segmentBaseClv)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Projected Segment CLV</p>
              <p className="text-2xl font-bold">{formatCurrency(impact.newClv)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">CLV Increase per Customer</p>
              <p className="text-2xl font-bold text-green-600">+{formatCurrency(impact.clvIncrease)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Business Impact</p>
              <p className="text-2xl font-bold">
                {formatCurrency(impact.totalImpact)}
              </p>
              <p className="text-xs">Across {impact.customerCount} customers</p>
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

        {/* Strategy Effectiveness by Segment */}
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Strategy Effectiveness for {selectedSegment.replace('_', ' ')}:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(strategyPresets).map(([key, preset]) => {
              if (key === 'custom') return null
              const effectiveness = calculateStrategyEffectiveness(key, selectedSegment)
              return (
                <div key={key} className={`p-3 rounded border ${
                  strategyPreset === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ROI Potential: <span className={
                      effectiveness > 200 ? 'text-green-600' : 
                      effectiveness > 100 ? 'text-blue-600' : 
                      'text-orange-600'
                    }>{effectiveness}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper to show which strategies work best for each segment
const calculateStrategyEffectiveness = (strategy: string, segment: string) => {
  const effectivenessMatrix = {
    champions: { conservative: 120, moderate: 180, aggressive: 220, retention_focus: 160, frequency_focus: 140, monetary_focus: 200 },
    loyal_customers: { conservative: 150, moderate: 210, aggressive: 190, retention_focus: 180, frequency_focus: 220, monetary_focus: 170 },
    at_risk: { conservative: 80, moderate: 150, aggressive: 180, retention_focus: 200, frequency_focus: 120, monetary_focus: 160 },
    need_attention: { conservative: 60, moderate: 110, aggressive: 140, retention_focus: 130, frequency_focus: 90, monetary_focus: 100 }
  }
  return effectivenessMatrix[segment as keyof typeof effectivenessMatrix]?.[strategy as keyof typeof effectivenessMatrix.champions] || 100
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
        <SegmentCLVChart segment="champions" segmentData={sampleSegmentData} />
  <SegmentCLVChart segment="loyal_customers" segmentData={sampleSegmentData} />
  <SegmentCLVChart segment="at_risk" segmentData={sampleSegmentData} />
  <SegmentCLVChart segment="need_attention" segmentData={sampleSegmentData} />
      <InterventionSimulator baseClv={baseClv} />
    </div>
  )
}

export default PredictionTab
