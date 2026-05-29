'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What types of projects does Atthawat Studio specialize in?',
        a: 'We specialize in web applications, enterprise management systems, POS systems, SaaS platforms, e-commerce solutions, and AI-powered products. We primarily work with businesses in Thailand and Southeast Asia, but serve clients globally.',
      },
      {
        q: 'How long does a typical project take?',
        a: 'Timelines vary by project scope. A landing page typically takes 2–3 weeks. A web application takes 4–12 weeks. Enterprise systems range from 3–9 months. We provide a detailed timeline estimate after the discovery call.',
      },
      {
        q: 'Do you work with international clients?',
        a: 'Yes. While we are based in Bangkok, we work with clients across the globe. Our team is fluent in Thai and English, and we use async-first workflows to accommodate different time zones.',
      },
    ],
  },
  {
    category: 'Pricing & Process',
    items: [
      {
        q: 'How do you price projects?',
        a: 'We offer fixed-price packages for well-defined projects (Starter, Business, Enterprise tiers) and time-and-materials engagement for ongoing work. Custom enterprise projects are quoted individually. Pricing is always transparent with no hidden fees.',
      },
      {
        q: 'What is included in the free consultation?',
        a: 'Our 30-minute discovery call covers your business goals, technical requirements, budget range, and timeline expectations. We will share our initial thoughts and recommendations at no cost.',
      },
      {
        q: 'Do you require a deposit?',
        a: 'Yes. Fixed-price projects require a 50% deposit to begin work, with the remaining 50% due on project completion. For ongoing retainers, we invoice monthly.',
      },
      {
        q: 'Can I upgrade from one plan to another?',
        a: 'Absolutely. We design all systems with scalability in mind. You can start with the Starter package and grow into Business or Enterprise as your needs evolve.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What technology stack do you use?',
        a: 'Our primary stack is Next.js, React, TypeScript, Node.js, PostgreSQL/MySQL, and cloud services like Vercel and AWS. For AI integrations we use OpenAI and Anthropic APIs. We choose the right tools for each specific project rather than forcing one stack.',
      },
      {
        q: 'Do you provide hosting and infrastructure?',
        a: 'Yes. We can set up and manage cloud infrastructure (Vercel, AWS, DigitalOcean) as part of our service. We also assist with domain configuration, SSL, and CDN setup.',
      },
      {
        q: 'Will I own the source code?',
        a: 'Yes, 100%. Once the project is complete and final payment is made, all source code and intellectual property transfers to you. We will deliver everything via a private GitHub/GitLab repository.',
      },
      {
        q: 'How do you handle security?',
        a: 'Security is baked in from day one. We follow OWASP best practices, implement proper authentication (OAuth, JWT), use parameterized queries to prevent SQL injection, and conduct security reviews before launch.',
      },
    ],
  },
  {
    category: 'Support',
    items: [
      {
        q: 'Do you offer post-launch support?',
        a: 'Yes. Every project includes a 30-day post-launch warranty for bug fixes. After that, we offer monthly retainer plans for ongoing maintenance, feature development, and priority support.',
      },
      {
        q: 'What is your typical response time for support?',
        a: 'For clients on a support retainer, we respond within 4 business hours. For critical production issues, we aim to respond within 1 hour. General inquiries are responded to within 24 hours.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = faqs
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          search === '' ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((s) => s.items.length > 0)

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
            Help Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5"
          >
            Frequently Asked{' '}
            <span className="neon-text">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-8"
          >
            Everything you need to know about working with us.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 transition-all"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No questions matching &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((section) => (
              <div key={section.category}>
                <h2 className="font-display text-lg font-bold text-cyber-cyan mb-4 border-b border-cyber-cyan/10 pb-3">
                  {section.category}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item, i) => {
                    const key = `${section.category}-${i}`
                    const isOpen = openItem === key
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl glass border border-white/[0.07] overflow-hidden"
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 text-left gap-4"
                          onClick={() => setOpenItem(isOpen ? null : key)}
                          aria-expanded={isOpen}
                        >
                          <span className="font-medium text-white text-sm leading-snug">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 flex-shrink-0 text-cyber-cyan transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a href="/contact" className="btn-cyber inline-flex">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
