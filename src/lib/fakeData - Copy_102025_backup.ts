// src/lib/fakeData.ts
import { faker } from '@faker-js/faker'
import { formatTimeLabel, seededRandom, calculateTrend, calculateMean,
         calculateStandardDeviation, formatCurrency } from '@/lib/utils';
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
  Calendar,
  Check
} from 'lucide-react'


// =============================================================================
// INTERFACE
// =============================================================================

// Executive Dashboard Interfaces
export interface ExecutiveKpi {
  mrr: number;
  arr: number;
  customerCount: number;
  quickRatio: number;
  previousMrr: number;
  previousArr: number;
  previousCustomerCount: number;
  previousQuickRatio: number;
  topExpansions: Array<{ company: string; amount: number }>;
  recentChurns: Array<{ company: string; amount: number }>;
}

export interface MrrMovementPoint {
  period: string;
  newBusiness: number;
  expansion: number;
  churn: number;
  reactivation: number;
  netChange: number;
}

export interface QuickRatioPoint {
  period: string;
  quickRatio: number;
  nrr: number;
}

export interface Customer {
  name: string;
  email: string;
  totalSpend: number;
  subscriptionAge: number;
  clv: number;
  usageTier: string;
  plan: string;
  churned: boolean;
  status: string;
  mrr: number;
  joinedAt: Date;
  subscriptionType: string;
  usageScore: number;
  crmScore: number;
  // Remove id and signupDate if your data doesn't have them
}

export interface GrowthScorecardItem {
  metric: string;
  value: number;
  target: number;
  trend: number;
}

export interface MetricTrend {
  period: string;
  mrr: number;
  arr: number;
  customers: number;
}

// CLV Interfaces
export interface CLVDataPoint {
  fiscalWeek: string;
  clv: number;
  cac: number;
  revenue: number;
  baseline: number;
  plan: string;
  usageScore: number;
  customers: number;
  retention: number;
  churn: number;
  frequency: number;
  monetary: number;
}

export interface ProjectedDataPoint {
  fiscalWeek: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface PredictionDataPoint {
  month: number;
  predicted: number;
  actual: number | null;
  confidence_upper: number;
  confidence_lower: number;
}

// Subscription Interfaces
export interface SubscriptionKPIs {
  activeSubscriptions: { current: number; change: number };
  mrr: { current: number; change: number };
  arpu: { current: number; change: number };
  churnRate: { current: number; change: number };
}

export interface SubscriptionTrendData {
  month: string;
  totalSubscriptions: number;
  newSubscriptions: number;
  churnedSubscriptions: number;
  mrr: number;
  churnRate: number; 
}


// Add these interfaces to fakeData.ts
export interface RevenueDataPoint {
  month: string;
  recurringRevenue: number;
  oneTimeRevenue: number;
  totalRevenue: number;
  predictability: number;
  volatility: number;
  rqi: number;
  growthRate: number;
  marginExpansion: number;
}

export interface ZipfDataPoint {
  rank: number;
  revenue: number;
  expectedZipf: number;
  logRank: number;
  logRevenue: number;
  plan: string;
}

export interface BassDataPoint {
  month: number;
  cumulativeRevenue: number;
  monthlyRevenue: number;
  adoptionRate: number;
  growthRate: number;
  innovators: number;
  imitators: number;
}

export interface EntropyData {
  segmentRevenue: Array<{ segment: string; revenue: number; count: number }>;
  entropy: number;
  maxEntropy: number;
  diversificationIndex: number;
  geoDistribution: Array<{ region: string; revenue: number; customers: number }>;
  channelDistribution: Array<{ channel: string; revenue: number; margin: number; efficiency: number }>;
}

export interface KanoFeature {
  name: string;
  category: string;
  satisfaction: number;
  revenue_impact: number;
  implementation_cost: number;
  efficiency_ratio: number;
  priority_score: number;
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const SEGMENTS = ['Basic', 'Pro', 'Enterprise']
export const REGIONS = ['North America', 'Europe', 'Asia', 'Other']
export const CHANNELS = ['Direct', 'Partner', 'Online', 'Reseller']

// =============================================================================
// CORE DATA GENERATORS
// =============================================================================

export function generateFakeCustomers(count: number) {
  return Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    totalSpend: faker.number.int({ min: 100, max: 10000 }),
    subscriptionAge: faker.number.int({ min: 1, max: 36 }),
    clv: faker.number.float({ min: 200, max: 5000, precision: 0.01 }),
    usageTier: faker.helpers.arrayElement(['Power', 'Medium', 'Low']),
    plan: faker.helpers.arrayElement(['Basic', 'Pro', 'Enterprise']),
    churned: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(['active', 'trialing', 'churned']),
    mrr: faker.number.float({ min: 20, max: 200 }),
    joinedAt: faker.date.past({ years: 2 }),
    subscriptionType: faker.helpers.arrayElement(['monthly', 'annual']),
    usageScore: faker.number.float({ min: 0, max: 100 }),
    crmScore: faker.number.int({ min: 0, max: 5 }),
  }));
}

// =============================================================================
// EXECUTIVE DASHBOARD GENERATORS
// =============================================================================

export const generateExecutiveKpis = (timeRange: 'week' | 'month' | 'quarter' | 'ytd'): ExecutiveKpi => {
  const baseMrr = 450000;
  const growthFactor = timeRange === 'week' ? 0.02 : timeRange === 'month' ? 0.05 : timeRange === 'quarter' ? 0.15 : 0.35;
  
  const mrr = baseMrr * (1 + growthFactor);
  const arr = mrr * 12;
  
  return {
    mrr,
    arr,
    customerCount: 1250 + Math.floor(growthFactor * 200),
    quickRatio: 3.5 + growthFactor,
    previousMrr: baseMrr,
    previousArr: baseMrr * 12,
    previousCustomerCount: 1250,
    previousQuickRatio: 3.5,
    topExpansions: [
      { company: "TechCorp Inc.", amount: 12500 },
      { company: "Global Services", amount: 8200 },
      { company: "Innovate LLC", amount: 7500 },
    ],
    recentChurns: [
      { company: "StartUp Ventures", amount: 2500 },
      { company: "Local Business Inc.", amount: 1800 },
    ]
  };
};

export const generateMrrMovementData = (timeRange: 'week' | 'month' | 'quarter' | 'ytd'): MrrMovementPoint[] => {
  const periods = timeRange === 'week' ? 4 : timeRange === 'month' ? 3 : timeRange === 'quarter' ? 4 : 4;
  const data: MrrMovementPoint[] = [];
  
  const baseDate = new Date();
  for (let i = periods; i > 0; i--) {
    const date = new Date(baseDate);
    if (timeRange === 'week') {
      date.setDate(date.getDate() - i * 7);
    } else if (timeRange === 'month') {
      date.setMonth(date.getMonth() - i);
    } else if (timeRange === 'quarter') {
      date.setMonth(date.getMonth() - i * 3);
    } else {
      date.setMonth(date.getMonth() - i);
    }
    
    const newBusiness = 120000 + Math.random() * 40000;
    const expansion = 35000 + Math.random() * 15000;
    const churn = 28000 + Math.random() * 12000;
    const reactivation = 8000 + Math.random() * 4000;
    const netChange = newBusiness + expansion + reactivation - churn;
    
    data.push({
      period: timeRange === 'week' ? `W-${i}` : 
              timeRange === 'month' || timeRange === 'quarter' ? date.toLocaleDateString('en-US', { month: 'short' }) :
              date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      newBusiness,
      expansion,
      churn,
      reactivation,
      netChange
    });
  }
  
  return data.reverse();
};

export const generateQuickRatioData = (timeRange: 'week' | 'month' | 'quarter' | 'ytd'): QuickRatioPoint[] => {
  const periods = timeRange === 'week' ? 4 : timeRange === 'month' ? 3 : timeRange === 'quarter' ? 4 : 4;
  const data: QuickRatioPoint[] = [];
  
  const baseDate = new Date();
  for (let i = periods; i > 0; i--) {
    const date = new Date(baseDate);
    if (timeRange === 'week') {
      date.setDate(date.getDate() - i * 7);
    } else if (timeRange === 'month') {
      date.setMonth(date.getMonth() - i);
    } else if (timeRange === 'quarter') {
      date.setMonth(date.getMonth() - i * 3);
    } else {
      date.setMonth(date.getMonth() - i);
    }
    
    data.push({
      period: timeRange === 'week' ? `W-${i}` : 
              timeRange === 'month' || timeRange === 'quarter' ? date.toLocaleDateString('en-US', { month: 'short' }) :
              date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      quickRatio: 3 + Math.random() * 2,
      nrr: 100 + Math.random() * 15
    });
  }
  
  return data.reverse();
};

export const generateMetricTrends = (timeRange: 'week' | 'month' | 'quarter' | 'ytd'): MetricTrend[] => {
  const periods = timeRange === 'week' ? 8 : timeRange === 'month' ? 6 : timeRange === 'quarter' ? 5 : 4;
  const data: MetricTrend[] = [];
  
  const baseDate = new Date();
  let baseMrr = 350000;
  let baseCustomers = 1000;
  
  for (let i = periods; i > 0; i--) {
    const date = new Date(baseDate);
    if (timeRange === 'week') {
      date.setDate(date.getDate() - i * 7);
    } else if (timeRange === 'month') {
      date.setMonth(date.getMonth() - i);
    } else if (timeRange === 'quarter') {
      date.setMonth(date.getMonth() - i * 3);
    } else {
      date.setFullYear(date.getFullYear() - i);
    }
    
    const growth = 1 + (i * 0.05);
    const mrr = baseMrr * growth;
    const arr = mrr * 12;
    const customers = baseCustomers * growth;
    
    data.push({
      period: timeRange === 'week' ? `W-${i}` : 
              timeRange === 'month' ? date.toLocaleDateString('en-US', { month: 'short' }) :
              timeRange === 'quarter' ? `Q${Math.ceil((date.getMonth() + 1) / 3)}` :
              date.getFullYear().toString(),
      mrr,
      arr,
      customers
    });
  }
  
  return data.reverse();
};

