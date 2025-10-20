// src/app/dashboard/usage/page.tsx
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
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Sankey,
} from 'recharts'

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
  Target,
  BarChart3,
  Zap,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Filter,
  Lightbulb,
  Flag,
  Settings,
  Eye,
  UserCheck,
  Rocket,
  Brain,
  ThumbsUp,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'

// ————————————————————————
// Import Data Generators
// ————————————————————————

import {
  generateUsageData,
  generateFeatureData,
  generateUserSegments,
  generateProductInsights,
  UsageDataPoint,
  FeatureData,
  UserSegment,
  ProductInsight,
} from '@/lib/fakeData'

// ————————————————————————
// Utility Functions
// ————————————————————————


// ————————————————————————
// Utility Functions
// ————————————————————————

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// ————————————————————————
// Product-Focused Components
// ————————————————————————

const ProductHealthKPIs = ({ data, segments }: { data: UsageDataPoint[]; segments: UserSegment[] }) => {
  const kpis = useMemo(() => {
    const current = data[data.length - 1] || {}
    const previous = data[data.length - 2] || {}
    
    const champions = segments.find(s => s.segment === 'Champions') || {}
    const atRisk = segments.find(s => s.segment === 'At Risk') || {}
    
    return {
      productMarketFit: {
        value: champions.percentage || 0,
        change: 2.1,
        threshold: 10,
        status: (champions.percentage || 0) >= 10 ? 'good' : 'warning'
      },
      featureAdoption: {
        value: current.featureAdoption || 0,
        change: ((current.featureAdoption - previous.featureAdoption) / previous.featureAdoption) * 100 || 0,
        threshold: 70,
        status: (current.featureAdoption || 0) >= 70 ? 'good' : 'warning'
      },
      timeToValue: {
        value: current.timeToValue || 0,
        change: ((previous.timeToValue - current.timeToValue) / previous.timeToValue) * 100 || 0,
        threshold: 14,
        status: (current.timeToValue || 0) <= 14 ? 'good' : 'warning'
      },
      retention: {
        value: current.retentionRate || 0,
        change: ((current.retentionRate - previous.retentionRate) / previous.retentionRate) * 100 || 0,
        threshold: 80,
        status: (current.retentionRate || 0) >= 80 ? 'good' : 'warning'
      },
      churnRisk: {
        value: atRisk.percentage || 0,
        change: -1.5,
        threshold: 15,
        status: (atRisk.percentage || 0) <= 15 ? 'good' : 'danger'
      },
      activation: {
        value: current.activationRate || 0,
        change: ((current.activationRate - previous.activationRate) / previous.activationRate) * 100 || 0,
        threshold: 75,
        status: (current.activationRate || 0) >= 75 ? 'good' : 'warning'
      }
    }
  }, [data, segments])

  const KpiCard = ({ title, kpi, icon: Icon, unit, description }: any) => {
    const isPositiveChange = title === 'Time to Value' ? kpi.change > 0 : kpi.change >= 0
    const statusColor = kpi.status === 'good' ? 'green' : kpi.status === 'warning' ? 'yellow' : 'red'
    
    return (
      <Card className={`border-l-4 ${
        statusColor === 'green' ? 'border-l-green-500 bg-white-50' :
        statusColor === 'yellow' ? 'border-l-yellow-500 bg-white-50' :
        'border-l-red-500 bg-red-50'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${
            statusColor === 'green' ? 'text-green-600' :
            statusColor === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpi.value}{unit}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <div className={`flex items-center text-xs mt-2 ${
            isPositiveChange ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveChange ? 
              <ArrowUp className="h-3 w-3 mr-1" /> : 
              <ArrowDown className="h-3 w-3 mr-1" />
            }
            {Math.abs(kpi.change).toFixed(1)}% vs previous period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <KpiCard 
        title="Product-Market Fit" 
        kpi={kpis.productMarketFit} 
        icon={Target}
        unit="%"
        description="Champions segment size"
      />
      <KpiCard 
        title="Feature Adoption" 
        kpi={kpis.featureAdoption} 
        icon={Zap}
        unit="%"
        description="Core features used"
      />
      <KpiCard 
        title="Time to Value" 
        kpi={kpis.timeToValue} 
        icon={Clock}
        unit=" days"
        description="Until first success"
      />
      <KpiCard 
        title="User Retention" 
        kpi={kpis.retention} 
        icon={UserCheck}
        unit="%"
        description="30-day retention rate"
      />
      <KpiCard 
        title="Churn Risk" 
        kpi={kpis.churnRisk} 
        icon={AlertTriangle}
        unit="%"
        description="At-risk user segment"
      />
      <KpiCard 
        title="Activation Rate" 
        kpi={kpis.activation} 
        icon={CheckCircle}
        unit="%"
        description="Successful onboarding"
      />
    </div>
  )
}

const ProductTrendAnalysis = ({ data }: { data: UsageDataPoint[] }) => {
  const [selectedMetric, setSelectedMetric] = useState('retention')
  
  const metricConfig = {
    retention: {
      dataKey: 'retentionRate',
      name: 'User Retention Rate',
      color: '#00C49F',
      unit: '%',
      target: 80,
      description: 'Percentage of users returning after 30 days'
    },
    adoption: {
      dataKey: 'featureAdoption', 
      name: 'Feature Adoption Rate',
      color: '#8884d8',
      unit: '%',
      target: 70,
      description: 'Percentage of users using core features'
    },
    activation: {
      dataKey: 'activationRate',
      name: 'User Activation Rate', 
      color: '#FF8042',
      unit: '%',
      target: 75,
      description: 'Percentage completing successful onboarding'
    },
    timeToValue: {
      dataKey: 'timeToValue',
      name: 'Time to Value',
      color: '#FFBB28', 
      unit: ' days',
      target: 14,
      description: 'Days until users achieve first success',
      inverse: true
    }
  }
  
  const currentMetric = metricConfig[selectedMetric]
  const latestValue = data[data.length - 1]?.[currentMetric.dataKey] || 0
  const isOnTarget = currentMetric.inverse ? 
    latestValue <= currentMetric.target : 
    latestValue >= currentMetric.target

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Health Trends</CardTitle>
        <CardDescription>
          {currentMetric.description}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <Button 
            variant={selectedMetric === 'retention' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedMetric('retention')}
          >
            Retention
          </Button>
          <Button 
            variant={selectedMetric === 'adoption' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedMetric('adoption')}
          >
            Adoption
          </Button>
          <Button 
            variant={selectedMetric === 'activation' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedMetric('activation')}
          >
            Activation
          </Button>
          <Button 
            variant={selectedMetric === 'timeToValue' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedMetric('timeToValue')}
          >
            Time to Value
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold" style={{ color: currentMetric.color }}>
              {latestValue}{currentMetric.unit}
            </div>
            <div className={`flex items-center text-sm ${isOnTarget ? 'text-green-600' : 'text-red-600'}`}>
              {isOnTarget ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertTriangle className="h-4 w-4 mr-1" />}
              {isOnTarget ? 'On Target' : 'Below Target'}
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            Target: {currentMetric.target}{currentMetric.unit}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="fiscalWeek" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}${currentMetric.unit}`}
              />
              <Tooltip 
                formatter={(value) => [`${value}${currentMetric.unit}`, currentMetric.name]}
                labelFormatter={(label) => `Week: ${label}`}
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              />
              <Bar 
                dataKey={currentMetric.dataKey} 
                fill={currentMetric.color}
                radius={[4, 4, 0, 0]}
                name={currentMetric.name}
              />
              <ReferenceLine 
                y={currentMetric.target} 
                stroke={isOnTarget ? '#00C49F' : '#FF6B6B'} 
                strokeDasharray="5 5"
                label={{ 
                  value: `Target: ${currentMetric.target}${currentMetric.unit}`, 
                  position: 'topRight' 
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const FeaturePerformanceMatrix = ({ features }: { features: FeatureData[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Performance Matrix</CardTitle>
        <CardDescription>
          Evaluate features by adoption rate and business impact to prioritize development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Adoption</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Time to First Use</TableHead>
                <TableHead>Business Impact</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.name}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${feature.adoption}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{feature.adoption}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{feature.satisfaction}/5</span>
                      <ThumbsUp className="h-3 w-3 ml-1 text-green-600" />
                    </div>
                  </TableCell>
                  <TableCell>{feature.timeToFirstUse} days</TableCell>
                  <TableCell>
                    <Badge variant={
                      feature.impact === 'High' ? 'default' :
                      feature.impact === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {feature.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {feature.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : feature.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {feature.adoption < 30 ? 'Promote' : 
                       feature.satisfaction < 4.0 ? 'Improve' : 
                       'Maintain'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

const UserSegmentTable = ({ segments }: { segments: UserSegment[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Segment Analysis</CardTitle>
        <CardDescription>
          Understand user groups to inform product strategy and feature prioritization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>% of Base</TableHead>
              <TableHead>ARPU</TableHead>
              <TableHead>Revenue Share</TableHead>
              <TableHead>Retention</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Product Focus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((segment) => (
              <TableRow key={segment.segment}>
                <TableCell className="font-medium">{segment.segment}</TableCell>
                <TableCell>{formatNumber(segment.users)}</TableCell>
                <TableCell>{segment.percentage}%</TableCell>
                <TableCell>{formatCurrency(segment.arpu)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${segment.revenueShare * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{segment.revenueShare}%</span>
                  </div>
                </TableCell>
                <TableCell>{segment.retentionRate}%</TableCell>
                <TableCell>{segment.engagementScore}/10</TableCell>
                <TableCell>
                  <Badge variant={
                    segment.segment === 'Champions' ? 'default' :
                    segment.segment === 'Power Users' ? 'secondary' :
                    segment.segment === 'At Risk' ? 'destructive' : 'outline'
                  }>
                    {segment.segment === 'Champions' ? 'Advocacy' :
                     segment.segment === 'Power Users' ? 'Advanced Features' :
                     segment.segment === 'Regular Users' ? 'Core Experience' :
                     segment.segment === 'Casual Users' ? 'Simplification' : 'Retention'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const EngagementDepthAnalysis = ({ segments }: { segments: UserSegment[] }) => {
  const scatterData = segments.flatMap(segment => 
    Array.from({ length: 20 }, (_, i) => ({
      frequency: Math.random() * 20 + (segment.engagementScore * 2),
      depth: Math.random() * 10 + (segment.engagementScore * 0.8),
      value: segment.arpu + (Math.random() - 0.5) * segment.arpu * 0.5,
      segment: segment.segment,
      color: segment.segment === 'Champions' ? '#00C49F' :
             segment.segment === 'Power Users' ? '#0088FE' :
             segment.segment === 'Regular Users' ? '#FFBB28' :
             segment.segment === 'Casual Users' ? '#FF8042' : '#8884d8'
    }))
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Depth Matrix</CardTitle>
        <CardDescription>
          Frequency vs. depth of usage to identify engagement patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="frequency" 
                name="Usage Frequency" 
                label={{ value: 'Sessions per Week', position: 'insideBottom', offset: -5 }} 
                domain={[0, 25]}
              />
              <YAxis 
                type="number" 
                dataKey="depth" 
                name="Usage Depth" 
                label={{ value: 'Features Used', angle: -90, position: 'insideLeft' }} 
                domain={[0, 12]}
              />
              <ZAxis type="number" dataKey="value" range={[50, 400]} name="ARPU" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'value') return [formatCurrency(Number(value)), 'ARPU'];
                  return [Number(value).toFixed(1), name === 'frequency' ? 'Sessions/Week' : 'Features Used'];
                }} 
              />
              <Scatter name="Champions" data={scatterData.filter(d => d.segment === 'Champions')} fill="#00C49F" />
              <Scatter name="Power Users" data={scatterData.filter(d => d.segment === 'Power Users')} fill="#0088FE" />
              <Scatter name="Regular Users" data={scatterData.filter(d => d.segment === 'Regular Users')} fill="#FFBB28" />
              <Scatter name="Casual Users" data={scatterData.filter(d => d.segment === 'Casual Users')} fill="#FF8042" />
              <Scatter name="At Risk" data={scatterData.filter(d => d.segment === 'At Risk')} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const ProductInsights = ({ data, segments, features }: { data: UsageDataPoint[], segments: UserSegment[], features: FeatureData[] }) => {
  const insights = generateProductInsights()
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Strategy Insights</CardTitle>
        <CardDescription>
          Data-driven recommendations for product development and user growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <Badge variant={
                    insight.type === 'growth' ? 'default' :
                    insight.type === 'product' ? 'secondary' :
                    insight.type === 'retention' ? 'destructive' : 'outline'
                  }>
                    {insight.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-blue-600">{insight.action}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Impact: {insight.impact}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Effort: {insight.effort}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Main Component
// ————————————————————————

export default function ProductUsageDashboard() {
  const usageData = useMemo(() => generateUsageData(52), [])
  const userSegments = useMemo(() => generateUserSegments(), [])
  const featureData = useMemo(() => generateFeatureData(), [])
  const [timeframe, setTimeframe] = useState('weekly')
  const [activeTab, setActiveTab] = useState('health')

  const filteredData = useMemo(() => {
    return usageData.slice(0, timeframe === 'daily' ? 90 : timeframe === 'monthly' ? 12 : 52)
  }, [usageData, timeframe])






   return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Usage</h1>
          <p className="text-muted-foreground">
           Make data-driven product decisions with actionable user insights
          </p>
        </div>

        
        <div className="flex flex-wrap gap-4">

            <div className="flex gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
</div>

        </div>
</div>
<div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
           <TabsList className="flex overflow-x-auto md:grid md:grid-cols-5 w-full">
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="segments">Segments</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="health" className="space-y-6">
                <ProductHealthKPIs data={filteredData} segments={userSegments} />
                <ProductTrendAnalysis data={filteredData} />
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <FeaturePerformanceMatrix features={featureData} />
              </TabsContent>

              <TabsContent value="segments" className="space-y-6">
                <UserSegmentTable segments={userSegments} />
              </TabsContent>

              <TabsContent value="engagement" className="space-y-6">
                <EngagementDepthAnalysis segments={userSegments} />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <ProductInsights data={filteredData} segments={userSegments} features={featureData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserSegmentTable segments={userSegments} />
                  <EngagementDepthAnalysis segments={userSegments} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

  )
}