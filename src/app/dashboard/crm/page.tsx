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
} from 'lucide-react'

// Seeded random number generator for consistent data across server/client
const seededRandom = (seed) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// This would be imported from your fakeData.ts file
const generateFakeData = () => {
  // Use seeded random for consistent results
  let seedCounter = 12345; // Fixed seed for reproducible data
  const random = () => seededRandom(seedCounter++);
  
  const customers = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    company: ['TechCorp', 'DataFlow', 'CloudSync', 'DevTools', 'AILabs'][Math.floor(random() * 5)],
    plan: ['Starter', 'Professional', 'Enterprise', 'Trial'][Math.floor(random() * 4)],
    industry: ['Technology', 'Finance', 'Healthcare', 'Retail'][Math.floor(random() * 4)],
    clv: 1000 + random() * 4000,
    joinDate: new Date(2024, Math.floor(random() * 12), Math.floor(random() * 28)),
  }))

  const crmData = customers.map((customer, i) => {
    const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral']
    const campaigns = ['Q4 Growth', 'Holiday Special', 'Feature Launch', 'Retargeting']
    
    // Reset seed counter to ensure consistent data for each customer
    const customerSeed = 54321 + i;
    const customerRandom = () => seededRandom(customerSeed + (seedCounter++));
    
    return {
      ...customer,
      acquisitionChannel: channels[Math.floor(customerRandom() * channels.length)],
      campaign: campaigns[Math.floor(customerRandom() * campaigns.length)],
      touchpoints: Math.floor(1 + customerRandom() * 12),
      cac: 50 + customerRandom() * 400,
      ltv: customer.clv,
      engagementScore: customerRandom() * 100,
      totalLeadScore: customerRandom() * 100,
    }
  })

  const mixData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map((month, index) => {
      const baseSeasonality = 1 + 0.3 * Math.sin(2 * Math.PI * index / 12)
      const monthRandom = () => seededRandom(67890 + index);
      const totalSpend = (15000 + monthRandom() * 10000) * baseSeasonality
      const totalLeads = (totalSpend / 75) + monthRandom() * 50
      const totalRevenue = totalLeads * (200 + monthRandom() * 100) * baseSeasonality
      
      return {
        month,
        totalSpend,
        totalLeads,
        totalRevenue,
        cac: totalSpend / totalLeads,
        roas: totalRevenue / totalSpend,
        efficiency: (totalLeads / totalSpend) * 1000,
      }
    })

  const shapleyData = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral']
    .map(channel => {
      const channelCustomers = crmData.filter(c => c.acquisitionChannel === channel)
      const totalRevenue = channelCustomers.reduce((sum, c) => sum + c.ltv, 0)
      return {
        channel,
        shapleyValue: totalRevenue,
        conversions: channelCustomers.length,
        revenue: totalRevenue,
        avgOrderValue: totalRevenue / channelCustomers.length || 0,
      }
    }).map((channel, _, array) => {
      const totalShapley = array.reduce((sum, c) => sum + c.shapleyValue, 0)
      return {
        ...channel,
        contributionPercentage: totalShapley > 0 ? (channel.shapleyValue / totalShapley) * 100 : 0
      }
    })

  const aiData = [
    { name: 'Email Engagement', category: 'Behavioral' },
    { name: 'Website Behavior', category: 'Behavioral' },
    { name: 'Company Size', category: 'Firmographic' },
    { name: 'Industry Match', category: 'Firmographic' },
    { name: 'Geographic Fit', category: 'Demographic' },
    { name: 'Job Title Relevance', category: 'Demographic' },
  ].map((feature, i) => {
    const featureRandom = () => seededRandom(98765 + i);
    return {
      feature: feature.name,
      importance: featureRandom() * 100,
      correlation: -0.5 + featureRandom(),
      dataQuality: 60 + featureRandom() * 40,
      predictivePower: featureRandom() * 100,
      category: feature.category
    }
  }).sort((a, b) => b.predictivePower - a.predictivePower)

  const markovData = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase', 'Retention']
    .map((touchpoint, index) => {
      const stageRandom = () => seededRandom(13579 + index);
      const conversionProbability = Math.max(0, 0.1 + (index * 0.15) + stageRandom() * 0.1)
      const dropoffProbability = Math.max(0, 0.3 - (index * 0.05) + stageRandom() * 0.1)
      
      return {
        touchpoint,
        conversionProbability: conversionProbability * 100,
        dropoffProbability: dropoffProbability * 100,
        progressProbability: Math.max(0, (1 - conversionProbability - dropoffProbability)) * 100,
        expectedValue: conversionProbability * 2000,
        visitors: Math.floor(1000 * Math.pow(0.7, index)),
      }
    })

  return { customers, crmData, mixData, shapleyData, aiData, markovData }
}

// Utility Functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Acquisition Cost</CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(kpis.totalCAC)}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">
              LTV:CAC ratio {kpis.ltvCacRatio.toFixed(1)}:1
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return on Ad Spend</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
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
          <CardTitle className="text-sm font-medium">Lead Quality Score</CardTitle>
          <Brain className="h-4 w-4 text-purple-600" />
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
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Zap className="h-4 w-4 text-orange-600" />
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

