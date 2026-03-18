// app/bike/page.js
// My Bike Garage — Carvana-style bike viewer + Carfax-style maintenance tracker.
// Each maintenance item has: a how-to guide, buy links for parts/supplies, and annual cost.

'use client'

import { useState } from 'react'
import { Wrench, Plus, CheckCircle, AlertTriangle, XCircle, ChevronRight, ChevronDown, ExternalLink, DollarSign, X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// BIKE DATABASE
// Each bike has deep specs. Trek Roscoe 7 is pre-loaded with maximum detail.
// ─────────────────────────────────────────────────────────────────────────────
const popularBikes = [
  {
    id: 'trek-roscoe-7',
    brand: 'Trek',
    model: 'Roscoe 7',
    year: 2023,
    type: 'Hardtail',
    wheelSize: '27.5"+ (Plus)',
    travel: '130mm fork (RockShox Judy Silver)',
    weight: '14.8 kg / 32.6 lbs',
    bestFor: 'Trail / Beginner–Intermediate',
    msrp: '$1,399',
    color: 'Matte Trek Black / Dnister Black',
    frame: 'Alpha Silver Aluminum, internal cable routing, 148x12mm thru-axle',
    fork: 'RockShox Judy Silver TK, 130mm travel, coil spring, QR15x110mm, 51mm offset',
    drivetrain: 'Shimano Deore 1x10 — 32T chainring, 11-42T cassette',
    shifter: 'Shimano Deore M4100 10-speed trigger',
    derailleur: 'Shimano Deore M4120 long cage',
    brakes: 'Shimano MT200 hydraulic disc, 180mm front / 180mm rear rotors',
    wheelset: 'Bontrager Line Comp 30 TLR — 30mm internal width, tubeless-ready',
    tires: 'Bontrager XR4 Team Issue TLR 27.5x2.4" front, Bontrager XR3 Team Issue TLR 27.5x2.4" rear',
    seatpost: 'Bontrager Comp, 31.6mm diameter',
    saddle: 'Bontrager Arvada',
    handlebar: 'Bontrager Rhythm Comp, 780mm wide, 15mm rise',
    stem: 'Bontrager Elite, 50mm length',
    grips: 'Bontrager XR Trail Elite',
    headset: 'Semi-integrated, 1-1/8" to 1.5" tapered',
    bottomBracket: 'Shimano BB-MT500 threaded',
    crankset: 'Shimano Deore MT510, 170mm arms (S/M) / 175mm (M/L+)',
    pedals: 'Not included (platform pedals recommended)',
    tubeless: 'Tubeless-ready rims and tires — sealant not pre-installed',
    maxTireClearance: '27.5x2.8"',
    rearAxle: '148x12mm Boost thru-axle',
    frontAxle: 'QR15x110mm Boost thru-axle',
    bottomBracketType: 'BSA threaded 73mm shell',
  },
  { id: 'trek-marlin-5', brand: 'Trek', model: 'Marlin 5', year: 2024, type: 'Hardtail', wheelSize: '29"', travel: '100mm fork', weight: '14.3 kg', bestFor: 'Beginner XC / Trail', msrp: '$649', frame: 'Alpha Silver Aluminum', fork: 'SR Suntour XCT, 100mm', drivetrain: 'Shimano Tourney/Altus 3x7', brakes: 'Mechanical disc', wheelset: 'Bontrager alloy', tires: '29x2.2"', seatpost: '31.6mm', saddle: 'Bontrager Sport', handlebar: 'Bontrager alloy 720mm', stem: 'Bontrager alloy 60mm', grips: 'Bontrager MTB', headset: 'Semi-integrated', bottomBracket: 'BSA threaded', crankset: 'Shimano FC-TY501 3x', pedals: 'Platform included', tubeless: 'No', maxTireClearance: '29x2.4"', rearAxle: 'QR 135mm', frontAxle: 'QR 100mm', bottomBracketType: 'BSA threaded 68mm', color: 'Multiple', msrp: '$649' },
  { id: 'specialized-rockhopper', brand: 'Specialized', model: 'Rockhopper Sport', year: 2024, type: 'Hardtail', wheelSize: '29"', travel: '100mm fork', weight: '13.8 kg', bestFor: 'Beginner Trail', msrp: '$870', frame: 'A1 Premium Aluminum', fork: 'SR Suntour XCT, 100mm', drivetrain: 'Shimano Acera 2x8', brakes: 'Tektro HDC-M275 hydraulic disc', wheelset: 'Specialized alloy', tires: '29x2.1"', seatpost: '30.9mm', saddle: 'Specialized Sport MTB', handlebar: 'Specialized alloy 720mm', stem: 'Specialized alloy', grips: 'Specialized Trail', headset: 'semi-integrated', bottomBracket: 'BSA threaded', crankset: 'Shimano FC-M361 2x', pedals: 'Platform', tubeless: 'No', maxTireClearance: '29x2.3"', rearAxle: 'QR 135mm', frontAxle: 'QR 100mm', bottomBracketType: 'BSA 68mm', color: 'Multiple', msrp: '$870' },
  { id: 'trek-fuel-ex', brand: 'Trek', model: 'Fuel EX 5', year: 2024, type: 'Full Suspension', wheelSize: '29"', travel: '130mm / 130mm', weight: '14.7 kg', bestFor: 'Intermediate Trail', msrp: '$2,599', frame: 'Alpha Platinum Aluminum, ABP, Boost148', fork: 'Fox Rhythm 34, 130mm', drivetrain: 'Shimano Deore 1x12', brakes: 'Shimano MT520 hydraulic disc', wheelset: 'Bontrager Kovee Comp 23 TLR', tires: '29x2.4"', seatpost: 'Bontrager Drop Line 150mm dropper', saddle: 'Bontrager Arvada', handlebar: 'Bontrager Rhythm Comp 780mm', stem: 'Bontrager Elite 50mm', grips: 'Bontrager XR Trail Elite', headset: 'Integrated 1.5" tapered', bottomBracket: 'BSA threaded 73mm', crankset: 'Shimano Deore 170mm', pedals: 'Not included', tubeless: 'Yes', maxTireClearance: '29x2.6"', rearAxle: '148x12mm Boost', frontAxle: '15x110mm Boost', bottomBracketType: 'BSA 73mm', color: 'Multiple', msrp: '$2,599' },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE ITEMS
// Each has: how-to guide, buy links, DIY vs shop cost, annual estimate
// ─────────────────────────────────────────────────────────────────────────────
const maintenanceItems = [
  {
    id: 'tire-pressure',
    label: 'Tire Pressure',
    frequency: 'Before every ride',
    annualCost: '$0–$15',
    annualNote: 'Just a pump. No ongoing cost unless you go tubeless (sealant ~$15/yr)',
    howTo: [
      'Remove valve cap from Presta valve (long thin valve on MTB tires).',
      'Attach your floor pump — flip the lever to lock it on.',
      'For 27.5+ tires (like the Roscoe 7): aim for 18–22 PSI front, 20–24 PSI rear for trail riding.',
      'Higher pressure = faster but harsher. Lower = more grip but higher flat risk.',
      'Pump up, check the gauge, release the lever, replace the valve cap.',
      'Takes 2 minutes — do it before every single ride.',
    ],
    buyLinks: [
      { label: 'Topeak Joe Blow Floor Pump (great beginner pump)', url: 'https://www.amazon.com/s?k=topeak+joe+blow+floor+pump' },
      { label: 'Lezyne Digital Pressure Gauge (exact PSI readout)', url: 'https://www.amazon.com/s?k=lezyne+digital+pressure+gauge' },
    ],
  },
  {
    id: 'chain-lube',
    label: 'Chain Lubrication',
    frequency: 'Every 3–5 rides (or after wet/muddy rides)',
    annualCost: '$10–$25/year',
    annualNote: 'One bottle of lube lasts a full season for most riders',
    howTo: [
      'Wipe the chain with a dry rag first to remove old lube and grit.',
      'Apply one drop of lube to each chain link while slowly backpedaling — go all the way around.',
      'Let it soak in for 1–2 minutes.',
      'Wipe off ALL excess lube with a clean rag. Excess lube attracts dirt and creates a grinding paste.',
      'For dry/dusty Utah trails: use dry lube (wax-based). For wet/muddy: wet lube.',
      'Never spray WD-40 on your chain — it strips lubrication.',
    ],
    buyLinks: [
      { label: 'Finish Line Dry Teflon Lube — best for Utah dry trails', url: 'https://www.amazon.com/s?k=finish+line+dry+teflon+lube' },
      { label: 'Park Tool CM-25 Chain Cleaner Kit', url: 'https://www.amazon.com/s?k=park+tool+cm-25+chain+cleaner' },
      { label: 'WD-40 Specialist Bike Dry Lube (not regular WD-40)', url: 'https://www.amazon.com/s?k=wd40+specialist+bike+dry+lube' },
    ],
  },
  {
    id: 'brake-pads',
    label: 'Brake Pads',
    frequency: 'Inspect monthly, replace every 6–12 months (varies with use)',
    annualCost: '$20–$60/year',
    annualNote: "Shimano MT200 pads (your Roscoe 7 brakes) are ~$15–20/pair. Utah's dry rocky trails wear pads faster.",
    howTo: [
      'Remove the wheel. Look through the caliper slot — you should see the pad material.',
      'If the pad material is thinner than 1.5mm (about the thickness of a credit card), replace them.',
      'For Shimano MT200 (Roscoe 7): remove the cotter pin and pull the pad out from the bottom of the caliper.',
      'Insert new pads, replace the cotter pin, reinstall wheel.',
      'Bed in new pads: find a safe open area, ride at moderate speed, brake firmly (not skidding) 10–15 times.',
      'Bedding in transfers a thin layer of pad material to the rotor — critical for full stopping power.',
    ],
    buyLinks: [
      { label: 'Shimano B01S Resin Brake Pads (fits MT200 on your Roscoe 7)', url: 'https://www.amazon.com/s?k=shimano+b01s+brake+pads' },
      { label: 'Shimano N03A Metallic Pads (longer lasting, more bite)', url: 'https://www.amazon.com/s?k=shimano+n03a+brake+pads' },
    ],
  },
  {
    id: 'brake-bleed',
    label: 'Brake Bleed (Hydraulic)',
    frequency: 'Every 1–2 years, or when brakes feel spongy',
    annualCost: '$0 DIY (if you buy kit) / $40–$80 at shop per brake',
    annualNote: 'One-time kit purchase ~$30–50 covers multiple bleeds for years',
    howTo: [
      'Your Roscoe 7 has Shimano MT200 hydraulic brakes — they use mineral oil (NOT DOT fluid).',
      'Signs you need a bleed: spongy lever feel, lever pulls to handlebar, inconsistent braking.',
      'You need: Shimano bleed kit (funnel, syringe, tubing), Shimano mineral oil, and a T10 Torx wrench.',
      'Attach the funnel to the lever reservoir (top of brake lever), attach syringe to caliper bleed port.',
      'Push mineral oil through from caliper upward until clean oil runs out and no bubbles appear.',
      'Tip: This is a moderate DIY task. Watch a YouTube video for Shimano MT200 bleed first — it\'s doable but takes practice.',
      'If unsure, your local bike shop charges $40–$60 per brake — worth it for peace of mind.',
    ],
    buyLinks: [
      { label: 'Shimano TL-BT03-S Bleed Kit (official Shimano kit)', url: 'https://www.amazon.com/s?k=shimano+TL-BT03-S+bleed+kit' },
      { label: 'Shimano Mineral Oil 100ml', url: 'https://www.amazon.com/s?k=shimano+mineral+oil+brake+fluid' },
      { label: 'Wera T10 Torx screwdriver set', url: 'https://www.amazon.com/s?k=wera+torx+screwdriver+set' },
    ],
  },
  {
    id: 'drivetrain',
    label: 'Drivetrain Clean',
    frequency: 'Every 4–6 rides, deep clean monthly',
    annualCost: '$15–$40/year (supplies only)',
    annualNote: 'Degreaser, brushes, and lube are the main costs — all reusable',
    howTo: [
      'Quick clean (every few rides): wipe down the chain, cassette, and chainring with a dry rag while backpedaling.',
      'Deep clean (monthly): apply chain degreaser to the chain, cassette, and chainring.',
      'Use a stiff brush (old toothbrush works) to scrub the cassette cogs and chainring teeth.',
      'Rinse with water, dry thoroughly with a rag — wet components rust.',
      'Re-lube the chain after every cleaning (see Chain Lubrication above).',
      'Your Shimano Deore 1x10 drivetrain is low-maintenance vs. a 2x or 3x system — the single chainring simplifies things.',
    ],
    buyLinks: [
      { label: 'Park Tool CB-4 Chainbrush + Cassette Brush Set', url: 'https://www.amazon.com/s?k=park+tool+CB-4+brush' },
      { label: 'Muc-Off Drivetrain Degreaser (biodegradable)', url: 'https://www.amazon.com/s?k=muc-off+drivetrain+degreaser' },
      { label: 'Park Tool GSC-1 Gear Cleaning Brush Set', url: 'https://www.amazon.com/s?k=park+tool+GSC-1' },
    ],
  },
  {
    id: 'suspension',
    label: 'Fork Service (RockShox Judy Silver)',
    frequency: 'Lower leg service every 50 hrs / 1 season. Full rebuild every 2–3 seasons.',
    annualCost: '$0–$30 DIY lower leg / $80–$150 at shop for full service',
    annualNote: 'Your Roscoe 7 has the RockShox Judy Silver TK — a coil spring fork. Very reliable but needs regular oil.',
    howTo: [
      'Lower leg service (easy DIY, do once per season):',
      '1. Remove the front wheel. Remove the two bottom bolts on the fork lowers (5mm Allen).',
      '2. Pull the lower legs straight down off the upper tubes — some oil may drip out.',
      '3. Wipe everything clean with a rag.',
      '4. Add 5ml of RockShox Suspension Oil 15wt into each lower leg.',
      '5. Slide the lowers back up, reinstall bolts (hand-tight, then 6–8 Nm torque).',
      '6. The oil bathes the bushings and keeps the fork sliding smoothly.',
      'Full rebuild (every 2–3 seasons): Replaces the foam rings, seals, and all oil. Best left to a bike shop unless you\'re comfortable with wrenching.',
      'Signs it\'s needed: oil leaking from fork, rough/stiff action that doesn\'t improve with lower leg service.',
    ],
    buyLinks: [
      { label: 'RockShox Suspension Oil 15wt (fork lower oil)', url: 'https://www.amazon.com/s?k=rockshox+suspension+oil+15wt' },
      { label: 'RockShox Judy Service Kit (seals + foam rings)', url: 'https://www.amazon.com/s?k=rockshox+judy+service+kit' },
      { label: 'Park Tool SW-42 Pin Spanner (for fork caps)', url: 'https://www.amazon.com/s?k=park+tool+SW-42' },
    ],
  },
  {
    id: 'wheel-truing',
    label: 'Wheel Truing',
    frequency: 'As needed — check after crashes or rough rides',
    annualCost: '$0 DIY / $15–$25 per wheel at shop',
    annualNote: 'A truing stand is a $30–$60 investment that pays for itself quickly',
    howTo: [
      'Spin each wheel and look at the gap between the rim and brake caliper — watch for wobble (lateral) or hop (up/down).',
      'Lateral wobble: loosen spoke nipples on the side the rim is pulling toward, tighten on the opposite side.',
      'Use a spoke wrench (your Roscoe 7\'s Bontrager Line Comp 30 rims use a standard spoke nipple size).',
      'Small adjustments only — 1/4 turn at a time. Over-tightening breaks spokes.',
      'If the wobble is more than 3–4mm, or if multiple spokes are loose/broken, take it to a shop.',
      'Tip: Most minor truing can be done with the wheel on the bike. Just spin it slowly and use your fingers as a guide.',
    ],
    buyLinks: [
      { label: 'Park Tool SW-0C Spoke Wrench (compact, for trail use)', url: 'https://www.amazon.com/s?k=park+tool+SW-0C+spoke+wrench' },
      { label: 'Park Tool TS-2.2 Truing Stand (home workshop)', url: 'https://www.amazon.com/s?k=park+tool+TS-2.2+truing+stand' },
    ],
  },
  {
    id: 'bolts-torque',
    label: 'Bolt Torque Check',
    frequency: 'Monthly, and after any crash',
    annualCost: '$30–$60 one-time (torque wrench)',
    annualNote: 'Buy once, use forever. Critical for carbon components — aluminum like the Roscoe 7 is more forgiving but still important.',
    howTo: [
      'Key torque specs for your Trek Roscoe 7:',
      '• Stem clamp bolts: 5–6 Nm (very easy to over-tighten)',
      '• Handlebar clamp: 4–5 Nm',
      '• Brake lever clamp: 4–5 Nm',
      '• Brake caliper mounting bolts: 6–8 Nm',
      '• Rear thru-axle: 12–15 Nm',
      '• Front thru-axle: 15 Nm',
      '• Crank bolt: 40–50 Nm (needs a bigger wrench)',
      '• Seat clamp: 4–6 Nm',
      'Use a torque wrench — don\'t just "feel it." Over-tightening cracks things; under-tightening causes slipping.',
    ],
    buyLinks: [
      { label: 'Park Tool ATD-1.2 Torque Driver (1–10 Nm, perfect for stem/bars)', url: 'https://www.amazon.com/s?k=park+tool+ATD-1.2+torque+driver' },
      { label: 'Topeak Torque Wrench (full range, includes bits)', url: 'https://www.amazon.com/s?k=topeak+torque+wrench+bike' },
      { label: 'Bondhus Allen Key Set (fits all your bike\'s bolts)', url: 'https://www.amazon.com/s?k=bondhus+allen+key+set' },
    ],
  },
  {
    id: 'tubeless-sealant',
    label: 'Tubeless Sealant',
    frequency: 'Top up every 3–4 months, full replacement every 6 months',
    annualCost: '$25–$40/year',
    annualNote: 'Your Roscoe 7 rims and tires are tubeless-ready — highly recommended to set up. Eliminates most flat tires on Utah trails.',
    howTo: [
      'Your Bontrager Line Comp 30 rims + Bontrager XR4/XR3 tires are tubeless-ready from the factory — no tubes required.',
      'Initial setup: remove the tubes, add tubeless tape to the rim bed (if not pre-taped), install tubeless valves, seat the tire bead, add 2–3 oz of sealant per tire.',
      'To check sealant level (every 3 months): remove the valve core with a valve core remover, insert a thin rod into the valve — if it comes out dry, add more sealant.',
      'Add sealant through the valve core hole using a syringe.',
      'If a tire goes flat on trail: the sealant should seal small holes automatically. Give it 30 seconds and spin the wheel.',
      'Shake the tire to move sealant to the puncture. Still flat? Use a tubeless plug kit.',
    ],
    buyLinks: [
      { label: 'Stan\'s NoTubes Race Sealant 32oz (industry standard)', url: 'https://www.amazon.com/s?k=stans+notubes+race+sealant' },
      { label: 'Orange Seal Endurance Sealant (lasts longer between top-ups)', url: 'https://www.amazon.com/s?k=orange+seal+endurance+sealant' },
      { label: 'Dynaplug Micro Pro Tubeless Repair Kit (trail emergency)', url: 'https://www.amazon.com/s?k=dynaplug+micro+pro+tubeless' },
      { label: 'Valve Core Remover Tool', url: 'https://www.amazon.com/s?k=presta+valve+core+remover' },
    ],
  },
  {
    id: 'chain-replacement',
    label: 'Chain Replacement',
    frequency: 'Every 1–2 seasons (check stretch with a chain wear gauge)',
    annualCost: '$15–$30/year',
    annualNote: 'A worn chain destroys your cassette ($40–80) and chainring ($30–60). Replacing the chain on time saves money.',
    howTo: [
      'Use a chain wear gauge (Park Tool CC-3.2) — insert it into the chain. If the 0.75 side drops in, replace the chain.',
      'Your Roscoe 7 uses a 10-speed chain (Shimano Deore compatible).',
      'Use a chain breaker tool or quick link to remove the old chain.',
      'Count links on the old chain, size the new chain to match.',
      'Thread through the derailleur following the same path as the old chain.',
      'Join with a quick link (most chains include one) — no special tools needed.',
      'After installing: shift through all gears and check for skipping. If it skips on new chain + old cassette, the cassette may also need replacing.',
    ],
    buyLinks: [
      { label: 'Shimano CN-HG54 10-Speed Chain (direct Deore replacement)', url: 'https://www.amazon.com/s?k=shimano+CN-HG54+10+speed+chain' },
      { label: 'KMC X10 10-Speed Chain (good budget option)', url: 'https://www.amazon.com/s?k=kmc+x10+chain+10+speed' },
      { label: 'Park Tool CC-3.2 Chain Checker (essential tool)', url: 'https://www.amazon.com/s?k=park+tool+CC-3.2+chain+checker' },
      { label: 'Park Tool CT-3.2 Chain Tool (for cutting chain)', url: 'https://www.amazon.com/s?k=park+tool+CT-3.2' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// ANNUAL COST SUMMARY for Trek Roscoe 7
// ─────────────────────────────────────────────────────────────────────────────
const annualCostSummary = {
  low: 120,
  high: 275,
  breakdown: [
    { item: 'Chain lube',           low: 10,  high: 25  },
    { item: 'Brake pads',           low: 20,  high: 60  },
    { item: 'Tubeless sealant',     low: 25,  high: 40  },
    { item: 'Chain replacement',    low: 15,  high: 30  },
    { item: 'Fork lower leg oil',   low: 10,  high: 20  },
    { item: 'Misc supplies/cables', low: 20,  high: 50  },
    { item: 'Occasional shop visit',low: 20,  high: 50  },
  ],
}

const statusConfig = {
  good:    { label: '✅ Good',        color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100', icon: CheckCircle },
  soon:    { label: '⚠️ Check Soon',  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: AlertTriangle },
  overdue: { label: '🔴 Overdue',     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',   icon: XCircle },
  unknown: { label: '— Unknown',      color: 'text-stone-400',  bg: 'bg-stone-50',  border: 'border-stone-100', icon: Wrench },
}

export default function BikePage() {
  const [selectedBike, setSelectedBike]   = useState(null)
  const [showPicker, setShowPicker]       = useState(false)
  const [expandedItem, setExpandedItem]   = useState(null)  // which maintenance item is expanded
  const [statuses, setStatuses]           = useState(
    // Initialize all items as 'unknown' so user can update them
    Object.fromEntries(maintenanceItems.map(i => [i.id, 'unknown']))
  )
  const [showCostBreakdown, setShowCostBreakdown] = useState(false)

  // Find the currently selected bike's full spec object
  const bike = selectedBike ? popularBikes.find(b => b.id === selectedBike) : null

  function cycleStatus(id) {
    const order = ['unknown', 'good', 'soon', 'overdue']
    setStatuses(prev => {
      const current = prev[id]
      const next = order[(order.indexOf(current) + 1) % order.length]
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Bike Garage</h1>
        <p className="text-stone-500 text-sm mt-1">Your digital service record — like Carfax for your mountain bike.</p>
      </div>

      {/* ── BIKE CARD ───────────────────────────────────────────────────── */}
      {!bike ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center mb-6">
          <div className="text-5xl mb-4">🚵</div>
          <h2 className="font-semibold text-stone-800 mb-2">Add Your Bike</h2>
          <p className="text-sm text-stone-400 mb-5">
            Select your mountain bike to see deep specs and start tracking maintenance.
          </p>
          <button
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Select My Bike
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-6">

          {/* Hero header */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-950 p-6 text-white">
            <div className="text-4xl mb-3">🚵</div>
            <div className="text-xs text-orange-400 uppercase tracking-widest mb-1 font-medium">
              {bike.year} · {bike.type} · {bike.msrp}
            </div>
            <h2 className="text-2xl font-bold">{bike.brand} {bike.model}</h2>
            <p className="text-stone-400 text-sm mt-1">Best for: {bike.bestFor}</p>
            {bike.color && <p className="text-stone-500 text-xs mt-1">{bike.color}</p>}
          </div>

          {/* Top-level stats strip — like Carvana's key figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-stone-100 border-b border-stone-100">
            {[
              { label: 'Wheel Size',   value: bike.wheelSize },
              { label: 'Fork Travel',  value: bike.travel?.split(',')[0] ?? '—' },
              { label: 'Weight',       value: bike.weight },
              { label: 'Drivetrain',   value: bike.drivetrain?.split(' — ')[0] ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 text-center">
                <div className="text-xs text-stone-400 mb-1">{label}</div>
                <div className="font-semibold text-stone-800 text-sm">{value}</div>
              </div>
            ))}
          </div>

          {/* Full spec sheet — like a Carvana vehicle detail */}
          <div className="p-5">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Full Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[
                { label: 'Frame',           value: bike.frame },
                { label: 'Fork',            value: bike.fork },
                { label: 'Drivetrain',      value: bike.drivetrain },
                { label: 'Shifter',         value: bike.shifter },
                { label: 'Rear Derailleur', value: bike.derailleur },
                { label: 'Brakes',          value: bike.brakes },
                { label: 'Wheelset',        value: bike.wheelset },
                { label: 'Tires',           value: bike.tires },
                { label: 'Handlebar',       value: bike.handlebar },
                { label: 'Stem',            value: bike.stem },
                { label: 'Grips',           value: bike.grips },
                { label: 'Saddle',          value: bike.saddle },
                { label: 'Seatpost',        value: bike.seatpost },
                { label: 'Crankset',        value: bike.crankset },
                { label: 'Bottom Bracket',  value: bike.bottomBracket },
                { label: 'Rear Axle',       value: bike.rearAxle },
                { label: 'Front Axle',      value: bike.frontAxle },
                { label: 'Max Tire Clearance', value: bike.maxTireClearance },
                { label: 'Tubeless Ready',  value: bike.tubeless },
              ].filter(s => s.value).map(({ label, value }) => (
                <div key={label} className="flex gap-2 py-1.5 border-b border-stone-50">
                  <span className="text-xs text-stone-400 w-32 shrink-0">{label}</span>
                  <span className="text-xs text-stone-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <button onClick={() => setShowPicker(true)} className="text-xs text-stone-500 hover:text-orange-600 transition-colors">
              Change bike →
            </button>
            {bike.id === 'trek-roscoe-7' && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Your bike</span>
            )}
          </div>
        </div>
      )}

      {/* ── ANNUAL COST ESTIMATE ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
        <button
          onClick={() => setShowCostBreakdown(!showCostBreakdown)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-green-600" />
            <div className="text-left">
              <div className="font-semibold text-stone-800 text-sm">Estimated Annual Maintenance Cost</div>
              <div className="text-xs text-stone-400">
                ${annualCostSummary.low}–${annualCostSummary.high}/year for a {bike?.model ?? 'typical MTB'}
              </div>
            </div>
          </div>
          <ChevronDown size={16} className={`text-stone-400 transition-transform ${showCostBreakdown ? 'rotate-180' : ''}`} />
        </button>

        {showCostBreakdown && (
          <div className="mt-4 border-t border-stone-100 pt-4">
            <div className="space-y-2">
              {annualCostSummary.breakdown.map(row => (
                <div key={row.item} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">{row.item}</span>
                  <span className="text-stone-500 font-medium">${row.low}–${row.high}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between font-semibold text-stone-800 text-sm">
              <span>Total estimate</span>
              <span>${annualCostSummary.low}–${annualCostSummary.high}/year</span>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Assumes moderate riding (1–3x/week). DIY-friendly tasks handled at home. Major overhauls excluded.
            </p>
          </div>
        )}
      </div>

      {/* ── MAINTENANCE LOG ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Maintenance Guide & Log</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Tap any item to see how-to steps, buy links, and costs. Tap the status badge to update it.
          </p>
        </div>

        <div className="divide-y divide-stone-100">
          {maintenanceItems.map(item => {
            const status    = statuses[item.id]
            const s         = statusConfig[status]
            const StatusIcon = s.icon
            const isOpen    = expandedItem === item.id

            return (
              <div key={item.id} className={`transition-colors ${s.bg}`}>
                {/* Row header — always visible */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Status icon — tap to cycle through statuses */}
                  <button
                    onClick={() => cycleStatus(item.id)}
                    title="Tap to update status"
                    className="shrink-0"
                  >
                    <StatusIcon size={18} className={s.color} />
                  </button>

                  {/* Label + frequency */}
                  <button
                    onClick={() => setExpandedItem(isOpen ? null : item.id)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-sm text-stone-800">{item.label}</div>
                    <div className="text-xs text-stone-400">{item.frequency}</div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => cycleStatus(item.id)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.color} ${s.bg} ${s.border}`}
                    >
                      {s.label}
                    </button>
                    <button
                      onClick={() => setExpandedItem(isOpen ? null : item.id)}
                      className="text-stone-300 hover:text-stone-600"
                    >
                      <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail — how-to + buy links + cost */}
                {isOpen && (
                  <div className="px-5 pb-5 bg-white border-t border-stone-100">

                    {/* Annual cost */}
                    <div className="flex items-center gap-2 mt-4 mb-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <DollarSign size={14} className="text-green-600 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-green-700">{item.annualCost}</span>
                        <span className="text-xs text-green-600"> — {item.annualNote}</span>
                      </div>
                    </div>

                    {/* How-to guide */}
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">How to do it</h4>
                    <ol className="space-y-1.5 mb-4">
                      {item.howTo.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm text-stone-600">
                          {step.match(/^\d+\./) ? (
                            // Already numbered (sub-steps)
                            <span className="leading-relaxed">{step}</span>
                          ) : (
                            <>
                              <span className="shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                              <span className="leading-relaxed">{step}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ol>

                    {/* Buy links */}
                    {item.buyLinks.length > 0 && (
                      <>
                        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Buy What You Need</h4>
                        <div className="space-y-1.5">
                          {item.buyLinks.map(link => (
                            <a
                              key={link.label}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink size={12} className="shrink-0" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── BIKE PICKER MODAL ────────────────────────────────────────────── */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-stone-900">Select Your Bike</h3>
              <button onClick={() => setShowPicker(false)} className="text-stone-400 hover:text-stone-700"><X size={18} /></button>
            </div>
            <div className="divide-y divide-stone-100">
              {popularBikes.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBike(b.id); setShowPicker(false) }}
                  className={`w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 text-left transition-colors ${selectedBike === b.id ? 'bg-orange-50' : ''}`}
                >
                  <div>
                    <div className="font-semibold text-stone-800">
                      {b.brand} {b.model}
                      {b.id === 'trek-roscoe-7' && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Deep specs available</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">{b.year} · {b.type} · {b.wheelSize} · {b.msrp}</div>
                  </div>
                  <ChevronRight size={14} className="text-stone-300 shrink-0" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400">More bikes being added. Trek Roscoe 7 has the most detail.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
