import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Hash, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { MenuDrawer } from '../components/MenuDrawer'
import { MOCK_USER_CPF } from '../data/mockTableData'

type Mode = 'cpf' | 'comanda'

export function Identify() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState<Mode>('cpf')
  const [value, setValue] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  function formatCpf(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  function handleSubmit() {
    if (mode === 'cpf') {
      const digits = value.replace(/\D/g, '')
      if (digits.length === 11) {
        login({ name: 'Cliente', cpf: digits })
        navigate('/conta-mesa')
      }
    } else {
      if (value.trim().length >= 3) {
        login({ name: 'Cliente', cpf: MOCK_USER_CPF })
        navigate('/conta-mesa')
      }
    }
  }

  const isValid = mode === 'cpf'
    ? value.replace(/\D/g, '').length === 11
    : value.trim().length >= 3

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-4"
        style={{ backgroundColor: 'var(--color-brand-fill)', height: 'var(--header-height)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--color-on-brand-fill)' }}
          >
            M
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--color-on-brand-fill)' }}>
            Mana
          </span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <Menu size={18} color="var(--color-on-brand-fill)" />
        </button>
      </div>
      <MenuDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <h1 className="text-lg font-bold text-txt-primary text-center mb-1">
            Mesa 12
          </h1>
          <p className="text-sm text-txt-secondary text-center mb-8">
            Identifique-se para ver sua conta
          </p>

          {/* Mode toggle */}
          <div className="flex bg-surface-low rounded-lg p-1 mb-6">
            {([
              { value: 'cpf' as Mode, label: 'CPF', icon: CreditCard },
              { value: 'comanda' as Mode, label: 'Nº Comanda', icon: Hash },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setMode(opt.value); setValue('') }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  mode === opt.value
                    ? 'bg-white text-txt-primary shadow-sm'
                    : 'text-txt-tertiary'
                }`}
              >
                <opt.icon size={14} />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">
              {mode === 'cpf' ? 'Seu CPF' : 'Número da comanda'}
            </label>
            <input
              type="text"
              inputMode={mode === 'cpf' ? 'numeric' : 'text'}
              value={value}
              onChange={(e) => setValue(mode === 'cpf' ? formatCpf(e.target.value) : e.target.value)}
              placeholder={mode === 'cpf' ? '000.000.000-00' : 'Ex: 1234'}
              className="w-full rounded-xl bg-surface-low border-2 border-border px-4 py-3 text-base text-txt-primary placeholder:text-txt-tertiary focus:outline-none transition-colors"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand-fill)' }}
              onBlur={(e) => { e.target.style.borderColor = '' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && isValid) handleSubmit() }}
              autoFocus
            />
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-3 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover disabled:opacity-40 active:scale-95 transition-all"
          >
            Ver minha conta
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-4">
        <p className="text-xs text-txt-tertiary text-center">
          Powered by <span className="font-semibold">Zig</span>
        </p>
      </div>
    </div>
  )
}
