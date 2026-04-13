import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ExternalLink, Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface SatisfactionSurveyProps {
  onDismiss: () => void
}

const DIMENSIONS = [
  { id: 'produto', label: 'Produto' },
  { id: 'servico', label: 'Serviço' },
  { id: 'limpeza', label: 'Limpeza' },
  { id: 'musica', label: 'Música' },
]

export function SatisfactionSurvey({ onDismiss }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  function toggleDimension(id: string) {
    setSelectedDimensions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  // Post-submit: Google Review redirect for high ratings
  if (submitted) {
    if (rating >= 4) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-txt-primary mb-1">
            Que bom que gostou!
          </p>
          <p className="text-xs text-txt-secondary mb-4">
            Quer compartilhar sua experiência no Google?
          </p>
          <button
            onClick={() => {
              window.open('https://search.google.com/local/writereview?placeid=MOCK_PLACE_ID', '_blank')
              onDismiss()
            }}
            className="w-full py-3 rounded-pill text-sm font-bold border border-brand-fill text-brand-text hover:bg-brand-subtle active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            Avaliar no Google
          </button>
          <button
            onClick={onDismiss}
            className="w-full mt-2 py-2 text-sm font-medium text-txt-tertiary"
          >
            Agora não
          </button>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="w-10 h-10 rounded-full bg-brand-subtle flex items-center justify-center mx-auto mb-3"
        >
          <Check size={20} style={{ color: 'var(--color-brand-fill)' }} />
        </motion.div>
        <p className="text-sm font-semibold text-txt-primary">Obrigado pelo feedback!</p>
        <p className="text-xs text-txt-secondary mt-1">Sua opinião nos ajuda a melhorar.</p>
      </motion.div>
    )
  }

  return (
    <div>
      <p className="text-sm font-semibold text-txt-primary text-center mb-1">
        Como foi sua experiência?
      </p>
      <p className="text-xs text-txt-tertiary text-center mb-4">
        Sua avaliação nos ajuda a melhorar
      </p>

      {/* Star rating */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoveredStar || rating)
          return (
            <motion.button
              key={star}
              whileTap={{ scale: 0.75, rotate: -15 }}
              animate={filled && star === rating ? { scale: [1, 1.25, 1] } : {}}
              transition={{ duration: 0.25 }}
              onClick={() => setRating(star)}
              onPointerEnter={() => setHoveredStar(star)}
              onPointerLeave={() => setHoveredStar(0)}
              className="p-1"
            >
              <Star
                size={32}
                fill={filled ? 'var(--color-loyalty-gold)' : 'none'}
                strokeWidth={1.5}
                style={{ color: filled ? 'var(--color-loyalty-gold)' : '#d1d5db' }}
              />
            </motion.button>
          )
        })}
      </div>

      {/* Conditional feedback */}
      <AnimatePresence>
        {rating > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* Dimension chips */}
            <p className="text-xs text-txt-tertiary mb-2">O que se destacou?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DIMENSIONS.map((dim) => {
                const selected = selectedDimensions.includes(dim.id)
                return (
                  <motion.button
                    key={dim.id}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleDimension(dim.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium border transition-all duration-200',
                      selected
                        ? 'border-brand-fill bg-brand-subtle text-brand-text'
                        : 'border-border bg-white text-txt-secondary'
                    )}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0, width: 0 }}
                        animate={{ scale: 1, width: 'auto' }}
                        exit={{ scale: 0, width: 0 }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                      </motion.span>
                    )}
                    {dim.label}
                  </motion.button>
                )
              })}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={rating < 4 ? 'O que podemos melhorar?' : 'O que você mais gostou? (opcional)'}
              className="w-full rounded-xl bg-surface-low border-2 border-border px-3 py-2.5 text-sm text-txt-primary placeholder:text-txt-tertiary resize-none focus:outline-none mb-4"
              style={{ borderColor: undefined }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand-fill)' }}
              onBlur={(e) => { e.target.style.borderColor = '' }}
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit — outline style to not compete with main CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full py-3 rounded-pill text-sm font-bold border border-brand-fill text-brand-text hover:bg-brand-subtle transition-all disabled:opacity-30 disabled:border-border disabled:text-txt-tertiary"
      >
        Enviar avaliação
      </motion.button>

    </div>
  )
}
