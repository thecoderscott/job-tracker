'use client'

import { useState } from 'react'
import { getSettings, resetSettings, saveSettings } from '@/services/settings.service'
import type { UserSettings } from '@/models/settings'

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => getSettings())

  const save = (next: UserSettings) => {
    saveSettings(next)
    setSettings(next)
  }

  const reset = () => {
    resetSettings()
    setSettings(getSettings())
  }

  return { settings, saveSettings: save, resetSettings: reset }
}
