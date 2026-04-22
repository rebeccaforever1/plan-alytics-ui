import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Makes a random number, but repeatable with a "seed"
export const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Turns numbers into labels for your charts
export const formatTimeLabel = (index: number, timeframe: string) => {
  if (timeframe === 'daily') return `Day ${index + 1}`
  if (timeframe === 'monthly') return `Month ${index + 1}`
  return `Week ${index + 1}`
}

// Format numbers as USD currency
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0)

// Format numbers as percentages
export const formatPercentage = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format((value || 0) / 100)

// Format numbers with commas
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value || 0)




// Calculate mean (average)
export const calculateMean = (arr: number[]) => {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// Calculate standard deviation
export const calculateStandardDeviation = (arr: number[]) => {
  if (!arr.length) return 0
  const mean = calculateMean(arr)
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length
  return Math.sqrt(variance)
}

// Calculate % trend from first to last
export const calculateTrend = (arr: number[]) => {
  if (arr.length < 2) return 0
  const first = arr[0]
  const last = arr[arr.length - 1]
  return first === 0 ? 0 : ((last - first) / first) * 100
}
// Export array of objects to CSV and trigger a download in the browser
export const exportCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  const header = Object.keys(data[0]).join(',')
  const rows = data.map(row =>
    Object.values(row)
      .map(v => `"${String(v).replace(/"/g, '""')}"`) // escape quotes
      .join(',')
  )
  const csv = [header, ...rows].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
