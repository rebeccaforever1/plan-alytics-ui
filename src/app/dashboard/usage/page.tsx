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
  PieChart,
  Pie,
  Cell,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

import { generateUsageData, generateUserSegments } from '@/lib/fakeData'
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
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  Crown,
  Zap,
  Activity,
  Sparkles,
  Clock,
  TargetIcon,
  Gem,
  Star,
  Flame,
} from 'lucide-react'

// ————————————————————————
// Utility functions
// ————————————————————————

const exportCSV = (data: any[], filename: string) => {
  const csvHeader = Object.keys(data[0]).join(',') + '\n'
  const csvRows = data.map(row =>
    Object.values(row).map(val => `"${val}"`).join(',')
  )
  const csvString = csvHeader + csvRows.join('\n')

  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

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

const calculateMean = (values: number[]) =>
  values.reduce((acc, val) => acc + val, 0) / values.length

const calculateTrend = (values: number[]) => {
  if (values.length < 2) return 0
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  return ((lastValue - firstValue) / firstValue) * 100
}

const formatTimeLabel = (index: number, timeframe: string) => {
  if (timeframe === 'daily') return `Day ${index + 1}`
  if (timeframe === 'monthly') return `Month ${index + 1}`
  return `Week ${index + 1}`
}

// ————————————————————————
// Components
// ————————————————————————

const UsageKPIOverview = ({ data, segments }: { data: any[]; segments: any }) => {
  const kpis = useMemo(() => {
    const currentPeriod = data[data.length - 1] || {}
    const previousPeriod = data[data.length - 2] || {}
    
    const loyalists = segments.find((s: any) => s.segment === 'Loyalists') || {}
    const casuals = segments.find((s: any) => s.segment === 'Casual Users') || {}
    const atRisk = segments.find((s: any) => s.segment === 'At Risk') || {}
    
    return {
      activeUsers: currentPeriod.activeUsers || 0,
      activeUsersChange: ((currentPeriod.activeUsers - previousPeriod.activeUsers) / previousPeriod.activeUsers) * 100 || 0,
      
      avgSessionDuration: currentPeriod.avgSessionDuration || 0,
      avgSessionDurationChange: ((currentPeriod.avgSessionDuration - previousPeriod.avgSessionDuration) / previousPeriod.avgSessionDuration) * 100 || 0,
      
      featureAdoption: currentPeriod.featureAdoption || 0,
      featureAdoptionChange: ((currentPeriod.featureAdoption - previousPeriod.featureAdoption) / previousPeriod.featureAdoption) * 100 || 0,
      
      loyalistRevenue: loyalists.revenue || 0,
      loyalistRevenueShare: loyalists.revenueShare || 0,
      
      activationRate: currentPeriod.activationRate || 0,
      activationRateChange: ((currentPeriod.activationRate - previousPeriod.activationRate) / previousPeriod.activationRate) * 100 || 0,
    }
  }, [data, segments])

  const KpiCard = ({ title, value, change, icon: Icon, format = 'number', subtitle }: { 
    title: string; 
    value: number; 
    change: number; 
    icon: any;
    format?: 'number' | 'currency' | 'percent';
    subtitle?: string;
  }) => {
    const isPositive = change >= 0
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percent' ? formatPercentage(value) : 
                          formatNumber(value)
    
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change).toFixed(1)}% from previous period
          </div>
        </CardContent>
        {isPositive ? (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
        )}
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <KpiCard 
        title="Active Users" 
        value={kpis.activeUsers} 
        change={kpis.activeUsersChange} 
        icon={Users}
        subtitle="Daily active users"
      />
      <KpiCard 
        title="Avg Session Duration" 
        value={kpis.avgSessionDuration} 
        change={kpis.avgSessionDurationChange} 
        icon={Clock}
        subtitle="Minutes per session"
      />
      <KpiCard 
        title="Feature Adoption" 
        value={kpis.featureAdoption} 
        change={kpis.featureAdoptionChange} 
        icon={Zap}
        format="percent"
        subtitle="Core features used"
      />
      <KpiCard 
        title="Loyalist Revenue" 
        value={kpis.loyalistRevenue} 
        change={0} 
        icon={Crown}
        format="currency"
        subtitle="From top users"
      />
      <KpiCard 
        title="Loyalist Share" 
        value={kpis.loyalistRevenueShare} 
        change={0} 
        icon={TargetIcon}
        format="percent"
        subtitle="% of total revenue"
      />
      <KpiCard 
        title="Activation Rate" 
        value={kpis.activationRate} 
        change={kpis.activationRateChange} 
        icon={Sparkles}
        format="percent"
        subtitle="Successful onboarding"
      />
    </div>
  )
}

