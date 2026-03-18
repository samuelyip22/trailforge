// components/AreaTrailMap.js
// Shows ALL trails in an area on a single Leaflet map.
// The currently-selected trail is drawn in bright orange, others in light gray.
// Parking and trailhead markers are shown for the selected trail.
// 'use client' — Leaflet is browser-only.

'use client'

import { useEffect, useRef } from 'react'

// Color config per difficulty for the selected trail line
const difficultyColors = {
  beginner:     '#22c55e',  // green
  intermediate: '#f59e0b',  // amber
  advanced:     '#ef4444',  // red
}

export default function AreaTrailMap({
  allTrails,        // array of all trails in this area (with .route arrays)
  selectedTrailId,  // which trail is currently highlighted
  parkingLat,
  parkingLng,
  trailheadLat,
  trailheadLng,
  trailName,
  difficulty,
}) {
  const mapRef        = useRef(null)
  const leafletMapRef = useRef(null)

  useEffect(() => {
    import('leaflet').then(L => {
      if (leafletMapRef.current) return
      if (!mapRef.current) return

      // Fix Leaflet marker icons (broken in webpack/Next.js)
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Center map on the trailhead of the selected trail
      const map = L.default.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([trailheadLat, trailheadLng], 14)
      leafletMapRef.current = map

      // OpenStreetMap tiles — free, no key needed
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // ── DRAW ALL TRAILS ────────────────────────────────────────────────
      // Collect all route coordinates to fit the map view
      const allCoords = []

      allTrails.forEach(trail => {
        if (!trail.route || trail.route.length < 2) return

        const isSelected = trail.id === selectedTrailId
        const color      = isSelected ? (difficultyColors[difficulty] ?? '#f97316') : '#94a3b8'
        const weight     = isSelected ? 5 : 2
        const opacity    = isSelected ? 0.95 : 0.45
        const zIndex     = isSelected ? 500 : 200

        // Draw the trail polyline
        const poly = L.default.polyline(trail.route, {
          color,
          weight,
          opacity,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(map)

        // Clickable tooltip showing trail name + difficulty
        poly.bindTooltip(
          `<b>${trail.name}</b><br><span style="font-size:11px;color:#64748b">${trail.difficulty} · ${trail.lengthMiles} mi</span>`,
          { sticky: true, direction: 'top' }
        )

        trail.route.forEach(coord => allCoords.push(coord))
      })

      // ── PARKING + TRAILHEAD MARKERS ───────────────────────────────────
      const parkingIcon = L.default.divIcon({
        html: `<div style="background:#3b82f6;color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3);white-space:nowrap">🅿️ Parking</div>`,
        className: '',
        iconAnchor: [36, 12],
      })
      const trailheadIcon = L.default.divIcon({
        html: `<div style="background:#f97316;color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3);white-space:nowrap">🚵 Trailhead</div>`,
        className: '',
        iconAnchor: [46, 12],
      })

      L.default.marker([parkingLat, parkingLng], { icon: parkingIcon })
        .addTo(map)
        .bindPopup(`<b>Parking</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${parkingLat},${parkingLng}" target="_blank" style="color:#3b82f6;font-size:12px">Open in Google Maps →</a>`)

      L.default.marker([trailheadLat, trailheadLng], { icon: trailheadIcon })
        .addTo(map)
        .bindPopup(`<b>${trailName} Trailhead</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${trailheadLat},${trailheadLng}" target="_blank" style="color:#f97316;font-size:12px">Open in Google Maps →</a>`)

      // Fit the map to show all trail routes in this area
      if (allCoords.length > 1) {
        map.fitBounds(L.default.latLngBounds(allCoords), { padding: [30, 30] })
      }
    })

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [allTrails, selectedTrailId, parkingLat, parkingLng, trailheadLat, trailheadLng, trailName, difficulty])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: '320px', width: '100%', borderRadius: '16px', overflow: 'hidden' }} />
    </>
  )
}
