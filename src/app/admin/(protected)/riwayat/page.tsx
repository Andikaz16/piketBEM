'use client';

import { useState, useEffect } from 'react';
import PhotoModal from '@/components/PhotoModal';
import { formatTanggal } from '@/lib/utils';
import {
  History,
  Search,
  Eye,
  Clock,
  Calendar,
  Loader2,
  ChevronDown,
  ClipboardCheck,
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
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Absensi</h1>
        <p className="text-gray-500 mt-1">Lihat seluruh riwayat absensi piket</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              Tanggal
            </label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="h-3.5 w-3.5 inline mr-1" />
              Kementerian
            </label>
            <div className="relative">
              <select
                value={filterKementerian}
                onChange={(e) => setFilterKementerian(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kementerian</option>
                {kementerian.map((k) => (
                  <option key={k.id} value={k.id.toString()}>
                    {k.nama}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : absensi.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada data absensi</p>
            <p className="text-gray-400 text-sm mt-1">Coba ubah filter untuk melihat data lainnya</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kementerian</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jam</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {absensi.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{item.anggota.namaLengkap}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.anggota.kementerian.nama}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.anggota.jabatan}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
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
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          Selfie
                        </button>
                        <button
                          onClick={() =>
                            setPhotoModal({ isOpen: true, url: item.fotoKegiatan, title: 'Foto Kegiatan' })
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
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
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
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
