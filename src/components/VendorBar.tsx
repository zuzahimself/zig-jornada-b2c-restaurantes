import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import type { Vendor } from '../types'

interface VendorBarProps {
  vendors: Vendor[]
  activeVendor: string | null
  onVendorChange: (vendorId: string | null) => void
}

export function VendorBar({ vendors, activeVendor, onVendorChange }: VendorBarProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex overflow-x-auto no-scrollbar gap-2">
        {/* "Todos" pill */}
        <VendorPill
          isActive={activeVendor === null}
          label="Todos"
          onClick={() => onVendorChange(null)}
        />

        {vendors.map((v) => (
          <VendorPill
            key={v.id}
            isActive={activeVendor === v.id}
            label={v.name}
            logo={v.logo}
            onClick={() => onVendorChange(v.id)}
          />
        ))}
      </div>
    </div>
  )
}

function VendorPill({
  isActive,
  label,
  logo,
  onClick,
}: {
  isActive: boolean
  label: string
  logo?: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative shrink-0 flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-pill text-sm font-semibold transition-colors border',
        isActive
          ? 'bg-brand-fill text-on-brand border-transparent'
          : 'bg-white text-txt-secondary border-border hover:bg-surface-low',
        !logo && 'pl-3.5'
      )}
    >
      {logo && (
        <img
          src={logo}
          alt={label}
          className="w-6 h-6 rounded-full object-cover bg-white"
        />
      )}
      <span>{label}</span>
    </motion.button>
  )
}
