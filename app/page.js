// app/page.js
// The home/dashboard page — the first thing users see.
// Shows a welcome message, quick stats, and trail suggestions.

import Link from 'next/link'
import { Map, BookOpen, CalendarDays, Wrench, ArrowRight, Mountain } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Hero section */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-2 text-orange-400">
          <Mountain size={20} />
          <span className="text-sm font-semibold uppercase tracking-widest">TrailForge</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Rider.</h1>
        <p className="text-stone-300 mb-6">
          Your Utah mountain biking companion — explore trails, track rides, and keep your bike rolling.
        </p>
        <Link
          href="/trails"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Explore Trails <ArrowRight size={16} />
        </Link>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Trails Ridden', value: '0', sub: 'Log your first ride' },
          { label: 'Miles Logged',  value: '0', sub: 'Start tracking' },
          { label: 'Last Ride',     value: '—', sub: 'No rides yet' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className="text-2xl font-bold text-stone-900">{value}</div>
            <div className="text-sm font-medium text-stone-600">{label}</div>
            <div className="text-xs text-stone-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick nav cards */}
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Where do you want to go?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trail Explorer',     desc: 'Find Utah trails',       href: '/trails',  icon: Map,          color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'My Ride Log',        desc: 'Track your rides',       href: '/log',     icon: BookOpen,     color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Agenda',             desc: 'Plan your rides',        href: '/agenda',  icon: CalendarDays, color: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'My Bike',            desc: 'Garage & maintenance',   href: '/bike',    icon: Wrench,       color: 'bg-orange-50 border-orange-200 text-orange-700' },
        ].map(({ label, desc, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`border rounded-xl p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow ${color}`}
          >
            <Icon size={22} />
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs opacity-70">{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured SLC area trails teaser */}
      <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-1">🚵 Start Here — SLC Area Trails</h2>
        <p className="text-sm text-stone-500 mb-4">Beginner-friendly trails within 30 minutes of Salt Lake City.</p>
        <div className="space-y-2">
          {[
            { name: 'Chutes & Ladders',     area: 'Corner Canyon',              difficulty: '🟢 Beginner', time: '~1 hr' },
            { name: 'Round Valley Express', area: 'Round Valley · Park City',   difficulty: '🟢 Beginner', time: '~45 min' },
            { name: 'Pipeline Trail',       area: 'Millcreek Canyon',           difficulty: '🟢 Beginner', time: '~40 min' },
          ].map(trail => (
            <Link
              key={trail.name}
              href="/trails"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors group"
            >
              <div>
                <div className="font-medium text-sm text-stone-800 group-hover:text-orange-600 transition-colors">{trail.name}</div>
                <div className="text-xs text-stone-400">{trail.area} · {trail.difficulty} · {trail.time}</div>
              </div>
              <ArrowRight size={14} className="text-stone-300 group-hover:text-orange-400 transition-colors" />
            </Link>
          ))}
        </div>
        <Link href="/trails" className="mt-4 inline-flex items-center gap-1 text-sm text-orange-600 font-medium hover:underline">
          View all trails <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
