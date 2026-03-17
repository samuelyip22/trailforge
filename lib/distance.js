// lib/distance.js
// Utility to calculate the straight-line distance between two GPS coordinates.
// Uses the Haversine formula — the standard way to measure distance on a sphere (Earth).
// Returns distance in miles.

export function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8 // Earth's radius in miles

  // Convert degrees to radians (Math.sin/cos work in radians)
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in miles
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}
