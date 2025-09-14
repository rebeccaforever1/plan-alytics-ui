// src/app/dashboard/segments/page.tsx
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
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Sliders,
  AlertTriangle,
  Phone,
  Gift,
  Target,
  BarChart3,
  Zap,
  Clock,
  Globe,
  ArrowUpDown
} from 'lucide-react'

// Enhanced mock data that collectively exhausts the population
const generateSegments = () => {
  const totalCustomers = 1500;
  
  return [
    {
      id: 'platinum',
      name: 'Platinum Tier',
      category: 'value-based',
      criteria: 'clv > 5000 AND mrr > 400',
      customerCount: 180,
      avgMrr: 587,
      avgClv: 9250,
      retentionRate: 96,
      growth: 15.2,
      churnRisk: 4,
      predictedChurn: 7,
      intervention: 'priority_support',
      segmentValue: 105660,
      trend: 'up',
      characteristics: {
        plan: { Enterprise: 92, Pro: 8, Basic: 0 },
        tenure: { '>2y': 75, '1-2y': 20, '<1y': 5 },
        usage: { high: 95, medium: 4, low: 1 }
      }
    },
    {
      id: 'gold',
      name: 'Gold Tier',
      category: 'value-based',
      criteria: 'clv > 2500 AND mrr > 150',
      customerCount: 420,
      avgMrr: 287,
      avgClv: 4850,
      retentionRate: 88,
      growth: 9.8,
      churnRisk: 15,
      predictedChurn: 63,
      intervention: 'account_review',
      segmentValue: 120540,
      trend: 'up',
      characteristics: {
        plan: { Enterprise: 45, Pro: 50, Basic: 5 },
        tenure: { '>2y': 50, '1-2y': 35, '<1y': 15 },
        usage: { high: 80, medium: 15, low: 5 }
      }
    },
    {
      id: 'silver',
      name: 'Silver Tier',
      category: 'value-based',
      criteria: 'clv > 1000 AND mrr > 50',
      customerCount: 550,
      avgMrr: 98,
      avgClv: 1850,
      retentionRate: 72,
      growth: 3.5,
      churnRisk: 32,
      predictedChurn: 176,
      intervention: 'targeted_offer',
      segmentValue: 53900,
      trend: 'neutral',
      characteristics: {
        plan: { Enterprise: 15, Pro: 60, Basic: 25 },
        tenure: { '>2y': 25, '1-2y': 45, '<1y': 30 },
        usage: { high: 50, medium: 35, low: 15 }
      }
    },
    {
      id: 'bronze',
      name: 'Bronze Tier',
      category: 'value-based',
      criteria: 'clv <= 1000 OR mrr <= 50',
      customerCount: 350,
      avgMrr: 28,
      avgClv: 650,
      retentionRate: 48,
      growth: -8.3,
      churnRisk: 65,
      predictedChurn: 228,
      intervention: 'price_adjustment',
      segmentValue: 9800,
      trend: 'down',
      characteristics: {
        plan: { Enterprise: 2, Pro: 25, Basic: 73 },
        tenure: { '>2y': 10, '1-2y': 25, '<1y': 65 },
        usage: { high: 15, medium: 35, low: 50 }
      }
    }
  ]
}

// Intervention strategies
const interventionStrategies = {
  priority_support: {
    name: 'Priority Support',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Dedicated account manager and 24/7 priority support',
    expectedImpact: 'Increase retention by 8-12%',
    cost: 'High',
    timeline: '2-4 weeks',
    successRate: '92%'
  },
  account_review: {
    name: 'Strategic Review',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Quarterly business review and success planning',
    expectedImpact: 'Improve retention by 5-8%',
    cost: 'Medium',
    timeline: '3-5 weeks',
    successRate: '85%'
  },
  targeted_offer: {
    name: 'Targeted Offer',
    icon: Gift,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Personalized discount or feature bundle',
    expectedImpact: 'Boost retention by 12-18%',
    cost: 'Low',
    timeline: '1-2 weeks',
    successRate: '78%'
  },
  price_adjustment: {
    name: 'Price Optimization',
    icon: DollarSign,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Plan restructuring or regional pricing',
    expectedImpact: 'Improve retention by 15-25%',
    cost: 'Medium',
    timeline: '4-8 weeks',
    successRate: '82%'
  },
  personal_outreach: {
    name: 'Personal Outreach',
    icon: Phone,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: '1:1 outreach from customer success team',
    expectedImpact: 'Reduce churn by 20-30%',
    cost: 'High',
    timeline: '1-3 weeks',
    successRate: '88%'
  }
}

