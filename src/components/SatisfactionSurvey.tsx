import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
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
          className="bg-white rounded-2xl px-5 py-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-txt-primary text-center mb-1">
            Que bom que gostou!
          </p>
          <p className="text-xs text-txt-secondary text-center mb-4">
            Quer compartilhar sua experiência no Google?
          </p>
          <button
            onClick={() => {
              window.open('https://search.google.com/local/writereview?placeid=MOCK_PLACE_ID', '_blank')
              onDismiss()
            }}
            className="w-full py-3 rounded-xl text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform flex items-center justify-center gap-2"
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
        className="bg-white rounded-2xl px-5 py-5 shadow-sm text-center"
      >
        <p className="text-sm font-semibold text-txt-primary">Obrigado pelo feedback!</p>
        <p className="text-xs text-txt-secondary mt-1">Sua opinião nos ajuda a melhorar.</p>
        <button
          onClick={onDismiss}
          className="mt-3 text-sm font-medium text-brand-text"
        >
          Fechar
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-sm">
      <p className="text-sm font-semibold text-txt-primary text-center mb-1">
        Como foi sua experiência?
      </p>
      <p className="text-xs text-txt-tertiary text-center mb-4">
        Sua avaliação nos ajuda a melhorar
      </p>

      {/* Star rating */}
      <div className="flex justify-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoveredStar || rating)
          return (
            <motion.button
              key={star}
              whileTap={{ scale: 0.85 }}
              onClick={() => setRating(star)}
              onPointerEnter={() => setHoveredStar(star)}
              onPointerLeave={() => setHoveredStar(0)}
              className="p-1"
            >
              <Star
                size={28}
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={rating < 4 ? 'O que podemos melhorar?' : 'O que você mais gostou?'}
              className="w-full rounded-xl bg-surface-low border border-border px-3 py-2.5 text-sm text-txt-primary placeholder:text-txt-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-brand-fill/20"
              rows={3}
            />

            {/* Dimension chips */}
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {DIMENSIONS.map((dim) => {
                const selected = selectedDimensions.includes(dim.id)
                return (
                  <button
                    key={dim.id}
                    onClick={() => toggleDimension(dim.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      selected
                        ? 'bg-brand-subtle text-brand-text'
                        : 'bg-surface-low text-txt-secondary'
                    )}
                  >
                    {dim.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full py-3 rounded-xl text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover transition-colors disabled:opacity-40"
      >
        Enviar avaliação
      </motion.button>

      <button
        onClick={onDismiss}
        className="w-full mt-2 py-2 text-sm font-medium text-txt-tertiary"
      >
        Pular
      </button>
    </div>
  )
}
