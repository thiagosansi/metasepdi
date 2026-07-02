import type { CycleRepository } from '../../domain/ports/CycleRepository'
import type { Cycle, CreateCycleInput } from '../../domain/Cycle'

export class CreateCycleUseCase {
  constructor(private readonly repo: CycleRepository) {}

  async execute(input: CreateCycleInput): Promise<Cycle> {
    if (input.endDate <= input.startDate) {
      throw new Error('A data de fim deve ser posterior à data de início.')
    }
    return this.repo.create(input)
  }
}
