import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyingCartItemProps {
  image: string | null
  onComplete: () => void
}

export function FlyingCartItem({ image, onComplete }: FlyingCartItemProps) {
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!image) return
    // Find the "Ver pedido" button to fly towards
    const btn = document.getElementById('view-order-btn')
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setTarget({ x: rect.left + rect.width / 2 - 24, y: rect.top + rect.height / 2 - 24 })
    } else {
      // Fallback: bottom center
      setTarget({ x: window.innerWidth / 2 - 24, y: window.innerHeight - 60 })
    }
  }, [image])

  if (!target) return null

  // Start from upper-center of screen (where product image would have been)
  const startX = window.innerWidth / 2 - 24
  const startY = window.innerHeight * 0.25

  // Midpoint for the arc (curve up and to the right)
  const midX = (startX + target.x) / 2 + 30
  const midY = Math.min(startY, target.y) - 80

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed z-[100] pointer-events-none"
          initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
          animate={{
            x: [startX, midX, target.x],
            y: [startY, midY, target.y],
            scale: [1, 0.8, 0.3],
            opacity: [1, 1, 0.6],
          }}
          transition={{
            duration: 0.65,
            ease: [0.32, 0, 0.24, 1],
            times: [0, 0.4, 1],
          }}
          onAnimationComplete={onComplete}
        >
          <div className="relative">
            <img
              src={image}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.25), 0 0 0 3px white',
              }}
            />
            {/* Trailing glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-fill"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.4, 0], scale: [1, 1.8, 2.2] }}
              transition={{ duration: 0.65 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
