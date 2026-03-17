// app/trails/[areaId]/[trailId]/page.js
// The Trail Detail page — shows everything about one specific trail.
// [areaId] and [trailId] are dynamic — Next.js fills them in from the URL.
// e.g., /trails/corner-canyon/ghost-falls

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, TrendingUp, ArrowLeft, Navigation, Info, Star } from 'lucide-react'
import { getTrailById, difficultyConfig } from '@/lib/trails'

// generateMetadata sets the browser tab title for each trail page
// In Next.js 15+, params is a Promise — we must await it before using it
export async function generateMetadata({ params }) {
  const { areaId, trailId } = await params
  const trail = getTrailById(areaId, trailId)
  if (!trail) return { title: 'Trail not found' }
  return { title: `${trail.name} — TrailForge` }
}

export default async function TrailDetailPage({ params }) {
  // await params first — required in Next.js 15+ (params is now a Promise)
  const { areaId, trailId } = await params
  const trail = getTrailById(areaId, trailId)

  // If the trail doesn't exist, show Next.js built-in 404 page
  if (!trail) notFound()

  const diff = difficultyConfig[trail.difficulty]

  // Build Google Maps links for parking and trailhead
  const parkingMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${trail.parkingLat},${trail.parkingLng}`
  const trailheadMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${trail.trailheadLat},${trail.trailheadLng}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Back button */}
      <Link href="/trails" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors">
        <ArrowLeft size={14} /> Back to Trails
      </Link>

      {/* Trail header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 text-stone-400 text-sm">
              <MapPin size={13} /> {trail.area} · {trail.city}
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{trail.name}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${diff.color}`}>{diff.label}</span>
              <span className="text-sm px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 capitalize">{trail.direction}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-stone-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1"><Clock size={12} /> Est. Time</div>
            <div className="font-bold text-stone-900">~{trail.estimatedTimeMin} min</div>
          </div>
          <div className="text-center">
            <div className="text-stone-400 text-xs mb-1">Distance</div>
            <div className="font-bold text-stone-900">{trail.lengthMiles} miles</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1"><TrendingUp size={12} /> Elevation</div>
            <div className="font-bold text-stone-900">+{trail.elevationGainFt.toLocaleString()} ft</div>
          </div>
        </div>
      </div>

      {/* Map placeholder — Leaflet map will render here (requires client component) */}
      <div className="bg-stone-100 rounded-2xl border border-stone-200 h-56 flex items-center justify-center mb-4 text-stone-400 text-sm">
        🗺️ Interactive trail map — coming soon
      </div>

      {/* About this trail */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">About This Trail</h2>
        <p className="text-stone-600 text-sm leading-relaxed">{trail.description}</p>

        {/* Feature tags */}
        {trail.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {trail.features.map(f => (
              <span key={f} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full capitalize">{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* How to ride */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">How to Ride This Trail</h2>
        <p className="text-stone-600 text-sm leading-relaxed">{trail.howToRide}</p>
      </div>

      {/* Weather — placeholder, will pull from Open-Meteo API */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">🌤️ Trail Conditions & Weather</h2>
        <div className="bg-stone-50 rounded-xl p-4 text-center text-stone-400 text-sm">
          Weather forecast loading — will show current conditions + 5-day MTB forecast
        </div>
        <p className="text-xs text-stone-400 mt-3">
          ⚠️ Trails in Utah can be muddy 24–48 hrs after rain. Check conditions before heading out.
        </p>
      </div>

      {/* Directions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">📍 Getting There</h2>
        <div className="space-y-3">
          <a
            href={parkingMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="bg-blue-100 text-blue-600 rounded-lg p-2"><Navigation size={16} /></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-800 group-hover:text-blue-700">Directions to Parking</div>
              <div className="text-xs text-stone-400">{trail.parkingAddress}</div>
            </div>
          </a>
          <a
            href={trailheadMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="bg-green-100 text-green-600 rounded-lg p-2"><MapPin size={16} /></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-800 group-hover:text-green-700">Directions to Trailhead</div>
              <div className="text-xs text-stone-400">{trail.trailheadAddress}</div>
            </div>
          </a>
        </div>
      </div>

      {/* Community notes — placeholder for future Trailforks/MTB Project reviews */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">💬 What Riders Are Saying</h2>
        <div className="bg-stone-50 rounded-xl p-4 text-center text-stone-400 text-sm">
          Community trail reports and ratings — coming soon via Trailforks integration
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors">
          <Star size={16} /> Log Ride
        </button>
        <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-purple-100 text-purple-700 font-medium text-sm hover:bg-purple-200 transition-colors">
          📅 Add to Agenda
        </button>
        <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-stone-100 text-stone-700 font-medium text-sm hover:bg-stone-200 transition-colors">
          🌟 Wishlist
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          DATA CONFIDENCE NOTE — shown at the bottom of every trail page.
          This tells users how reliable the data is and where it came from.
          ───────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="flex items-start gap-2">
          <Info size={15} className="text-stone-400 mt-0.5 shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-stone-600">Data Confidence</span>
              {/* Confidence bar — e.g. 85% fills 85% of the bar in green */}
              <div className="flex-1 h-1.5 rounded-full bg-stone-200 max-w-[80px]">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${trail.dataConfidence}%` }}
                />
              </div>
              <span className="text-xs text-stone-500">{trail.dataConfidence}%</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">{trail.dataNote}</p>
            <p className="text-xs text-stone-400 mt-1">
              Source: {trail.dataSource === 'trailforks' ? 'Trailforks' : 'MTB Project'} · Always verify trail conditions locally before riding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
