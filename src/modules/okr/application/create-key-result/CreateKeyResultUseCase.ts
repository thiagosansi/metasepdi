import type { KeyResultRepository } from '../../domain/ports/KeyResultRepository'
import type { KeyResult, CreateKeyResultInput } from '../../domain/KeyResult'

export class CreateKeyResultUseCase {
  constructor(private readonly repo: KeyResultRepository) {}

  async execute(input: CreateKeyResultInput): Promise<KeyResult> {
    if (!input.title.trim()) {
      throw new Error('O título do resultado-chave não pode ser vazio.')
    }
    if (input.targetValue === undefined) {
      throw new Error('O valor alvo é obrigatório.')
    }
    return this.repo.create(input)
  }
}
