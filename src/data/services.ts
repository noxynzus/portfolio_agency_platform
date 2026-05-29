import type { Service, PricingPlan, Testimonial } from '@/types'

export const services: Service[] = [
  {
    id: 'web-app',
    iconName: 'Monitor',
    title: 'Web Application',
    description:
      'High-performance web applications built with modern frameworks. From MVPs to enterprise-scale systems.',
    features: [
      'Next.js & React',
      'TypeScript',
      'RESTful & GraphQL APIs',
      'Real-time features',
    ],
    variant: 'cyan',
  },
  {
    id: 'enterprise',
    iconName: 'Building2',
    title: 'Enterprise System',
    description:
      'Robust enterprise solutions: ERP, CRM, inventory, HR, and custom workflow automation systems.',
    features: [
      'ERP & CRM Systems',
      'Role-based Access',
      'Audit Logging',
      'System Integration',
    ],
    variant: 'purple',
  },
  {
    id: 'pos',
    iconName: 'ShoppingCart',
    title: 'POS System',
    description:
      'Complete point-of-sale and restaurant management systems with real-time sync, delivery, and loyalty.',
    features: [
      'Multi-branch Support',
      'Kitchen Display',
      'Inventory Sync',
      'Payment Gateway',
    ],
    variant: 'teal',
  },
  {
    id: 'saas',
    iconName: 'Cloud',
    title: 'SaaS Platform',
    description:
      'End-to-end SaaS product development: multi-tenancy, billing, analytics, and white-labeling.',
    features: [
      'Multi-tenancy',
      'Stripe Billing',
      'Usage Analytics',
      'White-label Ready',
    ],
    variant: 'cyan',
  },
  {
    id: 'ai',
    iconName: 'Cpu',
    title: 'AI Integration',
    description:
      'Intelligent AI features: chatbots, automation workflows, document processing, and predictive analytics.',
    features: [
      'OpenAI / LLM',
      'Chatbot & RAG',
      'Workflow Automation',
      'Data Extraction',
    ],
    variant: 'purple',
  },
  {
    id: 'uiux',
    iconName: 'Palette',
    title: 'UI/UX Design',
    description:
      'Premium UI/UX design: design systems, prototypes, and pixel-perfect implementation with Figma.',
    features: [
      'Design System',
      'Figma Prototype',
      'User Research',
      'Accessibility (WCAG)',
    ],
    variant: 'teal',
  },
  {
    id: 'api',
    iconName: 'GitBranch',
    title: 'API Development',
    description:
      'Scalable, secure API architecture with documentation, versioning, rate limiting, and monitoring.',
    features: [
      'RESTful / GraphQL',
      'OpenAPI Docs',
      'Rate Limiting',
      'Webhook Support',
    ],
    variant: 'cyan',
  },
  {
    id: 'cloud',
    iconName: 'Server',
    title: 'Cloud Infrastructure',
    description:
      'DevOps and cloud setup: CI/CD pipelines, containerization, auto-scaling, and 99.9% uptime SLAs.',
    features: [
      'AWS / Vercel / GCP',
      'Docker & Kubernetes',
      'CI/CD Pipelines',
      'Monitoring & Alerts',
    ],
    variant: 'purple',
  },
]

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '฿49,000',
    period: 'project',
    description: 'Perfect for landing pages, simple web apps, and MVPs.',
    features: [
      'Up to 10 pages',
      'Responsive design',
      'CMS integration',
      'SEO optimization',
      'Contact form',
      '1 month support',
    ],
    excluded: ['Custom backend', 'Advanced integrations', 'Admin dashboard'],
    highlighted: false,
    cta: 'Get Started',
  },
  {
    id: 'business',
    name: 'Business',
    price: '฿149,000',
    period: 'project',
    description: 'Ideal for growing businesses needing full-featured web systems.',
    features: [
      'Unlimited pages',
      'Custom backend API',
      'Admin dashboard',
      'User authentication',
      'Third-party integrations',
      'Analytics dashboard',
      '3 months support',
      'Performance optimization',
    ],
    excluded: ['AI features', 'Enterprise SLA'],
    highlighted: true,
    cta: 'Most Popular',
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '฿349,000',
    period: 'project',
    description: 'For complex enterprise systems requiring scalability and security.',
    features: [
      'Everything in Business',
      'ERP / SaaS architecture',
      'Multi-tenancy',
      'AI integration',
      'Custom workflows',
      'Load balancing',
      'Security audit',
      '12 months support',
    ],
    excluded: [],
    highlighted: false,
    cta: 'Contact Sales',
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 'Custom',
    period: 'quote',
    description: 'Tailored pricing for unique or long-term project requirements.',
    features: [
      'Flexible scope',
      'Dedicated team',
      'On-site collaboration',
      'SLA guarantee',
      'Priority support',
      'Ongoing retainer',
    ],
    excluded: [],
    highlighted: false,
    cta: 'Get a Quote',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Krit Wongwisan',
    role: 'CTO',
    company: 'TechVentures Thailand',
    text: 'Atthawat delivered our SaaS platform 2 weeks ahead of schedule. The code quality and architecture are exceptional — exactly what we needed to scale to 10,000 users.',
    rating: 5,
    initials: 'KW',
    avatarColor: '#00F5FF',
  },
  {
    id: '2',
    name: 'Panida Srisuk',
    role: 'Founder',
    company: 'FoodChain Group',
    text: "The POS system they built transformed our operations across 12 branches. Real-time sync, beautiful UI, and the support has been outstanding. Best investment we've made.",
    rating: 5,
    initials: 'PS',
    avatarColor: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Marcus Chen',
    role: 'VP Engineering',
    company: 'Nexus Corp',
    text: 'We needed an ERP that fit our complex manufacturing workflow. Atthawat nailed it. 40% efficiency improvement and the team actually understood our business domain.',
    rating: 5,
    initials: 'MC',
    avatarColor: '#06B6D4',
  },
]
