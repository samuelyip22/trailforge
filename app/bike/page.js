// app/bike/page.js
// Bike Maintenance Tracker — logs when each component was last serviced,
// calculates days until next service, shows a health bar per component,
// and lets users set up email reminders via Resend.
// All service records are saved to Supabase so they persist across devices.

'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Wrench, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  ExternalLink, Bell, BellOff, Mail, Save, Clock, Calendar, Info,
} from 'lucide-react'

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ─── BIKE SPEC ────────────────────────────────────────────────────────────────
const BIKE = {
  brand: 'Trek', model: 'Roscoe 7', year: 2023,
  type: 'Hardtail', wheelSize: '27.5"+ (Plus)', travel: '130mm (RockShox Judy Silver)',
  weight: '14.8 kg / 32.6 lbs', color: 'Matte Trek Black',
  frame: 'Alpha Silver Aluminum, 148×12mm thru-axle, internal routing',
  fork: 'RockShox Judy Silver TK, 130mm, coil spring, Boost 15×110mm',
  drivetrain: 'Shimano Deore 1×10 — 32T ring / 11-42T cassette',
  brakes: 'Shimano MT200 hydraulic disc — 180mm rotors front & rear',
  wheels: 'Bontrager Line Comp 30 TLR — 30mm internal, tubeless-ready',
  tires: 'Bontrager XR4 27.5×2.4" front / XR3 27.5×2.4" rear (tubeless-ready)',
  dropper: 'No dropper — Bontrager Comp 31.6mm post',
  handlebar: 'Bontrager Rhythm Comp, 780mm wide, 15mm rise',
}

