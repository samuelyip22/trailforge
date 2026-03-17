// app/log/page.js
// My Ride Log — personal history of trails you've ridden.
// Will connect to Supabase to save/load real data once auth is set up.

import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'

export default function RideLogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Ride Log</h1>
          <p className="text-stone-500 text-sm mt-1">Every trail you&apos;ve ridden, all in one place.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Log a Ride
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Rides', value: '0' },
          { label: 'Total Miles', value: '0' },
          { label: 'Favorite Area', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <BookOpen size={36} className="text-stone-300 mx-auto mb-3" />
        <h2 className="font-semibold text-stone-700 mb-1">No rides logged yet</h2>
        <p className="text-sm text-stone-400 mb-4">
          After your first ride, tap &quot;Log a Ride&quot; to record it here.<br />
          Or browse trails and tap the &quot;Log Ride&quot; button on any trail page.
        </p>
        <Link
          href="/trails"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Find a Trail to Ride
        </Link>
      </div>

      {/* Note: ride entries will be loaded from Supabase here once auth is wired up */}
    </div>
  )
}
