import { prisma } from '@/lib/prisma'
import type { PdiRepository, PdiWithDetails } from '../../domain/ports/PdiRepository'
import type { Pdi, PdiItem, PdiNote, CreatePdiInput, AddPdiItemInput, AddPdiNoteInput } from '../../domain/Pdi'

const includeDetails = {
  items: { orderBy: { priority: 'asc' as const } },
  notes: { orderBy: { createdAt: 'desc' as const } },
  member: { select: { id: true, name: true, role: true } },
} as const

export class PrismaPdiRepository implements PdiRepository {
  async findByMember(memberId: string): Promise<PdiWithDetails[]> {
    return prisma.pdi.findMany({
      where: { memberId },
      include: includeDetails,
      orderBy: { cycleStart: 'desc' },
    }) as unknown as PdiWithDetails[]
  }

  async findById(id: string): Promise<PdiWithDetails | null> {
    return prisma.pdi.findUnique({
      where: { id },
      include: includeDetails,
    }) as unknown as PdiWithDetails | null
  }

  async create(input: CreatePdiInput): Promise<Pdi> {
    return prisma.pdi.create({ data: input })
  }

  async addItem(input: AddPdiItemInput): Promise<PdiItem> {
    return prisma.pdiItem.create({ data: input })
  }

  async updateItem(
    itemId: string,
    data: Partial<AddPdiItemInput & { status: string; completedDate: Date }>
  ): Promise<PdiItem> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.pdiItem.update({ where: { id: itemId }, data: data as any })
  }

  async addNote(input: AddPdiNoteInput): Promise<PdiNote> {
    return prisma.pdiNote.create({ data: input })
  }
}
