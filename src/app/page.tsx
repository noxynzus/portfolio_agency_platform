import Hero from '@/components/sections/Hero'
import TrustedBy from '@/components/sections/TrustedBy'
import ServicesOverview from '@/components/sections/ServicesOverview'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import ProcessWorkflow from '@/components/sections/ProcessWorkflow'
import PricingPreview from '@/components/sections/PricingPreview'
import Testimonials from '@/components/sections/Testimonials'
import CTASection from '@/components/sections/CTASection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atthawat Studio | Premium Digital Engineering',
  description:
    'Premium Digital Engineering Studio. We build scalable web applications, enterprise systems, SaaS platforms, and AI-powered solutions that drive real business growth.',
  keywords: [
    'web development',
    'software engineering',
    'AI solutions',
    'SaaS development',
    'digital agency',
    'Next.js development',
    'enterprise systems',
    'POS system',
  ],
  authors: [{ name: 'Atthawat Studio' }],
  openGraph: {
    title: 'Atthawat Studio | Premium Digital Engineering',
    description:
      'Premium Digital Engineering Studio crafting scalable digital experiences.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atthawat Studio | Premium Digital Engineering',
    description: 'Premium Digital Engineering Studio.',
  },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  
  return (
    <>
      <Hero />
      <TrustedBy />
      <ServicesOverview />
      <FeaturedProjects />
      <ProcessWorkflow />
      <PricingPreview />
      <Testimonials />
      <CTASection />
    </>
  )
}
