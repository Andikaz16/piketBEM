'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard';
import PhotoModal from '@/components/PhotoModal';
import { formatTanggal } from '@/lib/utils';
import {
  Users,
  ClipboardCheck,
  Building2,
  Calendar,
  Eye,
  Clock,
  Loader2,
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

export default function DashboardPage() {
  const [absensiHariIni, setAbsensiHariIni] = useState<AbsensiItem[]>([]);
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [totalKementerian, setTotalKementerian] = useState(0);
  const [loading, setLoading] = useState(true);
  const [photoModal, setPhotoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    Promise.all([
      fetch(`/api/absensi?tanggal=${today}`).then((r) => r.json()),
      fetch('/api/kementerian').then((r) => r.json()),
    ])
      .then(([absensiData, kementerianData]) => {
        setAbsensiHariIni(absensiData);
        setTotalKementerian(kementerianData.length);
        const total = kementerianData.reduce(
          (sum: number, k: any) => sum + (k.anggota?.length || 0),
          0
        );
        setTotalAnggota(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">{formatTanggal(new Date())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Absensi Hari Ini"
          value={absensiHariIni.length}
          icon={ClipboardCheck}
          color="blue"
          subtitle={`dari ${totalAnggota} anggota`}
        />
        <StatsCard
          title="Total Anggota"
          value={totalAnggota}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Kementerian"
          value={totalKementerian}
          icon={Building2}
          color="orange"
        />
        <StatsCard
          title="Persentase Hadir"
          value={totalAnggota > 0 ? `${Math.round((absensiHariIni.length / totalAnggota) * 100)}%` : '0%'}
          icon={Calendar}
          color="red"
          subtitle="hari ini"
        />
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Absensi Hari Ini</h2>
        </div>

        {absensiHariIni.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Belum ada absensi hari ini</p>
            <p className="text-gray-400 text-sm mt-1">Data akan muncul setelah anggota melakukan absensi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Kementerian</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {absensiHariIni.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-950/50">
                    <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{item.anggota.namaLengkap}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-300">
                        {item.anggota.kementerian.nama}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.anggota.jabatan}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {item.jamMasuk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPhotoModal({ isOpen: true, url: item.fotoSelfie, title: 'Foto Selfie' })
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-300 bg-red-500/10 rounded-md hover:bg-blue-100 transition-colors"
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
