// app/trails/page.js
// Trail Explorer — fully interactive filters: difficulty, region, and distance from you.
// 'use client' lets us use React state for filters and the browser Geolocation API.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, TrendingUp, ArrowRight, LocateFixed, X } from 'lucide-react'
import { trailAreas, difficultyConfig } from '@/lib/trails'
import { getDistanceMiles } from '@/lib/distance'

// All unique regions from our trail data (no duplicates)
const allRegions = [...new Set(trailAreas.map(a => a.region))]

// Distance filter options in miles
const distanceOptions = [
  { label: 'Any distance', value: null },
  { label: 'Within 15 mi', value: 15 },
  { label: 'Within 30 mi', value: 30 },
  { label: 'Within 60 mi', value: 60 },
]

export default function TrailsPage() {
  // Filter state — starts with "show everything"
  const [difficulty,      setDifficulty]      = useState('all')
  const [region,          setRegion]          = useState('all')
  const [maxDistance,     setMaxDistance]     = useState(null) // null = no distance filter

  // User's GPS coordinates — only set after they click "Use My Location"
  const [userLocation,    setUserLocation]    = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError,   setLocationError]   = useState('')

  // Ask the browser for the user's current GPS position
  function requestLocation() {
    if (!navigator.geolocation) { setLocationError('Geolocation not supported by your browser.'); return }
    setLocationLoading(true); setLocationError('')
    navigator.geolocation.getCurrentPosition(
      pos  => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationLoading(false) },
      ()   => { setLocationError('Could not get location. Please allow location access and try again.'); setLocationLoading(false) }
    )
  }

  // Build the filtered + distance-sorted list of areas
  const filteredAreas = trailAreas
    .map(area => ({
      ...area,
      // Filter this area's trails by difficulty
      filteredTrails: area.trails.filter(t => difficulty === 'all' || t.difficulty === difficulty),
      // Calculate distance from user to this area's parking spot (or null if no location)
      distanceMiles: userLocation
        ? getDistanceMiles(userLocation.lat, userLocation.lng, area.parkingLat, area.parkingLng)
        : null,
    }))
    .filter(area =>
      (region === 'all' || area.region === region) &&                                         // region filter
      (!maxDistance || area.distanceMiles === null || area.distanceMiles <= maxDistance) &&    // distance filter
      area.filteredTrails.length > 0                                                          // hide areas with no matching trails
    )
    .sort((a, b) =>
      // Sort by distance (closest first) only if we have user location
      (a.distanceMiles !== null && b.distanceMiles !== null) ? a.distanceMiles - b.distanceMiles : 0
    )

  const totalTrails = filteredAreas.reduce((sum, a) => sum + a.filteredTrails.length, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Trail Explorer</h1>
        <p className="text-stone-500 text-sm mt-1">
          Utah mountain bike trails — organized by area. Tap a trail for maps, weather, and directions.
        </p>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 space-y-3">

        {/* Row 1: Difficulty + Region */}
        <div className="flex flex-wrap gap-2">
          {/* Difficulty pill buttons */}
          {[
            { key: 'all',          label: 'All Levels' },
            { key: 'beginner',     label: '🟢 Beginner' },
            { key: 'intermediate', label: '🟡 Intermediate' },
            { key: 'advanced',     label: '🔴 Advanced' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setDifficulty(opt.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${difficulty === opt.key
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
            >
              {opt.label}
            </button>
          ))}

          {/* Region dropdown */}
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="px-3 py-1.5 rounded-full text-sm font-medium border border-stone-200 bg-white text-stone-600 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
          >
            <option value="all">All Regions</option>
            {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Row 2: Distance filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Distance from me:</span>

          {distanceOptions.map(opt => (
            <button
              key={opt.label}
              onClick={() => {
                // If picking a distance limit but no location yet — request it first
                if (opt.value && !userLocation) requestLocation()
                setMaxDistance(opt.value)
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${maxDistance === opt.value
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'}`}
            >
              {opt.label}
            </button>
          ))}

          {/* Use My Location button */}
          {!userLocation ? (
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-stone-300 text-stone-500 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50"
            >
              <LocateFixed size={13} />
              {locationLoading ? 'Getting location…' : 'Use My Location'}
            </button>
          ) : (
            // Location active — show status + option to clear it
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 border border-green-200 text-green-700">
              <LocateFixed size={13} /> Location active
              <button
                onClick={() => { setUserLocation(null); setMaxDistance(null) }}
                className="ml-1 text-green-500 hover:text-green-800"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {locationError && <span className="text-xs text-red-500">{locationError}</span>}
        </div>
      </div>

      {/* Results summary */}
      <p className="text-xs text-stone-400 mb-4">
        Showing {filteredAreas.length} area{filteredAreas.length !== 1 ? 's' : ''} · {totalTrails} trail{totalTrails !== 1 ? 's' : ''}
        {userLocation && maxDistance ? ` within ${maxDistance} miles of you` : ''}
      </p>

      {/* ── TRAIL AREAS ──────────────────────────────────────── */}
      {filteredAreas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
          <p className="font-medium">No trails match your filters.</p>
          <p className="text-sm mt-1">Try adjusting or clearing your filters.</p>
          <button
            onClick={() => { setDifficulty('all'); setRegion('all'); setMaxDistance(null) }}
            className="mt-4 text-sm text-orange-600 hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAreas.map(area => (
            <div key={area.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">

              {/* Area header */}
              <div className="p-5 border-b border-stone-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">{area.name}</h2>
                    <div className="flex items-center gap-3 text-stone-400 text-sm mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {area.city} · {area.region}
                      </span>
                      {/* Distance badge — only shows when user shared their location */}
                      {area.distanceMiles !== null && (
                        <span className="flex items-center gap-1 text-orange-500 font-medium text-xs">
                          <LocateFixed size={12} /> {area.distanceMiles.toFixed(1)} mi away
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-sm mt-2 leading-relaxed">{area.description}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-stone-400">
                    {area.filteredTrails.length} trail{area.filteredTrails.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Child trails */}
              <div className="divide-y divide-stone-100">
                {area.filteredTrails.map(trail => {
                  const diff = difficultyConfig[trail.difficulty]
                  return (
                    <Link
                      key={trail.id}
                      href={`/trails/${area.id}/${trail.id}`}
                      className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-stone-800 group-hover:text-orange-600 transition-colors">
                            {trail.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
                            {diff.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">
                            {trail.direction}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-stone-400">
                          <span className="flex items-center gap-1"><Clock size={11} /> ~{trail.estimatedTimeMin} min</span>
                          <span>{trail.lengthMiles} mi</span>
                          <span className="flex items-center gap-1"><TrendingUp size={11} /> +{trail.elevationGainFt.toLocaleString()} ft</span>
                        </div>
                        {trail.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {trail.features.slice(0, 4).map(f => (
                              <span key={f} className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-stone-300 group-hover:text-orange-400 transition-colors ml-3 shrink-0" />
                    </Link>
                  )
                })}
              </div>

              {/* Parking directions footer */}
              <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${area.parkingLat},${area.parkingLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <MapPin size={11} /> Directions to parking — {area.parkingAddress}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon regions */}
      <div className="mt-8 p-5 rounded-2xl border border-dashed border-stone-300 text-center text-stone-400">
        <p className="text-sm font-medium">More Utah regions coming soon</p>
        <p className="text-xs mt-1">Moab · St. George · Logan · Southern Utah</p>
      </div>
    </div>
  )
}
