'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';

interface Anggota {
  id: number;
  namaLengkap: string;
  jabatan: string;
}

interface Kementerian {
  id: number;
  nama: string;
  anggota: Anggota[];
}

export default function KementerianPage() {
  const [kementerian, setKementerian] = useState<Kementerian[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [addingAnggota, setAddingAnggota] = useState<number | null>(null);
  const [newAnggotaNama, setNewAnggotaNama] = useState('');
  const [newAnggotaJabatan, setNewAnggotaJabatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    fetch('/api/kementerian')
      .then((r) => r.json())
      .then(setKementerian)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddKementerian = async () => {
    if (!newNama.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/kementerian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newNama }),
      });
      if (res.ok) {
        setNewNama('');
        setShowAddModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDeleteKementerian = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kementerian ini beserta seluruh anggotanya?')) return;
    try {
      await fetch(`/api/kementerian?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAnggota = async (kementerianId: number) => {
    if (!newAnggotaNama.trim() || !newAnggotaJabatan.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/anggota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaLengkap: newAnggotaNama,
          jabatan: newAnggotaJabatan,
          kementerianId,
        }),
      });
      if (res.ok) {
        setNewAnggotaNama('');
        setNewAnggotaJabatan('');
        setAddingAnggota(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDeleteAnggota = async (id: number) => {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    try {
      await fetch(`/api/anggota?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kementerian</h1>
          <p className="text-gray-500 mt-1">Kelola kementerian dan anggota BEM</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Kementerian
        </button>
      </div>

      {/* Kementerian List */}
      <div className="space-y-4">
        {kementerian.map((k) => (
          <div key={k.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{k.nama}</h3>
                  <p className="text-sm text-gray-500">{k.anggota.length} anggota</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteKementerian(k.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {expandedId === k.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === k.id && (
              <div className="border-t border-gray-200">
                <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Daftar Anggota
                  </span>
                  <button
                    onClick={() => setAddingAnggota(k.id)}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <UserPlus className="h-4 w-4" />
                    Tambah Anggota
                  </button>
                </div>

                {/* Add Anggota Form */}
                {addingAnggota === k.id && (
                  <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={newAnggotaNama}
                        onChange={(e) => setNewAnggotaNama(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama lengkap anggota"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Jabatan</label>
                      <input
                        type="text"
                        value={newAnggotaJabatan}
                        onChange={(e) => setNewAnggotaJabatan(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="cth: Staff Menteri"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddAnggota(k.id)}
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setAddingAnggota(null)}
                        className="bg-white text-gray-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* Members List */}
                {k.anggota.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Belum ada anggota</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {k.anggota.map((a, idx) => (
                      <div key={a.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-6">{idx + 1}.</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{a.namaLengkap}</p>
                            <p className="text-xs text-gray-500">{a.jabatan}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnggota(a.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Kementerian Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Kementerian</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kementerian</label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="cth: Hubungan Masyarakat"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddKementerian}
                  disabled={submitting || !newNama.trim()}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
