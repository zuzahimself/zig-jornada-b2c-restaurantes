import type { BannerItem, Category, MenuItem, Vendor } from '../types'

// ─── Unsplash image helpers ───────────────────────────────────────────────────

const unsplash = (id: string, w = 700) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`

// ─── Banner items ─────────────────────────────────────────────────────────────

export const bannerItems: BannerItem[] = [
  {
    id: 'b1',
    image: '/banner.png',
    label: 'Bowl de Açaí Premium',
    badge: '⭐ Destaque',
  },
  {
    id: 'b2',
    image: unsplash('photo-1568901346375-23c9450c58cd'),
    label: 'Gratinado Especial',
    badge: '🔥 Mais pedido',
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

// ─── Vendors (multi-vendor / food hall mode) ─────────────────────────────────

export const vendors: Vendor[] = [
  { id: 'mana', name: 'Mana', logo: '/logo-mana.png', color: '#446A81', subtitle: 'Cozinha autoral baiana' },
  { id: 'acaibar', name: 'AcaíBar', logo: '/acaibar-logo.png', color: '#5B2D8E', subtitle: 'Açaí, smoothies & bowls' },
  { id: 'cafedabarra', name: 'Café da Barra', logo: '/cafedabarra-logo.png', color: '#8B5E3C', subtitle: 'Café especial & manhã' },
  { id: 'grelhadosdoporto', name: 'Grelhados do Porto', logo: '/grelhadosdoporto-logo.png', color: '#C44A2B', subtitle: 'Carnes na brasa' },
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
    vendorId: 'mana',
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
    vendorId: 'grelhadosdoporto',
    nutrition: { calories: 380, protein: 42, carbs: 28, fat: 12 },
  },
  {
    id: 's1',
    name: 'Sanduíche Mana',
    description: 'Pão artesanal, hambúrguer de 180g, queijo, alface, tomate e molho especial da casa.',
    price: 2890,
    image: unsplash('photo-1565299624946-b28f40a0ae38', 400),
    categoryId: 'destaques',
    vendorId: 'mana',
    nutrition: { calories: 680, protein: 38, carbs: 52, fat: 32 },
    allergens: ['Glúten', 'Lactose', 'Ovo'],
  },
  // AÇAÍ · SMOOTHIE
  {
    id: 'a1',
    name: 'Bowl de Açaí Premium',
    description: 'Açaí cremoso com granola artesanal, banana, morango, mel e leite condensado.',
    price: 2490,
    image: '/banner.png',
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-premium',
    vendorId: 'acaibar',
    badge: 'Popular',
    nutrition: { calories: 420, protein: 6, carbs: 72, fat: 14 },
    allergens: ['Lactose'],
  },
  {
    id: 'a2',
    name: 'Açaí Tradicional 500ml',
    description: 'Açaí puro da Amazônia com granola e banana. Sem adição de açúcar.',
    price: 1890,
    image: '/banner.png',
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-tradicional',
    vendorId: 'acaibar',
  },
  {
    id: 'sm1',
    name: 'Smoothie Verde Detox',
    description: 'Espinafre, kale, maçã verde, gengibre, limão e água de coco. 100% natural.',
    price: 1690,
    image: unsplash('photo-1600271886742-f049cd451bba', 400),
    categoryId: 'acai-smoothie',
    subcategoryId: 'smoothie',
    vendorId: 'acaibar',
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
    vendorId: 'acaibar',
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
    vendorId: 'cafedabarra',
  },
  {
    id: 'tp2',
    name: 'Tapioca Frango com Catupiry',
    description: 'Frango desfiado temperado, cream cheese catupiry e orégano fresquinho.',
    price: 1790,
    image: unsplash('photo-1484723091739-30a097e8f929', 400),
    categoryId: 'cafe-manha',
    subcategoryId: 'tapioca',
    vendorId: 'cafedabarra',
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
    vendorId: 'mana',
  },
  {
    id: 'p2',
    name: 'Frango Grelhado Low Carb',
    description: 'Peito de frango grelhado com azeite, alecrim e alho. Acompanha mix de legumes e purê de abóbora.',
    price: 3190,
    image: unsplash('photo-1490645935967-10de6ba17061', 400),
    categoryId: 'pratos',
    subcategoryId: 'fit',
    vendorId: 'grelhadosdoporto',
  },
  {
    id: 'p3',
    name: 'Gratinado de Legumes',
    description: 'Abobrinha, berinjela, tomate e parmesão gratinado ao forno. Vegetariano.',
    price: 2790,
    image: unsplash('photo-1568901346375-23c9450c58cd', 400),
    categoryId: 'pratos',
    subcategoryId: 'gratinados',
    vendorId: 'mana',
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
    image: '/banner.png',
    categoryId: 'acai-smoothie',
    subcategoryId: 'acai-premium',
    vendorId: 'acaibar',
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
    vendorId: 'mana',
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
  // CAFÉ DA BARRA — café da manhã + bebidas
  {
    id: 'cb1',
    name: 'Cappuccino Artesanal',
    description: 'Espresso duplo com leite vaporizado e canela. Grãos torrados na Chapada Diamantina.',
    price: 1290,
    image: unsplash('photo-1572442388796-11668a67e53d', 400),
    categoryId: 'bebidas',
    subcategoryId: 'sucos',
    vendorId: 'cafedabarra',
  },
  {
    id: 'cb2',
    name: 'Pão na Chapa com Requeijão',
    description: 'Pão francês crocante na chapa com camada generosa de requeijão cremoso.',
    price: 890,
    image: unsplash('photo-1484723091739-30a097e8f929', 400),
    categoryId: 'cafe-manha',
    subcategoryId: 'pao-na-chapa',
    vendorId: 'cafedabarra',
  },
  {
    id: 'cb3',
    name: 'Bolo de Cenoura',
    description: 'Fatia generosa de bolo de cenoura fofinho com cobertura de chocolate meio amargo.',
    price: 1190,
    image: unsplash('photo-1621303837174-89787a7d4729', 400),
    categoryId: 'cafe-manha',
    subcategoryId: 'frutas',
    vendorId: 'cafedabarra',
    badge: 'Novidade',
  },
  // GRELHADOS DO PORTO — pratos + destaques
  {
    id: 'gp1',
    name: 'Picanha na Brasa 300g',
    description: 'Picanha grelhada no ponto, acompanha farofa de ovos, vinagrete e arroz branco.',
    price: 5490,
    image: unsplash('photo-1558030006-450675393462', 400),
    categoryId: 'pratos',
    subcategoryId: 'gratinados',
    vendorId: 'grelhadosdoporto',
    badge: 'Premium',
    nutrition: { calories: 720, protein: 52, carbs: 35, fat: 38 },
  },
  {
    id: 'gp2',
    name: 'Espetinho Misto',
    description: 'Três espetinhos: frango, carne e linguiça artesanal. Acompanha farofa e molho chimichurri.',
    price: 3290,
    image: unsplash('photo-1555939594-58d7cb561ad1', 400),
    categoryId: 'destaques',
    vendorId: 'grelhadosdoporto',
    isPromo: true,
    discountPercent: 10,
    badge: '10% OFF',
    nutrition: { calories: 580, protein: 44, carbs: 22, fat: 30 },
  },
  {
    id: 'gp3',
    name: 'Costela Desfiada',
    description: 'Costela bovina desfiada lentamente por 8h. Acompanha purê de mandioquinha e couve crocante.',
    price: 4290,
    image: unsplash('photo-1544025162-d76694265947', 400),
    categoryId: 'pratos',
    subcategoryId: 'gratinados',
    vendorId: 'grelhadosdoporto',
    nutrition: { calories: 650, protein: 48, carbs: 30, fat: 34 },
  },
  // BEBIDAS — distribuídas entre vendors
  {
    id: 'b-suco1',
    name: 'Suco de Laranja Natural',
    description: 'Laranja espremida na hora, sem açúcar. 400ml de pura vitamina C.',
    price: 990,
    image: unsplash('photo-1621506289937-a8e4df240d0b', 400),
    categoryId: 'bebidas',
    subcategoryId: 'sucos',
    vendorId: 'cafedabarra',
  },
  {
    id: 'b-refri1',
    name: 'Guaraná Antarctica 350ml',
    description: 'Guaraná Antarctica lata gelada.',
    price: 690,
    image: unsplash('photo-1581006852262-e4307cf6283a', 400),
    categoryId: 'bebidas',
    subcategoryId: 'refrigerantes',
    vendorId: 'mana',
  },
  {
    id: 'b-agua1',
    name: 'Água Mineral 500ml',
    description: 'Água mineral sem gás, gelada.',
    price: 490,
    image: unsplash('photo-1560023907-5f339617ea55', 400),
    categoryId: 'bebidas',
    subcategoryId: 'agua',
    vendorId: 'mana',
  },
]

// ─── Suggestion items (subset of menu) ───────────────────────────────────────

export const suggestionItems: MenuItem[] = menuItems.filter((i) =>
  ['g1', 'a1', 'sm1', 'gp2', 'cb3'].includes(i.id)
)
