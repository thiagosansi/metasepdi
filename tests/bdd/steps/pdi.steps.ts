import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert'
import { AddPdiNoteUseCase } from '../../../src/modules/pdi/application/add-pdi-note/AddPdiNoteUseCase'
import type { PdiRepository } from '../../../src/modules/pdi/domain/ports/PdiRepository'
import type { PdiNote } from '../../../src/modules/pdi/domain/Pdi'

let pdiId: string
let savedNote: PdiNote | null = null
let noteError: Error | null = null

function makeMockPdiRepo(): PdiRepository {
  return {
    findByMember: async () => [],
    findById: async () => null,
    create: async () => ({
      id: 'p1', title: 't', cycleStart: new Date(), cycleEnd: new Date(),
      status: 'ACTIVE', summary: null, memberId: 'm1', createdAt: new Date(), updatedAt: new Date(),
    }),
    addItem: async () => ({
      id: 'i1', title: '', description: null, skillArea: null, resourceUrl: null,
      resourceType: null, targetDate: null, completedDate: null, status: 'PENDING',
      priority: 1, pdiId: 'p1', createdAt: new Date(), updatedAt: new Date(),
    }),
    updateItem: async () => ({
      id: 'i1', title: '', description: null, skillArea: null, resourceUrl: null,
      resourceType: null, targetDate: null, completedDate: null, status: 'PENDING',
      priority: 1, pdiId: 'p1', createdAt: new Date(), updatedAt: new Date(),
    }),
    addNote: async (input) => ({ id: 'note-1', content: input.content, pdiId: input.pdiId, createdAt: new Date() }),
  }
}

Given('a PDI exists with id {string}', (id: string) => {
  pdiId = id
  savedNote = null
  noteError = null
})

When('I add a note {string}', async (content: string) => {
  const useCase = new AddPdiNoteUseCase(makeMockPdiRepo())
  try {
    savedNote = await useCase.execute({ content, pdiId })
  } catch (e) {
    noteError = e as Error
  }
})

When('I add a note with empty content', async () => {
  const useCase = new AddPdiNoteUseCase(makeMockPdiRepo())
  try {
    savedNote = await useCase.execute({ content: '   ', pdiId })
  } catch (e) {
    noteError = e as Error
  }
})

Then('the note is saved successfully', () => {
  assert.ok(savedNote, 'Note should have been saved')
})

Then('the note is rejected with {string}', (message: string) => {
  assert.ok(noteError, 'Expected an error but none was thrown')
  assert.ok(noteError.message.includes(message))
})
