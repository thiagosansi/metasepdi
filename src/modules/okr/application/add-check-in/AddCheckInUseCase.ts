import type { KeyResultRepository } from '../../domain/ports/KeyResultRepository'
import type { KeyResult, CheckIn, AddCheckInInput } from '../../domain/KeyResult'

export class AddCheckInUseCase {
  constructor(private readonly repo: KeyResultRepository) {}

  async execute(input: AddCheckInInput): Promise<{ keyResult: KeyResult; checkIn: CheckIn }> {
    return this.repo.addCheckIn(input)
  }
}
