'use client'

import { ActionIcon, Group, Title } from '@mantine/core'
import { IconSettings, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isSettings = pathname === '/settings'

  return (
    <Group justify="space-between" h="100%" px="md">
      <Title order={3}>Job Tracker</Title>
      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label={isSettings ? 'Close settings' : 'Settings'}
        component={Link}
        href={isSettings ? '/' : '/settings'}
      >
        {isSettings ? <IconX size={20} /> : <IconSettings size={20} />}
      </ActionIcon>
    </Group>
  )
}
