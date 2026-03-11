import type { JobApplication } from '@/models/job'

export const STORAGE_KEY = 'job-tracker:jobs'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getJobs(): JobApplication[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as JobApplication[]
}

export function saveJob(job: JobApplication): void {
  const existing = getJobs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, job]))
}

export function updateJob(updated: JobApplication): void {
  const jobs = getJobs()
  const idx = jobs.findIndex(j => j.id === updated.id)
  if (idx === -1) return
  jobs[idx] = updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter(j => j.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}
