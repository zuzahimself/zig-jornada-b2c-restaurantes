import { Link } from 'react-router-dom'
import type { Category, MenuItem } from '../types'
import { formatPrice, cn } from '../lib/utils'

interface ProductListProps {
  categories: Category[]
  items: MenuItem[]
  activeCategory: string
  activeSubcategory: string | null
}

export function ProductList({
  categories,
  items,
  activeCategory,
  activeSubcategory,
}: ProductListProps) {
  const activeCat = categories.find((c) => c.id === activeCategory)
  const filtered = items.filter((item) => {
    if (item.categoryId !== activeCategory) return false
    if (activeSubcategory && item.subcategoryId !== activeSubcategory) return false
    return true
  })

  if (filtered.length === 0) return null

  // Promo items go first
  const promos = filtered.filter((i) => i.isPromo)
  const regulars = filtered.filter((i) => !i.isPromo)
  const ordered = [...promos, ...regulars]

  return (
    <section className="pb-4">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <h2 className="text-xl font-bold font-display" style={{ color: 'var(--color-brand-500)' }}>{activeCat?.name ?? activeCategory}</h2>
        <span className="text-sm text-txt-secondary">({filtered.length})</span>
      </div>

      <div className="divide-y divide-black/5">
        {ordered.map((item) => (
          <Link key={item.id} to={`/produto/${item.id}`} className="block">
            <ProductCard item={item} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProductCard({ item }: { item: MenuItem }) {
  const [reais, centavos] = formatPrice(item.price).split(',')
  const originalPrice = item.discountPercent
    ? formatPrice(Math.round(item.price / (1 - item.discountPercent / 100)))
    : null

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3',
        item.isPromo && 'bg-brand-subtle'
      )}
    >
      {/* Left: text content */}
      <div className="flex-1 min-w-0">
        {/* Promo badge */}
        {item.badge && (
          <div className="inline-flex items-center glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold mb-1 float-right ml-2">
            {item.badge}
          </div>
        )}

        <p className="text-sm font-bold text-txt-primary leading-snug mb-1">
          {item.name}
        </p>

        <p className="text-xs text-txt-secondary leading-snug line-clamp-2 mb-2">
          {item.description}
        </p>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-0.5 font-display">
            <span className="text-[10px] font-semibold" style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}>R$</span>
            <span className="text-base font-bold" style={{ color: 'var(--color-brand-700)' }}>{reais}</span>
            <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}>,{centavos}</span>
          </div>
          {originalPrice && (
            <span className="text-xs text-txt-tertiary line-through">R${originalPrice}</span>
          )}
        </div>
      </div>

      {/* Right: photo */}
      <div className="shrink-0 w-[88px] h-[88px] rounded-md overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
