import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { MenuDrawer } from '../components/MenuDrawer'
import { BannerCarousel } from '../components/BannerCarousel'
import { CategoryNav } from '../components/CategoryNav'
import { SuggestionSection } from '../components/SuggestionSection'
import { ProductList } from '../components/ProductList'
import { BottomBar } from '../components/BottomBar'
import { CartSheet } from '../components/CartSheet'
import { FlyingCartItem } from '../components/FlyingCartItem'
import { UpsellSheet } from '../components/UpsellSheet'
import { WelcomeBanner } from '../components/WelcomeBanner'
import { bannerItems, categories, menuItems, suggestionItems } from '../data/menuData'
import { useCart } from '../context/CartContext'

const SCROLL_THRESHOLD = 260

export function MenuHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { totalCents, itemCount, openCartAfterAdd, setOpenCartAfterAdd, lastAddedImage, clearLastAdded } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [flyingImage, setFlyingImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('destaques')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const mainRef = useRef<HTMLElement>(null)

  // Detect when returning from ProductDetail after adding an item
  useEffect(() => {
    if (lastAddedImage) {
      // Small delay to let page render, then start flying animation
      const t = setTimeout(() => {
        setFlyingImage(lastAddedImage)
        clearLastAdded()
      }, 100)
      return () => clearTimeout(t)
    }
  }, [lastAddedImage, clearLastAdded])

  // Open cart sheet when returning from upsell "Ver meu pedido"
  useEffect(() => {
    if (openCartAfterAdd) {
      setOpenCartAfterAdd(false)
      const t = setTimeout(() => setCartSheetOpen(true), 200)
      return () => clearTimeout(t)
    }
  }, [openCartAfterAdd, setOpenCartAfterAdd])

  // Open cart sheet when returning from login with ?openCart=1
  useEffect(() => {
    if (searchParams.get('openCart')) {
      searchParams.delete('openCart')
      setSearchParams(searchParams, { replace: true })
      const t = setTimeout(() => setCartSheetOpen(true), 200)
      return () => clearTimeout(t)
    }
  }, [searchParams, setSearchParams])

  const handleFlyComplete = useCallback(() => {
    setFlyingImage(null)
    // Show upsell after the item lands
    setTimeout(() => setShowUpsell(true), 150)
  }, [])

  const onHeaderHeight = useCallback((h: number) => setHeaderHeight(h), [])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    function onScroll() {
      setScrolled(el!.scrollTop > SCROLL_THRESHOLD)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      className="flex flex-col h-full bg-white"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Menu drawer */}
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Scrollable content — header lives inside so the gradient covers it */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto relative"
        style={{ paddingBottom: 'var(--bottom-bar-height)' }}
      >
        {/* Top gradient: brand-200 → white */}
        <div
          className="absolute top-0 left-0 right-0 h-[420px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to bottom, var(--color-brand-200), #ffffff)',
          }}
        />

        {/* Sticky header — inside scroll container, over gradient */}
        <Header
          onMenuOpen={() => setMenuOpen(true)}
          tableNumber={12}
          scrolled={scrolled}
          onHeightChange={onHeaderHeight}
        />

        {/* Content over gradient */}
        <div className="relative z-10">
          {/* Banner carousel */}
          <BannerCarousel items={bannerItems} />

          {/* Category navigation (sticky below header) */}
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            onCategoryChange={setActiveCategory}
            onSubcategoryChange={setActiveSubcategory}
            scrolled={scrolled}
            stickyTop={headerHeight}
          />

          {/* Sugestão do dia — only shown on Destaques */}
          {activeCategory === 'destaques' && (
            <SuggestionSection items={suggestionItems} />
          )}

          {/* Product list */}
          <ProductList
            categories={categories}
            items={menuItems}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
          />
        </div>
      </main>

      {/* Sticky bottom bar */}
      <BottomBar
        itemCount={itemCount}
        totalCents={totalCents}
        onViewOrder={() => setCartSheetOpen(true)}
      />

      {/* Cart bottom sheet */}
      <CartSheet isOpen={cartSheetOpen} onClose={() => setCartSheetOpen(false)} />

      {/* Flying item animation */}
      <FlyingCartItem image={flyingImage} onComplete={handleFlyComplete} />

      {/* Upsell sheet */}
      <UpsellSheet
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onViewCart={() => {
          setShowUpsell(false)
          setTimeout(() => setCartSheetOpen(true), 200)
        }}
      />
      {/* Welcome banner for unauthenticated users */}
      <WelcomeBanner />
    </motion.div>
  )
}
