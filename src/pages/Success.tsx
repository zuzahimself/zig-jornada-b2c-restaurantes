import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, UtensilsCrossed, Coins, ChevronDown, Mail } from 'lucide-react'
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
  const { user, updateUser } = useAuth()
  const { addOrder, giftbackBalance, setGiftbackBalance, recordPayment, tableOrders, paidAmount, tableStatus, hasEmail } = useMock()
  const hasProcessed = useRef(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [showExtrato, setShowExtrato] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [emailSkipped, setEmailSkipped] = useState(false)

  // User has email if mock says so OR user profile has one OR just saved one
  const userHasEmail = hasEmail || !!user?.email || emailSaved
  const userEmail = user?.email || (emailSaved ? emailInput : '')

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
      recordPayment(totalCents, user?.name || 'Você', method)
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

        {/* ── NF por email ── */}
        {isPaid && !emailSkipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="bg-white rounded-2xl px-5 py-4 mb-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-brand-subtle)' }}
              >
                <Mail size={20} style={{ color: 'var(--color-brand-fill)' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-txt-primary">Nota fiscal</p>
                {userHasEmail ? (
                  <p className="text-[11px] text-txt-secondary mt-0.5">
                    Será enviada para <span className="font-semibold text-txt-primary">{userEmail || 'seu email'}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-txt-tertiary mt-0.5">
                    Informe seu email para receber
                  </p>
                )}
              </div>
            </div>
            {!userHasEmail && (
              <div className="mt-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="seu@email.com"
                    className="flex-1 rounded-xl bg-surface-low border-2 border-border px-3 py-2 text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none"
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand-fill)' }}
                    onBlur={(e) => { e.target.style.borderColor = '' }}
                  />
                  <button
                    onClick={() => {
                      if (emailInput.includes('@')) {
                        updateUser({ email: emailInput })
                        setEmailSaved(true)
                      }
                    }}
                    disabled={!emailInput.includes('@')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-on-brand bg-brand-fill disabled:opacity-40 transition-opacity"
                  >
                    OK
                  </button>
                </div>
                <button
                  onClick={() => setEmailSkipped(true)}
                  className="w-full mt-2 py-1 text-[11px] font-medium text-txt-tertiary"
                >
                  Pular
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Table closed — re-scan notice ── */}
        {isPaid && tableFullyPaid && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="bg-white rounded-2xl px-5 py-5 mb-3 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-emerald-600" />
            </div>
            <p className="text-sm font-bold text-txt-primary mb-1">Mesa encerrada!</p>
            <p className="text-sm text-txt-secondary mb-3">
              Obrigado pela visita. Toda a conta foi paga.
            </p>
            <div className="bg-surface-low rounded-xl px-4 py-3">
              <p className="text-xs text-txt-secondary leading-relaxed">
                Para fazer um novo pedido, escaneie o <span className="font-semibold text-txt-primary">QR code da mesa</span> novamente.
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

      {/* ── Primary CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="shrink-0 px-6 pb-8 pt-2 bg-surface-low"
      >
        {isPaid && tableFullyPaid ? (
          <button
            onClick={() => {
              sessionStorage.removeItem('hero-seen')
              navigate('/')
            }}
            className="w-full py-3 rounded-pill text-sm font-bold border border-brand-border text-brand-text hover:bg-brand-subtle active:scale-95 transition-transform"
          >
            Fechar
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
          >
            {isPaid ? 'Continuar pedindo' : 'Ver cardápio'}
          </button>
        )}
      </motion.div>
    </div>
  )
}
