'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PrismaCycleRepository } from '@/modules/okr/infrastructure/prisma/PrismaCycleRepository'
import { CreateCycleUseCase } from '@/modules/okr/application/create-cycle/CreateCycleUseCase'
import type { CycleStatus } from '@/modules/okr/domain/Cycle'

const repo = new PrismaCycleRepository()

export async function createCycle(formData: FormData) {
  const useCase = new CreateCycleUseCase(repo)
  await useCase.execute({
    name: formData.get('name') as string,
    startDate: new Date(formData.get('startDate') as string),
    endDate: new Date(formData.get('endDate') as string),
  })
  revalidatePath('/ciclos')
  redirect('/ciclos')
}

export async function updateCycleStatus(id: string, status: CycleStatus) {
  await repo.updateStatus(id, status)
  revalidatePath('/ciclos')
  revalidatePath('/dashboard')
}
