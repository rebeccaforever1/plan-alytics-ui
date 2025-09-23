'use client'

import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverviewTab from './tabs/OverviewTab'
import PredictionTab from './tabs/PredictionTab'
import HeterogeneityTab from './tabs/HeterogeneityTab'
import SegmentsTab from './tabs/SegmentsTab'
import AdvancedModelsTab from './tabs/AdvancedModelsTab'
import DefinitionsTab from './tabs/DefinitionsTab'

import { generateFakeCustomers, generateCLVModelData } from '@/lib/fakeData'
import { seededRandom, formatTimeLabel } from '@/lib/utils' // move helpers into utils

export default function CLVPage() {
  const customers = useMemo(() => generateFakeCustomers(365), [])
  const [timeframe, setTimeframe] = useState('6m')
  const [metric, setMetric] = useState('clv')

  const clvData = useMemo(() => {
    let length = 52
    if (timeframe === 'daily') length = 90
    else if (timeframe === 'monthly') length = 12

    return customers.slice(0, length).map((c, i) => {
      const customerSeed = 12345 + i
      let seedCounter = customerSeed
      const random = () => seededRandom(seedCounter++)
      return {
        fiscalWeek: formatTimeLabel(i, timeframe),
        clv: c.clv,
        cac: c.clv * (0.2 + random() * 0.3),
        revenue: c.clv * 0.75 + random() * 50,
        baseline: c.clv * 0.95 + random() * 50,
        plan: c.plan,
        usageScore: c.usageScore,
        customers: Math.floor(50 + random() * 50),
        retention: 85 + random() * 15,
        churn: 5 + random() * 10,
        frequency: 2 + random() * 2,
        monetary: c.clv / 12,
      }
    })
  }, [timeframe, customers])

  const modelData = useMemo(() => generateCLVModelData(customers), [customers])


   return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Lifetime Value Analysis</h1>
          <p className="text-muted-foreground">
           Advanced probabilistic modeling of customer value with heterogeneity analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-4"></div>
</div>

      <Tabs defaultValue="overview">
        <TabsList className="flex overflow-x-auto md:grid md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="heterogeneity">Heterogeneity</TabsTrigger>
          <TabsTrigger value="segments">Segmentation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Models</TabsTrigger>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            clvData={clvData}
            modelData={modelData}
            metric={metric}
            setMetric={setMetric}
          />
        </TabsContent>

        <TabsContent value="prediction">
          <PredictionTab clvData={clvData} modelData={modelData} metric={metric} timeframe={timeframe} />
        </TabsContent>

        <TabsContent value="heterogeneity">
          <HeterogeneityTab clvData={clvData} modelData={modelData} />
        </TabsContent>

        <TabsContent value="segments">
          <SegmentsTab clvData={clvData} modelData={modelData} />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedModelsTab clvData={clvData} modelData={modelData} metric={metric} />
        </TabsContent>

        <TabsContent value="definitions">
          <DefinitionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
