'use client'

import { useState } from 'react'
import { Tree } from '@/lib/types'
import { X, MapPin, Calendar, Info, Eye } from 'lucide-react'

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
              <th className="p-3 font-semibold">Nama Latin</th>
              <th className="p-3 font-semibold">Tanggal Tanam</th>
              <th className="p-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trees.map((tree) => (
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
                <td className="p-3 font-medium text-slate-800">{tree.species_name}</td>
                <td className="p-3 italic text-slate-500">{tree.latin_name}</td>
                <td className="p-3 text-slate-600">{tree.planted_at}</td>
                <td className="p-3 text-center">
                  <button className="bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition">
                    <Eye size={14} /> Lihat Foto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Pohon */}
      {selectedTree && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Display Foto */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedTree.photo_url}
                alt={selectedTree.tree_code}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedTree(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-3 left-3 bg-emerald-800/90 text-white font-extrabold px-3 py-1 rounded-lg text-xs backdrop-blur-md shadow-md">
                {selectedTree.tree_code}
              </div>
            </div>

            {/* Info Rincian Bibit */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedTree.species_name}</h3>
                <p className="text-sm italic text-slate-500">{selectedTree.latin_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">TANGGAL TANAM</p>
                    <p className="font-bold">{selectedTree.planted_at}</p>
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
                  <Info size={14} className="text-emerald-600" /> Catatan & Deskripsi
                </p>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedTree.description || 'Belum ada catatan deskripsi.'}
                </p>
              </div>

              <button
                onClick={() => setSelectedTree(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
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