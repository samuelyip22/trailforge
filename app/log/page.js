// app/log/page.js
// My Ride Log — loads the user's personal ride history from Supabase.
// 'use client' because we need React state + Supabase auth (browser-only).

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Star, Trash2, X, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { trailAreas } from '@/lib/trails'

// Flatten all trails into a quick lookup: trailId → { area, city }
const trailLookup = {}
trailAreas.forEach(area => {
  area.trails.forEach(trail => {
    trailLookup[trail.id] = { area: area.name, city: area.city, areaId: area.id }
  })
})

// Format a date string (YYYY-MM-DD) to something readable like "Mar 15, 2026"
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Render star rating as emoji stars
function Stars({ rating }) {
  if (!rating) return <span className="text-stone-300 text-xs">No rating</span>
  return (
    <span className="text-sm">
      {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function RideLogPage() {
  const [rides, setRides]     = useState([])
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Modal state for adding a ride manually
  const [modal, setModal]           = useState(false)
  const [selectedTrailId, setSelectedTrailId] = useState('')
  const [selectedAreaId,  setSelectedAreaId]  = useState('')
  const [rideDate, setRideDate]     = useState(new Date().toISOString().split('T')[0])
  const [rating, setRating]         = useState(0)
  const [notes, setNotes]           = useState('')
  const [saving, setSaving]         = useState(false)
  const [saveMsg, setSaveMsg]       = useState('')

  // Flatten trails for the manual add dropdown
  const allTrails = trailAreas.flatMap(area =>
    area.trails.map(t => ({ id: t.id, areaId: area.id, name: t.name, area: area.name, miles: t.lengthMiles }))
  )

  // Load user session and their rides on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data?.user ?? null
      setUser(u)
      if (u) {
        // Load this user's rides, most recent first
        const { data: rows } = await supabase
          .from('ride_logs')
          .select('*')
          .eq('user_id', u.id)
          .order('date_ridden', { ascending: false })
        setRides(rows ?? [])
      }
      setLoading(false)
    })
  }, [])

  // Delete a ride by its database ID
  async function deleteRide(id) {
    const supabase = createClient()
    await supabase.from('ride_logs').delete().eq('id', id)
    setRides(prev => prev.filter(r => r.id !== id))
  }

  // Save a manually-added ride
  async function saveManualRide() {
    if (!user || !selectedTrailId) return
    setSaving(true)
    const trail = allTrails.find(t => t.id === selectedTrailId)
    const supabase = createClient()
    const { data, error } = await supabase.from('ride_logs').insert({
      user_id:     user.id,
      trail_id:    trail.id,
      area_id:     trail.areaId,
      trail_name:  trail.name,
      area_name:   trail.area,
      miles:       trail.miles,
      date_ridden: rideDate,
      rating:      rating || null,
      notes:       notes || null,
    }).select().single()
    setSaving(false)
    if (!error && data) {
      setRides(prev => [data, ...prev])
      setSaveMsg('Ride logged! 🎉')
      setTimeout(() => { setModal(false); setSaveMsg(''); setRating(0); setNotes(''); setSelectedTrailId('') }, 1500)
    }
  }

  // ── STATS ────────────────────────────────────────────────────────────
  const totalMiles    = rides.reduce((s, r) => s + (r.miles ?? 0), 0).toFixed(1)
  // Find the most visited area
  const areaCounts    = {}
  rides.forEach(r => { areaCounts[r.area_name] = (areaCounts[r.area_name] ?? 0) + 1 })
  const favoriteArea  = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // ── NOT LOGGED IN ─────────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <BookOpen size={40} className="text-stone-300 mx-auto mb-4" />
        <h2 className="font-semibold text-stone-700 mb-2">Sign in to see your ride log</h2>
        <p className="text-sm text-stone-400 mb-5">Your ride history is private and saved to your account.</p>
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
          <h1 className="text-2xl font-bold text-stone-900">My Ride Log</h1>
          <p className="text-stone-500 text-sm mt-1">Every trail you&apos;ve ridden, all in one place.</p>
        </div>
        {user && (
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Log a Ride
          </button>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Rides',    value: loading ? '…' : rides.length },
          { label: 'Total Miles',    value: loading ? '…' : totalMiles },
          { label: 'Favorite Area',  value: loading ? '…' : favoriteArea },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-stone-900 truncate">{value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Ride list or empty state */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <BookOpen size={36} className="text-stone-300 mx-auto mb-3" />
          <h2 className="font-semibold text-stone-700 mb-1">No rides logged yet</h2>
          <p className="text-sm text-stone-400 mb-4">
            After your first ride, tap &quot;Log a Ride&quot; or use the button on any trail page.
          </p>
          <Link href="/trails" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Find a Trail to Ride
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rides.map(ride => (
            <div key={ride.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-start gap-4 group hover:border-stone-300 transition-colors">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/trails/${ride.area_id}/${ride.trail_id}`}
                  className="font-semibold text-stone-800 hover:text-orange-600 transition-colors text-sm"
                >
                  {ride.trail_name}
                </Link>
                <div className="text-xs text-stone-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{ride.area_name}</span>
                  <span>·</span>
                  <span>{formatDate(ride.date_ridden)}</span>
                  {ride.miles && <><span>·</span><span>{ride.miles} mi</span></>}
                </div>
                {ride.rating && (
                  <div className="mt-1">
                    <Stars rating={ride.rating} />
                  </div>
                )}
                {ride.notes && (
                  <p className="text-xs text-stone-500 mt-1 italic">&quot;{ride.notes}&quot;</p>
                )}
              </div>
              {/* Delete button — shows on hover */}
              <button
                onClick={() => deleteRide(ride.id)}
                className="text-stone-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Remove ride"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── MANUAL LOG MODAL ─────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900">🚵 Log a Ride</h3>
              <button onClick={() => setModal(false)} className="text-stone-400 hover:text-stone-700"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Trail picker */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Trail</label>
                <select
                  value={selectedTrailId}
                  onChange={e => setSelectedTrailId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Select a trail…</option>
                  {trailAreas.map(area => (
                    <optgroup key={area.id} label={area.name}>
                      {area.trails.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={rideDate}
                  onChange={e => setRideDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Stars */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setRating(n)}
                      className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'opacity-100' : 'opacity-25'}`}>⭐</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Conditions, highlights, tips…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {saveMsg && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                  <CheckCircle size={15} /> {saveMsg}
                </div>
              )}

              <button
                onClick={saveManualRide}
                disabled={saving || !selectedTrailId}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {saving ? 'Saving…' : 'Save Ride'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
