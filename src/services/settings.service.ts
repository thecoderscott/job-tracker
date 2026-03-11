import type { UserSettings } from '@/models/settings'

export const STORAGE_KEY = 'job-tracker:settings'

export const DEFAULT_SETTINGS: UserSettings = {
  workingPolicyWeights: {
    fullyRemote: 100,
    annualRetreats: 100,
    quarterly: 95,
    oncePerMonth: 90,
    fortnightly: 75,
    oncePerWeek: 60,
    twicePerWeek: 40,
    threeTimesPerWeek: 25,
  },
  salary: {
    minimumSalary: 0,
    targetSalary: 0,
  },
}

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_SETTINGS
  return JSON.parse(raw) as UserSettings
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function resetSettings(): void {
  localStorage.removeItem(STORAGE_KEY)
}
