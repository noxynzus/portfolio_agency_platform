'use client'

import { useState, useTransition } from 'react'
import { 
  Search, 
  Mail, 
  Phone,
  Building2,
  Calendar,
  Trash2,
  Loader2,
  ChevronDown,
  User,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  FileText,
  XCircle,
  X,
  Eye
} from 'lucide-react'
import { deleteLead, updateLeadStatus } from '@/lib/actions/leads'
import { toast } from 'sonner'
import { LeadStatus } from '@prisma/client'

// Type for Lead from database (serialized for client component)
type Lead = {
  id: string 
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  source: string | null // Can be null according to Prisma schema
  status: LeadStatus
  notes: string | null
  notified: boolean
  createdAt: string // ISO string from server
  updatedAt: string // ISO string from server
}

type LeadStats = {
  total: number
  byStatus: Record<LeadStatus, number>
  conversionRate: number
}

interface LeadsTableProps {
  initialLeads: Lead[]
  stats: LeadStats
}

// Status colors and labels
const STATUS_CONFIG = {
  NEW: {
    label: 'New',
    color: 'blue',
    icon: Mail,
    bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500'
  },
  CONTACTED: {
    label: 'Contacted',
    color: 'yellow',
    icon: Phone,
    bgClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
  },
  QUALIFIED: {
    label: 'Qualified',
    color: 'purple',
    icon: CheckCircle,
    bgClass: 'bg-purple-500/10 border-purple-500/20 text-purple-500'
  },
  PROPOSAL_SENT: {
    label: 'Proposal Sent',
    color: 'cyan',
    icon: FileText,
    bgClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'
  },
  WON: {
    label: 'Won',
    color: 'green',
    icon: Target,
    bgClass: 'bg-green-500/10 border-green-500/20 text-green-500'
  },
  LOST: {
    label: 'Lost',
    color: 'red',
    icon: XCircle,
    bgClass: 'bg-red-500/10 border-red-500/20 text-red-500'
  }
}

