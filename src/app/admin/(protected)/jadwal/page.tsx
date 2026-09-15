'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, X, ChevronDown, User, Star } from 'lucide-react';

interface JadwalItem {
  id: number;
  hari: string;
  isKoordinator: boolean;
  anggota: {
    id: number;
    namaLengkap: string;
    jabatan: string;
    kementerian: { nama: string };
  };
}

interface Anggota {
  id: number;
  namaLengkap: string;
  kementerian: { nama: string };
}

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState('');
  const [selectedHari, setSelectedHari] = useState('');
  const [isKoordinator, setIsKoordinator] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    Promise.all([
      fetch('/api/jadwal').then((r) => r.json()),
      fetch('/api/anggota').then((r) => r.json()),
    ])
      .then(([jadwalData, anggotaData]) => {
        if (Array.isArray(jadwalData)) setJadwal(jadwalData);
        if (Array.isArray(anggotaData)) setAnggota(anggotaData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!selectedAnggota || !selectedHari) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anggotaId: selectedAnggota,
          hari: selectedHari,
          isKoordinator,
        }),
      });
      if (res.ok) {
        setSelectedAnggota('');
        setSelectedHari('');
        setIsKoordinator(false);
        setShowAddModal(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      await fetch(`/api/jadwal?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getJadwalByHari = (hari: string) => {
    return jadwal.filter((j) => j.hari === hari).sort((a, b) => Number(b.isKoordinator) - Number(a.isKoordinator));
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-wider">Jadwal Piket</h1>
          <div className="divider-gradient w-16 mt-2" />
          <p className="text-gray-400 mt-3">Atur jadwal piket anggota harian</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
        >
          <Plus className="h-5 w-5" />
          Tambah
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {HARI_LIST.map((hari) => {
          const items = getJadwalByHari(hari);
          return (
            <div key={hari} className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-white/5" style={{ background: 'linear-gradient(135deg, rgba(153,27,27,0.3), rgba(220,38,38,0.15))' }}>
                <h3 className="font-heading font-bold text-white text-center uppercase tracking-wider">{hari}</h3>
                <p className="text-xs text-center text-gray-400 mt-0.5 font-medium">{items.length} Fungsionaris</p>
              </div>
              <div className="p-3 space-y-2 flex-1">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">Belum ada jadwal</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between rounded-xl px-3 py-2 border transition-all ${
                        item.isKoordinator ? 'bg-red-600/10 border-red-600/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          {item.isKoordinator ? (
                            <Star className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${item.isKoordinator ? 'text-red-300' : 'text-gray-300'}`}>
                            {item.anggota.namaLengkap}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 ml-5">{item.anggota.kementerian.nama}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-600 hover:text-red-400 p-1 shrink-0 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">Tambah Jadwal Piket</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">Pilih Anggota</label>
                <div className="relative">
                  <select
                    value={selectedAnggota}
                    onChange={(e) => setSelectedAnggota(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none input-glow transition-all"
                  >
                    <option value="" className="bg-slate-900">Cari Anggota...</option>
                    {anggota.map((a) => (
                      <option key={a.id} value={a.id.toString()} className="bg-slate-900">
                        {a.namaLengkap} - {a.kementerian?.nama || ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">Hari</label>
                <div className="relative">
                  <select
                    value={selectedHari}
                    onChange={(e) => setSelectedHari(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none input-glow transition-all"
                  >
                    <option value="" className="bg-slate-900">Pilih Hari</option>
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h} className="bg-slate-900">{h}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isKoordinator"
                  checked={isKoordinator}
                  onChange={(e) => setIsKoordinator(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-red-500 focus:ring-red-500 bg-white/5"
                />
                <label htmlFor="isKoordinator" className="text-sm font-medium text-gray-300">
                  Tandai sebagai Koordinator
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={submitting || !selectedAnggota || !selectedHari}
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
