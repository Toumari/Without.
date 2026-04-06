import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  open: boolean
  onDismiss: () => void
  onConfirm: () => void
}

export function SlipModal({ open, onDismiss, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="slip-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(42,38,35,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onDismiss}
          />

          {/* Centering container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          {/* Modal */}
          <motion.div
            key="slip-modal"
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
            <div className="flex flex-col gap-3 text-center">
              <div className="text-5xl">🌱</div>
              <h2
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm-dark)' }}
              >
                That's okay.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-warm-mid)' }}>
                Every moment is a chance to begin again.
                <br />
                There's no failure here — only fresh starts.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onDismiss}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{
                  background: 'var(--color-sage)',
                  boxShadow: '0 4px 16px rgba(139,175,150,0.35)',
                }}
              >
                Actually, I'm fine
              </button>
              <button
                onClick={onConfirm}
                className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'var(--color-warm-gray)' }}
              >
                Start fresh today
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
