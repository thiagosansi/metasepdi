export type CycleStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'

export interface Cycle {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: CycleStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateCycleInput {
  name: string
  startDate: Date
  endDate: Date
  status?: CycleStatus
}
