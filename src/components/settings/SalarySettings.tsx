'use client'

import { List, NumberInput, Stack, Text, Title } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import type { UserSettings } from '@/models/settings'

interface SalarySettingsProps {
  form: UseFormReturnType<UserSettings>
}

export default function SalarySettings({ form }: SalarySettingsProps) {
  return (
    <Stack>
      <Title order={4}>Salary Thresholds</Title>
      <Text>
        The following settings will be used to weight final scores. For example:
      </Text>
      <List>
        <List.Item>A job listed at £60,000/year, with your minimum set to £50,000 and target set to £70,000 would score 50 points.</List.Item>
        <List.Item>With the same minimum and target, if another job was listed at £100,000, it would score 142.9</List.Item>
      </List>
      <NumberInput
        label="Minimum Salary"
        description="Scores 0 at this value"
        leftSection="£"
        min={0}
        step={1000}
        {...form.getInputProps('salary.minimumSalary')}
      />
      <NumberInput
        label="Target Salary"
        description="Scores 100 at this value"
        leftSection="£"
        min={0}
        step={1000}
        {...form.getInputProps('salary.targetSalary')}
      />
    </Stack>
  )
}
