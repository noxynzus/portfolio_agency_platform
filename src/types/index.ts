export interface Project {
  id: string
  title: string
  description: string
  category: string
  tech: string[]
  gradient: string
  accentColor: string
  slug: string
  featured: boolean
  metrics?: { label: string; value: string }[]
  liveUrl?: string
  githubUrl?: string
  longDescription?: string
  challenges?: string[]
  solution?: string
  client?: string
  year?: string
}

export interface Service {
  id: string
  iconName: string
  title: string
  description: string
  features: string[]
  variant: 'cyan' | 'purple' | 'teal'
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  excluded: string[]
  highlighted: boolean
  cta: string
  badge?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  rating: number
  initials: string
  avatarColor: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string | null
  tags: string[]
  author: string
  published: boolean
  publishedAt: Date | null
  views: number
  createdAt: Date
  updatedAt: Date
  metaTitle?: string | null
  metaDescription?: string | null
}
