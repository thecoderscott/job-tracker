'use client'

import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import SalarySettings from '@/components/settings/SalarySettings'
import WorkingPolicySettings from '@/components/settings/WorkingPolicySettings'
import { useSettings } from '@/hooks/useSettings'
import type { UserSettings } from '@/models/settings'
import { DEFAULT_SETTINGS } from '@/services/settings.service'

export default function SettingsForm() {
  const { settings, saveSettings, resetSettings } = useSettings()
  const [saved, setSaved] = useState(false)

  const form = useForm<UserSettings>({
    initialValues: settings,
    validate: {
      salary: {
        targetSalary: (value, values) =>
          value > values.salary.minimumSalary
            ? null
            : 'Target salary must be greater than minimum salary',
      },
    },
  })

  const handleSave = form.onSubmit((values) => {
    saveSettings(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  })

  const handleReset = () => {
    resetSettings()
    form.setValues(DEFAULT_SETTINGS)
    setSaved(false)
  }

  return (
    <Stack maw={600}>
      <Title order={2}>Settings</Title>
      <Text>The below settings are used to calculate each job's final score.</Text>
      <form onSubmit={handleSave}>
        <Stack gap="xl">
          <WorkingPolicySettings form={form} />
          <SalarySettings form={form} />
          <Group justify="flex-end" align="center">
            {saved && (
              <Text c="green" size="sm">
                Settings saved.
              </Text>
            )}
            <Button variant="default" onClick={handleReset} type="button">
              Reset to Defaults
            </Button>
            <Button type="submit">Save</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  )
}
