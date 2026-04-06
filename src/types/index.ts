export interface Habit {
  id: string
  name: string
  emoji: string
  startDate: string    // current streak start — ISO "YYYY-MM-DD"
  createdDate: string  // when habit was first added — ISO "YYYY-MM-DD"
  slips: string[]      // dates the user slipped — ISO "YYYY-MM-DD"[]
}

export interface Milestone {
  days: number
  label: string
}
