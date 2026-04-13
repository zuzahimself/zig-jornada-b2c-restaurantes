import { useState } from 'react'
import { useBrand, BRAND_PRESETS } from '../context/BrandContext'
import { cn } from '../lib/utils'

interface BrandSwitcherProps {
  onApply?: () => void
}

export function BrandSwitcher({ onApply }: BrandSwitcherProps) {
  const { brandHex, setBrand } = useBrand()
  const [localHex, setLocalHex] = useState(brandHex)
  const [pickerHex, setPickerHex] = useState(brandHex)

  function handleApply() {
    setBrand(localHex)
    onApply?.()
  }

  function handlePreset(hex: string) {
    setLocalHex(hex)
    setPickerHex(hex)
  }

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value
    setPickerHex(hex)
    setLocalHex(hex)
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLocalHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setPickerHex(val)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Color picker + hex field */}
      <div className="flex items-center gap-2">
        <label className="relative w-9 h-9 rounded-md overflow-hidden border border-border cursor-pointer shrink-0">
          <input
            type="color"
            value={pickerHex}
            onChange={handlePickerChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Escolher cor"
          />
          <div
            className="w-full h-full rounded-md"
            style={{ backgroundColor: pickerHex }}
          />
        </label>

        <input
          type="text"
          value={localHex}
          onChange={handleHexInput}
          maxLength={7}
          className="flex-1 px-3 py-1.5 text-xs font-mono border border-border rounded-md bg-surface-low text-txt-primary focus:outline-none focus:border-brand-fill"
          placeholder="#446A81"
        />
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-1.5">
        {BRAND_PRESETS.map((preset) => {
          const isActive = localHex.toLowerCase() === preset.hex.toLowerCase()
          return (
            <button
              key={preset.hex}
              onClick={() => handlePreset(preset.hex)}
              className={cn(
                'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-left transition-colors',
                isActive ? 'bg-surface-low' : 'hover:bg-surface-low'
              )}
            >
              <span
                className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: preset.hex }}
              />
              <span className={cn('font-medium', isActive ? 'text-txt-primary' : 'text-txt-secondary')}>
                {preset.name}
              </span>
              {isActive && (
                <span className="ml-auto text-xs text-brand-text font-semibold">✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="w-full py-2 rounded-pill text-sm font-bold text-on-brand bg-brand-fill hover:bg-brand-fill-hover active:scale-95 transition-transform mt-1"
      >
        Aplicar
      </button>
    </div>
  )
}
