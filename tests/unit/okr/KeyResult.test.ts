import { describe, it, expect } from 'vitest'
import { calculateProgress, deriveKrStatus } from '@/modules/okr/domain/KeyResult'

describe('calculateProgress', () => {
  it('returns 0% when at start value', () => {
    expect(calculateProgress(0, 100, 0)).toBe(0)
  })

  it('returns 100% when at target value', () => {
    expect(calculateProgress(0, 100, 100)).toBe(100)
  })

  it('returns 50% at midpoint', () => {
    expect(calculateProgress(0, 100, 50)).toBe(50)
  })

  it('caps at 100% when exceeds target', () => {
    expect(calculateProgress(0, 100, 150)).toBe(100)
  })

  it('handles non-zero start value', () => {
    expect(calculateProgress(5, 10, 7)).toBe(40)
  })

  it('returns 100% when equal target equals start and currentValue >= target', () => {
    expect(calculateProgress(5, 5, 5)).toBe(100)
  })

  it('returns 0% when equal target equals start and currentValue < target', () => {
    expect(calculateProgress(5, 5, 4)).toBe(0)
  })
})

describe('deriveKrStatus', () => {
  it('returns ON_TRACK at 70%', () => {
    expect(deriveKrStatus(70)).toBe('ON_TRACK')
  })

  it('returns ON_TRACK at 100%', () => {
    expect(deriveKrStatus(100)).toBe('COMPLETED')
  })

  it('returns AT_RISK at 50%', () => {
    expect(deriveKrStatus(50)).toBe('AT_RISK')
  })

  it('returns BEHIND at 30%', () => {
    expect(deriveKrStatus(30)).toBe('BEHIND')
  })

  it('returns BEHIND at 0%', () => {
    expect(deriveKrStatus(0)).toBe('BEHIND')
  })

  it('returns AT_RISK at exactly 40%', () => {
    expect(deriveKrStatus(40)).toBe('AT_RISK')
  })
})