// ─── MAINTENANCE COMPONENTS ───────────────────────────────────────────────────
// intervalDays: how often this should be serviced
// priority: drives sort order and badge urgency
const COMPONENTS = [
  {
    id: 'tire-pressure',
    label: 'Tire Pressure Check',
    category: 'Wheels',
    intervalDays: 3,
    intervalNote: 'Before every ride',
    priority: 'high',
    shopCost: '$0',
    diyCost: '$0',
    howTo: [
      'Locate your Presta valves (long, thin — unscrew the small top nut first).',
      'Attach a floor pump with a Presta head and flip the lever to lock on.',
      'For 27.5"+ tires: 18–22 PSI front, 20–24 PSI rear on trail. Go lower for more grip, higher for speed.',
      'Check the gauge, pump to target, release the lever, retighten the valve nut.',
      'Takes 2 minutes — do it literally before every ride. Low pressure causes pinch flats.',
    ],
    buyLinks: [
      { label: 'Topeak Joe Blow Sport III Floor Pump', url: 'https://www.amazon.com/s?k=topeak+joe+blow+sport+floor+pump' },
      { label: 'Lezyne Digital Pressure Gauge', url: 'https://www.amazon.com/s?k=lezyne+digital+pressure+gauge+mtb' },
    ],
  },
  {
    id: 'chain-lube',
    label: 'Chain Lubrication',
    category: 'Drivetrain',
    intervalDays: 14,
    intervalNote: 'Every 3–5 rides, or after wet/muddy rides',
    priority: 'high',
    shopCost: '$0 (DIY only)',
    diyCost: '$10–25/yr',
    howTo: [
      'Wipe the chain with a dry rag to remove old lube and grit — backpedal while wiping.',
      'Apply one drop of lube to EACH chain link while slowly backpedaling. Go all the way around once.',
      'Wait 1–2 minutes for it to soak into the rollers.',
      'Wipe off ALL excess lube with a clean rag. Excess attracts dirt and creates a grinding paste.',
      'For dry Utah trails: use dry/wax lube. After rain or mud: use wet lube.',
      'Never use WD-40 — it strips lubrication and attracts grit.',
    ],
    buyLinks: [
      { label: 'Finish Line Dry Teflon Lube — best for Utah dry trails', url: 'https://www.amazon.com/s?k=finish+line+dry+teflon+bicycle+lube' },
      { label: 'Park Tool Cyclone Chain Scrubber CM-25', url: 'https://www.amazon.com/s?k=park+tool+cm-25+chain+scrubber' },
    ],
  },
  {
    id: 'chain-wear',
    label: 'Chain Wear Check',
    category: 'Drivetrain',
    intervalDays: 90,
    intervalNote: 'Every 3 months or ~500 miles',
    priority: 'high',
    shopCost: '$15 at shop',
    diyCost: '$5 (tool) + $20–35 chain',
    howTo: [
      'Use a chain wear indicator tool (Park Tool CC-3.2 or similar). Insert the 0.5% side first.',
      "If the 0.5% hook drops into a link, your chain has 50% wear — replace it before it damages the cassette.",
      "If the 0.75% side drops in, the cassette may already be worn — you'll likely need both.",
      'Your Roscoe 7 runs a Shimano 10-speed chain. Replace with a Shimano CN-M6100 or similar.',
      'A new chain costs $15–30. Replacing a cassette costs $40–80. Keeping up with chain replacement saves money.',
    ],
    buyLinks: [
      { label: 'Park Tool CC-3.2 Chain Wear Indicator', url: 'https://www.amazon.com/s?k=park+tool+CC-3.2+chain+checker' },
      { label: 'Shimano CN-M6100 10-Speed Chain', url: 'https://www.amazon.com/s?k=shimano+cn-m6100+chain+10+speed' },
    ],
  },
  {
    id: 'brake-pads',
    label: 'Brake Pad Inspection',
    category: 'Brakes',
    intervalDays: 60,
    intervalNote: 'Inspect every 2 months, replace when worn',
    priority: 'high',
    shopCost: '$30–50/brake installed',
    diyCost: '$15–20 per pair (pads only)',
    howTo: [
      'Remove the wheel. Shine a light into the caliper — you should see the brake pad material on both sides.',
      'If the pad material is thinner than 1.5mm (credit card thickness) — replace immediately.',
      'For Shimano MT200 (your Roscoe 7): remove the cotter pin with pliers, pull the pad out from the bottom of the caliper.',
      'Insert new pads (Shimano B01S resin or N03A metallic — metallic lasts longer on rocky trails).',
      'Replace cotter pin, reinstall wheel. Bed in new pads: ride at moderate speed and brake firmly 10–15 times without skidding.',
      "Bedding is critical — it transfers a thin layer of pad material to the rotor for full stopping power. Don't skip it.",
    ],
    buyLinks: [
      { label: 'Shimano B01S Resin Pads — OEM fit for MT200', url: 'https://www.amazon.com/s?k=shimano+b01s+brake+pads' },
      { label: 'Shimano N03A Metallic Pads — longer life on rocky trails', url: 'https://www.amazon.com/s?k=shimano+n03a+metallic+brake+pads' },
    ],
  },
  {
    id: 'brake-bleed',
    label: 'Brake Bleed (Hydraulic)',
    category: 'Brakes',
    intervalDays: 365,
    intervalNote: 'Every 12 months, or when levers feel spongy',
    priority: 'medium',
    shopCost: '$40–60 per brake at shop',
    diyCost: '$35 kit + $8 mineral oil',
    howTo: [
      'Your Roscoe 7 has Shimano MT200 hydraulic brakes. They use MINERAL OIL — NOT DOT fluid. Do not mix up.',
      'Signs you need a bleed: spongy lever, lever pulls to handlebar, inconsistent braking power.',
      'Tools needed: Shimano bleed funnel kit (TL-BT03-S), Shimano mineral oil, T10 Torx wrench.',
      'Attach the bleed funnel to the lever reservoir. Attach a syringe to the caliper bleed port.',
      'Push mineral oil through from caliper upward until clean oil with no bubbles runs into the funnel.',
      'Close both ports, remove tools, wipe up any spills (oil contaminates brake pads).',
      'This is a moderate DIY task. Watch a "Shimano MT200 bleed" video before attempting the first time.',
    ],
    buyLinks: [
      { label: 'Shimano TL-BT03-S Bleed Kit (official)', url: 'https://www.amazon.com/s?k=shimano+TL-BT03-S+bleed+kit' },
      { label: 'Shimano Mineral Oil 100ml', url: 'https://www.amazon.com/s?k=shimano+mineral+oil+brake' },
    ],
  },
  {
    id: 'drivetrain-clean',
    label: 'Drivetrain Deep Clean',
    category: 'Drivetrain',
    intervalDays: 30,
    intervalNote: 'Monthly (or every 10 rides)',
    priority: 'medium',
    shopCost: '$25–40 at shop',
    diyCost: '$15–30/yr (supplies)',
    howTo: [
      'Quick clean (every few rides): wipe chain, chainring, and cassette with a dry rag while backpedaling.',
      'Deep clean (monthly): apply degreaser to chain, cassette, and chainring. Let soak for 2–3 minutes.',
      'Scrub cassette cogs with a stiff brush. Use an old toothbrush between the teeth of the chainring.',
      'Rinse with water. Dry everything thoroughly — wet steel rusts fast.',
      'Re-lube the chain (see Chain Lubrication above) after every cleaning.',
      'Your 1×10 Shimano Deore drivetrain is simpler than multi-ring setups — cleaning is easier and faster.',
    ],
    buyLinks: [
      { label: 'Muc-Off Drivetrain Degreaser (biodegradable)', url: 'https://www.amazon.com/s?k=muc-off+drivetrain+degreaser' },
      { label: 'Park Tool GSC-1 Gear Cleaning Brush Set', url: 'https://www.amazon.com/s?k=park+tool+GSC-1+brush' },
    ],
  },
  {
    id: 'fork-lower-service',
    label: 'Fork Lower Leg Service',
    category: 'Suspension',
    intervalDays: 180,
    intervalNote: 'Every 6 months / 50 riding hours',
    priority: 'high',
    shopCost: '$60–80 at shop',
    diyCost: '$10–15 (oil only)',
    howTo: [
      'Your RockShox Judy Silver TK is a coil fork. Lower leg service keeps bushings lubed and seals clean.',
      'Remove the front wheel. Find the two bottom bolts on the fork lower legs (5mm Allen key).',
      'Loosen both bolts 2 turns each. Pull the lower legs straight down off the upper tubes. Some oil will drip — have a rag ready.',
      'Wipe the upper tubes and inside of the lower legs completely clean.',
      'Add exactly 5ml of RockShox Suspension Oil 15wt into each lower leg (a syringe helps).',
      'Slide the lowers back up, reinstall bolts — hand tight first, then torque to 6–8 Nm.',
      'Signs it is needed: oil leaking past seals, rough/scratchy fork action, clicking sounds.',
    ],
    buyLinks: [
      { label: 'RockShox Suspension Oil 15wt (lower leg oil)', url: 'https://www.amazon.com/s?k=rockshox+suspension+oil+15wt' },
      { label: 'RockShox Judy Silver Service Kit (seals + foam rings)', url: 'https://www.amazon.com/s?k=rockshox+judy+silver+service+kit' },
    ],
  },
  {
    id: 'tubeless-sealant',
    label: 'Tubeless Sealant Refresh',
    category: 'Wheels',
    intervalDays: 150,
    intervalNote: 'Every 4–5 months (sealant dries out)',
    priority: 'medium',
    shopCost: '$20 at shop',
    diyCost: '$10–15 per bottle',
    howTo: [
      'Your Roscoe 7 has tubeless-ready tires and rims but sealant is NOT pre-installed — you need to add it.',
      'To check sealant level: remove the valve core (valve core remover tool), tip the wheel sideways, listen for liquid sloshing.',
      'To add sealant: remove valve core, inject 2–3oz of sealant through the valve stem using a syringe or sealant injector.',
      'Spin the wheel to distribute sealant across the entire tire interior.',
      'Going tubeless (if you have not yet): watch a "tubeless MTB setup" video — you will need rim tape, a tubeless valve, and sealant.',
      'Dried-out sealant means the next puncture will not seal automatically. Do not skip this.',
    ],
    buyLinks: [
      { label: 'Orange Seal Endurance Sealant 8oz', url: 'https://www.amazon.com/s?k=orange+seal+endurance+tubeless+sealant' },
      { label: 'Stan\'s NoTubes Sealant (the original)', url: 'https://www.amazon.com/s?k=stans+notubes+tubeless+sealant' },
      { label: 'Sealant Injector + Valve Core Tool', url: 'https://www.amazon.com/s?k=tubeless+sealant+injector+valve+core+tool' },
    ],
  },
  {
    id: 'wheel-true',
    label: 'Wheel True Check',
    category: 'Wheels',
    intervalDays: 180,
    intervalNote: 'Every 6 months, or after a hard crash',
    priority: 'low',
    shopCost: '$15–25 per wheel',
    diyCost: '$8 spoke wrench',
    howTo: [
      'Spin each wheel slowly and watch the gap between the rim and the brake caliper pads.',
      'Lateral wobble (side-to-side): loosen spokes on the side the rim is pulling toward, tighten on the opposite side. Quarter turns only.',
      'Radial hop (up-down): find the high spot and tighten the nearest spokes slightly.',
      'Your Bontrager Line Comp 30 rims use a standard spoke nipple — a Park Tool SW-0C spoke wrench fits.',
      'If the wobble is more than 3–4mm or if multiple spokes are broken, take it to a shop.',
      'Bent rims from impacts cannot be trued — they need to be replaced.',
    ],
    buyLinks: [
      { label: 'Park Tool SW-0C Compact Spoke Wrench', url: 'https://www.amazon.com/s?k=park+tool+sw-0c+spoke+wrench' },
      { label: 'Park Tool TS-2.2 Home Truing Stand', url: 'https://www.amazon.com/s?k=park+tool+TS-2.2+truing+stand' },
    ],
  },
  {
    id: 'headset-check',
    label: 'Headset & Stem Bolt Check',
    category: 'Cockpit',
    intervalDays: 90,
    intervalNote: 'Every 3 months',
    priority: 'medium',
    shopCost: '$15 at shop',
    diyCost: '$0 (just a torque wrench)',
    howTo: [
      'Apply the front brake and rock the bike forward and backward. Any looseness in the headset = clunking or movement at the head tube.',
      'To tighten: loosen the two stem face bolts slightly, tighten the top cap bolt until the play is gone, re-tighten stem face bolts.',
      'Check stem face bolts (4 bolts holding the handlebar): should be torqued to 4–6 Nm. Do not overtighten — carbon bars can crack.',
      'Check the stem clamp bolts (2 bolts on the steering tube): typically 5–6 Nm.',
      'A loose headset causes vague steering and uneven wear on bearings. Check it regularly.',
    ],
    buyLinks: [
      { label: 'Bondhus Allen Key Set (3–8mm, T-handle)', url: 'https://www.amazon.com/s?k=bondhus+allen+key+set+t-handle' },
      { label: 'Prestacycle Torque Wrench (beginner-friendly)', url: 'https://www.amazon.com/s?k=prestacycle+torque+wrench+bicycle' },
    ],
  },
]

