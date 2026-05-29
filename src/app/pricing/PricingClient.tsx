'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import type { PricingPlan } from '@prisma/client';

const faqs = [
  {
    q: 'How long does a typical project take?',
    a: 'A landing page takes 2–3 weeks. A full web application takes 4–12 weeks depending on scope. Enterprise systems can range from 3–9 months.',
  },
  {
    q: 'Do you offer ongoing maintenance?',
    a: 'Yes. All plans include a support period post-launch. After that, we offer monthly retainer plans for maintenance, hosting management, and feature development.',
  },
  {
    q: 'Can I start small and scale later?',
    a: 'Absolutely. We can start with an MVP and scale the system as your business grows. Our architecture is designed to support this from day one.',
  },
  {
    q: 'What technologies do you use?',
    a: 'We specialize in Next.js, React, TypeScript, Node.js, PostgreSQL, and cloud platforms like Vercel and AWS. We choose the right tool for each project.',
  },
];

interface PricingClientProps {
  plans: PricingPlan[];
}

export default function PricingClient({ plans }: PricingClientProps) {
  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero */}
      <div className="relative py-20 bg-cyber-dark border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow mb-4 inline-flex"
          >
            Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5"
          >
            Simple, <span className="neon-text">Transparent Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            No hidden costs. Pay for exactly what you need.
          </motion.p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">No pricing plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  plan.recommended
                    ? 'border-cyber-cyan/30'
                    : 'glass border border-white/[0.07]'
                }`}
                style={
                  plan.recommended
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(124,58,237,0.04))',
                        border: '1px solid rgba(0,245,255,0.25)',
                        boxShadow: '0 0 40px rgba(0,245,255,0.1)',
                      }
                    : {}
                }
              >
                {plan.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyber-cyan text-cyber-black">
                      <Zap className="w-3 h-3" />
                      Recommended
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="font-display font-bold text-xl text-white mb-1">
                    {plan.name}
                  </h2>
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
                <Link
                  href="/contact"
                  className={`w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all ${
                    plan.recommended
                      ? 'bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan-light'
                      : 'border border-white/20 text-white hover:border-cyber-cyan/40 hover:text-cyber-cyan'
                  }`}
                >
                  Get Started
                </Link>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-white mb-10">
            Frequently Asked <span className="neon-text">Questions</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl p-6 glass border border-white/[0.07]"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-cyber-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/contact" className="btn-cyber">
            Get a Custom Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
