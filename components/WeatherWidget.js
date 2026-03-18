// components/WeatherWidget.js
// Fetches live weather for a trail's GPS coordinates using Open-Meteo API.
// Open-Meteo is completely free — no API key required.
// Interprets conditions specifically for mountain biking (mud risk, wind, temp).

'use client'

import { useEffect, useState } from 'react'
import { Droplets, Wind, Thermometer, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

// WMO weather interpretation codes → human-readable labels + MTB impact
// Full list: https://open-meteo.com/en/docs#weathervariables
const weatherCodeMap = {
  0:  { label: 'Clear sky',           icon: '☀️',  mtbRisk: 'low' },
  1:  { label: 'Mainly clear',        icon: '🌤️', mtbRisk: 'low' },
  2:  { label: 'Partly cloudy',       icon: '⛅',  mtbRisk: 'low' },
  3:  { label: 'Overcast',            icon: '☁️',  mtbRisk: 'low' },
  45: { label: 'Foggy',               icon: '🌫️', mtbRisk: 'medium' },
  48: { label: 'Icy fog',             icon: '🌫️', mtbRisk: 'high' },
  51: { label: 'Light drizzle',       icon: '🌦️', mtbRisk: 'medium' },
  53: { label: 'Drizzle',             icon: '🌦️', mtbRisk: 'high' },
  55: { label: 'Heavy drizzle',       icon: '🌧️', mtbRisk: 'high' },
  61: { label: 'Light rain',          icon: '🌧️', mtbRisk: 'high' },
  63: { label: 'Rain',                icon: '🌧️', mtbRisk: 'high' },
  65: { label: 'Heavy rain',          icon: '🌧️', mtbRisk: 'high' },
  71: { label: 'Light snow',          icon: '🌨️', mtbRisk: 'high' },
  73: { label: 'Snow',                icon: '❄️',  mtbRisk: 'high' },
  75: { label: 'Heavy snow',          icon: '❄️',  mtbRisk: 'high' },
  80: { label: 'Light showers',       icon: '🌦️', mtbRisk: 'medium' },
  81: { label: 'Showers',             icon: '🌧️', mtbRisk: 'high' },
  82: { label: 'Heavy showers',       icon: '⛈️',  mtbRisk: 'high' },
  95: { label: 'Thunderstorm',        icon: '⛈️',  mtbRisk: 'high' },
  99: { label: 'Thunderstorm + hail', icon: '⛈️',  mtbRisk: 'high' },
}

// MTB condition advice based on risk level
const mtbAdvice = {
  low:    { label: '✅ Good to ride',        color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  medium: { label: '⚠️ Ride with caution',  color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  high:   { label: '🚫 Avoid riding today', color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
}

// Short day names for the 5-day forecast
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeatherWidget({ lat, lng, trailName }) {
  const [weather, setWeather]   = useState(null)  // API response data
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    // Fetch current conditions + 5-day daily forecast from Open-Meteo
    // timezone=America/Denver keeps times in Mountain Time (Utah)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,precipitation,windspeed_10m,weathercode` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&forecast_days=5&timezone=America%2FDenver&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`

    fetch(url)
      .then(r => r.json())
      .then(data => { setWeather(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [lat, lng])

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">🌤️ Trail Conditions & Weather</h2>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-stone-100 rounded w-3/4" />
          <div className="h-4 bg-stone-100 rounded w-1/2" />
        </div>
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────
  if (error || !weather?.current) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
        <h2 className="font-semibold text-stone-800 mb-3">🌤️ Trail Conditions & Weather</h2>
        <p className="text-sm text-stone-400">Could not load weather. Check back before you ride.</p>
        <p className="text-xs text-stone-400 mt-2">⚠️ Utah trails can be muddy 24–48 hrs after rain.</p>
      </div>
    )
  }

  // ── Parse current conditions ─────────────────────────────
  const cur         = weather.current
  const curCode     = weatherCodeMap[cur.weathercode] || { label: 'Unknown', icon: '❓', mtbRisk: 'medium' }
  const advice      = mtbAdvice[curCode.mtbRisk]
  const tempF       = Math.round(cur.temperature_2m)
  const windMph     = Math.round(cur.windspeed_10m)
  const precipIn    = cur.precipitation?.toFixed(2) ?? '0.00'

  // ── Parse 5-day forecast ─────────────────────────────────
  const daily       = weather.daily
  const forecastDays = daily?.time?.map((dateStr, i) => {
    const date    = new Date(dateStr + 'T12:00:00') // noon local avoids timezone edge cases
    const code    = weatherCodeMap[daily.weathercode[i]] || { label: 'Unknown', icon: '❓', mtbRisk: 'medium' }
    return {
      day:       dayNames[date.getDay()],
      icon:      code.icon,
      label:     code.label,
      risk:      code.mtbRisk,
      high:      Math.round(daily.temperature_2m_max[i]),
      low:       Math.round(daily.temperature_2m_min[i]),
      precip:    daily.precipitation_sum[i]?.toFixed(2) ?? '0.00',
    }
  }) ?? []

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
      <h2 className="font-semibold text-stone-800 mb-4">🌤️ Trail Conditions & Weather</h2>

      {/* MTB condition banner */}
      <div className={`rounded-xl border px-4 py-3 mb-4 flex items-center gap-2 ${advice.bg} ${advice.border}`}>
        <span className="text-lg">{curCode.icon}</span>
        <div>
          <div className={`font-semibold text-sm ${advice.color}`}>{advice.label}</div>
          <div className={`text-xs ${advice.color} opacity-75`}>{curCode.label} near {trailName}</div>
        </div>
      </div>

      {/* Current stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center bg-stone-50 rounded-xl p-3">
          <Thermometer size={16} className="text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-stone-800">{tempF}°F</div>
          <div className="text-xs text-stone-400">Temperature</div>
        </div>
        <div className="text-center bg-stone-50 rounded-xl p-3">
          <Wind size={16} className="text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-stone-800">{windMph} mph</div>
          <div className="text-xs text-stone-400">Wind</div>
        </div>
        <div className="text-center bg-stone-50 rounded-xl p-3">
          <Droplets size={16} className="text-sky-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-stone-800">{precipIn}"</div>
          <div className="text-xs text-stone-400">Precip today</div>
        </div>
      </div>

      {/* 5-day forecast */}
      {forecastDays.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">5-Day Forecast</p>
          <div className="grid grid-cols-5 gap-1">
            {forecastDays.map((day, i) => {
              // Risk color for each day's background
              const riskBg = day.risk === 'low' ? 'bg-green-50' : day.risk === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
              const riskDot = day.risk === 'low' ? 'bg-green-400' : day.risk === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
              return (
                <div key={i} className={`rounded-xl p-2 text-center ${riskBg}`}>
                  <div className="text-xs font-semibold text-stone-500 mb-1">{i === 0 ? 'Today' : day.day}</div>
                  <div className="text-xl mb-1">{day.icon}</div>
                  <div className="text-xs font-bold text-stone-700">{day.high}°</div>
                  <div className="text-xs text-stone-400">{day.low}°</div>
                  {/* Small colored dot = MTB risk indicator */}
                  <div className="flex justify-center mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${riskDot}`} title={`MTB risk: ${day.risk}`} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-stone-400 mt-2">
            🔴 Avoid · 🟡 Caution · 🟢 Ride on — dot = MTB condition estimate
          </p>
        </div>
      )}

      {/* Always show the mud warning */}
      <p className="text-xs text-stone-400 mt-3 border-t border-stone-100 pt-3">
        ⚠️ Utah dirt trails stay muddy 24–48 hrs after rain — riding wet trails causes damage. Check recent reports before heading out.
      </p>
    </div>
  )
}
