import { useRef } from 'react'
import type { Category } from '../types'
import { cn } from '../lib/utils'

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string
  activeSubcategory: string | null
  onCategoryChange: (id: string) => void
  onSubcategoryChange: (id: string | null) => void
  scrolled?: boolean
  stickyTop?: number
}

export function CategoryNav({
  categories,
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  scrolled = false,
  stickyTop = 0,
}: CategoryNavProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const activeCat = categories.find((c) => c.id === activeCategory)

  return (
    <div
      className={cn(
        'sticky z-40 border-b transition-colors duration-300',
        scrolled ? 'bg-white border-border' : 'bg-transparent border-transparent'
      )}
      style={{ top: stickyTop }}
    >
      {/* Main category tabs */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto no-scrollbar px-4 pt-3 pb-2 gap-2"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange(cat.id)
                onSubcategoryChange(null)
              }}
              className={cn(
                'shrink-0 px-3 py-1 rounded-pill text-xs font-medium border whitespace-nowrap',
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
      {activeCat && activeCat.subcategories.length > 0 && (
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-2 gap-2">
          <button
            onClick={() => onSubcategoryChange(null)}
            className={cn(
              'shrink-0 px-3 py-1 rounded-pill text-xs font-medium border whitespace-nowrap',
              activeSubcategory === null
                ? 'border-brand-fill text-brand-text bg-brand-subtle'
                : 'border-border text-txt-secondary bg-transparent'
            )}
          >
            Todos
          </button>
          {activeCat.subcategories.map((sub) => {
            const isActive = sub.id === activeSubcategory
            return (
              <button
                key={sub.id}
                onClick={() => onSubcategoryChange(sub.id)}
                className={cn(
                  'shrink-0 px-3 py-1 rounded-pill text-xs font-medium border whitespace-nowrap',
                  isActive
                    ? 'border-brand-fill text-brand-text bg-brand-subtle'
                    : 'border-border text-txt-secondary bg-transparent'
                )}
              >
                {sub.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
