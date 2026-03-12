'use client'

import { useState } from 'react'
import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import type { JobApplication } from '@/models/job'
import type { WorkingPolicy } from '@/models/settings'
import { generateId } from '@/services/jobs.service'
import {
  calculateWorkingPolicyScore,
  calculateSalaryScore,
  calculateTotalScore,
} from '@/services/scoring.service'
import { useSettings } from '@/hooks/useSettings'
import CoreDetailsForm, { type CoreDetailsFormValues } from '@/components/jobs/CoreDetailsForm'
import ScoringForm, { type ScoringFormValues } from '@/components/jobs/ScoringForm'
import type { DistanceModifier } from '@/models/job'

const CORE_INITIAL_VALUES: CoreDetailsFormValues = {
  jobTitle: '',
  company: '',
  contact: '',
  applicationDate: new Date(),
  salaryMin: null,
  salaryMax: '',
  salaryNotListed: false,
  status: 'Submitted',
}

const SCORING_INITIAL_VALUES: ScoringFormValues = {
  titleScore: 50,
  workingPolicy: 'fullyRemote',
  distanceModifier: '1',
  challengeScore: 50,
  autonomyScore: 50,
}

function jobToCoreValues(job: JobApplication): CoreDetailsFormValues {
  const [year, month, day] = job.applicationDate.split('-').map(Number)
  return {
    jobTitle: job.jobTitle,
    company: job.company,
    contact: job.contact,
    applicationDate: new Date(year, month - 1, day),
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax !== null ? String(job.salaryMax) : '',
    salaryNotListed: job.salaryIsEstimated,
    status: job.status,
  }
}

function jobToScoringValues(job: JobApplication): ScoringFormValues {
  return {
    titleScore: Number(job.scoring.titleScore || 0),
    workingPolicy: job.scoring.workingPolicy,
    distanceModifier: String(job.scoring.distanceModifier),
    challengeScore: Number(job.scoring.challengeScore || 0),
    autonomyScore: Number(job.scoring.autonomyScore || 0),
  }
}

interface AddApplicationModalProps {
  opened: boolean
  onClose: () => void
  onJobAdded: (job: JobApplication) => void
  onJobUpdated: (job: JobApplication) => void
  job?: JobApplication
}

export default function AddApplicationModal({ opened, onClose, onJobAdded, onJobUpdated, job }: AddApplicationModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const { settings } = useSettings()

  const coreForm = useForm<CoreDetailsFormValues>({
    initialValues: job ? jobToCoreValues(job) : CORE_INITIAL_VALUES,
    validate: {
      jobTitle: v => (v.trim() ? null : 'Job title is required'),
      company: v => (v.trim() ? null : 'Company is required'),
      applicationDate: v => (v ? null : 'Application date is required'),
      salaryMax: (v, values) => {
        if (values.salaryNotListed) return null
        return v !== '' && Number(v) > 0 ? null : 'Salary max is required'
      },
    },
  })

  const scoringForm = useForm<ScoringFormValues>({
    initialValues: job ? jobToScoringValues(job) : SCORING_INITIAL_VALUES,
  })

  const handleCancel = () => {
    coreForm.reset()
    scoringForm.reset()
    setStep(1)
    onClose()
  }

  const handleSave = () => {
    const core = coreForm.values
    const scoring = scoringForm.values

    const distanceModifier = Number(scoring.distanceModifier) as DistanceModifier
    const workingPolicyScore = calculateWorkingPolicyScore(
      scoring.workingPolicy as WorkingPolicy,
      distanceModifier,
      settings.workingPolicyWeights,
    )
    const salaryMax = core.salaryMax !== '' && Number(core.salaryMax) > 0 ? Number(core.salaryMax) : null
    const salaryScore = salaryMax === null
      ? 0
      : calculateSalaryScore(salaryMax, settings.salary.minimumSalary, settings.salary.targetSalary)
    const totalScore = calculateTotalScore({
      titleScore: Number(scoring.titleScore || 0),
      workingPolicyScore,
      challengeScore: Number(scoring.challengeScore || 0),
      autonomyScore: Number(scoring.autonomyScore || 0),
      salaryScore,
    })

    const applicationDate = core.applicationDate
      ? core.applicationDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const savedJob: JobApplication = {
      id: job?.id ?? generateId(),
      jobTitle: core.jobTitle,
      company: core.company,
      contact: core.contact,
      applicationDate,
      salaryMin: core.salaryMin,
      salaryMax,
      salaryIsEstimated: core.salaryNotListed,
      status: core.status,
      scoring: {
        titleScore: scoring.titleScore,
        workingPolicy: scoring.workingPolicy,
        distanceModifier,
        workingPolicyScore,
        challengeScore: scoring.challengeScore,
        autonomyScore: scoring.autonomyScore,
        salaryScore,
        totalScore,
      },
    }

    if (job) {
      onJobUpdated(savedJob)
    } else {
      onJobAdded(savedJob)
    }
    handleCancel()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={job ? `Edit Application — Step ${step}` : `Add Application — Step ${step}`}
      size="lg"
    >
      {step === 1 ? (
        <CoreDetailsForm
          form={coreForm}
          onCancel={handleCancel}
          onNext={() => setStep(2)}
        />
      ) : (
        <ScoringForm
          form={scoringForm}
          salaryMax={coreForm.values.salaryMax !== '' && Number(coreForm.values.salaryMax) > 0 ? Number(coreForm.values.salaryMax) : null}
          settings={settings}
          onBack={() => setStep(1)}
          onSave={handleSave}
        />
      )}
    </Modal>
  )
}
