// components/DynamicAreaTrailMap.js
// Client-component wrapper so we can use next/dynamic with ssr:false for AreaTrailMap.

'use client'

import dynamic from 'next/dynamic'

const AreaTrailMap = dynamic(() => import('./AreaTrailMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 text-sm animate-pulse">
      Loading trail map…
    </div>
  ),
})

export default function DynamicAreaTrailMap(props) {
  return <AreaTrailMap {...props} />
}
