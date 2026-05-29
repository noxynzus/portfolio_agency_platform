import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  
  // ============================================
  // 1. Create Admin User
  // ============================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })
  console.log('✅ Admin user:', admin.email)
  
  // ============================================
  // 2. Seed Projects
  // ============================================
  const projectsData = [
    {
      title: 'NexusERP — Enterprise Resource Planning',
      slug: 'nexus-erp',
      description: 'Full-scale ERP system for a 500+ employee manufacturing company featuring real-time inventory tracking, HR management, financial modules, and a customizable reporting engine.',
      category: 'Enterprise System',
      tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Prisma', 'tRPC'],
      gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      accentColor: '#00F5FF',
      featured: true,
      published: true,
      metrics: {
        Users: '500+',
        Efficiency: '+40%',
        'Cost Saved': '$200k'
      },
      order: 0
    },
    {
      title: 'FoodFlow POS — Restaurant Management',
      slug: 'foodflow-pos',
      description: 'Complete POS and delivery management system for a multi-branch restaurant chain with real-time order tracking, kitchen display, inventory, and customer loyalty program.',
      category: 'POS System',
      tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Stripe'],
      gradient: 'from-purple-500/20 via-pink-600/10 to-transparent',
      accentColor: '#8B5CF6',
      featured: true,
      published: true,
      metrics: {
        'Orders/day': '1,200+',
        Branches: '12',
        'Revenue +': '25%'
      },
      order: 1
    },
    {
      title: 'AnalyticsPro — SaaS Dashboard',
      slug: 'analytics-pro',
      description: 'Multi-tenant analytics SaaS platform with real-time data visualization, AI-powered insights, custom report builder, and white-label capabilities for B2B clients.',
      category: 'SaaS Platform',
      tech: ['Next.js', 'tRPC', 'Prisma', 'Recharts', 'OpenAI', 'Vercel'],
      gradient: 'from-emerald-500/20 via-teal-600/10 to-transparent',
      accentColor: '#06B6D4',
      featured: true,
      published: true,
      metrics: {
        'Active Users': '10k+',
        'Data Points': '1M/day',
        Uptime: '99.9%'
      },
      order: 2
    },
    {
      title: 'MedConnect — Healthcare Portal',
      slug: 'medconnect',
      description: 'Telemedicine platform connecting patients with doctors. Includes appointment booking, video consultations, e-prescriptions, and medical records management.',
      category: 'SaaS Platform',
      tech: ['Next.js', 'WebRTC', 'PostgreSQL', 'Twilio', 'AWS'],
      gradient: 'from-blue-500/20 via-indigo-600/10 to-transparent',
      accentColor: '#3B82F6',
      featured: false,
      published: true,
      metrics: {
        Consultations: '5k/mo',
        Doctors: '200+',
        Satisfaction: '98%'
      },
      order: 3
    },
    {
      title: 'ShopCore — E-Commerce Platform',
      slug: 'shopcore',
      description: 'High-performance e-commerce platform with headless architecture, real-time inventory sync, multi-currency checkout, and AI-powered product recommendations.',
      category: 'E-Commerce',
      tech: ['Next.js', 'Stripe', 'Sanity CMS', 'Algolia', 'Vercel Edge'],
      gradient: 'from-orange-500/20 via-red-600/10 to-transparent',
      accentColor: '#F97316',
      featured: false,
      published: true,
      metrics: {
        Products: '50k+',
        Conversion: '+32%',
        LCP: '<1.5s'
      },
      order: 4
    }
  ]
  
  for (const project of projectsData) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project
    })
  }
  console.log(`✅ Seeded ${projectsData.length} projects`)
  
  // ============================================
  // 3. Seed Services
  // ============================================
  const servicesData = [
    {
      title: 'Web Application',
      slug: 'web-app',
      description: 'High-performance web applications built with modern frameworks. From MVPs to enterprise-scale systems.',
      iconName: 'Monitor',
      variant: 'cyan',
      features: ['Next.js & React', 'TypeScript', 'RESTful & GraphQL APIs', 'Real-time features'],
      order: 0,
      published: true
    },
    {
      title: 'Enterprise System',
      slug: 'enterprise',
      description: 'Robust enterprise solutions: ERP, CRM, inventory, HR, and custom workflow automation systems.',
      iconName: 'Building2',
      variant: 'purple',
      features: ['ERP & CRM Systems', 'Role-based Access', 'Audit Logging', 'System Integration'],
      order: 1,
      published: true
    },
    {
      title: 'POS System',
      slug: 'pos',
      description: 'Complete point-of-sale and restaurant management systems with real-time sync, delivery, and loyalty.',
      iconName: 'ShoppingCart',
      variant: 'teal',
      features: ['Multi-branch Support', 'Kitchen Display', 'Inventory Sync', 'Payment Gateway'],
      order: 2,
      published: true
    },
    {
      title: 'SaaS Platform',
      slug: 'saas',
      description: 'End-to-end SaaS product development: multi-tenancy, billing, analytics, and white-labeling.',
      iconName: 'Cloud',
      variant: 'cyan',
      features: ['Multi-tenancy', 'Stripe Billing', 'Usage Analytics', 'White-label Ready'],
      order: 3,
      published: true
    },
    {
      title: 'AI Integration',
      slug: 'ai',
      description: 'Intelligent AI features: chatbots, automation workflows, document processing, and predictive analytics.',
      iconName: 'Cpu',
      variant: 'purple',
      features: ['OpenAI / LLM', 'Chatbot & RAG', 'Workflow Automation', 'Data Extraction'],
      order: 4,
      published: true
    },
    {
      title: 'UI/UX Design',
      slug: 'uiux',
      description: 'Premium UI/UX design: design systems, prototypes, and pixel-perfect implementation with Figma.',
      iconName: 'Palette',
      variant: 'teal',
      features: ['Design System', 'Figma Prototype', 'User Research', 'Accessibility (WCAG)'],
      order: 5,
      published: true
    },
    {
      title: 'API Development',
      slug: 'api',
      description: 'Scalable, secure API architecture with documentation, versioning, rate limiting, and monitoring.',
      iconName: 'GitBranch',
      variant: 'cyan',
      features: ['RESTful / GraphQL', 'OpenAPI Docs', 'Rate Limiting', 'Webhook Support'],
      order: 6,
      published: true
    },
    {
      title: 'Cloud Infrastructure',
      slug: 'cloud',
      description: 'DevOps and cloud setup: CI/CD pipelines, containerization, auto-scaling, and 99.9% uptime SLAs.',
      iconName: 'Server',
      variant: 'purple',
      features: ['AWS / Vercel / GCP', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Monitoring & Alerts'],
      order: 7,
      published: true
    }
  ]
  
  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    })
  }
  console.log(`✅ Seeded ${servicesData.length} services`)
  
  // ============================================
  // 4. Seed Pricing Plans
  // ============================================
  const pricingData = [
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Perfect for landing pages, simple web apps, and MVPs.',
      price: '฿49,000',
      period: 'project',
      features: [
        'Up to 10 pages',
        'Responsive design',
        'CMS integration',
        'SEO optimization',
        'Contact form',
        '1 month support'
      ],
      recommended: false,
      order: 0,
      published: true
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Ideal for growing businesses needing full-featured web systems.',
      price: '฿149,000',
      period: 'project',
      features: [
        'Unlimited pages',
        'Custom backend API',
        'Admin dashboard',
        'User authentication',
        'Third-party integrations',
        'Analytics dashboard',
        '3 months support',
        'Performance optimization'
      ],
      recommended: true,
      order: 1,
      published: true
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'For complex enterprise systems requiring scalability and security.',
      price: '฿349,000',
      period: 'project',
      features: [
        'Everything in Business',
        'ERP / SaaS architecture',
        'Multi-tenancy',
        'AI integration',
        'Custom workflows',
        'Load balancing',
        'Security audit',
        '12 months support'
      ],
      recommended: false,
      order: 2,
      published: true
    },
    {
      name: 'Custom',
      slug: 'custom',
      description: 'Tailored pricing for unique or long-term project requirements.',
      price: 'Custom',
      period: 'quote',
      features: [
        'Flexible scope',
        'Dedicated team',
        'On-site collaboration',
        'SLA guarantee',
        'Priority support',
        'Ongoing retainer'
      ],
      recommended: false,
      order: 3,
      published: true
    }
  ]
  
  for (const plan of pricingData) {
    await prisma.pricingPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan
    })
  }
  console.log(`✅ Seeded ${pricingData.length} pricing plans`)
  
  // ============================================
  // 5. Seed Testimonials
  // ============================================
  const testimonialsData = [
    {
      id: 'testimonial-1',
      name: 'Krit Wongwisan',
      role: 'CTO',
      company: 'TechVentures Thailand',
      content: 'Atthawat delivered our SaaS platform 2 weeks ahead of schedule. The code quality and architecture are exceptional — exactly what we needed to scale to 10,000 users.',
      avatar: null,
      rating: 5,
      order: 0,
      published: true
    },
    {
      id: 'testimonial-2',
      name: 'Panida Srisuk',
      role: 'Founder',
      company: 'FoodChain Group',
      content: "The POS system they built transformed our operations across 12 branches. Real-time sync, beautiful UI, and the support has been outstanding. Best investment we've made.",
      avatar: null,
      rating: 5,
      order: 1,
      published: true
    },
    {
      id: 'testimonial-3',
      name: 'Marcus Chen',
      role: 'VP Engineering',
      company: 'Nexus Corp',
      content: 'We needed an ERP that fit our complex manufacturing workflow. Atthawat nailed it. 40% efficiency improvement and the team actually understood our business domain.',
      avatar: null,
      rating: 5,
      order: 2,
      published: true
    }
  ]
  
  for (const testimonial of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: {},
      create: testimonial
    })
  }
  console.log(`✅ Seeded ${testimonialsData.length} testimonials`)
  
  // ============================================
  // 6. Create Site Settings
  // ============================================
  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      id: 'site-settings',
      email: 'hello@techforge.dev',
      phone: '+66 80 000 0000',
      siteName: 'TechForge',
      siteDescription: 'Modern Digital Engineering Studio — Building Scalable, Modern Systems that Drive Business Growth',
      siteUrl: 'https://techforge.dev',
      facebook: 'https://facebook.com/techforge',
      twitter: 'https://twitter.com/techforge',
      linkedin: 'https://linkedin.com/company/techforge',
      github: 'https://github.com/techforge',
      maintenanceMode: false
    }
  })
  console.log('✅ Site settings created')
  
  console.log('\n🎉 Seed completed successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - Admin user: ${admin.email}`)
  console.log(`   - Projects: ${projectsData.length}`)
  console.log(`   - Services: ${servicesData.length}`)
  console.log(`   - Pricing plans: ${pricingData.length}`)
  console.log(`   - Testimonials: ${testimonialsData.length}`)
  console.log(`   - Site settings: ✓`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
