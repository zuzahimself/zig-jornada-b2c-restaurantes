import { useState } from 'react'
import { ChefHat, RotateCcw, Coins, Store, User, CreditCard, Mail } from 'lucide-react'
import { useMock, type TableStatus } from '../context/MockContext'
import { cn, formatPrice } from '../lib/utils'

interface MockSwitcherProps {
  onApply?: () => void
}

const SCENARIOS: { value: TableStatus; label: string }[] = [
  { value: 'open', label: 'Mesa aberta' },
  { value: 'partially_paid', label: 'Parcialmente paga' },
  { value: 'fully_paid', label: 'Totalmente paga' },
]

export function MockSwitcher({ onApply }: MockSwitcherProps) {
  const { tableStatus, setTableStatus, advanceOrderStatus, resetOrders, giftbackBalance, setGiftbackBalance, isMultiVendor, setMultiVendor, isLoggedIn, setLoggedIn, hasCpf, setHasCpf, hasEmail, setHasEmail } = useMock()
  const [local, setLocal] = useState<TableStatus>(tableStatus)

  function handleApply() {
    setTableStatus(local)
    onApply?.()
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Multi-vendor toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store size={14} className="text-txt-secondary" />
          <span className="text-sm font-medium text-txt-primary">Food Hall</span>
        </div>
        <button
          role="switch"
          aria-checked={isMultiVendor}
          onClick={() => setMultiVendor(!isMultiVendor)}
          className={cn(
            'relative w-10 h-[22px] rounded-full transition-colors',
            isMultiVendor ? 'bg-brand-fill' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
              isMultiVendor && 'translate-x-[18px]'
            )}
          />
        </button>
      </div>

      {/* Logged-in toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={14} className="text-txt-secondary" />
          <span className="text-sm font-medium text-txt-primary">Logado</span>
        </div>
        <button
          role="switch"
          aria-checked={isLoggedIn}
          onClick={() => setLoggedIn(!isLoggedIn)}
          className={cn(
            'relative w-10 h-[22px] rounded-full transition-colors',
            isLoggedIn ? 'bg-brand-fill' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
              isLoggedIn && 'translate-x-[18px]'
            )}
          />
        </button>
      </div>

      {/* Has CPF toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-txt-secondary" />
          <span className="text-sm font-medium text-txt-primary">Tem CPF</span>
        </div>
        <button
          role="switch"
          aria-checked={hasCpf}
          onClick={() => setHasCpf(!hasCpf)}
          className={cn(
            'relative w-10 h-[22px] rounded-full transition-colors',
            hasCpf ? 'bg-brand-fill' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
              hasCpf && 'translate-x-[18px]'
            )}
          />
        </button>
      </div>

      {/* Has Email toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-txt-secondary" />
          <span className="text-sm font-medium text-txt-primary">Tem email</span>
        </div>
        <button
          role="switch"
          aria-checked={hasEmail}
          onClick={() => setHasEmail(!hasEmail)}
          className={cn(
            'relative w-10 h-[22px] rounded-full transition-colors',
            hasEmail ? 'bg-brand-fill' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
              hasEmail && 'translate-x-[18px]'
            )}
          />
        </button>
      </div>

      <div className="border-t border-border pt-3" />

      <div className="flex flex-col gap-1.5">
        {SCENARIOS.map((s) => {
          const isActive = local === s.value
          return (
            <button
              key={s.value}
              onClick={() => setLocal(s.value)}
              className={cn(
                'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-left transition-colors',
                isActive ? 'bg-surface-low' : 'hover:bg-surface-low'
              )}
            >
              <span
                className={cn(
                  'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                  isActive ? 'border-brand-fill' : 'border-txt-tertiary'
                )}
              >
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-brand-fill" />
                )}
              </span>
              <span className={cn('font-medium', isActive ? 'text-txt-primary' : 'text-txt-secondary')}>
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform mt-1"
      >
        Aplicar
      </button>

      {/* Advance order status */}
      <div className="border-t border-border pt-3 mt-1">
        <p className="text-[11px] text-txt-tertiary mb-2">
          Simula o tempo passando na cozinha
        </p>
        <button
          onClick={() => { advanceOrderStatus(); onApply?.() }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-pill text-sm font-bold border border-border text-txt-secondary hover:bg-surface-low active:scale-95 transition-transform"
        >
          <ChefHat size={15} />
          Avançar status dos pedidos
        </button>
        <button
          onClick={() => { resetOrders(); sessionStorage.removeItem('hero-seen'); window.location.reload() }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-pill text-sm font-bold border border-border text-red-500 hover:bg-red-50 active:scale-95 transition-transform mt-2"
        >
          <RotateCcw size={14} />
          Zerar mesa
        </button>
      </div>

      {/* Giftback balance */}
      <div className="border-t border-border pt-3 mt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Coins size={14} style={{ color: 'var(--color-loyalty-gold)' }} />
            <span className="text-[11px] font-semibold text-txt-secondary">Saldo giftback</span>
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--color-loyalty-gold)' }}>
            R$ {formatPrice(giftbackBalance)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={50}
          value={giftbackBalance}
          onChange={(e) => setGiftbackBalance(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-loyalty-gold) ${(giftbackBalance / 5000) * 100}%, #e5e7eb ${(giftbackBalance / 5000) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-txt-tertiary mt-1">
          <span>R$ 0</span>
          <span>R$ 50,00</span>
        </div>
      </div>
    </div>
  )
}
