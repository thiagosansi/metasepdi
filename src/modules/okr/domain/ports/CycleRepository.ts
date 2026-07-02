import type { Cycle, CreateCycleInput, CycleStatus } from '../Cycle'

export interface CycleRepository {
  findAll(): Promise<Cycle[]>
  findById(id: string): Promise<Cycle | null>
  findActive(): Promise<Cycle[]>
  create(input: CreateCycleInput): Promise<Cycle>
  updateStatus(id: string, status: CycleStatus): Promise<Cycle>
}
