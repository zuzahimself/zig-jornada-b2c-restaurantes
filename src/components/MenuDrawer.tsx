import { motion, AnimatePresence } from 'framer-motion'
import { X, Receipt, CalendarDays, LogIn, LogOut, Info, Clock, MapPin, Globe, Share2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BrandSwitcher } from './BrandSwitcher'
import { MockSwitcher } from './MockSwitcher'
import { useAuth } from '../context/AuthContext'
import { useMock } from '../context/MockContext'

interface MenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { icon: Receipt, label: 'Ver conta', href: '/conta-mesa', modes: ['full', 'paymentOnly'] },
  { icon: CalendarDays, label: 'Reservar', href: '/reserva', modes: ['full', 'menuOnly'] },
]

const HOURS = [
  { days: 'Seg a Qui', time: '11:30 – 15:00 · 18:00 – 23:00' },
  { days: 'Sex e Sáb', time: '11:30 – 00:00' },
  { days: 'Domingo', time: '11:30 – 17:00' },
]

const SOCIALS = [
  { label: '@mana.salvador', href: 'https://instagram.com/mana.salvador' },
]

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { journeyMode } = useMock()
  const navItems = useMemo(() => NAV_ITEMS.filter((item) => item.modes.includes(journeyMode)), [journeyMode])
  // Lock scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[70] w-[280px] bg-white flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.32 }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{
                backgroundColor: 'var(--color-brand-fill)',
                minHeight: 'var(--header-height)',
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'var(--color-on-brand-fill)',
                  }}
                >
                  M
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-on-brand-fill)' }}>
                    Mana
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Salvador, Bahia
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <X size={18} color="var(--color-on-brand-fill)" />
              </button>
            </div>

            {/* User info */}
            {isAuthenticated && user && (
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: 'var(--color-brand-fill)',
                    color: 'var(--color-on-brand-fill)',
                  }}
                >
                  {user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-txt-primary truncate">{user.name}</p>
                  <p className="text-xs text-txt-tertiary">
                    {user.cpf ? `CPF: ***.***.${user.cpf.slice(-5)}` : 'Conectado'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              {/* Nav links */}
              <div className="py-2">
                {navItems.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-txt-primary hover:bg-surface-low transition-colors"
                  >
                    <Icon size={18} className="text-txt-secondary shrink-0" strokeWidth={1.8} />
                    {label}
                  </Link>
                ))}

                {/* Auth — hidden in menuOnly (vitrine) */}
                {journeyMode !== 'menuOnly' && (
                  isAuthenticated ? (
                    <button
                      onClick={() => { logout(); onClose() }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-txt-primary hover:bg-surface-low transition-colors"
                    >
                      <LogOut size={18} className="text-txt-secondary shrink-0" strokeWidth={1.8} />
                      Sair
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-txt-primary hover:bg-surface-low transition-colors"
                    >
                      <LogIn size={18} className="text-txt-secondary shrink-0" strokeWidth={1.8} />
                      Entrar
                    </Link>
                  )
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border mx-4" />

              {/* O Restaurante */}
              <div className="py-3 px-4 space-y-4">
                <p className="text-xs font-semibold text-txt-tertiary uppercase tracking-wider">
                  O Restaurante
                </p>

                {/* About */}
                <div className="flex gap-2.5">
                  <Info size={16} className="text-txt-tertiary shrink-0 mt-0.5" strokeWidth={1.8} />
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Cozinha autoral baiana com ingredientes locais e sazonais. Ambiente descontraído à beira-mar.
                  </p>
                </div>

                {/* Hours */}
                <div className="flex gap-2.5">
                  <Clock size={16} className="text-txt-tertiary shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div className="space-y-1">
                    {HOURS.map(({ days, time }) => (
                      <div key={days} className="text-sm">
                        <span className="font-medium text-txt-primary">{days}</span>
                        <span className="text-txt-secondary"> · {time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-2.5">
                  <MapPin size={16} className="text-txt-tertiary shrink-0 mt-0.5" strokeWidth={1.8} />
                  <p className="text-sm text-txt-secondary">
                    R. do Meio, 28 – Rio Vermelho, Salvador – BA
                  </p>
                </div>

                {/* Social */}
                <div className="flex gap-2.5">
                  <Globe size={16} className="text-txt-tertiary shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div className="space-y-1">
                    {SOCIALS.map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium block"
                        style={{ color: 'var(--color-brand-text)' }}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Mana – Salvador', url: window.location.origin })
                    } else {
                      navigator.clipboard.writeText(window.location.origin)
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--color-brand-text)' }}
                >
                  <Share2 size={16} strokeWidth={1.8} />
                  Compartilhar
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-border mx-4" />

              {/* Aparência section */}
              <div className="py-4 px-4">
                <p className="text-xs font-semibold text-txt-tertiary uppercase tracking-wider mb-3">
                  Aparência
                </p>
                <BrandSwitcher onApply={onClose} />
              </div>

              {/* Divider */}
              <div className="border-t border-border mx-4" />

              {/* Cenário section */}
              <div className="py-4 px-4">
                <p className="text-xs font-semibold text-txt-tertiary uppercase tracking-wider mb-3">
                  Cenário
                </p>
                <MockSwitcher onApply={onClose} />
              </div>
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs text-txt-tertiary text-center">
                Powered by <span className="font-semibold">Zig</span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
