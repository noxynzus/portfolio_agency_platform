import { motion } from 'framer-motion'

const partners = [
  'TechVentures',
  'NexusCorp',
  'FoodChain Group',
  'MedConnect',
  'Startup Hub TH',
  'CloudBase',
  'RetailPro',
  'DataDrive',
  'NexusCorp',
  'FoodChain Group',
]

export default function TrustedBy() {
  return (
    <section className="py-14 border-y border-white/[0.06] bg-cyber-dark/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs text-gray-600 tracking-[0.2em] uppercase font-medium">
          Trusted by forward-thinking companies
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-cyber-dark/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-cyber-dark/80 to-transparent pointer-events-none" />

        <div
          className="flex gap-12 items-center"
          style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}
        >
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] flex-shrink-0"
            >
              <div className="w-2 h-2 rounded-full bg-cyber-cyan/60" />
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
