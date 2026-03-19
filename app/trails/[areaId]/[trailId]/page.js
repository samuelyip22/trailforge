// app/trails/[areaId]/[trailId]/page.js
// The Trail Detail page — shows everything about one specific trail.
// [areaId] and [trailId] are dynamic — Next.js fills them in from the URL.
// e.g., /trails/corner-canyon/ghost-falls
//
// This is a SERVER component (no 'use client') so it loads fast and is SEO-friendly.
// Client-only features (map, weather, action buttons) are imported as client components.

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, TrendingUp, ArrowLeft, Navigation, Info, GraduationCap, ArrowRight } from 'lucide-react'
import { getTrailById, difficultyConfig } from '@/lib/trails'
import WeatherWidget from '@/components/WeatherWidget'
import TrailActions from '@/components/TrailActions'
import SeasonalCalendar from '@/components/SeasonalCalendar'
// DynamicAreaTrailMap is a client component wrapper that loads Leaflet with ssr:false.
// We can't use next/dynamic({ ssr:false }) directly in a server component.
import DynamicAreaTrailMap from '@/components/DynamicAreaTrailMap'

// generateMetadata sets the browser tab title for each trail page
// In Next.js 15+, params is a Promise — we must await it before using it
export async function generateMetadata({ params }) {
  const { areaId, trailId } = await params
  const trail = getTrailById(areaId, trailId)
  if (!trail) return { title: 'Trail not found' }
  return {
    title: `${trail.name} — TrailForge`,
    description: trail.description,
  }
}

