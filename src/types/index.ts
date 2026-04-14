export interface MenuItem {
  id: string
  name: string
  description: string
  /** Price in cents */
  price: number
  image: string
  categoryId: string
  subcategoryId?: string
  /** Vendor that provides this item (multi-vendor / food hall mode) */
  vendorId?: string
  isPromo?: boolean
  discountPercent?: number
  badge?: string
  nutrition?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  allergens?: string[]
  customizations?: CustomizationGroup[]
}

export interface CustomizationOption {
  id: string
  name: string
  /** Price modifier in cents (0 = no extra charge) */
  priceModifier: number
}

export interface CustomizationGroup {
  id: string
  name: string
  required: boolean
  /** radio = single selection, checkbox = multiple */
  type: 'radio' | 'checkbox'
  /** Max selections for checkbox groups */
  maxSelections?: number
  options: CustomizationOption[]
}

export interface Category {
  id: string
  name: string
  emoji?: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
}

export interface BannerItem {
  id: string
  image: string
  label: string
  badge: string
}

export interface Vendor {
  id: string
  name: string
  logo: string
  /** Brand accent color for the vendor */
  color: string
  subtitle?: string
}

export interface CartItem {
  item: MenuItem
  quantity: number
  selectedCustomizations?: Record<string, string[]>
}

export interface BrandPreset {
  name: string
  hex: string
}

export interface User {
  name: string
  cpf?: string
  phone?: string
}

export type OrderItemStatus = 'preparing' | 'ready' | 'delivered'

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  customizations?: Record<string, string[]>
  status: OrderItemStatus
}

export interface TableOrder {
  id: string
  userName: string
  userCpf?: string
  items: OrderItem[]
  createdAt: string
}
