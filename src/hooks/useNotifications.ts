import { useEffect, useState } from 'react'
import { loadHabits } from '../utils/storage'

const NOTIFIED_KEY = 'without_notified_date'
const ENABLED_KEY = 'without_notifications_enabled'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function buildMessage(): { title: string; body: string } {
  const habits = loadHabits()
  if (habits.length === 0) {
    return { title: 'without.', body: 'A gentle check-in — how are you doing today? 🌿' }
  }
  if (habits.length === 1) {
    return { title: 'without.', body: `Checking in on "${habits[0].name}". Keep going 🌿` }
  }
  return {
    title: 'without.',
    body: `You're tracking ${habits.length} habits. A gentle reminder to check in 🌿`,
  }
}

async function registerPeriodicSync() {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    if ('periodicSync' in reg) {
      await (reg as any).periodicSync.register('daily-reminder', {
        minInterval: 20 * 60 * 60 * 1000, // 20 hours
      })
    }
  } catch {
    // periodicSync not supported or permission denied — on-open fallback handles it
  }
}

function maybeNotifyOnOpen() {
  if (Notification.permission !== 'granted') return
  if (localStorage.getItem(ENABLED_KEY) !== 'true') return
  const lastNotified = localStorage.getItem(NOTIFIED_KEY)
  if (lastNotified === todayStr()) return

  const { title, body } = buildMessage()
  new Notification(title, { body, icon: '/icon-192.svg', badge: '/icon-192.svg' })
  localStorage.setItem(NOTIFIED_KEY, todayStr())
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )
  const [enabled, setEnabled] = useState(
    localStorage.getItem(ENABLED_KEY) === 'true'
  )

  const supported = typeof Notification !== 'undefined'

  // On open: fire today's reminder if due
  useEffect(() => {
    if (supported) maybeNotifyOnOpen()
  }, [supported])

  const enable = async () => {
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      localStorage.setItem(ENABLED_KEY, 'true')
      setEnabled(true)
      registerPeriodicSync()
      // Show today's reminder immediately if not yet shown
      const lastNotified = localStorage.getItem(NOTIFIED_KEY)
      if (lastNotified !== todayStr()) {
        const { title, body } = buildMessage()
        new Notification(title, { body, icon: '/icon-192.svg', badge: '/icon-192.svg' })
        localStorage.setItem(NOTIFIED_KEY, todayStr())
      }
    }
    return result
  }

  const disable = () => {
    localStorage.setItem(ENABLED_KEY, 'false')
    setEnabled(false)
  }

  return { permission, enabled, supported, enable, disable }
}
