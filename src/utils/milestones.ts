import { differenceInCalendarDays, parseISO, startOfDay, subDays, format } from 'date-fns'
import type { Habit, Milestone } from '../types'

export const MILESTONES: Milestone[] = [
  { days: 1,   label: 'first day ✦' },
  { days: 7,   label: 'one week ✦' },
  { days: 14,  label: 'two weeks ✦' },
  { days: 30,  label: 'one month ✦' },
  { days: 60,  label: 'two months ✦' },
  { days: 90,  label: 'three months ✦' },
  { days: 100, label: '100 days ✦' },
  { days: 180, label: 'six months ✦' },
  { days: 365, label: 'one year ✦' },
]

export function calcDays(startDate: string): number {
  const start = startOfDay(parseISO(startDate))
  const today = startOfDay(new Date())
  return Math.max(0, differenceInCalendarDays(today, start))
}

export function getMilestone(days: number): Milestone | null {
  return MILESTONES.find((m) => m.days === days) ?? null
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export type DayStatus = 'clean' | 'slip' | 'before' | 'future'

export interface CalendarDay {
  date: string
  status: DayStatus
}

export interface StreakRecord {
  start: string
  end: string | null  // null = current streak
  days: number
}

export function getCalendarDays(habit: Habit, numDays = 91): CalendarDay[] {
  const today = startOfDay(new Date())
  const slipSet = new Set(habit.slips)

  return Array.from({ length: numDays }, (_, i) => {
    const date = format(subDays(today, numDays - 1 - i), 'yyyy-MM-dd')
    let status: DayStatus
    if (date < habit.createdDate) status = 'before'
    else if (date > todayISO()) status = 'future'
    else if (slipSet.has(date)) status = 'slip'
    else status = 'clean'
    return { date, status }
  })
}

export function getBestStreak(habit: Habit): number {
  const streaks = getStreaks(habit)
  return Math.max(...streaks.map(s => s.days))
}

export function getStreaks(habit: Habit): StreakRecord[] {
  const records: StreakRecord[] = []
  const slips = [...habit.slips].sort()

  let cursor = habit.createdDate
  for (const slip of slips) {
    records.push({
      start: cursor,
      end: slip,
      days: Math.max(0, differenceInCalendarDays(parseISO(slip), parseISO(cursor))),
    })
    cursor = slip
  }

  // Current streak
  records.push({
    start: habit.startDate,
    end: null,
    days: calcDays(habit.startDate),
  })

  return records.reverse()
}
