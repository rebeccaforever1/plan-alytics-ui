'use client'

import React from 'react'
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
import { AlertTriangle, TrendingUp, Target, Zap, Users, DollarSign, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { 
  generateHeterogeneityKPIs,
  generateExecutiveSummary,
  generateCohortAnalysisData,
  generateParetoAnalysisData
} from '@/lib/fakeData'

// ————————————————————————
//  Stats Header - 
// ————————————————————————
const QuickStats = ({ clvData, modelData }: { clvData: any[]; modelData: any }) => {
  const insights = generateExecutiveSummary(clvData, modelData);
  
  const getHeterogeneityLevel = (score: number) => {
    if (score > 70) return { label: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (score > 40) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const level = getHeterogeneityLevel(insights.heterogeneityScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className={`border-l-4 border-l-blue-500`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heterogeneity</p>
              <p className={`text-2xl font-bold ${level.color}`}>
                {insights.heterogeneityScore}
              </p>
              <p className="text-xs text-gray-500">{level.label} Variance</p>
            </div>
            <TrendingUp className={`h-8 w-8 ${level.color} opacity-60`} />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-l-4 border-l-purple-500`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top 20% Share</p>
              <p className="text-2xl font-bold text-purple-600">
                {insights.top20Share}%
              </p>
              <p className="text-xs text-gray-500">of total value</p>
            </div>
            <Users className="h-8 w-8 text-purple-600 opacity-60" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-l-4 border-l-green-500`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg CLV</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(insights.avgCLV)}
              </p>
              <p className="text-xs text-gray-500">per customer</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600 opacity-60" />
          </div>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${level.border}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Priority</p>
              <p className={`text-lg font-bold ${level.color} uppercase`}>
                {insights.priority}
              </p>
              <p className="text-xs text-gray-500">Action needed</p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${level.color} opacity-60`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ————————————————————————
// Executive Summary - VISUAL & SCANNABLE
// ————————————————————————
const ExecutiveSummary = ({ clvData, modelData }: { clvData: any[]; modelData: any }) => {
  const insights = generateExecutiveSummary(clvData, modelData);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-blue-600" />
          Insights & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Quick Insights */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Key Insights
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Badge variant="secondary" className="mt-0.5">1</Badge>
                <div>
                  <div className="font-medium text-sm">Value Concentration</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <strong>{insights.top20Share}%</strong> of revenue from top 20% of customers
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Badge variant="secondary" className="mt-0.5">2</Badge>
                <div>
                  <div className="font-medium text-sm">Customer Diversity</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {insights.heterogeneityScore > 70 ? 'High' : 
                     insights.heterogeneityScore > 40 ? 'Medium' : 'Low'} variance in customer values
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Badge variant="secondary" className="mt-0.5">3</Badge>
                <div>
                  <div className="font-medium text-sm">Risk Level</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {insights.top20Share > 80 ? 'High concentration risk' : 'Balanced distribution'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Recommended Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Recommended Actions
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold text-sm text-gray-1000">1. Tiered Service Levels</div>
                <div className="text-xs text-gray-700 mt-1">
                  Create premium vs standard service tiers based on customer value
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="font-semibold text-sm text-gray-1000">2. Strategic Retention Focus</div>
                <div className="text-xs text-gray-700 mt-1">
                  {insights.top20Share > 80 
                    ? 'Protect top 20% with dedicated account management'
                    : 'Balance retention across value segments'}
                </div>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="font-semibold text-sm text-gray-1000">3. Segmented Marketing</div>
                <div className="text-xs text-gray-700 mt-1">
                  Tailor messaging and offers to different value segments
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ————————————————————————
// CLVHeterogeneityChart
// ————————————————————————
const CLVHeterogeneityChart = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg">Customer Value Distribution</CardTitle>
      <CardDescription>How customer lifetime values are spread across your base</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={modelData.valueDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="density" fill="#8884d8" name="Customer Count" />
            <Line type="monotone" dataKey="gamma" stroke="#ff7300" dot={false} name="Model Fit" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)




// ————————————————————————
// ProbabilisticModels - revised 10/15/25 to include definitions
// ————————————————————————
const ProbabilisticModels = ({ modelData }: { modelData: any }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg">CLV Model Components</CardTitle>
      <CardDescription>  Parameters that describe how often customers buy, how long they stay active, and how much they spend. </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Parameter Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
          <p className="text-s text-gray-600 mb-1">BG/NBD r</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.r?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
          <p className="text-s text-gray-600 mb-1">BG/NBD α</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.alpha?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
          <p className="text-s text-gray-600 mb-1">BG/NBD a</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.a?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
          <p className="text-s text-gray-600 mb-1">BG/NBD b</p>
          <p className="text-lg font-bold text-indigo-700">
            {modelData?.bgnbdParams?.b?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <p className="text-s text-gray-600 mb-1">Gamma p</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.p?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <p className="text-s text-gray-600 mb-1">Gamma q</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.q?.toFixed(3) ?? '—'}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <p className="text-s text-gray-600 mb-1">Gamma γ</p>
          <p className="text-lg font-bold text-purple-700">
            {modelData?.ggParams?.gamma?.toFixed(3) ?? '—'}
          </p>
        </div>
      </div>

      {/* Quick Interpretation */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-gray-800 leading-relaxed">
            <strong>BG/NBD</strong> parameters (<em>r, α, a, b</em>) capture purchase frequency and customer retention. 
            <strong> Gamma–Gamma</strong> parameters (<em>p, q, γ</em>) reflect spending patterns. 
            Together, they form the <strong>CLV model</strong>, estimating both customer activity and value over time.
         
         
          </div>
        </div>
         <p className="text-xs text-gray-600 italic mt-2 ml-6">
    BG/NBD patterns: r near 1 with moderate α (3–6) suggests stable repeat purchase behavior; 
    lower a and higher b indicate gradual churn rather than sudden drop-off. 
   <p> For Gamma–Gamma, higher p and q (&gt;4) reflect consistent spending across customers, while 
    γ sets the overall spend level.
    </p>
  </p>
      </div>




    </CardContent>
  </Card>
)


// ————————————————————————
// ParetoAnalysis -  
// ————————————————————————
const ParetoAnalysis = ({ data }: { data: any[] }) => {
  const paretoData = generateParetoAnalysisData(data);

  return (
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-lg">Pareto Analysis</CardTitle>
    <CardDescription>Value concentration across customer segments</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={paretoData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rank"
            type="number"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "Customer Percentile", position: "insideBottom", offset: -4 }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            domain={[0, 100]} 
            label={{ value: "Cumulative % of CLV", angle: -90, position: "insideLeft" }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: "Individual CLV", angle: -90, position: "insideRight" }} 
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="right" dataKey="clv" fill="#cbd5e1" name="Individual CLV" />
          <Line yAxisId="left" type="monotone" dataKey="cumulative" stroke="#4f46e5" strokeWidth={2} name="Cumulative %" dot={false} />
          <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" yAxisId="left" label="80%" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
    <p className="text-xs text-gray-600 italic mt-2">
      The Pareto curve shows the share of total CLV contributed by top customer segments.
      <p> For example, if 20% of customers account for ~75% of CLV, your base is highly value-concentrated.</p>
    </p>
  </CardContent>
</Card>
  )
}

// ————————————————————————
// HeterogeneityTab (default export)
// ————————————————————————
function HeterogeneityTab({ clvData, modelData }: { clvData: any[]; modelData: any }) {
  return (
    <div className="space-y-6">
      {/* TOP: Quick Stats -  SCANNABLE */}
      <QuickStats clvData={clvData} modelData={modelData} />
      
      {/* MIDDLE: Charts -  VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <CLVHeterogeneityChart modelData={modelData} />
        <ParetoAnalysis data={clvData} />
      </div>

      {/* BOTTOM: Insights & Actions -  */}
      <ExecutiveSummary clvData={clvData} modelData={modelData} />

      {/* Additional charts below */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ProbabilisticModels modelData={modelData} />
 
      </div>
    </div>
  )
}

export default HeterogeneityTab