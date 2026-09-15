'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Loader2, X, ChevronDown, User, Star } from 'lucide-react';

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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Piket</h1>
          <p className="text-gray-500 mt-1">Atur jadwal piket anggota harian</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {HARI_LIST.map((hari) => {
          const items = getJadwalByHari(hari);
          return (
            <div key={hari} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-center">{hari}</h3>
                <p className="text-xs text-center text-gray-500 mt-0.5">{items.length} Fungsionaris</p>
              </div>
              <div className="p-3 space-y-2 flex-1">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada jadwal</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between rounded-lg px-3 py-2 border ${
                        item.isKoordinator ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          {item.isKoordinator ? (
                            <Star className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${item.isKoordinator ? 'text-blue-800' : 'text-gray-800'}`}>
                            {item.anggota.namaLengkap}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 ml-5">{item.anggota.kementerian.nama}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-600 p-1 shrink-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Jadwal Piket</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Anggota</label>
                <div className="relative">
                  <select
                    value={selectedAnggota}
                    onChange={(e) => setSelectedAnggota(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Cari Anggota...</option>
                    {anggota.map((a) => (
                      <option key={a.id} value={a.id.toString()}>
                        {a.namaLengkap} - {a.kementerian?.nama || ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                <div className="relative">
                  <select
                    value={selectedHari}
                    onChange={(e) => setSelectedHari(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Hari</option>
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isKoordinator"
                  checked={isKoordinator}
                  onChange={(e) => setIsKoordinator(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isKoordinator" className="text-sm font-medium text-gray-700">
                  Tandai sebagai Koordinator
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={submitting || !selectedAnggota || !selectedHari}
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
