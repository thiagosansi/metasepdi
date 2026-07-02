export type MetricType = 'PERCENTAGE' | 'NUMBER' | 'CURRENCY' | 'BOOLEAN'
export type KrStatus = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED'

export interface KeyResult {
  id: string
  title: string
  metricType: MetricType
  startValue: number
  targetValue: number
  currentValue: number
  unit: string | null
  status: KrStatus
  confidenceScore: number | null
  objectiveId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateKeyResultInput {
  title: string
  metricType?: MetricType
  startValue?: number
  targetValue: number
  unit?: string
  objectiveId: string
}

export interface CheckIn {
  id: string
  value: number
  note: string | null
  confidence: number | null
  keyResultId: string
  createdAt: Date
}

export interface AddCheckInInput {
  value: number
  note?: string
  confidence?: number
  keyResultId: string
}

export function calculateProgress(startValue: number, targetValue: number, currentValue: number): number {
  if (targetValue === startValue) return currentValue >= targetValue ? 100 : 0
  const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100
  return Math.min(100, Math.max(0, Math.round(progress)))
}

export function deriveKrStatus(progress: number): KrStatus {
  if (progress >= 100) return 'COMPLETED'
  if (progress >= 70) return 'ON_TRACK'
  if (progress >= 40) return 'AT_RISK'
  return 'BEHIND'
}
