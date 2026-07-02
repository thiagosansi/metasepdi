import type { TeamMember, CreateTeamMemberInput } from '../TeamMember'

export interface TeamMemberRepository {
  findAll(): Promise<TeamMember[]>
  findById(id: string): Promise<TeamMember | null>
  create(input: CreateTeamMemberInput): Promise<TeamMember>
  update(id: string, data: Partial<CreateTeamMemberInput>): Promise<TeamMember>
  delete(id: string): Promise<void>
}
