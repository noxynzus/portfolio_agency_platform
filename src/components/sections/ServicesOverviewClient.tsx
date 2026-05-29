'use client';

import { motion } from 'framer-motion';
import {
  Monitor,
  Building2,
  ShoppingCart,
  Cloud,
  Cpu,
  Palette,
  GitBranch,
  Server,
} from 'lucide-react';
import type { Service } from '@prisma/client';

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Building2,
  ShoppingCart,
  Cloud,
  Cpu,
  Palette,
  GitBranch,
  Server,
};

const variantStyles = {
  cyan: {
    icon: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20',
    glow: 'rgba(0,245,255,0.06)',
    border: 'rgba(0,245,255,0.12)',
  },
  purple: {
    icon: 'text-cyber-purple-light bg-cyber-purple/10 border-cyber-purple/20',
    glow: 'rgba(124,58,237,0.06)',
    border: 'rgba(124,58,237,0.12)',
  },
  teal: {
    icon: 'text-cyber-teal bg-cyber-teal/10 border-cyber-teal/20',
    glow: 'rgba(6,182,212,0.06)',
    border: 'rgba(6,182,212,0.12)',
  },
};

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = iconMap[service.iconName] ?? Monitor;
  const styles =
    variantStyles[service.variant as keyof typeof variantStyles] ||
    variantStyles.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-xl p-6 glass card-glow cursor-default"
      style={{ borderColor: styles.border }}
    >
      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-4 ${styles.icon}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-display font-semibold text-base text-white mb-2 group-hover:text-cyber-cyan transition-colors duration-200">
        {service.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {service.description}
      </p>

      <ul className="space-y-1.5">
        {service.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-xs text-gray-500"
          >
            <span className="w-1 h-1 rounded-full bg-cyber-cyan/50 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Hover glow bg */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${styles.glow}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

interface ServicesOverviewClientProps {
  services: Service[];
}

export default function ServicesOverviewClient({
  services,
}: ServicesOverviewClientProps) {
  return (
    <section className="py-24 bg-cyber-black relative">
      <div className="absolute inset-0 bg-grid-sm opacity-30 pointer-events-none" />

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
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-5"
          >
            Services We <span className="neon-text">Specialize In</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            From concept to production — we cover the full spectrum of modern
            digital product engineering.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
