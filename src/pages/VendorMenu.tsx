import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CategoryNav } from '../components/CategoryNav'
import { SuggestionSection } from '../components/SuggestionSection'
import { ProductList } from '../components/ProductList'
import { BottomBar } from '../components/BottomBar'
import { CartSheet } from '../components/CartSheet'
import { FlyingCartItem } from '../components/FlyingCartItem'
import { vendors, categories, menuItems, suggestionItems } from '../data/menuData'
import { useCart } from '../context/CartContext'

const HEADER_H = 56
const CAT_NAV_H = 44

export function VendorMenu() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const vendor = vendors.find((v) => v.id === vendorId)

  const { totalCents, itemCount, openCartAfterAdd, setOpenCartAfterAdd, lastAddedImage, clearLastAdded } = useCart()

  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [flyingImage, setFlyingImage] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const isScrollingToRef = useRef(false)

  // Filter data for this vendor
  const vendorItems = menuItems.filter((i) => i.vendorId === vendorId)
  const vendorCategories = categories.filter((cat) =>
    vendorItems.some((i) => i.categoryId === cat.id)
  )
  const vendorSuggestions = suggestionItems.filter((i) => i.vendorId === vendorId)

  const [activeCategory, setActiveCategory] = useState(
    vendorCategories[0]?.id ?? 'destaques'
  )
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)

  // Cart effects
  useEffect(() => {
    if (lastAddedImage) {
      const t = setTimeout(() => {
        setFlyingImage(lastAddedImage)
        clearLastAdded()
      }, 100)
      return () => clearTimeout(t)
    }
  }, [lastAddedImage, clearLastAdded])

  useEffect(() => {
    if (openCartAfterAdd) {
      setOpenCartAfterAdd(false)
      const t = setTimeout(() => setCartSheetOpen(true), 200)
      return () => clearTimeout(t)
    }
  }, [openCartAfterAdd, setOpenCartAfterAdd])

  const handleFlyComplete = useCallback(() => {
    setFlyingImage(null)
  }, [])

  // ── Scroll spy ─────────────────────────────────────────────────────────
  const stickyOffset = CAT_NAV_H

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => {
      setScrolled(el.scrollTop > 40)

      if (isScrollingToRef.current) return

      const containerTop = el.getBoundingClientRect().top
      let current = vendorCategories[0]?.id
      for (const cat of vendorCategories) {
        const section = document.getElementById(`cat-section-${cat.id}`)
        if (!section) continue
        const sectionTop = section.getBoundingClientRect().top - containerTop
        if (sectionTop <= stickyOffset + 20) {
          current = cat.id
        }
      }
      if (current && current !== activeCategory) {
        setActiveCategory(current)
        setActiveSubcategory(null)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [stickyOffset, activeCategory, vendorCategories])

  // ── Scroll to category section ─────────────────────────────────────────
  const scrollToCategory = useCallback((catId: string) => {
    const section = document.getElementById(`cat-section-${catId}`)
    if (!section) return

    setActiveCategory(catId)
    setActiveSubcategory(null)
    isScrollingToRef.current = true

    section.scrollIntoView({ behavior: 'smooth', block: 'start' })

    setTimeout(() => { isScrollingToRef.current = false }, 800)
  }, [])

  if (!vendor) return <Navigate to="/" replace />

  return (
    <motion.div
      className="relative h-full bg-white page-container"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* ── Simple header: back + logo + name ── */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-border flex items-center gap-3 px-4 transition-shadow"
        style={{
          height: HEADER_H,
          boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low transition-colors shrink-0"
        >
          <ArrowLeft size={20} className="text-txt-primary" />
        </button>

        <div
          className="w-8 h-8 rounded-full overflow-hidden bg-surface-low flex items-center justify-center shrink-0"
          style={{ border: `2px solid ${vendor.color}30` }}
        >
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="w-5 h-5 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-txt-primary font-display truncate">
            {vendor.name}
          </p>
          {vendor.subtitle && (
            <p className="text-[10px] text-txt-tertiary leading-tight truncate">
              {vendor.subtitle}
            </p>
          )}
        </div>

        <span className="px-3 py-1 rounded-pill text-[10px] font-semibold bg-brand-subtle text-brand-text shrink-0">
          Mesa 12
        </span>
      </header>

      <main
        ref={mainRef}
        className="overflow-y-auto relative"
        style={{
          height: `calc(100% - ${HEADER_H}px)`,
          paddingBottom: 'var(--bottom-bar-height)',
        }}
      >
        <CategoryNav
          categories={vendorCategories}
          activeCategory={activeCategory}
          onCategoryChange={scrollToCategory}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
          scrolled={scrolled}
          stickyTop={0}
        />

        {vendorSuggestions.length > 0 && (
          <SuggestionSection items={vendorSuggestions} />
        )}

        <ProductList
          categories={vendorCategories}
          items={vendorItems}
          stickyOffset={CAT_NAV_H}
          activeSubcategory={activeSubcategory}
        />
      </main>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <BottomBar
          itemCount={itemCount}
          totalCents={totalCents}
          onViewOrder={() => setCartSheetOpen(true)}
        />
      </div>

      <CartSheet isOpen={cartSheetOpen} onClose={() => setCartSheetOpen(false)} />
      <FlyingCartItem image={flyingImage} onComplete={handleFlyComplete} />
    </motion.div>
  )
}
