import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  applyBrandToDOM,
  generateBrandScale,
  getSemanticTokens,
  getTextOnBackground,
  type BrandScale,
  type SemanticTokens,
} from '../lib/colorSystem'
import type { BrandPreset } from '../types'

const DEFAULT_BRAND = '#446A81' // Mana

export const BRAND_PRESETS: BrandPreset[] = [
  { name: 'Mana Azul', hex: '#446A81' },
  { name: 'Ocean Blue', hex: '#1565C0' },
  { name: 'Vinho', hex: '#7B1F3A' },
  { name: 'Laranja', hex: '#D4500A' },
  { name: 'Roxo', hex: '#5E35B1' },
]

interface BrandContextValue {
  brandHex: string
  setBrand: (hex: string) => void
  scale: BrandScale
  tokens: SemanticTokens
  /** Text colour for use on --color-brand-fill backgrounds */
  textOnBrand: string
}

const BrandContext = createContext<BrandContextValue | null>(null)

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandHex, setBrandHex] = useState(DEFAULT_BRAND)
  const [scale, setScale] = useState(() => generateBrandScale(DEFAULT_BRAND))
  const [tokens, setTokens] = useState(() =>
    getSemanticTokens(generateBrandScale(DEFAULT_BRAND))
  )

  const textOnBrand = getTextOnBackground(tokens['--color-brand-fill'], scale[900])

  function setBrand(hex: string) {
    const trimmed = hex.trim()
    if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return
    const newScale = generateBrandScale(trimmed)
    const newTokens = getSemanticTokens(newScale)
    setBrandHex(trimmed)
    setScale(newScale)
    setTokens(newTokens)
    applyBrandToDOM(trimmed)
  }

  // Apply on mount
  useEffect(() => {
    applyBrandToDOM(DEFAULT_BRAND)
  }, [])

  return (
    <BrandContext.Provider value={{ brandHex, setBrand, scale, tokens, textOnBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const ctx = useContext(BrandContext)
  if (!ctx) throw new Error('useBrand must be used inside BrandProvider')
  return ctx
}
