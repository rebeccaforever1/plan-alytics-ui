"use client"

import React, { useState, useMemo, useCallback } from 'react'
import {
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts'

import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Bot,
  Sparkles,
  AlertTriangle,
  Star,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Minus,
} from 'lucide-react'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'


import {
  generateCRMCustomers,
  generateCRMData,
  generateMixData,
  generateShapleyData,
  generateAIData,
  generateMarkovData,
  generateCRMInsights,
  generateCRMRecommendations,
} from '@/lib/fakeData'


import { formatTimeLabel, seededRandom, calculateTrend, calculateMean,
         calculateStandardDeviation, formatNumber, formatCurrency, formatPercentage  } from '@/lib/utils';


         
// FIXED: Enhanced CSV Export Function
const exportCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    alert('No data available to export')
    return
  }

  try {
    // Flatten objects and handle special values
    const flattenObject = (obj) => {
      const flattened = {}
      
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        
        // Handle Date objects
        if (value instanceof Date) {
          flattened[key] = value.toISOString().split('T')[0] // YYYY-MM-DD format
        }
        // Handle nested objects by converting to JSON string
        else if (typeof value === 'object' && value !== null) {
          flattened[key] = JSON.stringify(value)
        }
        // Handle null/undefined
        else if (value === null || value === undefined) {
          flattened[key] = ''
        }
        // Handle everything else
        else {
          flattened[key] = value
        }
      })
      
      return flattened
    }

    // Flatten all data objects
    const flattenedData = data.map(item => flattenObject(item))
    
    // Get headers from first object
    const headers = Object.keys(flattenedData[0])
    
    // Create CSV content with proper escaping
    const csvHeader = headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',') + '\n'
    
    const csvRows = flattenedData.map(row => {
      return headers.map(header => {
        const value = row[header] ?? ''
        // Escape quotes and wrap in quotes
        const escapedValue = String(value).replace(/"/g, '""')
        return `"${escapedValue}"`
      }).join(',')
    })
    
    const csvString = csvHeader + csvRows.join('\n')

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    console.log('Export completed successfully')
    
  } catch (error) {
    console.error('Export error:', error)
    alert('Error exporting data: ' + error.message)
  }
}

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold leading-none tracking-tight">
    {children}
  </h3>
)

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">
    {children}
  </p>
)

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
)

const Badge = ({ children, variant = "default", className = "", style = {} }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "bg-transparent border text-gray-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`} style={style}>
      {children}
    </span>
  )
}

const Button = ({ children, onClick, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 border-0 px-4 py-2",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 border-[1px] px-3 py-2.5", // Less padding
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50 border-0 px-4 py-2"
  }


  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${variants[variant]} transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

const Select = ({ children, value, onValueChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  </div>
)

const SelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
)

const Input = ({ type = "text", placeholder, value, onChange, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
)

const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
)

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
)

const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
)

const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50">
    {children}
  </tr>
)

