import { describe, it, expect, vi } from 'vitest'
import { CreateCycleUseCase } from '@/modules/okr/application/create-cycle/CreateCycleUseCase'
import type { CycleRepository } from '@/modules/okr/domain/ports/CycleRepository'
import type { Cycle } from '@/modules/okr/domain/Cycle'

function makeMockRepo(overrides?: Partial<CycleRepository>): CycleRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findActive: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    ...overrides,
  }
}

describe('CreateCycleUseCase', () => {
  it('creates a cycle with valid dates', async () => {
    const expected: Cycle = {
      id: 'cyl1',
      name: 'Q3 2026',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-09-30'),
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const repo = makeMockRepo({ create: vi.fn().mockResolvedValue(expected) })
    const useCase = new CreateCycleUseCase(repo)

    const result = await useCase.execute({
      name: 'Q3 2026',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-09-30'),
    })

    expect(result).toEqual(expected)
    expect(repo.create).toHaveBeenCalledOnce()
  })

  it('throws when end date is before start date', async () => {
    const repo = makeMockRepo()
    const useCase = new CreateCycleUseCase(repo)

    await expect(
      useCase.execute({
        name: 'Q3 2026',
        startDate: new Date('2026-09-30'),
        endDate: new Date('2026-07-01'),
      })
    ).rejects.toThrow('data de fim deve ser posterior')
  })
})
