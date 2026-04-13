import { useRef, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBrand } from '../context/BrandContext'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  onMenuOpen: () => void
  tableNumber?: number
  scrolled?: boolean
  onHeightChange?: (h: number) => void
}

export function Header({ onMenuOpen, tableNumber = 12, scrolled = false, onHeightChange }: HeaderProps) {
  const { tokens, textOnBrand, scale } = useBrand()
  const { user, isAuthenticated } = useAuth()
  const fill = tokens['--color-brand-fill']
  const brandTextColor = tokens['--color-brand-text']
  const headerRef = useRef<HTMLElement>(null)

  const initials = isAuthenticated && user
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const bgStyle = scrolled ? fill : 'transparent'

  useEffect(() => {
    const el = headerRef.current
    if (!el || !onHeightChange) return
    const ro = new ResizeObserver(() => onHeightChange(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [onHeightChange])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 px-4 py-2 select-none transition-colors duration-300"
      style={{ backgroundColor: bgStyle }}
    >
      {/* Row 1: Logo + Mesa pill */}
      <div className="flex items-center justify-between mb-2">
        <img
          src="/logo-mana.png"
          alt="Mana"
          className="h-6 object-contain"
          style={{ filter: scrolled ? 'brightness(0) invert(1)' : 'none' }}
        />

        <Link
          to="/conta-mesa"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-sm font-semibold no-underline"
          style={{
            backgroundColor: scrolled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
            color: scrolled ? textOnBrand : brandTextColor,
          }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: '#00c67f' }}
          />
          Mesa {tableNumber}
        </Link>
      </div>

      {/* Row 2: Search input + hamburger */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            backgroundColor: scrolled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
          }}
        >
          <Search size={18} color={scrolled ? textOnBrand : scale[400]} strokeWidth={2} />
          <span
            className="text-sm"
            style={{ color: scrolled ? 'rgba(255,255,255,0.6)' : scale[400] }}
          >
            Buscar categoria ou prato...
          </span>
        </div>

        {isAuthenticated ? (
          <button
            aria-label="Abrir menu"
            onClick={onMenuOpen}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-xs font-bold transition-colors"
            style={{
              backgroundColor: scrolled ? 'rgba(255,255,255,0.2)' : fill,
              color: scrolled ? textOnBrand : tokens['--color-on-brand-fill'],
            }}
          >
            {initials}
          </button>
        ) : (
          <button
            aria-label="Abrir menu"
            onClick={onMenuOpen}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: scrolled ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
              backgroundColor: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
            }}
          >
            <Menu size={20} color={scrolled ? textOnBrand : fill} strokeWidth={2} />
          </button>
        )}
      </div>
    </header>
  )
}
