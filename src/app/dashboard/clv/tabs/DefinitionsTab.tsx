'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, Sigma, Layers } from 'lucide-react'

function DefinitionsTab() {
  const glossary = [
    {
      category: 'Core Metrics',
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
      terms: [
        {
          term: 'CLV (Customer Lifetime Value)',
          definition: 'Predicted net revenue attributed to the entire future relationship with a customer.',
          example: 'Example: If a customer generates $50/month for 24 months → CLV = $1,200',
        },
        {
          term: 'CAC (Customer Acquisition Cost)',
          definition: 'Total marketing and sales cost to acquire one customer.',
          example: 'Example: $10,000 spent on ads for 100 customers → CAC = $100',
        },
        {
          term: 'Retention Rate',
          definition: 'Percentage of customers retained over a period. Directly drives CLV growth.',
          example: 'Example: 850 of 1000 customers remain after 12 months → 85% retention',
        },
        {
          term: 'Churn Rate',
          definition: 'Percentage of customers lost in a given period.',
          example: 'Example: Losing 150 of 1000 customers annually → 15% churn',
        },
      ],
    },
    {
      category: 'Efficiency Ratios',
      icon: <TrendingUp className="h-4 w-4 text-blue-600" />,
      terms: [
        {
          term: 'LTV:CAC Ratio',
          definition: 'CLV divided by CAC. Evaluates efficiency of growth investments.',
          example: 'Example: CLV $1,200 / CAC $300 = 4:1 ratio',
        },
        {
          term: 'Payback Period',
          definition: 'Time needed for revenue to cover acquisition cost.',
          example: 'Example: CAC $300, monthly margin $100 → payback period is 3 months',
        },
      ],
    },
    {
      category: 'Advanced Models',
      icon: <Sigma className="h-4 w-4 text-purple-600" />,
      terms: [
        {
          term: 'BG/NBD Model',
          definition: 'Probabilistic model for estimating purchase frequency and dropout.',
          example: 'Predict likelihood of repeat orders in subscription or ecommerce data.',
        },
        {
          term: 'Gamma-Gamma Model',
          definition: 'Captures variation in monetary value across customers.',
          example: 'Useful when two customers have the same frequency but spend differently.',
        },
        {
          term: 'Heterogeneity Index',
          definition: 'Measure of behavioral variance across the customer base.',
          example: 'High index suggests wide spread between high-value and low-value users.',
        },
        {
          term: 'Customer Equity',
          definition: 'Total discounted CLV across all customers.',
          example: 'Used for valuation: if avg CLV = $1,200 across 10k users → $12M equity',
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
                    <p className="text-sm text-muted-foreground mb-2">{t.definition}</p>
                    {t.example && (
                      <div className="text-xs bg-blue-50 text-black-400 p-2 rounded border-l-2 border-blue-400">
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

export default DefinitionsTab