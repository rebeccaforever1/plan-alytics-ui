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
  ScatterChart,
  Scatter,
  ZAxis,
   ReferenceLine,
  
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
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Clock,
  UserCheck,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  ChevronDown,
  ChevronUp,
  Archive,
  Users,
  BarChart3,
  Activity,
  Calendar,
  ArrowRight,
 
} from 'lucide-react'

// ————————————————————————————
// Import Data and Types
// ————————————————————————————

import {
  generateUsageData,
  generateFeatureData,
  generateUserSegments,
  generateAutoDiscoveredSegments,
  generateAIRecommendations,
  generateFeatureInsights,
  generateSegmentInsights,
  generateEngagementInsights,
  filterDimensions,
  UsageDataPoint,
  FeatureData,
  UserSegment,
  AutoDiscoveredSegment,
  AIRecommendation,
  ContextualInsight,
} from '@/lib/fakeData'

// ————————————————————————————
// Types for Filters
// ————————————————————————————

interface ActiveFilters {
  segment: string
  planTier: string
  geography: string
  tenureBand: string
  clvCategory: string
}

// ————————————————————————————
// Utility Functions
// ————————————————————————————

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

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'destructive'
    case 'high': return 'default'
    case 'medium': return 'secondary'
    case 'low': return 'outline'
    default: return 'outline'
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical': return AlertTriangle
    case 'high': return TrendingUp
    case 'medium': return Activity
    case 'low': return Clock3
    default: return Activity
  }
}

// ————————————————————————————
// Global Filter Bar Component
// ————————————————————————————

