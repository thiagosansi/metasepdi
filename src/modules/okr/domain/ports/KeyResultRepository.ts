import type { KeyResult, CreateKeyResultInput, CheckIn, AddCheckInInput } from '../KeyResult'

export interface KeyResultRepository {
  findByObjective(objectiveId: string): Promise<KeyResult[]>
  findById(id: string): Promise<KeyResult | null>
  create(input: CreateKeyResultInput): Promise<KeyResult>
  addCheckIn(input: AddCheckInInput): Promise<{ keyResult: KeyResult; checkIn: CheckIn }>
  getCheckIns(keyResultId: string): Promise<CheckIn[]>
}
