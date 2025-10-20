// src/app/dashboard/retention/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Download,
  Filter,
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Mail,
  Phone,
  Gift,
  Target,
  Zap,
  Clock,
  Globe,
  PieChart,
  AlertTriangle,
  Shield,
  Star,
  Crown,
  Gem,
  Calendar
} from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { 
  generateFakeCustomers, 
  generateQuarterlyCohortData,
  generateSegments,
  generateDetailedForecastData,
  generateInterventionStrategies,
  generateEffortLevels,
  generateRiskLevels
} from '@/lib/fakeData'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

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

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// Cohort Analysis Component
const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohortData = useMemo(() => generateQuarterlyCohortData(data), [data])
  const [selectedCohort, setSelectedCohort] = useState(cohortData[0]?.cohort)
  const currentCohort = cohortData.find(c => c.cohort === selectedCohort) || cohortData[0]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
        <CardDescription>
          Customer retention and revenue by acquisition cohort
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              {cohortData.map(cohort => (
                <SelectItem key={cohort.cohort} value={cohort.cohort}>
                  {cohort.cohort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Retention Rate by Period</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentCohort.retention}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={value => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                  <Legend />
                  <Bar dataKey="rate" fill="#8884d8" name="Retention Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Revenue by Cohort</h3>
           <div className="h-80">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart 
      data={cohortData.map(cohort => ({
        cohort: cohort.cohort,
        revenue: cohort.totalRevenue,
        customers: cohort.initialCustomers,
        avgRevenue: cohort.totalRevenue / cohort.initialCustomers
      }))}
      layout="horizontal"
      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        type="category" 
        dataKey="cohort" 
        tick={{ fontSize: 12 }}
      />
      <YAxis 
        type="number" 
        tickFormatter={(value) => formatCurrency(value)}
        tick={{ fontSize: 12 }}
      />
      <Tooltip 
        formatter={(value, name) => {
          if (name === 'revenue') return [formatCurrency(Number(value)), 'Total Revenue']
          if (name === 'avgRevenue') return [formatCurrency(Number(value)), 'Avg Revenue per Customer']
          return [value, name]
        }}
      />
      <Legend />
      <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" />
    </BarChart>
  </ResponsiveContainer>
</div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Retention Matrix</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Customers</TableHead>
                {currentCohort.retention.map((r, i) => (
                  <TableHead key={i}>Period {i + 1}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohortData.map(cohort => (
                <TableRow key={cohort.cohort} className={cohort.cohort === selectedCohort ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{cohort.cohort}</TableCell>
                  <TableCell>{cohort.initialCustomers}</TableCell>
                  {cohort.retention.map((r, i) => (
                    <TableCell key={i}>
                      <div className="flex flex-col">
                        <span>{r.rate}%</span>
                        <Progress value={r.rate} className="h-1 mt-1" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SegmentsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('value-based')
  const [selectedSegment, setSelectedSegment] = useState('platinum')
  const [selectedSubSegment, setSelectedSubSegment] = useState('platinum-high-risk')

  // All data now comes from fakeData.ts
  const segmentsData = generateSegments()
  const forecastData = generateDetailedForecastData().segmentProjections
  const interventionStrategies = generateInterventionStrategies()
  const effortLevels = generateEffortLevels()
  const riskLevels = generateRiskLevels()

  const categoryData = segmentsData[selectedCategory as keyof typeof segmentsData]
  const segmentData = categoryData.segments.find(s => s.id === selectedSegment)
  const subSegmentData = segmentData?.subSegments.find(s => s.id === selectedSubSegment)
  const intervention = subSegmentData ? interventionStrategies[subSegmentData.intervention as keyof typeof interventionStrategies] : null

  // Calculate total investment and ROI
  const investmentData = useMemo(() => {
    return categoryData.segments.flatMap(segment =>
      segment.subSegments.map(sub => ({
        segment: segment.name,
        subSegment: sub.name,
        customers: sub.customers,
        cost: sub.customers * interventionStrategies[sub.intervention as keyof typeof interventionStrategies].costPerCustomer,
        revenueAtRisk: sub.customers * sub.avgMrr,
        expectedSavings: sub.customers * sub.avgMrr * (interventionStrategies[sub.intervention as keyof typeof interventionStrategies].expectedSuccess / 100),
        roi: ((sub.customers * sub.avgMrr * (interventionStrategies[sub.intervention as keyof typeof interventionStrategies].expectedSuccess / 100)) - 
              (sub.customers * interventionStrategies[sub.intervention as keyof typeof interventionStrategies].costPerCustomer)) / 
              (sub.customers * interventionStrategies[sub.intervention as keyof typeof interventionStrategies].costPerCustomer)
      }))
    )
  }, [categoryData, interventionStrategies])

  const totalInvestment = investmentData.reduce((sum, item) => sum + item.cost, 0)
  const totalExpectedSavings = investmentData.reduce((sum, item) => sum + item.expectedSavings, 0)
  const overallROI = (totalExpectedSavings - totalInvestment) / totalInvestment

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Strategic Retention</h1>
          <p className="text-muted-foreground">Retention recommendations based on churn risk</p>
        </div>

        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value)
            setSelectedSegment(segmentsData[value as keyof typeof segmentsData].segments[0].id)
            setSelectedSubSegment(segmentsData[value as keyof typeof segmentsData].segments[0].subSegments[0].id)
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-based">Value-based</SelectItem>
              <SelectItem value="usage-based">Usage-based</SelectItem>
              <SelectItem value="tenure-based">Tenure-based</SelectItem>
              <SelectItem value="geography-based">Geography-based</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex overflow-x-auto md:grid md:grid-cols-6 w-full">  
          <TabsTrigger value="overview">Retention Strategy</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="investment">Investment Analysis</TabsTrigger>
          <TabsTrigger value="intervention">Intervention Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Segment Growth Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Growth Projections</CardTitle>
              <CardDescription>Expected growth and risk by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="segment" stroke="#6b7280" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} domain={[-20, 30]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="current" fill="#3b82f6" name="Current Customers" />
                    <Bar yAxisId="left" dataKey="projected" fill="#10b981" name="Projected Customers" />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} name="Growth %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Projected</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Action Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastData.map((segment) => (
                    <TableRow key={segment.segment}>
                      <TableCell className="font-medium">{segment.segment}</TableCell>
                      <TableCell>{segment.current}</TableCell>
                      <TableCell>{segment.projected}</TableCell>
                      <TableCell>
                        <Badge variant={segment.growth >= 0 ? "default" : "destructive"}>
                          {segment.growth >= 0 ? '+' : ''}{segment.growth}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          segment.risk === 'Low' ? 'default' :
                          segment.risk === 'Medium' ? 'secondary' :
                          segment.risk === 'High' ? 'destructive' :
                          'outline'
                        }>
                          {segment.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {segment.risk === 'Critical' ? 'Immediate action' :
                         segment.risk === 'High' ? 'Strategic planning' :
                         segment.risk === 'Medium' ? 'Monitor closely' : 'Maintain'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{categoryData.name}</CardTitle>
              <CardDescription>{categoryData.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* Segment Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.segments.map(segment => (
              <Card key={segment.id} className={`cursor-pointer ${
                segment.id === selectedSegment ? 'ring-2 ring-blue-500' : ''
              }`} onClick={() => {
                setSelectedSegment(segment.id)
                setSelectedSubSegment(segment.subSegments[0].id)
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{segment.name}</h3>
                    <Badge variant="secondary">{segment.totalCustomers} customers</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avg MRR:</span>
                      <span className="font-medium">${segment.avgMrr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention:</span>
                      <span className="font-medium">{segment.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sub-segment Analysis */}
          {segmentData && (
            <Card>
              <CardHeader>
                <CardTitle>{segmentData.name} - Risk-based Sub-segments</CardTitle>
                <CardDescription>Stratified retention effort allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {segmentData.subSegments.map(subSegment => {
                    const riskConfig = riskLevels[subSegment.riskLevel]
                    const effortConfig = effortLevels[subSegment.recommendedEffort]
                    const RiskIcon = riskConfig.icon
                    const EffortIcon = effortConfig.icon
                    
                    return (
                      <Card key={subSegment.id} className={`cursor-pointer ${
                        subSegment.id === selectedSubSegment ? 'ring-2 ring-blue-500' : ''
                      }`} onClick={() => setSelectedSubSegment(subSegment.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm">{subSegment.name}</h4>
                            <Badge className={riskConfig.color}>
                              <RiskIcon className="h-3 w-3 mr-1" />
                              {riskConfig.label}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Customers:</span>
                              <span className="font-medium">{subSegment.customers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Churn Risk:</span>
                              <span className="font-medium">{subSegment.churnRisk}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Predicted Churn:</span>
                              <span className="font-medium">{subSegment.predictedChurn}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span>Effort Level:</span>
                              <Badge className={effortConfig.color}>
                                <EffortIcon className="h-3 w-3 mr-1" />
                                {effortConfig.label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intervention Details */}
          {subSegmentData && intervention && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Intervention Strategy</CardTitle>
                <CardDescription>For {subSegmentData.name} sub-segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-lg">{intervention.name}</h4>
                      <p className="text-blue-700">{intervention.action}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Channel:</span>
                        <p>{intervention.channel}</p>
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <p>{intervention.frequency}</p>
                      </div>
                      <div>
                        <span className="font-medium">Team:</span>
                        <p>{intervention.team}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cost per Customer:</span>
                        <p>${intervention.costPerCustomer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Expected Outcomes</h4>
                      <div className="space-y-2 text-sm">
                        <p>• Success Rate: {intervention.expectedSuccess}%</p>
                        <p>• Customers Targeted: {subSegmentData.customers}</p>
                        <p>• Total Investment: ${subSegmentData.customers * intervention.costPerCustomer}</p>
                        <p>• Expected Revenue Saved: ${Math.round(subSegmentData.customers * subSegmentData.avgMrr * (intervention.expectedSuccess / 100))}</p>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Deploy Intervention Strategy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cohort" className="space-y-6">
          <CohortAnalysis data={generateFakeCustomers(1000)} />
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retention Investment Analysis</CardTitle>
              <CardDescription>ROI-focused investment across all sub-segments</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">${totalInvestment.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Investment</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">${totalExpectedSavings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Expected Savings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{overallROI.toFixed(1)}x</div>
                    <div className="text-sm text-gray-600">Overall ROI</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {investmentData.reduce((sum, item) => sum + item.customers, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Targeted Customers</div>
                  </CardContent>
                </Card>
              </div>

              {/* Investment Breakdown */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-segment</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Effort Level</TableHead>
                    <TableHead>Expected ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investmentData.map((item) => {
                    const subSegment = categoryData.segments
                      .flatMap(s => s.subSegments)
                      .find(s => s.name === item.subSegment)
                    
                    return (
                      <TableRow key={item.subSegment}>
                        <TableCell className="font-medium">{item.subSegment}</TableCell>
                        <TableCell>{item.customers}</TableCell>
                        <TableCell>${item.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={riskLevels[subSegment?.riskLevel || 'medium'].color}>
                            {subSegment?.riskLevel.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={effortLevels[subSegment?.recommendedEffort || 'moderate'].color}>
                            {subSegment?.recommendedEffort.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.roi > 3 ? "default" : item.roi > 1 ? "secondary" : "destructive"}>
                            {item.roi.toFixed(1)}x
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intervention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retention Intervention Plan</CardTitle>
              <CardDescription>Detailed action plan for retention campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {subSegmentData && intervention && (
                <div className="space-y-6">
                  {/* Campaign Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Campaign Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Segment:</span>
                          <span className="font-medium">{subSegmentData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customers:</span>
                          <span className="font-medium">{subSegmentData.customers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Intervention:</span>
                          <span className="font-medium">{intervention.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Budget:</span>
                          <span className="font-medium">${subSegmentData.customers * intervention.costPerCustomer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold mb-3">Intervention Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">2-4 weeks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{intervention.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team:</span>
                          <span className="font-medium">{intervention.team}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="font-semibold mb-3">Action Steps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <span>Prepare personalized content and messaging for {subSegmentData.customers} customers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <span>Set up automation in marketing platform for {intervention.channel}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <span>Train {intervention.team} on intervention protocol and customer handling</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold">4</span>
                        </div>
                        <span>Launch campaign and monitor initial engagement metrics</span>
                      </div>
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div>
                    <h4 className="font-semibold mb-3">Success Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-800">Primary Goal</div>
                        <div>Reduce churn by {intervention.expectedSuccess}%</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-800">Secondary Goal</div>
                        <div>Improve engagement by 25%</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-800">ROI Target</div>
                        <div>3.5x minimum return</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-800">Timeframe</div>
                        <div>30-day measurement period</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Intervention Plan
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Schedule Campaign
                    </Button>
                    <Button variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Create A/B Test
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}