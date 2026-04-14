import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, X } from 'lucide-react'
import { menuItems, categories, vendors } from '../data/menuData'
import { useMock } from '../context/MockContext'
import { formatPrice } from '../lib/utils'
import type { MenuItem } from '../types'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (id: string) => void
}

export function SearchOverlay({ isOpen, onClose, onCategorySelect }: SearchOverlayProps) {
  const navigate = useNavigate()
  const { isMultiVendor } = useMock()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      // Small delay to let animation start before focusing (mobile keyboard)
      const t = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase().trim()
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }, [query])

  function handleItemTap(item: MenuItem) {
    onClose()
    navigate(`/produto/${item.id}`)
  }

  function handleCategoryTap(id: string) {
    onClose()
    onCategorySelect(id)
  }

  const hasQuery = query.trim().length >= 2
  const noResults = hasQuery && results.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] bg-white flex flex-col"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Search header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button onClick={onClose} className="shrink-0 text-txt-secondary">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-low">
              <Search size={18} className="text-txt-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar categoria ou prato..."
                className="flex-1 bg-transparent text-sm text-txt-primary placeholder:text-txt-tertiary outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="shrink-0 text-txt-tertiary">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!hasQuery ? (
              /* Empty state: show categories */
              <div>
                <p className="text-xs font-semibold text-txt-tertiary uppercase tracking-wider mb-3">
                  Categorias
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryTap(cat.id)}
                      className="px-4 py-2 rounded-pill text-sm font-medium border border-border text-brand-text bg-brand-subtle hover:bg-brand-fill hover:text-on-brand transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-semibold text-txt-tertiary uppercase tracking-wider mt-6 mb-3">
                  Populares
                </p>
                <div className="flex flex-col gap-1">
                  {menuItems.filter((i) => i.badge).slice(0, 5).map((item) => (
                    <ResultRow key={item.id} item={item} onTap={handleItemTap} showVendor={isMultiVendor} />
                  ))}
                </div>
              </div>
            ) : noResults ? (
              /* No results */
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Search size={32} className="text-txt-tertiary" />
                <p className="text-sm font-semibold text-txt-primary">
                  Nenhum resultado para "{query}"
                </p>
                <p className="text-xs text-txt-tertiary">
                  Tente buscar por outro prato ou categoria
                </p>
              </div>
            ) : (
              /* Results */
              <div>
                <p className="text-xs text-txt-tertiary mb-3">
                  {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                </p>
                <div className="flex flex-col gap-1">
                  <AnimatePresence>
                    {results.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ResultRow item={item} onTap={handleItemTap} showVendor={isMultiVendor} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResultRow({ item, onTap, showVendor }: { item: MenuItem; onTap: (item: MenuItem) => void; showVendor?: boolean }) {
  const [reais, centavos] = formatPrice(item.price).split(',')
  const vendor = showVendor ? vendors.find((v) => v.id === item.vendorId) : undefined

  return (
    <button
      onClick={() => onTap(item)}
      className="flex items-center gap-3 p-2 rounded-xl w-full text-left hover:bg-surface-low transition-colors"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-txt-primary truncate">{item.name}</p>
        <p className="text-xs text-txt-secondary line-clamp-1">{item.description}</p>
        {vendor && (
          <div className="flex items-center gap-1 mt-0.5">
            <img src={vendor.logo} alt={vendor.name} className="w-3.5 h-3.5 rounded-full object-cover" />
            <span className="text-[10px] font-medium text-txt-tertiary">{vendor.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-0.5 font-display shrink-0">
        <span className="text-[10px]" style={{ color: 'var(--color-brand-700)' }}>R$</span>
        <span className="text-sm font-bold" style={{ color: 'var(--color-brand-700)' }}>{reais}</span>
        <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-brand-700) 55%, transparent)' }}>,{centavos}</span>
      </div>
    </button>
  )
}
