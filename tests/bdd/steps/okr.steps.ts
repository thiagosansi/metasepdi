import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert'
import { CreateCycleUseCase } from '../../../src/modules/okr/application/create-cycle/CreateCycleUseCase'
import { calculateProgress, deriveKrStatus } from '../../../src/modules/okr/domain/KeyResult'
import type { CycleRepository } from '../../../src/modules/okr/domain/ports/CycleRepository'
import type { Cycle } from '../../../src/modules/okr/domain/Cycle'

let cycleName: string
let startDate: Date
let endDate: Date
let createdCycle: Cycle | null = null
let creationError: Error | null = null
let progress: number
let krStatus: string

function makeMockCycleRepo(): CycleRepository {
  return {
    findAll: async () => [],
    findById: async () => null,
    findActive: async () => [],
    create: async (input) => ({
      id: 'test-cycle-id',
      ...input,
      status: input.status ?? 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    updateStatus: async () => ({
      id: '', name: '', startDate: new Date(), endDate: new Date(),
      status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
    }),
  }
}

Given('I want to create a cycle named {string}', (name: string) => {
  cycleName = name
  createdCycle = null
  creationError = null
})

When('the cycle start date is {string} and end date is {string}', async (start: string, end: string) => {
  startDate = new Date(start)
  endDate = new Date(end)
  const useCase = new CreateCycleUseCase(makeMockCycleRepo())
  try {
    createdCycle = await useCase.execute({ name: cycleName, startDate, endDate })
  } catch (e) {
    creationError = e as Error
  }
})

Then('the cycle is created successfully with status {string}', (status: string) => {
  assert.ok(createdCycle, 'Cycle should have been created')
  assert.strictEqual(createdCycle.status, status)
})

Then('the creation fails with {string}', (message: string) => {
  assert.ok(creationError, 'Expected an error but none was thrown')
  assert.ok(creationError.message.includes(message), `Expected message to include "${message}" but got "${creationError.message}"`)
})

Given('a key result with start {int}, target {int}, and current value {int}', (start: number, target: number, current: number) => {
  progress = calculateProgress(start, target, current)
  krStatus = deriveKrStatus(progress)
})

Then('the progress is {int} percent and status is {string}', (expectedProgress: number, expectedStatus: string) => {
  assert.strictEqual(progress, expectedProgress)
  assert.strictEqual(krStatus, expectedStatus)
})
