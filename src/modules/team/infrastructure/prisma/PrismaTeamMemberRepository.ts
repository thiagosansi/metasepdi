import { prisma } from '@/lib/prisma'
import type { TeamMemberRepository } from '../../domain/ports/TeamMemberRepository'
import type { TeamMember, CreateTeamMemberInput } from '../../domain/TeamMember'

export class PrismaTeamMemberRepository implements TeamMemberRepository {
  async findAll(): Promise<TeamMember[]> {
    return prisma.teamMember.findMany({ orderBy: { name: 'asc' } })
  }

  async findById(id: string): Promise<TeamMember | null> {
    return prisma.teamMember.findUnique({ where: { id } })
  }

  async create(input: CreateTeamMemberInput): Promise<TeamMember> {
    return prisma.teamMember.create({ data: input })
  }

  async update(id: string, data: Partial<CreateTeamMemberInput>): Promise<TeamMember> {
    return prisma.teamMember.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.teamMember.delete({ where: { id } })
  }
}