const MarketingMixAnalysis = ({ mixData, onGenerateRecommendations }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Marketing Mix Performance</CardTitle>
              <CardDescription>Channel spend efficiency and ROI trends</CardDescription>
            </div>
            <Button variant="ghost" onClick={onGenerateRecommendations}>
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => 
                  name === 'totalSpend' ? formatCurrency(value) : name === 'roas' ? `${Number(value).toFixed(2)}x` : value
                } />
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
                  label={{ value: 'Customer Acquisition Cost', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  dataKey="roas" 
                  label={{ value: 'Return on Ad Spend', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip formatter={(value, name) => 
                  name === 'cac' ? formatCurrency(value) : `${Number(value).toFixed(2)}x`
                } />
                <ZAxis dataKey="totalRevenue" />
                <Scatter name="Monthly Performance" data={mixData} fill="#8b5cf6" />
                <ReferenceLine y={3} stroke="green" strokeDasharray="3 3" />
                <ReferenceLine x={200} stroke="red" strokeDasharray="3 3" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span>Optimal: High ROAS, Low CAC</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Target ROAS: 3.0x+</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
          Game theory approach to fair marketing attribution with optimization insights
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
            <p className="text-xs text-gray-500 mt-2">*ROAS estimated based on average CAC of $150 per conversion</p>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Optimization Insight
              </h4>
              <p className="text-xs text-blue-700">
                {performanceMetrics.bestPerforming.channel} is your highest performing channel with an estimated ROAS of {
                  (performanceMetrics.bestPerforming.revenue / (performanceMetrics.bestPerforming.conversions * 150)).toFixed(2)
                }x. Consider reallocating 15-20% of budget from lower-performing channels.
              </p>
            </div>
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
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Data Collection Recommendation
                </h4>
                <p className="text-xs text-yellow-700">
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
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border-2 border-red-200 rounded-lg bg-red-50">
            <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              High Drop-off Point
            </h4>
            <p className="text-sm text-red-700">
              {journeyInsights.highestDropoff.touchpoint} stage shows {journeyInsights.highestDropoff.dropoffProbability.toFixed(1)}% drop-off.
              Implement retargeting campaigns and personalized content for users at this stage.
            </p>
          </div>
          
          <div className="p-3 border-2 border-green-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
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
    const channelPerformance = shapleyData.map(channel => {
      const estimatedROAS = channel.revenue / (channel.conversions * 150);
      return {
        channel: channel.channel,
        roas: estimatedROAS,
      };
    }).sort((a, b) => b.roas - a.roas);
    
    const newRecommendations = [
      {
        id: 1,
        title: "Optimize Channel Allocation",
        description: `Reallocate budget from ${channelPerformance[channelPerformance.length - 1].channel} to ${channelPerformance[0].channel} based on ROAS performance`,
        impact: "Potential 15-22% increase in marketing efficiency",
        confidence: 85,
        actions: [
          `Reduce ${channelPerformance[channelPerformance.length - 1].channel} spend by 20%`,
          `Increase ${channelPerformance[0].channel} budget by 15%`,
          "Implement A/B testing for creative assets"
        ],
        priority: "high"
      },
      {
        id: 2,
        title: "Improve Lead Scoring Data Quality",
        description: `Enhance data collection for ${aiData[aiData.length - 1]?.feature} which has low predictive power but high potential`,
        impact: "5-8% improvement in lead qualification accuracy",
        confidence: 72,
        actions: [
          `Add additional tracking for ${aiData[aiData.length - 1]?.feature} related behaviors`,
          "Implement progressive profiling forms",
          "Set up data validation rules"
        ],
        priority: "medium"
      }
    ];
    
    setRecommendations(newRecommendations);
  }, [mixData, shapleyData, aiData, markovData]);
  
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
            <p className="text-gray-500 mb-4">Click "Generate Recommendations" to get data-driven optimization insights</p>
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
const DefinitionsTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Core Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Customer Acquisition Cost (CAC)</h4>
            <p className="text-xs text-gray-600 mt-1">
              Total cost of acquiring a new customer, including all marketing and sales expenses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Customer Lifetime Value (LTV)</h4>
            <p className="text-xs text-gray-600 mt-1">
              Predicted net profit from the entire future relationship with a customer.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Attribution Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Shapley Value Attribution</h4>
            <p className="text-xs text-gray-600 mt-1">
              Game theory approach that fairly distributes credit based on each channel's marginal contribution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

// Main CRM Dashboard
export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const data = useMemo(() => generateFakeData(), [])
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
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CRMKPIOverview crmData={crmData} mixData={mixData} />
          <MarketingMixAnalysis 
            mixData={mixData} 
            onGenerateRecommendations={() => setActiveTab('recommendations')} 
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

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>Connected marketing and CRM platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'HubSpot', status: 'Connected', type: 'CRM', records: 45234 },
                  { name: 'Google Ads', status: 'Connected', type: 'Advertising', records: 12890 },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-xs text-gray-500">{integration.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatNumber(integration.records)} records</p>
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="definitions" className="space-y-6">
          <DefinitionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}