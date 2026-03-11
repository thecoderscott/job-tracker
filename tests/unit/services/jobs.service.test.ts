import { describe, it, expect, afterEach } from 'vitest'
import { generateId, getJobs, saveJob, STORAGE_KEY } from '@/services/jobs.service'
import type { JobApplication } from '@/models/job'

afterEach(() => {
  localStorage.clear()
})

const mockJob: JobApplication = {
  id: 'test-id-1',
  jobTitle: 'Software Engineer',
  company: 'Acme Corp',
  contact: 'Jane Doe',
  applicationDate: '2024-01-15',
  salaryMin: 60_000,
  salaryMax: 80_000,
  status: 'Submitted',
  scoring: {
    titleScore: 50,
    workingPolicy: 'fullyRemote',
    distanceModifier: 1.0,
    workingPolicyScore: 100,
    challengeScore: 50,
    autonomyScore: 50,
    salaryScore: 50,
    totalScore: 300,
  },
}

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns a different value on each call', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})

describe('getJobs', () => {
  it('returns empty array when storage is empty', () => {
    expect(getJobs()).toEqual([])
  })

  it('returns saved jobs when present', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockJob]))
    expect(getJobs()).toEqual([mockJob])
  })
})

describe('saveJob', () => {
  it('adds a job to an empty list', () => {
    saveJob(mockJob)
    expect(getJobs()).toEqual([mockJob])
  })

  it('appends to existing jobs', () => {
    const secondJob: JobApplication = { ...mockJob, id: 'test-id-2', company: 'Beta Ltd' }
    saveJob(mockJob)
    saveJob(secondJob)
    const jobs = getJobs()
    expect(jobs).toHaveLength(2)
    expect(jobs[1].id).toBe('test-id-2')
  })

  it('persists under the correct storage key', () => {
    saveJob(mockJob)
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual([mockJob])
  })
})
