// app/bike/page.js
// My Bike Garage — inspired by Carvana's interactive bike view + Carfax maintenance history.
// Users select their bike, view its specs, and track maintenance like a service record.

'use client'

import { useState } from 'react'
import { Wrench, Plus, CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react'

// A starting list of popular mountain bikes people might own
// Future: pull from a bike database API (e.g., BikeIndex, 99spokes)
const popularBikes = [
  { id: 'trek-marlin-5', brand: 'Trek', model: 'Marlin 5', year: 2024, type: 'Hardtail', wheelSize: '29"', travel: '100mm fork', weight: '14.3 kg', bestFor: 'Beginner XC / Trail' },
  { id: 'specialized-rockhopper', brand: 'Specialized', model: 'Rockhopper Sport', year: 2024, type: 'Hardtail', wheelSize: '29"', travel: '100mm fork', weight: '13.8 kg', bestFor: 'Beginner Trail' },
  { id: 'giant-talon-1', brand: 'Giant', model: 'Talon 1', year: 2024, type: 'Hardtail', wheelSize: '29"', travel: '100mm fork', weight: '14.1 kg', bestFor: 'Beginner XC' },
  { id: 'trek-fuel-ex', brand: 'Trek', model: 'Fuel EX 5', year: 2024, type: 'Full Suspension', wheelSize: '29"', travel: '130mm', weight: '14.7 kg', bestFor: 'Intermediate Trail' },
  { id: 'specialized-stumpjumper', brand: 'Specialized', model: 'Stumpjumper Comp', year: 2024, type: 'Full Suspension', wheelSize: '29"', travel: '140mm', weight: '14.2 kg', bestFor: 'Intermediate / Advanced Trail' },
  { id: 'santa-cruz-hightower', brand: 'Santa Cruz', model: 'Hightower C', year: 2024, type: 'Full Suspension', wheelSize: '29"', travel: '145mm', weight: '13.9 kg', bestFor: 'Advanced Trail / Enduro' },
]

// Default maintenance checklist items every MTB rider should track
const defaultMaintenance = [
  { id: 'tire-pressure',   label: 'Tire Pressure',       frequency: 'Before every ride',  status: 'good',    lastChecked: null, notes: '' },
  { id: 'chain-lube',      label: 'Chain Lubrication',   frequency: 'Every 3–5 rides',    status: 'good',    lastChecked: null, notes: '' },
  { id: 'brake-pads',      label: 'Brake Pads',          frequency: 'Monthly',             status: 'good',    lastChecked: null, notes: '' },
  { id: 'brake-bleed',     label: 'Brake Bleed (hydro)', frequency: 'Every 6–12 months',  status: 'unknown', lastChecked: null, notes: '' },
  { id: 'drivetrain',      label: 'Drivetrain Clean',    frequency: 'Monthly',             status: 'good',    lastChecked: null, notes: '' },
  { id: 'suspension',      label: 'Suspension Service',  frequency: 'Every 50 hours / 1yr', status: 'unknown', lastChecked: null, notes: '' },
  { id: 'wheel-truing',    label: 'Wheel Truing',        frequency: 'As needed',           status: 'good',    lastChecked: null, notes: '' },
  { id: 'bolts-torque',    label: 'Bolt Torque Check',   frequency: 'Monthly',             status: 'good',    lastChecked: null, notes: '' },
  { id: 'tubeless-sealant','label': 'Tubeless Sealant',  frequency: 'Every 3–4 months',   status: 'unknown', lastChecked: null, notes: '' },
]

// Status config — colors and icons for each maintenance status
const statusConfig = {
  good:    { label: '✅ Good',        color: 'text-green-600',  bg: 'bg-green-50',  icon: CheckCircle },
  soon:    { label: '⚠️ Check Soon',  color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle },
  overdue: { label: '🔴 Overdue',     color: 'text-red-600',    bg: 'bg-red-50',    icon: XCircle },
  unknown: { label: '— Unknown',      color: 'text-stone-400',  bg: 'bg-stone-50',  icon: Wrench },
}

export default function BikePage() {
  const [selectedBike, setSelectedBike] = useState(null) // which bike the user has chosen
  const [showPicker, setShowPicker] = useState(false)   // toggle the bike picker modal

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Bike Garage</h1>
        <p className="text-stone-500 text-sm mt-1">Select your bike, view its specs, and track your maintenance history.</p>
      </div>

      {/* ── BIKE SELECTION ─────────────────────────────────────────────── */}
      {!selectedBike ? (
        // No bike selected yet — show the empty state / picker prompt
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center mb-6">
          <div className="text-5xl mb-4">🚵</div>
          <h2 className="font-semibold text-stone-800 mb-2">Add Your Bike</h2>
          <p className="text-sm text-stone-400 mb-5">
            Select your mountain bike to see its specs and start tracking maintenance.
            Like having a digital service record for your ride.
          </p>
          <button
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Select My Bike
          </button>
        </div>
      ) : (
        // Bike selected — show the "Carvana-style" bike card
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-6">
          {/* Bike visual header */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 text-white">
            <div className="text-4xl mb-3">🚵</div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-1">{selectedBike.year} · {selectedBike.type}</div>
            <h2 className="text-2xl font-bold">{selectedBike.brand} {selectedBike.model}</h2>
            <div className="text-orange-400 text-sm mt-1">Best for: {selectedBike.bestFor}</div>
          </div>

          {/* Specs grid — like a Carvana spec sheet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-stone-100">
            {[
              { label: 'Type',        value: selectedBike.type },
              { label: 'Wheel Size',  value: selectedBike.wheelSize },
              { label: 'Travel',      value: selectedBike.travel },
              { label: 'Weight',      value: selectedBike.weight },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 text-center">
                <div className="text-xs text-stone-400 mb-1">{label}</div>
                <div className="font-semibold text-stone-800 text-sm">{value}</div>
              </div>
            ))}
          </div>

          {/* Change bike button */}
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
            <button
              onClick={() => setShowPicker(true)}
              className="text-xs text-stone-500 hover:text-orange-600 transition-colors"
            >
              Change bike →
            </button>
          </div>
        </div>
      )}

      {/* ── MAINTENANCE TRACKER ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="font-semibold text-stone-800">Maintenance Log</h2>
            <p className="text-xs text-stone-400 mt-0.5">Your bike&apos;s service record — like Carfax for your ride</p>
          </div>
        </div>

        {/* Each maintenance item */}
        <div className="divide-y divide-stone-100">
          {defaultMaintenance.map(item => {
            const s = statusConfig[item.status]
            const StatusIcon = s.icon
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors ${s.bg}`}
              >
                <StatusIcon size={18} className={s.color} />
                <div className="flex-1">
                  <div className="font-medium text-sm text-stone-800">{item.label}</div>
                  <div className="text-xs text-stone-400">{item.frequency}</div>
                </div>
                <div className={`text-xs font-medium ${s.color}`}>{s.label}</div>
                <ChevronRight size={14} className="text-stone-300" />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── BIKE PICKER MODAL ──────────────────────────────────────────── */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-stone-900">Select Your Bike</h3>
              <button onClick={() => setShowPicker(false)} className="text-stone-400 hover:text-stone-700 text-lg leading-none">✕</button>
            </div>
            <div className="divide-y divide-stone-100">
              {popularBikes.map(bike => (
                <button
                  key={bike.id}
                  onClick={() => { setSelectedBike(bike); setShowPicker(false) }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 text-left transition-colors"
                >
                  <div>
                    <div className="font-semibold text-stone-800">{bike.brand} {bike.model}</div>
                    <div className="text-xs text-stone-400">{bike.year} · {bike.type} · {bike.wheelSize} · {bike.bestFor}</div>
                  </div>
                  <ChevronRight size={14} className="text-stone-300" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400">Don&apos;t see your bike? More models coming soon.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
