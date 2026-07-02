import type { ObjectiveRepository } from '../../domain/ports/ObjectiveRepository'
import type { Objective, CreateObjectiveInput } from '../../domain/Objective'

export class CreateObjectiveUseCase {
  constructor(private readonly repo: ObjectiveRepository) {}

  async execute(input: CreateObjectiveInput): Promise<Objective> {
    if (!input.title.trim()) {
      throw new Error('O título do objetivo não pode ser vazio.')
    }
    return this.repo.create(input)
  }
}
