'use client'

import { NumberInput, Stack, Title, Text } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import type { UserSettings, WorkingPolicy } from '@/models/settings'

const POLICY_LABELS: Record<WorkingPolicy, string> = {
  fullyRemote: 'Fully Remote',
  annualRetreats: 'Annually / Company Retreats',
  quarterly: 'Quarterly',
  oncePerMonth: 'Once per Month',
  fortnightly: 'Fortnightly',
  oncePerWeek: 'Once per Week',
  twicePerWeek: 'Twice per Week',
  threeTimesPerWeek: 'Three Times per Week',
}

const POLICIES: WorkingPolicy[] = [
  'fullyRemote',
  'annualRetreats',
  'quarterly',
  'oncePerMonth',
  'fortnightly',
  'oncePerWeek',
  'twicePerWeek',
  'threeTimesPerWeek',
]

interface WorkingPolicySettingsProps {
  form: UseFormReturnType<UserSettings>
}

export default function WorkingPolicySettings({ form }: WorkingPolicySettingsProps) {
  return (
    <Stack>
      <Title order={4}>Working Policy Weights</Title>
      <Text>
        Use the below to specify how each working policy should be weighted.<br />
        "100" means this is ideal for you. "0" means its not.
      </Text>
      <Text>
        For example, if you are happy attending the office twice a week, you would set 100 for all options except "Three times a week".<br />
        You would then set "Three times a week" to a value that makes sense for you.
      </Text>
      {POLICIES.map((policy) => (
        <NumberInput
          key={policy}
          label={POLICY_LABELS[policy]}
          min={0}
          max={100}
          step={1}
          clampBehavior="strict"
          {...form.getInputProps(`workingPolicyWeights.${policy}`)}
        />
      ))}
    </Stack>
  )
}