export const generateGrowthScorecard = (timeRange: 'week' | 'month' | 'quarter' | 'ytd'): GrowthScorecardItem[] => {
  const timeFactor = timeRange === 'week' ? 0.8 : timeRange === 'month' ? 1 : timeRange === 'quarter' ? 1.2 : 1.5;
  
  return [
    { metric: "Revenue Retention", value: Math.round(88 * timeFactor), target: 90, trend: 2.5 },
    { metric: "Customer Acquisition", value: Math.round(75 * timeFactor), target: 80, trend: 3.1 },
    { metric: "Expansion Revenue", value: Math.round(82 * timeFactor), target: 85, trend: 4.2 },
    { metric: "Product Engagement", value: Math.round(79 * timeFactor), target: 85, trend: 1.8 },
    { metric: "Market Responsiveness", value: Math.round(85 * timeFactor), target: 80, trend: 6.2 },
    { metric: "Sales Efficiency", value: Math.round(72 * timeFactor), target: 75, trend: 2.1 }
  ];
};

// =============================================================================
// CLV DATA GENERATORS
// =============================================================================

export const generateCLVTimeSeriesData = (timeframe: string, customerCount: number = 365): CLVDataPoint[] => {
  const customers = generateFakeCustomers(customerCount);
  let length = 52;
  if (timeframe === 'daily') length = 90;
  else if (timeframe === 'monthly') length = 12;

  return Array.from({ length }).map((_, i) => {
    const customer = customers[i % customers.length];
    const random = seededRandom(12345 + i);
    
    return {
      fiscalWeek: formatTimeLabel(i, timeframe),
      clv: customer.clv,
      cac: customer.clv * (0.2 + random * 0.3),
      revenue: customer.clv * 0.75 + random * 50,
      baseline: customer.clv * 0.95 + random * 50,
      plan: customer.plan,
      usageScore: customer.usageScore,
      customers: Math.floor(50 + random * 50),
      retention: 85 + random * 15,
      churn: 5 + random * 10,
      frequency: 2 + random * 2,
      monetary: customer.clv / 12,
    };
  });
};

//  (deterministic version)
export const generateProjectedData = (
  historicalData: any[], 
  timeframe: string, 
  metric: string
): ProjectedDataPoint[] => {
  // Use the last value or a fallback - completely deterministic
  const base = historicalData[historicalData.length - 1]?.[metric] || 1000;
  
  return Array.from({ length: 12 }).map((_, i) => {
    const index = historicalData.length + i;
    // Simple linear growth - no randomness, no trend calculation
    const predictedValue = base * (1 + (i * 0.05));
    
    return {
      fiscalWeek: formatTimeLabel(index, timeframe),
      predicted: Math.round(predictedValue),
      lowerBound: Math.round(predictedValue * 0.9),
      upperBound: Math.round(predictedValue * 1.1),
    };
  });
};

export const generateAdvancedPredictionData = (): PredictionDataPoint[] => {
  let seed = 67890;
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    predicted: 2240 + i * 45 + seededRandom(seed + i) * 100,
    actual: i < 6 ? 2180 + i * 52 + seededRandom(seed + i + 100) * 120 : null,
    confidence_upper: 2340 + i * 48 + seededRandom(seed + i + 200) * 80,
    confidence_lower: 2140 + i * 42 + seededRandom(seed + i + 300) * 80,
  }));
};

// =============================================================================
// SUBSCRIPTION DATA GENERATORS
// =============================================================================

export const generateSubscriptionKPIs = (data: any[]): SubscriptionKPIs => {
  const activeCount = data.filter(d => 
    d.subscriptionStatus === 'active' || 
    d.subscriptionStatus === 'Active' || 
    !d.subscriptionStatus
  ).length;
  
  const totalMRR = data.reduce((sum, d) => {
    const isActive = d.subscriptionStatus === 'active' || d.subscriptionStatus === 'Active' || !d.subscriptionStatus;
    return sum + (isActive ? (d.monthlyRecurringRevenue || 0) : 0);
  }, 0);
  
  const arpu = activeCount > 0 ? totalMRR / activeCount : 0;
  
  const churnedCount = data.filter(d => 
    d.subscriptionStatus === 'churned' || 
    d.subscriptionStatus === 'Churned'
  ).length;
  
  const churnRate = data.length > 0 ? (churnedCount / data.length) * 100 : 0;
  
  return {
    activeSubscriptions: { current: activeCount || 847, change: 12.5 },
    mrr: { current: totalMRR || 89450, change: 8.2 },
    arpu: { current: arpu || 105.62, change: 5.7 },
    churnRate: { current: churnRate || 15.3, change: -3.2 }
  };
};

export const generateSubscriptionTrendData = (): SubscriptionTrendData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData: SubscriptionTrendData[] = [];
  
  let totalSubs = 800;
  let mrr = 45000;
  
  months.forEach(month => {
    const baseIndex = months.indexOf(month);
    const newSubs = 80 + (baseIndex * 3);
    const churnedSubs = 20 + (baseIndex * 1);
    
    const netGrowth = newSubs - churnedSubs;
    totalSubs += netGrowth;
    mrr += netGrowth * 65;
    
    trendData.push({
      month,
      totalSubscriptions: totalSubs,
      newSubscriptions: newSubs,
      churnedSubscriptions: churnedSubs,
      mrr: mrr,
      churnRate: (churnedSubs / totalSubs) * 100,
    });
  });
  
  return trendData;
};

// =============================================================================
// LEGACY FUNCTIONS (KEEP FOR BACKWARD COMPATIBILITY BECAUSE COHORT TAB USES THIS)
// =============================================================================

export const generateCohortData = (baseData: any[]) => {
  const cohorts = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
  const periods = 6;




  
  
  return cohorts.map((cohort, index) => {
    const initialCustomers = Math.floor(150 + Math.random() * 50);
    
    const retention = Array.from({ length: periods }).map((_, periodIndex) => {
      const baseRate = 85 - (periodIndex * 12);
      const randomFactor = Math.random() * 10 - 5;
      const rate = Math.max(10, Math.min(100, baseRate + randomFactor));
      
      return {
        period: periodIndex + 1,
        rate: Math.round(rate),
        customers: Math.round(initialCustomers * (rate / 100))
      };
    });

    const totalRevenue = retention.reduce((sum, period) => {
      return sum + (period.customers * (500 + Math.random() * 500));
    }, 0);

    return {
      cohort,
      initialCustomers,
      retention,
      totalRevenue
    };
  });
};



export const generateCohortRetentionData = () => {
  const cohorts = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  for (let cohortMonth = 0; cohortMonth < 12; cohortMonth++) {
    const cohortData: any = {  // Use any to avoid TypeScript issues
      cohort: months[cohortMonth],
      size: Math.floor(Math.random() * 200) + 50,
    }
    
    let retentionRate = 100
    for (let month = 0; month <= 11; month++) {
      const monthKey = `month${month}`
      if (month === 0) {
        cohortData[monthKey] = 100
      } else {
        retentionRate *= (0.85 + Math.random() * 0.1)
        cohortData[monthKey] = Math.max(retentionRate, 10)
      }
    }
    
    cohorts.push(cohortData)
  }
  
  return cohorts
};



export const generatePlanDistributionData = (data: any[]) => {
  const plans = ['Basic', 'Pro', 'Enterprise']
  return plans.map(plan => {
    const planCustomers = data.filter(d => d.plan === plan && (d.status === 'active' || !d.status))
    const revenue = planCustomers.reduce((sum, c) => sum + (c.mrr || 0), 0)
    return {
      plan,
      customers: planCustomers.length,
      revenue,
      avgRevenue: revenue / planCustomers.length || 0,
      churnRate: (data.filter(d => d.plan === plan && d.status === 'churned').length / Math.max(data.filter(d => d.plan === plan).length, 1)) * 100,
      growth: Math.random() * 20 - 5,
    }
  })
};


// Generate churn prediction data
export const generateChurnPredictionData = (customers: any[]) => {
  return customers.map(customer => {
    // Ensure a better distribution of risk categories
    const churnRisk = customer.churnRisk || Math.random()
    let riskCategory = 'Low'
    
    if (churnRisk > 0.7) riskCategory = 'High'
    else if (churnRisk > 0.4) riskCategory = 'Medium'
    
    return {
      id: customer.id,
      name: customer.name,
      churnProbability: churnRisk,
      riskCategory,
      lastLogin: Math.floor(Math.random() * 30),
      supportTickets: Math.floor(Math.random() * 5),
      usageScore: customer.usageScore,
      plan: customer.plan,
      monthsSubscribed: customer.lifetimeMonths,
    }
  })
};

export const generateChurnHeaderMetrics = (kpis: any) => {
  const totalAtRisk = Math.floor(kpis.activeSubscriptions.current * 0.17) // ~17% of active subs
  const churnRate = kpis.churnRate.current
  const savedThisMonth = Math.floor(totalAtRisk * 0.5) // ~50% of at-risk saved
  
  return {
    totalAtRisk,
    churnRate,
    savedThisMonth
  }
};



// Generate pricing sensitivity data
export const generatePricingSensitivityData = () => {
  const pricePoints = []
  
  // Model parameters - make these explicit and adjustable
  const baselineDemand = 100 // demand at $0
  const priceElasticity = -0.5 // % change in demand per 1% change in price
  const baselineAcceptance = 95 // acceptance rate at lowest price
  const acceptanceDecay = 0.4 // how quickly acceptance drops with price
  
  for (let price = 10; price <= 200; price += 10) {
    // Price elasticity formula: demand = baselineDemand * (price/referencePrice)^elasticity
    // Simplified linear approximation for demonstration
    const demand = Math.max(baselineDemand - (price * 0.5), 5)
    const revenue = price * demand
    const acceptanceRate = Math.max(baselineAcceptance - (price * acceptanceDecay), 5)
    
    pricePoints.push({
      price,
      demand: Math.floor(demand),
      revenue: Math.floor(revenue),
      acceptanceRate: Math.floor(acceptanceRate),
    })
  }
  return pricePoints
};

