import { useMemo } from 'react'
import { UtensilsCrossed, CreditCard } from 'lucide-react'
import type { TableOrder, PaymentEntry } from '../types'
import { formatPrice } from '../lib/utils'

interface TimelineExtratoProps {
  orders: TableOrder[]
  payments: PaymentEntry[]
}

const METHOD_LABELS: Record<string, string> = {
  pix: 'Pix',
  credit: 'Crédito',
  debit: 'Débito',
}

type TimelineEvent =
  | { type: 'order'; order: TableOrder; time: Date }
  | { type: 'payment'; payment: PaymentEntry; time: Date }

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}


export function TimelineExtrato({ orders, payments }: TimelineExtratoProps) {
  const events = useMemo<TimelineEvent[]>(() => {
    const items: TimelineEvent[] = [
      ...orders.map((order) => ({
        type: 'order' as const,
        order,
        time: new Date(order.createdAt),
      })),
      ...payments.map((payment) => ({
        type: 'payment' as const,
        payment,
        time: new Date(payment.createdAt),
      })),
    ]
    items.sort((a, b) => a.time.getTime() - b.time.getTime())
    return items
  }, [orders, payments])

  if (events.length === 0) {
    return <p className="text-xs text-txt-tertiary py-2">Nenhum registro ainda</p>
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div
        className="absolute left-[9px] top-2 bottom-2 w-px"
        style={{ backgroundColor: 'var(--color-brand-border)' }}
      />

      <div className="flex flex-col gap-4">
        {events.map((event, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div
              className="absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
              style={{
                backgroundColor: event.type === 'order'
                  ? 'var(--color-brand-subtle)'
                  : 'color-mix(in srgb, var(--color-loyalty-gold) 15%, transparent)',
              }}
            >
              {event.type === 'order' ? (
                <UtensilsCrossed size={10} style={{ color: 'var(--color-brand-fill)' }} />
              ) : (
                <CreditCard size={10} style={{ color: 'var(--color-loyalty-gold)' }} />
              )}
            </div>

            {/* Content */}
            {event.type === 'order' ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-txt-tertiary">{formatTime(event.time)}</span>
                  <span className="text-xs font-semibold text-txt-primary">
                    {event.order.userName} fez um pedido
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {event.order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-txt-secondary">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="text-txt-primary font-medium shrink-0 ml-2">
                        R$ {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] text-txt-tertiary">{formatTime(event.time)}</span>
                  <span className="text-xs font-semibold text-txt-primary">
                    {event.payment.userName} pagou
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-txt-secondary">
                    via {METHOD_LABELS[event.payment.method] || event.payment.method}
                  </span>
                  <span className="text-emerald-600 font-medium shrink-0 ml-2">
                    R$ {formatPrice(event.payment.amount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
