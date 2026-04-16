import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Coins, Percent, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DISMISSED_KEY = 'zig-welcome-dismissed'

export function WelcomeBanner() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isAuthenticated) return
    const dismissed = sessionStorage.getItem(DISMISSED_KEY)
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated])

  // Hide if user logs in while banner is showing
  useEffect(() => {
    if (isAuthenticated) setVisible(false)
  }, [isAuthenticated])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(DISMISSED_KEY, '1')
  }

  function handleLogin() {
    sessionStorage.setItem(DISMISSED_KEY, '1')
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[81] bg-white rounded-t-3xl overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"
              aria-label="Fechar"
            >
              <X size={16} className="text-txt-secondary" />
            </button>

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Content */}
            <div className="px-6 pt-4 pb-8">
              {/* Hero icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-brand-subtle)' }}
                >
                  <Gift size={32} style={{ color: 'var(--color-brand-fill)' }} strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-lg font-bold text-txt-primary text-center mb-1"
              >
                Mana te dá boas vindas!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-txt-secondary text-center mb-5"
              >
                Entre com seu perfil e ganhe cashback a cada pedido
              </motion.p>

              {/* Perks */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 mb-6"
              >
                <Perk
                  icon={<Coins size={18} style={{ color: 'var(--color-loyalty-gold)' }} />}
                  bgColor="color-mix(in srgb, var(--color-loyalty-gold) 12%, transparent)"
                  title="Giftback em todas as compras"
                  subtitle="Ganhe saldo pra usar na próxima visita"
                />
                <Perk
                  icon={<Percent size={18} style={{ color: 'var(--color-brand-fill)' }} />}
                  bgColor="var(--color-brand-subtle)"
                  title="Promoções exclusivas"
                  subtitle="Ofertas especiais só pra quem se identifica"
                />
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                className="w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                Entrar agora
                <ChevronRight size={16} />
              </motion.button>

              {/* Skip */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                onClick={dismiss}
                className="w-full mt-3 py-2 text-sm font-medium text-brand-text"
              >
                Continuar sem identificação
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Perk({
  icon,
  bgColor,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  bgColor: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-txt-primary">{title}</p>
        <p className="text-[11px] text-txt-tertiary">{subtitle}</p>
      </div>
    </div>
  )
}