export default function LeadsTable({ initialLeads, stats }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  
  // Modal states
  const [statusModalLead, setStatusModalLead] = useState<Lead | null>(null)
  const [detailModalLead, setDetailModalLead] = useState<Lead | null>(null)
  
  // Get unique sources
  const sources = Array.from(new Set(leads.map(l => l.source).filter((s): s is string => s !== null)))
  
  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter
    
    return matchesSearch && matchesStatus && matchesSource
  })
  
  // Sort by newest first
  const sortedLeads = [...filteredLeads].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead from "${name}"?`)) return
    
    startTransition(async () => {
      const result = await deleteLead(id)
      if (result.success) {
        setLeads(prev => prev.filter(l => l.id !== id))
        toast.success('Lead deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete lead')
      }
    })
  }
  
  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: LeadStatus) => {
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus)
      if (result.success && result.data) {
        // Transform server response (serialize dates)
        const updatedLead = {
          ...result.data,
          createdAt: result.data.createdAt.toISOString(),
          updatedAt: result.data.updatedAt.toISOString()
        }
        setLeads(prev => prev.map(l => l.id === id ? updatedLead : l))
        toast.success('Status updated successfully')
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    })
  }
  
  // Format date
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold neon-text">Leads</h1>
          <p className="text-white/60 mt-1">
            Manage your leads and inquiries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 glass-dark rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-white/60">Conversion Rate:</span>
              <span className="font-bold text-green-500">{stats.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="glass p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const Icon = config.icon
          const count = stats.byStatus[key as LeadStatus] || 0
          return (
            <div key={key} className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 text-${config.color}-500`} />
                <p className="text-white/60 text-xs">{config.label}</p>
              </div>
              <p className={`text-2xl font-bold text-${config.color}-500`}>
                {count}
              </p>
            </div>
          )
        })}
      </div>
      
      {/* Results Count */}
      <p className="text-sm text-white/60 mb-4">
        Showing {sortedLeads.length} of {leads.length} leads
      </p>
      
      {/* Leads Table */}
      <div className="glass rounded-xl overflow-hidden">
        {sortedLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 mb-2">No leads found</p>
            <p className="text-sm text-white/30">
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Leads will appear here when someone contacts you'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-white/60">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Company</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Message</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Date</th>
                  <th className="text-center p-4 text-sm font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead) => {
                  const statusConfig = STATUS_CONFIG[lead.status]
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <tr 
                      key={lead.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      {/* Contact Info */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">
                              {lead.name}
                            </h3>
                            <div className="flex flex-col gap-1">
                              <a 
                                href={`mailto:${lead.email}`}
                                className="text-sm text-cyan-500 hover:underline flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="text-sm text-white/60 hover:text-white flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Company */}
                      <td className="p-4">
                        {lead.company ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-white/40" />
                            <span className="text-sm">{lead.company}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-white/40">-</span>
                        )}
                      </td>
                      
                      {/* Message Preview - Click to open modal */}
                      <td className="p-4 max-w-xs">
                        <button
                          onClick={() => setDetailModalLead(lead)}
                          className="text-left hover:text-cyan-500 transition group"
                        >
                          <p className="text-sm text-white/80 line-clamp-2">
                            {lead.message}
                          </p>
                          <span className="text-xs text-cyan-500 hover:underline mt-1 inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View details
                          </span>
                        </button>
                      </td>
                      
                      {/* Status Button - Click to open modal */}
                      <td className="p-4">
                        <button
                          onClick={() => setStatusModalLead(lead)}
                          disabled={isPending}
                          className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium ${statusConfig.bgClass} hover:brightness-110 transition disabled:opacity-50 min-h-[44px]`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </td>
                      
                      {/* Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="w-4 h-4" />
                          <span className="whitespace-nowrap">{formatDate(lead.createdAt)}</span>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(lead.id, lead.name)}
                            disabled={isPending}
                            className="p-2 hover:bg-white/10 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Delete"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Status Update Modal */}
      {statusModalLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="glass w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Update Lead Status</h3>
              <button
                onClick={() => setStatusModalLead(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Lead Info */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <p className="font-semibold text-lg mb-1">{statusModalLead.name}</p>
              <p className="text-sm text-white/60">{statusModalLead.email}</p>
            </div>
            
            {/* Status Options */}
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon
                const isCurrentStatus = statusModalLead.status === key
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      handleStatusUpdate(statusModalLead.id, key as LeadStatus)
                      setStatusModalLead(null)
                    }}
                    disabled={isPending || isCurrentStatus}
                    className={`w-full flex items-center gap-3 p-4 border rounded-xl text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isCurrentStatus 
                        ? `${config.bgClass} border-${config.color}-500/50` 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 text-${config.color}-500 flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="font-medium">{config.label}</p>
                    </div>
                    {isCurrentStatus && (
                      <CheckCircle className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Lead Detail Modal */}
      {detailModalLead && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setDetailModalLead(null)}
        >
          <div 
            className="glass w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Lead Details</h3>
              <button
                onClick={() => setDetailModalLead(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{detailModalLead.name}</p>
                      {detailModalLead.company && (
                        <p className="text-sm text-white/60 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {detailModalLead.company}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`mailto:${detailModalLead.email}`}
                      className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                    >
                      <Mail className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm">{detailModalLead.email}</span>
                    </a>
                    
                    {detailModalLead.phone && (
                      <a
                        href={`tel:${detailModalLead.phone}`}
                        className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                      >
                        <Phone className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm">{detailModalLead.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-3">Message</h4>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                    {detailModalLead.message}
                  </p>
                </div>
              </div>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-white/40 mb-1">Source</p>
                  <p className="text-sm font-medium">{detailModalLead.source || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Received</p>
                  <p className="text-sm font-medium">{formatDate(detailModalLead.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-lg text-sm ${STATUS_CONFIG[detailModalLead.status].bgClass}`}>
                    {(() => {
                      const StatusIcon = STATUS_CONFIG[detailModalLead.status].icon
                      return <StatusIcon className="w-3.5 h-3.5" />
                    })()}
                    {STATUS_CONFIG[detailModalLead.status].label}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Notification</p>
                  <p className={`text-sm font-medium ${detailModalLead.notified ? 'text-green-500' : 'text-white/60'}`}>
                    {detailModalLead.notified ? '✓ Sent' : 'Not sent'}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStatusModalLead(detailModalLead)
                    setDetailModalLead(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Update Status
                </button>
                <button
                  onClick={() => {
                    handleDelete(detailModalLead.id, detailModalLead.name)
                    setDetailModalLead(null)
                  }}
                  disabled={isPending}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg font-medium transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
