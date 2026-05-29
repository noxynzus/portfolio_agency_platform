import { getPricingPlans } from '@/lib/actions/pricing'
import PricingClient from './PricingClient'

export const metadata = {
  title: 'Pricing - UI/UX Pro Max',
  description: 'Simple, transparent pricing. Pay for exactly what you need.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function PricingPage() {
  const result = await getPricingPlans({ published: true })
  const plans = result.success ? result.data || [] : []
  return <PricingClient plans={plans} />
}
