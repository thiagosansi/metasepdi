import type { PdiRepository } from '../../domain/ports/PdiRepository'
import type { PdiNote, AddPdiNoteInput } from '../../domain/Pdi'

export class AddPdiNoteUseCase {
  constructor(private readonly repo: PdiRepository) {}

  async execute(input: AddPdiNoteInput): Promise<PdiNote> {
    if (!input.content.trim()) {
      throw new Error('A anotação não pode ser vazia.')
    }
    return this.repo.addNote(input)
  }
}