const UsageTrendChart = ({ data, timeframe }: { data: any[]; timeframe: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Trends</CardTitle>
        <CardDescription>
          How customers are engaging with your product over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalWeek" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="activeUsers" fill="#8884d8" name="Active Users" />
              <Line yAxisId="right" type="monotone" dataKey="avgSessionDuration" stroke="#00C49F" strokeWidth={2} name="Avg Session (min)" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="featureAdoption" stroke="#FF8042" strokeWidth={2} name="Feature Adoption (%)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const UserSegmentation = ({ segments }: { segments: any[] }) => {
  const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Segmentation</CardTitle>
        <CardDescription>
          How different user groups engage with your product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                    label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => {
                    const segment = segments.find(s => s.segment === props.payload.segment);
                    return [`${value} users (${formatPercentage(segment.revenueShare)})`, name];
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenueShare"
                    label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatPercentage(Number(value)), 'Revenue Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {segments.map((segment, index) => (
            <Card key={segment.segment} className={`text-center ${index === 0 ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  {segment.segment}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(segment.users)}</div>
                <p className="text-xs text-muted-foreground">users</p>
                <div className="mt-2 text-sm font-semibold">{formatCurrency(segment.arpu)}</div>
                <p className="text-xs text-muted-foreground">avg revenue</p>
                <Badge variant="outline" className="mt-2">
                  {formatPercentage(segment.revenueShare)} revenue
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const ParetoAnalysis = ({ segments }: { segments: any[] }) => {
  const paretoData = useMemo(() => {
    // Sort segments by revenue contribution
    const sorted = [...segments].sort((a, b) => b.revenue - a.revenue);
    
    // Calculate cumulative percentages
    let cumulativeRevenue = 0;
    let cumulativeUsers = 0;
    const totalRevenue = sorted.reduce((sum, s) => sum + s.revenue, 0);
    const totalUsers = sorted.reduce((sum, s) => sum + s.users, 0);
    
    return sorted.map((segment, index) => {
      cumulativeRevenue += segment.revenue;
      cumulativeUsers += segment.users;
      
      return {
        segment: segment.segment,
        revenue: segment.revenue,
        revenueShare: segment.revenue / totalRevenue,
        cumulativeRevenueShare: cumulativeRevenue / totalRevenue,
        users: segment.users,
        usersShare: segment.users / totalUsers,
        cumulativeUsersShare: cumulativeUsers / totalUsers,
      };
    });
  }, [segments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Analysis</CardTitle>
        <CardDescription>
          The 80/20 rule: How a minority of users generate most of the value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tickFormatter={value => `${(value * 100).toFixed(0)}%`} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(Number(value)), 'Revenue'];
                  if (name === 'cumulativeRevenueShare' || name === 'cumulativeUsersShare') 
                    return [`${(Number(value) * 100).toFixed(1)}%`, name === 'cumulativeRevenueShare' ? 'Cumulative Revenue %' : 'Cumulative Users %'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="cumulativeRevenueShare" stroke="#00C49F" strokeWidth={2} name="Cumulative Revenue %" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="cumulativeUsersShare" stroke="#FF8042" strokeWidth={2} name="Cumulative Users %" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 flex items-center mb-2">
            <TargetIcon className="h-4 w-4 mr-2" />
            Pareto Principle Insight
          </h4>
          <p className="text-sm text-amber-700">
            The top {Math.round(paretoData[0].usersShare * 100)}% of users ({paretoData[0].segment}) generate {Math.round(paretoData[0].revenueShare * 100)}% of total revenue.
            This demonstrates a strong Pareto effect where a minority of users contribute disproportionately to revenue.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const FeatureAdoptionAnalysis = ({ data }: { data: any[] }) => {
  const featureData = useMemo(() => {
    const features = ['Dashboard', 'Reports', 'Analytics', 'Integrations', 'Automation'];
    return features.map(feature => ({
      name: feature,
      adoption: Math.floor(20 + Math.random() * 60),
      satisfaction: Math.floor(70 + Math.random() * 25),
      value: Math.floor(100 + Math.random() * 400),
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Adoption Analysis</CardTitle>
        <CardDescription>
          Which features drive the most engagement and value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={value => `${value}%`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'adoption' || name === 'satisfaction') return [`${value}%`, name];
                  return [formatCurrency(Number(value)), 'Estimated Value'];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="adoption" fill="#8884d8" name="Adoption Rate (%)" />
              <Bar yAxisId="left" dataKey="satisfaction" fill="#00C49F" name="Satisfaction (%)" />
              <Bar yAxisId="right" dataKey="value" fill="#FF8042" name="Value per User" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const UserEngagementMatrix = ({ segments }: { segments: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement Matrix</CardTitle>
        <CardDescription>
          Frequency vs. depth of usage across user segments
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
                name="Usage Frequency" 
                label={{ value: 'Sessions per Week', position: 'insideBottom', offset: -5 }} 
                domain={[0, 20]}
              />
              <YAxis 
                type="number" 
                dataKey="depth" 
                name="Usage Depth" 
                label={{ value: 'Features Used', angle: -90, position: 'insideLeft' }} 
                domain={[0, 10]}
              />
              <ZAxis 
                type="number" 
                dataKey="value" 
                range={[100, 500]} 
                name="User Value" 
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'value') return [formatCurrency(Number(value)), 'Lifetime Value'];
                  return [Number(value).toFixed(1), name === 'frequency' ? 'Sessions/Week' : 'Features Used'];
                }} 
                cursor={{ strokeDasharray: '3 3' }} 
              />
              <Legend />
              <Scatter 
                name="Loyalists" 
                data={segments[0].engagement} 
                fill="#00C49F" 
              />
              <Scatter 
                name="Power Users" 
                data={segments[1].engagement} 
                fill="#0088FE" 
              />
              <Scatter 
                name="Casual Users" 
                data={segments[2].engagement} 
                fill="#FFBB28" 
              />
              <Scatter 
                name="At Risk" 
                data={segments[3].engagement} 
                fill="#FF8042" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <Crown className="h-6 w-6 mx-auto text-green-600 mb-1" />
            <p className="font-semibold text-green-800">Loyalists</p>
            <p className="text-xs text-green-600">High frequency, high depth</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Zap className="h-6 w-6 mx-auto text-blue-600 mb-1" />
            <p className="font-semibold text-blue-800">Power Users</p>
            <p className="text-xs text-blue-600">High depth, moderate frequency</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Activity className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
            <p className="font-semibold text-yellow-800">Casual Users</p>
            <p className="text-xs text-yellow-600">Moderate frequency, low depth</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <Flame className="h-6 w-6 mx-auto text-red-600 mb-1" />
            <p className="font-semibold text-red-800">At Risk</p>
            <p className="text-xs text-red-600">Low frequency, low depth</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// Main Usage Dashboard Page
// ————————————————————————

export default function UsagePage() {
  const usageData = useMemo(() => generateUsageData(52), [])
  const userSegments = useMemo(() => generateUserSegments(), [])
  const [timeframe, setTimeframe] = useState('weekly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const filteredData = useMemo(() => {
    return usageData.slice(0, timeframe === 'daily' ? 90 : timeframe === 'monthly' ? 12 : 52)
  }, [usageData, timeframe])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Usage Analytics</h1>
          <p className="text-muted-foreground">
            Understand how customers engage with your product and identify key user segments
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-32"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              placeholder="End date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-32"
            />
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportCSV(filteredData, 'usage_analysis.csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <UsageKPIOverview data={filteredData} segments={userSegments} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segmentation">User Segmentation</TabsTrigger>
          <TabsTrigger value="pareto">Pareto Analysis</TabsTrigger>
          <TabsTrigger value="features">Feature Adoption</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <UsageTrendChart data={filteredData} timeframe={timeframe} />
          <UserSegmentation segments={userSegments} />
        </TabsContent>

        <TabsContent value="segmentation">
          <UserSegmentation segments={userSegments} />
        </TabsContent>

        <TabsContent value="pareto">
          <ParetoAnalysis segments={userSegments} />
        </TabsContent>

        <TabsContent value="features">
          <FeatureAdoptionAnalysis data={filteredData} />
        </TabsContent>

        <TabsContent value="engagement">
          <UserEngagementMatrix segments={userSegments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}