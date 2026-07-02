export type ObjectiveLevel = 'COMPANY' | 'SQUAD' | 'INDIVIDUAL'
export type ObjectiveStatus = 'DRAFT' | 'ACTIVE' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED'

export interface Objective {
  id: string
  title: string
  description: string | null
  level: ObjectiveLevel
  status: ObjectiveStatus
  parentId: string | null
  ownerId: string | null
  cycleId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateObjectiveInput {
  title: string
  description?: string
  level: ObjectiveLevel
  parentId?: string
  ownerId?: string
  cycleId: string
}

export function calculateObjectiveProgress(keyResults: { progress: number }[]): number {
  if (keyResults.length === 0) return 0
  const total = keyResults.reduce((sum, kr) => sum + kr.progress, 0)
  return Math.round(total / keyResults.length)
}
