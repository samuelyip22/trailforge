// components/OverviewMap.js
// Shows all trail areas as pins on a Utah state map.
// Clicking a pin navigates to that area's trails.
// Used on the Trail Explorer page so riders can see all locations at a glance.
// 'use client' — Leaflet is browser-only.

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const difficultyDot = { beginner: '🟢', intermediate: '🟡', advanced: '🔴' }

export default function OverviewMap({ areas }) {
  const mapRef        = useRef(null)
  const leafletMapRef = useRef(null)
  const router        = useRouter()

  useEffect(() => {
    import('leaflet').then(L => {
      if (leafletMapRef.current) return
      if (!mapRef.current) return

      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Center on Utah — zoom 8 shows the whole state
      const map = L.default.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([39.5, -111.5], 7)
      leafletMapRef.current = map

      // Terrain tiles — shows mountain terrain nicely for an MTB app
      L.default.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
        maxZoom: 17,
        opacity: 0.9,
      }).addTo(map)

      // Add a marker for each trail area
      areas.forEach(area => {
        // Count trails by difficulty for the popup
        const diffCounts = { beginner: 0, intermediate: 0, advanced: 0 }
        area.trails.forEach(t => { diffCounts[t.difficulty] = (diffCounts[t.difficulty] ?? 0) + 1 })

        // Custom pin with area name
        const areaIcon = L.default.divIcon({
          html: `<div style="
            background:#1c1917;
            color:white;
            font-size:11px;
            font-weight:700;
            padding:4px 8px;
            border-radius:12px;
            border:2px solid #f97316;
            box-shadow:0 2px 6px rgba(0,0,0,.4);
            white-space:nowrap;
            cursor:pointer;
          ">🚵 ${area.name}</div>`,
          className: '',
          iconAnchor: [0, 12],
        })

        // Difficulty dots for popup
        const diffLine = [
          diffCounts.beginner     ? `🟢 ${diffCounts.beginner} beginner`         : '',
          diffCounts.intermediate ? `🟡 ${diffCounts.intermediate} intermediate`  : '',
          diffCounts.advanced     ? `🔴 ${diffCounts.advanced} advanced`          : '',
        ].filter(Boolean).join(' · ')

        const marker = L.default.marker([area.lat ?? area.parkingLat, area.lng ?? area.parkingLng], { icon: areaIcon })
          .addTo(map)

        marker.bindPopup(`
          <div style="min-width:160px">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px">${area.name}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:4px">${area.city} · ${area.region}</div>
            <div style="font-size:11px;margin-bottom:6px">${area.trails.length} trails · ${diffLine}</div>
            <a href="/trails" style="font-size:12px;color:#f97316;font-weight:600">View trails →</a>
          </div>
        `, { maxWidth: 220 })
      })
    })

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [areas])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden' }} />
    </>
  )
}
