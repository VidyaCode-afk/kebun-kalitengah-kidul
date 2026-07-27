import { supabase } from '@/lib/supabase'
import { Tree } from '@/lib/types'
import MapWrapper from '@/components/MapWrapper'
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

export const revalidate = 0 // Auto refresh data terbaru

export default async function HomePage() {
  const trees = await getTrees()

  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-800">
      {/* Header Banner */}
      <header className="bg-emerald-800 text-white py-10 px-4 sm:px-8 shadow-lg">
        <div className="max-w-6xl mx-auto text-center sm:text-left">
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
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Database className="text-emerald-600" size={20} />
            Daftar Inventaris Bibit (40 Pohon)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-3 font-semibold">Kode</th>
                  <th className="p-3 font-semibold">Nama Tanaman</th>
                  <th className="p-3 font-semibold">Nama Latin</th>
                  <th className="p-3 font-semibold">Tanggal Tanam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trees.map((tree) => (
                  <tr key={tree.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-xs">
                        {tree.tree_code}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{tree.species_name}</td>
                    <td className="p-3 italic text-slate-500">{tree.latin_name}</td>
                    <td className="p-3 text-slate-600">{tree.planted_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}