export const generateChurnModelMetrics = () => {
  return {
    accuracy: 87.8,
    precision: 82.1,
    featureImportance: [
      { feature: 'Days Since Last Login', importance: 89, trend: 'up' },
      { feature: 'Usage Score Decline', importance: 76, trend: 'up' },
      { feature: 'Support Tickets', importance: 62, trend: 'neutral' },
      { feature: 'Payment Failures', importance: 54, trend: 'down' },
      { feature: 'Feature Adoption', importance: 43, trend: 'down' },
    ]
  }
};


export const generatePreventionStrategies = () => {
  return [
    {
      risk: 'High',
      color: 'red',
      customerCount: 23,
      actions: [
        'Personal outreach within 24 hours',
        'Offer discount or plan downgrade', 
        'Schedule product demo or training'
      ]
    },
    {
      risk: 'Medium', 
      color: 'amber',
      customerCount: 56,
      actions: [
        'Send engagement email campaign',
        'Highlight unused features',
        'Provide success stories and tips'
      ]
    },
    {
      risk: 'Low',
      color: 'green', 
      customerCount: 63,
      actions: [
        'Regular newsletter and updates',
        'Upsell opportunities',
        'Loyalty program enrollment'
      ]
    }
  ]
};


export const generateInterventionResults = () => {
  return [
    { customer: "Acme Corp", risk: "High", intervention: "Personal Call", date: "2023-06-12", result: "Retained" },
    { customer: "XYZ Ltd", risk: "Medium", intervention: "Email Campaign", date: "2023-06-11", result: "Pending" },
    { customer: "Tech Solutions", risk: "High", intervention: "Discount Offer", date: "2023-06-10", result: "Retained" },
    { customer: "Global Inc", risk: "Low", intervention: "Newsletter", date: "2023-06-09", result: "Engaged" },
    { customer: "Innovate Co", risk: "Medium", intervention: "Feature Demo", date: "2023-06-08", result: "Retained" },
  ]
};

export const generatePricingRecommendations = () => {
  return {
    recommendations: [
      {
        title: "Current Price Analysis",
        description: "Current pricing is below optimal. Consider 15-20% increase for Pro plan.",
        color: "blue"
      },
      {
        title: "Market Positioning", 
        description: "Enterprise tier has room for premium positioning with enhanced features.",
        color: "green"
      },
      {
        title: "A/B Testing Recommendation",
        description: "Test $119 Pro pricing with 10% of new signups for 30 days.",
        color: "purple"
      }
    ],
    westendorpResults: {
      cheapness: 19,
      expensiveness: 159,
      optimal: 89,
      indifference: 119
    }
  }
}

export const generateAARRRMetrics = () => {
  return {
    funnel: [
      { stage: 'Acquisition', value: '2,340', change: '+12%', color: 'blue' },
      { stage: 'Activation', value: '1,872', change: '+8%', color: 'green' },
      { stage: 'Retention', value: '1,498', change: '+15%', color: 'purple' },
      { stage: 'Referral', value: '234', change: '+22%', color: 'orange' },
      { stage: 'Revenue', value: '$89K', change: '+18%', color: 'red' },
    ],
    chartData: [
      { stage: 'Visitors', count: 10000, conversion: 100 },
      { stage: 'Signups', count: 2340, conversion: 23.4 },
      { stage: 'Activated', count: 1872, conversion: 18.7 },
      { stage: 'Retained', count: 1498, conversion: 15.0 },
      { stage: 'Referring', count: 234, conversion: 2.3 },
      { stage: 'Paying', count: 1200, conversion: 12.0 },
    ],
    acquisitionChannels: [
      { channel: 'Organic Search', customers: 1240, cost: 89, ltv: 2340 },
      { channel: 'Paid Search', customers: 560, cost: 156, ltv: 1890 },
      { channel: 'Social Media', customers: 340, cost: 78, ltv: 1560 },
      { channel: 'Email Marketing', customers: 200, cost: 23, ltv: 2100 },
    ],
    activationMetrics: [
      { metric: 'Profile Completed', rate: 87, target: 90 },
      { metric: 'First Feature Used', rate: 73, target: 80 },
      { metric: 'Integration Setup', rate: 45, target: 60 },
      { metric: 'Team Invited', rate: 32, target: 40 },
    ],
    revenueOptimization: {
      arpu: 127,
      expansionMRR: 12000,
      upsellOpportunities: [
        { from: 'Basic', to: 'Pro', customers: 234 },
        { from: 'Pro', to: 'Enterprise', customers: 67 },
        { from: 'Add-on Features', to: '', customers: 445 }
      ]
    }
  }
}

export const generateCLVModelData = (customers: any[]) => {
  const clvValues = customers.map(c => c.clv);
  const meanClv = calculateMean(clvValues);
  const stdDevClv = calculateStandardDeviation(clvValues);
  
  const shape = 2.5 + Math.random() * 1.5;
  const scale = meanClv / shape;
  
  const valueDistribution = Array.from({ length: 50 }).map((_, i) => {
    const value = i * 150;
    const gammaPdf = (Math.pow(value, shape - 1) * Math.exp(-value / scale)) / 
                     (Math.pow(scale, shape) * gamma(shape));
    
    const empirical = clvValues.filter(v => v >= value - 75 && v < value + 75).length / clvValues.length / 150;
    
    return {
      value,
      density: empirical * 1000,
      gamma: gammaPdf * 10000,
    };
  });
  
  const bgnbdParams = {
    r: 0.8 + Math.random() * 0.4,
    alpha: 3.5 + Math.random() * 1.5,
    a: 0.6 + Math.random() * 0.3,
    b: 2.5 + Math.random() * 1.0,
  };
  
  const ggParams = {
    p: 5.2 + Math.random() * 1.5,
    q: 3.8 + Math.random() * 1.2,
    gamma: 15.5 + Math.random() * 5,
  };
  
  const prediction = Array.from({ length: 24 }).map((_, i) => {
    const baseValue = meanClv * (1 + i * 0.03);
    const uncertainty = 0.1 * baseValue * Math.sqrt(i + 1);
    return {
      period: i + 1,
      predicted: baseValue,
      upper: baseValue + 1.96 * uncertainty,
      lower: Math.max(0, baseValue - 1.96 * uncertainty),
    };
  });
  
  const segments = {
    champions: Array.from({ length: 15 }).map(() => ({
      frequency: 8 + Math.random() * 7,
      value: 1200 + Math.random() * 1500,
      clv: 4000 + Math.random() * 3000,
    })),
    loyal: Array.from({ length: 20 }).map(() => ({
      frequency: 4 + Math.random() * 3,
      value: 1500 + Math.random() * 2000,
      clv: 3000 + Math.random() * 2000,
    })),
    atRisk: Array.from({ length: 25 }).map(() => ({
      frequency: 6 + Math.random() * 5,
      value: 400 + Math.random() * 600,
      clv: 1500 + Math.random() * 1000,
    })),
    needAttention: Array.from({ length: 40 }).map(() => ({
      frequency: 1 + Math.random() * 2,
      value: 300 + Math.random() * 400,
      clv: 800 + Math.random() * 700,
    })),
  };
  
  const sortedValues = [...clvValues].sort((a, b) => a - b);
  const totalValue = sortedValues.reduce((sum, val) => sum + val, 0);
  
  const n = sortedValues.length;
  let giniNumerator = 0;
  for (let i = 0; i < n; i++) {
    giniNumerator += (i + 1) * sortedValues[i];
  }
  const giniDenominator = n * totalValue;
  const gini = (2 * giniNumerator) / giniDenominator - (n + 1) / n;
  
  const top20Percent = Math.floor(n * 0.8);
  const top20Value = sortedValues.slice(top20Percent).reduce((sum, val) => sum + val, 0);
  const paretoRatio = top20Value / totalValue;
  
  const top10Percent = Math.floor(n * 0.9);
  const top10Value = sortedValues.slice(top10Percent).reduce((sum, val) => sum + val, 0);
  const top10Share = top10Value / totalValue;
  
  const top1Percent = Math.floor(n * 0.99);
  const top1Value = sortedValues.slice(top1Percent).reduce((sum, val) => sum + val, 0);
  const top1Share = top1Value / totalValue;
  
  return {
    heterogeneityIndex: stdDevClv / meanClv,
    predictedClv: meanClv * 1.15,
    valueDistribution,
    gammaParams: { shape, scale },
    bgnbdParams,
    ggParams,
    prediction,
    segments,
    inequality: {
      gini,
      pareto: paretoRatio,
      top10Share,
      top10Value: top10Value,
      top1Share,
    },
  };
};

// Helper function for Gamma distribution (used in CLV models)
function gamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  } else {
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
}


// Add these interfaces
export interface OverviewKPIs {
  clv: number;
  clvChange: number;
  cac: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  heterogeneity: number;
  predictedClv: number;
}

export interface StatisticalStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  trend: number;
}

export interface CLVDrivers {
  planData: Array<{ plan: string; avgClv: number; customers: number }>;
  usageData: Array<{ usage: string; avgClv: number; customers: number }>;
}

export interface CLVDecomposition {
  frequency: number;
  monetary: number;
  retention: number;
  calculatedClv: number;
}

export interface CustomerEquity {
  totalClv: number;
  avgRetention: number;
  discountRate: number;
  equity: number;
}

// Add these functions
export const generateOverviewKPIs = (data: any[], modelData: any): OverviewKPIs => {
  const clvValues = data.map(d => d.clv).filter(v => v !== null);
  const currentClv = clvValues[clvValues.length - 1] || 0;
  const previousClv = clvValues[clvValues.length - 2] || 0;
  const change = previousClv ? ((currentClv - previousClv) / previousClv) * 100 : 0;

  const cacValues = data.map(d => d.cac).filter(v => v !== null);
  const currentCac = cacValues[cacValues.length - 1] || 0;

  const ltvCacRatio = currentCac > 0 ? currentClv / currentCac : 0;
  const paybackPeriod = currentCac > 0 ? currentCac / (currentClv * 0.1) : 0;

  return {
    clv: currentClv,
    clvChange: isFinite(change) ? change : 0,
    cac: currentCac,
    ltvCacRatio,
    paybackPeriod,
    heterogeneity: modelData.heterogeneityIndex,
    predictedClv: modelData.predictedClv,
  };
};

