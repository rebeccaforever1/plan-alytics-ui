// src/lib/fakeData.ts
import { faker } from '@faker-js/faker'

// Helper functions
const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const generateCLVData = () => {
  let seedCounter = 54321;
  const random = () => seededRandom(seedCounter++);
  
  return {
    clv: 1000 + random() * 3000,
    clvChange: -20 + random() * 40,
    // ... all your CLV data
  }
}

function calculateMean(values: number[]) {
  return values.reduce((acc, val) => acc + val, 0) / values.length;
}

function calculateStandardDeviation(values: number[]) {
  const mean = calculateMean(values);
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(calculateMean(squareDiffs));
}

function gamma(z: number) {
  // Lanczos approximation for positive real numbers
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

// Core customer data generation
export function generateFakeCustomers(count: number) {
  return Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    totalSpend: faker.number.int({ min: 100, max: 10000 }),
    subscriptionAge: faker.number.int({ min: 1, max: 36 }), // months
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

// Executive Dashboard Data Generators
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

// Other data generators (unchanged from your original)
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

export const generateSubscriptionData = (periods: number) => {
  return Array.from({ length: periods }).map((_, i) => {
    const baseSubscribers = 10000 + i * 150;
    const newSubscriptions = Math.floor(500 + Math.random() * 200);
    const churn = Math.floor(300 + Math.random() * 150);
    const reactivations = Math.floor(50 + Math.random() * 40);
    
    const totalSubscribers = baseSubscribers + newSubscriptions - churn + reactivations;
    
    const basicSubs = Math.floor(totalSubscribers * 0.6);
    const proSubs = Math.floor(totalSubscribers * 0.3);
    const enterpriseSubs = totalSubscribers - basicSubs - proSubs;
    
    const mrr = (basicSubs * 29) + (proSubs * 79) + (enterpriseSubs * 199);
    const arpu = mrr / totalSubscribers;
    
    return {
      fiscalWeek: `Week ${i + 1}`,
      totalSubscribers,
      newSubscriptions,
      churn,
      reactivations,
      mrr,
      arpu,
      acquisitionCost: 50 + Math.random() * 30,
      conversionRate: 5 + Math.random() * 3,
      churnRate: (churn / totalSubscribers) * 100,
      retentionRate: 100 - (churn / totalSubscribers) * 100,
      reactivationRate: (reactivations / (churn + 1)) * 100,
      winbackCost: 75 + Math.random() * 50,
      plan: i % 3 === 0 ? 'Basic' : i % 3 === 1 ? 'Pro' : 'Enterprise',
    };
  });
};

export const generateUsageData = (periods: number) => {
  return Array.from({ length: periods }).map((_, i) => {
    const growthFactor = 1 + (i * 0.01);
    
    return {
      fiscalWeek: `Week ${i + 1}`,
      activeUsers: Math.floor(5000 * growthFactor + Math.random() * 500),
      avgSessionDuration: Math.floor(15 + Math.random() * 10),
      featureAdoption: 30 + Math.random() * 40,
      activationRate: 60 + Math.random() * 20,
      retentionRate: 85 + Math.random() * 10,
      sessionsPerUser: 3 + Math.random() * 4,
    };
  });
};

export const generateUserSegments = () => {
  return [
    {
      segment: 'Loyalists',
      users: 1250,
      revenue: 125000,
      revenueShare: 0.45,
      arpu: 100,
      engagement: Array.from({ length: 50 }).map(() => ({
        frequency: 12 + Math.random() * 8,
        depth: 8 + Math.random() * 2,
        value: 300 + Math.random() * 200,
      })),
    },
    {
      segment: 'Power Users',
      users: 2500,
      revenue: 100000,
      revenueShare: 0.36,
      arpu: 40,
      engagement: Array.from({ length: 50 }).map(() => ({
        frequency: 6 + Math.random() * 4,
        depth: 6 + Math.random() * 3,
        value: 150 + Math.random() * 100,
      })),
    },
    {
      segment: 'Casual Users',
      users: 5000,
      revenue: 40000,
      revenueShare: 0.14,
      arpu: 8,
      engagement: Array.from({ length: 50 }).map(() => ({
        frequency: 3 + Math.random() * 3,
        depth: 3 + Math.random() * 2,
        value: 50 + Math.random() * 30,
      })),
    },
    {
      segment: 'At Risk',
      users: 2000,
      revenue: 10000,
      revenueShare: 0.04,
      arpu: 5,
      engagement: Array.from({ length: 50 }).map(() => ({
        frequency: 1 + Math.random() * 2,
        depth: 1 + Math.random() * 1,
        value: 20 + Math.random() * 15,
      })),
    },
    {
      segment: 'Dormant',
      users: 1000,
      revenue: 2000,
      revenueShare: 0.01,
      arpu: 2,
      engagement: Array.from({ length: 20 }).map(() => ({
        frequency: 0.5 + Math.random() * 0.5,
        depth: 0.5 + Math.random() * 0.5,
        value: 5 + Math.random() * 5,
      })),
    },
  ];
};

export const generateFakeData = () => {
  let seedCounter = 12345;
  const random = () => seededRandom(seedCounter++);
  
  const customers = generateFakeCustomers(1000);
  // Add other data generation as needed
  
  return { customers };
}