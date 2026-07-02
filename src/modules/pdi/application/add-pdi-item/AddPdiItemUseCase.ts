import type { PdiRepository } from '../../domain/ports/PdiRepository'
import type { PdiItem, AddPdiItemInput } from '../../domain/Pdi'

export class AddPdiItemUseCase {
  constructor(private readonly repo: PdiRepository) {}

  async execute(input: AddPdiItemInput): Promise<PdiItem> {
    return this.repo.addItem(input)
  }
}
