'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Zap } from 'lucide-react';
import type { PricingPlan } from '@prisma/client';

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
        plan.recommended
          ? 'border-cyber-cyan/30 shadow-neon-cyan'
          : 'glass border border-white/[0.07] hover:border-white/[0.12]'
      }`}
      style={
        plan.recommended
          ? {
              background:
                'linear-gradient(135deg, rgba(0,245,255,0.06) 0%, rgba(124,58,237,0.04) 100%)',
              border: '1px solid rgba(0,245,255,0.25)',
            }
          : {}
      }
    >
      {/* Popular badge */}
      {plan.recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyber-cyan text-cyber-black">
            <Zap className="w-3 h-3" />
            Recommended
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-lg text-white mb-1.5">
          {plan.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-display font-bold text-4xl ${
              plan.recommended ? 'neon-text-cyan' : 'text-white'
            }`}
          >
            {plan.price}
          </span>
          {plan.price !== 'Custom' && (
            <span className="text-gray-500 text-sm">/ {plan.period}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/contact"
        className={`w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all duration-300 ${
          plan.recommended
            ? 'bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan-light shadow-neon-cyan-sm'
            : 'border border-white/20 text-white hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 hover:text-cyber-cyan'
        }`}
      >
        Get Started
      </Link>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface PricingPreviewClientProps {
  plans: PricingPlan[];
}

export default function PricingPreviewClient({
  plans,
}: PricingPreviewClientProps) {
  return (
    <section className="py-24 bg-cyber-dark/30 relative">
      <div className="absolute inset-0 bg-grid-sm opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow mb-4 inline-flex"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-5"
          >
            Simple, <span className="neon-text">Transparent Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            No hidden fees. No surprises. Choose the plan that fits your project
            and scale as you grow.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          All prices in THB. Enterprise plans include custom SLA and dedicated
          support.{' '}
          <Link href="/pricing" className="text-cyber-cyan hover:underline">
            Compare all features →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
