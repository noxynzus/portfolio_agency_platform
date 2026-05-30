'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Github, Twitter, Linkedin, ChevronDown } from 'lucide-react'

const typingPhrases = [
  'Web Applications',
  'Enterprise Systems',
  'AI Solutions',
  'SaaS Platforms',
  'POS Systems',
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const target = typingPhrases[phraseIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText.length < target.length) {
      timeout = setTimeout(() => {
        setDisplayText(target.slice(0, displayText.length + 1))
      }, 75)
    } else if (!isDeleting && displayText.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, 35)
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false)
      setPhraseIndex((i) => (i + 1) % typingPhrases.length)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, phraseIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyber-black">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Radial vignette over grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #050816 100%)',
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-32 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '-4s',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 my-5">
        {/* Availability badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-8"
        >
          <span className="section-eyebrow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-cyan" />
            </span>
            Available for new projects
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="font-display font-bold tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', lineHeight: 1.05 }}
        >
          <span className="block text-white">We Build Modern</span>
          <span className="block mt-1">
            <span className="neon-text">{displayText}</span>
            <span className="inline-block w-0.5 bg-cyber-cyan ml-1 align-middle animate-pulse" style={{ height: '0.9em' }} />
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.25}
          className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Premium Digital Engineering Studio crafting scalable web applications,
          enterprise systems, and AI-powered solutions that drive{' '}
          <span className="text-white font-medium">real business growth.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.35}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link href="/contact" className="btn-cyber text-base">
            Start Your Project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/portfolio" className="btn-ghost text-base">
            View Our Work
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="flex items-center justify-center gap-8 sm:gap-16 mb-12"
        >
          {[
            { value: '50+', label: 'Projects' },
            { value: '5.0', label: 'Rating' },
            { value: '3yr+', label: 'Experience' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold neon-text-cyan">
                {value}
              </div>
              <div className="text-gray-500 text-xs mt-1 tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="flex items-center justify-center gap-3"
        >
          {[
            { icon: Github, href: '#', label: 'GitHub' },
            { icon: Twitter, href: '#', label: 'Twitter' },
            { icon: Linkedin, href: '#', label: 'LinkedIn' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="p-2.5 text-gray-500 hover:text-cyber-cyan border border-white/[0.08] hover:border-cyber-cyan/25 rounded-lg transition-all duration-200 hover:bg-cyber-cyan/5"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
          
        </motion.div>
        <span className="text-gray-600 text-xs ml-2 mt-5">Follow our journey</span>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 "
      >
        <span className="text-[0.65rem] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
