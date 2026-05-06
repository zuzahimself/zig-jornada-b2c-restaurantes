import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, UtensilsCrossed, ChevronDown, Receipt } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMock, getTableTotal } from '../context/MockContext'
import { MOCK_USER_CPF } from '../data/mockTableData'
import { formatPrice, cn } from '../lib/utils'
import type { OrderItemStatus } from '../types'
import { TimelineExtrato } from '../components/TimelineExtrato'

type Tab = 'mine' | 'all'

const STATUS_CONFIG: Record<OrderItemStatus, { label: string; className: string }> = {
  preparing: { label: 'Preparando', className: 'bg-amber-100 text-amber-700' },
  ready: { label: 'Pronto', className: 'bg-emerald-100 text-emerald-700' },
  delivered: { label: 'Entregue', className: 'bg-gray-100 text-gray-500' },
}

export function TableAccount() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tableStatus, paidAmount, tableOrders: mockTableOrders, payments, isPrepaid } = useMock()
  const [tab, setTab] = useState<Tab>('mine')
  const [showExtrato, setShowExtrato] = useState(false)

  const userCpf = user?.cpf || MOCK_USER_CPF
  const myOrders = mockTableOrders.filter((o) => o.userCpf === userCpf)
  const effectiveTab = isPrepaid ? 'mine' : tab
  const displayOrders = effectiveTab === 'mine' ? myOrders : mockTableOrders
  const relevantOrders = isPrepaid ? myOrders : mockTableOrders
  const subtotal = getTableTotal(relevantOrders)
  const serviceTax = Math.round(subtotal * 0.1)
  const tableTotal = subtotal + serviceTax
  const remaining = Math.max(0, tableTotal - paidAmount)

  const statusPill =
    tableStatus === 'open'
      ? { label: 'Aberta', className: 'bg-emerald-100 text-emerald-700' }
      : tableStatus === 'partially_paid'
        ? { label: 'Parcial', className: 'bg-amber-100 text-amber-700' }
        : { label: 'Encerrada', className: 'bg-gray-100 text-gray-500' }

  // Fully paid — empty state
  if (tableStatus === 'fully_paid') {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header (full-width) */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{ backgroundColor: 'var(--color-brand-subtle)', height: 'var(--header-height)' }}
        >
          <div className="max-w-5xl mx-auto flex items-center gap-3 w-full">
            <button onClick={() => navigate(-1)} className="text-brand-text">
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm font-bold text-brand-text flex-1">Mesa 12</span>
            <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusPill.className)}>
              {statusPill.label}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center max-w-5xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-txt-primary">Mesa encerrada</h2>
          <p className="text-sm text-txt-secondary leading-relaxed">
            Tudo pago! O consumo total foi de{' '}
            <span className="font-semibold text-txt-primary">R$ {formatPrice(tableTotal)}</span>
            {' '}(inclui 10% de serviço).
          </p>
          <div className="mt-4 bg-surface-low rounded-xl px-4 py-3">
            <p className="text-xs text-txt-secondary leading-relaxed">
              Para fazer um novo pedido, escaneie o <span className="font-semibold text-txt-primary">QR code da mesa</span> novamente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-white"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header (full-width) */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{ backgroundColor: 'var(--color-brand-subtle)', height: 'var(--header-height)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3 w-full">
          <button onClick={() => navigate(-1)} className="text-brand-text">
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-bold text-brand-text flex-1">Mesa 12</span>
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', statusPill.className)}>
            {statusPill.label}
          </span>
        </div>
      </div>

      {/* Content (contained) */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-5xl mx-auto">

      {/* Segmented toggle — hidden in prepaid (individual experience) */}
      {!isPrepaid && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex bg-surface-low rounded-lg p-1 relative">
            {(['mine', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2 text-sm font-semibold rounded-md transition-colors relative z-10',
                  tab === t ? 'text-txt-primary' : 'text-txt-tertiary'
                )}
              >
                {t === 'mine' ? 'Meus itens' : 'Toda a mesa'}
              </button>
            ))}
            {/* Sliding indicator */}
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm"
              animate={{ x: tab === 'mine' ? 4 : 'calc(100% + 4px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>
        </div>
      )}

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={effectiveTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {displayOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <UtensilsCrossed size={32} className="text-txt-tertiary" />
                <p className="text-sm text-txt-secondary">Nenhum pedido encontrado</p>
              </div>
            ) : (
              displayOrders.map((order) => (
                <div key={order.id} className="mt-4">
                  {/* Order header — show name only in "all" tab */}
                  {effectiveTab === 'all' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{
                          backgroundColor: order.userCpf === userCpf ? 'var(--color-brand-fill)' : '#e5e7eb',
                          color: order.userCpf === userCpf ? 'var(--color-on-brand-fill)' : '#6b7280',
                        }}
                      >
                        {order.userName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-txt-secondary">
                        {order.userCpf === userCpf ? 'Você' : order.userName}
                      </span>
                    </div>
                  )}

                  {/* Order items */}
                  <div className="divide-y divide-black/5 rounded-xl bg-surface-low overflow-hidden">
                    {order.items.map((item, idx) => {
                      const status = STATUS_CONFIG[item.status]
                      return (
                        <div key={`${order.id}-${idx}`} className="flex items-center gap-3 px-3 py-3">
                          {/* Item image */}
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-txt-primary truncate">
                              {item.menuItem.name}
                            </p>
                            <p className="text-xs text-txt-tertiary mt-0.5">
                              {item.quantity}x &middot; R$ {formatPrice(item.menuItem.price * item.quantity)}
                            </p>
                          </div>
                          {/* Status badge */}
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', status.className)}>
                            {status.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary + CTAs */}
      <div className="shrink-0 border-t border-black/5 bg-white px-4 pt-4 pb-6">
        {/* Summary rows */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-txt-secondary">Subtotal</span>
            <span className="font-medium text-txt-primary">R$ {formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-txt-secondary">Serviço (10%)</span>
            <span className="font-medium text-txt-primary">R$ {formatPrice(serviceTax)}</span>
          </div>
          <div className="flex justify-between text-sm pt-1.5 border-t border-black/5">
            <span className="text-txt-primary font-semibold">Total</span>
            <span className="font-bold text-txt-primary">R$ {formatPrice(tableTotal)}</span>
          </div>
          {tableStatus === 'partially_paid' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-txt-secondary">Já pago</span>
                <span className="font-medium text-emerald-600">- R$ {formatPrice(paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-txt-secondary font-medium">Em aberto</span>
                <span className="font-bold text-txt-primary">R$ {formatPrice(remaining)}</span>
              </div>
            </>
          )}
        </div>

        {/* Extrato accordion */}
        <div className="mb-4">
          <button
            onClick={() => setShowExtrato(!showExtrato)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-brand-text"
          >
            <div className="flex items-center gap-2">
              <Receipt size={14} />
              {isPrepaid ? 'Meu extrato' : 'Extrato da mesa'}
            </div>
            <motion.span
              animate={{ rotate: showExtrato ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showExtrato && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-surface-low rounded-xl px-3 py-3">
                  <TimelineExtrato orders={relevantOrders} payments={payments} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA — single pay button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/pagamento')}
          className="w-full py-3 rounded-pill text-base font-bold font-display text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform"
        >
          Pagar
        </motion.button>
      </div>
      </div>
    </motion.div>
  )
}
