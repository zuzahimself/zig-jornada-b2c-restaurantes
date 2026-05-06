import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'framer-motion'
import type { BannerItem } from '../types'
import { useMock } from '../context/MockContext'
import { formatPrice } from '../lib/utils'

interface BannerCarouselProps {
  items: BannerItem[]
  /** When set, renders only this banner index as a static cover image (no rotation, no drag) */
  staticIndex?: number
}

const AUTO_PLAY_MS = 4000
const SWIPE_THRESHOLD = 40
const SWIPE_VELOCITY = 200
const SIDE_SCALE = 0.92
const SIDE_OPACITY = 0.5
const GAP = 12

function getShadowImage(item: BannerItem): string {
  switch (item.type) {
    case 'dish':
    case 'event':
    case 'loyalty':
      return item.image
    case 'ad':
      return item.imageUrl
  }
}

function wrap(i: number, length: number) {
  return ((i % length) + length) % length
}

export function BannerCarousel({ items, staticIndex }: BannerCarouselProps) {
  // Static mode: same layout as carousel but no rotation/drag/dots
  if (staticIndex !== undefined) {
    const item = items[staticIndex] ?? items[0]
    const shadowImage = getShadowImage(item)
    return (
      <div className="relative select-none px-4 pt-2 pb-4">
        {/* Color shadow */}
        <div
          className="absolute left-6 right-6 top-5 bottom-6 rounded-2xl overflow-hidden pointer-events-none"
          style={{ filter: 'blur(20px)', transform: 'translateY(10px)', opacity: 0.5 }}
        >
          <img src={shadowImage} alt="" className="w-full h-full object-cover" draggable={false} />
        </div>
        {/* Single slide */}
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
          <SlideContent item={item} />
        </div>
      </div>
    )
  }

  const prefersReduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isAnimating = useRef(false)

  // offsetX: pixel offset from "resting" position of the active slide
  const offsetX = useMotionValue(0)

  // Keep ref in sync with state
  activeRef.current = active

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const snapTo = useCallback(
    (next: number) => {
      if (isAnimating.current) return
      isAnimating.current = true

      const w = containerRef.current?.offsetWidth ?? 380
      const cur = activeRef.current
      let diff = next - cur
      // Shortest wrapping direction
      if (diff > items.length / 2) diff -= items.length
      if (diff < -items.length / 2) diff += items.length
      const target = -diff * (w + GAP)

      void animate(offsetX, target, {
        type: 'spring',
        stiffness: 340,
        damping: 34,
        mass: 0.8,
        onComplete: () => {
          // Update ref FIRST (synchronous), then jump — no flash
          activeRef.current = wrap(next, items.length)
          offsetX.jump(0)
          setActive(wrap(next, items.length)) // for dots & shadow re-render
          isAnimating.current = false
        },
      })
    },
    [items.length, offsetX],
  )

  const goNext = useCallback(
    () => snapTo(wrap(activeRef.current + 1, items.length)),
    [snapTo, items.length],
  )
  const goPrev = useCallback(
    () => snapTo(wrap(activeRef.current - 1, items.length)),
    [snapTo, items.length],
  )

  // Auto-play
  useEffect(() => {
    if (prefersReduced || isDragging) return
    timerRef.current = setInterval(goNext, AUTO_PLAY_MS)
    return clearTimer
  }, [active, isDragging, prefersReduced, goNext, clearTimer])

  // ── Pointer-event drag ────────────────────────────────────────────────
  const pointerDown = useRef(false)
  const startX = useRef(0)
  const prevX = useRef(0)
  const prevTime = useRef(0)
  const velocityRef = useRef(0)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isAnimating.current) return
      pointerDown.current = true
      startX.current = e.clientX
      prevX.current = e.clientX
      prevTime.current = Date.now()
      velocityRef.current = 0
      setIsDragging(true)
      clearTimer()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [clearTimer],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDown.current) return
      const dx = e.clientX - startX.current
      offsetX.set(dx)

      const now = Date.now()
      const dt = now - prevTime.current || 1
      velocityRef.current = ((e.clientX - prevX.current) / dt) * 1000
      prevX.current = e.clientX
      prevTime.current = now
    },
    [offsetX],
  )

  const onPointerUp = useCallback(() => {
    if (!pointerDown.current) return
    pointerDown.current = false
    setIsDragging(false)

    const offset = offsetX.get()
    const vel = velocityRef.current

    if (offset < -SWIPE_THRESHOLD || vel < -SWIPE_VELOCITY) {
      goNext()
    } else if (offset > SWIPE_THRESHOLD || vel > SWIPE_VELOCITY) {
      goPrev()
    } else {
      void animate(offsetX, 0, {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      })
    }
  }, [offsetX, goNext, goPrev])

  // ── Render ────────────────────────────────────────────────────────────
  const currentItem = items[active]
  const shadowImage = getShadowImage(currentItem)

  return (
    <div className="relative select-none px-4 pt-2 pb-4">
      {/* Color shadow */}
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
          <img src={shadowImage} alt="" className="w-full h-full object-cover" draggable={false} />
        </motion.div>
      </AnimatePresence>

      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Drag surface */}
        <div
          className="absolute inset-0 z-10 touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {/* All slides — each positioned by distance from active */}
        {items.map((item, i) => (
          <CarouselSlide
            key={item.id}
            item={item}
            index={i}
            activeRef={activeRef}
            offsetX={offsetX}
            containerRef={containerRef}
            total={items.length}
          />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => {
              if (i !== active) snapTo(i)
            }}
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

/* ─── Individual slide ────────────────────────────────────────────────── */

function CarouselSlide({
  item,
  index,
  activeRef,
  offsetX,
  containerRef,
  total,
}: {
  item: BannerItem
  index: number
  activeRef: React.RefObject<number | null>
  offsetX: ReturnType<typeof useMotionValue<number>>
  containerRef: React.RefObject<HTMLDivElement | null>
  total: number
}) {
  const x = useTransform(offsetX, (ox) => {
    const w = containerRef.current?.offsetWidth ?? 380
    let diff = index - (activeRef.current ?? 0)
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return diff * (w + GAP) + ox
  })

  const scale = useTransform(offsetX, (ox) => {
    const w = containerRef.current?.offsetWidth ?? 380
    let diff = index - (activeRef.current ?? 0)
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    const dist = Math.abs(diff + ox / (w + GAP))
    return Math.max(SIDE_SCALE, 1 - dist * (1 - SIDE_SCALE))
  })

  const opacity = useTransform(offsetX, (ox) => {
    const w = containerRef.current?.offsetWidth ?? 380
    let diff = index - (activeRef.current ?? 0)
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    const dist = Math.abs(diff + ox / (w + GAP))
    return Math.max(SIDE_OPACITY, 1 - dist * (1 - SIDE_OPACITY))
  })

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
      style={{ x, scale, opacity }}
    >
      <SlideContent item={item} />
    </motion.div>
  )
}

/* ─── Per-type slide content ──────────────────────────────────────────── */

export function SlideContent({ item }: { item: BannerItem }) {
  switch (item.type) {
    case 'dish':
      return <SlideDish image={item.image} label={item.label} badge={item.badge} />
    case 'event':
      return <SlideEvent image={item.image} />
    case 'loyalty':
      return <SlideLoyalty image={item.image} />
    case 'ad':
      return <SlideAd imageUrl={item.imageUrl} linkUrl={item.linkUrl} />
  }
}

function SlideDish({ image, label, badge }: { image: string; label: string; badge: string }) {
  return (
    <>
      <img src={image} alt={label} className="w-full h-full object-cover pointer-events-none" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
      <div className="absolute top-3 right-3 glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold pointer-events-none">
        {badge}
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight font-display pointer-events-none">
        {label}
      </div>
    </>
  )
}

function SlideEvent({ image }: { image: string }) {
  return (
    <img
      src={image}
      alt="Evento"
      className="w-full h-full object-cover pointer-events-none"
      draggable={false}
    />
  )
}

function SlideLoyalty({ image }: { image: string }) {
  const { isLoggedIn, giftbackBalance } = useMock()

  // State 1: not logged in → invite
  // State 2: logged in, zero balance → engagement
  // State 3: logged in, balance > 0 → show balance
  const hasBalance = isLoggedIn && giftbackBalance > 0

  return (
    <>
      <img
        src={image}
        alt="Cashback"
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 flex flex-col items-end justify-center pr-6 pointer-events-none">
        {!isLoggedIn ? (
          <>
            <p className="text-white text-base font-sans">Ganhe <span className="font-bold">Cashback</span></p>
            <p className="text-white text-base font-sans">em cada pedido!</p>
            <p
              className="font-semibold text-sm mt-2"
              style={{ color: 'var(--color-loyalty-gold)' }}
            >
              Cadastre-se agora
            </p>
          </>
        ) : !hasBalance ? (
          <>
            <p className="text-white text-base font-sans">Faça um pedido e</p>
            <p className="text-white text-base font-sans">ganhe <span className="font-bold">Cashback!</span></p>
          </>
        ) : (
          <>
            <p className="text-white text-base font-sans">Você tem <span className="font-bold">Cashback!</span></p>
            <p
              className="font-bold text-3xl font-display mt-1"
              style={{ color: 'var(--color-loyalty-gold)' }}
            >
              R${formatPrice(giftbackBalance)}
            </p>
          </>
        )}
      </div>
    </>
  )
}

function SlideAd({ imageUrl, linkUrl }: { imageUrl: string; linkUrl: string }) {
  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={imageUrl} alt="Patrocinado" className="w-full h-full object-cover pointer-events-none" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-pill px-3 py-1 text-white/90 text-xs font-medium pointer-events-none">
        Patrocinado
      </div>
    </a>
  )
}
