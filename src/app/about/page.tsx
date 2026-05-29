'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Target, Zap, Shield, Users } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We measure success by your business outcomes — not just shipping code.',
    color: '#00F5FF',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Agile process with weekly demos. No endless waterfall cycles.',
    color: '#8B5CF6',
  },
  {
    icon: Shield,
    title: 'Quality First',
    description: 'Production-grade code with comprehensive testing and security built in.',
    color: '#06B6D4',
  },
  {
    icon: Users,
    title: 'True Partnership',
    description: 'We act as your engineering team, not just a vendor.',
    color: '#22D3EE',
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '3yr+', label: 'In Business' },
  { value: '12+', label: 'Industries Served' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-eyebrow mb-6 inline-flex"
            >
              About Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-8 leading-tight"
            >
              We&apos;re a{' '}
              <span className="neon-text">Premium Digital</span>{' '}
              Engineering Studio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl leading-relaxed mb-8"
            >
              Atthawat Studio is a Bangkok-based digital engineering team that builds
              scalable web applications, enterprise systems, and AI-powered products.
              We work with startups, SMEs, and enterprises across Southeast Asia.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-lg leading-relaxed"
            >
              We believe great software is a blend of engineering excellence, thoughtful
              design, and a deep understanding of your business. Every line of code we
              write is in service of your goals.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-white/[0.06] bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl font-bold neon-text-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-5"
          >
            Our <span className="neon-text-purple">Values</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl p-6 glass border border-white/[0.07] card-glow"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                style={{ background: `${v.color}10`, borderColor: `${v.color}20`, color: v.color }}
              >
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/[0.06] bg-cyber-dark py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to build something great?
          </h2>
          <p className="text-gray-400 mb-8">
            Let&apos;s discuss your project. First consultation is always free.
          </p>
          <Link href="/contact" className="btn-cyber">
            Start a Conversation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
