import { afterEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  getSettings,
  resetSettings,
  saveSettings,
} from '@/services/settings.service'
import type { UserSettings } from '@/models/settings'

const customSettings: UserSettings = {
  workingPolicyWeights: {
    fullyRemote: 90,
    annualRetreats: 85,
    quarterly: 80,
    oncePerMonth: 70,
    fortnightly: 60,
    oncePerWeek: 50,
    twicePerWeek: 30,
    threeTimesPerWeek: 10,
  },
  salary: {
    minimumSalary: 60000,
    targetSalary: 90000,
  },
}

afterEach(() => {
  localStorage.clear()
})

describe('getSettings', () => {
  it('returns defaults when localStorage is empty', () => {
    const result = getSettings()
    expect(result).toEqual(DEFAULT_SETTINGS)
  })

  it('returns saved settings when present in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSettings))
    const result = getSettings()
    expect(result).toEqual(customSettings)
  })
})

describe('saveSettings', () => {
  it('persists settings to localStorage', () => {
    saveSettings(customSettings)
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual(customSettings)
  })

  it('overwrites previously saved settings', () => {
    saveSettings(DEFAULT_SETTINGS)
    saveSettings(customSettings)
    const result = getSettings()
    expect(result).toEqual(customSettings)
  })
})

describe('resetSettings', () => {
  it('removes persisted data from localStorage', () => {
    saveSettings(customSettings)
    resetSettings()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('causes getSettings to return defaults after reset', () => {
    saveSettings(customSettings)
    resetSettings()
    expect(getSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