export const generateStatisticalStats = (data: any[], metric: string): StatisticalStats => {
  const values = data.map(d => d[metric]).filter(v => typeof v === 'number');
  if (!values.length) return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, trend: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  return {
    mean: calculateMean(values),
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev: calculateStandardDeviation(values),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    trend: calculateTrend(values),
  };
};

export const generateCLVDrivers = (data: any[]): CLVDrivers => {
  const planData = [
    { plan: 'Basic', avgClv: 1200, customers: data.filter(d => d.plan === 'Basic').length },
    { plan: 'Pro', avgClv: 2800, customers: data.filter(d => d.plan === 'Pro').length },
    { plan: 'Enterprise', avgClv: 7500, customers: data.filter(d => d.plan === 'Enterprise').length },
  ];

  const usageData = [
    { usage: 'Low', avgClv: 900, customers: data.filter(d => d.usageScore < 33).length },
    { usage: 'Medium', avgClv: 2200, customers: data.filter(d => d.usageScore >= 33 && d.usageScore < 66).length },
    { usage: 'High', avgClv: 4500, customers: data.filter(d => d.usageScore >= 66).length },
  ];

  return { planData, usageData };
};

export const generateCLVDecomposition = (data: any[]): CLVDecomposition => {
  const frequencyMean = calculateMean(data.map(d => d.frequency || 2.5));
  const monetaryMean = calculateMean(data.map(d => d.monetary || (d.clv / 12)));
  const retentionMean = calculateMean(data.map(d => d.retention || 85));

  return {
    frequency: frequencyMean,
    monetary: monetaryMean,
    retention: retentionMean,
    calculatedClv: frequencyMean * monetaryMean * (retentionMean / (1 - retentionMean / 100))
  };
};

export const generateCustomerEquity = (data: any[]): CustomerEquity => {
  const totalClv = data.reduce((sum, customer) => sum + customer.clv, 0);
  const avgRetention = calculateMean(data.map(d => d.retention || 85));
  const discountRate = 0.1;
  const equity = totalClv * (avgRetention / 100) / (1 + discountRate - (avgRetention / 100));
  
  return { totalClv, avgRetention, discountRate, equity };
};


// Add these interfaces
export interface HeterogeneityKPIs {
  clv: number;
  clvChange: number;
  cac: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  heterogeneity: number;
  predictedClv: number;
}

export interface ExecutiveSummaryInsights {
  heterogeneityScore: number;
  top20Share: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  avgCLV: number;
}

export interface CohortAnalysisData {
  name: string;
  avgClv: number;
  retention: number;
}

export interface ParetoAnalysisData {
  rank: number;
  clv: number;
  percentage: number;
}

// Add these functions - ensuring consistency with other tabs
export const generateHeterogeneityKPIs = (data: any[], modelData: any): HeterogeneityKPIs => {
  // Use the same logic as OverviewTab for consistency
  const clvValues = data.map(d => d.clv).filter(v => v !== null);
  const currentClv = clvValues[clvValues.length - 1] || 0;
  const previousClv = clvValues[clvValues.length - 2] || 0;
  const change = previousClv ? ((currentClv - previousClv) / previousClv) * 100 : 0;

  const cacValues = data.map(d => d.cac).filter(v => v !== null);
  const currentCac = cacValues[cacValues.length - 1] || 0;

  const ltvCacRatio = currentCac > 0 ? currentClv / currentCac : 0;
  const paybackPeriod = currentCac > 0 ? currentCac / (currentClv * 0.1) : 0;

  return {
    clv: currentClv,
    clvChange: isFinite(change) ? change : 0,
    cac: currentCac,
    ltvCacRatio,
    paybackPeriod,
    heterogeneity: modelData.heterogeneityIndex,
    predictedClv: modelData.predictedClv,
  };
};

export const generateExecutiveSummary = (clvData: any[], modelData: any): ExecutiveSummaryInsights => {
  const clvValues = clvData.map(d => d.clv).filter(v => v !== null);
  const sorted = [...clvValues].sort((a, b) => b - a);
  const totalValue = sorted.reduce((sum, val) => sum + val, 0);

  const top20Count = Math.floor(sorted.length * 0.2);
  const top20Value = sorted.slice(0, top20Count).reduce((sum, val) => sum + val, 0);
  const top20Share = (top20Value / totalValue) * 100;

  const heterogeneity = modelData.heterogeneityIndex || 0;

  let recommendation = '';
  let priority: 'high' | 'medium' | 'low' = 'medium';
  
  if (heterogeneity > 0.7) {
    recommendation = 'High value concentration – protect top customers';
    priority = 'high';
  } else if (heterogeneity > 0.4) {
    recommendation = 'Balanced distribution – optimize mid-tier growth';
    priority = 'medium';
  } else {
    recommendation = 'Uniform base – explore segmentation opportunities';
    priority = 'low';
  }

  return {
    heterogeneityScore: Math.round(heterogeneity * 100),
    top20Share: Math.round(top20Share),
    recommendation,
    priority,
    avgCLV: totalValue / sorted.length,
  };
};

export const generateCohortAnalysisData = (data: any[]): CohortAnalysisData[] => {
  // Create cohorts that align with the CLV data story
  return data.map((d, i) => {
    // Use consistent values from the actual data rather than random
    const cohortIndex = Math.floor(i / 10);
    const baseRetention = 80 + (i % 20); // Deterministic based on position
    
    return {
      name: `Cohort ${cohortIndex + 1}`,
      avgClv: d.clv, // Use actual CLV from data
      retention: baseRetention,
    };
  });
};



export const generateParetoAnalysisData = (data: any[]): ParetoAnalysisData[] => {
  const sorted = [...data].sort((a, b) => b.clv - a.clv);
  const total = sorted.reduce((sum, d) => sum + d.clv, 0);
  let cumulative = 0;

  return sorted.map((d, i) => {
    cumulative += d.clv;
    return {
      rank: ((i + 1) / sorted.length) * 100,
      clv: d.clv,
      cumulative: (cumulative / total) * 100,
      percentage: (d.clv / total) * 100  // Add this missing property
    };
  });
};



export interface CustomerSegment {
  name: string;
  icon: string;
  description: string;
  count: number;
  percentage: number;
  threshold: string;
  color: string;
  action: string;
}

export interface SegmentationAnalysis {
  segments: CustomerSegment[];
  totalValue: number;
  avgCLV: number;
  total: number;
}


export const generateSegmentationAnalysis = (data: any[]): SegmentationAnalysis | null => {
  if (!data || data.length === 0) return null;


  const values = [...data.map((d) => d.clv)].sort((a, b) => a - b);
  const total = values.length;
  if (total === 0) return null;

  const median = values[Math.floor(total / 2)];
  const q3 = values[Math.floor(total * 0.75)]; // 75th percentile (top 25%)
  const q1 = values[Math.floor(total * 0.25)]; // 25th percentile (bottom 25%)

  const segments: CustomerSegment[] = [
    {
      name: 'Champions',
      icon: '👑',
      description: 'Top 25% highest value customers',
      count: Math.floor(total * 0.25),
      percentage: 25,
      threshold: `> ${formatCurrency(q3)}`,
      color: '#10B981',
      action: 'Reward & retain with VIP treatment',
    },
    {
      name: 'Loyal Customers',
      icon: '💎',
      description: 'Above median CLV, reliable spenders',
      count: Math.floor(total * 0.25),
      percentage: 25,
      threshold: `${formatCurrency(median)} - ${formatCurrency(q3)}`,
      color: '#3B82F6',
      action: 'Cross-sell & upsell opportunities',
    },
    {
      name: 'Potential Loyalists',
      icon: '📈',
      description: 'Below median, room for growth',
      count: Math.floor(total * 0.25),
      percentage: 25,
      threshold: `${formatCurrency(q1)} - ${formatCurrency(median)}`,
      color: '#F59E0B',
      action: 'Targeted engagement campaigns',
    },
    {
      name: 'At Risk',
      icon: '⚠️',
      description: 'Bottom 25%, needs attention',
      count: total - Math.floor(total * 0.75),
      percentage: 25,
      threshold: `< ${formatCurrency(q1)}`,
      color: '#EF4444',
      action: 'Win-back campaigns & support',
    },
  ];

  const totalValue = values.reduce((sum, val) => sum + val, 0);
  const avgCLV = totalValue / total;

  return { segments, totalValue, avgCLV, total };
};



export function generateTrendData(data: any[]) {
  // Generate 12 months of historical trend data
  const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return periods.map((period, index) => {
    const baseClv = 2800;
    const baseCac = 850;
    const growth = index * 0.03; // 3% growth per month
    const variance = Math.random() * 0.1 - 0.05; // ±5% random variance
    
    const avgClv = baseClv * (1 + growth + variance);
    const avgCac = baseCac * (1 + (growth * 0.5) + variance); // CAC grows slower
    
    return {
      period,
      avgClv: Math.round(avgClv),
      avgCac: Math.round(avgCac),
      ltvCacRatio: avgClv / avgCac
    };
  });
}

export function generateHistogramData(data: any[], metric: string) {
  // Generate histogram bins based on the metric
  const numBins = 10;
  const values = data.map(d => {
    switch(metric) {
      case 'clv': return d.clv || 2500 + Math.random() * 3000;
      case 'cac': return d.cac || 500 + Math.random() * 1000;
      case 'revenue': return d.revenue || 1000 + Math.random() * 5000;
      case 'mrr': return d.mrr || 100 + Math.random() * 500;
      case 'customers': return Math.floor(50 + Math.random() * 200);
      case 'retention': return 60 + Math.random() * 35;
      case 'churn': return 5 + Math.random() * 15;
      default: return 1000 + Math.random() * 2000;
    }
  });
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / numBins;
  
  const bins = Array.from({ length: numBins }, (_, i) => ({
    range: `${Math.round(min + i * binSize)}-${Math.round(min + (i + 1) * binSize)}`,
    count: 0,
    rangeStart: min + i * binSize,
    rangeEnd: min + (i + 1) * binSize
  }));
  
  // Count values in each bin
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), numBins - 1);
    bins[binIndex].count++;
  });
  
  return bins;
}



