import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Users, Clock } from 'lucide-react'
import { useBrand } from '../context/BrandContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { reservationRules, formatDateShort } from '../data/reservationData'

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatBirthdate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

interface DetailsState {
  guests: number
  date: string
  time: string
  room: string
  identName?: string
  identCpf?: string
  identPhone?: string
}

export function ReservationDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tokens } = useBrand()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const state = (location.state as DetailsState) || {
    guests: 2,
    date: new Date().toISOString(),
    time: '19:00',
    room: 'Salão Principal',
  }

  const dateObj = new Date(state.date)
  const { day, month } = formatDateShort(dateObj)

  // Pre-filled from identification step (readonly if provided)
  const hasName = !!state.identName
  const hasCpf = !!state.identCpf

  // Form state — pre-fill from identification, editable otherwise
  const [name, setName] = useState(state.identName || '')
  const [cpf, setCpf] = useState(state.identCpf ? formatCpf(state.identCpf) : '')
  const [phone, setPhone] = useState(state.identPhone ? formatPhone(state.identPhone) : '')
  const [email, setEmail] = useState('')
  const [birthdate, setBirthdate] = useState('')

  function handleNext() {
    navigate('/reserva/confirmada', {
      state: {
        guests: state.guests,
        date: state.date,
        time: state.time,
        room: state.room,
        userName: name || 'Visitante',
      },
    })
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-fill transition-colors'
  const labelClass = 'text-xs font-semibold text-txt-secondary mb-1.5 block'
  const readonlyClass = 'w-full px-4 py-3 rounded-xl border border-border text-sm text-txt-tertiary bg-surface-low cursor-default'

  return (
    <motion.div
      className="flex flex-col h-full bg-white page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="shrink-0 px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low transition-colors"
            >
              <ArrowLeft size={20} className="text-txt-primary" />
            </button>
            <span className="text-sm font-bold text-txt-primary">Reserva</span>
          </div>
          <img src="/logo-mana.png" alt="Mana" className="h-4 object-contain" />
        </div>
        {/* Summary pills */}
        <div className="pl-11 pb-3">
          <p className="text-xs font-medium text-txt-secondary mb-1">{state.room}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-txt-secondary bg-surface-low rounded-md px-2 py-1">
              <Calendar size={14} className="text-txt-tertiary" />
              <span>{day}/{month}/{dateObj.getFullYear()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-txt-secondary bg-surface-low rounded-md px-2 py-1">
              <Users size={14} className="text-txt-tertiary" />
              <span>{state.guests}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-txt-secondary bg-surface-low rounded-md px-2 py-1">
              <Clock size={14} className="text-txt-tertiary" />
              <span>{state.time}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <div className="flex flex-col gap-4">
          {/* Nome */}
          <div>
            <label className={labelClass}>Nome</label>
            {hasName ? (
              <div className={readonlyClass}>{name}</div>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className={inputClass}
              />
            )}
          </div>

          {/* CPF */}
          <div>
            <label className={labelClass}>CPF</label>
            {hasCpf ? (
              <div className={readonlyClass}>{cpf}</div>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            )}
          </div>

          {/* Celular */}
          <div>
            <label className={labelClass}>Celular</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+55"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className={inputClass}
            />
          </div>

          {/* Data de nascimento */}
          <div>
            <label className={labelClass}>Data de nascimento</label>
            <input
              type="text"
              inputMode="numeric"
              value={birthdate}
              onChange={(e) => setBirthdate(formatBirthdate(e.target.value))}
              placeholder="__/__/____"
              className={inputClass}
            />
          </div>

          {/* Regras e condições */}
          <div className="bg-surface-low rounded-xl p-4 mt-2">
            <h3 className="text-sm font-bold text-txt-primary mb-2">
              {reservationRules.title}
            </h3>
            <ul className="space-y-1.5">
              {reservationRules.rules.map((rule, i) => (
                <li key={i} className="text-xs text-txt-secondary leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-border">
              <h4 className="text-xs font-bold text-txt-primary mb-0.5">
                {reservationRules.toleranceTitle}
              </h4>
              <p className="text-xs text-txt-secondary">
                {reservationRules.toleranceDescription}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="shrink-0 px-4 py-3 border-t border-border">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="w-full py-3 rounded-pill text-sm font-bold"
          style={{ backgroundColor: brandFill, color: buttonText }}
        >
          Próxima etapa
        </motion.button>
      </div>
    </motion.div>
  )
}
