import { getPricingPlans } from '@/lib/actions/pricing'
import PricingPreviewClient from './PricingPreviewClient'

export default async function PricingPreview() {
  const result = await getPricingPlans({ published: true })
  const plans = result.success ? result.data || [] : []

  return <PricingPreviewClient plans={plans} />
}
