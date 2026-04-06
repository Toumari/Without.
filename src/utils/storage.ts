import type { Habit } from '../types'

const KEY = 'without_habits'

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Habit[]) : []
  } catch {
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEY, JSON.stringify(habits))
}
