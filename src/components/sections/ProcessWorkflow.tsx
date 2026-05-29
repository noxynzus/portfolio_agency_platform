'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: 1,
    title: 'Discovery',
    description: 'We dive deep into your business goals, user needs, and technical requirements to set a solid foundation.',
    color: '#00F5FF',
  },
  {
    step: 2,
    title: 'Planning',
    description: 'Architecture design, sprint roadmap, tech stack selection, and resource planning for the project.',
    color: '#22D3EE',
  },
  {
    step: 3,
    title: 'UI/UX Design',
    description: 'Wireframes, design system, and high-fidelity prototypes crafted for optimal user experience.',
    color: '#06B6D4',
  },
  {
    step: 4,
    title: 'Development',
    description: 'Agile sprints with daily updates, code reviews, and continuous integration pipelines.',
    color: '#8B5CF6',
  },
  {
    step: 5,
    title: 'Testing',
    description: 'Comprehensive QA: unit tests, E2E testing, performance audits, and security scanning.',
    color: '#7C3AED',
  },
  {
    step: 6,
    title: 'Deployment',
    description: 'Zero-downtime deployment on scalable cloud infrastructure with monitoring and alerting.',
    color: '#6D28D9',
  },
  {
    step: 7,
    title: 'Support',
    description: 'Post-launch maintenance, performance monitoring, feature iterations, and 24/7 support.',
    color: '#5B21B6',
  },
]

export default function ProcessWorkflow() {
  return (
    <section className="py-24 bg-cyber-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow mb-4 inline-flex"
          >
            How We Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-5"
          >
            Our{' '}
            <span className="neon-text-purple">Process</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            A battle-tested 7-step process that delivers on time, on budget,
            and beyond expectations.
          </motion.p>
        </div>

        {/* Steps — desktop horizontal, mobile vertical */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[2.2rem] left-[calc(100%/14)] right-[calc(100%/14)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 lg:gap-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center"
              >
                {/* Step circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className="relative w-11 h-11 rounded-full flex items-center justify-center border text-sm font-bold font-display z-10"
                    style={{
                      borderColor: `${step.color}40`,
                      background: `${step.color}10`,
                      color: step.color,
                      boxShadow: `0 0 20px ${step.color}20`,
                    }}
                  >
                    {step.step}
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping-slow opacity-20"
                    style={{ background: step.color }}
                  />
                </div>

                {/* Text */}
                <div className="lg:mt-4 lg:px-1">
                  <h3
                    className="font-display font-semibold text-sm mb-1.5"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
