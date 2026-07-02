import { prisma } from '@/lib/prisma'
import type { KeyResultRepository } from '../../domain/ports/KeyResultRepository'
import type { KeyResult, CreateKeyResultInput, CheckIn, AddCheckInInput } from '../../domain/KeyResult'
import { calculateProgress, deriveKrStatus } from '../../domain/KeyResult'

export class PrismaKeyResultRepository implements KeyResultRepository {
  async findByObjective(objectiveId: string): Promise<KeyResult[]> {
    return prisma.keyResult.findMany({
      where: { objectiveId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findById(id: string): Promise<KeyResult | null> {
    return prisma.keyResult.findUnique({ where: { id } })
  }

  async create(input: CreateKeyResultInput): Promise<KeyResult> {
    return prisma.keyResult.create({ data: input })
  }

  async addCheckIn(input: AddCheckInInput): Promise<{ keyResult: KeyResult; checkIn: CheckIn }> {
    const keyResult = await prisma.keyResult.findUniqueOrThrow({ where: { id: input.keyResultId } })
    const progress = calculateProgress(keyResult.startValue, keyResult.targetValue, input.value)
    const newStatus = deriveKrStatus(progress)

    const [checkIn, updatedKr] = await prisma.$transaction([
      prisma.checkIn.create({
        data: {
          value: input.value,
          note: input.note,
          confidence: input.confidence,
          keyResultId: input.keyResultId,
        },
      }),
      prisma.keyResult.update({
        where: { id: input.keyResultId },
        data: { currentValue: input.value, status: newStatus },
      }),
    ])

    return { keyResult: updatedKr, checkIn }
  }

  async getCheckIns(keyResultId: string): Promise<CheckIn[]> {
    return prisma.checkIn.findMany({
      where: { keyResultId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
