'use client';

import { useState, useEffect } from 'react';
import PhotoModal from '@/components/PhotoModal';
import { formatTanggal } from '@/lib/utils';
import {
  Search,
  Eye,
  Clock,
  Calendar,
  Loader2,
  ChevronDown,
  ClipboardCheck,
  RotateCcw,
} from 'lucide-react';

interface AbsensiItem {
  id: number;
  jamMasuk: string;
  fotoSelfie: string;
  fotoKegiatan: string;
  keterangan: string | null;
  tanggal: string;
  anggota: {
    namaLengkap: string;
    jabatan: string;
    kementerian: {
      nama: string;
    };
  };
}

interface Kementerian {
  id: number;
  nama: string;
}

export default function RiwayatPage() {
  const [absensi, setAbsensi] = useState<AbsensiItem[]>([]);
  const [kementerian, setKementerian] = useState<Kementerian[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterKementerian, setFilterKementerian] = useState('');
  const [photoModal, setPhotoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    fetch('/api/kementerian')
      .then((r) => r.json())
      .then(setKementerian)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterTanggal) params.set('tanggal', filterTanggal);
    if (filterKementerian) params.set('kementerian_id', filterKementerian);

    fetch(`/api/absensi?${params.toString()}`)
      .then((r) => r.json())
      .then(setAbsensi)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterTanggal, filterKementerian]);

  const handleReset = () => {
    setFilterTanggal('');
    setFilterKementerian('');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-wider">Riwayat Absensi</h1>
        <div className="divider-gradient w-16 mt-2" />
        <p className="text-gray-400 mt-3">Lihat seluruh riwayat absensi piket</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              Tanggal
            </label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none input-glow transition-all"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
              <Search className="h-3.5 w-3.5 inline mr-1" />
              Kementerian
            </label>
            <div className="relative">
              <select
                value={filterKementerian}
                onChange={(e) => setFilterKementerian(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 pr-8 text-sm text-white focus:outline-none input-glow transition-all"
              >
                <option value="" className="bg-slate-900">Semua Kementerian</option>
                {kementerian.map((k) => (
                  <option key={k.id} value={k.id.toString()} className="bg-slate-900">
                    {k.nama}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
          </div>
        ) : absensi.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">Tidak ada data absensi</p>
            <p className="text-gray-600 text-sm mt-1">Coba ubah filter untuk melihat data lainnya</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kementerian</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jam</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {absensi.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">{item.anggota.namaLengkap}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/10 text-red-400 border border-red-600/10">
                        {item.anggota.kementerian.nama}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.anggota.jabatan}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        {item.jamMasuk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                      {item.keterangan || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPhotoModal({ isOpen: true, url: item.fotoSelfie, title: 'Foto Selfie' })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-400 bg-red-600/10 rounded-lg hover:bg-red-600/20 transition-colors border border-red-600/10"
                        >
                          <Eye className="h-3 w-3" />
                          Selfie
                        </button>
                        <button
                          onClick={() =>
                            setPhotoModal({ isOpen: true, url: item.fotoKegiatan, title: 'Foto Kegiatan' })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5"
                        >
                          <Eye className="h-3 w-3" />
                          Kegiatan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Count */}
        {!loading && absensi.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5 text-sm text-gray-500 font-medium">
            Menampilkan {absensi.length} data absensi
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={photoModal.isOpen}
        onClose={() => setPhotoModal({ ...photoModal, isOpen: false })}
        imageUrl={photoModal.url}
        title={photoModal.title}
      />
    </div>
  );
}
