'use client'

import { useState } from 'react'
import { Group, Title, Modal, Text, Button, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useJobs } from '@/hooks/useJobs'
import { useSettings } from '@/hooks/useSettings'
import type { JobApplication } from '@/models/job'
import JobsTable from '@/components/jobs/JobsTable'
import AddApplicationButton from '@/components/jobs/AddApplicationButton'
import AddApplicationModal from '@/components/jobs/AddApplicationModal'

export default function DashboardContent() {
  const { jobs, addJob, updateJob, deleteJob } = useJobs()
  const { settings } = useSettings()
  const settingsConfigured = settings.salary.minimumSalary > 0 || settings.salary.targetSalary > 0
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)
  const [deletingJob, setDeletingJob] = useState<JobApplication | null>(null)

  const handleEdit = (job: JobApplication) => setEditingJob(job)
  const handleDeleteRequest = (job: JobApplication) => setDeletingJob(job)
  const handleDeleteConfirm = () => {
    if (deletingJob) deleteJob(deletingJob.id)
    setDeletingJob(null)
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Applications</Title>
        <AddApplicationButton onClick={() => setModalOpen(true)} />
      </Group>
      {!settingsConfigured && (
        <Alert icon={<IconAlertCircle size={16} />} color="yellow" mb="md">
          Salary settings have not been configured. Scores may not reflect your preferences.{' '}
          <a href="/settings">Go to Settings</a>
        </Alert>
      )}
      <JobsTable jobs={jobs} onEdit={handleEdit} onDelete={handleDeleteRequest} />
      <AddApplicationModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onJobAdded={job => {
          addJob(job)
          setModalOpen(false)
        }}
        onJobUpdated={() => {}}
      />
      <AddApplicationModal
        key={editingJob?.id}
        opened={editingJob !== null}
        onClose={() => setEditingJob(null)}
        job={editingJob ?? undefined}
        onJobAdded={addJob}
        onJobUpdated={job => {
          updateJob(job)
          setEditingJob(null)
        }}
      />
      <Modal
        opened={deletingJob !== null}
        onClose={() => setDeletingJob(null)}
        title="Remove application"
        size="sm"
      >
        <Text mb="md">
          Remove <strong>{deletingJob?.jobTitle}</strong> at <strong>{deletingJob?.company}</strong>? This cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeletingJob(null)}>Cancel</Button>
          <Button color="red" onClick={handleDeleteConfirm}>Remove</Button>
        </Group>
      </Modal>
    </>
  )
}
