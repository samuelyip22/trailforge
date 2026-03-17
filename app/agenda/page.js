// app/agenda/page.js
// Agenda & Wishlist — plan future rides and track dream trails.
// Two tabs: Agenda (rides with a date) and Wishlist (someday rides).

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Star, Plus } from 'lucide-react'

export default function AgendaPage() {
  // activeTab controls which tab is shown: 'agenda' or 'wishlist'
  const [activeTab, setActiveTab] = useState('agenda')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Agenda & Wishlist</h1>
          <p className="text-stone-500 text-sm mt-1">Plan your upcoming rides and track dream trails.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Add Trail
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: 'agenda',   label: '📅 Agenda',   sub: 'Planned rides' },
          { key: 'wishlist', label: '🌟 Wishlist',  sub: 'Dream trails' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${activeTab === tab.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agenda tab */}
      {activeTab === 'agenda' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
          <CalendarDays size={36} className="text-stone-300 mx-auto mb-3" />
          <h2 className="font-semibold text-stone-700 mb-1">No rides planned yet</h2>
          <p className="text-sm text-stone-400 mb-4">
            Add trails here to plan your upcoming rides with a specific date.<br />
            You can also tap &quot;Add to Agenda&quot; on any trail detail page.
          </p>
          <Link href="/trails" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Browse Trails
          </Link>
        </div>
      )}

      {/* Wishlist tab */}
      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
          <Star size={36} className="text-stone-300 mx-auto mb-3" />
          <h2 className="font-semibold text-stone-700 mb-1">Your wishlist is empty</h2>
          <p className="text-sm text-stone-400 mb-4">
            Save trails you&apos;re hoping to ride someday — no date needed.<br />
            Tap &quot;Wishlist&quot; on any trail page to add it here.
          </p>
          <Link href="/trails" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Explore Trails
          </Link>
        </div>
      )}
    </div>
  )
}
