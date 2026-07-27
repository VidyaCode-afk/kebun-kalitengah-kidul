'use client'

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Tree } from '@/lib/types'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Database,
  Edit3,
  ExternalLink,
  ImageIcon,
  Leaf,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sprout,
  TreeDeciduous,
  UploadCloud,
  X,
} from 'lucide-react'

type NotificationState = {
  type: 'success' | 'error'
  message: string
} | null

export default function AdminPage() {
  const [trees, setTrees] = useState<Tree[]>([])
  const [loading, setLoading] = useState(true)

  // Login admin
  const [pin, setPin] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Pencarian data
  const [searchQuery, setSearchQuery] = useState('')

  // Modal edit dan upload
  const [editingTree, setEditingTree] = useState<Tree | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Notifikasi
  const [notification, setNotification] =
    useState<NotificationState>(null)

  const currentYear = new Date().getFullYear()

  // Ambil data bibit dari Supabase
  const fetchTrees = async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error

      setTrees(data || [])
    } catch (error) {
      console.error('Error fetching trees:', error)

      showNotification(
        'error',
        'Gagal mengambil data bibit dari database.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchTrees()
    }
  }, [isAuth])

  // Kunci scroll dan tombol Escape ketika modal terbuka
  useEffect(() => {
    if (!editingTree) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !uploading && !saving) {
        setEditingTree(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [editingTree, uploading, saving])

  const showNotification = (
    type: 'success' | 'error',
    message: string,
  ) => {
    setNotification({ type, message })

    window.setTimeout(() => {
      setNotification(null)
    }, 3500)
  }

  // Login PIN
  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')

    if (pin.trim() === 'kalitengahkidul1234') {
      setIsAuth(true)
      setPin('')
      return
    }

    setLoginError('PIN admin yang dimasukkan salah.')
  }

  const handleLogout = () => {
    setIsAuth(false)
    setTrees([])
    setSearchQuery('')
    setEditingTree(null)
    setNotification(null)
  }

  // Upload foto ke Supabase Storage
  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file || !editingTree) return

    // Maksimal ukuran foto 5 MB
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        'error',
        'Ukuran foto terlalu besar. Maksimal 5 MB.',
      )
      event.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      showNotification(
        'error',
        'File yang dipilih harus berupa gambar.',
      )
      event.target.value = ''
      return
    }

    try {
      setUploading(true)

      const fileExtension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg'

      const sanitizedTreeCode = editingTree.tree_code
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase()

      const filePath = `${sanitizedTreeCode}-${Date.now()}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('tree-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('tree-photos')
        .getPublicUrl(filePath)

      setEditingTree((currentTree) => {
        if (!currentTree) return currentTree

        return {
          ...currentTree,
          photo_url: data.publicUrl,
        }
      })

      showNotification('success', 'Foto berhasil diunggah.')
      event.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)

      showNotification(
        'error',
        'Gagal mengunggah foto. Pastikan bucket tree-photos tersedia dan bersifat public.',
      )
    } finally {
      setUploading(false)
    }
  }

  // Simpan perubahan ke database
  const handleSave = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!editingTree) return

    if (!editingTree.species_name.trim()) {
      showNotification(
        'error',
        'Nama tanaman tidak boleh kosong.',
      )
      return
    }

    if (
      !Number.isFinite(Number(editingTree.latitude)) ||
      !Number.isFinite(Number(editingTree.longitude))
    ) {
      showNotification(
        'error',
        'Latitude dan longitude harus berupa angka valid.',
      )
      return
    }

    try {
      setSaving(true)

      const { error } = await supabase
        .from('trees')
        .update({
          species_name: editingTree.species_name.trim(),
          latin_name: editingTree.latin_name?.trim() || '',
          latitude: Number(editingTree.latitude),
          longitude: Number(editingTree.longitude),
          photo_url: editingTree.photo_url?.trim() || '',
          description: editingTree.description?.trim() || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTree.id)

      if (error) throw error

      showNotification(
        'success',
        `Data ${editingTree.tree_code} berhasil diperbarui.`,
      )

      setEditingTree(null)
      await fetchTrees()
    } catch (error) {
      console.error('Save error:', error)

      showNotification(
        'error',
        'Gagal memperbarui data bibit.',
      )
    } finally {
      setSaving(false)
    }
  }

  const filteredTrees = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    if (!keyword) return trees

    return trees.filter((tree) => {
      return [
        tree.tree_code,
        tree.species_name,
        tree.latin_name,
        tree.description,
      ].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(keyword),
      )
    })
  }, [trees, searchQuery])

  const treesWithPhotos = useMemo(() => {
    return trees.filter((tree) => Boolean(tree.photo_url?.trim()))
      .length
  }, [trees])

  const formatCoordinate = (value: number | string) => {
    const coordinate = Number(value)

    if (!Number.isFinite(coordinate)) {
      return '-'
    }

    return coordinate.toFixed(6)
  }

  // ================= LOGIN ADMIN =================
  if (!isAuth) {
    return (
      <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white">
        {/* Background */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.30),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_40%)]" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/80 via-slate-950/95 to-slate-950" />

        <div className="absolute -left-28 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-24 -z-10 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="w-full max-w-md">
          {/* Identitas */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 shadow-xl backdrop-blur-xl">
              <TreeDeciduous size={25} />
            </div>

            <div>
              <p className="font-bold tracking-wide text-white">
                Kebun Bibit Digital
              </p>

              <p className="text-xs text-slate-400">
                Kalitengah Kidul
              </p>
            </div>
          </div>

          {/* Login card */}
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="border-b border-white/10 bg-gradient-to-r from-emerald-950/60 to-transparent px-6 py-6 text-center sm:px-8">
              {/* Logo KKN */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-emerald-300/30 bg-white/95 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.40)]">
                <img
                  src="/logo-kkn.png"
                  alt="Logo Tim KKN"
                  className="h-full w-full rounded-full object-contain"
                />
              </div>

              <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                <ShieldCheck size={14} />
                Akses Terbatas
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
                Login Dashboard Admin
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-400">
                Masukkan PIN admin untuk mengelola dan memperbarui
                data bibit konservasi.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
            >
              <div>
                <label
                  htmlFor="admin-pin"
                  className="mb-2 block text-xs font-bold text-slate-300"
                >
                  PIN Admin
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="admin-pin"
                    type="password"
                    placeholder="Masukkan PIN admin"
                    value={pin}
                    onChange={(event) => {
                      setPin(event.target.value)
                      setLoginError('')
                    }}
                    autoComplete="current-password"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3.5 pl-12 pr-4 text-center text-base font-bold tracking-[0.18em] text-white outline-none transition placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/70 focus:ring-4 focus:ring-emerald-400/10"
                  />
                </div>

                {loginError && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-300">
                    <AlertCircle size={15} />
                    {loginError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!pin.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/50 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Lock size={17} />
                Masuk Dashboard
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-slate-400 transition hover:text-emerald-300"
              >
                <ArrowLeft size={14} />
                Kembali ke halaman utama
              </Link>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-600">
            © {currentYear} Kebun Bibit Kalitengah Kidul
          </p>
        </div>
      </main>
    )
  }

  // ================= DASHBOARD ADMIN =================
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f4] text-slate-800">
      {/* Notifikasi */}
      {notification && (
        <div className="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${
              notification.type === 'success'
                ? 'border-emerald-200 bg-white/95 text-emerald-800'
                : 'border-red-200 bg-white/95 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="flex-1 text-sm font-semibold leading-5">
              {notification.message}
            </p>

            <button
              type="button"
              onClick={() => setNotification(null)}
              aria-label="Tutup notifikasi"
              className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Header dashboard */}
        <header className="relative isolate overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.28),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_40%)]" />

          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/80 via-slate-950/95 to-slate-950" />

          <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-8 sm:pb-28 lg:px-10">
            {/* Navbar */}
            <nav className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 shadow-lg backdrop-blur-xl">
                  <TreeDeciduous size={23} />
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide text-white">
                    Kebun Bibit Digital
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Dashboard Administrator
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                >
                  <ExternalLink size={14} />
                  Web Publik
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200 sm:px-4"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>

                <div className="ml-1 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-300/30 bg-white/95 p-1 shadow-xl sm:h-16 sm:w-16">
                  <img
                    src="/logo-kkn.png"
                    alt="Logo KKN"
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>
              </div>
            </nav>

            {/* Hero */}
            <div className="flex flex-col justify-between gap-8 pt-12 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200 backdrop-blur-xl">
                  <ShieldCheck size={15} />
                  Panel Pengelolaan Data
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Dashboard Admin
                  <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                    Kebun Bibit
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  Kelola informasi tanaman, koordinat lokasi,
                  dokumentasi foto, dan catatan bibit konservasi
                  Kalitengah Kidul.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchTrees}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        {/* Isi dashboard */}
        <div className="relative z-10 mx-auto -mt-14 max-w-7xl space-y-8 px-4 pb-16 sm:-mt-16 sm:px-8 lg:px-10">
          {/* Stat cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-emerald-50 transition group-hover:scale-110" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Total Bibit
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <h2 className="text-4xl font-black text-slate-900">
                      {trees.length}
                    </h2>

                    <span className="mb-1 text-sm font-bold text-emerald-600">
                      Pohon
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Seluruh data bibit yang tersimpan dalam sistem.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Sprout size={24} />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-50 transition group-hover:scale-110" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Foto Tersedia
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <h2 className="text-4xl font-black text-slate-900">
                      {treesWithPhotos}
                    </h2>

                    <span className="mb-1 text-sm font-bold text-blue-600">
                      Foto
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Bibit yang sudah memiliki dokumentasi foto.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <ImageIcon size={24} />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-violet-50 transition group-hover:scale-110" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Status Database
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                    </span>

                    <h2 className="text-xl font-black text-slate-900">
                      Terhubung
                    </h2>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Sistem tersambung dengan database Supabase.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Database size={24} />
                </div>
              </div>
            </div>
          </section>

          {/* Tabel data */}
          <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
            {/* Header tabel */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/50 px-5 py-5 sm:px-7">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                    <Database size={21} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Manajemen Database
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                      Daftar Inventaris Bibit
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Edit informasi dan dokumentasi setiap bibit.
                    </p>
                  </div>
                </div>

                {/* Pencarian */}
                <div className="relative w-full lg:max-w-sm">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Cari kode atau nama tanaman..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Isi tabel */}
            <div className="p-3 sm:p-5">
              {loading ? (
                <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                  <Loader2
                    size={30}
                    className="animate-spin text-emerald-600"
                  />

                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">
                      Memuat data bibit
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Mengambil data terbaru dari Supabase.
                    </p>
                  </div>
                </div>
              ) : filteredTrees.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                    <Search size={24} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    Data tidak ditemukan
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Coba gunakan kata pencarian yang berbeda.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex items-center justify-between px-1 text-xs text-slate-500">
                    <p>
                      Menampilkan{' '}
                      <span className="font-bold text-slate-700">
                        {filteredTrees.length}
                      </span>{' '}
                      data
                    </p>

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        Hapus pencarian
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Kode Bibit
                          </th>

                          <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Tanaman
                          </th>

                          <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Koordinat
                          </th>

                          <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Dokumentasi
                          </th>

                          <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Deskripsi
                          </th>

                          <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Aksi
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredTrees.map((tree) => (
                          <tr
                            key={tree.id}
                            className="group transition hover:bg-emerald-50/40"
                          >
                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">
                                {tree.tree_code}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                  <Leaf size={17} />
                                </div>

                                <div>
                                  <p className="font-bold text-slate-800">
                                    {tree.species_name || '-'}
                                  </p>

                                  <p className="mt-0.5 text-xs italic text-slate-400">
                                    {tree.latin_name || 'Nama latin belum tersedia'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-start gap-2 text-xs text-slate-500">
                                <MapPin
                                  size={14}
                                  className="mt-0.5 shrink-0 text-blue-500"
                                />

                                <div>
                                  <p>
                                    Lat:{' '}
                                    {formatCoordinate(tree.latitude)}
                                  </p>

                                  <p className="mt-1">
                                    Long:{' '}
                                    {formatCoordinate(tree.longitude)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              {tree.photo_url ? (
                                <div className="h-12 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                  <img
                                    src={tree.photo_url}
                                    alt={`Foto ${tree.species_name}`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-12 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                  <ImageIcon size={18} />
                                </div>
                              )}
                            </td>

                            <td className="max-w-xs px-4 py-4">
                              <p className="line-clamp-2 text-xs leading-5 text-slate-600">
                                {tree.description ||
                                  'Belum ada deskripsi.'}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTree({ ...tree })
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100"
                              >
                                <Edit3 size={14} />
                                Edit Data
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.15),_transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <TreeDeciduous size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Dashboard Admin Kebun Bibit
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Kalitengah Kidul
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              © {currentYear} Developed by{' '}
              <span className="font-bold text-emerald-400">
                Wayan Sagita
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* ================= MODAL EDIT ================= */}
      {editingTree && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !uploading &&
              !saving
            ) {
              setEditingTree(null)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-tree-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
          >
            {/* Header modal */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 px-5 py-5 text-white sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                  <Edit3 size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400 sm:text-[11px]">
                    Perbarui Informasi
                  </p>

                  <h2
                    id="edit-tree-title"
                    className="mt-1 text-lg font-black text-white"
                  >
                    Edit Bibit{' '}
                    <span className="text-emerald-300">
                      {editingTree.tree_code}
                    </span>
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingTree(null)}
                disabled={uploading || saving}
                aria-label="Tutup modal"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition hover:rotate-90 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form modal */}
            <form
              onSubmit={handleSave}
              className="overflow-y-auto bg-slate-50"
            >
              <div className="space-y-5 p-5 sm:p-7">
                {/* Nama tanaman */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="species-name"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Nama Tanaman
                    </label>

                    <input
                      id="species-name"
                      type="text"
                      value={editingTree.species_name || ''}
                      onChange={(event) =>
                        setEditingTree({
                          ...editingTree,
                          species_name: event.target.value,
                        })
                      }
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="latin-name"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Nama Latin
                    </label>

                    <input
                      id="latin-name"
                      type="text"
                      value={editingTree.latin_name || ''}
                      onChange={(event) =>
                        setEditingTree({
                          ...editingTree,
                          latin_name: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm italic outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* Koordinat */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin
                      size={17}
                      className="text-blue-600"
                    />

                    <h3 className="text-sm font-bold text-slate-800">
                      Koordinat Lokasi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="latitude"
                        className="mb-2 block text-xs font-semibold text-slate-600"
                      >
                        Latitude
                      </label>

                      <input
                        id="latitude"
                        type="number"
                        step="any"
                        value={editingTree.latitude}
                        onChange={(event) =>
                          setEditingTree({
                            ...editingTree,
                            latitude: Number(event.target.value),
                          })
                        }
                        required
                        className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="longitude"
                        className="mb-2 block text-xs font-semibold text-slate-600"
                      >
                        Longitude
                      </label>

                      <input
                        id="longitude"
                        type="number"
                        step="any"
                        value={editingTree.longitude}
                        onChange={(event) =>
                          setEditingTree({
                            ...editingTree,
                            longitude: Number(event.target.value),
                          })
                        }
                        required
                        className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload foto */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/50 px-4 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <ImageIcon size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Dokumentasi Foto
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Preview dan unggah foto terbaru pohon.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {editingTree.photo_url ? (
                        <img
                          src={editingTree.photo_url}
                          alt={`Preview ${editingTree.species_name}`}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-10 text-center text-slate-400">
                          <ImageIcon size={32} />

                          <p className="text-xs">
                            Belum ada foto untuk bibit ini.
                          </p>
                        </div>
                      )}

                      {uploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/75 text-white backdrop-blur-sm">
                          <Loader2
                            size={30}
                            className="animate-spin text-emerald-300"
                          />

                          <p className="text-xs font-semibold">
                            Mengunggah foto ke cloud...
                          </p>
                        </div>
                      )}
                    </div>

                    <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-4 text-sm font-bold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50">
                      <UploadCloud
                        size={20}
                        className="transition group-hover:-translate-y-0.5"
                      />

                      {uploading
                        ? 'Sedang mengunggah...'
                        : 'Pilih atau ambil foto baru'}

                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        disabled={uploading || saving}
                        className="hidden"
                      />
                    </label>

                    <p className="text-center text-[10px] leading-5 text-slate-400">
                      Format JPG, PNG, atau WEBP. Ukuran maksimal 5 MB.
                    </p>

                    <div>
                      <label
                        htmlFor="photo-url"
                        className="mb-2 block text-xs font-semibold text-slate-600"
                      >
                        Atau masukkan URL foto
                      </label>

                      <input
                        id="photo-url"
                        type="url"
                        value={editingTree.photo_url || ''}
                        onChange={(event) =>
                          setEditingTree({
                            ...editingTree,
                            photo_url: event.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Deskripsi / Catatan Lahan
                  </label>

                  <textarea
                    id="description"
                    rows={4}
                    value={editingTree.description || ''}
                    onChange={(event) =>
                      setEditingTree({
                        ...editingTree,
                        description: event.target.value,
                      })
                    }
                    placeholder="Masukkan deskripsi, kondisi pohon, atau catatan lahan..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Footer modal */}
              <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={() => setEditingTree(null)}
                  disabled={uploading || saving}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={uploading || saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}