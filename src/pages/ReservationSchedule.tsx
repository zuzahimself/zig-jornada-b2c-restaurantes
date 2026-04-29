import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useBrand } from '../context/BrandContext'
import { getTextOnBackground } from '../lib/colorSystem'
import { availableDates, rooms, formatDateShort } from '../data/reservationData'

export function ReservationSchedule() {
  const navigate = useNavigate()
  const { tokens } = useBrand()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const [guests, setGuests] = useState<number | null>(null)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const dateScrollRef = useRef<HTMLDivElement>(null)

  const selectedDate = selectedDateIdx !== null ? availableDates[selectedDateIdx] : null
  const isValid = guests !== null && selectedDate !== null && selectedTime !== null

  function handleNext() {
    if (!isValid || !selectedDate) return
    navigate('/reserva/identificacao', {
      state: {
        guests,
        date: selectedDate.date.toISOString(),
        time: selectedTime,
        room: rooms[0].name,
      },
    })
  }

  return (
    <motion.div
      className="flex flex-col h-full bg-white page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reserva')}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low transition-colors"
          >
            <ArrowLeft size={20} className="text-txt-primary" />
          </button>
          <span className="text-sm font-bold text-txt-primary">Reserva</span>
        </div>
        <img src="/logo-mana.png" alt="Mana" className="h-4 object-contain" />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-6">
        {/* Guests selector */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">
            Quantidade de pessoas
          </label>
          <div className="relative">
            <button
              onClick={() => setGuestsOpen(!guestsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-sm transition-colors focus:outline-none focus:border-brand-fill"
            >
              <span className={guests ? 'text-txt-primary' : 'text-txt-tertiary'}>
                {guests ? `${guests} ${guests === 1 ? 'pessoa' : 'pessoas'}` : 'Escolha a quantidade de pessoas'}
              </span>
              <ChevronDown size={18} className="text-txt-tertiary" />
            </button>

            <AnimatePresence>
              {guestsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => { setGuests(n); setGuestsOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-txt-primary hover:bg-surface-low transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {n} {n === 1 ? 'pessoa' : 'pessoas'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Date selector */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">
            Data
          </label>
          <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-sm">
            <span className={selectedDate ? 'text-txt-primary' : 'text-txt-tertiary'}>
              {selectedDate
                ? selectedDate.date.toLocaleDateString('pt-BR')
                : 'Escolha uma data ou selecione o dia abaixo'}
            </span>
            <ChevronDown size={18} className="text-txt-tertiary" />
          </div>
        </div>

        {/* Date chips (horizontal scroll) */}
        <div
          ref={dateScrollRef}
          className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide"
        >
          {availableDates.map((d, i) => {
            const { day, month } = formatDateShort(d.date)
            const isActive = selectedDateIdx === i
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDateIdx(i)
                  setSelectedTime(null)
                }}
                className={`flex flex-col items-center px-3 pt-2 pb-2 rounded-xl border shrink-0 transition-colors ${
                  isActive
                    ? 'bg-brand-subtle border-brand-border'
                    : 'border-border hover:bg-surface-low'
                }`}
                style={{ minWidth: 80 }}
              >
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-lg font-bold ${isActive ? 'text-brand-text' : 'text-txt-primary'}`}>
                    {day}
                  </span>
                  <span className={`text-sm ${isActive ? 'text-brand-text' : 'text-txt-secondary'}`}>
                    {month}
                  </span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/60 text-brand-text font-medium'
                      : 'bg-surface-low text-txt-tertiary'
                  }`}
                >
                  {d.slots.length.toString().padStart(2, '0')} {d.slots.length === 1 ? 'horário' : 'horários'}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Time slots */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-2 pb-6">
                {selectedDate.slots.map((slot) => {
                  const isActive = selectedTime === slot
                  return (
                    <motion.button
                      key={slot}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-pill text-sm font-medium border transition-colors ${
                        isActive
                          ? 'bg-brand-subtle border-brand-border text-brand-text'
                          : 'border-border text-txt-secondary hover:bg-surface-low'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CTA */}
      <div className="shrink-0 px-4 py-3 border-t border-border">
        <motion.button
          whileTap={isValid ? { scale: 0.97 } : undefined}
          disabled={!isValid}
          onClick={handleNext}
          className="w-full py-3 rounded-pill text-sm font-bold transition-opacity"
          style={{
            backgroundColor: brandFill,
            color: buttonText,
            opacity: isValid ? 1 : 0.4,
          }}
        >
          Próxima etapa
        </motion.button>
      </div>
    </motion.div>
  )
}
