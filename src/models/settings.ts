export type WorkingPolicy =
  | 'fullyRemote'
  | 'annualRetreats'
  | 'quarterly'
  | 'oncePerMonth'
  | 'fortnightly'
  | 'oncePerWeek'
  | 'twicePerWeek'
  | 'threeTimesPerWeek'

export interface WorkingPolicyWeights extends Record<WorkingPolicy, number> {}

export interface SalarySettings {
  minimumSalary: number
  targetSalary: number
}

export interface UserSettings {
  workingPolicyWeights: WorkingPolicyWeights
  salary: SalarySettings
}
