'use client'

import { useMemo } from 'react'
import { Button, Group, NumberInput, Select, TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import type { WorkingPolicy } from '@/models/settings'
import type { UserSettings } from '@/models/settings'
import type { DistanceModifier } from '@/models/job'
import {
  calculateWorkingPolicyScore,
  calculateSalaryScore,
  calculateTotalScore,
} from '@/services/scoring.service'

export interface ScoringFormValues {
  titleScore: number
  workingPolicy: WorkingPolicy
  distanceModifier: string
  challengeScore: number
  autonomyScore: number
}

const WORKING_POLICY_OPTIONS: { value: WorkingPolicy; label: string }[] = [
  { value: 'fullyRemote', label: 'Fully Remote' },
  { value: 'annualRetreats', label: 'Annual Retreats' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'oncePerMonth', label: 'Once per Month' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'oncePerWeek', label: 'Once per Week' },
  { value: 'twicePerWeek', label: 'Twice per Week' },
  { value: 'threeTimesPerWeek', label: 'Three Times per Week' },
]

const DISTANCE_OPTIONS = [
  { value: '1', label: 'Within 30 min' },
  { value: '0.75', label: 'Within 60 min' },
  { value: '0.5', label: 'More than 60 min' },
]

interface ScoringFormProps {
  form: UseFormReturnType<ScoringFormValues>
  salaryMax: number | null
  settings: UserSettings
  onBack: () => void
  onSave: () => void
}

export default function ScoringForm({ form, salaryMax, settings, onBack, onSave }: ScoringFormProps) {
  const { titleScore, workingPolicy, distanceModifier, challengeScore, autonomyScore } = form.values

  const workingPolicyScore = useMemo(
    () =>
      calculateWorkingPolicyScore(
        workingPolicy,
        Number(distanceModifier) as DistanceModifier,
        settings.workingPolicyWeights,
      ),
    [workingPolicy, distanceModifier, settings.workingPolicyWeights],
  )

  const salaryScore = useMemo(
    () =>
      salaryMax === null
        ? 0
        : calculateSalaryScore(salaryMax, settings.salary.minimumSalary, settings.salary.targetSalary),
    [salaryMax, settings.salary.minimumSalary, settings.salary.targetSalary],
  )

  const totalScore = useMemo(
    () =>
      calculateTotalScore({
        titleScore,
        workingPolicyScore,
        challengeScore,
        autonomyScore,
        salaryScore,
      }),
    [titleScore, workingPolicyScore, challengeScore, autonomyScore, salaryScore],
  )

  return (
    <div>
      <NumberInput
        label="Title Score"
        required
        mb="sm"
        {...form.getInputProps('titleScore')}
      />
      <Select
        label="Working Policy"
        required
        mb="sm"
        data={WORKING_POLICY_OPTIONS}
        {...form.getInputProps('workingPolicy')}
      />
      <Select
        label="Distance"
        required
        mb="sm"
        data={DISTANCE_OPTIONS}
        {...form.getInputProps('distanceModifier')}
      />
      <TextInput
        label="Working Policy Score"
        readOnly
        mb="sm"
        value={workingPolicyScore.toFixed(2)}
      />
      <NumberInput
        label="Challenge Score"
        required
        mb="sm"
        {...form.getInputProps('challengeScore')}
      />
      <NumberInput
        label="Autonomy Score"
        required
        mb="sm"
        {...form.getInputProps('autonomyScore')}
      />
      <TextInput
        label="Salary Score"
        readOnly
        mb="sm"
        value={salaryScore.toFixed(1)}
      />
      <TextInput
        label="Total Score"
        readOnly
        mb="md"
        value={totalScore.toFixed(1)}
      />
      <Group justify="flex-end">
        <Button type="button" variant="default" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </Group>
    </div>
  )
}
