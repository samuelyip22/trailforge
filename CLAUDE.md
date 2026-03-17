# CLAUDE.md — TrailForge Project Briefing

## Who I Am
I am a complete beginner to coding. I understand concepts when explained clearly,
but I don't have prior experience with terminals, frameworks, or syntax. Assume I
need context on anything technical.

## How to Work With Me
- **Always show me a plan before writing any code.** List the steps you're about
  to take and ask me to confirm before proceeding.
- **Explain what you're building as you go.** One or two sentences per file or
  major decision is enough — just don't go silent.
- **When I need to make a choice, give me options as a numbered list** with a
  clear recommendation and why.
- **Never assume I know what a term means.** If you use a technical word, define
  it briefly in plain English the first time.
- **If something could break or delete data, stop and warn me explicitly.**

## My Priorities
1. Clean, readable code — no clever shortcuts that are hard to follow later
2. Ship fast — working beats perfect
3. Well-commented code — add inline comments so I can learn what each part does
4. Mobile-friendly by default — all UIs should work on phone and desktop

## What This App Is
**TrailForge** — A Utah mountain biking trail guide and personal tracker.

### MVP Features
- Trail explorer (Utah trails organized by area → trail hierarchy)
- Trail detail pages (map, elevation, weather, directions, community notes)
- Personal ride log (track trails you've done + ratings)
- Agenda & wishlist (plan future rides)
- Bike garage (select your bike, track maintenance)
- Secure email login via Supabase Auth

### Scope
- Start with SLC surrounding areas (Corner Canyon, Round Valley, Millcreek, etc.)
- Expand to rest of Utah (Moab, St. George, Wasatch) as data grows
- Trail data sourced from Open-Meteo (weather), Leaflet.js (maps), hardcoded seed data
  with architecture ready to pull from Trailforks/MTB Project APIs later

### NOT building yet
- Social features / comments / following
- Expert-only content
- Contest tracking
- Payments

## Default Tech Stack
- **Framework:** Next.js (JavaScript, not TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Supabase (auth + data storage)
- **Hosting:** Vercel (deploy via GitHub)
- **Maps:** Leaflet.js (free, open source)
- **Weather:** Open-Meteo API (free, no key needed)

## Folder Structure
```
/trailforge
  /app              → Next.js pages and routes
    /trails         → Trail explorer + detail pages
    /log            → Personal ride log
    /agenda         → Agenda + wishlist
    /bike           → Bike garage
    /login          → Auth pages
    /api            → Server-side API routes
  /components       → Reusable UI pieces (NavBar, TrailCard, etc.)
  /lib              → Utility functions, Supabase client, trail data
  /public           → Images and static files
  .env.local        → API keys (NEVER commit this)
  CLAUDE.md         → This file
```

## Environment Variables
Never hardcode API keys. Always use `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public key

## Git Habits
- After completing each meaningful feature, suggest a commit message
- Keep commits small and descriptive
- Never commit `.env.local`
