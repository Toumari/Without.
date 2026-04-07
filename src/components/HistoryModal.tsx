import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { getCalendarDays, getStreaks, getBestStreak, getMilestone, calcDays } from '../utils/milestones'
import type { Habit } from '../types'

function buildShareText(habit: Habit): string {
  const days = calcDays(habit.startDate)
  const milestone = getMilestone(days)
  const lines = [
    `${habit.emoji} ${days} ${days === 1 ? 'day' : 'days'} without ${habit.name}.`,
    milestone ? `That's ${milestone.label.replace(' ✦', '')}.` : '',
    '',
    'without. — gentle tracking for gentle minds',
  ]
  return lines.filter(Boolean).join('\n')
}

async function shareHabit(habit: Habit): Promise<'shared' | 'copied' | 'failed'> {
  const text = buildShareText(habit)
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      // user cancelled or error — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}

interface Props {
  open: boolean
  habit: Habit | null
  onClose: () => void
}

const STATUS_COLORS: Record<string, string> = {
  clean: 'var(--color-sage)',
  slip: 'var(--color-rose-muted)',
  before: 'transparent',
  future: 'transparent',
}

const STATUS_OPACITY: Record<string, number> = {
  clean: 1,
  slip: 1,
  before: 0,
  future: 0,
}

function Calendar({ habit }: { habit: Habit }) {
  const days = getCalendarDays(habit, 91)

  // Group into weeks (columns of 7)
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  // Month labels — find where months change across weeks
  const monthLabels = weeks.map(week => {
    const firstVisible = week.find(d => d.status !== 'before')
    return firstVisible ? format(parseISO(firstVisible.date), 'MMM') : ''
  })
  // Deduplicate consecutive same labels
  const deduped = monthLabels.map((m, i) => (m !== monthLabels[i - 1] ? m : ''))

  return (
    <div className="flex flex-col gap-2">
      {/* Legend */}
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--color-sage)' }} />
          <span className="text-xs" style={{ color: 'var(--color-warm-mid)' }}>clean</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--color-rose-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--color-warm-mid)' }}>slipped</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            <span className="text-center" style={{ fontSize: 8, color: 'var(--color-warm-gray)', minHeight: 10 }}>
              {deduped[wi]}
            </span>
            {week.map(day => (
              <div
                key={day.date}
                title={day.date}
                className="rounded-sm"
                style={{
                  width: 10,
                  height: 10,
                  background: STATUS_COLORS[day.status],
                  opacity: STATUS_OPACITY[day.status],
                  border: day.status === 'before' || day.status === 'future'
                    ? '1px solid rgba(128,128,128,0.15)'
                    : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function StreakList({ habit }: { habit: Habit }) {
  const streaks = getStreaks(habit)

  if (streaks.length === 1 && streaks[0].end === null) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-warm-gray)' }}>
        Past streaks
      </p>
      <div className="flex flex-col gap-1.5">
        {streaks.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-warm-dark)' }}>
              {s.end === null ? (
                <span style={{ color: 'var(--color-sage)' }}>
                  {s.days} {s.days === 1 ? 'day' : 'days'} and counting
                </span>
              ) : (
                `${s.days} ${s.days === 1 ? 'day' : 'days'}`
              )}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-warm-mid)' }}>
              {s.end === null
                ? `from ${format(parseISO(s.start), 'MMM d')}`
                : `${format(parseISO(s.start), 'MMM d')} – ${format(parseISO(s.end), 'MMM d')}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HistoryModal({ open, habit, onClose }: Props) {
  const [shareLabel, setShareLabel] = useState('Share milestone')

  const handleShare = async (h: Habit) => {
    const days = calcDays(h.startDate)
    if (!getMilestone(days)) return
    const result = await shareHabit(h)
    if (result === 'copied') {
      setShareLabel('Copied!')
      setTimeout(() => setShareLabel('Share milestone'), 2500)
    }
  }

  return (
    <AnimatePresence>
      {open && habit && (
        <>
          <motion.div
            key="history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(42,38,35,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <motion.div
              key="history-modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-t-3xl p-6 flex flex-col gap-6 pointer-events-auto w-full safe-bottom"
              style={{
                background: 'var(--color-card)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
                maxWidth: '480px',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{habit.emoji}</span>
                <div className="flex-1">
                  <p className="text-base font-semibold" style={{ color: 'var(--color-warm-dark)' }}>
                    {habit.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-warm-mid)' }}>
                    tracking since {format(parseISO(habit.createdDate), 'MMM d, yyyy')}
                  </p>
                  {habit.slips.length > 0 && (() => {
                    const best = getBestStreak(habit)
                    return best > 0 ? (
                      <p className="text-xs" style={{ color: 'var(--color-sage)' }}>
                        best streak: {best} {best === 1 ? 'day' : 'days'}
                      </p>
                    ) : null
                  })()}
                </div>
                <button
                  onClick={onClose}
                  className="text-sm font-medium transition-opacity hover:opacity-60"
                  style={{ color: 'var(--color-warm-gray)' }}
                >
                  Done
                </button>
              </div>

              <Calendar habit={habit} />
              <StreakList habit={habit} />
              {getMilestone(calcDays(habit.startDate)) && (
                <button
                  onClick={() => handleShare(habit)}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                  style={{
                    background: 'var(--color-sage)',
                    boxShadow: '0 4px 16px rgba(139,175,150,0.35)',
                  }}
                >
                  {shareLabel}
                </button>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
