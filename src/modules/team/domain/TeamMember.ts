export interface TeamMember {
  id: string
  name: string
  role: string | null
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTeamMemberInput {
  name: string
  role?: string
  email: string
}
