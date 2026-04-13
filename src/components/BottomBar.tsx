import { ChevronRight, ShoppingBag, Receipt, Coins } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMock } from '../context/MockContext'
import { formatPrice } from '../lib/utils'

interface BottomBarProps {
  itemCount: number
  totalCents: number
  onViewOrder: () => void
}

export function BottomBar({ itemCount, totalCents, onViewOrder }: BottomBarProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { giftbackBalance } = useMock()
  const hasItems = itemCount > 0

  return (
    <div
      className="sticky bottom-0 z-50 bg-white pb-safe"
      style={{ boxShadow: '0 -1px 0 0 #ececee, 0 -4px 16px 0 rgba(0,0,0,0.06)' }}
    >
      {/* Promo strip — conditional */}
      {!isAuthenticated ? (
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-between px-4 py-2 border-b border-border hover:bg-surface-low transition-colors"
        >
          <span className="text-xs text-txt-secondary">Você pode ter promoções disponíveis</span>
          <ChevronRight size={14} className="text-brand-text shrink-0" />
        </button>
      ) : giftbackBalance > 0 ? (
        <button
          onClick={() => navigate('/pagamento?mode=mine')}
          className="w-full flex items-center justify-between px-4 py-2 border-b border-border hover:bg-surface-low transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Coins size={13} style={{ color: 'var(--color-loyalty-gold)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-loyalty-gold)' }}>
              Você tem R$ {formatPrice(giftbackBalance)} de saldo
            </span>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--color-loyalty-gold)' }} className="shrink-0" />
        </button>
      ) : null}

      {/* Order summary row */}
      <div className="flex items-center justify-between px-4 py-3">
        {hasItems ? (
          <div className="flex flex-col">
            <span className="text-xs text-txt-secondary">Total sem serviço</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-txt-primary">
                R$ {formatPrice(totalCents)}
              </span>
              <span className="text-xs text-txt-secondary">/ {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-txt-secondary">Nenhum item no carrinho</span>
          </div>
        )}

        <motion.button
          id="view-order-btn"
          onClick={hasItems ? onViewOrder : () => navigate('/conta-mesa')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95"
          style={{ minWidth: 130 }}
          whileTap={{ scale: 0.97 }}
        >
          {hasItems ? (
            <>
              <ShoppingBag size={16} strokeWidth={2.5} />
              <span>Ver pedido</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="bg-white/25 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            </>
          ) : (
            <>
              <Receipt size={16} strokeWidth={2.5} />
              <span>Ver conta</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
