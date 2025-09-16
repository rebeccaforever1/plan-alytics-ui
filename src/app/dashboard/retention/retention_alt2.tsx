'use client'

import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Users, DollarSign, TrendingUp, TrendingDown, Mail, Target, AlertTriangle, Shield, Star, Clock, Settings } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { generateFakeCustomers, generateCohortData } from '@/lib/fakeData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface SubSegment {
  id: string
  name: string
  riskLevel: 'high' | 'medium' | 'low'
  customers: number
  churnRisk: number
  predictedChurn: number
  avgMrr: number
  recommendedEffort: 'intensive' | 'moderate' | 'light' | 'minimal'
  intervention: string
  effortCost: 'high' | 'medium' | 'low' | 'very-low'
  expectedImpact: string
}

interface Segment {
  id: string
  name: string
  totalCustomers: number
  avgMrr: number
  avgClv: number
  retentionRate: number
  subSegments: SubSegment[]
}

const generateForecastData = () => {
  return {
    segmentProjections: [
      { segment: 'Platinum', current: 180, projected: 195, growth: 8.3, risk: 'Low' },
      { segment: 'Gold', current: 420, projected: 445, growth: 5.9, risk: 'Medium' },
      { segment: 'Silver', current: 550, projected: 485, growth: -11.8, risk: 'High' },
      { segment: 'Power Users', current: 320, projected: 340, growth: 6.3, risk: 'Low' },
      { segment: 'Loyalists', current: 420, projected: 435, growth: 3.6, risk: 'Low' },
      { segment: 'Established', current: 580, projected: 520, growth: -10.3, risk: 'Critical' }
    ]
  }
}

const generateSegments = () => {
  return {
    'value-based': {
      name: 'Value-based Segments',
      description: 'Segmented by customer lifetime value and revenue contribution',
      segments: [
        {
          id: 'platinum',
          name: 'Platinum Tier',
          totalCustomers: 180,
          avgMrr: 587,
          avgClv: 9250,
          retentionRate: 96,
          subSegments: [
            {
              id: 'platinum-high-risk',
              name: 'High Risk Platinum',
              riskLevel: 'high' as const,
              customers: 15,
              churnRisk: 68,
              predictedChurn: 10,
              avgMrr: 625,
              recommendedEffort: 'intensive' as const,
              intervention: 'executive_outreach',
              effortCost: 'high' as const,
              expectedImpact: '85% retention boost'
            },
            {
              id: 'platinum-medium-risk',
              name: 'Medium Risk Platinum',
              riskLevel: 'medium' as const,
              customers: 45,
              churnRisk: 32,
              predictedChurn: 14,
              avgMrr: 595,
              recommendedEffort: 'moderate' as const,
              intervention: 'priority_support',
              effortCost: 'medium' as const,
              expectedImpact: '70% retention boost'
            },
            {
              id: 'platinum-low-risk',
              name: 'Low Risk Platinum',
              riskLevel: 'low' as const,
              customers: 120,
              churnRisk: 8,
              predictedChurn: 10,
              avgMrr: 575,
              recommendedEffort: 'light' as const,
              intervention: 'proactive_checkin',
              effortCost: 'low' as const,
              expectedImpact: '95% retention rate'
            }
          ]
        },
        {
          id: 'gold',
          name: 'Gold Tier',
          totalCustomers: 420,
          avgMrr: 287,
          avgClv: 4850,
          retentionRate: 88,
          subSegments: [
            {
              id: 'gold-high-risk',
              name: 'High Risk Gold',
              riskLevel: 'high' as const,
              customers: 63,
              churnRisk: 72,
              predictedChurn: 45,
              avgMrr: 265,
              recommendedEffort: 'moderate' as const,
              intervention: 'personalized_offer',
              effortCost: 'medium' as const,
              expectedImpact: '65% retention boost'
            },
            {
              id: 'gold-medium-risk',
              name: 'Medium Risk Gold',
              riskLevel: 'medium' as const,
              customers: 168,
              churnRisk: 38,
              predictedChurn: 64,
              avgMrr: 290,
              recommendedEffort: 'light' as const,
              intervention: 'targeted_email',
              effortCost: 'low' as const,
              expectedImpact: '55% retention boost'
            },
            {
              id: 'gold-low-risk',
              name: 'Low Risk Gold',
              riskLevel: 'low' as const,
              customers: 189,
              churnRisk: 12,
              predictedChurn: 23,
              avgMrr: 295,
              recommendedEffort: 'minimal' as const,
              intervention: 'newsletter',
              effortCost: 'very-low' as const,
              expectedImpact: '90% retention rate'
            }
          ]
        }
      ]
    }
  }
}

