interface Props {
  onAdd: () => void
}

export function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-6">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{ background: 'rgba(139,175,150,0.12)' }}
      >
        🌿
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm-dark)' }}
        >
          Nothing here yet
        </p>
        <p className="text-sm" style={{ color: 'var(--color-warm-mid)' }}>
          Add a habit when you feel ready.
          <br />
          There's no rush.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{
          background: 'var(--color-sage)',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(139,175,150,0.3)',
        }}
      >
        Add your first habit
      </button>
    </div>
  )
}
