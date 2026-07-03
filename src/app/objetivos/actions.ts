'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PrismaObjectiveRepository } from '@/modules/okr/infrastructure/prisma/PrismaObjectiveRepository'
import { PrismaKeyResultRepository } from '@/modules/okr/infrastructure/prisma/PrismaKeyResultRepository'
import { CreateObjectiveUseCase } from '@/modules/okr/application/create-objective/CreateObjectiveUseCase'
import { CreateKeyResultUseCase } from '@/modules/okr/application/create-key-result/CreateKeyResultUseCase'
import { AddCheckInUseCase } from '@/modules/okr/application/add-check-in/AddCheckInUseCase'
import type { ObjectiveLevel } from '@/modules/okr/domain/Objective'

const objectiveRepo = new PrismaObjectiveRepository()
const krRepo = new PrismaKeyResultRepository()

export async function updateObjective(formData: FormData) {
  const id = formData.get('id') as string
  await objectiveRepo.update(id, {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    level: formData.get('level') as ObjectiveLevel,
    parentId: (formData.get('parentId') as string) || undefined,
    ownerId: (formData.get('ownerId') as string) || undefined,
  })
  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
  redirect('/objetivos')
}

export async function createObjective(formData: FormData) {
  const useCase = new CreateObjectiveUseCase(objectiveRepo)
  await useCase.execute({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
    level: formData.get('level') as ObjectiveLevel,
    cycleId: formData.get('cycleId') as string,
    parentId: (formData.get('parentId') as string) || undefined,
    ownerId: (formData.get('ownerId') as string) || undefined,
  })
  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
  redirect('/objetivos')
}

export async function createKeyResult(formData: FormData) {
  const useCase = new CreateKeyResultUseCase(krRepo)
  await useCase.execute({
    title: formData.get('title') as string,
    targetValue: Number(formData.get('targetValue')),
    startValue: Number(formData.get('startValue') || 0),
    unit: (formData.get('unit') as string) || undefined,
    objectiveId: formData.get('objectiveId') as string,
  })
  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
}

export async function addCheckIn(formData: FormData) {
  const useCase = new AddCheckInUseCase(krRepo)
  await useCase.execute({
    keyResultId: formData.get('keyResultId') as string,
    value: Number(formData.get('value')),
    note: (formData.get('note') as string) || undefined,
    confidence: formData.get('confidence') ? Number(formData.get('confidence')) : undefined,
  })
  revalidatePath('/dashboard')
  revalidatePath('/objetivos')
}
