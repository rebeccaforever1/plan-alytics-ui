// src/app/dashboard/alerts/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  ReferenceArea,
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
  Bell,
  BellOff,
  Filter,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MessageSquare,
  Gift,
  BarChart3
} from 'lucide-react'

// Mock alert data
const generateAlerts = () => ({
  activeAlerts: [
    {
      id: '1',
      type: 'churn_risk' as const,
      severity: 'critical' as const,
      segment: 'Bronze',
      customerCount: 45,
      trigger: 'Usage dropped 65% in 7 days',
      triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'new' as const,
      priority: 'P0',
      predictedLoss: 12500,
      recommendedAction: 'immediate_outreach',
      assignedTo: 'CS Team Alpha'
    },
    {
      id: '2',
      type: 'revenue_at_risk' as const,
      severity: 'high' as const,
      segment: 'Silver',
      customerCount: 28,
      trigger: 'MRR decline detected',
      triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'in_progress' as const,
      priority: 'P1',
      predictedLoss: 8200,
      recommendedAction: 'personalized_offer',
      assignedTo: 'Sales Team'
    },
    {
      id: '3',
      type: 'engagement_drop' as const,
      severity: 'medium' as const,
      segment: 'Gold',
      customerCount: 12,
      trigger: '14-day inactivity',
      triggeredAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      status: 'acknowledged' as const,
      priority: 'P2',
      predictedLoss: 4500,
      recommendedAction: 're_engagement_campaign',
      assignedTo: 'Marketing'
    }
  ],
  resolvedAlerts: [
    {
      id: '4',
      type: 'payment_failed' as const,
      severity: 'high' as const,
      segment: 'Platinum',
      customerCount: 3,
      trigger: 'Payment method expired',
      triggeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'resolved' as const,
      priority: 'P1',
      predictedLoss: 0,
      recommendedAction: 'payment_reminder',
      assignedTo: 'Billing Team'
    }
  ],
  systemHealth: {
    uptime: 99.98,
    alertAccuracy: 92.5,
    falsePositiveRate: 4.2,
    responseTime: '2.3s',
    monitoringCoverage: 95.8
  },
  alertTrends: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    critical: Math.floor(Math.random() * 8) + 2,
    high: Math.floor(Math.random() * 15) + 5,
    medium: Math.floor(Math.random() * 25) + 10,
    low: Math.floor(Math.random() * 40) + 15,
    resolved: Math.floor(Math.random() * 35) + 20
  })),
  segmentHealth: [
    { segment: 'Platinum', health: 96, alerts: 2, risk: 'low' },
    { segment: 'Gold', health: 88, alerts: 8, risk: 'medium' },
    { segment: 'Silver', health: 72, alerts: 23, risk: 'high' },
    { segment: 'Bronze', health: 55, alerts: 45, risk: 'critical' }
  ]
});

