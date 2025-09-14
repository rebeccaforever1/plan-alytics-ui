
// src/components/ui/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MetricCard({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  )
}
