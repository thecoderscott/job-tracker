import type { WorkingPolicy } from '@/models/settings'

export type ApplicationStatus =
  | 'Submitted'
  | 'Acknowledged'
  | 'Initial Contact'
  | 'Stale'
  | 'Rejected'
  | 'Interviewing'
  | 'Offered'

export type DistanceModifier = 1.0 | 0.75 | 0.5

export interface JobScoring {
  titleScore: number
  workingPolicy: WorkingPolicy
  distanceModifier: DistanceModifier
  workingPolicyScore: number
  challengeScore: number
  autonomyScore: number
  salaryScore: number
  totalScore: number
}

export interface JobApplication {
  id: string
  jobTitle: string
  company: string
  contact: string
  applicationDate: string
  salaryMin: number | null
  salaryMax: number | null
  salaryIsEstimated: boolean
  status: ApplicationStatus
  scoring: JobScoring
}
