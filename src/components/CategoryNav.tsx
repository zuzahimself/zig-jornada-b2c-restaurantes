import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Category } from '../types'
import { cn } from '../lib/utils'

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (id: string) => void
  activeSubcategory: string | null
  onSubcategoryChange: (id: string | null) => void
  scrolled?: boolean
  stickyTop?: number
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  activeSubcategory,
  onSubcategoryChange,
  scrolled = false,
  stickyTop = 0,
}: CategoryNavProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  const activeCat = categories.find((c) => c.id === activeCategory)
  const subcategories = activeCat?.subcategories ?? []
  const hasSubcategories = subcategories.length > 0

  // Auto-scroll the active tab into view
  useEffect(() => {
    const container = tabsRef.current
    if (!container) return
    const activeEl = container.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement | null
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeCategory])

  // Auto-scroll the active subcategory chip into view
  useEffect(() => {
    const container = subRef.current
    if (!container || !activeSubcategory) return
    const activeEl = container.querySelector(`[data-subcat="${activeSubcategory}"]`) as HTMLElement | null
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeSubcategory])

  function handleCategoryChange(id: string) {
    onSubcategoryChange(null)
    onCategoryChange(id)
  }

  return (
    <div
      className={cn(
        'sticky z-40 border-b transition-colors duration-300',
        scrolled ? 'bg-white border-border' : 'bg-transparent border-transparent'
      )}
      style={{ top: stickyTop }}
    >
      {/* Category tabs */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto no-scrollbar px-4 pt-3 pb-2 gap-2"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                'shrink-0 px-3 py-1 rounded-pill text-xs font-medium border whitespace-nowrap transition-colors',
                isActive
                  ? 'border-brand-fill text-brand-text bg-brand-subtle'
                  : 'border-border text-txt-secondary bg-transparent'
              )}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Subcategory chips */}
      <AnimatePresence>
        {hasSubcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              ref={subRef}
              className="flex overflow-x-auto no-scrollbar px-4 pb-2 gap-1.5"
            >
              {/* "Todos" chip */}
              <button
                data-subcat="all"
                onClick={() => onSubcategoryChange(null)}
                className={cn(
                  'shrink-0 px-2.5 py-0.5 rounded-pill text-[11px] font-medium border whitespace-nowrap transition-colors',
                  activeSubcategory === null
                    ? 'border-brand-border text-brand-text bg-brand-subtle'
                    : 'border-border text-txt-tertiary bg-transparent'
                )}
              >
                Todos
              </button>
              {subcategories.map((sub) => {
                const isActive = activeSubcategory === sub.id
                return (
                  <button
                    key={sub.id}
                    data-subcat={sub.id}
                    onClick={() => onSubcategoryChange(sub.id)}
                    className={cn(
                      'shrink-0 px-2.5 py-0.5 rounded-pill text-[11px] font-medium border whitespace-nowrap transition-colors',
                      isActive
                        ? 'border-brand-border text-brand-text bg-brand-subtle'
                        : 'border-border text-txt-tertiary bg-transparent'
                    )}
                  >
                    {sub.name}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
