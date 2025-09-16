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
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50"
  }
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${variants[variant]} transition-colors ${className}`}
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

// NEW: Insight Card Component
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
  // Calculate channel efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    const currentMonth = mixData[mixData.length - 1];
    const previousMonth = mixData[mixData.length - 2];
    
    return {
      currentCAC: currentMonth?.cac || 0,
      previousCAC: previousMonth?.cac || 0,
      cacChange: previousMonth?.cac ? ((currentMonth?.cac - previousMonth?.cac) / previousMonth?.cac) * 100 : 0,
      currentROAS: currentMonth?.roas || 0,
      previousROAS: previousMonth?.roas || 0,
      roasChange: previousMonth?.roas ? ((currentMonth?.roas - previousMonth?.roas) / previousMonth?.roas) * 100 : 0,
    };
  }, [mixData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Marketing Mix Performance</CardTitle>
              <CardDescription>Channel spend efficiency and ROI trends</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onGenerateRecommendations}>
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
                  name === 'Total Spend' ? formatCurrency(value) : name === 'ROAS' ? `${Number(value).toFixed(2)}x` : value
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
                  name === 'CAC' ? formatCurrency(value) : `${Number(value).toFixed(2)}x`
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
  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  
  // Calculate performance metrics for recommendations
  const performanceMetrics = useMemo(() => {
    const totalRevenue = shapleyData.reduce((sum, channel) => sum + channel.revenue, 0);
    const avgROAS = shapleyData.reduce((sum, channel) => {
      // Simplified ROAS calculation for demo
      const channelROAS = channel.revenue / (channel.conversions * 150); // Assume $150 CAC per conversion
      return sum + (isFinite(channelROAS) ? channelROAS : 0);
    }, 0) / shapleyData.length;
    
    const bestPerforming = [...shapleyData].sort((a, b) => 
      (b.revenue / b.conversions) - (a.revenue / a.conversions)
    )[0];
    
    const worstPerforming = [...shapleyData].sort((a, b) => 
      (a.revenue / a.conversions) - (b.revenue / b.conversions)
    )[0];
    
    return {
      totalRevenue,
      avgROAS,
      bestPerforming,
      worstPerforming
    };
  }, [shapleyData]);
  
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shapleyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="shapleyValue"
                    label={({ channel, contributionPercentage }) => `${channel}: ${contributionPercentage.toFixed(1)}%`}
                  >
                    {shapleyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
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
                {shapleyData
                  .sort((a, b) => b.shapleyValue - a.shapleyValue)
                  .map((channel) => {
                    // Simplified ROAS calculation for demo
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

  // Calculate model performance insights
  const modelInsights = useMemo(() => {
    const behavioralFeatures = aiData.filter(f => f.category === 'Behavioral');
    const firmographicFeatures = aiData.filter(f => f.category === 'Firmographic');
    const demographicFeatures = aiData.filter(f => f.category === 'Demographic');
    
    const avgBehavioralImportance = behavioralFeatures.reduce((sum, f) => sum + f.importance, 0) / behavioralFeatures.length;
    const avgFirmographicImportance = firmographicFeatures.reduce((sum, f) => sum + f.importance, 0) / firmographicFeatures.length;
    const avgDemographicImportance = demographicFeatures.reduce((sum, f) => sum + f.importance, 0) / demographicFeatures.length;
    
    const topFeature = aiData[0];
    const weakestFeature = aiData[aiData.length - 1];
    
    return {
      avgBehavioralImportance,
      avgFirmographicImportance,
      avgDemographicImportance,
      topFeature,
      weakestFeature
    };
  }, [aiData]);
  
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
                <BarChart data={aiData.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="feature" type="category" width={120} />
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
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Feature Categories Impact</h4>
                {Object.entries(categoryColors).map(([category, color]) => {
                  const categoryFeatures = aiData.filter(f => f.category === category)
                  const avgImportance = categoryFeatures.length > 0 ? 
                    categoryFeatures.reduce((sum, f) => sum + f.importance, 0) / categoryFeatures.length : 0
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-sm font-medium">{avgImportance.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Data Collection Recommendation
                </h4>
                <p className="text-xs text-yellow-700">
                  {modelInsights.topFeature.feature} is your strongest predictor. Focus on collecting more data in this area to improve model accuracy by 5-8%.
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
  // Calculate journey optimization insights
  const journeyInsights = useMemo(() => {
    const highestDropoff = markovData.reduce((max, stage) => 
      stage.dropoffProbability > max.dropoffProbability ? stage : max, markovData[0]);
    
    const highestConversionLift = markovData.reduce((max, stage, index) => {
      if (index === 0) return max;
      const conversionLift = stage.conversionProbability - markovData[index - 1].conversionProbability;
      return conversionLift > max.conversionLift ? { stage, conversionLift } : max;
    }, { stage: markovData[0], conversionLift: 0 });
    
    return {
      highestDropoff,
      highestConversionLift
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
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Final Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {markovData[markovData.length - 1]?.conversionProbability.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">Journey Efficiency</p>
            <p className="text-2xl font-bold text-blue-600">67.3%</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-500">Expected LTV</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(markovData.reduce((sum, stage) => sum + (stage.expectedValue || 0), 0))}
            </p>
          </div>
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
              {journeyInsights.highestConversionLift.stage.touchpoint} stage shows the highest conversion lift.
              Double down on tactics that drive progression to this stage.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// NEW: Recommendations Engine
const RecommendationsEngine = ({ crmData, mixData, shapleyData, aiData, markovData }) => {
  const [recommendations, setRecommendations] = useState([]);
  
  const generateRecommendations = useCallback(() => {
    // Calculate performance metrics for recommendations
    const currentMonth = mixData[mixData.length - 1];
    const previousMonth = mixData[mixData.length - 2];
    
    // Channel performance analysis
    const channelPerformance = shapleyData.map(channel => {
      const estimatedROAS = channel.revenue / (channel.conversions * 150); // Simplified calculation
      return {
        channel: channel.channel,
        revenue: channel.revenue,
        conversions: channel.conversions,
        roas: estimatedROAS,
        contribution: channel.contributionPercentage
      };
    }).sort((a, b) => b.roas - a.roas);
    
    // Seasonal trends analysis
    const monthlyTrends = mixData.map(month => ({
      month: month.month,
      efficiency: month.efficiency,
      roas: month.roas
    }));
    
    // Find best and worst performing months
    const bestMonth = [...monthlyTrends].sort((a, b) => b.roas - a.roas)[0];
    const worstMonth = [...monthlyTrends].sort((a, b) => a.roas - b.roas)[0];
    
    // Generate recommendations based on analysis
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
          "Implement A/B testing for creative assets in underperforming channel"
        ],
        priority: "high"
      },
      {
        id: 2,
        title: "Capitalize on Seasonal Trends",
        description: `Schedule major campaigns during ${bestMonth.month} when ROAS is ${bestMonth.roas.toFixed(2)}x compared to ${worstMonth.month}'s ${worstMonth.roas.toFixed(2)}x`,
        impact: "Potential 25-30% higher conversion rates during optimal months",
        confidence: 78,
        actions: [
          `Plan Q4 campaign launch for ${bestMonth.month}`,
          "Reduce spend during low-performance months by 15%",
          "Develop season-specific messaging and offers"
        ],
        priority: "medium"
      },
      {
        id: 3,
        title: "Improve Lead Scoring Data Quality",
        description: `Enhance data collection for ${aiData[aiData.length - 1].feature} which has low predictive power but high potential`,
        impact: "5-8% improvement in lead qualification accuracy",
        confidence: 72,
        actions: [
          `Add additional tracking for ${aiData[aiData.length - 1].feature} related behaviors`,
          "Implement progressive profiling forms",
          "Set up data validation rules for new entries"
        ],
        priority: "medium"
      },
      {
        id: 4,
        title: "Address Journey Drop-off Points",
        description: `Implement retargeting campaigns for the ${markovData.reduce((max, stage) => stage.dropoffProbability > max.dropoffProbability ? stage : markovData[0]).touchpoint} stage with ${markovData.reduce((max, stage) => stage.dropoffProbability > max.dropoffProbability ? stage : markovData[0]).dropoffProbability.toFixed(1)}% drop-off rate`,
        impact: "Potential 12-18% improvement in overall conversion rate",
        confidence: 80,
        actions: [
          "Create specific content for drop-off stage",
          "Set up automated email sequence for abandoned journeys",
          "Implement exit-intent popups with special offers"
        ],
        priority: "high"
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
              Total cost of acquiring a new customer, including all marketing and sales expenses divided by the number of customers acquired.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Customer Lifetime Value (LTV)</h4>
            <p className="text-xs text-gray-600 mt-1">
              Predicted net profit from the entire future relationship with a customer.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">LTV:CAC Ratio</h4>
            <p className="text-xs text-gray-600 mt-1">
              Ratio of lifetime value to acquisition cost. A ratio above 3:1 is generally considered healthy.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Return on Ad Spend (ROAS)</h4>
            <p className="text-xs text-gray-600 mt-1">
              Revenue generated for every dollar spent on advertising. Calculated as revenue divided by ad spend.
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
            <h4 className="font-semibold text-sm">First-Click Attribution</h4>
            <p className="text-xs text-gray-600 mt-1">
              Assigns 100% credit to the first touchpoint in the customer journey.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Last-Click Attribution</h4>
            <p className="text-xs text-gray-600 mt-1">
              Assigns 100% credit to the last touchpoint before conversion.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Shapley Value Attribution</h4>
            <p className="text-xs text-gray-600 mt-1">
              Game theory approach that fairly distributes credit based on each channel's marginal contribution across all possible combinations.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Markov Chain Attribution</h4>
            <p className="text-xs text-gray-600 mt-1">
              Uses probabilistic modeling to understand the likelihood of conversion and removal effect of each touchpoint.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            AI & Lead Scoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Predictive Power</h4>
            <p className="text-xs text-gray-600 mt-1">
              A feature's ability to predict conversion likelihood, calculated using importance, correlation, and data quality.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Feature Importance</h4>
            <p className="text-xs text-gray-600 mt-1">
              Statistical measure of how much a feature contributes to the model's prediction accuracy.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Behavioral Features</h4>
            <p className="text-xs text-gray-600 mt-1">
              User actions and engagement patterns: email opens, website visits, content downloads, demo requests.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Firmographic Features</h4>
            <p className="text-xs text-gray-600 mt-1">
              Company characteristics: size, industry, technology stack, budget indicators.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Demographic Features</h4>
            <p className="text-xs text-gray-600 mt-1">
              Individual characteristics: location, job title, seniority, social engagement.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Campaign Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Conversion Rate</h4>
            <p className="text-xs text-gray-600 mt-1">
              Percentage of visitors who complete a desired action (purchase, signup, etc.).
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Campaign Lift</h4>
            <p className="text-xs text-gray-600 mt-1">
              Performance improvement compared to a control group or baseline, expressed as a percentage.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Lead Efficiency</h4>
            <p className="text-xs text-gray-600 mt-1">
              Number of qualified leads generated per $1000 of marketing spend.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Marketing Mix Modeling (MMM)</h4>
            <p className="text-xs text-gray-600 mt-1">
              Statistical analysis technique that measures the impact of various marketing channels on sales outcomes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          Customer Journey Stages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-800">Awareness</h4>
            <p className="text-xs text-blue-700 mt-1">
              Customer becomes aware of your brand or product through various channels.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-sm text-green-800">Interest</h4>
            <p className="text-xs text-green-700 mt-1">
              Customer shows initial interest by engaging with content or visiting your website.
            </p>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-sm text-yellow-800">Consideration</h4>
            <p className="text-xs text-yellow-700 mt-1">
              Customer actively evaluates your solution against alternatives and competitors.
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-sm text-purple-800">Intent</h4>
            <p className="text-xs text-purple-700 mt-1">
              Customer demonstrates strong buying intent through actions like requesting demos or pricing.
            </p>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-sm text-red-800">Purchase</h4>
            <p className="text-xs text-red-700 mt-1">
              Customer completes the transaction and becomes a paying customer.
            </p>
          </div>
          
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-sm text-indigo-800">Retention</h4>
            <p className="text-xs text-indigo-700 mt-1">
              Post-purchase engagement, support, and efforts to maintain long-term customer relationship.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-teal-600" />
          Statistical Methods & Formulas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Shapley Value Calculation</h4>
            <p className="text-xs text-gray-600 mb-2">
              For each marketing channel, calculate its average marginal contribution across all possible coalitions:
            </p>
            <code className="text-xs bg-white p-2 rounded border block">
              φᵢ(v) = Σ [|S|!(n-|S|-1)!/n!] × [v(S∪&#123;i&#125;) - v(S)]
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Where S is a subset of channels not containing i, and v(S) is the value function.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Lead Score Formula</h4>
            <p className="text-xs text-gray-600 mb-2">
              Weighted sum of feature scores based on their predictive importance:
            </p>
            <code className="text-xs bg-white p-2 rounded border block">
              Lead Score = Σ (Feature Value × Feature Weight × Data Quality)
            </code>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Markov Transition Probability</h4>
            <p className="text-xs text-gray-600 mb-2">
              Probability of moving from one journey stage to another:
            </p>
            <code className="text-xs bg-white p-2 rounded border block">
              P(j|i) = Number of transitions from i to j / Total transitions from i
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Export Data Function
const exportCSV = (data, filename) => {
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

// Main CRM Dashboard
export default function CRMDashboard() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [activeTab, setActiveTab] = useState('overview')
  
  // This would be replaced with: import { generateFakeData } from '@/lib/fakeData'
  const data = useMemo(() => generateFakeData(), [])
  const { crmData, mixData, shapleyData, aiData, markovData } = data

  const handleExport = useCallback(() => {
    exportCSV(crmData, 'crm_attribution_data.csv')
  }, [crmData])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM & Marketing Attribution</h1>
            <p className="text-gray-600 text-lg">
              Advanced attribution modeling, AI-powered lead scoring, and campaign optimization
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-36"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-36"
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attribution Model Comparison</CardTitle>
                  <CardDescription>Revenue attribution across different modeling approaches</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Model</TableHead>
                        <TableHead>Paid Search</TableHead>
                        <TableHead>Social</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Organic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>First-Click</TableCell>
                        <TableCell>35%</TableCell>
                        <TableCell>25%</TableCell>
                        <TableCell>15%</TableCell>
                        <TableCell>25%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last-Click</TableCell>
                        <TableCell>45%</TableCell>
                        <TableCell>20%</TableCell>
                        <TableCell>20%</TableCell>
                        <TableCell>15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Shapley Value</TableCell>
                        <TableCell className="font-medium">38%</TableCell>
                        <TableCell className="font-medium">23%</TableCell>
                        <TableCell className="font-medium">22%</TableCell>
                        <TableCell className="font-medium">17%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attribution Accuracy Comparison</CardTitle>
                  <CardDescription>Model performance vs traditional methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Shapley Value</span>
                      <Badge variant="default">94.2% Accurate</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Markov Chain</span>
                      <Badge variant="default">89.1% Accurate</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Linear Attribution</span>
                      <Badge variant="secondary">73.6% Accurate</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Last-Click</span>
                      <Badge variant="destructive">67.0% Accurate</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    { name: 'Facebook Ads', status: 'Connected', type: 'Advertising', records: 8745 },
                    { name: 'LinkedIn Ads', status: 'Pending', type: 'Advertising', records: 0 },
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
    </div>
  )
}