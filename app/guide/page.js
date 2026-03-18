// app/guide/page.js
// MTB Skills Guide — teaches riders how to improve, from beginner to advanced.
// Includes expandable technique cards + trail recommendations from our real data.
// 'use client' needed for the accordion open/close state on technique cards.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown, ChevronUp, Bike, Target, TrendingUp, TrendingDown,
  RotateCcw, AlertTriangle, CheckCircle, ArrowRight, Star, Zap, Shield
} from 'lucide-react'

// ─── TECHNIQUE DATA ───────────────────────────────────────────────────────────
// Each skill card: title, icon, short summary, why it matters, step-by-step tips,
// common mistakes to avoid, and what level it applies to.

const techniques = [
  {
    id: 'body-position',
    title: 'Attack Position',
    icon: Shield,
    level: 'beginner',
    levelLabel: '🟢 Start Here',
    summary: 'The foundation of all MTB riding. Get this right and everything else gets easier.',
    why: 'A proper ready position keeps your weight centered, gives you quick reactions, and prevents getting "bucked" by rough terrain. Most crashes happen because riders are tense and stiff — not low and loose.',
    tips: [
      'Stand on your pedals with cranks level (3 and 9 o\'clock) — this is called the "neutral" position',
      'Bend your elbows wide (like a gorilla) — never lock your arms straight',
      'Bend your knees slightly, weight evenly between both feet',
      'Look 10–20 feet ahead, not at your front wheel',
      'Keep your chin up and your shoulders relaxed — tension causes crashes',
      'When terrain gets rough, drop your heels and sit your hips back (this is the "attack" position)',
    ],
    mistakes: [
      'Locking your elbows straight — absorbs no impact',
      'Looking at the ground in front of your wheel',
      'Gripping the bars like your life depends on it — relax your hands',
      'Sitting down on rough descents — stand up and use your legs as suspension',
    ],
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'braking',
    title: 'Braking',
    icon: AlertTriangle,
    level: 'beginner',
    levelLabel: '🟢 Essential',
    summary: 'Bad braking causes more crashes than almost anything else. Learn to brake like a pro.',
    why: 'Most new riders either grab the brakes too hard (locking wheels, losing control) or brake at the wrong time — in the middle of corners. Good braking means slower speeds with more control.',
    tips: [
      'Always brake BEFORE a corner — not during. Carry momentum through turns.',
      'Use both brakes together — front provides 70% of stopping power, rear prevents skidding',
      'Feather the brakes (squeeze gently and progressively) — don\'t grab them suddenly',
      'On steep descents, drag both brakes lightly to control speed rather than grabbing hard',
      'When braking hard, shift your weight back to keep the front wheel from washing out',
      'Practice emergency stops in a parking lot before you need them on trail',
    ],
    mistakes: [
      'Braking mid-corner — you\'ll lose the front wheel and slide out',
      'Only using the rear brake — it just skids and slows you less',
      'Grabbing the front brake hard while descending — this throws you over the bars',
      'Braking on roots or rocks — brake on dirt, coast over slick obstacles',
    ],
    color: 'bg-yellow-50 border-yellow-200',
    badgeColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'cornering',
    title: 'Cornering',
    icon: RotateCcw,
    level: 'beginner',
    levelLabel: '🟢 Foundation',
    summary: 'Smooth corners = flow. Mastering turns is what separates beginners from confident riders.',
    why: 'Cornering is where most speed is lost or gained. Getting it right means you stay in control, carry more speed, and feel less like you\'re fighting the bike.',
    tips: [
      'LOOK through the corner — your eyes lead, the bike follows. Look at the exit, not the apex.',
      'Outside foot DOWN at the bottom (6 o\'clock) — this lowers your center of gravity and gives grip',
      'Lean the bike more than your body — push the handlebar into the turn with your outside hand',
      'Brake before the corner, not during — carry controlled speed through the turn',
      'Weight your outside pedal and push down into the corner through your feet',
      'On bermed corners (banked), you can go faster — the berm is your friend',
    ],
    mistakes: [
      'Looking at the inside of the turn instead of where you\'re going',
      'Inside foot down — this is the most common beginner mistake',
      'Braking in the corner — wash-out guaranteed',
      'Leaning your body and keeping the bike upright — lean the bike, not yourself',
    ],
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'climbing',
    title: 'Climbing',
    icon: TrendingUp,
    level: 'beginner',
    levelLabel: '🟢 Cardio + Technique',
    summary: 'Climbing isn\'t just fitness — technique makes a huge difference on steep or technical uphills.',
    why: 'Poor technique on climbs means spinning out, losing traction, or getting exhausted. Good climbing technique conserves energy and keeps your rear wheel biting.',
    tips: [
      'Stay seated as much as possible — standing uses more energy and reduces rear wheel traction on loose terrain',
      'Shift to an easier gear BEFORE you need it — don\'t wait until you\'re grinding to a stop',
      'Keep a steady, smooth cadence — mashing big gears is inefficient',
      'Slide forward on the saddle and lower your chest slightly to weight the front wheel',
      'Look ahead and plan your line — commit to momentum through technical sections',
      'On loose switchbacks, stay seated, keep weight back, and pedal smoothly through the turn',
    ],
    mistakes: [
      'Shifting gears when you\'re already under load — shifts late and can drop the chain',
      'Standing up on loose climbs — rear wheel loses grip',
      'Stopping and restarting on steep sections — much harder than maintaining momentum',
      'Looking down at your front wheel instead of the trail ahead',
    ],
    color: 'bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'descending',
    title: 'Descending',
    icon: TrendingDown,
    level: 'intermediate',
    levelLabel: '🟡 Level Up',
    summary: 'Descending confidently is what makes MTB feel like flying. It\'s mostly about where you look.',
    why: 'Most riders fear descents because they look too close to the front wheel. Extend your vision further ahead and your body will naturally react in time — the trail will feel slower and more manageable.',
    tips: [
      'Drop your heels — push your weight through your feet, not your hands. This prevents going over the bars.',
      'Look at least 10–15 feet ahead. The further ahead you look, the smoother it feels.',
      'Sit your hips back and low on steep sections — think "butt over the rear wheel"',
      'Keep your elbows bent and wide, grip light enough that you could open your hands slightly',
      'Pick a line and commit — hesitating mid-section is worse than committing to the wrong line',
      'Let the bike move under you — your arms and legs are suspension, let them absorb hits',
    ],
    mistakes: [
      'Death-gripping the bars — makes your arms rigid, transmits every bump to your whole body',
      'Sitting down on steep descents — puts weight over the front wheel dangerously',
      'Squeezing your knees against the frame — you need your legs loose to absorb impacts',
      'Staring at the obstacle you want to avoid — your bike will go where you look',
    ],
    color: 'bg-purple-50 border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'drops-jumps',
    title: 'Drops & Small Jumps',
    icon: Zap,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    summary: 'Sending features confidently comes from learning to manual and compress — not speed or courage.',
    why: 'Drops and jumps look scary but are controlled physics. The technique is the same whether you\'re doing a 6-inch drop or a 6-foot gap — compress, extend, and land balanced.',
    tips: [
      'Start with tiny drops (curb height) and build up — confidence comes from progression',
      'Compress your arms and legs as you approach the lip, then extend to "pop" off it',
      'Keep your eyes on the landing, not the gap in between',
      'Land with both wheels at the same time, or rear wheel slightly first — never front first',
      'Absorb the landing by bending your knees and elbows — don\'t lock your arms',
      'NEVER brake in the air or just before landing — you need speed to clear features safely',
    ],
    mistakes: [
      'Going too slow — the most dangerous speed for drops is barely enough. Commit.',
      'Braking on the lip or in the air — causes case landings or nose-diving',
      'Stiff arms on landing — all the impact goes straight to your body and you lose control',
      'Skipping progression — find a pump track and practice compression/extension before hitting drops on trail',
    ],
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-700',
  },
]

