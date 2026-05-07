import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface FlyingCartItemProps {
  image: string | null
  onComplete: () => void
}

function getTarget() {
  const btn = document.getElementById('view-order-btn')
  if (btn) {
    const rect = btn.getBoundingClientRect()
    return { x: rect.left + rect.width / 2 - 24, y: rect.top + rect.height / 2 - 24 }
  }
  const root = document.getElementById('root')
  const rootRect = root?.getBoundingClientRect()
  const cx = rootRect ? rootRect.left + rootRect.width / 2 : window.innerWidth / 2
  return { x: cx - 24, y: window.innerHeight - 60 }
}

function getStart() {
  const root = document.getElementById('root')
  const rootRect = root?.getBoundingClientRect()
  const cx = rootRect ? rootRect.left + rootRect.width / 2 : window.innerWidth / 2
  return { x: cx - 24, y: window.innerHeight * 0.25 }
}

export function FlyingCartItem({ image, onComplete }: FlyingCartItemProps) {
  if (!image) return null

  const start = getStart()
  const target = getTarget()
  const midX = (start.x + target.x) / 2 + 30
  const midY = Math.min(start.y, target.y) - 80

  return createPortal(
    <motion.div
      key={image + Date.now()}
      className="fixed pointer-events-none"
      style={{ zIndex: 99999 }}
      initial={{ left: start.x, top: start.y, scale: 1, opacity: 1 }}
      animate={{
        left: [start.x, midX, target.x],
        top: [start.y, midY, target.y],
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
        <motion.div
          className="absolute inset-0 rounded-full bg-brand-fill"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.4, 0], scale: [1, 1.8, 2.2] }}
          transition={{ duration: 0.65 }}
        />
      </div>
    </motion.div>,
    document.body,
  )
}
