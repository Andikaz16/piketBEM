'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import CameraCapture from '@/components/CameraCapture';
import {
  ClipboardCheck,
  ChevronDown,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Kementerian {
  id: number;
  nama: string;
  anggota: Anggota[];
}

interface Anggota {
  id: number;
  namaLengkap: string;
  jabatan: string;
}

export default function AbsenPage() {
  const [kementerian, setKementerian] = useState<Kementerian[]>([]);
  const [selectedKementerian, setSelectedKementerian] = useState('');
  const [selectedAnggota, setSelectedAnggota] = useState('');
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [fotoSelfie, setFotoSelfie] = useState<File | null>(null);
  const [fotoKegiatan, setFotoKegiatan] = useState<File | null>(null);
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/kementerian')
      .then((res) => res.json())
      .then((data) => {
        setKementerian(data);
        setLoadingData(false);
      })
      .catch(() => {
        setError('Gagal memuat data kementerian');
        setLoadingData(false);
      });
  }, []);

  useEffect(() => {
    if (selectedKementerian) {
      const selected = kementerian.find(
        (k) => k.id.toString() === selectedKementerian
      );
      setAnggotaList(selected?.anggota || []);
      setSelectedAnggota('');
    } else {
      setAnggotaList([]);
    }
  }, [selectedKementerian, kementerian]);

  const handleSelfiCapture = useCallback((file: File) => {
    setFotoSelfie(file);
  }, []);

  const handleKegiatanCapture = useCallback((file: File) => {
    setFotoKegiatan(file);
  }, []);

  const uploadFile = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gagal mengunggah file');
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedAnggota || !fotoSelfie || !fotoKegiatan) {
      setError('Lengkapi semua data yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Upload photos
      const [selfieUrl, kegiatanUrl] = await Promise.all([
        uploadFile(fotoSelfie, 'selfie'),
        uploadFile(fotoKegiatan, 'kegiatan'),
      ]);

      // Submit attendance
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anggotaId: selectedAnggota,
          fotoSelfie: selfieUrl,
          fotoKegiatan: kegiatanUrl,
          keterangan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan absensi');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Absensi Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Data kehadiran piket Anda telah berhasil dicatat. Terima kasih atas kontribusinya.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setSelectedKementerian('');
                setSelectedAnggota('');
                setFotoSelfie(null);
                setFotoKegiatan(null);
                setKeterangan('');
              }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Absen Lagi
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Form Absensi Piket</h1>
            <p className="text-gray-500 mt-1">Isi data kehadiran piket Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Kementerian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kementerian <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedKementerian}
                  onChange={(e) => setSelectedKementerian(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingData}
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

            {/* Anggota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedAnggota}
                  onChange={(e) => setSelectedAnggota(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedKementerian}
                >
                  <option value="">Pilih Nama</option>
                  {anggotaList.map((a) => (
                    <option key={a.id} value={a.id.toString()}>
                      {a.namaLengkap} - {a.jabatan}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Foto Selfie */}
            <CameraCapture label="Foto Selfie *" onCapture={handleSelfiCapture} />

            {/* Foto Kegiatan */}
            <CameraCapture label="Foto Bukti Kegiatan *" onCapture={handleKegiatanCapture} />

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Keterangan (Opsional)
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={3}
                placeholder="Tuliskan kegiatan yang dilakukan..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !selectedAnggota || !fotoSelfie || !fotoKegiatan}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Kirim Absensi
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
