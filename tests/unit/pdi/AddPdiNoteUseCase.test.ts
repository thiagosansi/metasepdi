import { describe, it, expect, vi } from 'vitest'
import { AddPdiNoteUseCase } from '@/modules/pdi/application/add-pdi-note/AddPdiNoteUseCase'
import type { PdiRepository } from '@/modules/pdi/domain/ports/PdiRepository'

function makeMockRepo(overrides?: Partial<PdiRepository>): PdiRepository {
  return {
    findByMember: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    addNote: vi.fn(),
    ...overrides,
  }
}

describe('AddPdiNoteUseCase', () => {
  it('adds a note successfully', async () => {
    const expected = { id: 'note1', content: 'Ótima evolução', pdiId: 'pdi1', createdAt: new Date() }
    const repo = makeMockRepo({ addNote: vi.fn().mockResolvedValue(expected) })
    const useCase = new AddPdiNoteUseCase(repo)

    const result = await useCase.execute({ content: 'Ótima evolução', pdiId: 'pdi1' })

    expect(result).toEqual(expected)
  })

  it('throws when content is empty', async () => {
    const repo = makeMockRepo()
    const useCase = new AddPdiNoteUseCase(repo)

    await expect(useCase.execute({ content: '   ', pdiId: 'pdi1' })).rejects.toThrow('vazia')
  })
})