// revenue page functions 


// Data Generation Functions
export const generateRevenueQualityData = (): RevenueDataPoint[] => {
  return MONTHS.map((month, index) => {
    const recurringRevenue = 45000 + (index * 3200) + (Math.random() * 5000)
    const oneTimeRevenue = 8000 + (Math.random() * 12000)
    const totalRevenue = recurringRevenue + oneTimeRevenue
    const predictability = (recurringRevenue / totalRevenue) * 100
    const volatility = 15 + (Math.random() * 20)
    const rqi = (predictability * 0.6) + ((100 - volatility) * 0.4)
    
    return {
      month,
      recurringRevenue,
      oneTimeRevenue,
      totalRevenue,
      predictability,
      volatility,
      rqi,
      growthRate: 8 + (Math.random() * 10),
      marginExpansion: 2 + (Math.random() * 8),
    }
  })
}

export const generateZipfAnalysis = (customers: Customer[]): ZipfDataPoint[] => {
  const sortedCustomers = [...customers].sort((a, b) => b.clv - a.clv)
  
  return sortedCustomers.slice(0, 100).map((customer, index) => ({
    rank: index + 1,
    revenue: customer.clv,
    expectedZipf: sortedCustomers[0].clv / (index + 1),
    logRank: Math.log(index + 1),
    logRevenue: Math.log(customer.clv),
    plan: customer.plan,
  }))
}

export const generateBassDiffusionData = (): BassDataPoint[] => {
  const p = 0.03
  const q = 0.38
  const m = 10000
  
  return Array.from({ length: 24 }, (_, t) => {
    const time = t + 1
    const adoption = m * (1 - Math.exp(-(p + q) * time)) / (1 + (q/p) * Math.exp(-(p + q) * time))
    const revenue = adoption * 150
    const prevAdoption = t > 0 ? 
      m * (1 - Math.exp(-(p + q) * t)) / (1 + (q/p) * Math.exp(-(p + q) * t)) : 0
    const growthRate = t > 0 ? ((adoption - prevAdoption) / adoption) * 100 : 0
    
    return {
      month: time,
      cumulativeRevenue: revenue,
      monthlyRevenue: t > 0 ? revenue - (prevAdoption * 150) : revenue,
      adoptionRate: (adoption / m) * 100,
      growthRate,
      innovators: adoption * 0.025,
      imitators: adoption * 0.975,
    }
  })
}

export const generateRevenueEntropyData = (customers: Customer[]): EntropyData => {
  const segmentRevenue = SEGMENTS.map(segment => {
    const segmentCustomers = customers.filter(c => c.plan === segment)
    const revenue = segmentCustomers.reduce((sum, c) => sum + c.clv, 0)
    return { segment, revenue, count: segmentCustomers.length }
  })
  
  const totalRevenue = segmentRevenue.reduce((sum, s) => sum + s.revenue, 0)
  
  const entropy = -segmentRevenue.reduce((sum, s) => {
    const p = s.revenue / totalRevenue
    return sum + (p > 0 ? p * Math.log2(p) : 0)
  }, 0)
  
  const geoDistribution = REGIONS.map(region => ({
    region,
    revenue: totalRevenue * (0.1 + Math.random() * 0.4),
    customers: Math.floor(customers.length * (0.1 + Math.random() * 0.4)),
  }))
  
  const channelDistribution = CHANNELS.map(channel => ({
    channel,
    revenue: totalRevenue * (0.15 + Math.random() * 0.3),
    margin: 15 + Math.random() * 25,
    efficiency: 60 + Math.random() * 35,
  }))
  
  return {
    segmentRevenue,
    entropy,
    maxEntropy: Math.log2(SEGMENTS.length),
    diversificationIndex: entropy / Math.log2(SEGMENTS.length),
    geoDistribution,
    channelDistribution,
  }
}

export const generateKanoAnalysis = (): KanoFeature[] => {
  const features = [
    { name: 'Core Dashboard', category: 'Basic', satisfaction: 85, revenue_impact: 45, implementation_cost: 15 },
    { name: 'Advanced Analytics', category: 'Performance', satisfaction: 92, revenue_impact: 78, implementation_cost: 65 },
    { name: 'API Access', category: 'Performance', satisfaction: 88, revenue_impact: 85, implementation_cost: 45 },
    { name: 'White Labeling', category: 'Excitement', satisfaction: 94, revenue_impact: 95, implementation_cost: 85 },
    { name: 'Mobile App', category: 'Performance', satisfaction: 89, revenue_impact: 72, implementation_cost: 55 },
    { name: 'AI Insights', category: 'Excitement', satisfaction: 96, revenue_impact: 88, implementation_cost: 90 },
    { name: 'Data Export', category: 'Basic', satisfaction: 78, revenue_impact: 35, implementation_cost: 20 },
    { name: 'Custom Integrations', category: 'Performance', satisfaction: 91, revenue_impact: 82, implementation_cost: 70 },
  ]
  
  return features.map(feature => ({
    ...feature,
    efficiency_ratio: feature.revenue_impact / feature.implementation_cost,
    priority_score: (feature.satisfaction * 0.3) + (feature.revenue_impact * 0.5) + ((100 - feature.implementation_cost) * 0.2),
  }))
}

// Monte Carlo simulation for revenue forecasting
export const generateMonteCarloForecast = (baseMrr: number, growthRate: number, volatility: number, periods: number, simulations: number = 1000) => {
  const results = [];
  
  for (let i = 0; i < simulations; i++) {
    const path = [];
    let current = baseMrr;
    
    for (let j = 0; j < periods; j++) {
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      current = current * (1 + growthRate * randomFactor);
      path.push(current);
    }
    
    results.push(path);
  }
  
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
export const generateForecastData = () => {
  const baseMrr = 450000;
  const baseGrowth = 0.08;
  const volatility = 0.15;
  
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
    scenarioAnalysis: [
      { scenario: 'Base Case', revenue: 6850000, customers: 1650, retention: 88, probability: 60 },
      { scenario: 'Optimistic', revenue: 7820000, customers: 1850, retention: 92, probability: 25 },
      { scenario: 'Pessimistic', revenue: 5420000, customers: 1450, retention: 82, probability: 15 }
    ]
  };
};

// Custom Hooks
export const useRevenueKPIs = (data: RevenueDataPoint[]) => {
  
    if (data.length < 2) return null
    
    const currentMonth = data[data.length - 1]
    const previousMonth = data[data.length - 2]
    
    const totalRevenue = currentMonth.totalRevenue
    const revenueGrowth = ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100
    const rqi = currentMonth.rqi
    const predictability = currentMonth.predictability

    const arr = currentMonth.recurringRevenue * 12
    const nrr = 108 + Math.random() * 15

    return {
      totalRevenue,
      revenueGrowth,
      arr,
      nrr,
      rqi,
      predictability,
    }
}

export const useZipfRSquared = (zipfData: ZipfDataPoint[]) => {
 
    const n = zipfData.length
    const sumX = zipfData.reduce((sum, d) => sum + d.logRank, 0)
    const sumY = zipfData.reduce((sum, d) => sum + d.logRevenue, 0)
    const sumXY = zipfData.reduce((sum, d) => sum + (d.logRank * d.logRevenue), 0)
    const sumXX = zipfData.reduce((sum, d) => sum + (d.logRank * d.logRank), 0)
    const sumYY = zipfData.reduce((sum, d) => sum + (d.logRevenue * d.logRevenue), 0)
    
    const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    return correlation * correlation
  }




export const generateRevenueConcentrationData = (customers: Customer[]) => {
  const sorted = [...customers].sort((a, b) => b.clv - a.clv);
  const totalRevenue = sorted.reduce((sum, c) => sum + c.clv, 0);
  
  const top1Count = Math.ceil(sorted.length * 0.01);
  const top5Count = Math.ceil(sorted.length * 0.05);
  const top10Count = Math.ceil(sorted.length * 0.10);
  const top20Count = Math.ceil(sorted.length * 0.20);
  
  const top1Revenue = sorted.slice(0, top1Count).reduce((sum, c) => sum + c.clv, 0);
  const top5Revenue = sorted.slice(0, top5Count).reduce((sum, c) => sum + c.clv, 0);
  const top10Revenue = sorted.slice(0, top10Count).reduce((sum, c) => sum + c.clv, 0);
  const top20Revenue = sorted.slice(0, top20Count).reduce((sum, c) => sum + c.clv, 0);
  
  return [
    { percentile: 'Top 1%', share: (top1Revenue / totalRevenue) * 100 },
    { percentile: 'Top 5%', share: (top5Revenue / totalRevenue) * 100 },
    { percentile: 'Top 10%', share: (top10Revenue / totalRevenue) * 100 },
    { percentile: 'Top 20%', share: (top20Revenue / totalRevenue) * 100 },
  ];
}

export const generateRevenueMetrics = () => {
  return {
    volatility: 18.5,
    successProbability: 72,
    innovationCoefficient: 0.030,
    imitationCoefficient: 0.380,
    peakGrowthMonth: 8,
    qpRatio: 12.7,
    shapeParameter: 1.80,
    scaleParameter: 24,
    meanLifetime: 21.4,
    medianLifetime: 19.7
  }
}

// =============================================================================
// PRODUCT USAGE DASHBOARD GENERATORS
// =============================================================================

export interface UsageDataPoint {
  fiscalWeek: string;
  activeUsers: number;
  avgSessionDuration: number;
  featureAdoption: number;
  activationRate: number;
  retentionRate: number;
  timeToValue: number;
}

export interface FeatureData {
  name: string;
  adoption: number;
  satisfaction: number;
  timeToFirstUse: number;
  criticality: string;
  impact: string;
  trend: 'up' | 'down' | 'stable';
}

export interface UserSegment {
  segment: string;
  users: number;
  percentage: number;
  revenue: number;
  arpu: number;
  revenueShare: number;
  characteristics: string[];
  retentionRate: number;
  engagementScore: number;
  timeToValue: number;
  supportTickets: number;
}

export interface ProductInsight {
  title: string;
  type: string;
  description: string;
  action: string;
  impact: string;
  effort: string;
}

