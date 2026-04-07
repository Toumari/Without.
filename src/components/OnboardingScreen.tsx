import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onDone: () => void
}

const SLIDES = [
  {
    emoji: '🌿',
    heading: 'without.',
    body: 'A quiet place to track what you\'re stepping away from. No streaks to chase. No pressure.',
  },
  {
    emoji: '🔢',
    heading: 'Count away, not toward.',
    body: 'Add something you\'re avoiding. Watch the days grow. If you slip — that\'s okay. Reset and start again. No judgment here.',
  },
  {
    emoji: '✦',
    heading: 'Simple on purpose.',
    body: 'No accounts. No notifications you didn\'t ask for. Just you and your habits.',
  },
]

export function OnboardingScreen({ onDone }: Props) {
  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const isLast = slide === SLIDES.length - 1

  const go = (next: number) => {
    setDirection(next > slide ? 1 : -1)
    setSlide(next)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--color-cream)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <span className="text-6xl">{SLIDES[slide].emoji}</span>
            <h1
              className="text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm-dark)' }}
            >
              {SLIDES[slide].heading}
            </h1>
            <p
              className="text-base leading-relaxed max-w-xs"
              style={{ color: 'var(--color-warm-mid)' }}
            >
              {SLIDES[slide].body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 20 : 6,
                height: 6,
                background: i === slide ? 'var(--color-sage)' : 'var(--color-warm-gray)',
                opacity: i === slide ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 pb-12 flex flex-col gap-3">
        <button
          onClick={() => isLast ? onDone() : go(slide + 1)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--color-sage)',
            boxShadow: '0 4px 16px rgba(139,175,150,0.35)',
          }}
        >
          {isLast ? 'Add my first habit' : 'Next'}
        </button>
        {slide > 0 && (
          <button
            onClick={() => go(slide - 1)}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-warm-gray)' }}
          >
            Back
          </button>
        )}
        {slide === 0 && (
          <button
            onClick={onDone}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-warm-gray)' }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
