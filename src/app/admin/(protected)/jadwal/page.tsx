'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Loader2,
  X,
  ChevronDown,
} from 'lucide-react';

interface JadwalItem {
  id: number;
  hari: string;
  kementerian: {
    id: number;
    nama: string;
  };
}

interface Kementerian {
  id: number;
  nama: string;
}

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [kementerian, setKementerian] = useState<Kementerian[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedKementerian, setSelectedKementerian] = useState('');
  const [selectedHari, setSelectedHari] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    Promise.all([
      fetch('/api/jadwal').then((r) => r.json()),
      fetch('/api/kementerian').then((r) => r.json()),
    ])
      .then(([jadwalData, kemData]) => {
        setJadwal(jadwalData);
        setKementerian(kemData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!selectedKementerian || !selectedHari) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kementerianId: selectedKementerian,
          hari: selectedHari,
        }),
      });
      if (res.ok) {
        setSelectedKementerian('');
        setSelectedHari('');
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
    return jadwal.filter((j) => j.hari === hari);
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
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Piket</h1>
          <p className="text-gray-500 mt-1">Atur jadwal piket per kementerian</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Jadwal
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {HARI_LIST.map((hari) => {
          const items = getJadwalByHari(hari);
          return (
            <div key={hari} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-center">{hari}</h3>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada jadwal</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium text-blue-700">{item.kementerian.nama}</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-600 p-1"
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

      {/* Add Modal */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Kementerian</label>
                <div className="relative">
                  <select
                    value={selectedKementerian}
                    onChange={(e) => setSelectedKementerian(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kementerian</option>
                    {kementerian.map((k) => (
                      <option key={k.id} value={k.id.toString()}>
                        {k.nama}
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
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={submitting || !selectedKementerian || !selectedHari}
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
