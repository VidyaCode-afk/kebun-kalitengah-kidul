'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Tree } from '@/lib/types'
import { Edit3, Save, X, ArrowLeft, RefreshCw, Lock } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [trees, setTrees] = useState<Tree[]>([])
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')
  const [isAuth, setIsAuth] = useState(false)

  // State modal edit & upload foto
  const [editingTree, setEditingTree] = useState<Tree | null>(null)
  const [uploading, setUploading] = useState(false)

  // Ambil data bibit dari Supabase
  const fetchTrees = async () => {
    setLoading(true)
    const { data } = await supabase.from('trees').select('*').order('id', { ascending: true })
    if (data) setTrees(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuth) fetchTrees()
  }, [isAuth])

  // System Login PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === 'kalitengahkidul1234') {
      setIsAuth(true)
    } else {
      alert('PIN Admin Salah!')
    }
  }

  // Fungsi Upload Gambar dari HP/Laptop ke Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      if (!editingTree) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${editingTree.tree_code}-${Date.now()}.${fileExt}`

      // Upload file ke bucket 'tree-photos'
      const { error: uploadError } = await supabase.storage
        .from('tree-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Ambil Public URL foto yang baru di-upload
      const { data } = supabase.storage
        .from('tree-photos')
        .getPublicUrl(filePath)

      // Set URL foto baru ke state form edit
      setEditingTree({ ...editingTree, photo_url: data.publicUrl })
      alert('Foto berhasil diunggah!')
    } catch (error) {
      alert('Gagal mengunggah foto! Pastikan Bucket "tree-photos" sudah dibuat Public.')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  // Handle Simpan Perubahan Data Ke Supabase Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTree) return

    const { error } = await supabase
      .from('trees')
      .update({
        species_name: editingTree.species_name,
        latin_name: editingTree.latin_name,
        latitude: editingTree.latitude,
        longitude: editingTree.longitude,
        photo_url: editingTree.photo_url,
        description: editingTree.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingTree.id)

    if (error) {
      alert('Gagal memperbarui data!')
    } else {
      alert(`Berhasil memperbarui data ${editingTree.tree_code}!`)
      setEditingTree(null)
      fetchTrees()
    }
  }

  // Tampilan Form Login Admin
  if (!isAuth) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 max-w-sm w-full text-center">
          <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Login Admin Kebun</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">Masukkan PIN Admin untuk mengelola data bibit.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Masukkan PIN Admin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-2 text-center text-lg font-bold border border-slate-300 rounded-xl focus:outline-emerald-600"
            />
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition"
            >
              Masuk Dashboard
            </button>
          </form>
          <div className="mt-4">
            <Link href="/" className="text-xs text-emerald-700 font-medium hover:underline">
              ← Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 mb-1">
              <ArrowLeft size={14} /> Lihat Web Public
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin Kebun Bibit</h1>
            <p className="text-xs text-slate-500">Kelola & Update Data 45 Bibit Pohon Pak Dukuh</p>
          </div>
          <button
            onClick={fetchTrees}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* List Data Table */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          {loading ? (
            <p className="text-center py-8 text-slate-400">Memuat data bibit...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3">Kode</th>
                    <th className="p-3">Tanaman</th>
                    <th className="p-3">Koordinat</th>
                    <th className="p-3">Deskripsi</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trees.map((tree) => (
                    <tr key={tree.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-xs">
                          {tree.tree_code}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{tree.species_name}</p>
                        <p className="text-xs italic text-slate-400">{tree.latin_name}</p>
                      </td>
                      <td className="p-3 text-xs text-slate-500">
                        {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
                      </td>
                      <td className="p-3 text-xs text-slate-600 max-w-xs truncate">{tree.description}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setEditingTree(tree)}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form Edit */}
        {editingTree && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-slate-800">
                  Edit Data <span className="text-emerald-700">{editingTree.tree_code}</span>
                </h3>
                <button onClick={() => setEditingTree(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Nama Tanaman</label>
                  <input
                    type="text"
                    value={editingTree.species_name}
                    onChange={(e) => setEditingTree({ ...editingTree, species_name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Nama Latin</label>
                  <input
                    type="text"
                    value={editingTree.latin_name}
                    onChange={(e) => setEditingTree({ ...editingTree, latin_name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingTree.latitude}
                      onChange={(e) => setEditingTree({ ...editingTree, latitude: parseFloat(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingTree.longitude}
                      onChange={(e) => setEditingTree({ ...editingTree, longitude: parseFloat(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Section Preview & Upload Foto */}
                <div className="border p-3 rounded-xl bg-slate-50 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Foto Pohon Saat Ini</label>
                  {editingTree.photo_url && (
                    <img
                      src={editingTree.photo_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                  
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Upload Foto Baru (Direct Kamera HP / File):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                    />
                    {uploading && <p className="text-xs text-emerald-600 mt-1 animate-pulse">Mengunggah foto ke Cloud...</p>}
                  </div>

                  <div className="pt-1">
                    <label className="block text-[11px] text-slate-500 mb-1">Atau Masukkan Direct URL Foto:</label>
                    <input
                      type="text"
                      value={editingTree.photo_url}
                      onChange={(e) => setEditingTree({ ...editingTree, photo_url: e.target.value })}
                      className="w-full p-2 border rounded-lg text-xs"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Deskripsi / Catatan Lahan</label>
                  <textarea
                    rows={3}
                    value={editingTree.description}
                    onChange={(e) => setEditingTree({ ...editingTree, description: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTree(null)}
                    className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1"
                  >
                    <Save size={16} /> Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}