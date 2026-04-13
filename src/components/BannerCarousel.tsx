import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { BannerItem } from '../types'

interface BannerCarouselProps {
  items: BannerItem[]
}

const AUTO_PLAY_MS = 4000
const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY = 300

export function BannerCarousel({ items }: BannerCarouselProps) {
  const prefersReduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setActive(next)
  }, [])

  const goNext = useCallback(() => {
    setActive((prev) => {
      setDirection(1)
      return (prev + 1) % items.length
    })
  }, [items.length])

  const goPrev = useCallback(() => {
    setActive((prev) => {
      setDirection(-1)
      return (prev - 1 + items.length) % items.length
    })
  }, [items.length])

  // Auto-play
  useEffect(() => {
    if (prefersReduced || isDragging) return
    timerRef.current = setInterval(goNext, AUTO_PLAY_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active, isDragging, prefersReduced, goNext])

  function handleDragEnd(
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) {
    setIsDragging(false)
    const { offset, velocity } = info
    if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
      goNext()
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
      goPrev()
    }
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '60%' : '-60%',
      scale: 0.85,
      opacity: 0,
    }),
    center: {
      x: '0%',
      scale: 1,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      scale: 0.85,
      opacity: 0,
    }),
  }

  const duration = prefersReduced ? 0 : 0.5
  const currentItem = items[active]

  return (
    <div className="relative select-none px-4 pt-2 pb-4">
      {/* Color shadow: blurred copy of the image behind */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`shadow-${active}`}
          className="absolute left-6 right-6 top-5 bottom-6 rounded-2xl overflow-hidden pointer-events-none"
          style={{ filter: 'blur(20px)', transform: 'translateY(10px)' }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 0.5, scale: 0.92 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img
            src={currentItem.image}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* 16:9 container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30, duration },
              scale: { duration },
              opacity: { duration: duration * 0.6 },
            }}
            className="absolute inset-0 touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragStart={() => {
              setIsDragging(true)
              if (timerRef.current) clearInterval(timerRef.current)
            }}
            onDragEnd={handleDragEnd}
          >
            {/* Image */}
            <img
              src={currentItem.image}
              alt={currentItem.label}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

            {/* Badge */}
            <motion.div
              className="absolute top-3 right-3 glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold pointer-events-none"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              {currentItem.badge}
            </motion.div>

            {/* Label */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight font-display pointer-events-none"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              {currentItem.label}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(i, i > active ? 1 : -1)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === active ? 'var(--color-brand-fill)' : '#ececee',
              width: i === active ? 16 : 6,
            }}
          />
        ))}
      </div>
    </div>
  )
}
