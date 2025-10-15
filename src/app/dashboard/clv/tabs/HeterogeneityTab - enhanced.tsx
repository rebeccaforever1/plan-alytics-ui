'use client'

import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ReferenceLine,
  ComposedChart,
  BarChart,
} from 'recharts'
import { AlertCircle, TrendingUp, Users, Target, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { 
  generateHeterogeneityKPIs,
  generateExecutiveSummary,
  generateCohortAnalysisData,
  generateParetoAnalysisData
} from '@/lib/fakeData'

// ————————————————————————
// InfoBox Component for contextual help
// ————————————————————————
const InfoBox = ({ title, children, variant = 'default' }: { title: string; children: React.ReactNode; variant?: 'default' | 'action' | 'insight' }) => {
  const colors = {
    default: 'bg-blue-50 border-blue-200 text-blue-900',
    action: 'bg-green-50 border-green-200 text-green-900',
    insight: 'bg-purple-50 border-purple-200 text-purple-900'
  };

  const icons = {
    default: <Info className="h-5 w-5 text-blue-600" />,
    action: <Target className="h-5 w-5 text-green-600" />,
    insight: <TrendingUp className="h-5 w-5 text-purple-600" />
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[variant]}`}>
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">{icons[variant]}</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ————————————————————————
// Executive Summary & Key Insights
// ————————————————————————
const ExecutiveSummary = ({ clvData, modelData }: { clvData: any[]; modelData: any }) => {
  const insights = generateExecutiveSummary(clvData, modelData);

  const priorityColor = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  // Determine action recommendations based on metrics
  const getActionableInsights = () => {
    const actions = [];
    
    if (insights.heterogeneityScore > 70) {
      actions.push({
        title: "Implement Tiered Service Levels",
        description: "Your high variance suggests significant differences in customer value. Create premium and standard service tiers to optimize resource allocation."
      });
    }
    
    if (insights.top20Share > 80) {
      actions.push({
        title: "High-Value Customer Retention Program",
        description: "80% of your revenue comes from 20% of customers. Implement dedicated account management and proactive retention strategies for this segment."
      });
    } else {
      actions.push({
        title: "Balanced Growth Strategy",
        description: "Your value is well-distributed. Focus on scaling customer acquisition while maintaining service quality across all segments."
      });
    }
    
    actions.push({
      title: "Segment-Specific Marketing",
      description: "Tailor messaging and offers to different value segments. High-value customers respond to premium features, while others may prefer volume discounts."
    });
    
    return actions;
  };

  const actions = getActionableInsights();

  return (
    <>
      {/* What This Means Section */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Customer Heterogeneity</CardTitle>
          <CardDescription>What this analysis tells you about your customer base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoBox title="What is Customer Heterogeneity?" variant="default">
            <p>Heterogeneity measures how different your customers are from each other in terms of their value to your business. High heterogeneity means you have some very valuable customers and many less valuable ones. Low heterogeneity means most customers contribute similarly.</p>
          </InfoBox>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-700">{insights.heterogeneityScore}</div>
              <div className="text-sm font-medium text-indigo-900 mt-1">Heterogeneity Score</div>
              <div className="text-xs text-indigo-700 mt-2">
                {insights.heterogeneityScore > 70 ? 'High variance - diverse customer base' : 
                 insights.heterogeneityScore > 40 ? 'Moderate variance - mixed customer base' : 
                 'Low variance - similar customers'}
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-700">{insights.top20Share}%</div>
              <div className="text-sm font-medium text-purple-900 mt-1">Top 20% Value Share</div>
              <div className="text-xs text-purple-700 mt-2">
                Percentage of total value from your best customers
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{formatCurrency(insights.avgCLV)}</div>
              <div className="text-sm font-medium text-blue-900 mt-1">Average CLV</div>
              <div className="text-xs text-blue-700 mt-2">
                Mean customer lifetime value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights from Your Data</CardTitle>
          <CardDescription>What these numbers mean for your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Badge variant="secondary" className="mt-1">1</Badge>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Value Concentration</div>
                <div className="text-sm text-gray-700 mt-1">
                  {insights.top20Share}% of your revenue comes from just 20% of your customers.
                </div>
                <div className="text-sm text-gray-600 mt-2 italic">
                  <strong>Why this matters:</strong> {insights.top20Share > 80 
                    ? 'You have high concentration risk. If you lose a few top customers, it significantly impacts revenue. Prioritize retention for this segment.'
                    : 'Your revenue is more balanced across customers, reducing risk from any single customer churning.'}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Badge variant="secondary" className="mt-1">2</Badge>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Customer Segmentation Opportunity</div>
                <div className="text-sm text-gray-700 mt-1">
                  Your heterogeneity score of {insights.heterogeneityScore} indicates {
                    insights.heterogeneityScore > 70 ? 'strong differences' : 
                    insights.heterogeneityScore > 40 ? 'moderate differences' : 
                    'similar profiles'
                  } between customer segments.
                </div>
                <div className="text-sm text-gray-600 mt-2 italic">
                  <strong>Why this matters:</strong> {insights.heterogeneityScore > 70
                    ? 'Different customers need different treatment. One-size-fits-all strategies will underserve your best customers and overspend on others.'
                    : 'Your customers are relatively similar, so broad strategies can work well across your base.'}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Badge variant="secondary" className="mt-1">3</Badge>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Risk & Opportunity Assessment</div>
                <div className="text-sm text-gray-700 mt-1">
                  {insights.top20Share > 80
                    ? 'High dependency on a small group of top customers creates vulnerability.'
                    : 'Balanced distribution provides stability but may indicate untapped premium segment potential.'}
                </div>
                <div className="text-sm text-gray-600 mt-2 italic">
                  <strong>Why this matters:</strong> Understanding concentration helps you balance growth (acquiring new customers) vs. retention (keeping valuable ones).
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Recommended Actions
          </CardTitle>
          <CardDescription>Specific steps you can take based on this analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, idx) => (
            <InfoBox key={idx} title={action.title} variant="action">
              {action.description}
            </InfoBox>
          ))}
          
          <div className={`p-4 rounded-lg border mt-4 ${priorityColor[insights.priority]}`}>
            <div className="font-medium mb-1 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Priority Recommendation
            </div>
            <div className="text-sm">{insights.recommendation}</div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ————————————————————————
// CLVHeterogeneityChart
// ————————————————————————
const CLVHeterogeneityChart = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer Value Distribution</CardTitle>
      <CardDescription>How customer lifetime values are spread across your base</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <InfoBox title="How to Read This Chart" variant="default">
        The bars show how many customers fall into each value range. The curved line shows the statistical model fit. 
        A long tail to the right means you have a few very high-value customers, while most are clustered at lower values.
      </InfoBox>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={modelData.valueDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="value" 
              label={{ value: 'Customer Lifetime Value', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: 'Number of Customers', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'density' ? `${value} customers` : value.toFixed(2),
                name === 'density' ? 'Count' : 'Model Fit'
              ]}
            />
            <Legend />
            <Bar dataKey="density" fill="#8884d8" name="Customer Count" />
            <Line type="monotone" dataKey="gamma" stroke="#ff7300" dot={false} name="Statistical Model" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <InfoBox title="What This Pattern Means" variant="insight">
        {modelData.valueDistribution && modelData.valueDistribution.length > 0 ? (
          <>The shape of this distribution reveals your customer structure. A steep drop-off indicates most customers are similar in value, while a gradual slope suggests more variety in customer worth.</>
        ) : (
          <>This visualization shows the spread of customer values in your base.</>
        )}
      </InfoBox>
    </CardContent>
  </Card>
)

// ————————————————————————
// ProbabilisticModels
// ————————————————————————
const ProbabilisticModels = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Predictive Model Parameters</CardTitle>
      <CardDescription>
        Statistical models that forecast customer behavior
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <InfoBox title="What Are These Models?" variant="default">
        <p className="mb-2">We use two industry-standard models to predict customer lifetime value:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>BG/NBD Model:</strong> Predicts how often customers will purchase and when they might churn</li>
          <li><strong>Gamma-Gamma Model:</strong> Estimates how much customers will spend per transaction</li>
        </ul>
        <p className="mt-2">Together, these models create a comprehensive picture of future customer value.</p>
      </InfoBox>

      {/* Parameter Tiles */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">BG/NBD Model Parameters (Purchase Behavior)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
            <p className="text-xs text-gray-600 mb-1">r (frequency shape)</p>
            <p className="text-xl font-bold text-indigo-700">
              {modelData?.bgnbdParams?.r?.toFixed(3) ?? '—'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
            <p className="text-xs text-gray-600 mb-1">α (frequency scale)</p>
            <p className="text-xl font-bold text-indigo-700">
              {modelData?.bgnbdParams?.alpha?.toFixed(3) ?? '—'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
            <p className="text-xs text-gray-600 mb-1">a (dropout shape)</p>
            <p className="text-xl font-bold text-indigo-700">
              {modelData?.bgnbdParams?.a?.toFixed(3) ?? '—'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
            <p className="text-xs text-gray-600 mb-1">b (dropout scale)</p>
            <p className="text-xl font-bold text-indigo-700">
              {modelData?.bgnbdParams?.b?.toFixed(3) ?? '—'}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">
          These parameters describe the patterns in how often customers buy (r, α) and how likely they are to stop buying (a, b).
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Gamma-Gamma Model Parameters (Spending Behavior)</h4>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <p className="text-xs text-gray-600 mb-1">p (shape)</p>
            <p className="text-xl font-bold text-purple-700">
              {modelData?.ggParams?.p?.toFixed(3) ?? '—'}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <p className="text-xs text-gray-600 mb-1">q (scale)</p>
            <p className="text-xl font-bold text-purple-700">
              {modelData?.ggParams?.q?.toFixed(3) ?? '—'}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <p className="text-xs text-gray-600 mb-1">γ (variance)</p>
            <p className="text-xl font-bold text-purple-700">
              {modelData?.ggParams?.gamma?.toFixed(3) ?? '—'}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">
          These parameters capture the variation in how much different customers spend per transaction.
        </p>
      </div>

      <InfoBox title="Why These Models Matter" variant="insight">
        Unlike simple averages, these probabilistic models account for individual customer differences. They help predict:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Which customers are likely to make their next purchase soon</li>
          <li>Which customers may have already churned (even if they haven't told you)</li>
          <li>Expected future spend for each customer segment</li>
        </ul>
        This enables targeted retention campaigns and accurate revenue forecasting.
      </InfoBox>
    </CardContent>
  </Card>
)

// ————————————————————————
// CohortAnalysis
// ————————————————————————
const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohorts = generateCohortAnalysisData(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Performance Analysis</CardTitle>
        <CardDescription>How different customer groups perform over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoBox title="Understanding Cohorts" variant="default">
          Cohorts are groups of customers who signed up in the same time period. Comparing cohorts helps you understand if your customer quality is improving over time and which acquisition periods produced the most valuable customers.
        </InfoBox>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohorts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgClv" fill="#4f46e5" name="Average CLV ($)" />
              <Bar dataKey="retention" fill="#10b981" name="Retention Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <InfoBox title="What to Look For" variant="insight">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Rising CLV over time:</strong> Your product or targeting is improving</li>
            <li><strong>Falling CLV over time:</strong> May indicate market saturation or declining product-market fit</li>
            <li><strong>Consistent patterns:</strong> Shows predictable business performance</li>
          </ul>
        </InfoBox>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// ParetoAnalysis
// ————————————————————————
const ParetoAnalysis = ({ data }: { data: any[] }) => {
  const paretoData = generateParetoAnalysisData(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Analysis (80/20 Rule)</CardTitle>
        <CardDescription>Cumulative value contribution by customer rank</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoBox title="The 80/20 Rule" variant="default">
          The Pareto Principle suggests that roughly 80% of effects come from 20% of causes. In business, this often means a small portion of customers drive most of your revenue. This chart shows your actual ratio.
        </InfoBox>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rank" label={{ value: 'Customer Percentile', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Value Contribution', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2} name="Cumulative % of Revenue" />
              <Bar dataKey="clv" fill="#cbd5e1" name="Individual CLV" />
              <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" label="80% Line" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <InfoBox title="How to Use This Chart" variant="action">
          <p className="mb-2">Look at where the line crosses the 80% mark (red dashed line):</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Crosses before 20%:</strong> High concentration - focus intensely on retaining top customers</li>
            <li><strong>Crosses around 20%:</strong> Classic Pareto pattern - balance retention and acquisition</li>
            <li><strong>Crosses after 20%:</strong> More distributed value - broad strategies may work better</li>
          </ul>
        </InfoBox>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// HeterogeneityTab (default export)
// ————————————————————————
function HeterogeneityTab({ clvData, modelData }: { clvData: any[]; modelData: any }) {
  return (
    <div className="space-y-8">
      <ExecutiveSummary clvData={clvData} modelData={modelData} />
      <CLVHeterogeneityChart modelData={modelData} />
      <ProbabilisticModels modelData={modelData} />
      <CohortAnalysis data={clvData} />
      <ParetoAnalysis data={clvData} />
    </div>
  )
}

export default HeterogeneityTab