'use client'

import { AppShell } from '@mantine/core'
import Header from '@/components/layout/Header'

export default function AppShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
