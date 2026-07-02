import { prisma } from '@/lib/prisma'
import type { ObjectiveRepository, ObjectiveWithKeyResults } from '../../domain/ports/ObjectiveRepository'
import type { Objective, CreateObjectiveInput, ObjectiveLevel } from '../../domain/Objective'

const includeKrs = {
  keyResults: {
    select: {
      id: true,
      title: true,
      currentValue: true,
      startValue: true,
      targetValue: true,
      status: true,
      confidenceScore: true,
      unit: true,
    },
  },
  owner: { select: { id: true, name: true } },
} as const

export class PrismaObjectiveRepository implements ObjectiveRepository {
  async findByCycle(cycleId: string): Promise<ObjectiveWithKeyResults[]> {
    return prisma.objective.findMany({
      where: { cycleId },
      include: {
        ...includeKrs,
        children: { include: { ...includeKrs, children: { include: includeKrs } } },
      },
      orderBy: { createdAt: 'asc' },
    }) as unknown as ObjectiveWithKeyResults[]
  }

  async findById(id: string): Promise<ObjectiveWithKeyResults | null> {
    return prisma.objective.findUnique({
      where: { id },
      include: { ...includeKrs, children: { include: includeKrs } },
    }) as unknown as ObjectiveWithKeyResults | null
  }

  async findByLevel(cycleId: string, level: ObjectiveLevel): Promise<ObjectiveWithKeyResults[]> {
    return prisma.objective.findMany({
      where: { cycleId, level },
      include: includeKrs,
      orderBy: { createdAt: 'asc' },
    }) as unknown as ObjectiveWithKeyResults[]
  }

  async create(input: CreateObjectiveInput): Promise<Objective> {
    return prisma.objective.create({ data: input })
  }

  async update(id: string, data: Partial<CreateObjectiveInput>): Promise<Objective> {
    return prisma.objective.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.objective.delete({ where: { id } })
  }
}
