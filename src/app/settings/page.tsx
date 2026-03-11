'use client'

import dynamic from 'next/dynamic'

const SettingsForm = dynamic(() => import('@/components/settings/SettingsForm'), { ssr: false })

export default function SettingsPage() {
  return <SettingsForm />
}
