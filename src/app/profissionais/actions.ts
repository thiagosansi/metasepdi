'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PrismaTeamMemberRepository } from '@/modules/team/infrastructure/prisma/PrismaTeamMemberRepository'
import { CreateTeamMemberUseCase } from '@/modules/team/application/create-team-member/CreateTeamMemberUseCase'

const repo = new PrismaTeamMemberRepository()

export async function createTeamMember(formData: FormData) {
  const useCase = new CreateTeamMemberUseCase(repo)
  await useCase.execute({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: (formData.get('role') as string) || undefined,
  })
  revalidatePath('/profissionais')
  redirect('/profissionais')
}

export async function deleteTeamMember(id: string) {
  await repo.delete(id)
  revalidatePath('/profissionais')
}
