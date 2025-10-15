// src/lib/fakeData.ts
import { faker } from '@faker-js/faker'
import { formatTimeLabel, seededRandom, calculateTrend, calculateMean, calculateStandardDeviation, formatCurrency } from '@/lib/utils';


// =============================================================================
// INTERFACES
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

// Add this function to fakeData.ts (deterministic version)
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
// LEGACY FUNCTIONS (KEEPING FOR BACKWARD COMPATIBILITY)
// =============================================================================

export const generateCohortData = (baseData: any[]) => {
  const cohorts = ['Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023'];
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
function gamma(z: number) {
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
      rank: ((i + 1) / sorted.length) * 100,      // customer percentile (0–100)
      clv: d.clv,                                 // individual CLV
      cumulative: (cumulative / total) * 100      // cumulative % of total CLV
    };
  });
};


// Add these interfaces
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

// Add this function
export const generateSegmentationAnalysis = (data: any[]): SegmentationAnalysis | null => {
  if (!data || data.length === 0) return null;

  // Safe copy before sorting
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


// Add to fakeData.ts

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