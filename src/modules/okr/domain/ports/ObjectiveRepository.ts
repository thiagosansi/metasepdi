import type { Objective, CreateObjectiveInput, ObjectiveLevel } from '../Objective'

export interface ObjectiveWithKeyResults extends Objective {
  keyResults: {
    id: string
    title: string
    currentValue: number
    startValue: number
    targetValue: number
    status: string
    confidenceScore: number | null
    unit: string | null
  }[]
  children?: ObjectiveWithKeyResults[]
  owner?: { id: string; name: string } | null
}

export interface ObjectiveRepository {
  findByCycle(cycleId: string): Promise<ObjectiveWithKeyResults[]>
  findById(id: string): Promise<ObjectiveWithKeyResults | null>
  findByLevel(cycleId: string, level: ObjectiveLevel): Promise<ObjectiveWithKeyResults[]>
  create(input: CreateObjectiveInput): Promise<Objective>
  update(id: string, data: Partial<CreateObjectiveInput>): Promise<Objective>
  delete(id: string): Promise<void>
}
