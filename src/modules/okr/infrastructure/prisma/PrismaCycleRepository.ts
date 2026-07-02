import { prisma } from '@/lib/prisma'
import type { CycleRepository } from '../../domain/ports/CycleRepository'
import type { Cycle, CreateCycleInput, CycleStatus } from '../../domain/Cycle'

export class PrismaCycleRepository implements CycleRepository {
  async findAll(): Promise<Cycle[]> {
    return prisma.cycle.findMany({ orderBy: { startDate: 'desc' } })
  }

  async findById(id: string): Promise<Cycle | null> {
    return prisma.cycle.findUnique({ where: { id } })
  }

  async findActive(): Promise<Cycle[]> {
    return prisma.cycle.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { startDate: 'desc' },
    })
  }

  async create(input: CreateCycleInput): Promise<Cycle> {
    return prisma.cycle.create({ data: input })
  }

  async updateStatus(id: string, status: CycleStatus): Promise<Cycle> {
    return prisma.cycle.update({ where: { id }, data: { status } })
  }
}
