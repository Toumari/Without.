import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { calcDays, getMilestone } from '../utils/milestones'
import { MilestoneBadge } from './MilestoneBadge'
import type { Habit } from '../types'

interface Props {
  habit: Habit
  index: number
  onSlip: (id: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return count
}

export function HabitCard({ habit, index, onSlip, onEdit, onDelete }: Props) {
  const days = calcDays(habit.startDate)
  const milestone = getMilestone(days)
  const displayCount = useCountUp(days)
  const cardRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSlip = () => {
    cardRef.current?.classList.add('card-shake')
    setTimeout(() => {
      cardRef.current?.classList.remove('card-shake')
      onSlip(habit.id)
    }, 420)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        className={`rounded-3xl flex flex-col ${milestone ? 'milestone-glow' : ''}`}
        style={{
          background: 'var(--color-card)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: milestone ? undefined : '1px solid rgba(0,0,0,0.04)',
        }}
      >
        {/* Main row */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-4">
          {/* Emoji */}
          <span className="text-2xl leading-none flex-shrink-0">{habit.emoji}</span>

          {/* Name + milestone */}
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span
              className="text-base font-semibold leading-tight truncate"
              style={{ color: 'var(--color-warm-dark)' }}
            >
              {habit.name}
            </span>
            {milestone && <MilestoneBadge label={milestone.label} />}
          </div>

          {/* Day count */}
          <div className="flex flex-col items-center flex-shrink-0">
            <span
              className="leading-none tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--color-warm-dark)',
              }}
            >
              {displayCount}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--color-warm-mid)' }}
            >
              {days === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-warm-gray)' }}
            >
              ···
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-9 z-20 rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: 'var(--color-card)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    minWidth: '120px',
                  }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(habit) }}
                    className="px-4 py-3 text-sm font-medium text-left transition-opacity hover:opacity-60"
                    style={{ color: 'var(--color-warm-dark)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(habit.id) }}
                    className="px-4 py-3 text-sm font-medium text-left transition-opacity hover:opacity-60"
                    style={{ color: 'var(--color-rose-muted)' }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center border-t px-5 py-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <button
            onClick={handleSlip}
            className="text-xs font-medium tracking-widest uppercase transition-opacity duration-150 hover:opacity-60 px-3 py-1"
            style={{ color: 'var(--color-warm-gray)', letterSpacing: '0.1em' }}
          >
            I slipped
          </button>
        </div>
      </div>
    </motion.div>
  )
}
