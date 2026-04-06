import { useState, useCallback } from 'react'
import { loadHabits, saveHabits } from '../utils/storage'
import { todayISO } from '../utils/milestones'
import type { Habit } from '../types'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)

  const persist = useCallback((next: Habit[]) => {
    setHabits(next)
    saveHabits(next)
  }, [])

  const addHabit = useCallback(
    (name: string, emoji: string, startDate: string) => {
      const uuid = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b, i) => ([4, 6].includes(i) ? (b & 0x3f | (i === 6 ? 0x40 : 0x80)) : b).toString(16).padStart(2, '0'))
            .join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
      const newHabit: Habit = {
        id: uuid,
        name,
        emoji,
        startDate,
      }
      persist([...habits, newHabit])
    },
    [habits, persist],
  )

  const resetHabit = useCallback(
    (id: string) => {
      persist(
        habits.map((h) => (h.id === id ? { ...h, startDate: todayISO() } : h)),
      )
    },
    [habits, persist],
  )

  const deleteHabit = useCallback(
    (id: string) => {
      persist(habits.filter((h) => h.id !== id))
    },
    [habits, persist],
  )

  const editHabit = useCallback(
    (id: string, name: string, emoji: string, startDate: string) => {
      persist(habits.map((h) => (h.id === id ? { ...h, name, emoji, startDate } : h)))
    },
    [habits, persist],
  )

  return { habits, addHabit, editHabit, resetHabit, deleteHabit }
}
