import { motion, AnimatePresence } from 'framer-motion'
import { X, UtensilsCrossed, ShoppingCart, User, CreditCard, CheckCircle, LogIn, LogOut } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrandSwitcher } from './BrandSwitcher'
import { MockSwitcher } from './MockSwitcher'
import { useAuth } from '../context/AuthContext'

interface MenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS_BASE = [
  { icon: UtensilsCrossed, label: 'Cardápio', href: '/' },
  { icon: ShoppingCart, label: 'Meu pedido', href: '/carrinho' },
  { icon: User, label: 'Conta da mesa', href: '/conta-mesa' },
  { icon: CreditCard, label: 'Pagamento', href: '/pagamento' },
  { icon: CheckCircle, label: 'Pedido confirmado', href: '/sucesso' },
]

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth()
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
              <div className="py-2">
                {NAV_ITEMS_BASE.map(({ icon: Icon, label, href }) => (
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

                {/* Auth item */}
                {isAuthenticated ? (
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
                )}
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