// ─── TRAIL RECOMMENDATIONS ────────────────────────────────────────────────────
// Handpicked from our real trail data — grouped by skill level with what to practice.

const trailPicks = [
  {
    level: 'beginner',
    levelLabel: '🟢 Beginner',
    levelDesc: 'New to MTB or first season riding. Focus on body position, braking, and building confidence on smoother terrain.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
    trails: [
      {
        name: 'Chutes & Ladders',
        area: 'Corner Canyon',
        areaId: 'corner-canyon',
        trailId: 'chutes-and-ladders',
        why: 'Perfectly smooth singletrack with gentle berms — ideal for practicing cornering and finding your flow. Well-marked loop so you can\'t get lost.',
        practice: 'Cornering + body position',
      },
      {
        name: 'Pipeline Trail',
        area: 'Millcreek Canyon',
        areaId: 'millcreek-canyon',
        trailId: 'pipeline-trail',
        why: 'Mellow, mostly flat singletrack alongside the canyon. Low consequence terrain great for building confidence and practicing braking control.',
        practice: 'Braking + climbing basics',
      },
      {
        name: 'Round Valley Express',
        area: 'Round Valley',
        areaId: 'round-valley',
        trailId: 'round-valley-express',
        why: 'Flowy Park City trail with a rolling rhythm — great for learning to carry momentum and feel the "flow" of MTB for the first time.',
        practice: 'Flow + momentum',
      },
      {
        name: 'BST North',
        area: 'Bonneville Shoreline Trail',
        areaId: 'bonneville-shoreline',
        trailId: 'bst-north',
        why: 'Classic beginner SLC trail with great views of the valley. Occasional rocky sections teach you to pick a line on easy terrain.',
        practice: 'Line choice + endurance',
      },
      {
        name: 'Potato Hill',
        area: 'Corner Canyon',
        areaId: 'corner-canyon',
        trailId: 'potato-hill',
        why: 'Gentle climbing loop that builds climbing fitness and technique without any scary exposure. Good for day 1 or 2 on trail.',
        practice: 'Climbing + shifting',
      },
    ],
  },
  {
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    levelDesc: 'Comfortable on beginner trails, ready for longer rides, loose terrain, steeper climbs, and faster descents.',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800',
    trails: [
      {
        name: 'Ghost Falls',
        area: 'Corner Canyon',
        areaId: 'corner-canyon',
        trailId: 'ghost-falls',
        why: 'Sustained climb followed by a fast, rocky descent with sharp switchbacks. The perfect trail to practice descending technique under real pressure.',
        practice: 'Descending + switchbacks',
      },
      {
        name: 'Big Water Trail',
        area: 'Millcreek Canyon',
        areaId: 'millcreek-canyon',
        trailId: 'big-water-trail',
        why: 'Varied terrain with roots, rocks, and moderate climbing. Great all-rounder that exposes you to everything intermediate MTB involves.',
        practice: 'Technical terrain + pacing',
      },
      {
        name: "Clark's Trail",
        area: 'Corner Canyon',
        areaId: 'corner-canyon',
        trailId: 'clarks-trail',
        why: 'Tighter, more technical than Chutes & Ladders — introduces off-camber sections and steeper rollers to build confidence.',
        practice: 'Off-camber + technical features',
      },
      {
        name: 'Mid-Mountain Trail',
        area: 'Round Valley',
        areaId: 'round-valley',
        trailId: 'mid-mountain',
        why: 'Long traverse with consistent climbing — builds fitness and teaches pacing for longer rides. Spectacular scenery.',
        practice: 'Endurance + pacing',
      },
      {
        name: 'Little Mountain Summit',
        area: 'Emigration Canyon',
        areaId: 'emigration-canyon',
        trailId: 'little-mountain',
        why: 'A short, punchy climb to a great viewpoint. Practices sustained climbing effort — great for building leg strength.',
        practice: 'Steep climbing + switchbacks',
      },
    ],
  },
  {
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    levelDesc: 'Ready for big climbs, exposure, loose rocky descents, and longer technical epics. Push your limits here.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
    trails: [
      {
        name: 'Wasatch Crest Trail',
        area: 'Wasatch Crest',
        areaId: 'wasatch-crest',
        trailId: 'wasatch-crest-main',
        why: 'The ultimate Utah MTB experience — a high alpine ridge with breathtaking views and demanding technical terrain. This is a bucket-list ride.',
        practice: 'Alpine endurance + technical descending',
      },
      {
        name: 'Alexander Basin Trail',
        area: 'Millcreek Canyon',
        areaId: 'millcreek-canyon',
        trailId: 'alexander-basin',
        why: 'Steep, rocky, and relentless — this trail will expose any weaknesses in your descending or climbing. One of the harder routes in the SLC area.',
        practice: 'Technical climbing + rocky descents',
      },
      {
        name: 'Storm Mountain Trail',
        area: 'Big Cottonwood Canyon',
        areaId: 'big-cottonwood',
        trailId: 'bcc-storm-mountain',
        why: 'High-elevation trail with significant rock exposure. Rewards riders who have mastered line choice and can stay composed under pressure.',
        practice: 'Exposure + line reading at speed',
      },
      {
        name: 'Ann Canyon',
        area: 'Corner Canyon',
        areaId: 'corner-canyon',
        trailId: 'ann-canyon',
        why: 'A sustained and varied intermediate-to-advanced trail. Introduces riders to committing to technical lines on natural terrain.',
        practice: 'Committing to lines + technical features',
      },
    ],
  },
]

