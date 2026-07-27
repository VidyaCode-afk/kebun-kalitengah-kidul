'use client'

import { useState } from 'react'
import { Info, X, FileText } from 'lucide-react'

export default function InfoBibitCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Card trigger dengan desain seragam 3 kartu lainnya */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-amber-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_-25px_rgba(217,119,6,0.25)]"
      >
        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-amber-50 transition duration-300 group-hover:scale-110" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Edukasi & Panduan
            </p>

            <h3 className="mt-3 text-xl font-black text-slate-900">
              Info Bibit
            </h3>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Klik untuk melihat panduan & infografis bibit.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
            <Info size={25} />
          </div>
        </div>
      </div>

      {/* Modal Pop-up Screenshot/Infografis */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
                <FileText size={18} /> Panduan & Informasi Bibit Konservasi
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Gambar */}
            <div className="p-4 overflow-y-auto space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/informasi-bibit.jpeg"
                  alt="Informasi Bibit Kalitengah Kidul"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://info-bibit,png/photo-1542601906990-b4d3fb778b09?q=80&w=1200"
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center italic">
                *Infografis panduan bibit konservasi Padukuhan Kalitengah Kidul.
              </p>
            </div>

            {/* Footer Modal */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}