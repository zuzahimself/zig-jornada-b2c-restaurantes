import { Link, useLocation } from 'react-router-dom'
import type { MenuItem } from '../types'
import { formatPrice } from '../lib/utils'

interface SuggestionSectionProps {
  items: MenuItem[]
}

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768

export function SuggestionSection({ items }: SuggestionSectionProps) {
  const location = useLocation()
  return (
    <section className="py-4">
      <h2 className="px-4 mb-3 text-xl font-bold font-display" style={{ color: 'var(--color-brand-500)' }}>
        Sugestão do dia
      </h2>

      <div className="flex overflow-x-auto no-scrollbar px-4 gap-3 pb-1">
        {items.map((item) => (
          <Link key={item.id} to={`/produto/${item.id}`} state={isDesktop() ? { backgroundLocation: location } : undefined}>
            <SuggestionCard item={item} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function SuggestionCard({ item }: { item: MenuItem }) {
  const [reais, centavos] = formatPrice(item.price).split(',')

  return (
    <div className="shrink-0 w-40 flex flex-col">
      {/* Photo 4:3 */}
      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-2">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        {item.badge && (
          <div
            className="absolute top-1.5 left-1.5 glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold"
          >
            {item.badge}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-bold text-txt-primary leading-snug line-clamp-2 mb-1">
        {item.name}
      </p>

      {/* Description */}
      <p className="text-xs text-txt-secondary leading-snug line-clamp-2 mb-2 flex-1">
        {item.description}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-0.5 font-display">
        <span className="text-[10px] font-semibold" style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}>R$</span>
        <span className="text-base font-bold" style={{ color: 'var(--color-brand-700)' }}>{reais}</span>
        <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}>,{centavos}</span>
      </div>
    </div>
  )
}
