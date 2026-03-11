'use client'

import { useState } from 'react'
import { Table, UnstyledButton, Group, Text, ActionIcon } from '@mantine/core'
import { IconArrowUp, IconArrowDown, IconSelector, IconPencil, IconTrash } from '@tabler/icons-react'
import type { JobApplication, ApplicationStatus } from '@/models/job'

type SortColumn = 'applicationDate' | 'salaryMax' | 'status' | 'totalScore'
type SortDirection = 'asc' | 'desc'

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  Submitted: 0,
  Acknowledged: 1,
  'Initial Contact': 2,
  Stale: 3,
  Rejected: 4,
  Interviewing: 5,
  Offered: 6,
}

function formatSalary(min: number | null, max: number | null): string {
  if (max === null) return 'Not listed'
  const fmt = (n: number) => `£${n.toLocaleString('en-GB')}`
  if (min !== null) return `${fmt(min)} – ${fmt(max)}`
  return fmt(max)
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}-${month}-${year}`
}

interface ThSortableProps {
  label: string
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function ThSortable({ label, column, sortColumn, sortDirection, onSort }: ThSortableProps) {
  const isActive = sortColumn === column
  const Icon = isActive ? (sortDirection === 'asc' ? IconArrowUp : IconArrowDown) : IconSelector

  return (
    <Table.Th>
      <UnstyledButton onClick={() => onSort(column)}>
        <Group gap={4} wrap="nowrap">
          <Text fw={500} fz="sm">
            {label}
          </Text>
          <Icon size={14} />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

interface JobsTableProps {
  jobs: JobApplication[]
  onEdit: (job: JobApplication) => void
  onDelete: (job: JobApplication) => void
}

export default function JobsTable({ jobs, onEdit, onDelete }: JobsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('applicationDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sorted = [...jobs].sort((a, b) => {
    let cmp = 0
    if (sortColumn === 'applicationDate') {
      cmp = a.applicationDate.localeCompare(b.applicationDate)
    } else if (sortColumn === 'salaryMax') {
      if (a.salaryMax === null && b.salaryMax === null) cmp = 0
      else if (a.salaryMax === null) cmp = 1
      else if (b.salaryMax === null) cmp = -1
      else cmp = a.salaryMax - b.salaryMax
    } else if (sortColumn === 'status') {
      cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    } else if (sortColumn === 'totalScore') {
      cmp = a.scoring.totalScore - b.scoring.totalScore
    }
    return sortDirection === 'asc' ? cmp : -cmp
  })

  const sortProps = { sortColumn, sortDirection, onSort: handleSort }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <ThSortable label="Date" column="applicationDate" {...sortProps} />
          <Table.Th>Job Title</Table.Th>
          <Table.Th>Company</Table.Th>
          <ThSortable label="Salary" column="salaryMax" {...sortProps} />
          <ThSortable label="Status" column="status" {...sortProps} />
          <ThSortable label="Score" column="totalScore" {...sortProps} />
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {sorted.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={7}>
              <Text c="dimmed" ta="center">
                No applications yet. Click "+ Application" to add one.
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          sorted.map(job => (
            <Table.Tr key={job.id}>
              <Table.Td>{formatDate(job.applicationDate)}</Table.Td>
              <Table.Td>{job.jobTitle}</Table.Td>
              <Table.Td>{job.company}</Table.Td>
              <Table.Td>{formatSalary(job.salaryMin, job.salaryMax)}{job.salaryIsEstimated ? '*' : ''}</Table.Td>
              <Table.Td>{job.status}</Table.Td>
              <Table.Td>{job.scoring.totalScore.toFixed(1)}{job.salaryIsEstimated ? '*' : ''}</Table.Td>
              <Table.Td>
                <Group gap={4} wrap="nowrap">
                  <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => onEdit(job)}>
                    <IconPencil size={14} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" size="sm" onClick={() => onDelete(job)}>
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  )
}
