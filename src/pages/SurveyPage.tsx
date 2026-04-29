import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SatisfactionSurvey } from '../components/SatisfactionSurvey'

interface SurveyState {
  initialRating?: number
}

export function SurveyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as SurveyState) || {}

  return (
    <motion.div
      className="flex flex-col h-full bg-white page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="flex items-center gap-3 px-4 h-14 shrink-0 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-low transition-colors"
        >
          <ArrowLeft size={20} className="text-txt-primary" />
        </button>
        <span className="text-sm font-bold text-txt-primary">Pesquisa de satisfação</span>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <SatisfactionSurvey
          initialRating={state.initialRating}
          onDismiss={() => navigate(-1)}
        />
      </main>
    </motion.div>
  )
}