// Alert actions
const alertActions = {
  immediate_outreach: { label: 'Immediate Outreach', icon: Phone, color: 'bg-red-100 text-red-800' },
  personalized_offer: { label: 'Personalized Offer', icon: Gift, color: 'bg-orange-100 text-orange-800' },
  re_engagement_campaign: { label: 'Re-engagement Campaign', icon: Mail, color: 'bg-yellow-100 text-yellow-800' },
  payment_reminder: { label: 'Payment Reminder', icon: Bell, color: 'bg-blue-100 text-blue-800' },
  feature_education: { label: 'Feature Education', icon: Target, color: 'bg-purple-100 text-purple-800' },
  account_review: { label: 'Account Review', icon: BarChart3, color: 'bg-green-100 text-green-800' }
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [mutedAlerts, setMutedAlerts] = useState<string[]>([])

  const alertData = useMemo(() => generateAlerts(), [])
  const filteredAlerts = useMemo(() => {
    let filtered = activeTab === 'active' ? alertData.activeAlerts : alertData.resolvedAlerts;
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }
    
    if (segmentFilter !== 'all') {
      filtered = filtered.filter(alert => alert.segment === segmentFilter);
    }
    
    return filtered.filter(alert => !mutedAlerts.includes(alert.id));
  }, [activeTab, severityFilter, segmentFilter, mutedAlerts, alertData])

  const toggleMuteAlert = (alertId: string) => {
    setMutedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    )
  }

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    acknowledged: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800'
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Monitoring</h1>
          <p className="text-sm text-gray-600">Real-time monitoring and proactive interventions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertData.activeAlerts.length}</div>
            <p className="text-xs text-gray-500">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{alertData.systemHealth.uptime}%</div>
            <p className="text-xs text-gray-500">Monitoring reliability</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alert Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alertData.systemHealth.alertAccuracy}%</div>
            <p className="text-xs text-gray-500">True positives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertData.systemHealth.responseTime}</div>
            <p className="text-xs text-gray-500">Time to action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertData.systemHealth.monitoringCoverage}%</div>
            <p className="text-xs text-gray-500">Segments monitored</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Alerts</TabsTrigger>
          <TabsTrigger value="trends">Alert Trends</TabsTrigger>
          <TabsTrigger value="health">Segment Health</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Alert Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Real-time notifications requiring action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alerts Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Alert</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => {
                    const ActionIcon = alertActions[alert.recommendedAction as keyof typeof alertActions]?.icon || Bell;
                    return (
                      <TableRow key={alert.id} className={
                        alert.severity === 'critical' ? 'bg-red-50' :
                        alert.severity === 'high' ? 'bg-orange-50' : ''
                      }>
                        <TableCell>
                          <Badge className={severityColors[alert.severity]}>
                            {alert.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{alert.type.replace('_', ' ').toUpperCase()}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(alert.triggeredAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{alert.segment}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{alert.trigger}</TableCell>
                        <TableCell>{alert.customerCount}</TableCell>
                        <TableCell>
                          <div className="font-medium text-red-600">
                            ${alert.predictedLoss.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">at risk</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={alertActions[alert.recommendedAction as keyof typeof alertActions]?.color}>
                            <ActionIcon className="h-3 w-3 mr-1" />
                            {alertActions[alert.recommendedAction as keyof typeof alertActions]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toggleMuteAlert(alert.id)}>
                              {mutedAlerts.includes(alert.id) ? (
                                <BellOff className="h-4 w-4" />
                              ) : (
                                <Bell className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Trends & Patterns</CardTitle>
              <CardDescription>30-day alert activity and response metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertData.alertTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                    <Bar dataKey="high" stackId="a" fill="#f59e0b" name="High" />
                    <Bar dataKey="medium" stackId="a" fill="#3b82f6" name="Medium" />
                    <Bar dataKey="low" stackId="a" fill="#10b981" name="Low" />
                    <Bar dataKey="resolved" fill="#8b5cf6" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Health Monitoring</CardTitle>
              <CardDescription>Real-time health scores and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {alertData.segmentHealth.map((segment) => (
                  <Card key={segment.segment} className={
                    segment.risk === 'critical' ? 'ring-2 ring-red-500' :
                    segment.risk === 'high' ? 'ring-2 ring-orange-500' :
                    segment.risk === 'medium' ? 'ring-2 ring-yellow-500' : ''
                  }>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-lg mb-2">{segment.segment}</h3>
                      <div className="text-3xl font-bold mb-2" style={{
                        color: segment.health >= 90 ? '#10b981' :
                               segment.health >= 75 ? '#f59e0b' :
                               segment.health >= 60 ? '#ef4444' : '#dc2626'
                      }}>
                        {segment.health}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">Health Score</div>
                      <Badge variant={
                        segment.risk === 'critical' ? 'destructive' :
                        segment.risk === 'high' ? 'default' :
                        segment.risk === 'medium' ? 'secondary' : 'outline'
                      }>
                        {segment.risk.toUpperCase()} RISK
                      </Badge>
                      <div className="text-sm text-gray-500 mt-2">
                        {segment.alerts} active alerts
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Health Trends */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Monitoring Insights</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Bronze segment shows critical health degradation - immediate action required</p>
                  <p>• Silver segment alerts increased by 45% this week - investigate root cause</p>
                  <p>• Platinum segment maintains excellent health - continue current protocols</p>
                  <p>• Gold segment showing stability - monitor for any changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}