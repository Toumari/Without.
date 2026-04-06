import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { todayISO } from '../utils/milestones'
import type { Habit } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (name: string, emoji: string, startDate: string) => void
  onEdit?: (id: string, name: string, emoji: string, startDate: string) => void
  habit?: Habit
}

export function AddHabitModal({ open, onClose, onAdd, onEdit, habit }: Props) {
  const editing = !!habit
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [error, setError] = useState<string | null>(null)

  const isDisabled = !name.trim()

  useEffect(() => {
    if (open) {
      setName(habit?.name ?? '')
      setEmoji(habit?.emoji ?? '')
      setStartDate(habit?.startDate ?? todayISO())
      setError(null)
    }
  }, [open, habit])

  const handleSubmit = () => {
    try {
      const trimmed = name.trim()
      if (!trimmed) return
      if (editing && habit && onEdit) {
        onEdit(habit.id, trimmed, emoji || '🌿', startDate || todayISO())
      } else {
        onAdd(trimmed, emoji || '🌿', startDate || todayISO())
      }
      onClose()
    } catch (e) {
      setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e))
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="add-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(42,38,35,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Centering container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          {/* Modal */}
          <motion.div
            key="add-modal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-8 flex flex-col gap-6 pointer-events-auto w-full"
            style={{
              background: 'var(--color-card)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              maxWidth: '400px',
            }}
          >
            <div className="flex flex-col gap-1 text-center">
              <h2
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm-dark)' }}
              >
                {editing ? 'Edit habit' : 'What are you avoiding?'}
              </h2>
              {!editing && (
                <p className="text-sm" style={{ color: 'var(--color-warm-mid)' }}>
                  Name it gently. No judgment here.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {/* Emoji + Name row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emoji}
                  onChange={e => setEmoji(e.target.value.slice(-2))}
                  placeholder="🌿"
                  maxLength={2}
                  className="w-14 text-center text-2xl rounded-2xl border-0 outline-none"
                  style={{
                    background: 'var(--color-cream)',
                    color: 'var(--color-warm-dark)',
                    padding: '0.75rem 0',
                  }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="e.g. scrolling, coffee, snoozing"
                  autoFocus
                  className="flex-1 rounded-2xl border-0 outline-none font-medium px-4"
                  style={{
                    background: 'var(--color-cream)',
                    color: 'var(--color-warm-dark)',
                    fontSize: '16px',
                  }}
                />
              </div>

              {/* Start date */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium tracking-wide px-1"
                  style={{ color: 'var(--color-warm-mid)' }}
                >
                  Last time you did it
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={todayISO()}
                  onChange={e => setStartDate(e.target.value)}
                  className="rounded-2xl border-0 outline-none font-medium px-4 py-3"
                  style={{
                    background: 'var(--color-cream)',
                    color: 'var(--color-warm-dark)',
                    colorScheme: 'light',
                    fontSize: '16px',
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
                style={isDisabled ? {
                  background: 'var(--color-cream)',
                  color: 'var(--color-warm-gray)',
                  boxShadow: 'none',
                } : {
                  background: 'var(--color-sage)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(139,175,150,0.35)',
                }}
              >
                {editing ? 'Save changes' : 'Start tracking'}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'var(--color-warm-gray)' }}
              >
                Cancel
              </button>
              {error && (
                <p className="text-xs text-center break-all" style={{ color: '#c0392b' }}>
                  {error}
                </p>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
