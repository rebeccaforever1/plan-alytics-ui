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
import { generateFakeCustomers, generateCohortData } from '@/lib/fakeData'
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

const metricLabels: Record<string, string> = {
  value: 'Customer Lifetime Value (CLV)',
  revenue: 'Revenue',
  mrr: 'Monthly Recurring Revenue',
  customers: 'Customer Count',
  retention: 'Retention Rate',
  churn: 'Churn Rate',
}

const calculateMean = (values: number[]) =>
  values.reduce((acc, val) => acc + val, 0) / values.length

const calculateStandardDeviation = (values: number[]) => {
  const mean = calculateMean(values)
  const squareDiffs = values.map(value => Math.pow(value - mean, 2))
  return Math.sqrt(calculateMean(squareDiffs))
}

const calculateTrend = (values: number[]) => {
  if (values.length < 2) return 0
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  return ((lastValue - firstValue) / firstValue) * 100
}

const formatTimeLabel = (index: number, timeframe: string) => {
  if (timeframe === 'daily') return `Day ${index + 1}`
  if (timeframe === 'monthly') return `Month ${index + 1}`
  return `Week ${index + 1}`
}

// Generate forecast data for segment projections
const generateForecastData = () => {
  return {
    segmentProjections: [
      {
        segment: 'Platinum',
        current: 180,
        projected: 195,
        growth: 8.3,
        risk: 'Low'
      },
      {
        segment: 'Gold',
        current: 420,
        projected: 445,
        growth: 5.9,
        risk: 'Medium'
      },
      {
        segment: 'Silver',
        current: 550,
        projected: 485,
        growth: -11.8,
        risk: 'High'
      },
      {
        segment: 'Power Users',
        current: 320,
        projected: 340,
        growth: 6.3,
        risk: 'Low'
      },
      {
        segment: 'Loyalists',
        current: 420,
        projected: 435,
        growth: 3.6,
        risk: 'Low'
      },
      {
        segment: 'Established',
        current: 580,
        projected: 520,
        growth: -10.3,
        risk: 'Critical'
      }
    ]
  }
}

