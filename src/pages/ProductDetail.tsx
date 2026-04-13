import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { menuItems, categories } from '../data/menuData'
import { formatPrice } from '../lib/utils'
import { useBrand } from '../context/BrandContext'
import { useCart } from '../context/CartContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { ProductCustomizer } from '../components/ProductCustomizer'

// ─── Allergen config ────────────────────────────────────────────────────────
const ALLERGEN_MAP: Record<string, { emoji: string; bg: string; border: string; text: string }> = {
  'Glúten':   { emoji: '🌾', bg: '#fffef5', border: '#fef0c7', text: '#a16207' },
  'Lactose':  { emoji: '🥛', bg: '#f8faff', border: '#dbeafe', text: '#3b82f6' },
  'Ovo':      { emoji: '🥚', bg: '#fffbf5', border: '#fed7aa', text: '#c2410c' },
  'Soja':     { emoji: '🫘', bg: '#f5fdf9', border: '#d1fae5', text: '#059669' },
  'Amendoim': { emoji: '🥜', bg: '#fffef5', border: '#fef0c7', text: '#b45309' },
  'Frutos do mar': { emoji: '🦐', bg: '#fef8fb', border: '#fce7f3', text: '#db2777' },
  'Peixe':    { emoji: '🐟', bg: '#f5fdfe', border: '#cffafe', text: '#0891b2' },
  'Nozes':    { emoji: '🌰', bg: '#fffef8', border: '#fef3c7', text: '#b45309' },
}

const DEFAULT_ALLERGEN = { emoji: '⚠️', bg: '#fafafa', border: '#e5e5e5', text: '#737373' }

// ─── Nutrition config ───────────────────────────────────────────────────────
const NUTRITION_CONFIG = {
  calories: { emoji: '🔥', label: 'Calorias', unit: 'kcal', bg: '#fef5f5', text: '#b91c1c' },
  protein:  { emoji: '💪', label: 'Proteína', unit: 'g',    bg: '#f5f8ff', text: '#2563eb' },
  carbs:    { emoji: '🍞', label: 'Carboidrato', unit: 'g', bg: '#fefdf5', text: '#a16207' },
  fat:      { emoji: '🧈', label: 'Gordura', unit: 'g',     bg: '#fffbf5', text: '#c2410c' },
} as const

