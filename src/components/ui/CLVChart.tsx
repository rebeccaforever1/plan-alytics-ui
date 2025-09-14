// src/components/ui/CLVChart.tsx
'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { tier: 'High CLV', count: 52 },
  { tier: 'Mid CLV', count: 130 },
  { tier: 'Low CLV', count: 245 },
]

export default function CLVChart() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">CLV Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="tier" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
