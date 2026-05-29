'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createLead } from '@/lib/actions/leads'
import { toast } from 'sonner'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@techforge.dev', href: 'mailto:hello@techforge.dev' },
  { icon: Phone, label: 'Phone', value: '+66 8 0000 0000', href: 'tel:+66800000000' },
  { icon: MapPin, label: 'Location', value: 'Bangkok, Thailand', href: '#' },
  { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: '#' },
]

const budgetOptions = ['< ฿50,000', '฿50k – ฿150k', '฿150k – ฿350k', '> ฿350k', "Let's discuss"]
const serviceOptions = ['Web Application', 'Enterprise System', 'POS System', 'SaaS Platform', 'AI Integration', 'UI/UX Design', 'Other']

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Prepare FormData
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('company', form.company)
      
      // Combine service and budget into message if selected
      let fullMessage = form.message
      if (form.service) {
        fullMessage = `Service: ${form.service}\n` + fullMessage
      }
      if (form.budget) {
        fullMessage = `Budget: ${form.budget}\n` + fullMessage
      }
      
      formData.append('message', fullMessage)
      formData.append('source', 'contact-form')

      // Submit to server
      const result = await createLead(formData)

      if (result.success) {
        setSubmitted(true)
        toast.success('Message sent successfully!', {
          description: 'We\'ll get back to you within 24 hours.',
        })
      } else {
        setError(result.error || 'Something went wrong')
        toast.error('Failed to send message', {
          description: result.error || 'Please try again later.',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-5"
          >
            Start Your{' '}
            <span className="neon-text">Project</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Tell us about your project and we&apos;ll get back to you within 24 hours with a free consultation.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-2">Contact Details</h2>
              <p className="text-gray-500 text-sm">Reach out via any channel — we respond fast.</p>
            </div>

            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-white/[0.07] hover:border-cyber-cyan/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-cyber-cyan" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs">{label}</div>
                  <div className="text-white text-sm font-medium group-hover:text-cyber-cyan transition-colors">{value}</div>
                </div>
              </motion.a>
            ))}

            <div className="p-5 rounded-xl border border-cyber-cyan/10 bg-cyber-cyan/3">
              <p className="text-cyber-cyan text-sm font-medium mb-1">🎯 Free Consultation</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Every project starts with a free 30-minute discovery call. No commitment required.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-3">Message Sent Successfully!</h2>
                <p className="text-gray-400 max-w-sm mb-6">
                  Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      budget: '',
                      service: '',
                      message: '',
                    })
                  }}
                  className="text-cyber-cyan hover:underline text-sm font-medium"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-cyber-cyan">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoFocus
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={isSubmitting}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 focus:bg-cyber-cyan/3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      disabled={isSubmitting}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 focus:bg-cyber-cyan/3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-cyber-cyan">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 focus:bg-cyber-cyan/3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="+66 8 0000 0000"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 focus:bg-cyber-cyan/3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-cyber-black border border-white/[0.1] rounded-xl text-gray-300 text-sm focus:outline-none focus:border-cyber-cyan/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select service...</option>
                      {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-cyber-black border border-white/[0.1] rounded-xl text-gray-300 text-sm focus:outline-none focus:border-cyber-cyan/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select budget...</option>
                      {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Details <span className="text-cyber-cyan">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="Tell us about your project: what you're building, your goals, timeline, and any specific requirements..."
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyber-cyan/40 focus:bg-cyber-cyan/3 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-cyber w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
