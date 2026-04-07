import { useEffect, useState } from 'react'

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// Triggers a re-render at midnight and whenever the app becomes visible again.
// Components that call calcDays() will automatically pick up the new date.
export function useDailyRefresh() {
  const [, setDate] = useState(todayStr)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function scheduleNext() {
      timeout = setTimeout(() => {
        setDate(todayStr())
        scheduleNext()
      }, msUntilMidnight())
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        setDate(todayStr())
      }
    }

    scheduleNext()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
}