// Enhanced segment structure with sub-segments and stratified retention
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
        },
        {
          id: 'silver',
          name: 'Silver Tier',
          totalCustomers: 550,
          avgMrr: 98,
          avgClv: 1850,
          retentionRate: 72,
          subSegments: [
            {
              id: 'silver-high-risk',
              name: 'High Risk Silver',
              riskLevel: 'high' as const,
              customers: 165,
              churnRisk: 85,
              predictedChurn: 140,
              avgMrr: 85,
              recommendedEffort: 'light' as const,
              intervention: 'winback_offer',
              effortCost: 'low' as const,
              expectedImpact: '40% retention boost'
            },
            {
              id: 'silver-medium-risk',
              name: 'Medium Risk Silver',
              riskLevel: 'medium' as const,
              customers: 220,
              churnRisk: 45,
              predictedChurn: 99,
              avgMrr: 100,
              recommendedEffort: 'minimal' as const,
              intervention: 'educational_content',
              effortCost: 'very-low' as const,
              expectedImpact: '30% retention boost'
            },
            {
              id: 'silver-low-risk',
              name: 'Low Risk Silver',
              riskLevel: 'low' as const,
              customers: 165,
              churnRisk: 18,
              predictedChurn: 30,
              avgMrr: 105,
              recommendedEffort: 'minimal' as const,
              intervention: 'automated_checkin',
              effortCost: 'very-low' as const,
              expectedImpact: '80% retention rate'
            }
          ]
        }
      ]
    },
    'tenure-based': {
      name: 'Tenure-based Segments',
      description: 'Segmented by customer longevity',
      segments: [
        {
          id: 'loyalists',
          name: 'Loyalists (2+ years)',
          totalCustomers: 420,
          avgMrr: 325,
          avgClv: 6800,
          retentionRate: 92,
          subSegments: [
            {
              id: 'loyalists-high-risk',
              name: 'High Risk Loyalists',
              riskLevel: 'high' as const,
              customers: 42,
              churnRisk: 65,
              predictedChurn: 27,
              avgMrr: 340,
              recommendedEffort: 'moderate' as const,
              intervention: 'loyalty_reward',
              effortCost: 'medium' as const,
              expectedImpact: '75% retention boost'
            },
            {
              id: 'loyalists-medium-risk',
              name: 'Medium Risk Loyalists',
              riskLevel: 'medium' as const,
              customers: 168,
              churnRisk: 35,
              predictedChurn: 59,
              avgMrr: 320,
              recommendedEffort: 'light' as const,
              intervention: 'proactive_checkin',
              effortCost: 'low' as const,
              expectedImpact: '60% retention boost'
            },
            {
              id: 'loyalists-low-risk',
              name: 'Low Risk Loyalists',
              riskLevel: 'low' as const,
              customers: 210,
              churnRisk: 12,
              predictedChurn: 25,
              avgMrr: 315,
              recommendedEffort: 'minimal' as const,
              intervention: 'newsletter',
              effortCost: 'very-low' as const,
              expectedImpact: '95% retention rate'
            }
          ]
        },
        {
          id: 'established',
          name: 'Established (1-2 years)',
          totalCustomers: 580,
          avgMrr: 185,
          avgClv: 3200,
          retentionRate: 82,
          subSegments: [
            {
              id: 'established-high-risk',
              name: 'High Risk Established',
              riskLevel: 'high' as const,
              customers: 116,
              churnRisk: 55,
              predictedChurn: 64,
              avgMrr: 170,
              recommendedEffort: 'moderate' as const,
              intervention: 'personalized_offer',
              effortCost: 'medium' as const,
              expectedImpact: '60% retention boost'
            },
            {
              id: 'established-medium-risk',
              name: 'Medium Risk Established',
              riskLevel: 'medium' as const,
              customers: 232,
              churnRisk: 30,
              predictedChurn: 70,
              avgMrr: 190,
              recommendedEffort: 'light' as const,
              intervention: 'targeted_email',
              effortCost: 'low' as const,
              expectedImpact: '45% retention boost'
            },
            {
              id: 'established-low-risk',
              name: 'Low Risk Established',
              riskLevel: 'low' as const,
              customers: 232,
              churnRisk: 15,
              predictedChurn: 35,
              avgMrr: 195,
              recommendedEffort: 'minimal' as const,
              intervention: 'newsletter',
              effortCost: 'very-low' as const,
              expectedImpact: '85% retention rate'
            }
          ]
        }
      ]
    },
    'geography-based': {
      name: 'Geography-based Segments',
      description: 'Segmented by geographic location',
      segments: [
        {
          id: 'north-america',
          name: 'North America',
          totalCustomers: 650,
          avgMrr: 285,
          avgClv: 5200,
          retentionRate: 88,
          subSegments: [
            {
              id: 'na-high-risk',
              name: 'High Risk NA',
              riskLevel: 'high' as const,
              customers: 98,
              churnRisk: 60,
              predictedChurn: 59,
              avgMrr: 270,
              recommendedEffort: 'moderate' as const,
              intervention: 'localized_support',
              effortCost: 'medium' as const,
              expectedImpact: '65% retention boost'
            },
            {
              id: 'na-medium-risk',
              name: 'Medium Risk NA',
              riskLevel: 'medium' as const,
              customers: 260,
              churnRisk: 35,
              predictedChurn: 91,
              avgMrr: 290,
              recommendedEffort: 'light' as const,
              intervention: 'regional_offer',
              effortCost: 'low' as const,
              expectedImpact: '50% retention boost'
            },
            {
              id: 'na-low-risk',
              name: 'Low Risk NA',
              riskLevel: 'low' as const,
              customers: 292,
              churnRisk: 12,
              predictedChurn: 35,
              avgMrr: 295,
              recommendedEffort: 'minimal' as const,
              intervention: 'newsletter',
              effortCost: 'very-low' as const,
              expectedImpact: '90% retention rate'
            }
          ]
        },
        {
          id: 'europe',
          name: 'Europe',
          totalCustomers: 420,
          avgMrr: 195,
          avgClv: 3800,
          retentionRate: 82,
          subSegments: [
            {
              id: 'eu-high-risk',
              name: 'High Risk Europe',
              riskLevel: 'high' as const,
              customers: 63,
              churnRisk: 58,
              predictedChurn: 37,
              avgMrr: 180,
              recommendedEffort: 'moderate' as const,
              intervention: 'multi_lingual',
              effortCost: 'medium' as const,
              expectedImpact: '60% retention boost'
            },
            {
              id: 'eu-medium-risk',
              name: 'Medium Risk Europe',
              riskLevel: 'medium' as const,
              customers: 168,
              churnRisk: 32,
              predictedChurn: 54,
              avgMrr: 200,
              recommendedEffort: 'light' as const,
              intervention: 'localized_content',
              effortCost: 'low' as const,
              expectedImpact: '48% retention boost'
            },
            {
              id: 'eu-low-risk',
              name: 'Low Risk Europe',
              riskLevel: 'low' as const,
              customers: 189,
              churnRisk: 10,
              predictedChurn: 19,
              avgMrr: 205,
              recommendedEffort: 'minimal' as const,
              intervention: 'newsletter',
              effortCost: 'very-low' as const,
              expectedImpact: '88% retention rate'
            }
          ]
        },
        {
          id: 'asia-pacific',
          name: 'Asia Pacific',
          totalCustomers: 280,
          avgMrr: 85,
          avgClv: 1800,
          retentionRate: 65,
          subSegments: [
            {
              id: 'ap-high-risk',
              name: 'High Risk APAC',
              riskLevel: 'high' as const,
              customers: 70,
              churnRisk: 75,
              predictedChurn: 53,
              avgMrr: 75,
              recommendedEffort: 'moderate' as const,
              intervention: 'price_adjustment',
              effortCost: 'medium' as const,
              expectedImpact: '55% retention boost'
            },
            {
              id: 'ap-medium-risk',
              name: 'Medium Risk APAC',
              riskLevel: 'medium' as const,
              customers: 112,
              churnRisk: 40,
              predictedChurn: 45,
              avgMrr: 90,
              recommendedEffort: 'light' as const,
              intervention: 'localized_support',
              effortCost: 'low' as const,
              expectedImpact: '42% retention boost'
            },
            {
              id: 'ap-low-risk',
              name: 'Low Risk APAC',
              riskLevel: 'low' as const,
              customers: 98,
              churnRisk: 18,
              predictedChurn: 18,
              avgMrr: 95,
              recommendedEffort: 'minimal' as const,
              intervention: 'educational_content',
              effortCost: 'very-low' as const,
              expectedImpact: '78% retention rate'
            }
          ]
        }
      ]
    },
    'usage-based': {
      name: 'Usage-based Segments',
      description: 'Segmented by product usage patterns and engagement levels',
      segments: [
        {
          id: 'power-users',
          name: 'Power Users',
          totalCustomers: 320,
          avgMrr: 412,
          avgClv: 7200,
          retentionRate: 94,
          subSegments: [
            {
              id: 'power-declining',
              name: 'Declining Power Users',
              riskLevel: 'high' as const,
              customers: 32,
              churnRisk: 78,
              predictedChurn: 25,
              avgMrr: 395,
              recommendedEffort: 'intensive' as const,
              intervention: 'feature_training',
              effortCost: 'high' as const,
              expectedImpact: '75% retention boost'
            },
            {
              id: 'power-stable',
              name: 'Stable Power Users',
              riskLevel: 'low' as const,
              customers: 256,
              churnRisk: 8,
              predictedChurn: 20,
              avgMrr: 420,
              recommendedEffort: 'light' as const,
              intervention: 'beta_access',
              effortCost: 'low' as const,
              expectedImpact: '96% retention rate'
            },
            {
              id: 'power-growing',
              name: 'Growing Power Users',
              riskLevel: 'medium' as const,
              customers: 32,
              churnRisk: 25,
              predictedChurn: 8,
              avgMrr: 430,
              recommendedEffort: 'moderate' as const,
              intervention: 'upsell_opportunity',
              effortCost: 'medium' as const,
              expectedImpact: '85% retention boost'
            }
          ]
        }
      ]
    }
  }
}

