import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useBrand } from '../context/BrandContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { formatPrice } from '../lib/utils'
import { suggestionItems } from '../data/menuData'
import type { MenuItem } from '../types'

interface UpsellSheetProps {
  isOpen: boolean
  excludeItemId?: string
  onClose: () => void
  onViewCart: () => void
}

export function UpsellSheet({ isOpen, excludeItemId, onClose, onViewCart }: UpsellSheetProps) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { tokens } = useBrand()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const items = suggestionItems.filter(
    (i) => i.id !== excludeItemId && !addedIds.has(i.id)
  )

  const handleQuickAdd = useCallback(
    (item: MenuItem) => {
      if (item.customizations && item.customizations.length > 0) {
        onClose()
        navigate(`/produto/${item.id}`)
        return
      }
      addItem(item, 1)
      setAddedIds((prev) => new Set(prev).add(item.id))
    },
    [addItem, navigate, onClose]
  )

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 300 || info.offset.y > 150) {
      onClose()
    }
  }

  function handleViewCart() {
    onViewCart()
  }

  function handleContinue() {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[71] bg-white rounded-t-2xl flex flex-col"
            style={{ maxHeight: '65vh' }}
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

            {/* Title */}
            <div className="px-4 pb-3">
              <h2 className="font-display text-lg font-bold text-txt-primary">
                Que tal adicionar?
              </h2>
              <p className="text-xs text-txt-secondary mt-0.5">
                Aproveite e complete seu pedido
              </p>
            </div>

            {/* Scrollable cards */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3">
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {items.map((item) => (
                    <UpsellCard
                      key={item.id}
                      item={item}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-txt-tertiary text-center py-6"
                  >
                    Todas as sugestões já foram adicionadas!
                  </motion.p>
                )}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="border-t border-border px-4 pt-3 pb-5 flex flex-col gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleViewCart}
                className="w-full py-3 rounded-xl text-sm font-bold"
                style={{ backgroundColor: brandFill, color: buttonText }}
              >
                Ver meu pedido
              </motion.button>
              <button
                onClick={handleContinue}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-txt-secondary"
              >
                Continuar comprando
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function UpsellCard({
  item,
  onQuickAdd,
}: {
  item: MenuItem
  onQuickAdd: (item: MenuItem) => void
}) {
  const [justAdded, setJustAdded] = useState(false)
  const hasCustomizations = item.customizations && item.customizations.length > 0
  const [reais, centavos] = formatPrice(item.price).split(',')

  function handleTap() {
    if (hasCustomizations) {
      onQuickAdd(item)
      return
    }
    setJustAdded(true)
    onQuickAdd(item)
  }

  return (
    <motion.button
      layout
      onClick={handleTap}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-2 rounded-xl border border-border text-left w-full"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-txt-primary truncate">{item.name}</p>
        <p className="text-xs text-txt-secondary line-clamp-1">{item.description}</p>
        <div className="flex items-baseline gap-0.5 font-display mt-1">
          <span
            className="text-[10px] font-semibold"
            style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}
          >
            R$
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-brand-700)' }}>
            {reais}
          </span>
          <span
            className="text-xs"
            style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}
          >
            ,{centavos}
          </span>
        </div>
      </div>
      {justAdded ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-8 h-8 rounded-full bg-brand-fill flex items-center justify-center shrink-0"
        >
          <Check size={14} color="#fff" strokeWidth={3} />
        </motion.div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center shrink-0">
          <span className="text-brand-text text-lg font-bold leading-none">+</span>
        </div>
      )}
    </motion.button>
  )
}