const interventionStrategies = {
  executive_outreach: {
    name: 'Executive Outreach',
    action: 'C-level executive personal contact',
    channel: 'Phone + Personal Meeting',
    frequency: 'Weekly',
    team: 'Executive Team',
    costPerCustomer: 250,
    expectedSuccess: 85
  },
  priority_support: {
    name: 'Priority Support',
    action: 'Dedicated account manager',
    channel: 'Email + Scheduled Calls',
    frequency: 'Bi-weekly',
    team: 'Customer Success',
    costPerCustomer: 120,
    expectedSuccess: 78
  },
  proactive_checkin: {
    name: 'Proactive Check-in',
    action: 'Regular success check-ins',
    channel: 'Email + In-app',
    frequency: 'Monthly',
    team: 'Automated + CS',
    costPerCustomer: 35,
    expectedSuccess: 92
  },
  personalized_offer: {
    name: 'Personalized Offer',
    action: 'Custom discount or feature bundle',
    channel: 'Email + Personal Call',
    frequency: 'One-time',
    team: 'Sales + Marketing',
    costPerCustomer: 85,
    expectedSuccess: 72
  },
  targeted_email: {
    name: 'Targeted Email',
    action: 'Personalized email campaign',
    channel: 'Email',
    frequency: 'Weekly for 4 weeks',
    team: 'Marketing Automation',
    costPerCustomer: 15,
    expectedSuccess: 65
  },
  newsletter: {
    name: 'Newsletter',
    action: 'Regular educational content',
    channel: 'Email',
    frequency: 'Monthly',
    team: 'Marketing',
    costPerCustomer: 5,
    expectedSuccess: 55
  }
}

const effortLevels = {
  intensive: { label: 'Intensive Effort', color: 'bg-red-100 text-red-800', icon: Shield },
  moderate: { label: 'Moderate Effort', color: 'bg-orange-100 text-orange-800', icon: Target },
  light: { label: 'Light Effort', color: 'bg-yellow-100 text-yellow-800', icon: Star },
  minimal: { label: 'Minimal Effort', color: 'bg-green-100 text-green-800', icon: Clock }
}

