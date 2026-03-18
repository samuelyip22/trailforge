// components/TrailMap.js
// Interactive map showing the parking spot and trailhead using Leaflet + OpenStreetMap.
// 'use client' is required — Leaflet only works in the browser (not server-side).
// We use dynamic import in the parent page to prevent SSR errors with Leaflet.

'use client'

import { useEffect, useRef } from 'react'

export default function TrailMap({ parkingLat, parkingLng, trailheadLat, trailheadLng, trailName }) {
  // mapRef holds a reference to the <div> where Leaflet will render the map
  const mapRef        = useRef(null)
  // leafletMapRef holds the Leaflet map instance so we can clean up on unmount
  const leafletMapRef = useRef(null)

  useEffect(() => {
    // Leaflet must be imported inside useEffect because it uses browser-only APIs (window, document)
    // Dynamic import() loads it only when this component actually renders in the browser
    import('leaflet').then(L => {
      // Avoid creating a second map if one already exists (React StrictMode runs effects twice)
      if (leafletMapRef.current) return
      if (!mapRef.current) return

      // Fix Leaflet's default marker icon path (broken in webpack/Next.js without this)
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Center the map between parking and trailhead
      const centerLat = (parkingLat + trailheadLat) / 2
      const centerLng = (parkingLng + trailheadLng) / 2

      // Create the Leaflet map — zoom 14 gives a good view of a single trail area
      const map = L.default.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([centerLat, centerLng], 14)
      leafletMapRef.current = map

      // Use free OpenStreetMap tiles — no API key needed
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Blue parking marker
      const parkingIcon = L.default.divIcon({
        html: `<div style="background:#3b82f6;color:white;font-size:11px;font-weight:600;padding:3px 7px;border-radius:12px;white-space:nowrap;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)">🅿️ Parking</div>`,
        className: '',
        iconAnchor: [40, 14],
      })

      // Orange trailhead marker
      const trailheadIcon = L.default.divIcon({
        html: `<div style="background:#f97316;color:white;font-size:11px;font-weight:600;padding:3px 7px;border-radius:12px;white-space:nowrap;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)">🚵 Trailhead</div>`,
        className: '',
        iconAnchor: [50, 14],
      })

      // Add markers with popups
      L.default.marker([parkingLat, parkingLng], { icon: parkingIcon })
        .addTo(map)
        .bindPopup(`<b>Parking</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${parkingLat},${parkingLng}" target="_blank" style="color:#3b82f6">Get directions →</a>`)

      L.default.marker([trailheadLat, trailheadLng], { icon: trailheadIcon })
        .addTo(map)
        .bindPopup(`<b>${trailName} Trailhead</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${trailheadLat},${trailheadLng}" target="_blank" style="color:#f97316">Get directions →</a>`)

      // Fit the map to show both markers comfortably
      const bounds = L.default.latLngBounds(
        [parkingLat, parkingLng],
        [trailheadLat, trailheadLng]
      )
      map.fitBounds(bounds, { padding: [40, 40] })
    })

    // Cleanup — remove the map when component unmounts to avoid memory leaks
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [parkingLat, parkingLng, trailheadLat, trailheadLng, trailName])

  return (
    <>
      {/* Leaflet requires its CSS to render correctly */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {/* This div is where the map renders — height controls the map size */}
      <div ref={mapRef} style={{ height: '280px', width: '100%', borderRadius: '16px', overflow: 'hidden' }} />
    </>
  )
}