const TableHead = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
)

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
  <div className={`bg-gray-100 p-1 rounded-lg ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
)

const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
)

const TabsContent = ({ children, value, activeTab }) => (
  activeTab === value ? <div>{children}</div> : null
)



// Insight Card Component
const InsightCard = ({ title, description, impact, confidence, actions, priority = "medium" }) => {
  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-blue-500"
  }
  
  return (
    <Card className={`border-l-4 ${priorityColors[priority]}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            {title}
          </CardTitle>
          <Badge variant={confidence > 80 ? "success" : confidence > 60 ? "warning" : "destructive"}>
            {confidence}% confidence
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <p className="text-sm font-medium">Potential Impact:</p>
          <p className="text-sm text-gray-600">{impact}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Recommended Actions:</p>
          <ul className="space-y-1">
            {actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Dashboard Components

const CRMKPIOverview = ({ crmData, mixData }) => {
  const kpis = useMemo(() => {
    const currentMonth = mixData[mixData.length - 1] || {}
    const previousMonth = mixData[mixData.length - 2] || {}
    
    const totalCAC = crmData.reduce((sum, c) => sum + (c.cac || 0), 0) / crmData.length
    const totalLTV = crmData.reduce((sum, c) => sum + (c.ltv || 0), 0) / crmData.length
    const ltvCacRatio = totalCAC > 0 ? totalLTV / totalCAC : 0
    
    const highQualityLeads = crmData.filter(c => (c.totalLeadScore || 0) > 70).length
    const leadQualityRate = crmData.length > 0 ? (highQualityLeads / crmData.length) * 100 : 0
    
    const currentROAS = currentMonth.roas || 0
    const previousROAS = previousMonth.roas || 0
    const roasChange = previousROAS > 0 ? ((currentROAS - previousROAS) / previousROAS) * 100 : 0
    
    const conversionRate = crmData.length > 0 ? (crmData.filter(c => c.plan !== 'Trial').length / crmData.length) * 100 : 0
    
    return {
      totalCAC,
      ltvCacRatio,
      currentROAS,
      roasChange,
      leadQualityRate,
      conversionRate,
      totalCustomers: crmData.length,
      monthlySpend: currentMonth.totalSpend || 0,
    }
  }, [crmData, mixData])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
      <Card className={`border-l-4 ${kpis.ltvCacRatio >= 4 ? 'border-l-green-500' : kpis.ltvCacRatio >= 3 ? 'border-l-orange-500' : 'border-l-red-500'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Target className={`h-4 w-4 ${kpis.ltvCacRatio >= 4 ? 'text-green-600' : kpis.ltvCacRatio >= 3 ? 'text-orange-600' : 'text-red-600'}`} />
          <CardTitle className="text-sm font-medium">Customer Acquisition Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.ltvCacRatio >= 4 ? 'text-green-600' : kpis.ltvCacRatio >= 3 ? 'text-orange-600' : 'text-red-600'}`}>
            {formatCurrency(kpis.totalCAC)}
          </div>
          <p className="text-xs text-gray-500">
            <span className={`flex items-center ${kpis.ltvCacRatio >= 4 ? 'text-green-500' : kpis.ltvCacRatio >= 3 ? 'text-orange-500' : 'text-red-500'}`}>
              {kpis.ltvCacRatio >= 4 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : kpis.ltvCacRatio >= 3 ? <Minus className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              LTV:CAC ratio {kpis.ltvCacRatio.toFixed(1)}:1
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-medium">Return on Ad Spend</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{kpis.currentROAS.toFixed(2)}x</div>
          <p className="text-xs text-gray-500">
            <span className={`flex items-center ${kpis.roasChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {kpis.roasChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(kpis.roasChange).toFixed(1)}% vs last month
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Star className="h-4 w-4 text-purple-600" />
          <CardTitle className="text-sm font-medium">Lead Quality Score</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{kpis.leadQualityRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500">
            <span className="text-purple-500">
              AI-scored above 70 points
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Zap className="h-4 w-4 text-orange-600" />
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{kpis.conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-500">
            <span className="text-orange-500">
              {formatCurrency(kpis.monthlySpend)} monthly spend
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
const MarketingMixAnalysis = ({ mixData, onGenerateRecommendations, insights = [] }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Marketing Mix Performance</CardTitle>
                <CardDescription>Channel spend efficiency and ROI trends</CardDescription>
              </div>
              <Button variant="outline" onClick={onGenerateRecommendations}>
                <Sparkles className="h-4 w-4 mr-1" />
                Generate Insights
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mixData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{ value: '', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    label={{ value: 'ROAS', angle: 90, position: 'insideRight',offset: 25 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Total Spend') return formatCurrency(Number(value));
                      if (name === 'ROAS') return `${Number(value).toFixed(2)}x`;
                      return value;
                    }} 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalSpend" fill="#3b82f6" name="Total Spend" />
                  <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#f59e0b" strokeWidth={3} name="ROAS" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Efficiency Analysis</CardTitle>
            <CardDescription>Cost vs. return performance scatter plot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={mixData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="cac"
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{ value: 'Customer Acquisition Cost', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="roas" 
                    label={{ value: 'Return on Ad Spend', angle: -90, position: 'insideLeft', offset: 25 }} 
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'cac') return [formatCurrency(Number(value)), 'CAC'];
                      if (name === 'roas') return [`${Number(value).toFixed(2)}x`, 'ROAS'];
                      if (name === 'totalRevenue') return [formatCurrency(Number(value)), 'Revenue'];
                      return [value, name];
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <ZAxis dataKey="totalRevenue" />
                  <Scatter name="Monthly Performance" data={mixData} fill="#8b5cf6" />
                  <ReferenceLine y={3} stroke="green" strokeDasharray="3 3" />
                  <ReferenceLine x={200} stroke="red" strokeDasharray="3 3" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 mr-4 flex flex-col gap-2 text-xs items-end">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Monthly Performance</span>
              </div>
              <div className="flex items-center">
                  <div className="w-8 h-0 border-t-2 border-dashed border-green-500 mr-2"></div>
                <span>Target ROAS: 3.0x+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Display */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>Actionable recommendations based on your performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-600' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.impact} impact
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                        {insight.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
const ShapleyAttributionAnalysis = ({ shapleyData }) => {
  const performanceMetrics = useMemo(() => {
    const totalRevenue = shapleyData.reduce((sum, channel) => sum + channel.revenue, 0);
    const bestPerforming = [...shapleyData].sort((a, b) => 
      (b.revenue / b.conversions) - (a.revenue / a.conversions)
    )[0];
    
    const worstPerforming = [...shapleyData].sort((a, b) => 
      (a.revenue / a.conversions) - (b.revenue / b.conversions)
    )[0];
    
    return {
      totalRevenue,
      bestPerforming,
      worstPerforming
    };
  }, [shapleyData]);
  
    // Create a sorted copy for rendering
  const sortedShapleyData = useMemo(() => 
    [...shapleyData].sort((a, b) => b.shapleyValue - a.shapleyValue),
    [shapleyData]
  );
  
   return (
    <Card>
      <CardHeader>
        <CardTitle>Shapley Value Attribution Analysis</CardTitle>
        <CardDescription>
          A game theory approach to fair marketing attribution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Channel Contribution Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="80%" height="100%">
                <BarChart data={shapleyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => formatCurrency(Number(value))}
                    fontSize={11}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    type="category" 
                    dataKey="channel" 
                    width={80}
                    fontSize={11}
                    stroke="#6b7280"
                  />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="shapleyValue" radius={[0, 4, 4, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Channel Performance Matrix</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>ROAS*</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedShapleyData.map((channel) => {
                  const estimatedROAS = channel.revenue / (channel.conversions * 150);
                  return (
                    <TableRow key={channel.channel}>
                      <TableCell className="font-medium">{channel.channel}</TableCell>
                      <TableCell>{formatCurrency(channel.shapleyValue)}</TableCell>
                      <TableCell>{channel.conversions}</TableCell>
                      <TableCell>
                        <span className={estimatedROAS > 3 ? "text-green-600 font-medium" : estimatedROAS > 2 ? "text-yellow-600" : "text-red-600"}>
                          {isFinite(estimatedROAS) ? estimatedROAS.toFixed(2) + 'x' : 'N/A'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </div>
            <p className="text-xs text-gray-500 mt-2">*ROAS estimated based on average CAC of $150 per conversion</p>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm flex items-center gap-3 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Channel Observation
              </h4>
              <p className="font-semibold text-sm text-blue-700">
                {performanceMetrics.bestPerforming.channel} is your highest performing channel with an estimated ROAS of {
                  (performanceMetrics.bestPerforming.revenue / (performanceMetrics.bestPerforming.conversions * 150)).toFixed(2)
                }x. Consider reallocating 15-20% of budget from lower-performing channels.
              </p>
            </div>
          </div>
      
      </CardContent>
    </Card>
  )
}

const AILeadScoringDashboard = ({ aiData }) => {
  const categoryColors = {
    'Behavioral': '#3b82f6',
    'Firmographic': '#10b981', 
    'Demographic': '#f59e0b'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Lead Scoring Model</CardTitle>
        <CardDescription>
          Machine learning feature importance and predictive power analysis with optimization recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Feature Importance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiData.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    fontSize={12}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    dataKey="feature" 
                    type="category" 
                    width={120}
                    fontSize={12}
                    stroke="#6b7280"
                  />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Bar dataKey="predictivePower" fill="#8b5cf6" name="Predictive Power">
                    {aiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
                  <span className="text-xs">{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Model Performance & Recommendations</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Model Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">89.3%</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Precision</p>
                  <p className="text-2xl font-bold text-blue-600">84.7%</p>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-3 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-600 text-l" />
                  Data Collection Recommendation
                </h4>
                <p className="font-semibold text-sm text-yellow-700">
                  {aiData[0]?.feature} is your strongest predictor. Focus on collecting more data in this area to improve model accuracy by 5-8%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const MarkovJourneyAnalysis = ({ markovData }) => {
  const journeyInsights = useMemo(() => {
    const highestDropoff = markovData.reduce((max, stage) => 
      stage.dropoffProbability > max.dropoffProbability ? stage : markovData[0], markovData[0]);
    
    return {
      highestDropoff
    };
  }, [markovData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Journey Analysis</CardTitle>
        <CardDescription>
          Probabilistic modeling of customer progression through the funnel with optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={markovData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="touchpoint" />
              <YAxis />
              <Tooltip formatter={(value, name) => `${Number(value).toFixed(1)}%`} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="conversionProbability" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Conversion %"
              />
              <Area 
                type="monotone" 
                dataKey="dropoffProbability" 
                stackId="1" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6}
                name="Drop-off %"
              />
              <Bar dataKey="visitors" fill="#3b82f6" fillOpacity={0.3} name="Visitors" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-3 border-2 border-red-200 rounded-lg bg-red-50">
            <h4 className="font-semibold text-sm flex items-center gap-3 mb-3">
              <AlertTriangle className="h-4 w-4" />
              High Drop-off Point
            </h4>
            <p className="text-sm text-red-700">
              {journeyInsights.highestDropoff.touchpoint} stage shows {journeyInsights.highestDropoff.dropoffProbability.toFixed(1)}% drop-off.
              Implement retargeting campaigns and personalized content for users at this stage.
            </p>
          </div>
          
          <div className="p-3 border-2 border-green-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-sm flex items-center gap-3 mb-3">
              <TrendingUp className="h-4 w-4" />
              Conversion Opportunity
            </h4>
            <p className="text-sm text-green-700">
              Focus on tactics that drive progression through the customer journey, particularly at stages with high conversion probability.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Recommendations Engine
const RecommendationsEngine = ({ crmData, mixData, shapleyData, aiData, markovData }) => {
  const [recommendations, setRecommendations] = useState([]);
  
  const generateRecommendations = useCallback(() => {
    const newRecommendations = generateCRMRecommendations(shapleyData, aiData, mixData);
    setRecommendations(newRecommendations);
  }, [mixData, shapleyData, aiData]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI-Powered Recommendations</CardTitle>
            <CardDescription>Data-driven insights to optimize your marketing performance</CardDescription>
          </div>
          <Button onClick={generateRecommendations}>
            <Sparkles className="h-4 w-4 mr-1" />
            Generate Recommendations
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map(rec => (
              <InsightCard
                key={rec.id}
                title={rec.title}
                description={rec.description}
                impact={rec.impact}
                confidence={rec.confidence}
                actions={rec.actions}
                priority={rec.priority}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No recommendations yet</h3>
            <p className="text-gray-500 mb-4">Click "Generate Recommendations" to get data-driven recommendations.</p>
            <Button onClick={generateRecommendations}>
              Generate Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
// Definitions Tab Component
const DefinitionsTab = () => {
  const glossary = [
    {
      category: 'Core Metrics',
      icon: <Target className="h-4 w-4 text-blue-600" />,
      terms: [
        {
          term: 'Customer Acquisition Cost (CAC)',
          definition: 'Total cost of acquiring a new customer, including all marketing and sales expenses.',
          example: 'Example: $10,000 spent on ads for 100 customers → CAC = $100',
        },
        {
          term: 'Customer Lifetime Value (LTV)',
          definition: 'Predicted net profit from the entire future relationship with a customer.',
          example: 'Example: If a customer generates $50/month for 24 months → LTV = $1,200',
        },
        {
          term: 'Return on Ad Spend (ROAS)',
          definition: 'Revenue generated per dollar spent on advertising.',
          example: 'Example: $5,000 revenue from $1,000 ad spend → ROAS = 5x',
        },
        {
          term: 'Lead Quality Score',
          definition: 'AI-powered scoring of lead potential based on behavioral and firmographic data.',
          example: 'Example: Leads scoring above 70 points convert 3x higher than average',
        },
      ],
    },
    {
      category: 'Attribution Models',
      icon: <Star className="h-4 w-4 text-purple-600" />,
      terms: [
        {
          term: 'Shapley Value Attribution',
          definition: 'Game theory approach that fairly distributes credit based on each channel\'s marginal contribution.',
          example: 'Evaluates all possible touchpoint combinations to ensure accurate credit distribution',
        },
        {
          term: 'Markov Chain Attribution',
          definition: 'Probabilistic modeling of customer journey paths through the conversion funnel.',
          example: 'Identifies high drop-off points and optimal touchpoint sequences',
        },
      ],
    },
    {
      category: 'AI & Machine Learning',
      icon: <Sparkles className="h-4 w-4 text-green-600" />,
      terms: [
        {
          term: 'Feature Importance',
          definition: 'Machine learning metric showing which customer attributes most influence predictions.',
          example: 'Example: Website engagement may have 85% predictive power for conversion',
        },
        {
          term: 'Predictive Power Score',
          definition: 'Measure of how well a feature predicts customer behavior in AI models.',
          example: 'Scores range from 0% (no predictive value) to 100% (perfect prediction)',
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {glossary.map((section) => (
        <Card key={section.category}>
          <CardHeader className="flex items-center gap-2">
            {section.icon}
            <div>
              <CardTitle>{section.category}</CardTitle>
              <CardDescription> </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {section.terms.map((t) => (
                <AccordionItem key={t.term} value={t.term}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline hover:bg-gray-50 px-3 py-2 rounded-md">
                    {t.term}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">{t.definition}</p>
                    {t.example && (
                      <div className="text-xs bg-blue-50 text-gray-700 p-2 rounded border-l-2 border-blue-400">
                        {t.example}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
// Main CRM Dashboard

const InsightsDisplay = ({ insights = [] }) => {
  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No insights yet</h3>
        <p className="text-gray-500">Click "Generate Insights" in the Overview tab to get insights</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map(insight => (
        <div key={insight.id} className="flex items-start space-x-3 p-3 border rounded-lg">
          <div className={`p-2 rounded-full ${
            insight.impact === 'high' ? 'bg-red-100 text-red-600' :
            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{insight.title}</h4>
            <p className="text-sm text-gray-600">{insight.description}</p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {insight.impact} impact
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                {insight.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [insights, setInsights] = useState<any[]>([])

const handleGenerateInsights = () => {
  const fakeInsights = generateCRMInsights(mixData)
  setInsights(fakeInsights)
}
 
  const data = useMemo(() => ({
  customers: generateCRMCustomers(1000),
  crmData: generateCRMData(1000),
  mixData: generateMixData(),
  shapleyData: generateShapleyData(),
  aiData: generateAIData(),
  markovData: generateMarkovData()
}), [])
const { crmData, mixData, shapleyData, aiData, markovData } = data



  const handleExport = useCallback(() => {
    exportCSV(crmData, 'crm_attribution_data.csv')
  }, [crmData])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">CRM & Marketing Attribution</h1>
          <p className="text-gray-600">
            Advanced attribution modeling, AI-powered recommendations, and campaign optimization
          </p>
        </div>
        <div className="flex gap-4">



          
          <Button variant="outline" onClick={handleExport}
             className="border border-gray-300"  >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex overflow-x-auto md:grid md:grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="ai-scoring">AI Scoring</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CRMKPIOverview crmData={crmData} mixData={mixData} />
          <MarketingMixAnalysis 
  mixData={mixData} 
  onGenerateRecommendations={handleGenerateInsights}
  insights={insights}
/>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <ShapleyAttributionAnalysis shapleyData={shapleyData} />
        </TabsContent>

        <TabsContent value="ai-scoring" className="space-y-6">
          <AILeadScoringDashboard aiData={aiData} />
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          <MarkovJourneyAnalysis markovData={markovData} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationsEngine 
            crmData={crmData}
            mixData={mixData}
            shapleyData={shapleyData}
            aiData={aiData}
            markovData={markovData}
          />
        </TabsContent>

       

        <TabsContent value="definitions" className="space-y-6">
          <DefinitionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}