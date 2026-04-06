import { useEffect, useState } from 'react'

type ThemePreference = 'light' | 'dark' | null

const KEY = 'without_theme'

export function applyThemeClass(pref: ThemePreference) {
  document.documentElement.classList.remove('light', 'dark')
  if (pref) document.documentElement.classList.add(pref)
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(
    () => (localStorage.getItem(KEY) as ThemePreference) || null
  )

  useEffect(() => {
    applyThemeClass(preference)
    if (preference) localStorage.setItem(KEY, preference)
    else localStorage.removeItem(KEY)
  }, [preference])

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = preference === 'dark' || (preference === null && systemDark)

  const toggle = () => setPreference(isDark ? 'light' : 'dark')

  return { isDark, toggle }
}