export const generateUsageData = (weeks: number): UsageDataPoint[] => {
  return Array.from({ length: weeks }, (_, i) => ({
    fiscalWeek: `W${i + 1}`,
    activeUsers: Math.floor(8000 + Math.sin(i * 0.1) * 1000 + Math.random() * 500),
    avgSessionDuration: Math.floor(18 + Math.sin(i * 0.15) * 5 + Math.random() * 3),
    featureAdoption: Math.floor(65 + Math.sin(i * 0.08) * 10 + Math.random() * 5),
    activationRate: Math.floor(75 + Math.sin(i * 0.12) * 8 + Math.random() * 4),
    retentionRate: Math.floor(82 + Math.sin(i * 0.1) * 6 + Math.random() * 3),
    timeToValue: Math.floor(12 + Math.sin(i * 0.2) * 3 + Math.random() * 2),
  }));
};

export const generateFeatureData = (): FeatureData[] => [
  { name: 'Dashboard', adoption: 89, satisfaction: 4.2, timeToFirstUse: 2, criticality: 'Core', impact: 'High', trend: 'up' },
  { name: 'Reports', adoption: 67, satisfaction: 3.8, timeToFirstUse: 7, criticality: 'Core', impact: 'High', trend: 'up' },
  { name: 'Analytics', adoption: 45, satisfaction: 4.5, timeToFirstUse: 14, criticality: 'Growth', impact: 'Medium', trend: 'up' },
  { name: 'Integrations', adoption: 34, satisfaction: 3.9, timeToFirstUse: 21, criticality: 'Retention', impact: 'High', trend: 'stable' },
  { name: 'Automation', adoption: 28, satisfaction: 4.1, timeToFirstUse: 28, criticality: 'Growth', impact: 'Medium', trend: 'down' },
  { name: 'API Access', adoption: 15, satisfaction: 4.3, timeToFirstUse: 35, criticality: 'Power User', impact: 'Low', trend: 'up' },
];

export const generateUserSegments = (): UserSegment[] => [
  { 
    segment: 'Champions', 
    users: 850, 
    percentage: 8.5,
    revenue: 425000,
    arpu: 500,
    revenueShare: 42.5,
    characteristics: ['High usage', 'Feature advocates', 'Willing to pay premium'],
    retentionRate: 95,
    engagementScore: 9.2,
    timeToValue: 3,
    supportTickets: 0.2,
  },
  { 
    segment: 'Power Users', 
    users: 1200, 
    percentage: 12,
    revenue: 300000,
    arpu: 250,
    revenueShare: 30,
    characteristics: ['Deep feature usage', 'Custom workflows', 'Integration heavy'],
    retentionRate: 88,
    engagementScore: 8.1,
    timeToValue: 5,
    supportTickets: 0.8,
  },
  { 
    segment: 'Regular Users', 
    users: 4500, 
    percentage: 45,
    revenue: 225000,
    arpu: 50,
    revenueShare: 22.5,
    characteristics: ['Core feature usage', 'Steady engagement', 'Price sensitive'],
    retentionRate: 72,
    engagementScore: 6.5,
    timeToValue: 8,
    supportTickets: 1.2,
  },
  { 
    segment: 'Casual Users', 
    users: 2450, 
    percentage: 24.5,
    revenue: 49000,
    arpu: 20,
    revenueShare: 4.9,
    characteristics: ['Basic usage', 'Infrequent sessions', 'Free tier mostly'],
    retentionRate: 45,
    engagementScore: 3.8,
    timeToValue: 15,
    supportTickets: 2.1,
  },
  { 
    segment: 'At Risk', 
    users: 1000, 
    percentage: 10,
    revenue: 10000,
    arpu: 10,
    revenueShare: 1,
    characteristics: ['Declining usage', 'Support issues', 'Churn candidates'],
    retentionRate: 20,
    engagementScore: 2.1,
    timeToValue: 25,
    supportTickets: 4.5,
  },
];

export const generateProductInsights = (): ProductInsight[] => [
  {
    title: "Champion Segment Opportunity",
    type: "growth",
    description: "Champions represent 8.5% of users but drive 42.5% of revenue. Focus on expanding this segment through referral programs and advanced features.",
    action: "Launch champion advocacy program",
    impact: "High",
    effort: "Medium"
  },
  {
    title: "Feature Adoption Gap",
    type: "product",
    description: "Analytics feature has 45% adoption but 4.5/5 satisfaction. This suggests a discoverability problem, not a quality issue.",
    action: "Improve onboarding flow for Analytics",
    impact: "Medium",
    effort: "Low"
  },
  {
    title: "At-Risk Segment Alert",
    type: "retention",
    description: "10% of users are at churn risk with 4.5 support tickets per user. Proactive intervention needed.",
    action: "Deploy retention campaign",
    impact: "High",
    effort: "High"
  },
  {
    title: "Time to Value Optimization",
    type: "onboarding",
    description: "Current TTV is 12 days. Champions achieve value in 3 days. Optimize onboarding for faster activation.",
    action: "Redesign first-time user experience",
    impact: "High",
    effort: "Medium"
  }
];

// Retention page data and functions

// Add to existing interfaces in fakeData.ts
export interface SegmentData {
  [key: string]: {
    name: string;
    description: string;
    segments: Segment[];
  };
}

export interface Segment {
  id: string;
  name: string;
  totalCustomers: number;
  avgMrr: number;
  avgClv: number;
  retentionRate: number;
  subSegments: SubSegment[];
}

export interface SubSegment {
  id: string;
  name: string;
  riskLevel: 'high' | 'medium' | 'low';
  customers: number;
  churnRisk: number;
  predictedChurn: number;
  avgMrr: number;
  recommendedEffort: 'intensive' | 'moderate' | 'light' | 'minimal';
  intervention: string;
  effortCost: 'high' | 'medium' | 'low' | 'very-low';
  expectedImpact: string;
}

export interface InterventionStrategy {
  name: string;
  effort: 'intensive' | 'moderate' | 'light' | 'minimal';
  cost: 'high' | 'medium' | 'low' | 'very-low';
  action: string;
  channel: string;
  frequency: string;
  team: string;
  costPerCustomer: number;
  expectedSuccess: number;
}

export interface SegmentProjection {
  segment: string;
  current: number;
  projected: number;
  growth: number;
  risk: string;
}

// Add these functions to fakeData.ts
export const generateSegments = (): SegmentData => {
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
              riskLevel: 'high',
              customers: 15,
              churnRisk: 68,
              predictedChurn: 10,
              avgMrr: 625,
              recommendedEffort: 'intensive',
              intervention: 'executive_outreach',
              effortCost: 'high',
              expectedImpact: '85% retention boost'
            },
            {
              id: 'platinum-medium-risk',
              name: 'Medium Risk Platinum',
              riskLevel: 'medium',
              customers: 45,
              churnRisk: 32,
              predictedChurn: 14,
              avgMrr: 595,
              recommendedEffort: 'moderate',
              intervention: 'priority_support',
              effortCost: 'medium',
              expectedImpact: '70% retention boost'
            },
            {
              id: 'platinum-low-risk',
              name: 'Low Risk Platinum',
              riskLevel: 'low',
              customers: 120,
              churnRisk: 8,
              predictedChurn: 10,
              avgMrr: 575,
              recommendedEffort: 'light',
              intervention: 'proactive_checkin',
              effortCost: 'low',
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
              riskLevel: 'high',
              customers: 63,
              churnRisk: 72,
              predictedChurn: 45,
              avgMrr: 265,
              recommendedEffort: 'moderate',
              intervention: 'personalized_offer',
              effortCost: 'medium',
              expectedImpact: '65% retention boost'
            },
            {
              id: 'gold-medium-risk',
              name: 'Medium Risk Gold',
              riskLevel: 'medium',
              customers: 168,
              churnRisk: 38,
              predictedChurn: 64,
              avgMrr: 290,
              recommendedEffort: 'light',
              intervention: 'targeted_email',
              effortCost: 'low',
              expectedImpact: '55% retention boost'
            },
            {
              id: 'gold-low-risk',
              name: 'Low Risk Gold',
              riskLevel: 'low',
              customers: 189,
              churnRisk: 12,
              predictedChurn: 23,
              avgMrr: 295,
              recommendedEffort: 'minimal',
              intervention: 'automated_checkin',
              effortCost: 'very-low',
              expectedImpact: '90% retention rate'
            }
          ]
        },
        {
          id: 'silver',
          name: 'Silver Tier',
          totalCustomers: 850,
          avgMrr: 145,
          avgClv: 2250,
          retentionRate: 78,
          subSegments: [
            {
              id: 'silver-high-risk',
              name: 'High Risk Silver',
              riskLevel: 'high',
              customers: 170,
              churnRisk: 65,
              predictedChurn: 110,
              avgMrr: 135,
              recommendedEffort: 'light',
              intervention: 'group_webinar',
              effortCost: 'low',
              expectedImpact: '45% retention boost'
            },
            {
              id: 'silver-medium-risk',
              name: 'Medium Risk Silver',
              riskLevel: 'medium',
              customers: 425,
              churnRisk: 28,
              predictedChurn: 119,
              avgMrr: 148,
              recommendedEffort: 'minimal',
              intervention: 'newsletter_series',
              effortCost: 'very-low',
              expectedImpact: '35% retention boost'
            },
            {
              id: 'silver-low-risk',
              name: 'Low Risk Silver',
              riskLevel: 'low',
              customers: 255,
              churnRisk: 8,
              predictedChurn: 20,
              avgMrr: 152,
              recommendedEffort: 'minimal',
              intervention: 'automated_checkin',
              effortCost: 'very-low',
              expectedImpact: '85% retention rate'
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
          avgClv: 6850,
          retentionRate: 94,
          subSegments: [
            {
              id: 'power-declining',
              name: 'Declining Usage',
              riskLevel: 'high',
              customers: 48,
              churnRisk: 75,
              predictedChurn: 36,
              avgMrr: 395,
              recommendedEffort: 'intensive',
              intervention: 'success_manager',
              effortCost: 'high',
              expectedImpact: '80% retention boost'
            },
            {
              id: 'power-stable',
              name: 'Stable Usage',
              riskLevel: 'medium',
              customers: 192,
              churnRisk: 25,
              predictedChurn: 48,
              avgMrr: 420,
              recommendedEffort: 'moderate',
              intervention: 'feature_education',
              effortCost: 'medium',
              expectedImpact: '60% retention boost'
            },
            {
              id: 'power-growing',
              name: 'Growing Usage',
              riskLevel: 'low',
              customers: 80,
              churnRisk: 5,
              predictedChurn: 4,
              avgMrr: 425,
              recommendedEffort: 'light',
              intervention: 'proactive_checkin',
              effortCost: 'low',
              expectedImpact: '98% retention rate'
            }
          ]
        }
      ]
    },
    'tenure-based': {
      name: 'Tenure-based Segments',
      description: 'Segmented by customer tenure and lifecycle stage',
      segments: [
        {
          id: 'new-customers',
          name: 'New Customers (<3 months)',
          totalCustomers: 280,
          avgMrr: 198,
          avgClv: 2850,
          retentionRate: 72,
          subSegments: [
            {
              id: 'new-struggling',
              name: 'Onboarding Struggles',
              riskLevel: 'high',
              customers: 84,
              churnRisk: 80,
              predictedChurn: 67,
              avgMrr: 185,
              recommendedEffort: 'intensive',
              intervention: 'onboarding_assist',
              effortCost: 'high',
              expectedImpact: '75% retention boost'
            },
            {
              id: 'new-engaged',
              name: 'Engaged New Users',
              riskLevel: 'medium',
              customers: 140,
              churnRisk: 35,
              predictedChurn: 49,
              avgMrr: 205,
              recommendedEffort: 'moderate',
              intervention: 'success_path',
              effortCost: 'medium',
              expectedImpact: '65% retention boost'
            },
            {
              id: 'new-thriving',
              name: 'Thriving New Users',
              riskLevel: 'low',
              customers: 56,
              churnRisk: 10,
              predictedChurn: 6,
              avgMrr: 210,
              recommendedEffort: 'light',
              intervention: 'welcome_series',
              effortCost: 'low',
              expectedImpact: '95% retention rate'
            }
          ]
        }
      ]
    },
    'geography-based': {
      name: 'Geography-based Segments',
      description: 'Segmented by geographic regions and local markets',
      segments: [
        {
          id: 'north-america',
          name: 'North America',
          totalCustomers: 620,
          avgMrr: 345,
          avgClv: 5200,
          retentionRate: 89,
          subSegments: [
            {
              id: 'na-enterprise',
              name: 'Enterprise NA',
              riskLevel: 'high',
              customers: 62,
              churnRisk: 45,
              predictedChurn: 28,
              avgMrr: 895,
              recommendedEffort: 'intensive',
              intervention: 'executive_outreach',
              effortCost: 'high',
              expectedImpact: '85% retention boost'
            },
            {
              id: 'na-smb',
              name: 'SMB NA',
              riskLevel: 'medium',
              customers: 372,
              churnRisk: 25,
              predictedChurn: 93,
              avgMrr: 285,
              recommendedEffort: 'moderate',
              intervention: 'business_review',
              effortCost: 'medium',
              expectedImpact: '60% retention boost'
            },
            {
              id: 'na-startup',
              name: 'Startup NA',
              riskLevel: 'low',
              customers: 186,
              churnRisk: 8,
              predictedChurn: 15,
              avgMrr: 195,
              recommendedEffort: 'light',
              intervention: 'growth_tips',
              effortCost: 'low',
              expectedImpact: '92% retention rate'
            }
          ]
        }
      ]
    }
  }
}

