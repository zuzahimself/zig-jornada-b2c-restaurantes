import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, QrCode, CreditCard, Wallet, ShieldCheck, Coins, UtensilsCrossed, XCircle } from 'lucide-react'
import { useCart, getItemUnitPrice } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useMock, getTableTotal } from '../context/MockContext'
import { MOCK_USER_CPF } from '../data/mockTableData'
import { formatPrice, cn } from '../lib/utils'

type PaymentMethod = 'pix' | 'credit' | 'debit'

const METHODS: { value: PaymentMethod; label: string; description: string; icon: typeof QrCode }[] = [
  { value: 'pix', label: 'Pix', description: 'Aprovação instantânea', icon: QrCode },
  { value: 'credit', label: 'Crédito', description: 'Parcele em até 3x', icon: CreditCard },
  { value: 'debit', label: 'Débito', description: 'Desconto de 5%', icon: Wallet },
]

const SERVICE_RATE = 0.1

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  pix_expired: { title: 'PIX expirado', description: 'O código expirou. Gere um novo e tente novamente.' },
  card_failed: { title: 'Falha no cartão', description: 'Não foi possível processar. Verifique os dados e tente novamente.' },
}

export function Payment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') // 'mine' | 'total' | 'split' | null
  const people = Number(searchParams.get('people')) || 1

  const { cart, totalCents } = useCart()
  const { user } = useAuth()
  const { paidAmount, tableOrders: mockTableOrders, giftbackBalance, cashbackRate } = useMock()
  const userCpf = user?.cpf || MOCK_USER_CPF

  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [useGiftback, setUseGiftback] = useState(false)
  const [serviceEnabled, setServiceEnabled] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { subtotal, service, grandTotal, items } = useMemo(() => {
    if (mode === 'total' || mode === 'mine' || mode === 'split') {
      const orders = mode === 'mine'
        ? mockTableOrders.filter((o) => o.userCpf === userCpf)
        : mockTableOrders
      const sub = getTableTotal(orders)
      const svc = serviceEnabled ? Math.round(sub * SERVICE_RATE) : 0
      const grand = sub + svc
      let final = mode === 'total' ? Math.max(0, grand - paidAmount) : grand
      if (mode === 'split') {
        final = Math.ceil(Math.max(0, grand - paidAmount) / people)
      }
      const orderItems = orders.flatMap((o) =>
        o.items.map((i) => ({
          name: i.menuItem.name,
          qty: i.quantity,
          total: i.menuItem.price * i.quantity,
        }))
      )
      return { subtotal: sub, service: svc, grandTotal: final, items: orderItems }
    }

    const svc = serviceEnabled ? Math.round(totalCents * SERVICE_RATE) : 0
    const cartItems = cart.map((ci) => ({
      name: ci.item.name,
      qty: ci.quantity,
      total: getItemUnitPrice(ci) * ci.quantity,
    }))
    return { subtotal: totalCents, service: svc, grandTotal: totalCents + svc, items: cartItems }
  }, [mode, cart, totalCents, paidAmount, mockTableOrders, userCpf, serviceEnabled, people])

  const giftbackDiscount = useGiftback ? Math.min(giftbackBalance, grandTotal) : 0
  const finalTotal = grandTotal - giftbackDiscount
  const cashbackEarned = Math.round(finalTotal * cashbackRate)

  function handlePay() {
    setProcessing(true)
    setError(null)
    setTimeout(() => {
      // ~25% failure rate for demo
      const shouldFail = Math.random() < 0.25
      if (shouldFail) {
        setError(method === 'pix' ? 'pix_expired' : 'card_failed')
        setProcessing(false)
      } else {
        navigate(`/sucesso?total=${finalTotal}&method=${method}&cashback=${cashbackEarned}`)
      }
    }, 2500)
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-surface-low relative"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{ backgroundColor: 'var(--color-brand-subtle)', height: 'var(--header-height)' }}
      >
        <button onClick={() => navigate(-1)} className="text-brand-text">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold text-brand-text">Pagamento</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Total hero */}
        <div className="bg-white px-5 pt-6 pb-5 flex flex-col items-center">
          <p className="text-xs font-medium text-txt-tertiary uppercase tracking-wider mb-1">
            Total a pagar
          </p>
          <p
            className="text-3xl font-bold font-display"
            style={{ color: 'var(--color-brand-fill)' }}
          >
            R$ {formatPrice(finalTotal)}
          </p>
          {mode === 'split' && (
            <p className="text-xs text-txt-tertiary mt-1">
              Dividido por {people} pessoas
            </p>
          )}
          {giftbackDiscount > 0 && (
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-loyalty-gold)' }}>
              Giftback de R$ {formatPrice(giftbackDiscount)} aplicado
            </p>
          )}
        </div>

        {/* Giftback toggle */}
        {giftbackBalance > 0 && (
          <div className="bg-white mt-2 px-5 py-4">
            <button
              onClick={() => setUseGiftback(!useGiftback)}
              className="w-full flex items-center gap-3.5 text-left"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-loyalty-gold) 12%, transparent)' }}
              >
                <Coins size={20} style={{ color: 'var(--color-loyalty-gold)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-txt-primary">Usar meu giftback</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-loyalty-gold)' }}>
                  R$ {formatPrice(giftbackBalance)} disponível
                </p>
              </div>
              <div
                className="w-11 h-6 rounded-full p-0.5 transition-colors shrink-0"
                style={{
                  backgroundColor: useGiftback ? 'var(--color-loyalty-gold)' : '#e5e7eb',
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{ x: useGiftback ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>
          </div>
        )}

        {/* Order summary — collapsible */}
        <div className="bg-white mt-2 rounded-none">
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between px-5 py-3"
          >
            <span className="text-xs font-semibold text-txt-secondary uppercase tracking-wider">
              Detalhes do pedido
            </span>
            <motion.span
              animate={{ rotate: summaryOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-txt-tertiary" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 flex flex-col gap-1.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-txt-secondary">
                        {item.qty}x {item.name}
                      </span>
                      <span className="text-txt-primary font-medium tabular-nums">
                        R$ {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-black/5 pt-2 mt-1 flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-txt-tertiary">Subtotal</span>
                      <span className="text-txt-secondary tabular-nums">R$ {formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={cn('text-txt-tertiary', !serviceEnabled && 'line-through')}>Serviço (10%)</span>
                      <span className={cn('text-txt-secondary tabular-nums', !serviceEnabled && 'line-through')}>
                        R$ {formatPrice(serviceEnabled ? Math.round(subtotal * SERVICE_RATE) : 0)}
                      </span>
                    </div>
                    {mode === 'total' && paidAmount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-txt-tertiary">Já pago</span>
                        <span className="font-medium text-emerald-600 tabular-nums">
                          - R$ {formatPrice(paidAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Service toggle */}
        <div className="bg-white mt-2 px-5 py-4">
          <button
            onClick={() => setServiceEnabled(!serviceEnabled)}
            className="w-full flex items-center gap-3.5 text-left"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-surface-low">
              <UtensilsCrossed size={20} className="text-txt-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-txt-primary">Taxa de serviço (10%)</p>
              <p className="text-[11px] text-txt-tertiary mt-0.5">
                {serviceEnabled ? `R$ ${formatPrice(service)}` : 'Desativado'}
              </p>
            </div>
            <div
              className="w-11 h-6 rounded-full p-0.5 transition-colors shrink-0"
              style={{
                backgroundColor: serviceEnabled ? 'var(--color-brand-fill)' : '#e5e7eb',
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: serviceEnabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>

        {/* Payment methods */}
        <div className="bg-white mt-2 px-5 pt-5 pb-5">
          <h3 className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-4">
            Forma de pagamento
          </h3>
          <div className="flex flex-col gap-3">
            {METHODS.map((m) => {
              const isActive = method === m.value
              return (
                <motion.button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200',
                    isActive
                      ? 'shadow-[0_0_0_2px_var(--color-brand-fill),0_4px_16px_-2px_rgba(0,0,0,0.08)]'
                      : 'bg-surface-low hover:bg-gray-100'
                  )}
                  style={isActive ? { backgroundColor: 'var(--color-brand-subtle)' } : undefined}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                    )}
                    style={
                      isActive
                        ? { backgroundColor: 'var(--color-brand-fill)' }
                        : { backgroundColor: 'white' }
                    }
                  >
                    <m.icon
                      size={20}
                      strokeWidth={1.8}
                      style={{
                        color: isActive
                          ? 'var(--color-on-brand-fill)'
                          : 'var(--color-brand-fill)',
                      }}
                    />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isActive ? 'text-txt-primary' : 'text-txt-primary'
                      )}
                    >
                      {m.label}
                    </p>
                    <p className="text-[11px] text-txt-tertiary mt-0.5">
                      {m.description}
                    </p>
                  </div>

                  {/* Radio */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                      isActive ? 'border-brand-fill' : 'border-black/15'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-2.5 h-2.5 rounded-full bg-brand-fill"
                      />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Cashback estimate */}
        {cashbackEarned > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-4 pb-1">
            <Coins size={13} style={{ color: 'var(--color-loyalty-gold)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--color-loyalty-gold)' }}>
              Você ganha R$ {formatPrice(cashbackEarned)} de giftback nesta compra
            </span>
          </div>
        )}

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-1.5 py-3">
          <ShieldCheck size={14} className="text-txt-tertiary" />
          <span className="text-[11px] text-txt-tertiary">Pagamento seguro via Zig</span>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 bg-white border-t border-black/5 px-5 pt-3 pb-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePay}
          disabled={processing}
          className="w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform disabled:opacity-50"
        >
          Pagar R$ {formatPrice(finalTotal)}
        </motion.button>
      </div>

      {/* Processing overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-surface-low"
              style={{ borderTopColor: 'var(--color-brand-fill)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm font-semibold text-txt-primary">Processando pagamento...</p>
            <p className="text-xs text-txt-tertiary">Aguarde um instante</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence>
        {error && !processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4 px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center"
            >
              <XCircle size={32} className="text-red-500" />
            </motion.div>
            <p className="text-lg font-bold text-txt-primary">{ERROR_MESSAGES[error].title}</p>
            <p className="text-sm text-txt-secondary text-center">{ERROR_MESSAGES[error].description}</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePay}
              className="mt-4 w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
            >
              Tentar novamente
            </motion.button>
            <button
              onClick={() => setError(null)}
              className="py-2 text-sm font-medium text-brand-text"
            >
              Alterar forma de pagamento
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
