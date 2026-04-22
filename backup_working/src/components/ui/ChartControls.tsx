// components/ui/ChartControls.tsx
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Button } from './button'

export function ChartControls({
  timeframe,
  setTimeframe,
  metric,
  setMetric,
}: {
  timeframe: string
  setTimeframe: (v: string) => void
  metric: string
  setMetric: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-end">
      <Select value={timeframe} onValueChange={setTimeframe}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      <Select value={metric} onValueChange={setMetric}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="clv">CLV</SelectItem>
          <SelectItem value="mrr">MRR</SelectItem>
          <SelectItem value="revenue">Revenue</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline">Export Analysis</Button>
    </div>
  )
}