export default async function TrailDetailPage({ params }) {
  // await params first — required in Next.js 15+
  const { areaId, trailId } = await params
  const trail = getTrailById(areaId, trailId)

  // If the trail doesn't exist, show Next.js built-in 404 page
  if (!trail) notFound()

  const diff = difficultyConfig[trail.difficulty]

  // Build Google Maps links — opens directly to turn-by-turn directions
  const parkingMapUrl    = `https://www.google.com/maps/dir/?api=1&destination=${trail.parkingLat},${trail.parkingLng}`
  const trailheadMapUrl  = `https://www.google.com/maps/dir/?api=1&destination=${trail.trailheadLat},${trail.trailheadLng}`

  // Confidence label — human-readable from numeric score
  const confidenceLabel =
    trail.dataConfidence >= 90 ? 'Very High' :
    trail.dataConfidence >= 75 ? 'High' :
    trail.dataConfidence >= 60 ? 'Moderate' : 'Low'

  const confidenceColor =
    trail.dataConfidence >= 90 ? 'bg-green-500' :
    trail.dataConfidence >= 75 ? 'bg-lime-400' :
    trail.dataConfidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Back button */}
      <Link href="/trails" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors">
        <ArrowLeft size={14} /> Back to Trails
      </Link>

      {/* ── TRAIL HEADER ──────────────────────────────────────────────── */}
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

        {/* Stats grid — key numbers at a glance */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-stone-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Clock size={12} /> Est. Time
            </div>
            <div className="font-bold text-stone-900">~{trail.estimatedTimeMin} min</div>
          </div>
          <div className="text-center">
            <div className="text-stone-400 text-xs mb-1">Distance</div>
            <div className="font-bold text-stone-900">{trail.lengthMiles} miles</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <TrendingUp size={12} /> Elevation
            </div>
            <div className="font-bold text-stone-900">+{trail.elevationGainFt.toLocaleString()} ft</div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE MAP ───────────────────────────────────────────── */}
      {/* TrailMap is loaded dynamically (client-only) — shows parking + trailhead markers */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">🗺️ Trail Map</h2>
        {/* Shows all trails in this area as gray lines, selected trail highlighted */}
        <DynamicAreaTrailMap
          allTrails={trail.siblingTrails}
          selectedTrailId={trail.id}
          parkingLat={trail.parkingLat}
          parkingLng={trail.parkingLng}
          trailheadLat={trail.trailheadLat}
          trailheadLng={trail.trailheadLng}
          trailName={trail.name}
          difficulty={trail.difficulty}
        />
        <p className="text-xs text-stone-400 mt-2">
          🅿️ Blue = Parking &nbsp;·&nbsp; 🟠 Orange = Trailhead &nbsp;·&nbsp; Tap markers for Google Maps directions
        </p>
      </div>

      {/* ── ABOUT THIS TRAIL ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">About This Trail</h2>
        <p className="text-stone-600 text-sm leading-relaxed">{trail.description}</p>

        {/* Feature tags — e.g., "rocky sections", "jumps", "water crossings" */}
        {trail.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {trail.features.map(f => (
              <span key={f} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full capitalize">{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── HOW TO RIDE ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">🚵 How to Ride This Trail</h2>
        <p className="text-stone-600 text-sm leading-relaxed">{trail.howToRide}</p>
      </div>

      {/* ── SKILL TIP CALLOUT ─────────────────────────────────────────── */}
      {/* Suggests which technique from the Guide is most relevant for this difficulty */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <div className="bg-amber-100 rounded-xl p-2 shrink-0">
          <GraduationCap size={16} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-stone-800 mb-0.5">
            {trail.difficulty === 'beginner'
              ? 'New to MTB? Start with the basics.'
              : trail.difficulty === 'intermediate'
              ? 'Ready to level up your descending?'
              : 'Pushing your limits? Technique matters most here.'}
          </div>
          <p className="text-xs text-stone-500">
            {trail.difficulty === 'beginner'
              ? 'The Skills Guide covers body position, braking, and cornering — the three things that will make this trail feel effortless.'
              : trail.difficulty === 'intermediate'
              ? 'Check the descending and cornering sections in the Skills Guide before you drop in.'
              : 'Review drops, descending, and line-choice techniques in the Skills Guide before tackling this one.'}
          </p>
        </div>
        <Link href="/guide" className="shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800">
          Guide <ArrowRight size={11} />
        </Link>
      </div>

      {/* ── BEST TIME TO RIDE ─────────────────────────────────────────── */}
      {/* Shows a 12-month visual calendar of prime vs shoulder vs closed season */}
      <SeasonalCalendar bestMonths={trail.bestMonths} surface={trail.surface} />

      {/* ── LIVE WEATHER ─────────────────────────────────────────────── */}
      {/* WeatherWidget fetches live data from Open-Meteo (free, no API key) */}
      <WeatherWidget
        lat={trail.trailheadLat}
        lng={trail.trailheadLng}
        trailName={trail.name}
      />

      {/* ── GETTING THERE ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">📍 Getting There</h2>
        <div className="space-y-3">
          {/* Parking link — opens Google Maps with turn-by-turn directions */}
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
            <span className="text-xs text-blue-500 font-medium">Open Maps →</span>
          </a>

          {/* Trailhead link */}
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
            <span className="text-xs text-green-500 font-medium">Open Maps →</span>
          </a>
        </div>
      </div>

      {/* ── WHAT RIDERS ARE SAYING ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">💬 What Riders Are Saying</h2>
        <div className="bg-stone-50 rounded-xl p-4 text-center text-stone-400 text-sm">
          Community trail reports and ratings — Trailforks live integration coming soon
        </div>
        <p className="text-xs text-stone-400 mt-2">
          In the meantime, check{' '}
          <a
            href={`https://www.trailforks.com/trails/search/?search=${encodeURIComponent(trail.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Trailforks
          </a>
          {' '}or{' '}
          <a
            href={`https://www.mtbproject.com/search?q=${encodeURIComponent(trail.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            MTB Project
          </a>
          {' '}for recent community reports.
        </p>
      </div>

      {/* ── YOU MIGHT ALSO LIKE ───────────────────────────────────────── */}
      {/* Shows up to 3 other trails in the same area, excluding this one */}
      {trail.siblingTrails.filter(t => t.id !== trail.id).length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
          <h2 className="font-semibold text-stone-800 mb-3">More Trails in {trail.area}</h2>
          <div className="space-y-2">
            {trail.siblingTrails
              .filter(t => t.id !== trail.id)  // exclude current trail
              .slice(0, 3)                      // show max 3
              .map(t => {
                const tdiff = difficultyConfig[t.difficulty]
                return (
                  <Link
                    key={t.id}
                    href={`/trails/${trail.areaId}/${t.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-stone-800 group-hover:text-orange-700">{t.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {t.lengthMiles} mi · +{t.elevationGainFt.toLocaleString()} ft
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tdiff.color}`}>{tdiff.label}</span>
                      <ArrowRight size={13} className="text-stone-300 group-hover:text-orange-400" />
                    </div>
                  </Link>
                )
              })}
          </div>
          {/* Link to see all trails in this area */}
          <Link href="/trails" className="mt-3 inline-flex items-center gap-1 text-xs text-orange-600 font-medium hover:underline">
            View all trails <ArrowRight size={11} />
          </Link>
        </div>
      )}

      {/* ── ACTION BUTTONS (Log Ride, Agenda, Wishlist) ──────────────── */}
      {/* TrailActions is a client component — needs browser for Supabase auth + state */}
      <TrailActions
        trailId={trail.id}
        areaId={trail.areaId}
        trailName={trail.name}
        areaName={trail.area}
        lengthMiles={trail.lengthMiles}
      />

      {/* ── DATA CONFIDENCE NOTE ──────────────────────────────────────── */}
      {/* Shown at the bottom of every trail page so users know how reliable the data is */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 mt-4">
        <div className="flex items-start gap-2">
          <Info size={15} className="text-stone-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-stone-600">Data Confidence</span>
              {/* Confidence fill bar — e.g., 85 fills 85% */}
              <div className="h-1.5 rounded-full bg-stone-200 w-20">
                <div className={`h-full rounded-full ${confidenceColor}`} style={{ width: `${trail.dataConfidence}%` }} />
              </div>
              <span className="text-xs font-medium text-stone-600">{trail.dataConfidence}% — {confidenceLabel}</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">{trail.dataNote}</p>
            <p className="text-xs text-stone-400 mt-1">
              Source: {trail.dataSource === 'trailforks' ? 'Trailforks' : 'MTB Project'} ·{' '}
              Always verify current trail conditions locally before riding.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