const riskLevels = {
  high: { label: 'High Risk', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  medium: { label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800', icon: Shield },
  low: { label: 'Low Risk', color: 'bg-green-100 text-green-800', icon: Check }
}

const CohortAnalysis = ({ data }: { data: any[] }) => {
  const [cohortType, setCohortType] = useState<'time' | 'value' | 'behavior'>('time')
  const cohortData = useMemo(() => generateCohortData(data, cohortType), [data, cohortType])
  const [selectedCohort, setSelectedCohort] = useState(cohortData[0]?.cohort)
  const currentCohort = cohortData.find(c => c.cohort === selectedCohort) || cohortData[0]
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Cohort Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Analyze customer retention patterns across different cohort types
          </p>
        </div>
        <Select value={cohortType} onValueChange={(value: 'time' | 'value' | 'behavior') => setCohortType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Cohort Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Time-based Cohorts</SelectItem>
            <SelectItem value="value">Value-based Cohorts</SelectItem>
            <SelectItem value="behavior">Behavior-based Cohorts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Cohort Selection</CardTitle>
            <CardDescription>
              {cohortType === 'time' && 'Cohorts based on acquisition date'}
              {cohortType === 'value' && 'Cohorts based on customer lifetime value'}
              {cohortType === 'behavior' && 'Cohorts based on initial user behavior'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger>
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
              <div className="text-sm text-muted-foreground">
                <p><strong>Initial Customers:</strong> {currentCohort.initialCustomers}</p>
                <p><strong>Total Revenue:</strong> {formatCurrency(currentCohort.totalRevenue)}</p>
                <p><strong>Avg. Retention:</strong> {(
                  currentCohort.retention.reduce((sum: number, r: any) => sum + r.rate, 0) / 
                  currentCohort.retention.length
                ).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Retention Curve</CardTitle>
            <CardDescription>How cohorts retain customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentCohort.retention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 100]} tickFormatter={value => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                  <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retention Matrix</CardTitle>
          <CardDescription>Compare retention across all cohorts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Customers</TableHead>
                  {currentCohort.retention.map((r: any, i: number) => (
                    <TableHead key={i} className="text-center">Period {i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortData.map(cohort => (
                  <TableRow key={cohort.cohort} className={cohort.cohort === selectedCohort ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">{cohort.cohort}</TableCell>
                    <TableCell>{cohort.initialCustomers}</TableCell>
                    {cohort.retention.map((r: any, i: number) => (
                      <TableCell key={i} className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{r.rate}%</span>
                          <Progress value={r.rate} className="h-1 w-16 mt-1" />
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
    </div>
  )
}

const KPISummary = () => {
  const kpis = [
    { title: 'Overall Retention', value: '87.3%', change: '+2.4%', positive: true, icon: TrendingUp },
    { title: 'Customer Churn', value: '12.7%', change: '-1.2%', positive: true, icon: TrendingDown },
    { title: 'Avg. CLV', value: formatCurrency(4850), change: '+5.8%', positive: true, icon: DollarSign },
    { title: 'Active Customers', value: '12,458', change: '+3.1%', positive: true, icon: Users },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.positive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                  {kpi.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function RetentionDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('value-based')
  const [selectedSegment, setSelectedSegment] = useState('platinum')
  const [selectedSubSegment, setSelectedSubSegment] = useState('platinum-high-risk')

  const segmentsData = generateSegments()
  const forecastData = generateForecastData()
  const categoryData = segmentsData[selectedCategory as keyof typeof segmentsData]
  const segmentData = categoryData.segments.find((s: Segment) => s.id === selectedSegment)
  const subSegmentData = segmentData?.subSegments.find((s: SubSegment) => s.id === selectedSubSegment)
  const intervention = subSegmentData ? interventionStrategies[subSegmentData.intervention as keyof typeof interventionStrategies] : null

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Strategic Retention Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive customer retention strategy and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <KPISummary />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="investment">Investment Analysis</TabsTrigger>
          <TabsTrigger value="intervention">Intervention Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Growth Projections</CardTitle>
              <CardDescription>Expected growth and risk by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData.segmentProjections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="segment" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Customers" />
                    <Bar dataKey="projected" fill="#10b981" name="Projected Customers" />
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
                  {forecastData.segmentProjections.map((segment) => (
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

          <div className="grid gap-4 md:grid-cols-3">
            {categoryData.segments.map((segment: Segment) => (
              <Card 
                key={segment.id} 
                className={`cursor-pointer transition-all ${segment.id === selectedSegment ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => {
                  setSelectedSegment(segment.id)
                  setSelectedSubSegment(segment.subSegments[0].id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{segment.name}</h3>
                    <Badge variant="secondary">{segment.totalCustomers}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg MRR:</span>
                      <span className="font-medium">{formatCurrency(segment.avgMrr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retention:</span>
                      <span className="font-medium">{segment.retentionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg CLV:</span>
                      <span className="font-medium">{formatCurrency(segment.avgClv)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {segmentData && (
            <Card>
              <CardHeader>
                <CardTitle>{segmentData.name} - Risk Sub-segments</CardTitle>
                <CardDescription>Stratified retention effort allocation based on risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {segmentData.subSegments.map((subSegment: SubSegment) => {
                    const riskConfig = riskLevels[subSegment.riskLevel]
                    const effortConfig = effortLevels[subSegment.recommendedEffort]
                    const RiskIcon = riskConfig.icon
                    const EffortIcon = effortConfig.icon
                    
                    return (
                      <Card 
                        key={subSegment.id} 
                        className={`cursor-pointer transition-all ${subSegment.id === selectedSubSegment ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                        onClick={() => setSelectedSubSegment(subSegment.id)}
                      >
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
                              <span className="text-muted-foreground">Customers:</span>
                              <span className="font-medium">{subSegment.customers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Churn Risk:</span>
                              <span className="font-medium">{subSegment.churnRisk}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Predicted Churn:</span>
                              <span className="font-medium">{subSegment.predictedChurn}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-muted-foreground">Effort Level:</span>
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
          <CohortAnalysis data={generateFakeCustomers()} />
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis</CardTitle>
              <CardDescription>Coming soon - detailed ROI analysis</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="intervention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Plan</CardTitle>
              <CardDescription>Coming soon - detailed intervention planning</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}