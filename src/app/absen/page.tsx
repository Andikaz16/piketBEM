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
      const [selfieUrl, kegiatanUrl] = await Promise.all([
        uploadFile(fotoSelfie, 'selfie'),
        uploadFile(fotoKegiatan, 'kegiatan'),
      ]);

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
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center animate-scale-in border border-green-500/20">
            <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white uppercase mb-3">Absensi Berhasil!</h2>
            <p className="text-gray-400 mb-8">
              Data kehadiran piket Anda telah berhasil dicatat. Terima kasih.
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
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
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
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              <div className="w-6 h-px bg-red-600" />
              <ClipboardCheck className="h-3.5 w-3.5" />
              Form Absensi
              <div className="w-6 h-px bg-red-600" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-white uppercase tracking-tight">Form Absensi Piket</h1>
            <p className="text-gray-400 mt-4">Isi data kehadiran piket Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5 animate-slide-up-delay">
            {error && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Kementerian */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Kementerian <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedKementerian}
                  onChange={(e) => setSelectedKementerian(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none input-glow transition-all"
                  disabled={loadingData}
                >
                  <option value="" className="bg-slate-900">Pilih Kementerian</option>
                  {kementerian.map((k) => (
                    <option key={k.id} value={k.id.toString()} className="bg-slate-900">
                      {k.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Anggota */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Nama <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedAnggota}
                  onChange={(e) => setSelectedAnggota(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none input-glow transition-all"
                  disabled={!selectedKementerian}
                >
                  <option value="" className="bg-slate-900">Pilih Nama</option>
                  {anggotaList.map((a) => (
                    <option key={a.id} value={a.id.toString()} className="bg-slate-900">
                      {a.namaLengkap} - {a.jabatan}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Foto Selfie */}
            <CameraCapture label="Foto Selfie *" onCapture={handleSelfiCapture} />

            {/* Foto Kegiatan */}
            <CameraCapture label="Foto Bukti Kegiatan *" onCapture={handleKegiatanCapture} />

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Keterangan (Opsional)
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={3}
                placeholder="Tuliskan kegiatan yang dilakukan..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !selectedAnggota || !fotoSelfie || !fotoKegiatan}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] disabled:shadow-none"
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
