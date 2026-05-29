import { requireAdmin } from '@/lib/auth'
import { getLeads, getLeadStats } from '@/lib/actions/leads'
import LeadsTable from '@/components/admin/LeadsTable'

export const metadata = {
  title: 'Leads - Admin Dashboard',
  description: 'Manage your leads and inquiries'
}

export default async function LeadsPage() {
  // Require admin authentication
  await requireAdmin()


  const status = {
    total: 0,
    conversionRate: 0,
    byStatus: {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      PROPOSAL_SENT: 0,
      WON: 0,
      LOST: 0
    }
  }

  // Fetch all leads and stats
  const [leadsResult, statsResult] = await Promise.all([
    getLeads(),
    getLeadStats()
  ])
  
  if (!leadsResult.success) {
    return (
      <div className="min-h-screen bg-[#050816] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 rounded-2xl text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-white/60">{leadsResult.error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Transform leads data for client component (serialize dates)
  const serializedLeads = (leadsResult.data || []).map(lead => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString()
  }))
  
  // const status = statsResult.success ? statsResult.data : {
  //   total: 0,
  //   byStatus: {
  //     NEW: 0,
  //     CONTACTED: 0,
  //     QUALIFIED: 0,
  //     PROPOSAL_SENT: 0,
  //     WON: 0,
  //     LOST: 0
  //   },
  //   conversionRate: 0
  // }
  
  return (
    <div className="min-h-screen bg-[#050816] p-8">
      <div className="max-w-7xl mx-auto">
        <LeadsTable 
          initialLeads={serializedLeads} 
          stats={status}
        />
      </div>
    </div>
  )
}
