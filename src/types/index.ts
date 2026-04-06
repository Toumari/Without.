export interface Habit {
  id: string
  name: string
  emoji: string
  startDate: string // ISO date "YYYY-MM-DD"
}

export interface Milestone {
  days: number
  label: string
}
