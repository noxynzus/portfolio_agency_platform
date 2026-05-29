'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-cyber-dark">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-sm opacity-30 pointer-events-none" />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top/bottom gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-purple/20 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-eyebrow mb-6 inline-flex"
        >
          Let&apos;s Work Together
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight"
        >
          Start Your Project{' '}
          <span className="neon-text">Today</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Let&apos;s build something amazing together. Get a free consultation and
          project estimate — no commitment required.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link href="/contact" className="btn-cyber text-base">
            Get a Free Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn-ghost text-base">
            <Calendar className="w-4 h-4" />
            Book a Consultation
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-600"
        >
          {[
            'Free Consultation',
            'No Lock-in Contracts',
            '48hr Response Time',
          ].map((item, i) => (
            <div key={item} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/10">·</span>}
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyber-cyan/50" />
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
