import { menuItems } from './menuData'
import type { TableOrder } from '../types'

const findItem = (id: string) => menuItems.find((i) => i.id === id)!

/** Mock logged-in user's CPF — matches when user logs in with this CPF */
export const MOCK_USER_CPF = '12345678901'

export const mockTableOrders: TableOrder[] = [
  {
    id: 'order-1',
    userName: 'Você',
    userCpf: MOCK_USER_CPF,
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    items: [
      { menuItem: findItem('g1'), quantity: 1, status: 'delivered' },
      { menuItem: findItem('sm1'), quantity: 1, status: 'ready' },
    ],
  },
  {
    id: 'order-2',
    userName: 'Ana Silva',
    userCpf: '98765432100',
    createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    items: [
      { menuItem: findItem('a1'), quantity: 1, status: 'delivered' },
      { menuItem: findItem('s1'), quantity: 1, status: 'preparing' },
    ],
  },
  {
    id: 'order-3',
    userName: 'Pedro Costa',
    userCpf: '11122233344',
    createdAt: new Date(Date.now() - 15 * 60_000).toISOString(),
    items: [
      { menuItem: findItem('f1'), quantity: 1, status: 'ready' },
      { menuItem: findItem('tp1'), quantity: 2, status: 'preparing' },
    ],
  },
]

/** Total of all orders in cents */
export function getTableTotal(orders: TableOrder[]): number {
  return orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0),
    0
  )
}
