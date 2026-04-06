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
        minInterval: 20 * 60 * 60 * 1000,
      })
    }
  } catch {
    // periodicSync not supported — on-open fallback handles it
  }
}

function maybeNotifyOnOpen() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  if (localStorage.getItem(ENABLED_KEY) !== 'true') return
  if (localStorage.getItem(NOTIFIED_KEY) === todayStr()) return

  const { title, body } = buildMessage()
  new Notification(title, { body, icon: '/icon-192.svg', badge: '/icon-192.svg' })
  localStorage.setItem(NOTIFIED_KEY, todayStr())
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isStandalone =
  (navigator as any).standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches
const notificationSupported = typeof Notification !== 'undefined'

export type NotificationStatus = 'unsupported' | 'needs-install' | 'default' | 'granted' | 'denied'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationSupported ? Notification.permission : 'default'
  )
  const [enabled, setEnabled] = useState(localStorage.getItem(ENABLED_KEY) === 'true')

  // iOS in Safari browser — needs to be installed first
  const needsInstall = isIOS && !isStandalone

  const status: NotificationStatus = needsInstall
    ? 'needs-install'
    : !notificationSupported
    ? 'unsupported'
    : permission === 'denied'
    ? 'denied'
    : permission === 'granted' && enabled
    ? 'granted'
    : 'default'

  useEffect(() => {
    maybeNotifyOnOpen()
  }, [])

  const enable = async (): Promise<NotificationStatus> => {
    if (needsInstall) return 'needs-install'
    if (!notificationSupported) return 'unsupported'

    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      localStorage.setItem(ENABLED_KEY, 'true')
      setEnabled(true)
      registerPeriodicSync()
      if (localStorage.getItem(NOTIFIED_KEY) !== todayStr()) {
        const { title, body } = buildMessage()
        new Notification(title, { body, icon: '/icon-192.svg', badge: '/icon-192.svg' })
        localStorage.setItem(NOTIFIED_KEY, todayStr())
      }
      return 'granted'
    }
    return 'denied'
  }

  const disable = () => {
    localStorage.setItem(ENABLED_KEY, 'false')
    setEnabled(false)
  }

  const debug = {
    isIOS,
    isStandalone,
    notificationSupported,
    needsInstall,
    permission,
  }

  return { status, enabled, enable, disable, debug }
}
