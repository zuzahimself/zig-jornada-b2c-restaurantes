import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { mockTableOrders as initialOrders, getTableTotal } from '../data/mockTableData'
import type { OrderItemStatus, TableOrder } from '../types'

export type TableStatus = 'open' | 'partially_paid' | 'fully_paid'

const STORAGE_KEY = 'zig-mock-settings'

interface MockContextValue {
  tableStatus: TableStatus
  setTableStatus: (s: TableStatus) => void
  paidAmount: number
  setPaidAmount: (v: number) => void
  tableOrders: TableOrder[]
  addOrder: (order: TableOrder) => void
  advanceOrderStatus: () => void
  resetOrders: () => void
  giftbackBalance: number
  setGiftbackBalance: (v: number) => void
  cashbackRate: number
  recordPayment: (amount: number) => void
  isMultiVendor: boolean
  setMultiVendor: (v: boolean) => void
  isLoggedIn: boolean
  setLoggedIn: (v: boolean) => void
}

const MockContext = createContext<MockContextValue | null>(null)

function loadDefaults(): { tableStatus: TableStatus; paidAmount: number; giftbackBalance: number; isMultiVendor: boolean; isLoggedIn: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { tableStatus: 'open', paidAmount: 0, giftbackBalance: 1250, isMultiVendor: false, isLoggedIn: true, ...parsed }
    }
  } catch { /* ignore */ }
  return { tableStatus: 'open', paidAmount: 0, giftbackBalance: 1250, isMultiVendor: false, isLoggedIn: true }
}

export function MockProvider({ children }: { children: ReactNode }) {
  const defaults = loadDefaults()
  const [tableStatus, setTableStatusState] = useState<TableStatus>(defaults.tableStatus)
  const [paidAmount, setPaidAmountState] = useState(defaults.paidAmount)
  const [tableOrders, setTableOrders] = useState<TableOrder[]>(initialOrders)
  const [giftbackBalance, setGiftbackBalanceState] = useState(defaults.giftbackBalance)
  const [isMultiVendor, setMultiVendorState] = useState(defaults.isMultiVendor)
  const [isLoggedIn, setLoggedInState] = useState(defaults.isLoggedIn)
  const cashbackRate = 0.05

  const persistAll = useCallback((vals: Record<string, unknown>) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...vals }))
    } catch { /* ignore */ }
  }, [])

  const persist = useCallback((status: TableStatus, paid: number) => {
    persistAll({ tableStatus: status, paidAmount: paid })
  }, [persistAll])

  const setTableStatus = useCallback((s: TableStatus) => {
    setTableStatusState(s)
    const paid = s === 'open' ? 0 : s === 'partially_paid' ? 5180 : 99999
    setPaidAmountState(paid)
    persist(s, paid)
  }, [persist])

  const setPaidAmount = useCallback((v: number) => {
    setPaidAmountState(v)
    persist(tableStatus, v)
  }, [tableStatus, persist])

  const addOrder = useCallback((order: TableOrder) => {
    setTableOrders((prev) => [...prev, order])
    // Reopen table if it was closed
    setTableStatusState('open')
    setPaidAmountState(0)
    persist('open', 0)
  }, [persist])

  const NEXT_STATUS: Record<OrderItemStatus, OrderItemStatus> = {
    preparing: 'ready',
    ready: 'delivered',
    delivered: 'delivered',
  }

  const resetOrders = useCallback(() => {
    setTableOrders([])
    setTableStatusState('open')
    setPaidAmountState(0)
    persist('open', 0)
  }, [persist])

  const setGiftbackBalance = useCallback((v: number) => {
    setGiftbackBalanceState(v)
    persistAll({ giftbackBalance: v })
  }, [persistAll])

  const setMultiVendor = useCallback((v: boolean) => {
    setMultiVendorState(v)
    persistAll({ isMultiVendor: v })
  }, [persistAll])

  const setLoggedIn = useCallback((v: boolean) => {
    setLoggedInState(v)
    persistAll({ isLoggedIn: v })
  }, [persistAll])

  const recordPayment = useCallback((amount: number) => {
    setPaidAmountState((prev) => {
      const newPaid = prev + amount
      const sub = getTableTotal(tableOrders)
      const svc = Math.round(sub * 0.1)
      const total = sub + svc
      const newStatus: TableStatus = newPaid >= total ? 'fully_paid' : 'partially_paid'
      setTableStatusState(newStatus)
      persistAll({ tableStatus: newStatus, paidAmount: newPaid })
      return newPaid
    })
  }, [tableOrders, persistAll])

  const advanceOrderStatus = useCallback(() => {
    setTableOrders((prev) =>
      prev.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          status: NEXT_STATUS[item.status],
        })),
      }))
    )
  }, [])

  return (
    <MockContext.Provider value={{ tableStatus, setTableStatus, paidAmount, setPaidAmount, tableOrders, addOrder, advanceOrderStatus, resetOrders, giftbackBalance, setGiftbackBalance, cashbackRate, recordPayment, isMultiVendor, setMultiVendor, isLoggedIn, setLoggedIn }}>
      {children}
    </MockContext.Provider>
  )
}

export function useMock() {
  const ctx = useContext(MockContext)
  if (!ctx) throw new Error('useMock must be used inside MockProvider')
  return ctx
}

export { getTableTotal }
