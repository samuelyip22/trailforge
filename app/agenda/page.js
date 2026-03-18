// app/agenda/page.js
// Agenda & Wishlist — loads the user's planned and dream rides from Supabase.
// Two tabs: Agenda (rides with a date) and Wishlist (someday rides, no date).

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Sparkles, Plus, X, Trash2, ArrowRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { trailAreas } from '@/lib/trails'

// Format a date string (YYYY-MM-DD) to something readable
function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AgendaPage() {
  const [activeTab, setActiveTab]   = useState('agenda')
  const [plans, setPlans]           = useState([])   // all plans (agenda + wishlist combined)
  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)

  // Add modal state
  const [modal, setModal]           = useState(false)
  const [modalType, setModalType]   = useState('agenda')  // 'agenda' or 'wishlist'
  const [selectedTrailId, setSelectedTrailId] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [saving, setSaving]         = useState(false)
  const [saveMsg, setSaveMsg]       = useState('')

  // Load user + their plans on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data?.user ?? null
      setUser(u)
      if (u) {
        const { data: rows } = await supabase
          .from('trail_plans')
          .select('*')
          .eq('user_id', u.id)
          .order('planned_date', { ascending: true, nullsFirst: false })
        setPlans(rows ?? [])
      }
      setLoading(false)
    })
  }, [])

  // Split plans into agenda (has date) vs wishlist (no date)
  const agendaItems   = plans.filter(p => p.type === 'agenda')
  const wishlistItems = plans.filter(p => p.type === 'wishlist')

  // Delete a plan by ID
  async function deletePlan(id) {
    const supabase = createClient()
    await supabase.from('trail_plans').delete().eq('id', id)
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  // Move a wishlist item to agenda (add a date)
  async function moveToAgenda(plan, date) {
    const supabase = createClient()
    const { data } = await supabase
      .from('trail_plans')
      .update({ type: 'agenda', planned_date: date })
      .eq('id', plan.id)
      .select().single()
    if (data) setPlans(prev => prev.map(p => p.id === plan.id ? data : p))
  }

  // Save a new plan manually
  async function savePlan() {
    if (!user || !selectedTrailId) return
    setSaving(true)
    const trail = trailAreas.flatMap(a => a.trails.map(t => ({ ...t, areaId: a.id, areaName: a.name }))).find(t => t.id === selectedTrailId)
    const supabase = createClient()
    const { data, error } = await supabase.from('trail_plans').insert({
      user_id:      user.id,
      trail_id:     trail.id,
      area_id:      trail.areaId,
      trail_name:   trail.name,
      area_name:    trail.areaName,
      type:         modalType,
      planned_date: modalType === 'agenda' && plannedDate ? plannedDate : null,
    }).select().single()
    setSaving(false)
    if (!error && data) {
      setPlans(prev => [...prev, data])
      setSaveMsg(modalType === 'agenda' ? 'Added to agenda! 📅' : 'Added to wishlist! 🌟')
      setTimeout(() => { setModal(false); setSaveMsg(''); setSelectedTrailId(''); setPlannedDate('') }, 1500)
    }
  }

  // ── NOT LOGGED IN ──────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <CalendarDays size={40} className="text-stone-300 mx-auto mb-4" />
        <h2 className="font-semibold text-stone-700 mb-2">Sign in to manage your agenda</h2>
        <p className="text-sm text-stone-400 mb-5">Plan upcoming rides and save dream trails to your wishlist.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
          Sign In / Create Account
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Agenda & Wishlist</h1>
          <p className="text-stone-500 text-sm mt-1">Plan your upcoming rides and track dream trails.</p>
        </div>
        {user && (
          <button
            onClick={() => { setModalType(activeTab); setModal(true) }}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add Trail
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: 'agenda',   label: '📅 Agenda',  count: agendaItems.length },
          { key: 'wishlist', label: '🌟 Wishlist', count: wishlistItems.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5
              ${activeTab === tab.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-stone-200 text-stone-600 text-xs rounded-full px-1.5 py-0.5 leading-none">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── AGENDA TAB ────────────────────────────────────────────────── */}
      {activeTab === 'agenda' && (
        loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse h-16" />)}</div>
        ) : agendaItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
            <CalendarDays size={36} className="text-stone-300 mx-auto mb-3" />
            <h2 className="font-semibold text-stone-700 mb-1">No rides planned yet</h2>
            <p className="text-sm text-stone-400 mb-4">Add trails here to plan your upcoming rides with a specific date.</p>
            <Link href="/trails" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Browse Trails
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agendaItems.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-start gap-4 group hover:border-purple-200 transition-colors">
                <div className="bg-purple-100 text-purple-600 rounded-lg p-2 shrink-0">
                  <CalendarDays size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/trails/${plan.area_id}/${plan.trail_id}`}
                    className="font-semibold text-stone-800 hover:text-orange-600 transition-colors text-sm">
                    {plan.trail_name}
                  </Link>
                  <div className="text-xs text-stone-400 mt-0.5">{plan.area_name}</div>
                  {plan.planned_date && (
                    <div className="text-xs font-medium text-purple-600 mt-1">📅 {formatDate(plan.planned_date)}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/trails/${plan.area_id}/${plan.trail_id}`}
                    className="text-stone-300 hover:text-orange-500 transition-colors">
                    <ArrowRight size={15} />
                  </Link>
                  <button onClick={() => deletePlan(plan.id)}
                    className="text-stone-200 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── WISHLIST TAB ──────────────────────────────────────────────── */}
      {activeTab === 'wishlist' && (
        loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse h-16" />)}</div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
            <Sparkles size={36} className="text-stone-300 mx-auto mb-3" />
            <h2 className="font-semibold text-stone-700 mb-1">Your wishlist is empty</h2>
            <p className="text-sm text-stone-400 mb-4">Save trails you&apos;re hoping to ride someday — no date needed.</p>
            <Link href="/trails" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Explore Trails
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistItems.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-start gap-4 group hover:border-orange-200 transition-colors">
                <div className="bg-amber-50 text-amber-500 rounded-lg p-2 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/trails/${plan.area_id}/${plan.trail_id}`}
                    className="font-semibold text-stone-800 hover:text-orange-600 transition-colors text-sm">
                    {plan.trail_name}
                  </Link>
                  <div className="text-xs text-stone-400 mt-0.5">{plan.area_name}</div>
                  {/* Quick-add to agenda from wishlist */}
                  <button
                    onClick={() => {
                      const date = prompt('Enter a date for this ride (YYYY-MM-DD):')
                      if (date) moveToAgenda(plan, date)
                    }}
                    className="text-xs text-purple-500 hover:underline mt-1"
                  >
                    + Move to Agenda
                  </button>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/trails/${plan.area_id}/${plan.trail_id}`}
                    className="text-stone-300 hover:text-orange-500 transition-colors">
                    <ArrowRight size={15} />
                  </Link>
                  <button onClick={() => deletePlan(plan.id)}
                    className="text-stone-200 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── ADD MODAL ─────────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900">
                {modalType === 'agenda' ? '📅 Add to Agenda' : '🌟 Add to Wishlist'}
              </h3>
              <button onClick={() => setModal(false)} className="text-stone-400 hover:text-stone-700"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Trail</label>
                <select value={selectedTrailId} onChange={e => setSelectedTrailId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="">Select a trail…</option>
                  {trailAreas.map(area => (
                    <optgroup key={area.id} label={area.name}>
                      {area.trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              {modalType === 'agenda' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Planned Date</label>
                  <input type="date" value={plannedDate} onChange={e => setPlannedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              )}
              {saveMsg && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={15} /> {saveMsg}
                </div>
              )}
              <button onClick={savePlan} disabled={saving || !selectedTrailId}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {saving ? 'Saving…' : modalType === 'agenda' ? 'Add to Agenda' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