export const generateDetailedForecastData = () => {
  return {
    segmentProjections: [
      { segment: 'Platinum Tier', current: 180, projected: 195, growth: 8.3, risk: 'Low' },
      { segment: 'Gold Tier', current: 420, projected: 445, growth: 6.0, risk: 'Medium' },
      { segment: 'Silver Tier', current: 850, projected: 890, growth: 4.7, risk: 'Medium' },
      { segment: 'Power Users', current: 320, projected: 355, growth: 10.9, risk: 'Low' },
      { segment: 'New Customers', current: 280, projected: 320, growth: 14.3, risk: 'High' },
      { segment: 'North America', current: 620, projected: 680, growth: 9.7, risk: 'Low' }
    ]
  }
}

export const generateInterventionStrategies = (): { [key: string]: InterventionStrategy } => {
  return {
    'executive_outreach': {
      name: 'Executive Relationship Building',
      effort: 'intensive',
      cost: 'high',
      action: 'Personalized outreach from C-level executives with customized solutions and relationship building',
      channel: 'Direct Phone & Video',
      frequency: 'Weekly for 4 weeks',
      team: 'Executive Team',
      costPerCustomer: 250,
      expectedSuccess: 85
    },
    'priority_support': {
      name: 'Priority Customer Success',
      effort: 'moderate',
      cost: 'medium',
      action: 'Dedicated success manager with proactive support and quarterly business reviews',
      channel: 'Email & Video Calls',
      frequency: 'Bi-weekly for 8 weeks',
      team: 'Customer Success',
      costPerCustomer: 125,
      expectedSuccess: 70
    },
    'proactive_checkin': {
      name: 'Proactive Health Check',
      effort: 'light',
      cost: 'low',
      action: 'Automated health scoring with proactive outreach for at-risk customers',
      channel: 'Email & In-app',
      frequency: 'Monthly for 3 months',
      team: 'Automated + CS',
      costPerCustomer: 35,
      expectedSuccess: 55
    },
    'personalized_offer': {
      name: 'Personalized Retention Offer',
      effort: 'moderate',
      cost: 'medium',
      action: 'Customized discount or feature bundle based on usage patterns and needs',
      channel: 'Email & Phone',
      frequency: 'One-time targeted',
      team: 'Sales & Marketing',
      costPerCustomer: 85,
      expectedSuccess: 65
    },
    'targeted_email': {
      name: 'Targeted Email Campaign',
      effort: 'light',
      cost: 'low',
      action: 'Personalized email sequence highlighting relevant features and success stories',
      channel: 'Email',
      frequency: 'Weekly for 4 weeks',
      team: 'Marketing',
      costPerCustomer: 25,
      expectedSuccess: 45
    },
    'group_webinar': {
      name: 'Group Education Webinar',
      effort: 'light',
      cost: 'low',
      action: 'Invitation to specialized webinar addressing common challenges and best practices',
      channel: 'Video & Email',
      frequency: 'One-time event',
      team: 'Customer Education',
      costPerCustomer: 15,
      expectedSuccess: 35
    },
    'newsletter_series': {
      name: 'Educational Newsletter Series',
      effort: 'minimal',
      cost: 'very-low',
      action: 'Automated newsletter series with tips, best practices, and feature highlights',
      channel: 'Email',
      frequency: 'Weekly for 6 weeks',
      team: 'Marketing Automation',
      costPerCustomer: 8,
      expectedSuccess: 25
    },
    'automated_checkin': {
      name: 'Automated Check-in',
      effort: 'minimal',
      cost: 'very-low',
      action: 'Automated check-in messages with resource recommendations based on usage',
      channel: 'In-app & Email',
      frequency: 'Monthly ongoing',
      team: 'Automated',
      costPerCustomer: 5,
      expectedSuccess: 20
    },
    'success_manager': {
      name: 'Dedicated Success Manager',
      effort: 'intensive',
      cost: 'high',
      action: 'Assigned success manager with regular strategic reviews and personalized guidance',
      channel: 'Video & Phone',
      frequency: 'Weekly for 6 weeks',
      team: 'Customer Success',
      costPerCustomer: 300,
      expectedSuccess: 80
    },
    'feature_education': {
      name: 'Advanced Feature Education',
      effort: 'moderate',
      cost: 'medium',
      action: 'Personalized training sessions on underutilized features that drive value',
      channel: 'Video & Documentation',
      frequency: '3 sessions over 3 weeks',
      team: 'Customer Education',
      costPerCustomer: 95,
      expectedSuccess: 60
    },
    'onboarding_assist': {
      name: 'Enhanced Onboarding Assistance',
      effort: 'intensive',
      cost: 'high',
      action: 'Extended onboarding with dedicated specialist and customized implementation plan',
      channel: 'Video & Screen Share',
      frequency: 'Daily first week, then weekly',
      team: 'Onboarding Specialists',
      costPerCustomer: 200,
      expectedSuccess: 75
    },
    'success_path': {
      name: 'Success Path Implementation',
      effort: 'moderate',
      cost: 'medium',
      action: 'Structured success path with milestones, check-ins, and achievement tracking',
      channel: 'Email & In-app',
      frequency: 'Bi-weekly for 8 weeks',
      team: 'Customer Success',
      costPerCustomer: 75,
      expectedSuccess: 65
    },
    'welcome_series': {
      name: 'Enhanced Welcome Series',
      effort: 'light',
      cost: 'low',
      action: 'Extended welcome sequence with social proof, case studies, and quick wins',
      channel: 'Email',
      frequency: '3 times per week for 3 weeks',
      team: 'Marketing',
      costPerCustomer: 20,
      expectedSuccess: 50
    },
    'business_review': {
      name: 'Business Value Review',
      effort: 'moderate',
      cost: 'medium',
      action: 'Comprehensive review of ROI, value realization, and optimization opportunities',
      channel: 'Video Conference',
      frequency: 'Quarterly',
      team: 'Customer Success',
      costPerCustomer: 100,
      expectedSuccess: 60
    },
    'growth_tips': {
      name: 'Growth Optimization Tips',
      effort: 'light',
      cost: 'low',
      action: 'Personalized recommendations for scaling usage and maximizing value',
      channel: 'Email & In-app',
      frequency: 'Monthly',
      team: 'Product & Marketing',
      costPerCustomer: 15,
      expectedSuccess: 40
    }
  }
}