// ─── PROGRESSION STEPS ───────────────────────────────────────────────────────
// A simple visual checklist of skills to unlock at each stage.
const progressionSteps = [
  { label: 'Ride a beginner trail without stopping', level: 'beginner' },
  { label: 'Brake smoothly before corners (not during)', level: 'beginner' },
  { label: 'Corner with outside foot down', level: 'beginner' },
  { label: 'Climb seated without losing traction', level: 'beginner' },
  { label: 'Descend a moderate slope in attack position', level: 'intermediate' },
  { label: 'Navigate loose or rocky terrain without dabbing', level: 'intermediate' },
  { label: 'Complete a 10+ mile ride', level: 'intermediate' },
  { label: 'Ride technical switchbacks both up and down', level: 'intermediate' },
  { label: 'Ride a full advanced trail without walking sections', level: 'advanced' },
  { label: 'Ride drops and jumps with control', level: 'advanced' },
  { label: 'Complete a 20+ mile alpine ride', level: 'advanced' },
]

const levelColors = {
  beginner: 'text-green-600 bg-green-50 border-green-200',
  intermediate: 'text-amber-600 bg-amber-50 border-amber-200',
  advanced: 'text-red-600 bg-red-50 border-red-200',
}


// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default function GuidePage() {
  // Track which technique cards are expanded (by id)
  const [openTechnique, setOpenTechnique] = useState(null)

  function toggleTechnique(id) {
    setOpenTechnique(prev => prev === id ? null : id)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bike size={22} className="text-orange-500" />
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-wide">MTB Skills Guide</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Ride Better on the Trails</h1>
        <p className="text-stone-500 leading-relaxed">
          Whether you just bought your first bike or want to tackle advanced Utah terrain, this guide
          covers the techniques that actually make a difference — plus the specific trails to practice them on.
        </p>
      </div>

      {/* ── QUICK STAT BANNER ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: '6 Core Skills', sub: 'to master MTB', color: 'bg-orange-500' },
          { label: '3 Skill Levels', sub: 'with trail picks', color: 'bg-stone-700' },
          { label: '14 Trail Recs', sub: 'in the SLC area', color: 'bg-stone-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
            <div className="font-bold text-stone-900">{stat.label}</div>
            <div className="text-xs text-stone-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── CORE TECHNIQUES ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-900 mb-1">Core Techniques</h2>
        <p className="text-stone-500 text-sm mb-4">
          Tap any skill to expand the full breakdown — tips, why it matters, and what mistakes to avoid.
        </p>

        <div className="space-y-2">
          {techniques.map(tech => {
            const Icon = tech.icon
            const isOpen = openTechnique === tech.id
            return (
              <div
                key={tech.id}
                className={`rounded-2xl border overflow-hidden transition-all ${tech.color}`}
              >
                {/* Card header — always visible, click to expand */}
                <button
                  onClick={() => toggleTechnique(tech.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-xl p-2 shadow-sm">
                      <Icon size={18} className="text-stone-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900">{tech.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tech.badgeColor}`}>
                          {tech.levelLabel}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 mt-0.5">{tech.summary}</p>
                    </div>
                  </div>
                  {isOpen
                    ? <ChevronUp size={18} className="text-stone-400 shrink-0 ml-2" />
                    : <ChevronDown size={18} className="text-stone-400 shrink-0 ml-2" />
                  }
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-5 border-t border-white/60 pt-4 space-y-4">

                    {/* Why it matters */}
                    <div>
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Why it matters</div>
                      <p className="text-sm text-stone-700 leading-relaxed">{tech.why}</p>
                    </div>

                    {/* Step-by-step tips */}
                    <div>
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">How to do it</div>
                      <ul className="space-y-1.5">
                        {tech.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                            <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common mistakes */}
                    <div>
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Common mistakes</div>
                      <ul className="space-y-1.5">
                        {tech.mistakes.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TRAIL RECOMMENDATIONS ───────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-900 mb-1">Trails to Practice On</h2>
        <p className="text-stone-500 text-sm mb-4">
          Utah trails handpicked for each skill level. Each one listed with what specific skill you should focus on while riding it.
        </p>

        <div className="space-y-6">
          {trailPicks.map(group => (
            <div key={group.level} className={`rounded-2xl border p-5 ${group.bgColor} ${group.borderColor}`}>
              {/* Group header */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${group.badgeColor}`}>
                    {group.levelLabel}
                  </span>
                </div>
                <p className="text-sm text-stone-600">{group.levelDesc}</p>
              </div>

              {/* Trail list */}
              <div className="space-y-2">
                {group.trails.map(trail => (
                  <div key={trail.trailId} className="bg-white rounded-xl border border-stone-200 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-stone-900">{trail.name}</span>
                          <span className="text-xs text-stone-400">{trail.area}</span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed mb-2">{trail.why}</p>
                        <div className="flex items-center gap-1.5">
                          <Target size={11} className="text-orange-500" />
                          <span className="text-xs font-medium text-orange-600">Practice: {trail.practice}</span>
                        </div>
                      </div>
                      <Link
                        href={`/trails/${trail.areaId}/${trail.trailId}`}
                        className="shrink-0 flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        View <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SKILLS PROGRESSION CHECKLIST ────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-900 mb-1">Skills Progression Checklist</h2>
        <p className="text-stone-500 text-sm mb-4">
          Use this as a roadmap. Don't rush levels — fully owning each skill before moving on makes you a safer and faster rider.
        </p>

        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
          {progressionSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              {/* Empty checkbox — decorative; riders check mentally */}
              <div className="w-5 h-5 rounded border-2 border-stone-300 shrink-0" />
              <span className="text-sm text-stone-700 flex-1">{step.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[step.level]}`}>
                {step.level === 'beginner' ? '🟢' : step.level === 'intermediate' ? '🟡' : '🔴'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRO TIPS CALLOUT ─────────────────────────────────────────────── */}
      <div className="bg-stone-900 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-orange-400" />
          <h2 className="font-bold text-white">3 Things That Will Make You Better Faster</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              title: 'Ride with people better than you',
              body: 'Watching a faster rider take a corner or a steep section shows you immediately what\'s possible. You\'ll pick up technique faster than any guide can teach.',
            },
            {
              title: 'Find a pump track and spend an hour there',
              body: 'Pump tracks teach body movement, cornering, and compression without any of the consequences of trail riding. They\'re the fastest way to develop feel for your bike.',
            },
            {
              title: 'Video yourself riding',
              body: 'Nothing is more humbling or more useful than watching yourself ride. You\'ll instantly see where your body position is wrong, where you tense up, and what to fix.',
            },
          ].map(tip => (
            <div key={tip.title} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={12} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white">{tip.title}</div>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
        <h3 className="font-bold text-stone-900 mb-1">Ready to ride?</h3>
        <p className="text-stone-500 text-sm mb-4">
          Pick a trail that matches your level and go practice. Consistency beats perfection.
        </p>
        <Link
          href="/trails"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
        >
          Explore Utah Trails <ArrowRight size={15} />
        </Link>
      </div>

    </div>
  )
}
