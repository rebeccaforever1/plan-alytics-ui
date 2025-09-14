// src/app/dashboard/forecasts/page.tsx
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
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
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

// Monte Carlo simulation for revenue forecasting
const generateMonteCarloForecast = (baseMrr: number, growthRate: number, volatility: number, periods: number, simulations: number = 1000) => {
  const results = [];
  
  for (let i = 0; i < simulations; i++) {
    const path = [];
    let current = baseMrr;
    
    for (let j = 0; j < periods; j++) {
      // Random growth with volatility
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      current = current * (1 + growthRate * randomFactor);
      path.push(current);
    }
    
    results.push(path);
  }
  
  // Calculate percentiles
  const percentiles = [];
  for (let i = 0; i < periods; i++) {
    const values = results.map(path => path[i]).sort((a, b) => a - b);
    percentiles.push({
      period: i + 1,
      p10: values[Math.floor(simulations * 0.10)],
      p50: values[Math.floor(simulations * 0.50)],
      p90: values[Math.floor(simulations * 0.90)],
      min: values[0],
      max: values[simulations - 1]
    });
  }
  
  return percentiles;
};

// Generate forecast data
const generateForecastData = () => {
  const baseMrr = 450000;
  const baseGrowth = 0.08; // 8% monthly growth
  const volatility = 0.15; // 15% volatility
  
  const monteCarlo = generateMonteCarloForecast(baseMrr, baseGrowth, volatility, 12);
  
  return {
    revenueForecast: monteCarlo.map((point, index) => ({
      month: `Month ${index + 1}`,
      conservative: point.p10,
      expected: point.p50,
      optimistic: point.p90,
      worstCase: point.min,
      bestCase: point.max
    })),
    churnForecast: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      current: 12 - (i * 0.8),
      withInterventions: 12 - (i * 1.2),
      goal: 8 - (i * 0.5)
    })),
    segmentProjections: [
      { segment: 'Platinum', current: 180, projected: 220, growth: 22.2, risk: 'Low' },
      { segment: 'Gold', current: 420, projected: 510, growth: 21.4, risk: 'Medium' },
      { segment: 'Silver', current: 550, projected: 620, growth: 12.7, risk: 'High' },
      { segment: 'Bronze', current: 350, projected: 300, growth: -14.3, risk: 'Critical' }
    ],
    scenarioAnalysis: [
      { scenario: 'Base Case', revenue: 6850000, customers: 1650, retention: 88, probability: 60 },
      { scenario: 'Optimistic', revenue: 7820000, customers: 1850, retention: 92, probability: 25 },
      { scenario: 'Pessimistic', revenue: 5420000, customers: 1450, retention: 82, probability: 15 }
    ]
  };
};

export default function ForecastsPage() {
  const [activeTab, setActiveTab] = useState('revenue')
  const [timeHorizon, setTimeHorizon] = useState('12m')
  const [showUncertainty, setShowUncertainty] = useState(true)
  
  const forecastData = useMemo(() => generateForecastData(), [])
  const timeHorizons = { '3m': 3, '6m': 6, '12m': 12, '24m': 24 }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecasts & Projections</h1>
          <p className="text-sm text-gray-600">Predictive analytics and scenario planning</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 months</SelectItem>
              <SelectItem value="6m">6 months</SelectItem>
              <SelectItem value="12m">12 months</SelectItem>
              <SelectItem value="24m">24 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowUncertainty(!showUncertainty)}>
            {showUncertainty ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showUncertainty ? 'Hide Uncertainty' : 'Show Uncertainty'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected ARR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(forecastData.revenueForecast[11].expected * 12 / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">Annual Run Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">22.5%</div>
            <p className="text-xs text-gray-500">Next 12 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Churn Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8.2%</div>
            <p className="text-xs text-gray-500">Monthly target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <p className="text-xs text-gray-500">Model accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="revenue">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="churn">Churn Projections</TabsTrigger>
          <TabsTrigger value="segments">Segment Growth</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast with Uncertainty</CardTitle>
              <CardDescription>Monte Carlo simulation showing probable outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData.revenueForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`$${Math.round(Number(value)).toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Area type="monotone" dataKey="expected" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Expected" />
                    {showUncertainty && (
                      <>
                        <Area type="monotone" dataKey="optimistic" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Optimistic (90%)" />
                        <Area type="monotone" dataKey="conservative" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Conservative (10%)" />
                      </>
                    )}
                    <ReferenceLine y={450000} stroke="#6b7280" strokeDasharray="3 3" label="Current" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Forecast Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  ${Math.round(forecastData.revenueForecast[11].conservative / 1000).toLocaleString()}k - ${Math.round(forecastData.revenueForecast[11].optimistic / 1000).toLocaleString()}k
                </div>
                <p className="text-xs text-gray-500">Month 12 range</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">±18.5%</div>
                <p className="text-xs text-gray-500">Monthly variation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Probability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">72%</div>
                <p className="text-xs text-gray-500">Meeting targets</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Churn Rate Projections</CardTitle>
              <CardDescription>Current trends vs. intervention scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData.churnForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} domain={[0, 15]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={2} name="Current Trend" />
                    <Line type="monotone" dataKey="withInterventions" stroke="#10b981" strokeWidth={2} name="With Interventions" />
                    <Line type="monotone" dataKey="goal" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" name="Target Goal" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Projection:</span>
                    <span className="font-medium text-red-600">{forecastData.churnForecast[11].current}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">With Interventions:</span>
                    <span className="font-medium text-green-600">{forecastData.churnForecast[11].withInterventions}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Improvement:</span>
                    <span className="font-medium text-blue-600">
                      {((forecastData.churnForecast[11].current - forecastData.churnForecast[11].withInterventions) / forecastData.churnForecast[11].current * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-green-600">+$2.8M</div>
                  <p className="text-sm text-gray-600">Potential annual revenue preservation</p>
                  <div className="text-sm">
                    <span className="font-medium">ROI: </span>
                    <span>4.2x on retention spending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>Probability-weighted outcomes under different conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {forecastData.scenarioAnalysis.map((scenario) => (
                  <Card key={scenario.scenario} className={
                    scenario.scenario === 'Optimistic' ? 'ring-2 ring-green-500' :
                    scenario.scenario === 'Pessimistic' ? 'ring-2 ring-red-500' : ''
                  }>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">{scenario.scenario}</h3>
                        <Badge variant="secondary" className="mb-4">
                          {scenario.probability}% probability
                        </Badge>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">
                            ${(scenario.revenue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-600">Annual Revenue</div>
                          <div className="text-lg font-semibold">{scenario.customers} customers</div>
                          <div className="text-sm text-gray-600">Customer Count</div>
                          <div className="text-lg font-semibold">{scenario.retention}%</div>
                          <div className="text-sm text-gray-600">Retention Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Strategic Recommendations</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Focus on Bronze segment retention to mitigate downside risk</p>
                  <p>• Invest in Silver-to-Gold upgrade campaigns</p>
                  <p>• Maintain Platinum service levels to protect high-value revenue</p>
                  <p>• Develop contingency plans for pessimistic scenario triggers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}