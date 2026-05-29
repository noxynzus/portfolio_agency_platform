'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@prisma/client';
import Image from 'next/image';

// Helper functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    '#00F5FF', // cyan
    '#8B5CF6', // purple
    '#06B6D4', // teal
    '#F59E0B', // amber
    '#EC4899', // pink
    '#10B981', // emerald
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsClient({
  testimonials,
}: TestimonialsClientProps) {
  return (
    <section className="py-24 bg-cyber-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      {/* Ambient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(0,245,255,0.03) 0%, transparent 70%)',
        }}
      />

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
            Client Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-5"
          >
            What Our <span className="neon-text">Clients Say</span>
          </motion.h2>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const initials = getInitials(t.name);
            const avatarColor = getAvatarColor(t.name);

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-2xl p-7 glass border border-white/[0.07] card-glow flex flex-col gap-5"
              >
                {/* Quote icon */}
                <Quote
                  className="w-8 h-8 opacity-20 flex-shrink-0"
                  style={{ color: avatarColor }}
                />

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                      width={40}
                      height={40}
                      unoptimized={true}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                      style={{
                        background: `${avatarColor}20`,
                        border: `1px solid ${avatarColor}30`,
                        color: avatarColor,
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>

                {/* Accent glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top left, ${avatarColor}05, transparent 60%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
