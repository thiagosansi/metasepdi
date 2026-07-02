import type { TeamMemberRepository } from '../../domain/ports/TeamMemberRepository'
import type { TeamMember, CreateTeamMemberInput } from '../../domain/TeamMember'

export class CreateTeamMemberUseCase {
  constructor(private readonly repo: TeamMemberRepository) {}

  async execute(input: CreateTeamMemberInput): Promise<TeamMember> {
    return this.repo.create(input)
  }
}