// ─── Category emoji map ─────────────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
  'destaques': '⭐',
  'acai-smoothie': '🍇',
  'cafe-manha': '☕',
  'pratos': '🍽️',
  'bebidas': '🥤',
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tokens } = useBrand()
  const { addItem } = useCart()
  const [nutritionOpen, setNutritionOpen] = useState(false)
  const [selections, setSelections] = useState<Record<string, string[]>>({})

  const item = menuItems.find((i) => i.id === id)

  if (!item) {
    navigate('/', { replace: true })
    return null
  }

  const category = categories.find((c) => c.id === item.categoryId)
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)
  const hasNutrition = item.nutrition && Object.values(item.nutrition).some((v) => v != null)
  const hasAllergens = item.allergens && item.allergens.length > 0
  const hasCustomizations = item.customizations && item.customizations.length > 0

  // Calculate total price with modifiers
  const totalPrice = useMemo(() => {
    let total = item.price
    if (!item.customizations) return total
    for (const group of item.customizations) {
      const selected = selections[group.id] ?? []
      for (const optId of selected) {
        const opt = group.options.find((o) => o.id === optId)
        if (opt) total += opt.priceModifier
      }
    }
    return total
  }, [item, selections])

  // Check if all required groups are filled
  const allRequiredFilled = useMemo(() => {
    if (!item.customizations) return true
    return item.customizations
      .filter((g) => g.required)
      .every((g) => (selections[g.id] ?? []).length > 0)
  }, [item, selections])

  const isDisabled = hasCustomizations && !allRequiredFilled

  const [reais, centavos] = formatPrice(totalPrice).split(',')

  const handleSelectionChange = useCallback((groupId: string, optionIds: string[]) => {
    setSelections((prev) => ({ ...prev, [groupId]: optionIds }))
  }, [])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero photo */}
        <motion.div
          className="relative w-full h-[50vh] shrink-0"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 glass-badge rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" strokeWidth={2} />
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          className="px-4 pt-5 pb-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Category pill */}
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-medium bg-brand-subtle text-brand-text mb-3">
              {CATEGORY_EMOJI[category.id] && (
                <span>{CATEGORY_EMOJI[category.id]}</span>
              )}
              {category.name}
            </span>
          )}

          {/* Name */}
          <h1 className="font-display text-2xl font-bold text-txt-primary mb-2">
            {item.name}
          </h1>

          {/* Description */}
          <p className="text-sm text-txt-secondary leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Customization steps */}
          {hasCustomizations && (
            <ProductCustomizer
              groups={item.customizations!}
              selections={selections}
              onSelectionChange={handleSelectionChange}
            />
          )}

          {/* Nutrition accordion */}
          {hasNutrition && (
            <div className="border border-border rounded-xl mb-4 overflow-hidden">
              <button
                onClick={() => setNutritionOpen(!nutritionOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-txt-primary"
              >
                <span className="flex items-center gap-1.5">
                  <span>📊</span>
                  Informações nutricionais
                </span>
                <motion.div
                  animate={{ rotate: nutritionOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-txt-tertiary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {nutritionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                      {(Object.keys(NUTRITION_CONFIG) as (keyof typeof NUTRITION_CONFIG)[]).map((key) => {
                        const val = item.nutrition?.[key]
                        if (val == null) return null
                        const cfg = NUTRITION_CONFIG[key]
                        return (
                          <NutritionItem
                            key={key}
                            emoji={cfg.emoji}
                            label={cfg.label}
                            value={`${val} ${cfg.unit}`}
                            bgColor={cfg.bg}
                            accentColor={cfg.text}
                          />
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Allergens */}
          {hasAllergens && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-txt-secondary mb-2">⚠️ Alérgenos</p>
              <div className="flex flex-wrap gap-2">
                {item.allergens!.map((allergen) => {
                  const cfg = ALLERGEN_MAP[allergen] ?? DEFAULT_ALLERGEN
                  return (
                    <span
                      key={allergen}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold border"
                      style={{
                        backgroundColor: cfg.bg,
                        borderColor: cfg.border,
                        color: cfg.text,
                      }}
                    >
                      <span>{cfg.emoji}</span>
                      {allergen}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-50 bg-white border-t border-border px-4 pt-3 pb-5">
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex items-baseline gap-0.5 font-display">
            <span
              className="text-xs font-semibold"
              style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}
            >
              R$
            </span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-brand-700)' }}>
              {reais}
            </span>
            <span
              className="text-sm"
              style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}
            >
              ,{centavos}
            </span>
          </div>

          {/* Add button */}
          <motion.button
            whileTap={isDisabled ? undefined : { scale: 0.97 }}
            disabled={isDisabled}
            onClick={() => {
              addItem(item, 1, hasCustomizations ? selections : undefined)
              navigate(-1)
            }}
            className="flex-1 max-w-[220px] py-3 rounded-xl text-sm font-bold transition-opacity"
            style={{
              backgroundColor: brandFill,
              color: buttonText,
              opacity: isDisabled ? 0.4 : 1,
            }}
          >
            {hasCustomizations
              ? `Adicionar · R$ ${formatPrice(totalPrice)}`
              : 'Adicionar'}
          </motion.button>
        </div>
      </div>

    </div>
  )
}

function NutritionItem({
  emoji,
  label,
  value,
  bgColor,
  accentColor,
}: {
  emoji: string
  label: string
  value: string
  bgColor: string
  accentColor: string
}) {
  return (
    <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-sm">{emoji}</span>
        <p className="text-[10px] uppercase tracking-wide font-medium" style={{ color: accentColor }}>
          {label}
        </p>
      </div>
      <p className="text-sm font-bold" style={{ color: accentColor }}>{value}</p>
    </div>
  )
}
