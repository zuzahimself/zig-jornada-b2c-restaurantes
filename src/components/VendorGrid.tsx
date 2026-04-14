import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Vendor } from '../types'

interface VendorGridProps {
  vendors: Vendor[]
}

export function VendorGrid({ vendors }: VendorGridProps) {
  return (
    <section className="px-4 pt-2 pb-4">
      <div className="grid grid-cols-3 gap-3">
        {vendors.map((vendor, i) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link to={`/vendor/${vendor.id}`}>
              <VendorCard vendor={vendor} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl bg-surface-low p-3 hover:shadow-md transition-shadow">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm"
        style={{ border: `2px solid ${vendor.color}20` }}
      >
        <img
          src={vendor.logo}
          alt={vendor.name}
          className="w-10 h-10 object-contain"
        />
      </div>

      <p className="text-xs font-bold text-txt-primary mt-2 leading-tight">
        {vendor.name}
      </p>

      {vendor.subtitle && (
        <p className="text-[10px] text-txt-tertiary mt-0.5 leading-tight">
          {vendor.subtitle}
        </p>
      )}
    </div>
  )
}