// ─── STATUS HELPERS ───────────────────────────────────────────────────────────
// Calculate how healthy a component is based on last service date + interval

function getDaysSince(dateString) {
  if (!dateString) return null
  return Math.floor((Date.now() - new Date(dateString)) / 86400000)
}

function getStatus(componentId, records, intervalDays) {
  const rec = records[componentId]
  if (!rec?.last_service_date) return 'unknown'
  const daysSince = getDaysSince(rec.last_service_date)
  const daysLeft  = intervalDays - daysSince
  if (daysLeft < 0)  return 'overdue'
  if (daysLeft <= 14) return 'due-soon'
  return 'good'
}

function getHealthPercent(componentId, records, intervalDays) {
  const rec = records[componentId]
  if (!rec?.last_service_date) return 0
  const daysSince = getDaysSince(rec.last_service_date)
  return Math.max(0, Math.min(100, Math.round((1 - daysSince / intervalDays) * 100)))
}

function getDaysLeft(componentId, records, intervalDays) {
  const rec = records[componentId]
  if (!rec?.last_service_date) return null
  const daysSince = getDaysSince(rec.last_service_date)
  return intervalDays - daysSince
}

const STATUS_CONFIG = {
  good:     { label: 'Good',     color: 'bg-green-100 text-green-800',  dot: 'bg-green-500',  bar: 'bg-green-500',  Icon: CheckCircle },
  'due-soon': { label: 'Due Soon', color: 'bg-amber-100 text-amber-800',  dot: 'bg-amber-400',  bar: 'bg-amber-400',  Icon: AlertTriangle },
  overdue:  { label: 'Overdue',  color: 'bg-red-100 text-red-800',     dot: 'bg-red-500',    bar: 'bg-red-500',    Icon: XCircle },
  unknown:  { label: 'Not Set',  color: 'bg-stone-100 text-stone-500', dot: 'bg-stone-300',  bar: 'bg-stone-200',  Icon: Clock },
}

