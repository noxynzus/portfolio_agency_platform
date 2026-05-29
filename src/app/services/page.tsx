import { motion } from 'framer-motion'
import Link from 'next/link'
import { Monitor, Building2, ShoppingCart, Cloud, Cpu, Palette, GitBranch, Server, ArrowRight, Check } from 'lucide-react'
import { getServices } from '@/lib/actions/services'
import ServicesClient from './ServicesClient'

export const metadata = {
  title: 'Services - UI/UX Pro Max',
  description: 'End-to-end digital product engineering — from strategy and design to development, deployment, and ongoing support.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function ServicesPage() {
  const result = await getServices({ published: true })
  const services = result.success ? result.data || [] : []
  
  return <ServicesClient services={services} />
}
