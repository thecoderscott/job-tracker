'use client'

import { Button, Group, NumberInput, Select, Switch, Text, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import type { ApplicationStatus } from '@/models/job'

export interface CoreDetailsFormValues {
  jobTitle: string
  company: string
  contact: string
  applicationDate: Date | null
  salaryMin: number | null
  salaryMax: number | string
  salaryNotListed: boolean
  status: ApplicationStatus
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Submitted',
  'Acknowledged',
  'Initial Contact',
  'Stale',
  'Rejected',
  'Interviewing',
  'Offered',
]

interface CoreDetailsFormProps {
  form: UseFormReturnType<CoreDetailsFormValues>
  onCancel: () => void
  onNext: () => void
}

export default function CoreDetailsForm({ form, onCancel, onNext }: CoreDetailsFormProps) {
  return (
    <form onSubmit={form.onSubmit(onNext)}>
      <TextInput
        label="Job Title"
        required
        mb="sm"
        {...form.getInputProps('jobTitle')}
      />
      <TextInput
        label="Company"
        required
        mb="sm"
        {...form.getInputProps('company')}
      />
      <TextInput
        label="Contact"
        mb="sm"
        {...form.getInputProps('contact')}
      />
      <DatePickerInput
        label="Application Date"
        required
        mb="sm"
        {...form.getInputProps('applicationDate')}
      />
      <Group justify="space-between" align="center" mb="xs">
        <Text size="sm" fw={500}>Salary</Text>
        <Switch
          label="Not listed"
          size="sm"
          {...form.getInputProps('salaryNotListed', { type: 'checkbox' })}
        />
      </Group>
      <NumberInput
        label={form.values.salaryNotListed ? 'Estimated Salary Min' : 'Salary Min'}
        leftSection="£"
        description="Optional — leave blank if not a range"
        mb="sm"
        {...form.getInputProps('salaryMin')}
      />
      <NumberInput
        label={form.values.salaryNotListed ? 'Estimated Salary Max' : 'Salary Max'}
        leftSection="£"
        required={!form.values.salaryNotListed}
        mb="sm"
        {...form.getInputProps('salaryMax')}
      />
      <Select
        label="Status"
        required
        mb="md"
        data={STATUS_OPTIONS}
        {...form.getInputProps('status')}
      />
      <Group justify="flex-end">
        <Button type="button" variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Next</Button>
      </Group>
    </form>
  )
}
