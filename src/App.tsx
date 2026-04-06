import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Moon, Sun } from 'lucide-react'
import { useHabits } from './hooks/useHabits'
import { useNotifications } from './hooks/useNotifications'
import { useTheme } from './hooks/useTheme'
import { HabitCard } from './components/HabitCard'
import { AddHabitModal } from './components/AddHabitModal'
import { SlipModal } from './components/SlipModal'
import { DeleteModal } from './components/DeleteModal'
import { EmptyState } from './components/EmptyState'
import { FAB } from './components/FAB'
import type { Habit } from './types'

export default function App() {
  const { habits, addHabit, editHabit, resetHabit, deleteHabit, reorderHabits } = useHabits()
  const { status, enabled, enable, disable } = useNotifications()
  const { isDark, toggle: toggleTheme } = useTheme()
  const [showAdd, setShowAdd] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined)
  const [slippingId, setSlippingId] = useState<string | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const [bellMessage, setBellMessage] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const handleSlip = (id: string) => setSlippingId(id)

  const handleConfirmSlip = () => {
    if (slippingId) resetHabit(slippingId)
    setSlippingId(null)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setShowAdd(true)
  }

  const handleModalClose = () => {
    setShowAdd(false)
    setEditingHabit(undefined)
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-cream)' }}>
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm-dark)' }}
          >
            without.
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--color-warm-mid)' }}>
            gentle tracking for gentle minds
          </p>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-warm-gray)' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications bell */}
          {status !== 'unsupported' && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={async () => {
                  if (enabled) {
                    disable()
                  } else if (status === 'denied') {
                    setBellMessage('To reset: delete the app, clear site data in Settings > Safari > Advanced > Website Data, then re-add to Home Screen')
                    setTimeout(() => setBellMessage(null), 6000)
                  } else if (status === 'needs-install') {
                    setBellMessage('Add to Home Screen first to enable notifications')
                    setTimeout(() => setBellMessage(null), 3500)
                  } else {
                    const result = await enable()
                    if (result === 'denied') {
                      setBellMessage('To reset: delete the app, clear site data in Settings > Safari > Advanced > Website Data, then re-add to Home Screen')
                      setTimeout(() => setBellMessage(null), 6000)
                    }
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
                title={enabled ? 'Disable daily reminder' : 'Enable daily reminder'}
                style={{ color: enabled ? 'var(--color-sage)' : 'var(--color-warm-gray)' }}
              >
                {enabled ? '🔔' : '🔕'}
              </button>
              {bellMessage && (
                <p className="text-xs text-right max-w-40 leading-tight" style={{ color: 'var(--color-warm-mid)' }}>
                  {bellMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-4 pb-28 gap-3">
        {habits.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (over && active.id !== over.id) {
                reorderHabits(String(active.id), String(over.id))
              }
            }}
          >
            <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
              {habits.map((habit, index) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  index={index}
                  onSlip={handleSlip}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeletingHabit(habits.find(h => h.id === id) ?? null)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </main>

      {habits.length > 0 && <FAB onClick={() => setShowAdd(true)} />}

      <AddHabitModal
        open={showAdd}
        onClose={handleModalClose}
        onAdd={addHabit}
        onEdit={editHabit}
        habit={editingHabit}
      />

      <DeleteModal
        open={deletingHabit !== null}
        habitName={deletingHabit?.name ?? ''}
        onDismiss={() => setDeletingHabit(null)}
        onConfirm={() => {
          if (deletingHabit) deleteHabit(deletingHabit.id)
          setDeletingHabit(null)
        }}
      />

      <SlipModal
        open={slippingId !== null}
        onDismiss={() => setSlippingId(null)}
        onConfirm={handleConfirmSlip}
      />
    </div>
  )
}
