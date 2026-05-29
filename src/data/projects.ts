import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'NexusERP — Enterprise Resource Planning',
    description:
      'Full-scale ERP system for a 500+ employee manufacturing company featuring real-time inventory tracking, HR management, financial modules, and a customizable reporting engine.',
    category: 'Enterprise System',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Prisma', 'tRPC'],
    gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
    accentColor: '#00F5FF',
    slug: 'nexus-erp',
    featured: true,
    metrics: [
      { label: 'Users', value: '500+' },
      { label: 'Efficiency', value: '+40%' },
      { label: 'Cost Saved', value: '$200k' },
    ],
  },
  {
    id: '2',
    title: 'FoodFlow POS — Restaurant Management',
    description:
      'Complete POS and delivery management system for a multi-branch restaurant chain with real-time order tracking, kitchen display, inventory, and customer loyalty program.',
    category: 'POS System',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Stripe'],
    gradient: 'from-purple-500/20 via-pink-600/10 to-transparent',
    accentColor: '#8B5CF6',
    slug: 'foodflow-pos',
    featured: true,
    metrics: [
      { label: 'Orders/day', value: '1,200+' },
      { label: 'Branches', value: '12' },
      { label: 'Revenue +', value: '25%' },
    ],
  },
  {
    id: '3',
    title: 'AnalyticsPro — SaaS Dashboard',
    description:
      'Multi-tenant analytics SaaS platform with real-time data visualization, AI-powered insights, custom report builder, and white-label capabilities for B2B clients.',
    category: 'SaaS Platform',
    tech: ['Next.js', 'tRPC', 'Prisma', 'Recharts', 'OpenAI', 'Vercel'],
    gradient: 'from-emerald-500/20 via-teal-600/10 to-transparent',
    accentColor: '#06B6D4',
    slug: 'analytics-pro',
    featured: true,
    metrics: [
      { label: 'Active Users', value: '10k+' },
      { label: 'Data Points', value: '1M/day' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    id: '4',
    title: 'MedConnect — Healthcare Portal',
    description:
      'Telemedicine platform connecting patients with doctors. Includes appointment booking, video consultations, e-prescriptions, and medical records management.',
    category: 'SaaS Platform',
    tech: ['Next.js', 'WebRTC', 'PostgreSQL', 'Twilio', 'AWS'],
    gradient: 'from-blue-500/20 via-indigo-600/10 to-transparent',
    accentColor: '#3B82F6',
    slug: 'medconnect',
    featured: false,
    metrics: [
      { label: 'Consultations', value: '5k/mo' },
      { label: 'Doctors', value: '200+' },
      { label: 'Satisfaction', value: '98%' },
    ],
  },
  {
    id: '5',
    title: 'ShopCore — E-Commerce Platform',
    description:
      'High-performance e-commerce platform with headless architecture, real-time inventory sync, multi-currency checkout, and AI-powered product recommendations.',
    category: 'E-Commerce',
    tech: ['Next.js', 'Stripe', 'Sanity CMS', 'Algolia', 'Vercel Edge'],
    gradient: 'from-orange-500/20 via-red-600/10 to-transparent',
    accentColor: '#F97316',
    slug: 'shopcore',
    featured: false,
    metrics: [
      { label: 'Products', value: '50k+' },
      { label: 'Conversion', value: '+32%' },
      { label: 'LCP', value: '<1.5s' },
    ],
  },
  {
    id: '6',
    title: 'AutoFlow — AI Workflow Automation',
    description:
      'No-code AI workflow automation platform allowing businesses to build complex automation pipelines with natural language, connecting 100+ apps and services.',
    category: 'AI',
    tech: ['Next.js', 'LangChain', 'OpenAI', 'Python', 'PostgreSQL', 'Bull'],
    gradient: 'from-violet-500/20 via-purple-600/10 to-transparent',
    accentColor: '#7C3AED',
    slug: 'autoflow-ai',
    featured: false,
    metrics: [
      { label: 'Automations', value: '10k+' },
      { label: 'Time Saved', value: '80%' },
      { label: 'Integrations', value: '100+' },
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
