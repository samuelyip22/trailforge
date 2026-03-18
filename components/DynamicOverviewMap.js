// components/DynamicOverviewMap.js
// Client-component wrapper so we can use next/dynamic with ssr:false for OverviewMap.

'use client'

import dynamic from 'next/dynamic'

const OverviewMap = dynamic(() => import('./OverviewMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 text-sm animate-pulse">
      Loading Utah map…
    </div>
  ),
})

export default function DynamicOverviewMap(props) {
  return <OverviewMap {...props} />
}
