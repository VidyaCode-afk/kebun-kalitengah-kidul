import { supabase } from '@/lib/supabase'
import { Tree } from '@/lib/types'
import MapWrapper from '../components/MapWrapper'
import TreeTable from '../components/TreeTable'
import { TreeDeciduous, MapPin, Database } from 'lucide-react'

// Server Side Fetch data dari Supabase
async function getTrees(): Promise<Tree[]> {
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching trees:', error)
    return []
  }
  return data || []
}

export const revalidate = 0

export default async function HomePage() {
  const trees = await getTrees()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <main className="pb-12">
        {/* Header Banner + Logo KKN */}
        <header className="bg-emerald-800 text-white py-10 px-4 sm:px-8 shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Teks Judul */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
                <TreeDeciduous size={16} /> Konservasi Lahan Padukuhan
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Kebun Bibit Kalitengah Kidul
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
                Sistem Inventarisasi & Pemetaan Digital Bibit Konservasi Kerjasama Padukuhan Kalitengah Kidul & Tim KKN.
              </p>
            </div>

            {/* Logo KKN (Diambil dari public/logo-kkn.png) */}
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
              <img
                src="/logo-kkn.png"
                alt="Logo KKN"
                className="h-20 w-auto object-contain"
              />
            </div>

          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
                <Database size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Bibit Terdaftar</p>
                <h3 className="text-2xl font-bold text-slate-800">{trees.length} Pohon</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Lokasi Lahan</p>
                <h3 className="text-lg font-bold text-slate-800">Padukuhan Kalitengah Kidul</h3>
              </div>
            </div>
          </div>

          {/* Peta Interaktif */}
          <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="text-emerald-600" size={20} />
              Peta Persebaran Titik Tanam
            </h2>
            <MapWrapper trees={trees} />
          </section>

          {/* Tabel List Pohon */}
          <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Database className="text-emerald-600" size={20} />
              Daftar Inventaris Bibit ({trees.length} Pohon)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              *Klik pada baris pohon untuk melihat foto dan detail lengkapnya.
            </p>
            <TreeTable trees={trees} />
          </section>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 px-4 text-xs border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto space-y-1">
          <p>© {new Date().getFullYear()} Kebun Bibit Padukuhan Kalitengah Kidul.</p>
          <p className="text-slate-300 font-medium">
            Developed with by <span className="text-emerald-400 font-bold">Wayan Sagita</span>
          </p>
        </div>
      </footer>
    </div>
  )
}