import type { BannerItem, Category, MenuItem } from '../types'

// ─── Unsplash image helpers ───────────────────────────────────────────────────

const unsplash = (id: string, w = 700) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`

// ─── Banner items ─────────────────────────────────────────────────────────────

export const bannerItems: BannerItem[] = [
  {
    id: 'b1',
    image: unsplash('photo-1568901346375-23c9450c58cd'),
    label: 'Gratinado Especial',
    badge: '🔥 Mais pedido',
  },
  {
    id: 'b2',
    image: unsplash('photo-9594-58d7cb561ad1'),
    label: 'Bowl de Açaí Premium',
    badge: '⭐ Destaque',
  },
  {
    id: 'b3',
    image: unsplash('photo-1512621776951-a57141f2eefd'),
    label: 'Salada Mana Fresh',
    badge: '🌿 Fit & Saudável',
  },
  {
    id: 'b4',
    image: unsplash('photo-1490645935967-10de6ba17061'),
    label: 'Prato Fit do Chef',
    badge: '💪 Low Carb',
  },
  {
    id: 'b5',
    image: unsplash('photo-1565299624946-b28f40a0ae38'),
    label: 'Mana Burger',
    badge: '🍔 Novo',
  },
]

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: 'destaques',
    name: 'Destaques',
    subcategories: [],
  },
  {
    id: 'acai-smoothie',
    name: 'Açaí · Smoothie',
    subcategories: [
      { id: 'acai-tradicional', name: 'Tradicional' },
      { id: 'acai-premium', name: 'Premium' },
      { id: 'smoothie', name: 'Smoothies' },
    ],
  },
  {
    id: 'cafe-manha',
    name: 'Café da Manhã',
    subcategories: [
      { id: 'tapioca', name: 'Tapioca' },
      { id: 'pao-na-chapa', name: 'Pão na Chapa' },
      { id: 'frutas', name: 'Frutas' },
    ],
  },
  {
    id: 'pratos',
    name: 'Pratos',
    subcategories: [
      { id: 'fit', name: 'Fit' },
      { id: 'gratinados', name: 'Gratinados' },
      { id: 'massas', name: 'Massas' },
    ],
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    subcategories: [
      { id: 'sucos', name: 'Sucos' },
      { id: 'refrigerantes', name: 'Refrigerantes' },
      { id: 'agua', name: 'Água' },
    ],
  },
]

// ─── Menu items ───────────────────────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  // DESTAQUES
  {
    id: 'g1',
    name: 'Gratinado Mana',
    description: 'Frango desfiado, catupiry, milho e parmesão gratinado. Acompanha arroz, feijão e salada.',
    price: 3490,
    image: unsplash('photo-1568901346375-23c9450c58cd', 400),
    categoryId: 'destaques',
    isPromo: true,
    discountPercent: 15,
    badge: '15% OFF',
    nutrition: { calories: 520, protein: 34, carbs: 48, fat: 22 },
    allergens: ['Glúten', 'Lactose'],
  },
  {
    id: 'f1',
    name: 'Prato Fit do Chef',
    description: 'Filé de frango grelhado, legumes salteados, quinoa e molho de iogurte com ervas.',
    price: 3290,
    image: unsplash('photo-1490645935967-10de6ba17061', 400),
    categoryId: 'destaques',
    nutrition: { calories: 380, protein: 42, carbs: 28, fat: 12 },
  },
  {
    id: 's1',
    name: 'Sanduíche Mana',
    description: 'Pão artesanal, hambúrguer de 180g, queijo, alface, tomate e molho especial da casa.',
    price: 2890,
    image: unsplash('photo-1565299624946-b28f40a0ae38', 400),
    categoryId: 'destaques',
    nutrition: { calories: 680, protein: 38, carbs: 52, fat: 32 },
    allergens: ['Glúten', 'Lactose', 'Ovo'],
  },
  // AÇAÍ · SMOOTHIE
  {
    id: 'a1',
    name: 'Bowl de Açaí Premium',
    description: 'Açaí cremoso com granola artesanal, banana, morango, mel e leite condensado.',
    price: 2490,
    image: unsplash('photo-9594-58d7cb561ad1', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-premium',
    badge: 'Popular',
    nutrition: { calories: 420, protein: 6, carbs: 72, fat: 14 },
    allergens: ['Lactose'],
  },
  {
    id: 'a2',
    name: 'Açaí Tradicional 500ml',
    description: 'Açaí puro da Amazônia com granola e banana. Sem adição de açúcar.',
    price: 1890,
    image: unsplash('photo-9594-58d7cb561ad1', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-tradicional',
  },
  {
    id: 'sm1',
    name: 'Smoothie Verde Detox',
    description: 'Espinafre, kale, maçã verde, gengibre, limão e água de coco. 100% natural.',
    price: 1690,
    image: unsplash('photo-1600271886742-f049cd451bba', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'smoothie',
    isPromo: true,
    discountPercent: 10,
    badge: '10% OFF',
  },
  {
    id: 'sm2',
    name: 'Smoothie de Morango',
    description: 'Morango fresco, iogurte grego, mel e chia. Rico em proteína e antioxidantes.',
    price: 1590,
    image: unsplash('photo-1600271886742-f049cd451bba', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'smoothie',
  },
  // CAFÉ DA MANHÃ
  {
    id: 'tp1',
    name: 'Tapioca Nordestina',
    description: 'Tapioca com queijo coalho, manteiga de garrafa e mel de engenho. Sabor autêntico da Bahia.',
    price: 1490,
    image: unsplash('photo-1484723091739-30a097e8f929', 400),
    categoryId: 'cafe-manha',
    subcategoryId: 'tapioca',
  },
  {
    id: 'tp2',
    name: 'Tapioca Frango com Catupiry',
    description: 'Frango desfiado temperado, cream cheese catupiry e orégano fresquinho.',
    price: 1790,
    image: unsplash('photo-1484723091739-30a097e8f929', 400),
    categoryId: 'cafe-manha',
    subcategoryId: 'tapioca',
  },
  // PRATOS
  {
    id: 'p1',
    name: 'Salada Mana Fresh',
    description: 'Folhas verdes, grão-de-bico, cenoura ralada, tomate cereja, pepino e vinagrete cítrico.',
    price: 2190,
    image: unsplash('photo-1512621776951-a57141f2eefd', 400),
    categoryId: 'pratos',
    subcategoryId: 'fit',
  },
  {
    id: 'p2',
    name: 'Frango Grelhado Low Carb',
    description: 'Peito de frango grelhado com azeite, alecrim e alho. Acompanha mix de legumes e purê de abóbora.',
    price: 3190,
    image: unsplash('photo-1490645935967-10de6ba17061', 400),
    categoryId: 'pratos',
    subcategoryId: 'fit',
  },
  {
    id: 'p3',
    name: 'Gratinado de Legumes',
    description: 'Abobrinha, berinjela, tomate e parmesão gratinado ao forno. Vegetariano.',
    price: 2790,
    image: unsplash('photo-1568901346375-23c9450c58cd', 400),
    categoryId: 'pratos',
    subcategoryId: 'gratinados',
    isPromo: true,
    discountPercent: 20,
    badge: '20% OFF',
  },
  // MONTÁVEIS
  {
    id: 'bowl1',
    name: 'Monte seu Bowl',
    description: 'Escolha a base, o tamanho e os toppings do seu jeito. Feito na hora pra você.',
    price: 1890,
    image: unsplash('photo-9594-58d7cb561ad1', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-premium',
    badge: '🎨 Monte',
    customizations: [
      {
        id: 'base',
        name: 'Escolha a base',
        required: true,
        type: 'radio',
        options: [
          { id: 'acai', name: 'Açaí', priceModifier: 0 },
          { id: 'pitaya', name: 'Pitaya', priceModifier: 0 },
          { id: 'iogurte', name: 'Iogurte natural', priceModifier: 0 },
        ],
      },
      {
        id: 'tamanho',
        name: 'Tamanho',
        required: true,
        type: 'radio',
        options: [
          { id: '300ml', name: '300ml', priceModifier: 0 },
          { id: '500ml', name: '500ml', priceModifier: 400 },
          { id: '700ml', name: '700ml', priceModifier: 800 },
        ],
      },
      {
        id: 'toppings',
        name: 'Toppings',
        required: false,
        type: 'checkbox',
        maxSelections: 4,
        options: [
          { id: 'granola', name: 'Granola', priceModifier: 0 },
          { id: 'banana', name: 'Banana', priceModifier: 0 },
          { id: 'morango', name: 'Morango', priceModifier: 0 },
          { id: 'mel', name: 'Mel', priceModifier: 0 },
          { id: 'leite-condensado', name: 'Leite condensado', priceModifier: 200 },
          { id: 'pacoca', name: 'Paçoca', priceModifier: 150 },
        ],
      },
    ],
  },
  {
    id: 'custom-sand',
    name: 'Sanduíche Custom',
    description: 'Monte o sanduíche perfeito: escolha a proteína, o ponto e os extras.',
    price: 2890,
    image: unsplash('photo-1565299624946-b28f40a0ae38', 400),
    categoryId: 'destaques',
    badge: '🎨 Monte',
    nutrition: { calories: 620, protein: 35, carbs: 48, fat: 28 },
    allergens: ['Glúten'],
    customizations: [
      {
        id: 'proteina',
        name: 'Proteína',
        required: true,
        type: 'radio',
        options: [
          { id: 'frango', name: 'Frango grelhado', priceModifier: 0 },
          { id: 'carne', name: 'Carne bovina 180g', priceModifier: 300 },
          { id: 'vegano', name: 'Hambúrguer vegano', priceModifier: 0 },
        ],
      },
      {
        id: 'ponto',
        name: 'Ponto da carne',
        required: true,
        type: 'radio',
        options: [
          { id: 'mal-passado', name: 'Mal passado', priceModifier: 0 },
          { id: 'ao-ponto', name: 'Ao ponto', priceModifier: 0 },
          { id: 'bem-passado', name: 'Bem passado', priceModifier: 0 },
        ],
      },
      {
        id: 'extras',
        name: 'Extras',
        required: false,
        type: 'checkbox',
        maxSelections: 3,
        options: [
          { id: 'bacon', name: 'Bacon crocante', priceModifier: 400 },
          { id: 'ovo', name: 'Ovo frito', priceModifier: 200 },
          { id: 'cheddar', name: 'Cheddar', priceModifier: 300 },
          { id: 'cebola', name: 'Cebola caramelizada', priceModifier: 250 },
        ],
      },
    ],
  },
]

// ─── Suggestion items (subset of menu) ───────────────────────────────────────

export const suggestionItems: MenuItem[] = menuItems.filter((i) =>
  ['g1', 'a1', 'sm1', 'tp1', 'bowl1'].includes(i.id)
)
