import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Coins } from 'lucide-react'
import { useCart, getItemUnitPrice } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useBrand } from '../context/BrandContext'
import { useMock } from '../context/MockContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { vendors as allVendors } from '../data/menuData'
import { formatPrice } from '../lib/utils'
import type { CartItem } from '../types'

const SERVICE_RATE = 0.1

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const navigate = useNavigate()
  const { cart, removeItem, updateQuantity, totalCents, itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const { tokens } = useBrand()
  const { cashbackRate, isMultiVendor } = useMock()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const serviceCents = Math.round(totalCents * SERVICE_RATE)
  const grandTotal = totalCents + serviceCents
  const cashbackPreview = Math.round(grandTotal * cashbackRate)

  // Group cart items by vendor when multi-vendor is active
  const vendorGroups = useMemo(() => {
    if (!isMultiVendor) return null
    const groups: { vendorId: string; vendorName: string; vendorLogo: string; items: { ci: CartItem; originalIndex: number }[]; subtotal: number }[] = []
    const map = new Map<string, typeof groups[number]>()
    cart.forEach((ci, index) => {
      const vid = ci.item.vendorId || 'unknown'
      if (!map.has(vid)) {
        const vendor = allVendors.find((v) => v.id === vid)
        const group = { vendorId: vid, vendorName: vendor?.name ?? 'Outros', vendorLogo: vendor?.logo ?? '', items: [], subtotal: 0 }
        map.set(vid, group)
        groups.push(group)
      }
      const g = map.get(vid)!
      g.items.push({ ci, originalIndex: index })
      g.subtotal += getItemUnitPrice(ci) * ci.quantity
    })
    return groups
  }, [cart, isMultiVendor])

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 300 || info.offset.y > 150) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[61] bg-white rounded-t-2xl flex flex-col"
            style={{ maxHeight: '80vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <h2 className="font-display text-lg font-bold text-txt-primary">Seu pedido</h2>
              <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-brand-subtle text-brand-text">
                Mesa 12
              </span>
            </div>

            {cart.length === 0 ? (
              <EmptyState onClose={onClose} />
            ) : (
              <>
                {/* Scrollable items */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {vendorGroups ? (
                    /* Multi-vendor grouped view */
                    vendorGroups.map((group) => (
                      <div key={group.vendorId}>
                        {/* Vendor group header */}
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                          {group.vendorLogo && (
                            <img src={group.vendorLogo} alt={group.vendorName} className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span className="text-xs font-bold text-txt-primary">{group.vendorName}</span>
                        </div>
                        <AnimatePresence initial={false}>
                          {group.items.map(({ ci, originalIndex }) => (
                            <CartItemRow
                              key={`${ci.item.id}-${originalIndex}`}
                              ci={ci}
                              index={originalIndex}
                              onRemove={removeItem}
                              onUpdateQty={updateQuantity}
                              buttonText={buttonText}
                            />
                          ))}
                        </AnimatePresence>
                        {/* Vendor subtotal */}
                        <div className="flex items-center justify-between px-4 py-2 bg-surface-low">
                          <span className="text-[11px] text-txt-tertiary">Subtotal {group.vendorName}</span>
                          <span className="text-xs font-semibold text-txt-secondary">R$ {formatPrice(group.subtotal)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Single vendor flat view */
                    <AnimatePresence initial={false}>
                      {cart.map((ci, index) => (
                        <CartItemRow
                          key={`${ci.item.id}-${index}`}
                          ci={ci}
                          index={index}
                          onRemove={removeItem}
                          onUpdateQty={updateQuantity}
                          buttonText={buttonText}
                        />
                      ))}
                    </AnimatePresence>
                  )}

                  {/* Summary */}
                  <div className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-txt-secondary">
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                      </span>
                      <span className="text-sm font-medium text-txt-primary">
                        R$ {formatPrice(totalCents)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-txt-secondary">Taxa de serviço (10%)</span>
                      <span className="text-sm font-medium text-txt-primary">
                        R$ {formatPrice(serviceCents)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-1 flex items-center justify-between">
                      <span className="text-base font-bold text-txt-primary">Total</span>
                      <span
                        className="text-base font-bold font-display"
                        style={{ color: 'var(--color-brand-700)' }}
                      >
                        R$ {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 pt-3 pb-5">
                  {isAuthenticated && cashbackPreview > 0 && (
                    <div className="flex items-center justify-center gap-1.5 pb-3">
                      <Coins size={13} style={{ color: 'var(--color-loyalty-gold)' }} />
                      <span className="text-[11px] font-medium" style={{ color: 'var(--color-loyalty-gold)' }}>
                        Ganhe ~R$ {formatPrice(cashbackPreview)} de giftback
                      </span>
                    </div>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (!isAuthenticated) {
                        onClose()
                        navigate('/login?returnTo=cart')
                        return
                      }
                      onClose()
                      navigate('/sucesso')
                    }}
                    className="w-full py-3 px-4 rounded-pill flex items-center justify-between relative overflow-hidden"
                    style={{ backgroundColor: brandFill, color: buttonText }}
                  >
                    {/* Shimmer effect */}
                    <span className="shimmer-btn absolute inset-0 pointer-events-none" />
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative"
                      style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: buttonText }}
                    >
                      {String(itemCount).padStart(2, '0')}
                    </span>
                    <span className="text-base font-bold font-display relative">Enviar pedido</span>
                    <span className="text-sm font-semibold shrink-0 relative">R${formatPrice(grandTotal)}</span>
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShoppingBag size={56} className="text-brand-text" strokeWidth={1.2} />
      </motion.div>
      <p className="font-display text-lg font-bold text-txt-primary mt-2">
        Seu carrinho está vazio
      </p>
      <p className="text-sm text-txt-secondary text-center">
        Explore nosso cardápio e encontre algo especial
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        className="mt-3 px-6 py-2.5 rounded-pill text-sm font-bold text-on-brand bg-brand-fill"
      >
        Explorar cardápio
      </motion.button>
    </motion.div>
  )
}

function CartItemRow({
  ci,
  index,
  onRemove,
  onUpdateQty,
  buttonText,
}: {
  ci: CartItem
  index: number
  onRemove: (i: number) => void
  onUpdateQty: (i: number, qty: number) => void
  buttonText: string
}) {
  const unitPrice = getItemUnitPrice(ci)
  const lineTotal = unitPrice * ci.quantity
  const customSummary = getCustomizationSummary(ci)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 px-4 py-4 border-b border-border"
    >
      <img
        src={ci.item.image}
        alt={ci.item.name}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-txt-primary truncate">{ci.item.name}</p>
        {customSummary && (
          <p className="text-xs text-txt-tertiary mt-0.5 truncate">{customSummary}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {ci.quantity === 1 ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(index)}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center"
              >
                <Trash2 size={14} className="text-txt-tertiary" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onUpdateQty(index, ci.quantity - 1)}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center"
              >
                <Minus size={14} className="text-txt-secondary" />
              </motion.button>
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={ci.quantity}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-bold text-txt-primary w-5 text-center"
              >
                {ci.quantity}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQty(index, ci.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-brand-fill flex items-center justify-center"
            >
              <Plus size={14} color={buttonText} />
            </motion.button>
          </div>
          <div className="flex items-baseline gap-0.5 font-display">
            <span
              className="text-[10px] font-semibold"
              style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}
            >
              R$
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-brand-700)' }}>
              {formatPrice(lineTotal)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function getCustomizationSummary(ci: CartItem): string {
  if (!ci.selectedCustomizations || !ci.item.customizations) return ''
  const parts: string[] = []
  for (const group of ci.item.customizations) {
    const selected = ci.selectedCustomizations[group.id] ?? []
    for (const optId of selected) {
      const opt = group.options.find((o) => o.id === optId)
      if (opt) parts.push(opt.name)
    }
  }
  return parts.join(', ')
}
