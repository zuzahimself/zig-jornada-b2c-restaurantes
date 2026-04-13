import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { MenuDrawer } from '../components/MenuDrawer'
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
import { useBrand } from '../context/BrandContext'

/** How many pixels of scroll the hero→card morph takes */
const MORPH_SCROLL = 500
const AUTO_PLAY_MS = 4000
const NORMAL_SCROLL_THRESHOLD = 260

export function MenuHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { totalCents, itemCount, openCartAfterAdd, setOpenCartAfterAdd, lastAddedImage, clearLastAdded } = useCart()
  const { scale } = useBrand()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [flyingImage, setFlyingImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('destaques')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [morphComplete, setMorphComplete] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(96)
  const mainRef = useRef<HTMLElement>(null)

  // ── Session flag: hero only shows on first visit ──────────────────────
  const [heroSeen] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('hero-seen') === '1',
  )

  // Mark hero as seen once morph completes
  useEffect(() => {
    if (morphComplete && !heroSeen) {
      sessionStorage.setItem('hero-seen', '1')
    }
  }, [morphComplete, heroSeen])

  // ── Carousel state ────────────────────────────────────────────────────
  const [activeBanner, setActiveBanner] = useState(0)

  const shouldAutoPlay = heroSeen || morphComplete
  useEffect(() => {
    if (!shouldAutoPlay) return
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % bannerItems.length)
    }, AUTO_PLAY_MS)
    return () => clearInterval(timer)
  }, [shouldAutoPlay, activeBanner])

  // Capture viewport height once
  const [viewportH] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )

  // ── Scroll-driven morph (only used when hero is active) ────────────────
  const { scrollY } = useScroll({ container: mainRef as React.RefObject<HTMLElement> })

  const contentWidth = Math.min(430, typeof window !== 'undefined' ? window.innerWidth : 430)
  const cardPadX = 16
  const cardTopGap = 8
  const cardBottomGap = 28
  const cardWidth = contentWidth - cardPadX * 2
  const cardHeight = cardWidth / (16 / 9)
  const finalBannerH = headerHeight + cardTopGap + cardHeight + cardBottomGap
  const wrapperHeight = MORPH_SCROLL + finalBannerH

  const bannerH = useTransform(scrollY, [0, MORPH_SCROLL], [viewportH, finalBannerH])
  const bannerPadTop = useTransform(scrollY, [0, MORPH_SCROLL], [0, headerHeight + cardTopGap])
  const bannerPadX_ = useTransform(scrollY, [0, MORPH_SCROLL], [0, cardPadX])
  const bannerRadius = useTransform(scrollY, [0, MORPH_SCROLL], [0, 16])
  const gradientOpacity = useTransform(scrollY, [0, MORPH_SCROLL * 0.4], [1, 0])
  const heroImgOpacity = useTransform(scrollY, [MORPH_SCROLL * 0.3, MORPH_SCROLL * 0.7], [1, 0])
  const cardLayerOpacity = useTransform(scrollY, [MORPH_SCROLL * 0.3, MORPH_SCROLL * 0.7], [0, 1])
  const bottomBarY = useTransform(scrollY, [MORPH_SCROLL * 0.5, MORPH_SCROLL], [80, 0])
  const dotsOpacity = useTransform(scrollY, [MORPH_SCROLL * 0.7, MORPH_SCROLL], [0, 1])

  // ── Cart / navigation effects (unchanged) ──────────────────────────────

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
    setTimeout(() => setShowUpsell(true), 150)
  }, [])

  const onHeaderHeight = useCallback((h: number) => setHeaderHeight(h), [])

  // Scroll detection — different thresholds for hero vs normal
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => {
      const st = el.scrollTop
      if (heroSeen) {
        setScrolled(st > NORMAL_SCROLL_THRESHOLD)
      } else {
        setScrolled(st > MORPH_SCROLL * 0.4)
        setMorphComplete(st > MORPH_SCROLL * 0.8)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [heroSeen])

  // ── Shared carousel slide JSX ──────────────────────────────────────────

  const currentBanner = bannerItems[activeBanner]

  const carouselContent = (
    <>
      <AnimatePresence initial={false}>
        <motion.img
          key={activeBanner}
          src={currentBanner.image}
          alt={currentBanner.label}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          draggable={false}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
          key={`badge-${activeBanner}`}
          className="absolute top-3 right-3 glass-badge rounded-pill px-3 py-1 text-white text-xs font-semibold pointer-events-none"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          {currentBanner.badge}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${activeBanner}`}
          className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl leading-tight font-display pointer-events-none"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        >
          {currentBanner.label}
        </motion.div>
      </AnimatePresence>
    </>
  )

  const paginationDots = (
    <div className="flex items-center justify-center gap-1.5 mt-3">
      {bannerItems.map((_, i) => (
        <button
          key={i}
          aria-label={`Slide ${i + 1}`}
          onClick={() => setActiveBanner(i)}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: i === activeBanner ? 'var(--color-brand-fill)' : '#ececee',
            width: i === activeBanner ? 16 : 6,
          }}
        />
      ))}
    </div>
  )

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="relative h-full bg-white"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        ref={mainRef}
        className="h-full overflow-y-auto relative"
        style={{ paddingBottom: 'var(--bottom-bar-height)' }}
      >
        {/* ── Header ── */}
        <Header
          onMenuOpen={() => setMenuOpen(true)}
          tableNumber={12}
          scrolled={scrolled}
          heroMode={!heroSeen}
          onHeightChange={onHeaderHeight}
        />

        {!heroSeen ? (
          /* ── HERO MODE: morph zone ── */
          <div style={{ marginTop: -headerHeight, height: wrapperHeight }}>
            <motion.div
              className="sticky top-0 z-40 will-change-transform flex flex-col"
              style={{
                height: bannerH,
                paddingTop: bannerPadTop,
                paddingLeft: bannerPadX_,
                paddingRight: bannerPadX_,
              }}
            >
              <motion.div
                className="flex-1 min-h-0 overflow-hidden relative"
                style={{ borderRadius: bannerRadius }}
              >
                {/* Hero image (fades out) */}
                <motion.img
                  src="/herolanding.png"
                  alt="Promoção Mana"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: heroImgOpacity }}
                  draggable={false}
                />

                {/* Carousel layer (fades in) */}
                <motion.div
                  className="absolute inset-0"
                  style={{ opacity: cardLayerOpacity }}
                >
                  {carouselContent}
                </motion.div>

                {/* Hero gradients (fade out) */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity: gradientOpacity }}
                >
                  <div
                    className="absolute top-0 inset-x-0 h-36"
                    style={{ background: `linear-gradient(to bottom, ${scale[800]}, transparent)` }}
                  />
                  <div
                    className="absolute bottom-0 inset-x-0 h-[280px]"
                    style={{ background: 'linear-gradient(to top, white 6%, rgba(185,206,218,0) 75%)' }}
                  />
                </motion.div>
              </motion.div>

              {/* Dots (appear after morph) */}
              <motion.div
                className="flex items-center justify-center gap-1.5 pt-3"
                style={{ opacity: dotsOpacity }}
              >
                {bannerItems.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setActiveBanner(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === activeBanner ? 'var(--color-brand-fill)' : '#ececee',
                      width: i === activeBanner ? 16 : 6,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        ) : (
          /* ── NORMAL MODE: simple carousel card ── */
          <div className="relative select-none px-4 pt-2 pb-4">
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: '16/9' }}
            >
              {carouselContent}
            </div>
            {paginationDots}
          </div>
        )}

        {/* ── Content (shared) ── */}
        <div className="relative">
          <div className="relative z-10">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onCategoryChange={setActiveCategory}
              onSubcategoryChange={setActiveSubcategory}
              scrolled={scrolled}
              stickyTop={headerHeight}
            />

            {activeCategory === 'destaques' && (
              <SuggestionSection items={suggestionItems} />
            )}

            <ProductList
              categories={categories}
              items={menuItems}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
            />
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      {heroSeen ? (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <BottomBar
            itemCount={itemCount}
            totalCents={totalCents}
            onViewOrder={() => setCartSheetOpen(true)}
          />
        </div>
      ) : (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-50"
          style={{ y: bottomBarY }}
        >
          <BottomBar
            itemCount={itemCount}
            totalCents={totalCents}
            onViewOrder={() => setCartSheetOpen(true)}
          />
        </motion.div>
      )}

      <CartSheet isOpen={cartSheetOpen} onClose={() => setCartSheetOpen(false)} />
      <FlyingCartItem image={flyingImage} onComplete={handleFlyComplete} />
      <UpsellSheet
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onViewCart={() => {
          setShowUpsell(false)
          setTimeout(() => setCartSheetOpen(true), 200)
        }}
      />
      <WelcomeBanner />
    </motion.div>
  )
}
