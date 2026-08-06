'use client'

import { useState } from 'react'
import { Tree } from '@/lib/types'
import { X, MapPin, Calendar, Info, Eye, Sprout, Home } from 'lucide-react'

export default function TreeTable({ trees }: { trees: Tree[] }) {
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null)

  return (
    <div>
      {/* Tabel Inventaris */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="p-3 font-semibold">Kode</th>
              <th className="p-3 font-semibold">Nama Tanaman</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Tanggal Tanam</th>
              <th className="p-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trees.map((tree) => {
              const isPlanted = tree.status !== 'Belum Ditanam'
              return (
                <tr
                  key={tree.id}
                  onClick={() => setSelectedTree(tree)}
                  className="hover:bg-emerald-50/60 transition cursor-pointer group"
                >
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-xs">
                      {tree.tree_code}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-800">{tree.species_name}</p>
                    <p className="text-xs italic text-slate-400">{tree.latin_name}</p>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isPlanted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {isPlanted ? <Sprout size={12} /> : <Home size={12} />}
                      {tree.status || 'Sudah Ditanam'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{tree.planted_at || '-'}</td>
                  <td className="p-3 text-center">
                    <button className="bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition">
                      <Eye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Pohon */}
      {selectedTree && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Display Foto */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedTree.photo_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200'}
                alt={selectedTree.tree_code}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedTree(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-emerald-800/90 text-white font-extrabold px-3 py-1 rounded-xl text-xs backdrop-blur-md shadow-md">
                  {selectedTree.tree_code}
                </span>
                <span className={`px-3 py-1 rounded-xl text-xs font-extrabold backdrop-blur-md shadow-md ${
                  selectedTree.status === 'Belum Ditanam'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-emerald-500/90 text-white'
                }`}>
                  {selectedTree.status || 'Sudah Ditanam'}
                </span>
              </div>
            </div>

            {/* Info Rincian Bibit */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedTree.species_name}</h3>
                <p className="text-sm italic text-slate-500">{selectedTree.latin_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">TANGGAL TANAM</p>
                    <p className="font-bold">{selectedTree.planted_at || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">KOORDINAT</p>
                    <p className="font-bold">{selectedTree.latitude.toFixed(5)}, {selectedTree.longitude.toFixed(5)}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1">
                  <Info size={14} className="text-emerald-600" /> Catatan Lokasi / Kondisi
                </p>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  {selectedTree.description || 'Belum ada catatan khusus.'}
                </p>
              </div>

              <button
                onClick={() => setSelectedTree(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}