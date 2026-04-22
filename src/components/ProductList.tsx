import { Link, useLocation } from 'react-router-dom'
import type { Category, MenuItem } from '../types'
import { vendors } from '../data/menuData'
import { formatPrice, cn } from '../lib/utils'

interface ProductListProps {
  categories: Category[]
  items: MenuItem[]
  showVendor?: boolean
  /** Total height of sticky elements above (header + category nav) for scroll-margin */
  stickyOffset?: number
}

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768

export function ProductList({
  categories,
  items,
  showVendor,
  stickyOffset = 140,
}: ProductListProps) {
  const location = useLocation()
  return (
    <>
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id)
        if (catItems.length === 0) return null

        const promos = catItems.filter((i) => i.isPromo)
        const regulars = catItems.filter((i) => !i.isPromo)
        const ordered = [...promos, ...regulars]

        return (
          <section
            key={cat.id}
            id={`cat-section-${cat.id}`}
            className="pb-4"
            style={{ scrollMarginTop: stickyOffset }}
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <h2
                className="text-xl font-bold font-display"
                style={{ color: 'var(--color-brand-500)' }}
              >
                {cat.name}
              </h2>
              <span className="text-sm text-txt-secondary">({catItems.length})</span>
            </div>

            <div className="divide-y divide-black/5 md:divide-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:px-4">
              {ordered.map((item) => (
                <Link key={item.id} to={`/produto/${item.id}`} state={isDesktop() ? { backgroundLocation: location } : undefined} className="block md:rounded-xl md:border md:border-black/5 md:overflow-hidden">
                  <ProductCard item={item} showVendor={showVendor} />
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}

function ProductCard({ item, showVendor }: { item: MenuItem; showVendor?: boolean }) {
  const [reais, centavos] = formatPrice(item.price).split(',')
  const originalPrice = item.discountPercent
    ? formatPrice(Math.round(item.price / (1 - item.discountPercent / 100)))
    : null
  const vendor = showVendor ? vendors.find((v) => v.id === item.vendorId) : undefined

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3',
        'md:flex-col md:gap-0 md:p-0',
        item.isPromo && 'bg-brand-subtle'
      )}
    >
      {/* Image — right side on mobile, top on desktop */}
      <div className="shrink-0 w-[88px] h-[88px] rounded-md overflow-hidden order-2 md:order-none md:w-full md:h-[140px] md:rounded-none md:rounded-t-xl">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0 order-1 md:order-none md:p-3 md:flex md:flex-col md:min-h-[120px]">
        {item.badge && (
          <div className="inline-flex items-center glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold mb-1 float-right ml-2 md:float-none md:ml-0 md:self-start">
            {item.badge}
          </div>
        )}

        <p className="text-sm font-bold text-txt-primary leading-snug mb-0.5 md:line-clamp-1">
          {item.name}
        </p>

        {vendor && (
          <div className="flex items-center gap-1.5 mb-1">
            <img src={vendor.logo} alt={vendor.name} className="w-3.5 h-3.5 rounded-full object-cover" />
            <span className="text-[10px] font-medium text-txt-tertiary">{vendor.name}</span>
          </div>
        )}

        <p className="text-xs text-txt-secondary leading-snug line-clamp-2 mb-2 md:line-clamp-1">
          {item.description}
        </p>

        <div className="flex items-center gap-2 md:mt-auto">
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
    </div>
  )
}
