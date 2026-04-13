import type { Category } from '../types'

interface CategoryCardsProps {
  categories: Category[]
  onCategoryChange: (id: string) => void
  onSubcategoryChange: (id: string | null) => void
}

const categoryImages: Record<string, string> = {
  destaques:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=85&auto=format&fit=crop',
  'acai-smoothie': '/banner.png',
  'cafe-manha':
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=85&auto=format&fit=crop',
  pratos:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=85&auto=format&fit=crop',
  bebidas:
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=85&auto=format&fit=crop',
}

export function CategoryCards({
  categories,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryCardsProps) {
  return (
    <div className="flex overflow-x-auto no-scrollbar px-6 gap-2 py-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => {
            onCategoryChange(cat.id)
            onSubcategoryChange(null)
          }}
          className="shrink-0 w-[140px] h-[108px] rounded-md overflow-hidden relative"
        >
          <img
            src={categoryImages[cat.id] || categoryImages.destaques}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[68px]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(68,106,129,0), var(--color-brand-fill))',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />
          <p className="absolute bottom-4 left-4 text-white text-sm font-display leading-tight">
            {cat.name}
          </p>
        </button>
      ))}
    </div>
  )
}
