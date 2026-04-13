import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { CustomizationGroup } from '../types'
import { formatPrice, cn } from '../lib/utils'

interface ProductCustomizerProps {
  groups: CustomizationGroup[]
  selections: Record<string, string[]>
  onSelectionChange: (groupId: string, optionIds: string[]) => void
}

export function ProductCustomizer({ groups, selections, onSelectionChange }: ProductCustomizerProps) {
  return (
    <div className="flex flex-col gap-4 mb-5">
      {groups.map((group) => {
        const selected = selections[group.id] ?? []
        const isComplete = !group.required || selected.length > 0

        return (
          <div
            key={group.id}
            className={cn(
              'rounded-xl border p-4 transition-colors duration-200',
              isComplete ? 'border-brand-fill' : 'border-brand-border'
            )}
          >
            {/* Group header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-txt-primary">{group.name}</h3>
                {group.required && (
                  <span className="text-[10px] font-semibold text-brand-text bg-brand-subtle px-2 py-0.5 rounded-pill">
                    Obrigatório
                  </span>
                )}
                {!group.required && group.maxSelections && (
                  <span className="text-[10px] text-txt-tertiary">
                    Até {group.maxSelections}
                  </span>
                )}
              </div>
              {isComplete && group.required && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-brand-fill flex items-center justify-center"
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </motion.div>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-1.5">
              {group.options.map((option) => {
                const isSelected = selected.includes(option.id)

                function handleSelect() {
                  if (group.type === 'radio') {
                    onSelectionChange(group.id, [option.id])
                  } else {
                    if (isSelected) {
                      onSelectionChange(group.id, selected.filter((id) => id !== option.id))
                    } else {
                      if (group.maxSelections && selected.length >= group.maxSelections) return
                      onSelectionChange(group.id, [...selected, option.id])
                    }
                  }
                }

                return (
                  <motion.button
                    key={option.id}
                    onClick={handleSelect}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150',
                      isSelected ? 'bg-brand-subtle' : 'bg-transparent hover:bg-surface-low'
                    )}
                  >
                    {/* Radio / Checkbox indicator */}
                    {group.type === 'radio' ? (
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
                          isSelected ? 'border-brand-fill' : 'border-border'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="w-2.5 h-2.5 rounded-full bg-brand-fill"
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors',
                          isSelected ? 'border-brand-fill bg-brand-fill' : 'border-border'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check size={12} color="#fff" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Option name */}
                    <span className={cn(
                      'flex-1 text-sm',
                      isSelected ? 'font-semibold text-txt-primary' : 'text-txt-secondary'
                    )}>
                      {option.name}
                    </span>

                    {/* Price modifier */}
                    {option.priceModifier > 0 && (
                      <span className="text-xs font-medium text-txt-tertiary shrink-0">
                        + R$ {formatPrice(option.priceModifier)}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
