import type { Habit } from '../types'

const KEY = 'without_habits'

function migrate(raw: any[]): Habit[] {
  return raw.map(h => ({
    ...h,
    createdDate: h.createdDate ?? h.startDate,
    slips: h.slips ?? [],
  }))
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? migrate(JSON.parse(raw) as any[]) : []
  } catch {
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEY, JSON.stringify(habits))
}
