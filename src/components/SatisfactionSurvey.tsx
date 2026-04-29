import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ExternalLink, Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface SatisfactionSurveyProps {
  onDismiss: () => void
  initialRating?: number
}

interface Dimension {
  id: string
  label: string
  reasons: string[]
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'produto',
    label: 'Produto',
    reasons: ['Não estava na temperatura ideal', 'Não estava saboroso', 'Não foi bem servido'],
  },
  {
    id: 'variedade',
    label: 'Variedade',
    reasons: ['Faltou o meu favorito', 'Poucas opções'],
  },
  {
    id: 'servico',
    label: 'Serviço',
    reasons: ['Atendimento ruim', 'Atendimento lento'],
  },
  {
    id: 'preco',
    label: 'Preço',
    reasons: ['Muito caro', 'Custo benefício ruim'],
  },
  {
    id: 'musica',
    label: 'Música',
    reasons: ['O som não estava bom', 'Não gosto do gênero', 'Não gostei da banda/DJ'],
  },
  {
    id: 'limpeza',
    label: 'Limpeza',
    reasons: ['Banheiro sujo', 'Ambiente sujo', 'Talheres, pratos ou copos sujos'],
  },
]

export function SatisfactionSurvey({ onDismiss, initialRating }: SatisfactionSurveyProps) {
  const [ratings, setRatings] = useState<Record<string, number>>(
    initialRating ? { produto: initialRating } : {}
  )
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({})
  const [selectedReasons, setSelectedReasons] = useState<Record<string, string[]>>({})
  const [nps, setNps] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const hasAnyRating = Object.values(ratings).some((r) => r > 0)
  const canSubmit = hasAnyRating

  // Average rating across rated dimensions (for Google Review threshold)
  const ratedValues = Object.values(ratings).filter((r) => r > 0)
  const avgRating = ratedValues.length > 0
    ? ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length
    : 0

  function setDimensionRating(dimId: string, star: number) {
    setRatings((prev) => ({ ...prev, [dimId]: star }))
    // Clear reasons if rating goes above 3
    if (star > 3) {
      setSelectedReasons((prev) => {
        const next = { ...prev }
        delete next[dimId]
        return next
      })
    }
  }

  function toggleReason(dimId: string, reason: string) {
    setSelectedReasons((prev) => {
      const current = prev[dimId] || []
      const next = current.includes(reason)
        ? current.filter((r) => r !== reason)
        : [...current, reason]
      return { ...prev, [dimId]: next }
    })
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  // ── Post-submit states ──────────────────────────────────────────────
  if (submitted) {
    // High avg rating + high NPS → Google Review
    if (avgRating >= 4 && nps >= 9) {
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
            className="w-full py-3 rounded-pill text-sm font-bold border border-brand-border text-brand-text hover:bg-brand-subtle active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            Avaliar no Google
          </button>
          <button
            onClick={onDismiss}
            className="w-full mt-2 py-2 text-sm font-medium text-brand-text"
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

  // ── Survey form ─────────────────────────────────────────────────────
  return (
    <div>
      <p className="text-sm font-semibold text-txt-primary text-center mb-1">
        Como foi sua experiência?
      </p>
      <p className="text-xs text-txt-tertiary text-center mb-5">
        Dê uma nota de 1 a 5 estrelas para cada item
      </p>

      {/* ── Dimension ratings ── */}
      <div className="flex flex-col gap-4 mb-6">
        {DIMENSIONS.map((dim) => {
          const rating = ratings[dim.id] || 0
          const hovered = hoveredStars[dim.id] || 0
          const showReasons = rating > 0 && rating <= 3

          return (
            <div key={dim.id}>
              {/* Dimension label + stars */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-txt-primary">{dim.label}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hovered || rating)
                    return (
                      <motion.button
                        key={star}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setDimensionRating(dim.id, star)}
                        onPointerEnter={() => setHoveredStars((prev) => ({ ...prev, [dim.id]: star }))}
                        onPointerLeave={() => setHoveredStars((prev) => ({ ...prev, [dim.id]: 0 }))}
                        className="p-0.5"
                      >
                        <Star
                          size={20}
                          fill={filled ? 'var(--color-loyalty-gold)' : 'none'}
                          strokeWidth={1.5}
                          style={{ color: filled ? 'var(--color-loyalty-gold)' : '#d1d5db' }}
                        />
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Conditional reasons (nota ≤ 3) */}
              <AnimatePresence>
                {showReasons && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[11px] text-txt-tertiary mb-1.5 mt-1">O que aconteceu?</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dim.reasons.map((reason) => {
                        const selected = (selectedReasons[dim.id] || []).includes(reason)
                        return (
                          <button
                            key={reason}
                            onClick={() => toggleReason(dim.id, reason)}
                            className={cn(
                              'flex items-center gap-1 px-2.5 py-1 rounded-pill text-[11px] font-medium border transition-colors',
                              selected
                                ? 'border-brand-fill bg-brand-subtle text-brand-text'
                                : 'border-border bg-white text-txt-secondary'
                            )}
                          >
                            {selected && <Check size={10} strokeWidth={2.5} />}
                            {reason}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* ── NPS ── */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-txt-primary mb-1">
          Recomendaria para amigos?
        </p>
        <p className="text-[11px] text-txt-tertiary mb-3">
          De 1 a 10, qual a probabilidade de recomendar este local?
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setNps(n)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-bold transition-colors',
                nps === n
                  ? 'bg-brand-fill text-on-brand'
                  : 'bg-surface-low text-txt-secondary hover:bg-brand-subtle'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Open feedback ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-txt-primary mb-2">
          Quer contar mais?
        </p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Nos conte como foi a sua experiência..."
          className="w-full rounded-xl bg-surface-low border-2 border-border px-3 py-2.5 text-sm text-txt-primary placeholder:text-txt-tertiary resize-none focus:outline-none"
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-brand-fill)' }}
          onBlur={(e) => { e.target.style.borderColor = '' }}
          rows={3}
        />
      </div>

      {/* ── Submit ── */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-pill text-sm font-bold border border-brand-border text-brand-text hover:bg-brand-subtle transition-all disabled:opacity-30 disabled:border-border disabled:text-txt-tertiary"
      >
        Enviar respostas
      </motion.button>
    </div>
  )
}
