import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Calendar, Clock, Users, MapPin } from 'lucide-react'
import { useBrand } from '../context/BrandContext'
import { useMock } from '../context/MockContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { restaurantInfo, formatDateFull } from '../data/reservationData'

interface ConfirmationState {
  guests: number
  date: string
  time: string
  room: string
  userName: string
}

export function ReservationConfirmation() {
  const location = useLocation()
  const { tokens } = useBrand()
  const { setJourneyMode, resetOrders } = useMock()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const state = (location.state as ConfirmationState) || {
    guests: 2,
    date: new Date().toISOString(),
    time: '19:00',
    room: 'Salão Principal',
    userName: 'Visitante',
  }

  const dateObj = new Date(state.date)

  function goToMenu() {
    setJourneyMode('menuOnly')
    resetOrders()
    sessionStorage.removeItem('hero-seen')
    window.location.href = '/'
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-white page-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <header className="shrink-0 px-4 pt-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-brand-text">Reserva confirmada</p>
          <img src="/logo-mana.png" alt="Mana" className="h-4 object-contain" />
        </div>
        <p className="text-xs text-txt-secondary mb-1">{state.room}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-txt-secondary bg-surface-low rounded-md px-2 py-1">
            <Calendar size={14} className="text-txt-tertiary" />
            <span>{dateObj.toLocaleDateString('pt-BR')}</span>
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
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-10">
        {/* Success icon */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check size={32} className="text-emerald-500" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-txt-primary mb-2">Reserva confirmada</h1>
          <p className="text-sm text-txt-tertiary text-center max-w-xs">
            Enviaremos SMS para que você acompanhe o status da sua reserva
          </p>
        </motion.div>

        {/* Details card */}
        <motion.div
          className="border border-border rounded-2xl p-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          <p className="text-base font-bold text-txt-primary mb-3">{state.userName}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-txt-secondary">
              <Calendar size={16} className="text-txt-tertiary shrink-0" />
              <span>{formatDateFull(dateObj)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-txt-secondary">
              <Clock size={16} className="text-txt-tertiary shrink-0" />
              <span>{state.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-txt-secondary">
              <Users size={16} className="text-txt-tertiary shrink-0" />
              <span>{String(state.guests).padStart(2, '0')} {state.guests === 1 ? 'pessoa' : 'pessoas'}</span>
            </div>
          </div>
        </motion.div>

        {/* Restaurant card */}
        <motion.div
          className="border border-border rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center overflow-hidden">
              <img src={restaurantInfo.logo} alt={restaurantInfo.name} className="w-6 h-6 object-contain" />
            </div>
            <p className="text-base font-bold text-txt-primary">{restaurantInfo.name}</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-txt-secondary">
            <MapPin size={16} className="text-txt-tertiary shrink-0 mt-0.5" />
            <span>{restaurantInfo.address}<br />{restaurantInfo.city}</span>
          </div>
        </motion.div>
      </main>

      {/* CTA */}
      <div className="shrink-0 px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goToMenu}
          className="w-full py-3 rounded-pill text-sm font-bold"
          style={{ backgroundColor: brandFill, color: buttonText }}
        >
          Ver cardápio
        </motion.button>
      </div>
    </motion.div>
  )
}
