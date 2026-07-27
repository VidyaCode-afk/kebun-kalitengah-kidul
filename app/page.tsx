import { supabase } from '@/lib/supabase'
import { Tree } from '@/lib/types'
import MapWrapper from '../components/MapWrapper'
import TreeTable from '../components/TreeTable'
import InfoBibitCard from '../components/InfoBibitCard'
import Link from 'next/link'
import {
  TreeDeciduous,
  MapPin,
  Database,
  Leaf,
  Sprout,
  ShieldCheck,
  Heart,
  ChevronDown,
  Lock,
} from 'lucide-react'

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
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f4] text-slate-800">
      <main className="flex-1">
        {/* Header / Hero */}
        <header className="relative isolate overflow-hidden bg-slate-950 text-white">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.30),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_40%)]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/80 via-slate-950/90 to-slate-950" />

          {/* Glow */}
          <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-8 sm:pb-32 lg:px-10">
            {/* Navbar */}
            <nav className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 shadow-lg shadow-emerald-950/30 backdrop-blur-xl">
                  <TreeDeciduous className="text-emerald-300" size={23} />
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide text-white">
                    Kebun Bibit Digital
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Kalitengah Kidul
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Tombol Login Admin di Navbar */}
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-emerald-500 hover:text-white"
                >
                  <Lock size={14} />
                  <span>Admin</span>
                </Link>

                {/* Logo KKN bulat */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] border-emerald-300/35 bg-white/95 p-1 shadow-md sm:h-16 sm:w-16">
                  <img
                    src="/logo-kkn.png"
                    alt="Logo Tim KKN"
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>
              </div>
            </nav>

            {/* Hero content */}
            <div className="grid items-center gap-12 pt-14 lg:grid-cols-[1.25fr_0.75fr] lg:pt-20">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-xl">
                  <Leaf size={15} />
                  Konservasi dan Digitalisasi Lingkungan
                </div>

                <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Kebun Bibit{' '}
                  <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                    Kalitengah Kidul
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                  Sistem inventarisasi dan pemetaan digital untuk memantau
                  persebaran bibit.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#peta-bibit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    <MapPin size={17} />
                    Lihat Peta Bibit
                  </a>

                  <a
                    href="#inventaris-bibit"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Database size={17} />
                    Buka Inventaris
                  </a>

                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white"
                  >
                    <Lock size={17} />
                    Dashboard Admin
                  </Link>
                </div>
              </div>

              {/* Informasi program */}
              <div className="hidden lg:block">
                <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-xl">
                    <Sprout size={24} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Program Lingkungan
                  </p>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Satu data untuk setiap pohon
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Setiap bibit tercatat dalam sistem dan ditampilkan pada
                    peta sesuai dengan titik lokasi penanamannya.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                      <ShieldCheck className="text-emerald-300" size={20} />
                      <span className="text-sm font-medium text-slate-200">
                        Data tersimpan secara digital
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                      <MapPin className="text-emerald-300" size={20} />
                      <span className="text-sm font-medium text-slate-200">
                        Lokasi bibit dapat dipetakan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-slate-500 sm:block">
            <ChevronDown size={22} />
          </div>
        </header>

        {/* Main content */}
        <div className="relative z-10 mx-auto -mt-14 max-w-7xl space-y-8 px-4 pb-16 sm:-mt-20 sm:px-8 lg:px-10">
          {/* Stat cards & Admin Access Card */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total bibit */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_-25px_rgba(5,150,105,0.35)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-emerald-50 transition duration-300 group-hover:scale-110" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Total Bibit
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <h3 className="text-4xl font-black tracking-tight text-slate-900">
                      {trees.length}
                    </h3>

                    <span className="mb-1 text-sm font-bold text-emerald-600">
                      Pohon
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Seluruh bibit yang tercatat dalam sistem inventaris.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
                  <TreeDeciduous size={25} />
                </div>
              </div>
            </div>

            {/* Lokasi */}
            <div className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_-25px_rgba(37,99,235,0.25)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-50 transition duration-300 group-hover:scale-110" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Lokasi Lahan
                  </p>

                  <h3 className="mt-3 max-w-[220px] text-xl font-black leading-snug text-slate-900">
                    Padukuhan Kalitengah Kidul
                  </h3>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Wilayah pelaksanaan program konservasi dan penanaman.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-inner">
                  <MapPin size={25} />
                </div>
              </div>
            </div>

            {/* Kartu Informasi Bibit (Popup Screenshot) */}
            <InfoBibitCard />

            {/* CARD LOGIN ADMIN */}
            <Link
              href="/admin"
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_20px_55px_-25px_rgba(16,185,129,0.25)]"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-slate-100 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-50" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Pengelola Kebun
                  </p>

                  <h3 className="mt-3 text-xl font-black text-slate-900 transition group-hover:text-emerald-600">
                    Login Admin
                  </h3>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Kelola data, edit titik lokasi, & upload foto bibit.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-inner transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                  <Lock size={23} />
                </div>
              </div>
            </Link>
          </section>

          {/* Peta */}
          <section
            id="peta-bibit"
            className="scroll-mt-8 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/50 px-5 py-5 sm:px-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Pemetaan Digital
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                      Peta Persebaran Titik Tanam
                    </h2>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {trees.length} titik terdaftar
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <MapWrapper trees={trees} />
              </div>
            </div>
          </section>

          {/* Tabel inventaris */}
          <section
            id="inventaris-bibit"
            className="scroll-mt-8 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/50 px-5 py-5 sm:px-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                    <Database size={21} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Database Bibit
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                      Daftar Inventaris Pohon
                    </h2>
                  </div>
                </div>

                <div className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {trees.length} data tersedia
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-xs leading-5 text-slate-500">
                Pilih atau klik salah satu baris untuk melihat informasi,
                dokumentasi foto, dan detail lengkap bibit.
              </p>
            </div>

            <div className="p-3 sm:p-5">
              <TreeTable trees={trees} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <TreeDeciduous
                    className="text-emerald-300"
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Kebun Bibit Kalitengah Kidul
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Inventarisasi dan pemetaan bibit konservasi
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-xs leading-6 text-slate-400">
                Platform digital hasil kolaborasi Padukuhan Kalitengah Kidul
                dan Tim KKN.
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Program Konservasi
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-300">
                Menanam hari ini, menjaga masa depan.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} Kebun Bibit Padukuhan Kalitengah Kidul.
            </p>

            <p className="flex items-center gap-1.5 text-slate-400">
              Developed with{' '}
             {' '}
              by{' '}
              <span className="font-bold text-emerald-400">
                Wayan Sagita
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}