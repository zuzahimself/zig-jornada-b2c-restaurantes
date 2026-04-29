import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, QrCode, CreditCard, Wallet, ShieldCheck, Coins, UtensilsCrossed, XCircle, Users, Minus, Plus, ListChecks } from 'lucide-react'
import { useCart, getItemUnitPrice } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useMock, getTableTotal } from '../context/MockContext'
import { MOCK_USER_CPF } from '../data/mockTableData'
import { formatPrice, cn } from '../lib/utils'

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

type PaymentMethod = 'pix' | 'credit' | 'debit'
type ValueMode = 'custom' | 'mine' | 'split' | 'total' | 'items'

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

  const { cart, totalCents } = useCart()
  const { user, updateUser } = useAuth()
  const { paidAmount, tableOrders: mockTableOrders, giftbackBalance, cashbackRate, hasCpf, isPrepaid } = useMock()
  const userCpf = user?.cpf || MOCK_USER_CPF

  // Is this a cart-based payment (no table orders yet)?
  const isCartPayment = mockTableOrders.length === 0 && cart.length > 0

  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [useGiftback, setUseGiftback] = useState(false)
  const [serviceEnabled, setServiceEnabled] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cpfInput, setCpfInput] = useState('')
  const [valueMode, setValueMode] = useState<ValueMode>('total')
  const [customValue, setCustomValue] = useState('')
  const [splitPeople, setSplitPeople] = useState(2)
  const [showItemPicker, setShowItemPicker] = useState(false)
  const [itemSelections, setItemSelections] = useState<Record<string, number>>({})

  const needsCpf = !hasCpf && !user?.cpf

  // ── Flatten all table items for the item picker ──
  const allTableItems = useMemo(() => {
    const items: { key: string; name: string; image: string; unitPrice: number; maxQty: number; orderId: string }[] = []
    mockTableOrders.forEach((order) => {
      order.items.forEach((item, idx) => {
        items.push({
          key: `${order.id}-${idx}`,
          name: item.menuItem.name,
          image: item.menuItem.image,
          unitPrice: item.menuItem.price,
          maxQty: item.quantity,
          orderId: order.id,
        })
      })
    })
    return items
  }, [mockTableOrders])

  // ── Compute values for each mode ──
  const myOrders = mockTableOrders.filter((o) => o.userCpf === userCpf)
  const tableSubtotal = getTableTotal(mockTableOrders)
  const tableSvc = serviceEnabled ? Math.round(tableSubtotal * SERVICE_RATE) : 0
  const tableTotal = tableSubtotal + tableSvc
  const remaining = Math.max(0, tableTotal - paidAmount)

  const mySubtotal = getTableTotal(myOrders)
  const mySvc = serviceEnabled ? Math.round(mySubtotal * SERVICE_RATE) : 0
  const myTotal = mySubtotal + mySvc

  const uniquePeople = new Set(mockTableOrders.map((o) => o.userCpf)).size
  const isAlone = isPrepaid || uniquePeople <= 1

  const selectedItemsTotal = useMemo(() => {
    let total = 0
    for (const item of allTableItems) {
      const qty = itemSelections[item.key] || 0
      total += item.unitPrice * qty
    }
    const svc = serviceEnabled ? Math.round(total * SERVICE_RATE) : 0
    return total + svc
  }, [allTableItems, itemSelections, serviceEnabled])

  // ── The actual amount to pay ──
  const { baseAmount, items: displayItems } = useMemo(() => {
    if (isCartPayment) {
      const svc = serviceEnabled ? Math.round(totalCents * SERVICE_RATE) : 0
      const cartItems = cart.map((ci) => ({
        name: ci.item.name,
        qty: ci.quantity,
        total: getItemUnitPrice(ci) * ci.quantity,
      }))
      return { baseAmount: totalCents + svc, items: cartItems }
    }

    let amount: number
    switch (valueMode) {
      case 'mine':
        amount = myTotal
        break
      case 'split':
        amount = Math.ceil(remaining / splitPeople)
        break
      case 'total':
        amount = remaining
        break
      case 'items':
        amount = selectedItemsTotal
        break
      case 'custom': {
        const parsed = Math.round(parseFloat(customValue.replace(',', '.')) * 100)
        amount = isNaN(parsed) || parsed <= 0 ? 0 : Math.min(parsed, remaining)
        break
      }
      default:
        amount = remaining
    }

    const orderItems = mockTableOrders.flatMap((o) =>
      o.items.map((i) => ({
        name: i.menuItem.name,
        qty: i.quantity,
        total: i.menuItem.price * i.quantity,
      }))
    )
    return { baseAmount: amount, items: orderItems }
  }, [isCartPayment, valueMode, myTotal, remaining, splitPeople, selectedItemsTotal, customValue, totalCents, cart, mockTableOrders, serviceEnabled])

  const giftbackDiscount = useGiftback ? Math.min(giftbackBalance, baseAmount) : 0
  const finalTotal = Math.max(0, baseAmount - giftbackDiscount)
  const cashbackEarned = Math.round(finalTotal * cashbackRate)

  const setItemQty = useCallback((key: string, qty: number) => {
    setItemSelections((prev) => ({ ...prev, [key]: qty }))
  }, [])

  function handlePay() {
    if (needsCpf && cpfInput.replace(/\D/g, '').length === 11) {
      updateUser({ cpf: cpfInput.replace(/\D/g, '') })
    }
    setProcessing(true)
    setError(null)
    setTimeout(() => {
      const shouldFail = Math.random() < 0.25
      if (shouldFail) {
        setError(method === 'pix' ? 'pix_expired' : 'card_failed')
        setProcessing(false)
      } else {
        const prepaidParam = isPrepaid && cart.length > 0 ? '&prepaid=1' : ''
        navigate(`/sucesso?total=${finalTotal}&method=${method}&cashback=${cashbackEarned}${prepaidParam}`)
      }
    }, 2500)
  }

  // ── Custom value input handler ──
  function handleCustomInput(raw: string) {
    // Allow only digits and one comma/dot
    const cleaned = raw.replace(/[^\d,.]/, '').replace(/(,.*),/, '$1')
    setCustomValue(cleaned)
    setValueMode('custom')
  }

  // ── Is editing value (tapped on the amount) ──
  const [editingValue, setEditingValue] = useState(false)

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
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto">
        {/* ── Value hero (editable) ── */}
        <div className="bg-white px-5 pt-6 pb-5 flex flex-col items-center">
          <p className="text-xs font-medium text-txt-tertiary uppercase tracking-wider mb-1">
            Total a pagar
          </p>

          {editingValue ? (
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold font-display" style={{ color: 'var(--color-brand-fill)' }}>
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={customValue}
                onChange={(e) => handleCustomInput(e.target.value)}
                onBlur={() => { if (!customValue) setEditingValue(false) }}
                className="text-3xl font-bold font-display w-36 text-center border-b-2 border-brand-fill bg-transparent outline-none"
                style={{ color: 'var(--color-brand-fill)' }}
                placeholder="0,00"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isCartPayment) {
                  setEditingValue(true)
                  setValueMode('custom')
                  setCustomValue(formatPrice(finalTotal).replace('.', ','))
                }
              }}
              className="group"
            >
              <p
                className="text-3xl font-bold font-display transition-opacity group-hover:opacity-80"
                style={{ color: 'var(--color-brand-fill)' }}
              >
                R$ {formatPrice(finalTotal)}
              </p>
              {!isCartPayment && (
                <p className="text-[10px] text-txt-tertiary mt-0.5">Toque para editar o valor</p>
              )}
            </button>
          )}

          {giftbackDiscount > 0 && (
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-loyalty-gold)' }}>
              Giftback de R$ {formatPrice(giftbackDiscount)} aplicado
            </p>
          )}
        </div>

        {/* ── Quick value shortcuts (only for table payments) ── */}
        {!isCartPayment && (
          <div className="bg-white mt-2 px-5 py-4">
            <p className="text-xs font-semibold text-txt-secondary uppercase tracking-wider mb-3">
              Quanto quer pagar?
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Minha parte */}
              {!isAlone && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setValueMode('mine'); setEditingValue(false); setShowItemPicker(false) }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                    valueMode === 'mine'
                      ? 'bg-brand-subtle border-brand-border text-brand-text'
                      : 'border-border text-txt-secondary hover:bg-surface-low'
                  )}
                >
                  Minha parte · R${formatPrice(myTotal)}
                </motion.button>
              )}

              {/* Dividir */}
              {!isAlone && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setValueMode('split'); setEditingValue(false); setShowItemPicker(false) }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                    valueMode === 'split'
                      ? 'bg-brand-subtle border-brand-border text-brand-text'
                      : 'border-border text-txt-secondary hover:bg-surface-low'
                  )}
                >
                  Dividir /{splitPeople} · R${formatPrice(Math.ceil(remaining / splitPeople))}
                </motion.button>
              )}

              {/* Tudo */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setValueMode('total'); setEditingValue(false); setShowItemPicker(false) }}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                  valueMode === 'total'
                    ? 'bg-brand-subtle border-brand-border text-brand-text'
                    : 'border-border text-txt-secondary hover:bg-surface-low'
                )}
              >
                {isAlone ? 'Conta toda' : 'Pagar tudo'} · R${formatPrice(remaining)}
              </motion.button>

              {/* Por itens */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setValueMode('items')
                  setEditingValue(false)
                  setShowItemPicker(!showItemPicker)
                }}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5',
                  valueMode === 'items'
                    ? 'bg-brand-subtle border-brand-border text-brand-text'
                    : 'border-border text-txt-secondary hover:bg-surface-low'
                )}
              >
                <ListChecks size={13} />
                Por itens
              </motion.button>
            </div>

            {/* Split stepper */}
            <AnimatePresence>
              {valueMode === 'split' && !isAlone && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-5 pt-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSplitPeople(Math.max(2, splitPeople - 1))}
                      className="w-10 h-10 rounded-xl border-2 flex items-center justify-center"
                      style={{ borderColor: 'var(--color-brand-fill)', color: 'var(--color-brand-fill)' }}
                    >
                      <Minus size={18} />
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-txt-tertiary" />
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={splitPeople}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-2xl font-bold text-txt-primary w-8 text-center"
                        >
                          {splitPeople}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSplitPeople(Math.min(20, splitPeople + 1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-on-brand bg-brand-fill"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  <p className="text-xs text-txt-tertiary text-center mt-2">
                    Cada pessoa paga{' '}
                    <span className="font-semibold text-txt-primary">
                      R$ {formatPrice(Math.ceil(remaining / splitPeople))}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item picker */}
            <AnimatePresence>
              {showItemPicker && valueMode === 'items' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 flex flex-col gap-2">
                    {allTableItems.map((item) => {
                      const qty = itemSelections[item.key] || 0
                      return (
                        <div key={item.key} className="flex items-center gap-3 py-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-txt-primary truncate">{item.name}</p>
                            <p className="text-xs text-txt-tertiary">
                              R$ {formatPrice(item.unitPrice)} · máx {item.maxQty}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setItemQty(item.key, Math.max(0, qty - 1))}
                              disabled={qty === 0}
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center border transition-colors',
                                qty > 0 ? 'border-brand-fill text-brand-fill' : 'border-border text-txt-tertiary opacity-40'
                              )}
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="text-sm font-bold text-txt-primary w-5 text-center">{qty}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setItemQty(item.key, Math.min(item.maxQty, qty + 1))}
                              disabled={qty >= item.maxQty}
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                                qty < item.maxQty ? 'bg-brand-fill text-on-brand' : 'bg-gray-200 text-txt-tertiary'
                              )}
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>
                      )
                    })}
                    {selectedItemsTotal > 0 && (
                      <p className="text-xs text-txt-secondary text-center pt-2 border-t border-border">
                        Itens selecionados:{' '}
                        <span className="font-bold text-txt-primary">R$ {formatPrice(selectedItemsTotal)}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
                style={{ backgroundColor: useGiftback ? 'var(--color-loyalty-gold)' : '#e5e7eb' }}
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
                {serviceEnabled ? `R$ ${formatPrice(tableSvc || Math.round(totalCents * SERVICE_RATE))}` : 'Desativado'}
              </p>
            </div>
            <div
              className="w-11 h-6 rounded-full p-0.5 transition-colors shrink-0"
              style={{ backgroundColor: serviceEnabled ? 'var(--color-brand-fill)' : '#e5e7eb' }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: serviceEnabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>

        {/* Order summary — collapsible */}
        <div className="bg-white mt-2 rounded-none">
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between px-5 py-3"
          >
            <span className="text-xs font-semibold text-txt-secondary uppercase tracking-wider">
              Detalhes do pedido
            </span>
            <motion.span animate={{ rotate: summaryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                  {displayItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-txt-secondary">{item.qty}x {item.name}</span>
                      <span className="text-txt-primary font-medium tabular-nums">R$ {formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={isActive ? { backgroundColor: 'var(--color-brand-fill)' } : { backgroundColor: 'white' }}
                  >
                    <m.icon
                      size={20}
                      strokeWidth={1.8}
                      style={{ color: isActive ? 'var(--color-on-brand-fill)' : 'var(--color-brand-fill)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-txt-primary">{m.label}</p>
                    <p className="text-[11px] text-txt-tertiary mt-0.5">{m.description}</p>
                  </div>
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

        {/* CPF enrichment */}
        {needsCpf && (
          <div className="px-5 py-4 border-t border-black/5">
            <p className="text-xs font-semibold text-txt-primary mb-1">Informe seu CPF</p>
            <p className="text-[11px] text-txt-tertiary mb-2">Para emitir a nota fiscal</p>
            <input
              type="text"
              inputMode="numeric"
              value={cpfInput}
              onChange={(e) => setCpfInput(formatCpf(e.target.value))}
              placeholder="000.000.000-00"
              className="w-full rounded-xl bg-surface-low border-2 border-border px-3 py-2.5 text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand-fill)' }}
              onBlur={(e) => { e.target.style.borderColor = '' }}
            />
          </div>
        )}

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-1.5 py-3">
          <ShieldCheck size={14} className="text-txt-tertiary" />
          <span className="text-[11px] text-txt-tertiary">Pagamento seguro via Zig</span>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 bg-white border-t border-black/5 px-5 pt-3 pb-6 w-full max-w-5xl mx-auto">
        <div className="md:max-w-md md:mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            disabled={processing || finalTotal <= 0}
            className="w-full py-3 px-5 rounded-pill flex items-center justify-between text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform disabled:opacity-50"
          >
            <span className="text-base font-bold font-display">Pagar</span>
            <span
              className="px-3 py-0.5 rounded-lg text-sm font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              R$ {formatPrice(finalTotal)}
            </span>
          </motion.button>
        </div>
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
