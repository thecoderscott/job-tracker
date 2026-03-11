import type { WorkingPolicy, WorkingPolicyWeights } from '@/models/settings'
import type { DistanceModifier, JobScoring } from '@/models/job'

export function calculateWorkingPolicyScore(
  policy: WorkingPolicy,
  distanceModifier: DistanceModifier,
  weights: WorkingPolicyWeights,
): number {
  return weights[policy] * distanceModifier
}

export function calculateSalaryScore(
  salary: number,
  minimumSalary: number,
  targetSalary: number,
): number {
  if (targetSalary === 0) return 0
  if (salary < targetSalary) {
    return ((salary - minimumSalary) / (targetSalary - minimumSalary)) * 100
  }
  return (salary / targetSalary) * 100
}

type ScoreComponents = Pick<
  JobScoring,
  'titleScore' | 'workingPolicyScore' | 'challengeScore' | 'autonomyScore' | 'salaryScore'
>

export function calculateTotalScore(components: ScoreComponents): number {
  return (
    components.titleScore +
    components.workingPolicyScore +
    components.challengeScore +
    components.autonomyScore +
    components.salaryScore
  )
}