export default function SegmentsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('value-based')
  const [selectedSegment, setSelectedSegment] = useState('platinum')
  const [sortConfig, setSortConfig] = useState({ key: 'segmentValue', direction: 'desc' })

  const segments = generateSegments()
  const selectedSegmentData = segments.find(seg => seg.id === selectedSegment)
  const intervention = selectedSegmentData ? interventionStrategies[selectedSegmentData.intervention as keyof typeof interventionStrategies] : null

  // Sort segments
  const sortedSegments = useMemo(() => {
    return [...segments].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1
      }
      return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1
    })
  }, [segments, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    })
  }

  // Radar chart data for segment comparison
  const radarData = [
    { metric: 'Avg MRR', platinum: 587, gold: 287, silver: 98, bronze: 28 },
    { metric: 'Retention', platinum: 96, gold: 88, silver: 72, bronze: 48 },
    { metric: 'CLV', platinum: 9.25, gold: 4.85, silver: 1.85, bronze: 0.65 },
    { metric: 'Growth', platinum: 15.2, gold: 9.8, silver: 3.5, bronze: -8.3 },
    { metric: 'Churn Risk', platinum: 4, gold: 15, silver: 32, bronze: 65 },
  ]

  // Intervention impact comparison
  const interventionImpact = [
    { strategy: 'Priority Support', cost: 'High', impact: 10, roi: 4.2, customers: 180 },
    { strategy: 'Strategic Review', cost: 'Medium', impact: 6.5, roi: 3.8, customers: 420 },
    { strategy: 'Targeted Offer', cost: 'Low', impact: 15, roi: 5.1, customers: 550 },
    { strategy: 'Price Optimization', cost: 'Medium', impact: 20, roi: 4.8, customers: 350 },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
          <p className="text-sm text-gray-600">Value-based segmentation with retention interventions</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-based">Value-based</SelectItem>
              <SelectItem value="usage-based">Usage-based</SelectItem>
              <SelectItem value="geography-based">Geography-based</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              {segments.map(segment => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Segment Overview</TabsTrigger>
          <TabsTrigger value="comparison">Performance Comparison</TabsTrigger>
          <TabsTrigger value="retention">Retention Intervention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Value-based Segments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedSegments.map((segment) => {
              const TrendIcon = segment.trend === 'up' ? TrendingUp : segment.trend === 'down' ? TrendingDown : TrendingUp
              return (
                <Card key={segment.id} className={`cursor-pointer hover:shadow-lg transition-all ${
                  segment.id === selectedSegment ? 'ring-2 ring-blue-500' : ''
                }`} onClick={() => setSelectedSegment(segment.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{segment.name}</h3>
                        <p className="text-sm text-gray-500">Tier</p>
                      </div>
                      <Badge variant={segment.trend === 'up' ? "default" : "destructive"} className="flex items-center gap-1">
                        <TrendIcon className="h-3 w-3" />
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{segment.customerCount}</div>
                        <div className="text-sm text-gray-600">Customers</div>
                        <div className="text-xs text-gray-500">
                          {((segment.customerCount / 1500) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">${segment.avgMrr}</div>
                        <div className="text-sm text-gray-600">Avg MRR</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{segment.retentionRate}%</div>
                        <div className="text-sm text-gray-600">Retention</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{segment.churnRisk}%</div>
                        <div className="text-sm text-gray-600">Churn Risk</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Segment Value:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${(segment.segmentValue / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(segment.segmentValue / 280000) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Segment Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Value Distribution</CardTitle>
              <CardDescription>Distribution of customers across value tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="customerCount" fill="#3b82f6" name="Customer Count" />
                    <Bar dataKey="segmentValue" fill="#10b981" name="Segment Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance Radar</CardTitle>
              <CardDescription>Comparative analysis across value tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar name="Platinum" dataKey="platinum" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Radar name="Gold" dataKey="gold" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Silver" dataKey="silver" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    <Radar name="Bronze" dataKey="bronze" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sortable Segments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Segments Comparison Table</CardTitle>
              <CardDescription>Click headers to sort by column</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Segment
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('customerCount')}>
                      <div className="flex items-center gap-1 justify-end">
                        Customers
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('avgMrr')}>
                      <div className="flex items-center gap-1 justify-end">
                        Avg MRR
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('retentionRate')}>
                      <div className="flex items-center gap-1 justify-end">
                        Retention
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('churnRisk')}>
                      <div className="flex items-center gap-1 justify-end">
                        Churn Risk
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort('segmentValue')}>
                      <div className="flex items-center gap-1 justify-end">
                        Value
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSegments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium">{segment.name}</TableCell>
                      <TableCell className="text-right">{segment.customerCount}</TableCell>
                      <TableCell className="text-right">${segment.avgMrr}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={segment.retentionRate > 80 ? "default" : segment.retentionRate > 60 ? "secondary" : "destructive"}>
                          {segment.retentionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={segment.churnRisk < 20 ? "default" : segment.churnRisk < 40 ? "secondary" : "destructive"}>
                          {segment.churnRisk}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">${(segment.segmentValue / 1000).toFixed(0)}K</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          {/* Intervention Strategy Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Retention Intervention Strategy</CardTitle>
              <CardDescription>Recommended actions to reduce churn and improve retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Intervention Impact Summary */}
                <div>
                  <h4 className="font-semibold mb-4">Recommended Intervention Impact</h4>
                  <div className="space-y-3">
                    {interventionImpact.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{strategy.strategy}</div>
                          <div className="text-sm text-gray-600">{strategy.customers} customers</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{strategy.impact}% retention</div>
                          <div className="text-sm text-gray-600">{strategy.cost} cost • ROI: {strategy.roi}x</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">42%</div>
                      <div className="text-sm text-gray-600">Total At Risk</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">$284K</div>
                      <div className="text-sm text-gray-600">Revenue at Risk</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">18%</div>
                      <div className="text-sm text-gray-600">Avg Improvement</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">4.2x</div>
                      <div className="text-sm text-gray-600">Avg ROI</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Selected Segment Intervention Details */}
              {selectedSegmentData && intervention && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <intervention.icon className={`h-5 w-5 ${intervention.color}`} />
                      {intervention.name} for {selectedSegmentData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Implementation Details</h4>
                          <p className="text-sm text-gray-600">{intervention.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Timeline:</span>
                            <p>{intervention.timeline}</p>
                          </div>
                          <div>
                            <span className="font-medium">Success Rate:</span>
                            <p>{intervention.successRate}</p>
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span>
                            <p>{intervention.cost}</p>
                          </div>
                          <div>
                            <span className="font-medium">Target:</span>
                            <p>{selectedSegmentData.customerCount} customers</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Expected Outcomes</h4>
                          <div className="space-y-2 text-sm">
                            <p>• Prevent {Math.round(selectedSegmentData.predictedChurn * 0.7)} expected churns</p>
                            <p>• Save ${Math.round(selectedSegmentData.predictedChurn * selectedSegmentData.avgMrr * 0.7)} monthly revenue</p>
                            <p>• Improve retention by {intervention.expectedImpact}</p>
                            <p>• Estimated ROI: 3.8x - 4.5x</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}