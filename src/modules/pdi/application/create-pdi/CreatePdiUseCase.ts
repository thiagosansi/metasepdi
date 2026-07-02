import type { PdiRepository } from '../../domain/ports/PdiRepository'
import type { Pdi, CreatePdiInput } from '../../domain/Pdi'

export class CreatePdiUseCase {
  constructor(private readonly repo: PdiRepository) {}

  async execute(input: CreatePdiInput): Promise<Pdi> {
    return this.repo.create(input)
  }
}
