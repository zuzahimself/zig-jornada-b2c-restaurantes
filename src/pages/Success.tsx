import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, UtensilsCrossed, Coins, ChevronDown } from 'lucide-react'
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
  const [showExtrato, setShowExtrato] = useState(false)

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

  // Flatten all items across orders for the extrato
  const allItems = useMemo(() => {
    const items: { name: string; qty: number; price: number }[] = []
    tableOrders.forEach((order: TableOrder) => {
      order.items.forEach((oi) => {
        items.push({
          name: oi.menuItem.name,
          qty: oi.quantity,
          price: oi.menuItem.price * oi.quantity,
        })
      })
    })
    return items
  }, [tableOrders])

  const orderNumber = useMemo(
    () => `#${String(Math.floor(Math.random() * 90 + 10)).padStart(4, '0')}`,
    []
  )

  // On mount: process order or payment
  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    if (isPaid) {
      recordPayment(totalCents)
      if (cashbackEarned > 0) {
        setGiftbackBalance(giftbackBalance + cashbackEarned)
      }
    } else {
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
    <div className="flex flex-col h-full bg-surface-low">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* ── Confirmation header ── */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--color-brand-subtle)' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 0.35 }}
            >
              <Check
                size={28}
                strokeWidth={2.5}
                style={{ color: 'var(--color-brand-fill)' }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-lg font-bold text-txt-primary mb-0.5"
          >
            {isPaid ? 'Pagamento confirmado!' : 'Pedido enviado!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-sm text-txt-tertiary"
          >
            {isPaid ? 'Obrigado pelo pagamento' : `Pedido ${orderNumber}`}
          </motion.p>
        </div>

        {/* ── Summary card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="bg-white rounded-2xl px-5 py-4 mb-3"
        >
          {isPaid ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-txt-tertiary">Total pago</p>
                <p className="text-lg font-bold font-display" style={{ color: 'var(--color-brand-fill)' }}>
                  R$ {formatPrice(totalCents)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-txt-tertiary">Método</p>
                <p className="text-sm font-medium text-txt-primary">{methodLabel}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-sm mb-2">
                <UtensilsCrossed size={16} className="text-txt-tertiary shrink-0" />
                <span className="text-txt-secondary">Seu pedido foi enviado para a cozinha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-txt-tertiary">Previsão de preparo</span>
                <span className="font-medium text-txt-primary">~15-20 min</span>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Cashback earned ── */}
        {isPaid && cashbackEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-white rounded-2xl px-5 py-4 mb-3 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-loyalty-gold) 15%, transparent)' }}
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

        {/* ── Remaining balance — accordion with extrato ── */}
        {isPaid && !tableFullyPaid && remainingOnTable > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="bg-white rounded-2xl px-5 py-4 mb-3"
          >
            <p className="text-xs text-txt-tertiary mb-1">Conta da mesa</p>
            <p className="text-sm font-semibold text-amber-700 mb-3">
              Ainda faltam R$ {formatPrice(remainingOnTable)} em aberto
            </p>

            {/* Accordion trigger */}
            <button
              onClick={() => setShowExtrato(!showExtrato)}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-brand-text"
            >
              Ver extrato da mesa
              <motion.span
                animate={{ rotate: showExtrato ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>

            {/* Accordion content */}
            <AnimatePresence>
              {showExtrato && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border pt-3 mt-1">
                    {/* Items */}
                    {allItems.length > 0 ? (
                      <div className="flex flex-col gap-2 mb-3">
                        {allItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-txt-secondary">
                              {item.qty}x {item.name}
                            </span>
                            <span className="text-txt-primary font-medium shrink-0 ml-2">
                              R$ {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-txt-tertiary mb-3">Nenhum item registrado</p>
                    )}

                    {/* Totals */}
                    <div className="border-t border-border pt-3 flex flex-col gap-2.5">
                      <div className="flex justify-between text-xs text-txt-tertiary">
                        <span>Subtotal</span>
                        <span>R$ {formatPrice(tableSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-txt-tertiary">
                        <span>Taxa de serviço (10%)</span>
                        <span>R$ {formatPrice(tableService)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-txt-primary">
                        <span>Total da mesa</span>
                        <span>R$ {formatPrice(tableGrandTotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-icon-success font-medium">
                        <span>Já pago</span>
                        <span>- R$ {formatPrice(paidAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-amber-700 pt-1 border-t border-border">
                        <span>Restante</span>
                        <span>R$ {formatPrice(remainingOnTable)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Satisfaction survey ── */}
        <AnimatePresence>
          {showSurvey && isPaid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl px-5 py-5 mb-3"
            >
              <SatisfactionSurvey onDismiss={() => setShowSurvey(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Single primary CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="shrink-0 px-6 pb-8 pt-2 bg-surface-low"
      >
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
        >
          Ver cardápio
        </button>
      </motion.div>
    </div>
  )
}
