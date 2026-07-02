'use server'

import { revalidatePath } from 'next/cache'
import { PrismaPdiRepository } from '@/modules/pdi/infrastructure/prisma/PrismaPdiRepository'
import { CreatePdiUseCase } from '@/modules/pdi/application/create-pdi/CreatePdiUseCase'
import { AddPdiItemUseCase } from '@/modules/pdi/application/add-pdi-item/AddPdiItemUseCase'
import { AddPdiNoteUseCase } from '@/modules/pdi/application/add-pdi-note/AddPdiNoteUseCase'
import type { ResourceType } from '@/modules/pdi/domain/Pdi'

const repo = new PrismaPdiRepository()

export async function createPdi(formData: FormData) {
  const useCase = new CreatePdiUseCase(repo)
  await useCase.execute({
    title: formData.get('title') as string,
    memberId: formData.get('memberId') as string,
    cycleStart: new Date(formData.get('cycleStart') as string),
    cycleEnd: new Date(formData.get('cycleEnd') as string),
    summary: (formData.get('summary') as string) || undefined,
  })
  const memberId = formData.get('memberId') as string
  revalidatePath(`/profissionais/${memberId}`)
}

export async function addPdiItem(formData: FormData) {
  const useCase = new AddPdiItemUseCase(repo)
  const pdiId = formData.get('pdiId') as string
  await useCase.execute({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    skillArea: (formData.get('skillArea') as string) || undefined,
    resourceUrl: (formData.get('resourceUrl') as string) || undefined,
    resourceType: (formData.get('resourceType') as ResourceType) || undefined,
    targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate') as string) : undefined,
    priority: Number(formData.get('priority') || 1),
    pdiId,
  })
  revalidatePath(`/pdi/${pdiId}`)
}

export async function updatePdiItemStatus(itemId: string, status: string, pdiId: string) {
  const completedDate = status === 'COMPLETED' ? new Date() : undefined
  await repo.updateItem(itemId, { status, ...(completedDate ? { completedDate } : {}) })
  revalidatePath(`/pdi/${pdiId}`)
}

export async function addPdiNote(formData: FormData) {
  const useCase = new AddPdiNoteUseCase(repo)
  const pdiId = formData.get('pdiId') as string
  await useCase.execute({
    content: formData.get('content') as string,
    pdiId,
  })
  revalidatePath(`/pdi/${pdiId}`)
}
