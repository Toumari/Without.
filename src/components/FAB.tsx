interface Props {
  onClick: () => void
}

export function FAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Add habit"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 z-40"
      style={{
        background: 'var(--color-sage)',
        boxShadow: '0 8px 24px rgba(139,175,150,0.4)',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )
}
