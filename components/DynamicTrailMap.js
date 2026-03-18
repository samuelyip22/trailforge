// components/DynamicTrailMap.js
// Thin client-component wrapper that loads TrailMap with ssr:false.
// next/dynamic with { ssr: false } is only allowed inside client components,
// so we isolate it here instead of the server-side trail detail page.

'use client'

import dynamic from 'next/dynamic'

// Leaflet needs the browser — never render it on the server
const TrailMap = dynamic(() => import('./TrailMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 text-sm">
      Loading map…
    </div>
  ),
})

export default function DynamicTrailMap(props) {
  return <TrailMap {...props} />
}