// Detailed intervention strategies with effort levels
const interventionStrategies = {
  executive_outreach: {
    name: 'Executive Outreach',
    effort: 'intensive' as const,
    cost: 'high' as const,
    action: 'C-level executive personal contact',
    channel: 'Phone + Personal Meeting',
    frequency: 'Weekly',
    team: 'Executive Team',
    costPerCustomer: 250,
    expectedSuccess: 85
  },
  priority_support: {
    name: 'Priority Support',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Dedicated account manager',
    channel: 'Email + Scheduled Calls',
    frequency: 'Bi-weekly',
    team: 'Customer Success',
    costPerCustomer: 120,
    expectedSuccess: 78
  },
  proactive_checkin: {
    name: 'Proactive Check-in',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Regular success check-ins',
    channel: 'Email + In-app',
    frequency: 'Monthly',
    team: 'Automated + CS',
    costPerCustomer: 35,
    expectedSuccess: 92
  },
  personalized_offer: {
    name: 'Personalized Offer',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Custom discount or feature bundle',
    channel: 'Email + Personal Call',
    frequency: 'One-time',
    team: 'Sales + Marketing',
    costPerCustomer: 85,
    expectedSuccess: 72
  },
  targeted_email: {
    name: 'Targeted Email',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Personalized email campaign',
    channel: 'Email',
    frequency: 'Weekly for 4 weeks',
    team: 'Marketing Automation',
    costPerCustomer: 15,
    expectedSuccess: 65
  },
  newsletter: {
    name: 'Newsletter',
    effort: 'minimal' as const,
    cost: 'very-low' as const,
    action: 'Regular educational content',
    channel: 'Email',
    frequency: 'Monthly',
    team: 'Marketing',
    costPerCustomer: 5,
    expectedSuccess: 55
  },
  winback_offer: {
    name: 'Win-back Offer',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Special reactivation offer',
    channel: 'Email + SMS',
    frequency: 'One-time campaign',
    team: 'Marketing',
    costPerCustomer: 25,
    expectedSuccess: 45
  },
  educational_content: {
    name: 'Educational Content',
    effort: 'minimal' as const,
    cost: 'very-low' as const,
    action: 'Targeted learning materials',
    channel: 'Email + In-app',
    frequency: 'Monthly',
    team: 'Content Team',
    costPerCustomer: 8,
    expectedSuccess: 40
  },
  automated_checkin: {
    name: 'Automated Check-in',
    effort: 'minimal' as const,
    cost: 'very-low' as const,
    action: 'Automated engagement prompts',
    channel: 'In-app + Email',
    frequency: 'Quarterly',
    team: 'Automation',
    costPerCustomer: 3,
    expectedSuccess: 35
  },
  feature_training: {
    name: 'Feature Training',
    effort: 'intensive' as const,
    cost: 'high' as const,
    action: 'Personalized feature onboarding',
    channel: 'Video Call + Training',
    frequency: 'Multi-session',
    team: 'Customer Education',
    costPerCustomer: 180,
    expectedSuccess: 80
  },
  loyalty_reward: {
    name: 'Loyalty Reward Program',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Exclusive benefits for loyal customers',
    channel: 'Email + Personal Communication',
    frequency: 'Quarterly',
    team: 'Customer Success',
    costPerCustomer: 75,
    expectedSuccess: 80
  },
  beta_access: {
    name: 'Beta Access',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Exclusive feature preview',
    channel: 'Email + In-app',
    frequency: 'Quarterly',
    team: 'Product',
    costPerCustomer: 20,
    expectedSuccess: 88
  },
  upsell_opportunity: {
    name: 'Upsell Opportunity',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Strategic upgrade conversation',
    channel: 'Personal Call',
    frequency: 'One-time',
    team: 'Sales',
    costPerCustomer: 95,
    expectedSuccess: 75
  },
  localized_support: {
    name: 'Localized Support',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Regional support team',
    channel: 'Phone + Email',
    frequency: 'As needed',
    team: 'Regional CS',
    costPerCustomer: 90,
    expectedSuccess: 70
  },
  regional_offer: {
    name: 'Regional Offer',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Geography-specific promotion',
    channel: 'Email + Local Channels',
    frequency: 'One-time',
    team: 'Marketing',
    costPerCustomer: 25,
    expectedSuccess: 60
  },
  multi_lingual: {
    name: 'Multi-lingual Support',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Local language content and support',
    channel: 'All Channels',
    frequency: 'Ongoing',
    team: 'Localization Team',
    costPerCustomer: 85,
    expectedSuccess: 75
  },
  localized_content: {
    name: 'Localized Content',
    effort: 'light' as const,
    cost: 'low' as const,
    action: 'Region-specific educational materials',
    channel: 'Email + Website',
    frequency: 'Monthly',
    team: 'Content Team',
    costPerCustomer: 20,
    expectedSuccess: 65
  },
  price_adjustment: {
    name: 'Price Optimization',
    effort: 'moderate' as const,
    cost: 'medium' as const,
    action: 'Regional pricing adjustment',
    channel: 'Email + In-app',
    frequency: 'One-time',
    team: 'Pricing Team',
    costPerCustomer: 50,
    expectedSuccess: 68
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

// Cohort Analysis Component
const CohortAnalysis = ({ data }: { data: any[] }) => {
  const cohortData = useMemo(() => generateCohortData(data), [data])
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
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis type="category" dataKey="cohort" />
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

  const segmentsData = generateSegments()
  const forecastData = generateForecastData()
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
  }, [categoryData])

  const totalInvestment = investmentData.reduce((sum, item) => sum + item.cost, 0)
  const totalExpectedSavings = investmentData.reduce((sum, item) => sum + item.expectedSavings, 0)
  const overallROI = (totalExpectedSavings - totalInvestment) / totalInvestment

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategic Retention Dashboard</h1>
          <p className="text-sm text-gray-600">Tiered retention effort allocation based on churn risk</p>
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
          <CohortAnalysis data={generateFakeCustomers()} />
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