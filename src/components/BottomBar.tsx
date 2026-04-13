import { ChevronRight, Coins } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const { giftbackBalance, tableOrders } = useMock()
  const hasItems = itemCount > 0
  const hasTableOrders = tableOrders.length > 0

  // Hide completely when nothing in cart and nothing on the table
  if (!hasItems && !hasTableOrders) return null

  return (
    <div
      className="sticky bottom-0 z-50 bg-white pb-safe"
      style={{ boxShadow: '0 -1px 0 0 #ececee, 0 -4px 16px 0 rgba(0,0,0,0.06)' }}
    >
      <div className="px-4 pt-3 pb-3">
        {/* Promo / saldo tag */}
        {!isAuthenticated ? (
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-[10px] font-bold bg-surface-low text-txt-secondary mb-3"
          >
            Você pode ter promoções disponíveis
            <ChevronRight size={10} className="shrink-0" />
          </button>
        ) : giftbackBalance > 0 ? (
          <button
            onClick={() => navigate('/pagamento?mode=mine')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-[10px] font-bold mb-3"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-loyalty-gold) 12%, transparent)',
              color: 'var(--color-loyalty-gold)',
            }}
          >
            <Coins size={11} />
            Você tem R${formatPrice(giftbackBalance)} de saldo
            <ChevronRight size={10} className="shrink-0" />
          </button>
        ) : null}

        {/* Main row */}
        {hasItems ? (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-txt-secondary">Total sem serviço</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-bold font-display"
                  style={{ color: 'var(--color-brand-fill)' }}
                >
                  R$ {formatPrice(totalCents)}
                </span>
                <span className="text-xs text-txt-secondary">
                  / {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                </span>
              </div>
            </div>

            <motion.button
              id="view-order-btn"
              onClick={onViewOrder}
              className="px-6 py-3 rounded-pill text-sm font-bold font-display text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
              whileTap={{ scale: 0.97 }}
            >
              Ver pedido
            </motion.button>
          </div>
        ) : (
          <motion.button
            id="view-order-btn"
            onClick={() => navigate('/conta-mesa')}
            className="w-full py-3 rounded-pill text-sm font-bold font-display text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
            whileTap={{ scale: 0.97 }}
          >
            Ver conta
          </motion.button>
        )}
      </div>
    </div>
  )
}
