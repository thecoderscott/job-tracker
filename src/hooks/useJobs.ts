'use client'

import { useState } from 'react'
import type { JobApplication } from '@/models/job'
import { getJobs, saveJob, updateJob as updateJobService, deleteJob as deleteJobService } from '@/services/jobs.service'

export function useJobs() {
  const [jobs, setJobs] = useState<JobApplication[]>(() => getJobs())

  const addJob = (job: JobApplication) => {
    saveJob(job)
    setJobs(getJobs())
  }

  const updateJob = (job: JobApplication) => {
    updateJobService(job)
    setJobs(getJobs())
  }

  const deleteJob = (id: string) => {
    deleteJobService(id)
    setJobs(getJobs())
  }

  return { jobs, addJob, updateJob, deleteJob }
}
