'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Monitor,
  Building2,
  ShoppingCart,
  Cloud,
  Cpu,
  Palette,
  GitBranch,
  Server,
  ArrowRight,
  Check,
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

interface ServicesClientProps {
  services: Service[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  return (
    <div className="min-h-screen bg-cyber-black pt-20">
      {/* Hero */}
      <div className="relative py-20 bg-cyber-dark border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow mb-4 inline-flex"
          >
            What We Offer
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5"
          >
            Our <span className="neon-text">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            End-to-end digital product engineering — from strategy and design to
            development, deployment, and ongoing support.
          </motion.p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">No services available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {services.map((service, i) => {
              const Icon = iconMap[service.iconName] ?? Monitor;
              const isEven = i % 2 === 0;
              const variantColor =
                service.variant === 'cyan'
                  ? '#00F5FF'
                  : service.variant === 'purple'
                  ? '#8B5CF6'
                  : '#06B6D4';

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Text */}
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 border"
                      style={{
                        background: `${variantColor}10`,
                        borderColor: `${variantColor}20`,
                        color: variantColor,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <Check
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: variantColor }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: variantColor }}
                    >
                      Get started with {service.title}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Visual card */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div
                      className="rounded-2xl p-8 glass border h-64 flex items-center justify-center relative overflow-hidden"
                      style={{ borderColor: `${variantColor}15` }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at center, ${variantColor}10, transparent 70%)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-grid-sm opacity-40" />
                      <Icon
                        className="w-24 h-24 opacity-[0.06]"
                        style={{ color: variantColor }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: variantColor }}
                      >
                        <Icon className="w-16 h-16 opacity-20" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-white/[0.06] bg-cyber-dark py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Not sure what you need?
          </h2>
          <p className="text-gray-400 mb-8">
            Book a free 30-minute consultation and we&apos;ll help you figure out
            the best approach for your project.
          </p>
          <Link href="/contact" className="btn-cyber">
            Book Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
