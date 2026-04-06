import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'
import type { Milestone } from '../types'

export const MILESTONES: Milestone[] = [
  { days: 1,  label: 'first day ✦' },
  { days: 7,  label: 'one week ✦' },
  { days: 14, label: 'two weeks ✦' },
  { days: 30, label: 'one month ✦' },
  { days: 60, label: 'two months ✦' },
  { days: 90, label: 'three months ✦' },
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