const CATEGORY_ORDER = ['Drivetrain', 'Brakes', 'Suspension', 'Wheels', 'Cockpit']

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default function BikePage() {
  // Service records from Supabase — keyed by component_id
  const [records, setRecords]             = useState({})
  // Which how-to card is currently expanded
  const [expanded, setExpanded]           = useState(null)
  // Which component we are marking as serviced (shows a confirm banner)
  const [marking, setMarking]             = useState(null)
  const [markNotes, setMarkNotes]         = useState('')
  // Notification settings
  const [notifEmail, setNotifEmail]       = useState('')
  const [notifDays, setNotifDays]         = useState(14)
  const [notifEnabled, setNotifEnabled]   = useState(true)
  const [notifSaving, setNotifSaving]     = useState(false)
  const [notifSaved, setNotifSaved]       = useState(false)
  // Auth + loading state
  const [user, setUser]                   = useState(null)
  const [loading, setLoading]             = useState(true)

  // On mount: load user, then load their service records + notification settings
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await Promise.all([loadRecords(user.id), loadNotifSettings(user.id)])
      }
      setLoading(false)
    }
    init()
  }, [])

  async function loadRecords(userId) {
    const { data } = await supabase
      .from('bike_maintenance')
      .select('component_id, last_service_date, notes')
      .eq('user_id', userId)
    if (data) {
      const map = {}
      data.forEach(r => { map[r.component_id] = r })
      setRecords(map)
    }
  }

  async function loadNotifSettings(userId) {
    const { data } = await supabase
      .from('notification_settings')
      .select('email, notify_days_before, enabled')
      .eq('user_id', userId)
      .single()
    if (data) {
      setNotifEmail(data.email || '')
      setNotifDays(data.notify_days_before || 14)
      setNotifEnabled(data.enabled ?? true)
    }
  }

  // Mark a component as serviced today — saves to Supabase
  async function markServiced(componentId) {
    if (!user) { alert('Sign in to track service dates.'); return }
    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase.from('bike_maintenance').upsert({
      user_id: user.id,
      component_id: componentId,
      last_service_date: today,
      notes: markNotes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,component_id' })
    if (!error) {
      setRecords(prev => ({ ...prev, [componentId]: { last_service_date: today, notes: markNotes } }))
      setMarking(null)
      setMarkNotes('')
    }
  }

  // Save notification preferences
  async function saveNotifSettings() {
    if (!user) { alert('Sign in to save notification settings.'); return }
    setNotifSaving(true)
    await supabase.from('notification_settings').upsert({
      user_id: user.id,
      email: notifEmail,
      notify_days_before: notifDays,
      enabled: notifEnabled,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setNotifSaving(false)
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 3000)
  }

  // Count components by status
  const statusCounts = COMPONENTS.reduce((acc, c) => {
    const s = getStatus(c.id, records, c.intervalDays)
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center text-stone-400">Loading maintenance tracker…</div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── BIKE HEADER ──────────────────────────────────────────────── */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1">My Bike</div>
            <h1 className="text-2xl font-bold">{BIKE.brand} {BIKE.model} <span className="text-stone-400 font-normal text-xl">{BIKE.year}</span></h1>
            <div className="text-stone-300 text-sm mt-1">{BIKE.type} · {BIKE.wheelSize} · {BIKE.travel}</div>
          </div>
          <div className="text-right text-sm text-stone-400">
            <div>{BIKE.weight}</div>
            <div>{BIKE.color}</div>
          </div>
        </div>

        {/* Quick spec pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-700">
          {[
            BIKE.drivetrain.split('—')[0].trim(),
            BIKE.brakes.split('—')[0].trim(),
            BIKE.wheels.split('—')[0].trim(),
          ].map(s => (
            <span key={s} className="text-xs bg-stone-700 text-stone-300 px-2.5 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* ── STATUS SUMMARY ───────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { key: 'good',     label: 'Good',      color: 'text-green-600 bg-green-50 border-green-200' },
          { key: 'due-soon', label: 'Due Soon',  color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { key: 'overdue',  label: 'Overdue',   color: 'text-red-600 bg-red-50 border-red-200' },
          { key: 'unknown',  label: 'Not Logged', color: 'text-stone-500 bg-stone-50 border-stone-200' },
        ].map(({ key, label, color }) => (
          <div key={key} className={`rounded-xl border p-3 text-center ${color}`}>
            <div className="text-2xl font-bold">{statusCounts[key] || 0}</div>
            <div className="text-xs font-medium mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── NOT LOGGED IN BANNER ─────────────────────────────────────── */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-stone-800">Sign in to track your service history</div>
            <p className="text-xs text-stone-500 mt-0.5">
              Service dates and email reminders are saved to your account.{' '}
              <a href="/login" className="text-orange-600 font-medium hover:underline">Sign in →</a>
            </p>
          </div>
        </div>
      )}

      {/* ── EMAIL NOTIFICATION SETTINGS ──────────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-orange-500" />
          <h2 className="font-semibold text-stone-800">Email Reminders</h2>
          {notifEnabled
            ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">Active</span>
            : <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full ml-auto">Paused</span>
          }
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-stone-500 font-medium uppercase tracking-wide block mb-1">Email address</label>
            <input
              type="email"
              value={notifEmail}
              onChange={e => setNotifEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-stone-500 font-medium uppercase tracking-wide block mb-1">Notify me</label>
              <select
                value={notifDays}
                onChange={e => setNotifDays(Number(e.target.value))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                <option value={7}>7 days before service is due</option>
                <option value={14}>14 days before service is due</option>
                <option value={30}>30 days before service is due</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 font-medium uppercase tracking-wide block mb-1">Enabled</label>
              <button
                onClick={() => setNotifEnabled(p => !p)}
                className={`w-12 h-7 rounded-full transition-colors relative ${notifEnabled ? 'bg-orange-500' : 'bg-stone-200'}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${notifEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <button
            onClick={saveNotifSettings}
            disabled={notifSaving || !notifEmail}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Save size={14} />
            {notifSaving ? 'Saving…' : notifSaved ? '✓ Saved!' : 'Save Reminder Settings'}
          </button>
          <p className="text-xs text-stone-400">
            You will receive an email when a component is coming up for service. Powered by your Resend integration.
          </p>
        </div>
      </div>

      {/* ── COMPONENT LIST ───────────────────────────────────────────── */}
      <h2 className="text-lg font-bold text-stone-900 mb-3">Component Health</h2>

      {CATEGORY_ORDER.map(cat => {
        const catComponents = COMPONENTS.filter(c => c.category === cat)
        return (
          <div key={cat} className="mb-6">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">{cat}</div>
            <div className="space-y-2">
              {catComponents.map(comp => {
                const status    = getStatus(comp.id, records, comp.intervalDays)
                const health    = getHealthPercent(comp.id, records, comp.intervalDays)
                const daysLeft  = getDaysLeft(comp.id, records, comp.intervalDays)
                const cfg       = STATUS_CONFIG[status]
                const rec       = records[comp.id]
                const isExpanded = expanded === comp.id
                const isMarking  = marking === comp.id

                return (
                  <div key={comp.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">

                    {/* ── COMPONENT HEADER ROW ───────────────────── */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Name + status badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-stone-900 text-sm">{comp.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                              <cfg.Icon size={10} />
                              {cfg.label}
                            </span>
                          </div>

                          {/* Interval note */}
                          <div className="text-xs text-stone-400 mt-0.5">{comp.intervalNote}</div>

                          {/* Health bar */}
                          <div className="mt-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-stone-400">
                                {rec?.last_service_date
                                  ? `Last: ${new Date(rec.last_service_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                  : 'Never serviced'}
                              </span>
                              <span className="text-xs font-medium text-stone-500">
                                {daysLeft === null ? '—'
                                  : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue`
                                  : `${daysLeft}d left`}
                              </span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${cfg.bar}`}
                                style={{ width: `${health}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={() => { setMarking(isMarking ? null : comp.id); setMarkNotes('') }}
                            className="text-xs font-semibold bg-stone-900 text-white hover:bg-orange-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Mark Serviced
                          </button>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : comp.id)}
                            className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
                          >
                            How-to {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>
                      </div>

                      {/* ── MARK AS SERVICED CONFIRM ─────────────── */}
                      {isMarking && (
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <div className="text-xs font-semibold text-stone-700 mb-1.5">Mark <span className="text-orange-500">{comp.label}</span> as serviced today?</div>
                          <input
                            type="text"
                            value={markNotes}
                            onChange={e => setMarkNotes(e.target.value)}
                            placeholder="Optional note (e.g. used Muc-Off, replaced pads)…"
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs mb-2 focus:outline-none focus:border-orange-400"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => markServiced(comp.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                              <CheckCircle size={12} /> Confirm
                            </button>
                            <button onClick={() => setMarking(null)} className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1.5">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cost reference */}
                      <div className="flex gap-4 mt-3 pt-2 border-t border-stone-50">
                        <span className="text-xs text-stone-400">DIY: <span className="text-stone-600 font-medium">{comp.diyCost}</span></span>
                        <span className="text-xs text-stone-400">Shop: <span className="text-stone-600 font-medium">{comp.shopCost}</span></span>
                      </div>
                    </div>

                    {/* ── HOW-TO GUIDE (expandable) ─────────────── */}
                    {isExpanded && (
                      <div className="border-t border-stone-100 bg-stone-50 p-4">
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Step-by-step guide</div>
                        <ol className="space-y-2 mb-4">
                          {comp.howTo.map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                              <span className="bg-stone-200 text-stone-600 rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0 text-[10px]">{i + 1}</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Buy links</div>
                        <div className="space-y-1.5">
                          {comp.buyLinks.map(link => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              <ExternalLink size={11} className="shrink-0" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                        {rec?.notes && (
                          <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-500">
                            <span className="font-semibold">Last service note:</span> {rec.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── FULL BIKE SPECS ──────────────────────────────────────────── */}
      <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Full Specifications — {BIKE.brand} {BIKE.model} {BIKE.year}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {Object.entries({
            Frame: BIKE.frame, Fork: BIKE.fork, Drivetrain: BIKE.drivetrain,
            Brakes: BIKE.brakes, Wheels: BIKE.wheels, Tires: BIKE.tires,
            Handlebar: BIKE.handlebar, Seatpost: BIKE.dropper,
          }).map(([k, v]) => (
            <div key={k} className="border-b border-stone-100 py-2">
              <div className="text-xs text-stone-400 font-medium uppercase tracking-wide">{k}</div>
              <div className="text-sm text-stone-700 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
