'use client'

import { useMemo } from 'react'
import { Button, Divider, Group, NumberInput, Select, Text, TextInput } from '@mantine/core'
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
        titleScore: Number(titleScore || 0),
        workingPolicyScore,
        challengeScore: Number(challengeScore || 0),
        autonomyScore: Number(autonomyScore || 0),
        salaryScore,
      }),
    [titleScore, workingPolicyScore, challengeScore, autonomyScore, salaryScore],
  )

  return (
    <div>
      <NumberInput
        label="Title Score"
        description="How well the job title reflects the actual responsibilities. 100 = title matches the role exactly; 0 = misleading or irrelevant title."
        required
        mb="sm"
        {...form.getInputProps('titleScore')}
        onBlur={() => { if (typeof (form.values.titleScore as unknown) !== 'number') form.setFieldValue('titleScore', 0) }}
      />
      <Select
        label="Working Policy"
        description="The company's remote / office attendance policy."
        required
        mb="sm"
        data={WORKING_POLICY_OPTIONS}
        {...form.getInputProps('workingPolicy')}
      />
      <Select
        label="Distance"
        description="How far the office is if you need to commute. Applies a multiplier to the working policy score."
        required
        mb="sm"
        data={DISTANCE_OPTIONS}
        {...form.getInputProps('distanceModifier')}
      />
      <TextInput
        label="Working Policy Score"
        description="Calculated from working policy and distance. Read-only."
        readOnly
        disabled
        mb="sm"
        value={(workingPolicyScore ?? 0).toFixed(2)}
      />
      <NumberInput
        label="Challenge Score"
        description="How technically or intellectually stimulating the role appears. 100 = highly challenging and growth-oriented; 0 = routine with little stretch."
        required
        mb="sm"
        {...form.getInputProps('challengeScore')}
        onBlur={() => { if (typeof (form.values.challengeScore as unknown) !== 'number') form.setFieldValue('challengeScore', 0) }}
      />
      <NumberInput
        label="Autonomy Score"
        description="How much independence and ownership the role offers. 100 = full ownership over decisions and delivery; 0 = heavily directed with no autonomy."
        required
        mb="sm"
        {...form.getInputProps('autonomyScore')}
        onBlur={() => { if (typeof (form.values.autonomyScore as unknown) !== 'number') form.setFieldValue('autonomyScore', 0) }}
      />
      <TextInput
        label="Salary Score"
        readOnly
        disabled
        mb="sm"
        value={(salaryScore ?? 0).toFixed(1)}
      />
      <Divider my="md" />
      <Group justify="space-between" align="baseline" mb="md">
        <Text fw={600} fz="lg">Total Score</Text>
        <Text fw={700} fz="xl">{(Number(totalScore) || 0).toFixed(1)}</Text>
      </Group>
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