const GlobalFilterBar = ({ 
  activeFilters, 
  onFilterChange, 
  onClearAll 
}: { 
  activeFilters: ActiveFilters
  onFilterChange: (key: keyof ActiveFilters, value: string) => void
  onClearAll: () => void
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(v => !v.startsWith('All'))
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter by:
          </div>
          
          <Select value={activeFilters.segment} onValueChange={(v) => onFilterChange('segment', v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterDimensions.segments.map(seg => (
                <SelectItem key={seg} value={seg}>{seg}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilters.planTier} onValueChange={(v) => onFilterChange('planTier', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterDimensions.planTiers.map(plan => (
                <SelectItem key={plan} value={plan}>{plan}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilters.geography} onValueChange={(v) => onFilterChange('geography', v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterDimensions.geographies.map(geo => (
                <SelectItem key={geo} value={geo}>{geo}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilters.tenureBand} onValueChange={(v) => onFilterChange('tenureBand', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterDimensions.tenureBands.map(tenure => (
                <SelectItem key={tenure} value={tenure}>{tenure}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilters.clvCategory} onValueChange={(v) => onFilterChange('clvCategory', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterDimensions.clvCategories.map(clv => (
                <SelectItem key={clv} value={clv}>{clv}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="gap-2">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (value.startsWith('All')) return null
              return (
                <Badge key={key} variant="secondary" className="gap-1">
                  {value}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterChange(key as keyof ActiveFilters, `All ${key}`)}
                  />
                </Badge>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Overview Tab - Health KPIs
// ————————————————————————————

const ProductHealthKPIs = ({ 
  data, 
  segments 
}: { 
  data: UsageDataPoint[]
  segments: UserSegment[] 
}) => {
  const kpis = useMemo(() => {
    const current = data[data.length - 1] || {}
    const previous = data[data.length - 2] || {}
    
    const champions = segments.find(s => s.segment === 'Champions') || { retentionRate: 0, percentage: 0, arpu: 0 }
    const atRisk = segments.find(s => s.segment === 'At Risk') || { retentionRate: 0, percentage: 0, users: 0, arpu: 0 }
    const allSegments = segments.reduce((acc, s) => {
      acc.totalRevenue += (s.users * s.arpu)
      acc.totalUsers += s.users
      return acc
    }, { totalRevenue: 0, totalUsers: 0 })
    
    return {
      championVsAtRisk: {
        championRate: champions.retentionRate || 0,
        atRiskRate: atRisk.retentionRate || 0,
        spread: (champions.retentionRate || 0) - (atRisk.retentionRate || 0),
        status: (champions.retentionRate - atRisk.retentionRate) > 40 ? 'good' : 'warning'
      },
      featureAdoption: {
        value: current.featureAdoption || 0,
        change: ((current.featureAdoption - previous.featureAdoption) / previous.featureAdoption) * 100 || 0,
        status: (current.featureAdoption || 0) >= 70 ? 'good' : 'warning'
      },
      timeToActivation: {
        value: current.timeToValue || 0,
        change: ((previous.timeToValue - current.timeToValue) / previous.timeToValue) * 100 || 0,
        status: (current.timeToValue || 0) <= 14 ? 'good' : 'warning'
      },
      atRiskARR: {
        value: (atRisk.users * atRisk.arpu * 12) / 1000, // in thousands
        percentage: atRisk.percentage || 0,
        status: (atRisk.percentage || 0) <= 10 ? 'good' : 'danger'
      },
      revenueConcentration: {
        championShare: champions.percentage || 0,
        revenueShare: ((champions.users * champions.arpu) / allSegments.totalRevenue) * 100,
        status: 'good'
      },
      avgARPU: {
        value: allSegments.totalRevenue / allSegments.totalUsers,
        championARPU: champions.arpu,
        lift: ((champions.arpu / (allSegments.totalRevenue / allSegments.totalUsers)) - 1) * 100,
        status: 'good'
      }
    }
  }, [data, segments])

  const ComparisonKpiCard = ({ 
    title, 
    primaryValue, 
    primaryLabel,
    secondaryValue,
    secondaryLabel,
    icon: Icon,
    unit,
    description,
    statusColor
  }: any) => {
    return (
      <Card className={`border-l-4 border-l-${statusColor}-500`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 text-${statusColor}-600`} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">{primaryLabel}</span>
              <span className="text-xl font-bold">{primaryValue}{unit}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">{secondaryLabel}</span>
              <span className="text-xl font-bold">{secondaryValue}{unit}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{description}</p>
        </CardContent>
      </Card>
    )
  }

  const SimpleKpiCard = ({ title, value, unit, description, icon: Icon, change, statusColor }: any) => {
    return (
      <Card className={`border-l-4 border-l-${statusColor}-500`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 text-${statusColor}-600`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}{unit}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          {change !== undefined && (
            <div className={`flex items-center text-xs mt-2 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? 
                <ArrowUp className="h-3 w-3 mr-1" /> : 
                <ArrowDown className="h-3 w-3 mr-1" />
              }
              {Math.abs(change).toFixed(1)}% vs last period
            </div>
          )}
        </CardContent>
      </Card>

      
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      <SimpleKpiCard 
        title="Feature Adoption Rate" 
        value={kpis.featureAdoption.value.toFixed(1)}
        unit="%"
        description="Users actively using 3+ core features"
        icon={Zap}
        change={kpis.featureAdoption.change}
        statusColor={kpis.featureAdoption.status === 'good' ? 'green' : 'yellow'}
      />
      
      
       <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Concentration Among Product Usage</CardTitle>
        <Users className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 py-1">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {kpis.revenueConcentration.championShare.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">of 3+ core features</div>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">→</div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {kpis.revenueConcentration.revenueShare.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">of revenue</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Product adoption drive disproportionate value
        </p>
      </CardContent>
    </Card>
     
     <SimpleKpiCard 
        title="Time to Feature Adoption" 
        value={kpis.timeToActivation.value.toFixed(1)}
        unit=" days"
        description="User initiates key feature usage (2+)"
        icon={Clock}
        change={-kpis.timeToActivation.change}
        statusColor={kpis.timeToActivation.status === 'good' ? 'green' : 'yellow'}
      />
    </div>
  )
}

// ————————————————————————————
// Latest Insights Preview (Overview Tab)
// ————————————————————————————

const LatestInsightsPreview = ({ 
  recommendations 
}: { 
  recommendations: AIRecommendation[] 
}) => {
  const topRecommendations = recommendations
    .filter(r => r.status === 'new')
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Top AI Recommendations
            </CardTitle>
            <CardDescription>
              Highest priority actions requiring attention
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">{topRecommendations.length} urgent</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topRecommendations.map((rec, idx) => {
          const Icon = getPriorityIcon(rec.priority)
          return (
            <div key={rec.id} className={`p-4 rounded-lg border-2 ${
              rec.priority === 'critical' ? 'border-red-200 bg-red-50' :
              rec.priority === 'high' ? 'border-orange-200 bg-orange-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  rec.priority === 'critical' ? 'bg-red-100' :
                  rec.priority === 'high' ? 'bg-orange-100' :
                  'bg-yellow-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    rec.priority === 'critical' ? 'text-red-600' :
                    rec.priority === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={getPriorityColor(rec.priority)} className="uppercase font-semibold">
                      {rec.priority}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{rec.category}</span>
                  </div>
                  <h4 className="font-semibold text-base mb-2 text-foreground">{rec.title}</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-semibold text-foreground ml-1">{rec.affectedUsers.toLocaleString()} users</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effect:</span>
                      <span className="font-semibold text-green-700 ml-1">{rec.expectedLift}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Features Tab - Adoption + Retention Chart
// ————————————————————————————

const FeatureAdoptionRetentionChart = ({ 
  features,
  activeFilters,
  segments
}: { 
  features: FeatureData[]
  activeFilters: ActiveFilters
  segments: UserSegment[]
}) => {
  const chartData = useMemo(() => {
    // Calculate weighted average retention based on segments
    const getRetentionForFeature = (feature: FeatureData) => {
      // Higher impact features correlate with better retention
      // This simulates the relationship between feature adoption and retention
      const baseRetention = 75
      const impactBonus = feature.impact === 'high' ? 15 : feature.impact === 'medium' ? 8 : 3
      return baseRetention + impactBonus + (Math.random() * 5)
    }

    return features.map(f => {
      let adoption = f.adoption
      
      // Apply filters to adoption data
      if (activeFilters.planTier !== 'All Plans' && f.adoptionByPlan) {
        adoption = f.adoptionByPlan[activeFilters.planTier] || adoption
      }
      if (activeFilters.geography !== 'All Regions' && f.adoptionByGeography) {
        adoption = f.adoptionByGeography[activeFilters.geography] || adoption
      }
      if (activeFilters.tenureBand !== 'All Tenure' && f.adoptionByTenure) {
        adoption = f.adoptionByTenure[activeFilters.tenureBand] || adoption
      }
      if (activeFilters.clvCategory !== 'All CLV' && f.adoptionByCLV) {
        adoption = f.adoptionByCLV[activeFilters.clvCategory] || adoption
      }
      
      // Apply segment filter
      if (activeFilters.segment !== 'All Segments') {
        const segment = segments.find(s => s.segment === activeFilters.segment)
        if (segment) {
          // Adjust adoption based on segment engagement
          const engagementFactor = segment.engagementScore / 6 // normalize to ~1
          adoption = adoption * engagementFactor
        }
      }
      
      return {
        name: f.name,
        adoption: adoption,
        retention: getRetentionForFeature(f),
        impact: f.impact
      }
    }).sort((a, b) => b.adoption - a.adoption)
  }, [features, activeFilters, segments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Adoption vs User Retention</CardTitle>
        <CardDescription>
          Adoption rate and retention correlation for each feature
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" domain={[0, 100]} label={{ value: 'Adoption %', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: 'Retention %', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'adoption') return [`${value.toFixed(1)}%`, 'Adoption']
                  if (name === 'retention') return [`${value.toFixed(1)}%`, 'User Retention']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="adoption" 
                fill="#3b82f6"
                name="Adoption Rate"
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="retention" 
                stroke="#10b981" 
                strokeWidth={3}
                name="User Retention"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Contextual Insights Grids - 
// ————————————————————————————

// ————————————————————————————
// Contextual Insights - Sortable Grid
// ————————————————————————————
// ————————————————————————————
// Contextual Insights - Sortable Grid with Data Proof
// ————————————————————————————

type InsightSortColumn = 'priority' | 'title'
type InsightSortDirection = 'asc' | 'desc'

const FeatureInsightsCards = ({ 
  insights,
  title 
}: { 
  insights: ContextualInsight[]
  title: string
}) => {
  const [sortColumn, setSortColumn] = useState<InsightSortColumn>('priority')
  const [sortDirection, setSortDirection] = useState<InsightSortDirection>('asc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSort = (column: InsightSortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (column: InsightSortColumn) => {
    if (sortColumn !== column) return <ArrowUp className="h-3 w-3 opacity-30" />
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />
  }

  const sortedInsights = useMemo(() => {
    const sorted = [...insights]
    
    sorted.sort((a, b) => {
      let comparison = 0
      
      if (sortColumn === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
      } else {
        comparison = a.title.localeCompare(b.title)
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }, [insights, sortColumn, sortDirection])

  // Generate proof chart data based on insight
  const getProofChartData = (insight: ContextualInsight) => {
    // Generate different data based on the insight type
    if (insight.title.includes('engagement drops') || insight.title.includes('day 14')) {
      // First 30 days engagement data
      return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        withFeatures: 85 - (i > 14 && i < 21 ? (i - 14) * 2 : 0),
        withoutFeatures: 85 - (i > 14 && i < 21 ? (i - 14) * 5 : i > 20 ? 35 : 0)
      }))
    } else if (insight.title.includes('Weekend')) {
      // Usage by day of week
      return [
        { day: 'Mon', usage: 850, retention: 72 },
        { day: 'Tue', usage: 920, retention: 74 },
        { day: 'Wed', usage: 880, retention: 73 },
        { day: 'Thu', usage: 910, retention: 75 },
        { day: 'Fri', usage: 780, retention: 71 },
        { day: 'Sat', usage: 520, retention: 68 },
        { day: 'Sun', usage: 480, retention: 68 }
      ]
    } else if (insight.title.includes('Session duration')) {
      // Session duration vs upgrades
      return [
        { duration: '0-10', upgrades: 8, users: 2400 },
        { duration: '10-15', upgrades: 12, users: 1800 },
        { duration: '15-20', upgrades: 18, users: 1500 },
        { duration: '20-25', upgrades: 24, users: 1200 },
        { duration: '25-30', upgrades: 52, users: 800 },
        { duration: '30+', upgrades: 68, users: 600 }
      ]
    } else if (insight.title.includes('Evening') || insight.title.includes('timezone')) {
      // Usage by hour
      return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        users: i < 6 ? 100 + i * 20 :
               i < 12 ? 300 + i * 40 :
               i < 18 ? 800 + i * 20 :
               i < 22 ? 1200 + (i - 18) * 150 :
               800 - (i - 22) * 200
      }))
    }
    
    // Default generic trend
    return Array.from({ length: 12 }, (_, i) => ({
      period: `Week ${i + 1}`,
      value: 70 + Math.random() * 20
    }))
  }

  const renderProofChart = (insight: ContextualInsight) => {
    const data = getProofChartData(insight)
    
    if (insight.title.includes('engagement drops') || insight.title.includes('day 14')) {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Days Since Signup', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="withFeatures" name="Users with 3+ Features" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="withoutFeatures" name="Users with <3 Features" stroke="#ef4444" strokeWidth={3} />
              <ReferenceLine x={14} stroke="#94a3b8" strokeDasharray="3 3" label="Day 14" />
              <ReferenceLine x={21} stroke="#94a3b8" strokeDasharray="3 3" label="Day 21" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )
    } else if (insight.title.includes('Weekend')) {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" label={{ value: 'Daily Active Users', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Retention %', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="usage" fill="#3b82f6" name="Active Users" />
              <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} name="Retention %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )
    } else if (insight.title.includes('Session duration')) {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" label={{ value: 'Avg Session Duration (minutes)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Upgrade Rate %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="upgrades" fill="#3b82f6" name="Upgrade Rate %" />
              <Line type="monotone" dataKey="upgrades" stroke="#10b981" strokeWidth={3} name="Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )
    } else if (insight.title.includes('Evening') || insight.title.includes('timezone')) {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Hour of Day (EST)', position: 'insideBottom', offset: -5 }}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis label={{ value: 'Active Users', angle: -90, position: 'insideLeft' }} />
              <Tooltip labelFormatter={(hour) => `${hour}:00 EST`} />
              <Bar dataKey="users" fill="#3b82f6" name="Active Users" />
              <ReferenceLine x={20} stroke="#ef4444" strokeWidth={2} label="Peak: 8-10pm" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
    
    // Default chart
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const SortableHeader = ({ column, children }: { column: InsightSortColumn, children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(column)}
      </div>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Click column headers to sort. Click "View Data" to see supporting evidence.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader column="priority">Priority</SortableHeader>
                <SortableHeader column="title">Insight</SortableHeader>
                <TableHead>Metric</TableHead>
                <TableHead className="text-center">View Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInsights.map(insight => {
                const isExpanded = expandedId === insight.id
                const Icon = getPriorityIcon(insight.priority)
                
                return (
                  <React.Fragment key={insight.id}>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant={getPriorityColor(insight.priority)} className="uppercase text-xs font-semibold">
                          {insight.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-xl">
                        <div className="flex items-start gap-2">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold mb-1">{insight.title}</div>
                            <div className="text-sm text-muted-foreground">{insight.description}</div>
                            {insight.action && (
                              <div className="flex items-start gap-2 mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                <span className="text-sm text-foreground">{insight.action}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {insight.metric || '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-gray-50 p-6">
                          <div className="bg-white rounded-lg border p-4">
                            <h4 className="font-semibold text-sm mb-4 text-foreground">
  {insight.title.includes('engagement drops') || insight.title.includes('day 14') ? 'Engagement by Day: First 30 Days' :
   insight.title.includes('Weekend') ? 'Usage & Retention by Day of Week' :
   insight.title.includes('Session duration') ? 'Session Duration vs Upgrade Rate' :
   insight.title.includes('Evening') || insight.title.includes('timezone') ? 'Hourly Usage Distribution (EST)' :
   'Supporting Data'}
</h4>
                            {renderProofChart(insight)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
// ————————————————————————————
// Segments Tab - Distribution Chart
// ————————————————————————————

const SegmentDistributionChart = ({ 
  segments 
}: { 
  segments: UserSegment[] 
}) => {
  const chartData = segments.map(s => ({
    segment: s.segment,
    users: s.users,
    percentage: s.percentage,
    revenue: (s.users * s.arpu) / 1000 // in thousands
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Segment Distribution</CardTitle>
        <CardDescription>
          User count and revenue contribution by segment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'users') return [formatNumber(value), 'Users']
                  if (name === 'revenue') return [formatCurrency(value * 1000), 'Monthly Revenue']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="users" fill="#3b82f6" name="Users" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($K)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Segments Tab - Auto-Discovered Segments with Context
// ————————————————————————————

// ————————————————————————————
// Segments Tab - Auto-Discovered Segments Sortable Grid
// ————————————————————————————

type SegmentSortColumn = 'impact' | 'date' | 'users' | 'clv' | 'retention'
type SegmentSortDirection = 'asc' | 'desc'

const AutoDiscoveredSegmentsSection = ({ 
  segments 
}: { 
  segments: AutoDiscoveredSegment[] 
}) => {
  const [sortColumn, setSortColumn] = useState<SegmentSortColumn>('impact')
  const [sortDirection, setSortDirection] = useState<SegmentSortDirection>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSort = (column: SegmentSortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection(column === 'impact' || column === 'users' || column === 'clv' || column === 'retention' ? 'desc' : 'asc')
    }
  }

  const getSortIcon = (column: SegmentSortColumn) => {
    if (sortColumn !== column) return <ArrowUp className="h-3 w-3 opacity-30" />
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />
  }

  const sortedSegments = useMemo(() => {
    const sorted = [...segments]
    
    sorted.sort((a, b) => {
      let comparison = 0
      
      switch (sortColumn) {
        case 'impact':
          comparison = a.impactScore - b.impactScore
          break
        case 'date':
          comparison = new Date(a.discoveredDate).getTime() - new Date(b.discoveredDate).getTime()
          break
        case 'users':
          comparison = a.userCount - b.userCount
          break
        case 'clv':
          comparison = a.avgCLV - b.avgCLV
          break
        case 'retention':
          comparison = a.retentionRate - b.retentionRate
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }, [segments, sortColumn, sortDirection])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return { bg: 'bg-blue-100', text: 'text-blue-800' }
      case 'lifecycle': return { bg: 'bg-green-100', text: 'text-green-800' }
      case 'value-based': return { bg: 'bg-purple-100', text: 'text-purple-800' }
      case 'risk': return { bg: 'bg-red-100', text: 'text-red-800' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' }
    }
  }

  const SortableHeader = ({ column, children }: { column: SegmentSortColumn, children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(column)}
      </div>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Discovered User Segments
          </CardTitle>
          <CardDescription className="text-base">
            Distinct user groups identified through behavioral pattern analysis, lifecycle stages, value indicators, and risk signals. 
            Click column headers to sort. Click rows to expand details.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Category</TableHead>
                <SortableHeader column="users">Users</SortableHeader>
                <SortableHeader column="clv">Avg CLV</SortableHeader>
                <SortableHeader column="retention">Retention</SortableHeader>
                <SortableHeader column="impact">Impact</SortableHeader>
                <SortableHeader column="date">Discovered</SortableHeader>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSegments.map(segment => {
                const isExpanded = expandedId === segment.id
                const colors = getCategoryColor(segment.category)
                
                return (
                  <React.Fragment key={segment.id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedId(isExpanded ? null : segment.id)}
                    >
                      <TableCell className="font-semibold">
                        {segment.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${colors.bg} ${colors.text}`}>
                          {segment.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatNumber(segment.userCount)}
                        <span className="text-xs text-muted-foreground ml-1">({segment.percentageOfBase}%)</span>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(segment.avgCLV)}</TableCell>
                      <TableCell className="font-semibold">{segment.retentionRate}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {segment.impactScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(segment.discoveredDate)}</TableCell>
                      <TableCell>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-gray-50">
                          <div className="p-4 space-y-4">
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-sm mb-2 text-foreground">Business Impact:</h4>
                              <p className="text-sm text-foreground">{segment.whyItMatters}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-3 text-foreground">Defining Characteristics:</h4>
                              <div className="grid gap-2">
                                {segment.keyCharacteristics.map((char, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-2 rounded bg-white">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-purple-600 font-bold text-xs">{idx + 1}</span>
                                    </div>
                                    <span className="text-sm text-foreground">{char}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-foreground">Top Features Used:</h4>
                              <div className="flex gap-2 flex-wrap">
                                {segment.topFeatures.map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Engagement Tab - Depth Matrix  
// ————————————————————————————

const EngagementDepthMatrix = ({ 
  segments 
}: { 
  segments: UserSegment[] 
}) => {
  // Create heatmap data - frequency (x) vs depth (y)
  const heatmapData = useMemo(() => {
    const data = []
    const frequencyBins = ['0-5', '6-10', '11-15', '16-20', '20+']
    const depthBins = ['1-2', '3-4', '5-6', '7-8', '9+']
    
    for (let y = 0; y < depthBins.length; y++) {
      for (let x = 0; x < frequencyBins.length; x++) {
        let userCount = 0
        let dominantSegment = ''
        let maxSegmentUsers = 0
                
        segments.forEach(segment => {
          let expectedX, expectedY
          
          if (segment.segment === 'Champions') {
            expectedX = 4
            expectedY = 4
          } else if (segment.segment === 'At Risk') {
            expectedX = 0
            expectedY = 0
          } else if (segment.segment === 'Power Users') {
            expectedX = 3
            expectedY = 3
          } else if (segment.segment === 'Regular Users') {
            expectedX = 2
            expectedY = 2
          } else {
            expectedX = 1
            expectedY = 1
          }
          
          const distance = Math.abs(x - expectedX) + Math.abs(y - expectedY)
          
          if (distance <= 1) {
            const contribution = Math.floor(segment.users / (distance + 1) / 4)
            userCount += contribution
            
            if (contribution > maxSegmentUsers) {
              maxSegmentUsers = contribution
              dominantSegment = segment.segment
            }
          }
        })
        
        data.push({
          frequency: frequencyBins[x],
          depth: depthBins[y],
          users: userCount,
          segment: dominantSegment,
          x,
          y
        })
      }
    }
    
    return data
  }, [segments])

  const trendData = useMemo(() => {
    const weeks = 12
    return Array.from({ length: weeks }, (_, i) => {
      const week = `W${i + 1}`
      const dataPoint: any = { week }
      
      segments.forEach(segment => {
        const baseFrequency = (segment.engagementScore / 10) * 20
        const variation = (Math.random() - 0.5) * 4
        dataPoint[segment.segment] = Math.max(0, baseFrequency + variation)
      })
      
      return dataPoint
    })
  }, [segments])

  const maxUsers = Math.max(...heatmapData.map(d => d.users))
  
  const getColor = (users: number, segment: string) => {
    const intensity = users / maxUsers
    if (intensity < 0.1) return '#f3f4f6'
    
    const baseColors: Record<string, string> = {
      'Champions': '#00C49F',
      'Power Users': '#0088FE',
      'Regular Users': '#FFBB28',
      'Casual Users': '#FF8042',
      'At Risk': '#8884d8'
    }
    
    const color = baseColors[segment] || '#94a3b8'
    return color + Math.floor(intensity * 255).toString(16).padStart(2, '0')
  }

  const segmentColors: Record<string, string> = {
    'Champions': '#00C49F',
    'Power Users': '#0088FE',
    'Regular Users': '#FFBB28',
    'Casual Users': '#FF8042',
    'At Risk': '#8884d8'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Analysis</CardTitle>
        <CardDescription>
          Heatmap shows current distribution by frequency and depth. Line chart shows weekly trends by segment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heatmap */}
          <div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex">
                <div className="flex items-center mr-3">
                  <div className="text-xs font-medium text-muted-foreground transform -rotate-90 whitespace-nowrap">
                    Features Used
                  </div>
                </div>
                
                <div>
                  <div className="grid grid-rows-5 gap-1">
                    {['9+', '7-8', '5-6', '3-4', '1-2'].map((depth, yIdx) => (
                      <div key={depth} className="flex items-center gap-1">
                        <div className="w-10 text-xs text-right text-muted-foreground pr-2">
                          {depth}
                        </div>
                        {heatmapData
                          .filter(d => d.y === (4 - yIdx))
                          .sort((a, b) => a.x - b.x)
                          .map((cell) => (
                            <div
                              key={`${cell.x}-${cell.y}`}
                              className="w-14 h-14 rounded border border-gray-300 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group relative"
                              style={{ backgroundColor: getColor(cell.users, cell.segment) }}
                            >
                              <div className="text-xs font-semibold">
                                {cell.users > 0 ? (cell.users > 999 ? `${(cell.users/1000).toFixed(1)}k` : cell.users) : ''}
                              </div>
                              {cell.users > 0 && (
                                <div className="hidden group-hover:block absolute bottom-full mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                                  {cell.segment}: {formatNumber(cell.users)} users
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="w-10"></div>
                    {['0-5', '6-10', '11-15', '16-20', '20+'].map(freq => (
                      <div key={freq} className="w-14 text-xs text-center text-muted-foreground">
                        {freq}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2 ml-10">
                    Sessions per Week
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap mt-4">
              {segments.map(segment => (
                <div key={segment.segment} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: segmentColors[segment.segment] }}
                  />
                  <span className="text-xs">{segment.segment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div>
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    label={{ value: 'Sessions/Week', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {segments.map(segment => (
                    <Line
                      key={segment.segment}
                      type="monotone"
                      dataKey={segment.segment}
                      stroke={segmentColors[segment.segment]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————————
// Insights Hub Tab - Sortable Grid
// ————————————————————————————

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type SortColumn = 'priority' | 'date' | 'users' | 'effort' | 'impact'
type SortDirection = 'asc' | 'desc'

const AIRecommendationsGrid = ({ 
  recommendations 
}: { 
  recommendations: AIRecommendation[] 
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('new')
  const [sortColumn, setSortColumn] = useState<SortColumn>('priority')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUp className="h-3 w-3 opacity-30" />
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />
  }

  const sortedRecommendations = useMemo(() => {
    let filtered = recommendations.filter(r => r.status === statusFilter)
    
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortColumn) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'date':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          break
        case 'users':
          comparison = a.affectedUsers - b.affectedUsers
          break
        case 'effort':
          const effortOrder = { low: 0, medium: 1, high: 2 }
          comparison = effortOrder[a.effort] - effortOrder[b.effort]
          break
        case 'impact':
          // Parse the expected lift percentage for comparison
          const getImpactValue = (lift: string) => {
            const match = lift.match(/(\d+)/)
            return match ? parseInt(match[1]) : 0
          }
          comparison = getImpactValue(a.expectedLift) - getImpactValue(b.expectedLift)
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    return filtered
  }, [recommendations, statusFilter, sortColumn, sortDirection])

  const archivedRecommendations = recommendations.filter(r => r.status === 'dismissed')

  const statusCounts = useMemo(() => ({
    new: recommendations.filter(r => r.status === 'new').length,
    'in-progress': recommendations.filter(r => r.status === 'in-progress').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
    dismissed: recommendations.filter(r => r.status === 'dismissed').length,
  }), [recommendations])

  const SortableHeader = ({ column, children }: { column: SortColumn, children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(column)}
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Click column headers to sort. Click rows to expand details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={statusFilter === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('new')}
            >
              New ({statusCounts.new})
            </Button>
            <Button
              variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in-progress')}
            >
              In Progress ({statusCounts['in-progress']})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({statusCounts.completed})
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="priority">Priority</SortableHeader>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Category</TableHead>
                  <SortableHeader column="users">Users Affected</SortableHeader>
                  <SortableHeader column="impact">Expected Lift</SortableHeader>
                  <SortableHeader column="effort">Effort</SortableHeader>
                  <SortableHeader column="date">Date</SortableHeader>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecommendations.map(rec => {
                  const isExpanded = expandedId === rec.id
                  const Icon = getPriorityIcon(rec.priority)
                  
                  return (
                    <React.Fragment key={rec.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      >
                        <TableCell>
                          <Badge variant={getPriorityColor(rec.priority)} className="uppercase text-xs font-semibold">
                            {rec.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-md">
                          <div className="flex items-start gap-2">
                            <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{rec.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rec.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatNumber(rec.affectedUsers)}</TableCell>
                        <TableCell className="font-semibold text-green-600">{rec.expectedLift}</TableCell>
                        <TableCell>
                          <Badge variant={
                            rec.effort === 'low' ? 'default' :
                            rec.effort === 'medium' ? 'secondary' :
                            'outline'
                          }>
                            {rec.effort}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(rec.createdDate)}
                        </TableCell>
                        <TableCell>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50">
                            <div className="p-4 space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 text-foreground">What We Found:</h4>
                                  <p className="text-sm text-foreground">{rec.pattern}</p>
                                </div>
                              
                              </div>
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-sm mb-2 text-foreground">Recommended Action:</h4>
                                <p className="text-sm text-foreground">{rec.recommendation}</p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h4 className="font-semibold text-sm mb-2 text-foreground">Expected Outcome:</h4>
                                <p className="text-sm text-foreground">{rec.expectedOutcome}</p>
                              </div>
                              {rec.relatedSegments.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 text-foreground">Related Segments:</h4>
                                  <div className="flex gap-2 flex-wrap">
                                    {rec.relatedSegments.map(seg => (
                                      <Badge key={seg} variant="secondary">{seg}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {archivedRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowArchived(!showArchived)}>
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                <CardTitle className="text-base">Archived Recommendations</CardTitle>
                <Badge variant="outline">{archivedRecommendations.length}</Badge>
              </div>
              {showArchived ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
          {showArchived && (
            <CardContent className="space-y-2">
              {archivedRecommendations.map(rec => (
                <div key={rec.id} className="p-3 rounded-lg border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-foreground">{rec.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(rec.createdDate)}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

// ————————————————————————————
// Main Component
// ————————————————————————————

export default function ProductUsageDashboard() {
  const usageData = useMemo(() => generateUsageData(52), [])
  const userSegments = useMemo(() => generateUserSegments(), [])
  const featureData = useMemo(() => generateFeatureData(), [])
  const autoDiscoveredSegments = useMemo(() => generateAutoDiscoveredSegments(), [])
  const aiRecommendations = useMemo(() => generateAIRecommendations(), [])
  const featureInsights = useMemo(() => generateFeatureInsights(), [])
  const segmentInsights = useMemo(() => generateSegmentInsights(), [])
  const engagementInsights = useMemo(() => generateEngagementInsights(), [])
  
  const [activeTab, setActiveTab] = useState('overview')
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    segment: 'All Segments',
    planTier: 'All Plans',
    geography: 'All Regions',
    tenureBand: 'All Tenure',
    clvCategory: 'All CLV'
  })

  const handleFilterChange = (key: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearAll = () => {
    setActiveFilters({
      segment: 'All Segments',
      planTier: 'All Plans',
      geography: 'All Regions',
      tenureBand: 'All Tenure',
      clvCategory: 'All CLV'
    })
  }

  // Filter data based on active filters
  const filteredSegments = useMemo(() => {
    if (activeFilters.segment === 'All Segments') return userSegments
    return userSegments.filter(s => s.segment === activeFilters.segment)
  }, [userSegments, activeFilters.segment])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Product Usage</h1>
          <p className="text-muted-foreground">
            AI-powered insights to drive product decisions and user growth
          </p>
        </div>
      </div>

      <GlobalFilterBar 
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights Hub</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <ProductHealthKPIs data={usageData} segments={userSegments} />
            <LatestInsightsPreview recommendations={aiRecommendations} />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <FeatureAdoptionRetentionChart features={featureData} activeFilters={activeFilters} segments={userSegments} />
            <FeatureInsightsCards insights={featureInsights} title="Feature Insights" />
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <SegmentDistributionChart segments={filteredSegments} />
            <AutoDiscoveredSegmentsSection segments={autoDiscoveredSegments} />
            <FeatureInsightsCards insights={segmentInsights} title="Segment Insights" />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <EngagementDepthMatrix segments={filteredSegments} />
            <FeatureInsightsCards insights={engagementInsights} title="Engagement Insights" />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIRecommendationsGrid recommendations={aiRecommendations} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}