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
        <Loader2 className="h-8 w-8 animate-spin text-red-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-wider">Kementerian</h1>
          <div className="divider-gradient w-16 mt-2" />
          <p className="text-gray-400 mt-3">Kelola kementerian dan anggota BEM</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
        >
          <Plus className="h-5 w-5" />
          Tambah
        </button>
      </div>

      {/* Kementerian List */}
      <div className="space-y-4">
        {kementerian.map((k) => (
          <div key={k.id} className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-600/10 p-2.5 rounded-xl border border-red-600/10">
                  <Building2 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white uppercase tracking-wide">{k.nama}</h3>
                  <p className="text-sm text-gray-500">{k.anggota.length} anggota</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteKementerian(k.id);
                  }}
                  className="p-2 text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
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
              <div className="border-t border-white/5">
                <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                    <Users className="h-4 w-4" />
                    Daftar Anggota
                  </span>
                  <button
                    onClick={() => setAddingAnggota(k.id)}
                    className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-bold transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Tambah
                  </button>
                </div>

                {/* Add Anggota Form */}
                {addingAnggota === k.id && (
                  <div className="px-6 py-4 border-b border-white/5" style={{ background: 'rgba(220,38,38,0.05)' }}>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Nama Lengkap</label>
                        <input
                          type="text"
                          value={newAnggotaNama}
                          onChange={(e) => setNewAnggotaNama(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none input-glow"
                          placeholder="Nama lengkap anggota"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Jabatan</label>
                        <input
                          type="text"
                          value={newAnggotaJabatan}
                          onChange={(e) => setNewAnggotaJabatan(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none input-glow"
                          placeholder="cth: Staff Menteri"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddAnggota(k.id)}
                          disabled={submitting}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setAddingAnggota(null)}
                          className="bg-white/5 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold border border-white/10 hover:bg-white/10 transition-all"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Members List */}
                {k.anggota.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada anggota</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {k.anggota.map((a, idx) => (
                      <div key={a.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-6">{idx + 1}.</span>
                          <div>
                            <p className="text-sm font-medium text-white">{a.namaLengkap}</p>
                            <p className="text-xs text-gray-500">{a.jabatan}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnggota(a.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">Tambah Kementerian</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">Nama Kementerian</label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                  placeholder="cth: Hubungan Masyarakat"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddKementerian}
                  disabled={submitting || !newNama.trim()}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/5 text-gray-400 py-2.5 rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all"
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
