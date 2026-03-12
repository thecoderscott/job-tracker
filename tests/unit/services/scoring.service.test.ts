import { describe, it, expect } from 'vitest'
import {
  calculateWorkingPolicyScore,
  calculateSalaryScore,
  calculateTotalScore,
} from '@/services/scoring.service'
import type { WorkingPolicyWeights } from '@/models/settings'

const defaultWeights: WorkingPolicyWeights = {
  fullyRemote: 100,
  annualRetreats: 100,
  quarterly: 95,
  oncePerMonth: 90,
  fortnightly: 75,
  oncePerWeek: 60,
  twicePerWeek: 40,
  threeTimesPerWeek: 25,
}

describe('calculateWorkingPolicyScore', () => {
  it('returns base weight when distanceModifier is 1.0', () => {
    expect(calculateWorkingPolicyScore('fullyRemote', 1.0, defaultWeights)).toBe(100)
    expect(calculateWorkingPolicyScore('twicePerWeek', 1.0, defaultWeights)).toBe(40)
  })

  it('applies 0.75 modifier correctly', () => {
    expect(calculateWorkingPolicyScore('fullyRemote', 0.75, defaultWeights)).toBe(75)
    expect(calculateWorkingPolicyScore('quarterly', 0.75, defaultWeights)).toBeCloseTo(71.25)
  })

  it('applies 0.5 modifier correctly', () => {
    expect(calculateWorkingPolicyScore('oncePerMonth', 0.5, defaultWeights)).toBe(45)
  })

  it('returns 0 when weight is 0', () => {
    const zeroWeights: WorkingPolicyWeights = {
      ...defaultWeights,
      fullyRemote: 0,
    }
    expect(calculateWorkingPolicyScore('fullyRemote', 1.0, zeroWeights)).toBe(0)
  })
})

describe('calculateSalaryScore', () => {
  it('returns 0 at minimum salary (min=70k, target=90k)', () => {
    expect(calculateSalaryScore(70_000, 70_000, 90_000)).toBe(0)
  })

  it('returns 50 at midpoint between min and target', () => {
    expect(calculateSalaryScore(80_000, 70_000, 90_000)).toBe(50)
  })

  it('returns -50 below minimum', () => {
    expect(calculateSalaryScore(60_000, 70_000, 90_000)).toBe(-50)
  })

  it('returns 100 at target salary', () => {
    expect(calculateSalaryScore(90_000, 70_000, 90_000)).toBe(100)
  })

  it('returns ~133.33 above target', () => {
    expect(calculateSalaryScore(120_000, 70_000, 90_000)).toBeCloseTo(133.33, 1)
  })

  it('returns 200 at double target', () => {
    expect(calculateSalaryScore(180_000, 70_000, 90_000)).toBeCloseTo(200)
  })

  it('returns 0 when targetSalary is 0', () => {
    expect(calculateSalaryScore(80_000, 70_000, 0)).toBe(0)
  })

  it('handles min=50k, target=90k: 30k=-50', () => {
    expect(calculateSalaryScore(30_000, 50_000, 90_000)).toBe(-50)
  })

  it('handles min=50k, target=90k: 80k=75', () => {
    expect(calculateSalaryScore(80_000, 50_000, 90_000)).toBe(75)
  })
})

describe('calculateTotalScore', () => {
  it('returns a string (not a number) when an empty-string score is passed without a guard — documents the cleared-NumberInput bug', () => {
    // Mantine's NumberInput emits "" when the field is cleared. TypeScript types
    // the value as number, but the runtime value is "". Without a guard,
    // JavaScript string-concatenates the result, causing .toFixed() to throw.
    const emptyString = '' as unknown as number
    const result = calculateTotalScore({
      titleScore: emptyString,
      workingPolicyScore: 100,
      challengeScore: 50,
      autonomyScore: 50,
      salaryScore: 0,
    })
    expect(typeof result).toBe('string') // "" + 100 + 50 + 50 + 0 = "100500"
    expect(result).not.toSatisfy((v: unknown) => typeof (v as { toFixed?: unknown }).toFixed === 'function')
  })

  it('returns a number when empty-string scores are coerced with Number(x || 0) — documents the fix', () => {
    const emptyString = '' as unknown as number
    const result = calculateTotalScore({
      titleScore: Number(emptyString || 0),
      workingPolicyScore: 100,
      challengeScore: Number(emptyString || 0),
      autonomyScore: Number(emptyString || 0),
      salaryScore: 0,
    })
    expect(typeof result).toBe('number')
    expect(result).toBe(100)
  })

  it('sums all 5 components correctly', () => {
    expect(
      calculateTotalScore({
        titleScore: 50,
        workingPolicyScore: 100,
        challengeScore: 60,
        autonomyScore: 70,
        salaryScore: 80,
      }),
    ).toBe(360)
  })

  it('handles negative salaryScore', () => {
    expect(
      calculateTotalScore({
        titleScore: 50,
        workingPolicyScore: 75,
        challengeScore: 50,
        autonomyScore: 50,
        salaryScore: -25,
      }),
    ).toBe(200)
  })
})
