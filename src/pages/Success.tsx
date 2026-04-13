import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, UtensilsCrossed, Coins } from 'lucide-react'
import { SatisfactionSurvey } from '../components/SatisfactionSurvey'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useMock, getTableTotal } from '../context/MockContext'
import { MOCK_USER_CPF } from '../data/mockTableData'
import { formatPrice } from '../lib/utils'
import type { TableOrder } from '../types'

const METHOD_LABELS: Record<string, string> = {
  pix: 'Pix',
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
}

export function Success() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { addOrder, giftbackBalance, setGiftbackBalance, recordPayment, tableOrders, paidAmount, tableStatus } = useMock()
  const hasProcessed = useRef(false)
  const [showSurvey, setShowSurvey] = useState(false)

  const isPaid = searchParams.has('total')
  const totalCents = Number(searchParams.get('total')) || 0
  const method = searchParams.get('method') || ''
  const methodLabel = METHOD_LABELS[method] || method
  const cashbackEarned = Number(searchParams.get('cashback')) || 0

  // Compute remaining balance on the table
  const tableSubtotal = getTableTotal(tableOrders)
  const tableService = Math.round(tableSubtotal * 0.1)
  const tableGrandTotal = tableSubtotal + tableService
  const remainingOnTable = Math.max(0, tableGrandTotal - paidAmount)
  const tableFullyPaid = tableStatus === 'fully_paid' || remainingOnTable <= 0

  const orderNumber = useMemo(
    () => `#${String(Math.floor(Math.random() * 90 + 10)).padStart(4, '0')}`,
    []
  )

  // On mount: process order or payment
  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    if (isPaid) {
      // Record payment against table
      recordPayment(totalCents)
      // Credit cashback to balance
      if (cashbackEarned > 0) {
        setGiftbackBalance(giftbackBalance + cashbackEarned)
      }
    } else {
      // Convert cart to table order
      if (cart.length > 0) {
        const newOrder: TableOrder = {
          id: `order-${Date.now()}`,
          userName: user?.name || 'Você',
          userCpf: user?.cpf || MOCK_USER_CPF,
          createdAt: new Date().toISOString(),
          items: cart.map((ci) => ({
            menuItem: ci.item,
            quantity: ci.quantity,
            customizations: ci.selectedCustomizations,
            status: 'preparing' as const,
          })),
        }
        addOrder(newOrder)
      }
      clearCart()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show survey after payment
  useEffect(() => {
    if (isPaid) {
      const timer = setTimeout(() => setShowSurvey(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isPaid])

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-8">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'var(--color-brand-subtle)' }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 0.35 }}
          >
            <Check
              size={36}
              strokeWidth={2.5}
              style={{ color: 'var(--color-brand-fill)' }}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-xl font-bold text-txt-primary mb-1"
        >
          {isPaid ? 'Pagamento confirmado!' : 'Pedido enviado!'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-sm text-txt-tertiary mb-8"
        >
          {isPaid ? 'Obrigado pelo pagamento' : `Pedido ${orderNumber}`}
        </motion.p>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="w-full max-w-xs bg-surface-low rounded-2xl px-5 py-4 flex flex-col gap-3"
        >
          {isPaid ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-txt-secondary">Total pago</span>
                <span className="font-bold text-txt-primary">R$ {formatPrice(totalCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-txt-secondary">Método</span>
                <span className="font-medium text-txt-primary">{methodLabel}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-sm">
                <UtensilsCrossed size={16} className="text-txt-tertiary shrink-0" />
                <span className="text-txt-secondary">Seu pedido foi enviado para a cozinha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-txt-secondary">Previsão de preparo</span>
                <span className="font-medium text-txt-primary">~15-20 min</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Cashback earned card */}
        {isPaid && cashbackEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="w-full max-w-xs rounded-2xl px-5 py-4 mt-3 flex items-center gap-3"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-loyalty-gold) 10%, transparent)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-loyalty-gold) 18%, transparent)' }}
            >
              <Coins size={20} style={{ color: 'var(--color-loyalty-gold)' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-loyalty-gold)' }}>
                + R$ {formatPrice(cashbackEarned)} giftback
              </p>
              <p className="text-[11px] text-txt-tertiary mt-0.5">
                Saldo total: R$ {formatPrice(giftbackBalance + cashbackEarned)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Satisfaction survey */}
        <AnimatePresence>
          {showSurvey && isPaid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xs mt-4"
            >
              <SatisfactionSurvey onDismiss={() => setShowSurvey(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remaining balance on table */}
        {isPaid && !tableFullyPaid && remainingOnTable > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="w-full max-w-xs bg-amber-50 rounded-2xl px-5 py-4 mt-3"
          >
            <p className="text-sm font-semibold text-amber-800">
              A conta ainda tem R$ {formatPrice(remainingOnTable)} em aberto
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate('/conta-mesa')}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-on-brand bg-brand-fill active:scale-95 transition-transform"
              >
                Ver conta
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-border text-txt-secondary active:scale-95 transition-transform"
              >
                Continuar pedindo
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="shrink-0 px-6 pb-8 flex flex-col gap-3 items-center"
      >
        <button
          onClick={() => navigate('/conta-mesa')}
          className="w-full py-3.5 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
        >
          {isPaid ? 'Ver conta da mesa' : 'Acompanhar pedido'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium text-brand-text"
        >
          Voltar ao cardápio
        </button>
      </motion.div>
    </div>
  )
}
