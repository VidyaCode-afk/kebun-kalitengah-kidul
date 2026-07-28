'use client'

import { useState } from 'react'
import { Info, X, FileText, History, Gift, CheckCircle2 } from 'lucide-react'

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
              Klik untuk melihat latar belakang & infografis bibit.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
            <Info size={25} />
          </div>
        </div>
      </div>

      {/* Modal Pop-up Screenshot/Infografis */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 sm:text-base">
                <FileText size={18} /> Panduan & Informasi Bibit Konservasi
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Modal */}
            <div className="space-y-4 overflow-y-auto p-5">

              {/* SECTION: Latar Belakang Program KKN */}
              <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-slate-700 shadow-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <History size={18} className="shrink-0 text-emerald-600" />
                  <span>Latar Belakang Pengadaan Bibit</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  Program kerja KKN ini bermula dari postingan Instagram dari akun{' '}
                  <a
                    href="https://instagram.com/humasjogja"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    @humasjogja
                  </a>{' '}
                  yang dibagikan oleh dosen dengan harapan dapat membantu program kerja mahasiswa saat KKN.
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  Kemudian dari mahasiswa <strong>KKN Unit 32</strong> mencoba memahami terkait surat pengajuan dan proposal pengajuan permintaan bibit yang kemudian dikirim dan mendapatkan respon baik dari pihak <strong>DLHK DIY</strong>.
                </p>

                {/* List Jenis Bibit & Badge Gratis */}
                <div className="border-t border-emerald-200/60 pt-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Gift size={14} className="text-emerald-600" /> Adapun bibit yang diminta terdiri dari:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                      <CheckCircle2 size={13} className="text-emerald-600" /> 1. Nangka
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                      <CheckCircle2 size={13} className="text-emerald-600" /> 2. Sirsak
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                      <CheckCircle2 size={13} className="text-emerald-600" /> 3. Munggur
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-emerald-700 italic">
                    * Dan semua bibit ini didapatkan secara gratis.
                  </p>
                </div>
              </div>

              {/* SECTION: Display Infografis Gambar */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src="/informasi-bibit.jpeg"
                  alt="Informasi Bibit Kalitengah Kidul"
                  className="h-auto w-full object-contain"
                  onError={(e) => {
                    // Fallback jika gambar gagal dimuat
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200"
                  }}
                />
              </div>
              <p className="text-center text-xs italic text-slate-500">
                *Infografis panduan & informasi bibit konservasi Padukuhan Kalitengah Kidul.
              </p>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-900"
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