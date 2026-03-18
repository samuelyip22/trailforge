// components/TrailActions.js
// Action buttons on each trail detail page: Log Ride, Add to Agenda, Add to Wishlist.
// These require the user to be logged in — handled via Supabase Auth.
// 'use client' because we need React state (modal open/close, form inputs) + Supabase.

'use client'

import { useState, useEffect } from 'react'
import { Star, CalendarDays, Sparkles, X, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function TrailActions({ trailId, areaId, trailName, areaName, lengthMiles }) {
  // Which modal is open: null | 'log' | 'agenda' | 'wishlist'
  const [modal, setModal]       = useState(null)
  const [user, setUser]         = useState(null)    // logged-in user (null if not logged in)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')      // success message after saving

  // Form fields for Log Ride modal
  const [rideDate, setRideDate] = useState(new Date().toISOString().split('T')[0])
  const [rating, setRating]     = useState(0)
  const [notes, setNotes]       = useState('')

  // Form fields for Agenda modal
  const [plannedDate, setPlannedDate] = useState('')

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  // Close modal and reset form fields
  function closeModal() {
    setModal(null)
    setRating(0)
    setNotes('')
    setPlannedDate('')
    setSuccess('')
  }

  // Save a completed ride to Supabase ride_logs table
  async function saveRideLog() {
    if (!user) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('ride_logs').insert({
      user_id:    user.id,
      trail_id:   trailId,
      area_id:    areaId,
      trail_name: trailName,
      area_name:  areaName,
      miles:      lengthMiles,
      date_ridden: rideDate,
      rating:     rating || null,
      notes:      notes || null,
    })
    setLoading(false)
    if (!error) {
      setSuccess('Ride logged! 🎉')
      setTimeout(closeModal, 1800)
    } else {
      setSuccess('Error saving — try again.')
    }
  }

  // Save to agenda (with a date) or wishlist (no date) in Supabase trail_plans table
  async function savePlan(type) {
    if (!user) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('trail_plans').insert({
      user_id:      user.id,
      trail_id:     trailId,
      area_id:      areaId,
      trail_name:   trailName,
      area_name:    areaName,
      type:         type,             // 'agenda' or 'wishlist'
      planned_date: type === 'agenda' ? plannedDate : null,
    })
    setLoading(false)
    if (!error) {
      setSuccess(type === 'agenda' ? 'Added to your agenda! 📅' : 'Added to wishlist! 🌟')
      setTimeout(closeModal, 1800)
    } else {
      setSuccess('Error saving — try again.')
    }
  }

  // If not logged in, show a sign-in prompt instead of action buttons
  if (!user) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center mb-4">
        <p className="text-sm text-stone-500 mb-3">
          Sign in to log rides, plan your agenda, and save to your wishlist.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Sign In / Create Account
        </a>
      </div>
    )
  }

  return (
    <>
      {/* ── ACTION BUTTONS ROW ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setModal('log')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors"
        >
          <Star size={16} /> Log Ride
        </button>
        <button
          onClick={() => setModal('agenda')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-purple-100 text-purple-700 font-medium text-sm hover:bg-purple-200 transition-colors"
        >
          <CalendarDays size={16} /> Agenda
        </button>
        <button
          onClick={() => setModal('wishlist')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-stone-100 text-stone-700 font-medium text-sm hover:bg-stone-200 transition-colors"
        >
          <Sparkles size={16} /> Wishlist
        </button>
      </div>

      {/* ── MODALS ──────────────────────────────────────────── */}
      {/* Shared modal backdrop — clicking it closes the modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900">
                {modal === 'log'      && '🚵 Log a Ride'}
                {modal === 'agenda'   && '📅 Add to Agenda'}
                {modal === 'wishlist' && '🌟 Add to Wishlist'}
              </h3>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {/* Trail name summary */}
              <p className="text-sm text-stone-500 mb-4">
                <span className="font-semibold text-stone-800">{trailName}</span>
                {' '}· {areaName} · {lengthMiles} mi
              </p>

              {/* ── LOG RIDE FORM ────────────────────────────── */}
              {modal === 'log' && (
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Date Ridden</label>
                    <input
                      type="date"
                      value={rideDate}
                      onChange={e => setRideDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  {/* Star rating */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'opacity-100' : 'opacity-25'}`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="How was it? Any conditions to note?"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                      <CheckCircle size={15} /> {success}
                    </div>
                  )}

                  <button
                    onClick={saveRideLog}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {loading ? 'Saving…' : 'Save Ride'}
                  </button>
                </div>
              )}

              {/* ── AGENDA FORM ──────────────────────────────── */}
              {modal === 'agenda' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">When are you planning to ride?</label>
                    <input
                      type="date"
                      value={plannedDate}
                      onChange={e => setPlannedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                      <CheckCircle size={15} /> {success}
                    </div>
                  )}

                  <button
                    onClick={() => savePlan('agenda')}
                    disabled={loading || !plannedDate}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {loading ? 'Saving…' : 'Add to Agenda'}
                  </button>
                </div>
              )}

              {/* ── WISHLIST FORM ─────────────────────────────── */}
              {modal === 'wishlist' && (
                <div className="space-y-4">
                  <p className="text-sm text-stone-500">
                    No date needed — just save it for when the time is right. 🌟
                  </p>

                  {success && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                      <CheckCircle size={15} /> {success}
                    </div>
                  )}

                  <button
                    onClick={() => savePlan('wishlist')}
                    disabled={loading}
                    className="w-full bg-stone-800 hover:bg-stone-900 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {loading ? 'Saving…' : 'Save to Wishlist'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
