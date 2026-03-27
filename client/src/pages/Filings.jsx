import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, ChevronRight, CheckCircle, PenLine, Send, CircleCheck } from 'lucide-react'
import api from '../api/api'
import toast from 'react-hot-toast'

export default function Filings() {
  const [filings, setFilings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFilings()
  }, [])

  const fetchFilings = async () => {
    try {
      const res = await api.get('/api/filings')
      setFilings(res.data.data.filings)
    } catch {
      toast.error('Could not load filings')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    draft: {
      label: 'Draft',
      class: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: <PenLine className="w-3.5 h-3.5" />,
    },
    completed: {
      label: 'Completed',
      class: 'bg-green-50 text-green-700 border-green-200',
      icon: <CircleCheck className="w-3.5 h-3.5" />,
    },
    submitted: {
      label: 'Submitted',
      class: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Send className="w-3.5 h-3.5" />,
    },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">My Filings</h2>
          <p className="text-slate-500 text-sm font-body mt-1">
            All your KRA tax returns in one place
          </p>
        </div>
        <button
          onClick={() => navigate('/filings/new')}
          className="flex items-center gap-2 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Filing
        </button>
      </div>

      {/* ── Filings List ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
  {loading ? (
    <div className="py-16 text-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1A5276] rounded-full animate-spin mx-auto mb-3" />
      <p className="text-slate-400 text-sm font-body">Loading your filings...</p>
    </div>
  ) : filings.length === 0 ? (
    <div className="py-16 text-center px-6">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-slate-300" />
      </div>
      <p className="font-display font-semibold text-slate-700 mb-1">No filings yet</p>
      <p className="text-slate-400 text-sm font-body mb-6">
        Create your first tax filing to get started
      </p>
      <button
        onClick={() => navigate('/filings/new')}
        className="bg-[#1A5276] text-white font-display font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#154360] transition-all duration-200 cursor-pointer"
      >
        Create first filing
      </button>
    </div>
  ) : (
    <div>
      {/* Desktop table header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
        <div className="col-span-3 text-xs font-medium text-slate-500 font-body uppercase tracking-wide">
          Tax Year
        </div>
        <div className="col-span-3 text-xs font-medium text-slate-500 font-body uppercase tracking-wide">
          Type
        </div>
        <div className="col-span-2 text-xs font-medium text-slate-500 font-body uppercase tracking-wide">
          Entries
        </div>
        <div className="col-span-2 text-xs font-medium text-slate-500 font-body uppercase tracking-wide">
          Tax Due
        </div>
        <div className="col-span-2 text-xs font-medium text-slate-500 font-body uppercase tracking-wide">
          Status
        </div>
      </div>

      {filings.map((filing) => {
        const status = statusConfig[filing.status] || statusConfig.draft

        return (
          <div
            key={filing.id}
            onClick={() => navigate(`/filings/${filing.id}`)}
            className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            {/* Mobile card */}
            <div className="md:hidden px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display font-semibold text-slate-800 text-sm">
                    {filing.taxYear} / {filing.taxYear + 1}
                  </div>
                  <div className="text-slate-400 text-xs font-body mt-0.5">
                    Jan – Dec {filing.taxYear}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0 mt-0.5" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1">
                    Type
                  </p>
                  <p className="text-slate-700 font-body">
                    {filing.taxType === 'income_tax' ? 'Income Tax' : 'Turnover Tax'}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1">
                    Tax Due
                  </p>
                  <p className="text-slate-800 font-display font-semibold">
                    {Number(filing.netTaxPayable) > 0
                      ? `KES ${Number(filing.netTaxPayable).toLocaleString()}`
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-slate-600 font-body">
                  {filing._count?.incomeEntries || 0} income
                  <span className="text-slate-300 mx-1">·</span>
                  {filing._count?.expenses || 0} exp
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-body ${status.class}`}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>
            </div>

            {/* Desktop row */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-3">
                <div className="font-display font-semibold text-slate-800 text-sm">
                  {filing.taxYear} / {filing.taxYear + 1}
                </div>
                <div className="text-slate-400 text-xs font-body mt-0.5">
                  Jan – Dec {filing.taxYear}
                </div>
              </div>

              <div className="col-span-3">
                <span className="text-slate-600 text-sm font-body">
                  {filing.taxType === 'income_tax' ? 'Income Tax' : 'Turnover Tax'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-600 text-sm font-body">
                  {filing._count?.incomeEntries || 0} income
                </span>
                <span className="text-slate-300 mx-1">·</span>
                <span className="text-slate-600 text-sm font-body">
                  {filing._count?.expenses || 0} exp
                </span>
              </div>

              <div className="col-span-2">
                {Number(filing.netTaxPayable) > 0 ? (
                  <span className="font-display font-semibold text-slate-800 text-sm">
                    KES {Number(filing.netTaxPayable).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm font-body">—</span>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-body ${status.class}`}
                >
                  {status.icon}
                  {status.label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )}
</div>

      {/* ── Info box ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 text-sm font-body">
            <span className="font-semibold">One filing per tax year.</span>{' '}
            Each filing covers January 1 to December 31 of that year.
            The KRA filing deadline is <span className="font-semibold">30 June</span> of the following year.
          </p>
        </div>
      </div>

    </div>
  )
}