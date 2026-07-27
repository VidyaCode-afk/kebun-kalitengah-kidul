'use client'

import dynamic from 'next/dynamic'
import { Tree } from '@/lib/types'

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-medium">
      Memuat Peta Lahan...
    </div>
  ),
})

export default function MapWrapper({ trees }: { trees: Tree[] }) {
  return <Map trees={trees} />
}