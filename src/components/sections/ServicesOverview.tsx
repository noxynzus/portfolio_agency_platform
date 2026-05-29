import { getServices } from '@/lib/actions/services'
import ServicesOverviewClient from './ServicesOverviewClient'

export default async function ServicesOverview() {
  const result = await getServices({ published: true })
  const services = result.success ? result.data || [] : []

  return <ServicesOverviewClient services={services} />
}
