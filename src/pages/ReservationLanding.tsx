import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, User } from 'lucide-react'
import { useMock } from '../context/MockContext'
import { restaurantInfo } from '../data/reservationData'

export function ReservationLanding() {
  const navigate = useNavigate()
  const { setJourneyMode, resetOrders } = useMock()

  function goToMenu() {
    setJourneyMode('menuOnly')
    resetOrders()
    sessionStorage.removeItem('hero-seen')
    window.location.href = '/'
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-white page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 shrink-0">
        <p className="text-sm font-bold text-txt-primary">Faça sua reserva ou veja o cardápio</p>
        <div className="w-9 h-9 rounded-full bg-surface-low flex items-center justify-center">
          <User size={16} className="text-txt-secondary" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero image with restaurant info */}
        <div className="relative mx-0 overflow-hidden" style={{ height: 148 }}>
          <img
            src="/herolanding.png"
            alt="Restaurante"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Restaurant info card */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3">
              <img
                src={restaurantInfo.logo}
                alt={restaurantInfo.name}
                className="h-6 object-contain mb-2"
              />
              <p className="text-xs text-txt-secondary leading-tight">
                {restaurantInfo.address}, {restaurantInfo.city}
              </p>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="px-4 pt-6 flex flex-col gap-3">
          {/* Reservar */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/reserva/agendar')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border border-border shadow-sm text-left transition-shadow hover:shadow-md"
          >
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg font-bold text-brand-text mb-1">Reservar</h2>
              <p className="text-sm text-txt-secondary leading-snug">
                Veja os horários disponíveis e agende agora a sua reserva
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-brand-subtle)' }}
            >
              <ChevronRight size={20} className="text-brand-text" />
            </div>
          </motion.button>

          {/* Acessar cardápio */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={goToMenu}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white border border-border shadow-sm text-left transition-shadow hover:shadow-md"
          >
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg font-bold text-brand-text mb-1">Acessar cardápio</h2>
              <p className="text-sm text-txt-secondary leading-snug">
                Veja os pratos disponíveis e monte seu pedido
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-brand-subtle)' }}
            >
              <ChevronRight size={20} className="text-brand-text" />
            </div>
          </motion.button>
        </div>
      </main>

      {/* Footer */}
      <div className="shrink-0 py-4">
        <p className="text-xs text-txt-tertiary text-center">
          Powered by <span className="font-semibold">Zig</span>
        </p>
      </div>
    </motion.div>
  )
}