export const generateEffortLevels = () => {
  return {
    'intensive': { label: 'Intensive', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: Zap },
    'moderate': { label: 'Moderate', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100', icon: Target },
    'light': { label: 'Light', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100', icon: Clock },
    'minimal': { label: 'Minimal', color: 'bg-green-100 text-green-800 hover:bg-green-100', icon: Check }
  }
}

export const generateRiskLevels = () => {
  return {
    'high': { label: 'High Risk', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: AlertTriangle },
    'medium': { label: 'Medium Risk', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100', icon: Shield },
    'low': { label: 'Low Risk', color: 'bg-green-100 text-green-800 hover:bg-green-100', icon: Star }
  }
}

// Cohort Analysis Data
export interface CohortData {
  cohort: string;
  initialCustomers: number;
  totalRevenue: number;
  retention: {
    period: string;
    rate: number;
    customers: number;
    revenue: number;
  }[];
}

export const generateQuarterlyCohortData = (customers: any[]): CohortData[] => {
  const cohorts = ['2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3']
  
  return cohorts.map((cohort, index) => {
    const baseCustomers = 200 + Math.floor(Math.random() * 100)
    const baseRevenue = baseCustomers * (250 + Math.floor(Math.random() * 200))
    
    return {
      cohort,
      initialCustomers: baseCustomers,
      totalRevenue: baseRevenue,
      retention: Array.from({ length: 5 }, (_, i) => {
        const period = `Month ${i + 1}`
        const decay = Math.pow(0.85, i) * (0.9 + Math.random() * 0.1)
        const rate = Math.round(decay * 100)
        const customers = Math.round(baseCustomers * decay)
        const revenue = Math.round(baseRevenue * decay * (0.8 + Math.random() * 0.4))
        
        return {
          period,
          rate,
          customers,
          revenue
        }
      })
    }
  })
}



// =============================================================================
// CRM & MARKETING ATTRIBUTION GENERATORS
// =============================================================================

export interface CRMCustomer {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  industry: string;
  clv: number;
  joinDate: Date;
}

export interface CRMDataPoint {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  industry: string;
  clv: number;
  joinDate: Date;
  acquisitionChannel: string;
  campaign: string;
  touchpoints: number;
  cac: number;
  ltv: number;
  engagementScore: number;
  totalLeadScore: number;
}

export interface MixDataPoint {
  month: string;
  totalSpend: number;
  totalLeads: number;
  totalRevenue: number;
  cac: number;
  roas: number;
  efficiency: number;
}

export interface ShapleyDataPoint {
  channel: string;
  shapleyValue: number;
  conversions: number;
  revenue: number;
  avgOrderValue: number;
  contributionPercentage: number;
}

export interface AIDataPoint {
  feature: string;
  importance: number;
  correlation: number;
  dataQuality: number;
  predictivePower: number;
  category: string;
}

export interface MarkovDataPoint {
  touchpoint: string;
  conversionProbability: number;
  dropoffProbability: number;
  progressProbability: number;
  expectedValue: number;
  visitors: number;
}

export const generateCRMCustomers = (count: number = 1000): CRMCustomer[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    company: ['TechCorp', 'DataFlow', 'CloudSync', 'DevTools', 'AILabs'][Math.floor(seededRandom(12345 + i) * 5)],
    plan: ['Starter', 'Professional', 'Enterprise', 'Trial'][Math.floor(seededRandom(12346 + i) * 4)],
    industry: ['Technology', 'Finance', 'Healthcare', 'Retail'][Math.floor(seededRandom(12347 + i) * 4)],
    clv: 1000 + seededRandom(12348 + i) * 4000,
    joinDate: new Date(2024, Math.floor(seededRandom(12349 + i) * 12), Math.floor(seededRandom(12350 + i) * 28)),
  }))
}

export const generateCRMData = (count: number = 1000): CRMDataPoint[] => {
  const customers = generateCRMCustomers(count);
  const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'];
  const campaigns = ['Q4 Growth', 'Holiday Special', 'Feature Launch', 'Retargeting'];
  
  return customers.map((customer, i) => {
    const customerSeed = 54321 + i;
    
    return {
      ...customer,
      acquisitionChannel: channels[Math.floor(seededRandom(customerSeed) * channels.length)],
      campaign: campaigns[Math.floor(seededRandom(customerSeed + 1) * campaigns.length)],
      touchpoints: Math.floor(1 + seededRandom(customerSeed + 2) * 12),
      cac: 50 + seededRandom(customerSeed + 3) * 400,
      ltv: customer.clv,
      engagementScore: seededRandom(customerSeed + 4) * 100,
      totalLeadScore: seededRandom(customerSeed + 5) * 100,
    };
  });
}

export const generateMixData = (): MixDataPoint[] => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map((month, index) => {
      const baseSeasonality = 1 + 0.3 * Math.sin(2 * Math.PI * index / 12);
      const monthRandom = seededRandom(67890 + index);
      const totalSpend = (15000 + monthRandom * 10000) * baseSeasonality;
      const totalLeads = (totalSpend / 75) + seededRandom(67891 + index) * 50;
      const totalRevenue = totalLeads * (200 + seededRandom(67892 + index) * 100) * baseSeasonality;
      
      return {
        month,
        totalSpend,
        totalLeads,
        totalRevenue,
        cac: totalSpend / totalLeads,
        roas: totalRevenue / totalSpend,
        efficiency: (totalLeads / totalSpend) * 1000,
      };
    });
}

export const generateShapleyData = (): ShapleyDataPoint[] => {
  const crmData = generateCRMData(1000);
  const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'];
  
  const shapleyData = channels.map(channel => {
    const channelCustomers = crmData.filter(c => c.acquisitionChannel === channel);
    const totalRevenue = channelCustomers.reduce((sum, c) => sum + c.ltv, 0);
    return {
      channel,
      shapleyValue: totalRevenue,
      conversions: channelCustomers.length,
      revenue: totalRevenue,
      avgOrderValue: totalRevenue / channelCustomers.length || 0,
      contributionPercentage: 0,
    };
  });
  
  const totalShapley = shapleyData.reduce((sum, c) => sum + c.shapleyValue, 0);
  
  return shapleyData.map(channel => ({
    ...channel,
    contributionPercentage: totalShapley > 0 ? (channel.shapleyValue / totalShapley) * 100 : 0
  }));
}

export const generateAIData = (): AIDataPoint[] => {
  const features = [
    { name: 'Email Engagement', category: 'Behavioral' },
    { name: 'Website Behavior', category: 'Behavioral' },
    { name: 'Company Size', category: 'Firmographic' },
    { name: 'Industry Match', category: 'Firmographic' },
    { name: 'Geographic Fit', category: 'Demographic' },
    { name: 'Job Title Relevance', category: 'Demographic' },
  ];
  
  return features.map((feature, i) => ({
    feature: feature.name,
    importance: seededRandom(98765 + i) * 100,
    correlation: -0.5 + seededRandom(98766 + i),
    dataQuality: 60 + seededRandom(98767 + i) * 40,
    predictivePower: seededRandom(98768 + i) * 100,
    category: feature.category
  })).sort((a, b) => b.predictivePower - a.predictivePower);
}

export const generateMarkovData = (): MarkovDataPoint[] => {
  const touchpoints = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase', 'Retention'];
  
  return touchpoints.map((touchpoint, index) => {
    const conversionProbability = Math.max(0, 0.1 + (index * 0.15) + seededRandom(13579 + index) * 0.1);
    const dropoffProbability = Math.max(0, 0.3 - (index * 0.05) + seededRandom(13580 + index) * 0.1);
    
    return {
      touchpoint,
      conversionProbability: conversionProbability * 100,
      dropoffProbability: dropoffProbability * 100,
      progressProbability: Math.max(0, (1 - conversionProbability - dropoffProbability)) * 100,
      expectedValue: conversionProbability * 2000,
      visitors: Math.floor(1000 * Math.pow(0.7, index)),
    };
  });
};



// Add this to your fakeData.ts file, at the bottom
export const generateFakeInsights = (mixData: any[]) => {
  const currentMonth = mixData[mixData.length - 1];
  const previousMonth = mixData[mixData.length - 2];
  
  return [
    {
      id: 1,
      title: "Social Media Efficiency",
      description: `Social channels showing ${currentMonth.roas > (previousMonth?.roas || 3) ? 'improving' : 'declining'} ROAS at ${currentMonth.roas.toFixed(1)}x`,
      impact: "high",
      type: "opportunity"
    },
    {
      id: 2,
      title: "Search Spend Optimization",
      description: `Consider reallocating ${formatCurrency(currentMonth.totalSpend * 0.15)} from underperforming keywords to top performers`,
      impact: "medium", 
      type: "optimization"
    },
    {
      id: 3,
      title: "Seasonal Trend Detected",
      description: `${currentMonth.month} shows ${currentMonth.conversionRate > (previousMonth?.conversionRate || 2.5) ? 'strong' : 'weak'} conversion performance`,
      impact: "low",
      type: "trend"
    }
  ];
};


// CRM Dashboard Data Generators
export const generateCRMInsights = (mixData: any[]) => {
  const currentMonth = mixData[mixData.length - 1];
  const previousMonth = mixData[mixData.length - 2];
  
  return [
    {
      id: 1,
      title: "Social Media Efficiency",
      description: `Social channels showing ${currentMonth.roas > (previousMonth?.roas || 3) ? 'improving' : 'declining'} ROAS at ${currentMonth.roas.toFixed(1)}x`,
      impact: "high",
      type: "opportunity"
    },
    {
      id: 2,
      title: "Search Spend Optimization",
      description: `Consider reallocating ${formatCurrency(currentMonth.totalSpend * 0.15)} from underperforming keywords to top performers`,
      impact: "medium", 
      type: "optimization"
    },
    {
      id: 3,
      title: "Seasonal Trend Detected",
      description: `${currentMonth.month} shows ${currentMonth.totalRevenue > (previousMonth?.totalRevenue || 0) ? 'strong' : 'weak'} conversion performance`,
      impact: "low",
      type: "trend"
    }
  ];
};

export const generateCRMRecommendations = (shapleyData: any[], aiData: any[], mixData: any[]) => {
  const channelPerformance = shapleyData.map(channel => {
    const estimatedROAS = channel.revenue / (channel.conversions * 150);
    return {
      channel: channel.channel,
      roas: estimatedROAS,
    };
  }).sort((a, b) => b.roas - a.roas);

  return [
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
};