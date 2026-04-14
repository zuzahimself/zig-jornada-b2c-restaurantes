import { useRef, useEffect } from 'react'
import type { Category } from '../types'
import { cn } from '../lib/utils'

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (id: string) => void
  scrolled?: boolean
  stickyTop?: number
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  scrolled = false,
  stickyTop = 0,
}: CategoryNavProps) {
  const tabsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll the active tab into view (horizontal only, no vertical interference)
  useEffect(() => {
    const container = tabsRef.current
    if (!container) return
    const activeEl = container.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement | null
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeCategory])

  return (
    <div
      className={cn(
        'sticky z-40 border-b transition-colors duration-300',
        scrolled ? 'bg-white border-border' : 'bg-transparent border-transparent'
      )}
      style={{ top: stickyTop }}
    >
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
              onClick={() => onCategoryChange(cat.id)}
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
    </div>
  )
}
