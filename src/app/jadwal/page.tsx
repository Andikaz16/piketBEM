'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { CalendarDays, Loader2, User, Star, AlertCircle } from 'lucide-react';

interface JadwalItem {
  id: number;
  hari: string;
  isKoordinator: boolean;
  anggota?: {
    namaLengkap: string;
    jabatan: string;
    kementerian?: { nama: string };
  };
}

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalPublicPage() {
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/jadwal', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setJadwal(data);
        } else {
          setJadwal([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching jadwal:', err);
        setError(true);
        setJadwal([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getJadwalByHari = (hari: string) => {
    return jadwal
      .filter((j) => j.hari && j.hari.toLowerCase() === hari.toLowerCase() && j.anggota)
      .sort((a, b) => Number(b.isKoordinator) - Number(a.isKoordinator));
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg_#0d0000_0%_#1a0000_25%_#3b0a0a_50%_#1a0000_75%_#0d0000_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 text-red-400 text-xs font-heading font-bold uppercase tracking-[0.2em] bg-red-950/20 backdrop-blur-sm mb-4">
            <CalendarDays className="h-4 w-4 text-red-500" />
            JADWAL PIKET KABINET KOLEKTIVA
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white uppercase tracking-tight">
            JADWAL <span className="text-red-500">PIKET</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-body">
            Daftar pengurus BEM UMS yang bertugas piket harian sekretariat.
          </p>
        </div>

        {/* Loading / Error / Schedule Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            <span className="text-sm font-heading tracking-widest text-gray-400 uppercase">Memuat Jadwal...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-gray-300 font-heading text-lg">Gagal memuat data jadwal dari server.</p>
            <p className="text-xs text-gray-500">Silakan restart terminal `npm run dev` atau refresh halaman.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {HARI_LIST.map((hari) => {
              const items = getJadwalByHari(hari);
              return (
                <div
                  key={hari}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-red-900/30 bg-black/40 backdrop-blur-md hover:border-red-600/50 transition-all"
                >
                  {/* Day Header */}
                  <div className="px-4 py-4 text-center bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b border-red-800/40">
                    <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider">{hari}</h2>
                    <p className="text-red-300/80 text-[11px] font-bold uppercase tracking-widest mt-0.5">
                      {items.length} PETUGAS
                    </p>
                  </div>

                  {/* Members List */}
                  <div className="p-3 flex-1 space-y-2">
                    {items.length === 0 ? (
                      <p className="text-gray-500 text-center py-8 text-xs font-body">Belum ada jadwal</p>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            item.isKoordinator
                              ? 'bg-red-950/40 border-red-600/40 hover:border-red-500'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {item.isKoordinator ? (
                              <div className="bg-red-600/20 p-1.5 rounded-lg shrink-0 border border-red-500/30 mt-0.5">
                                <Star className="h-3.5 w-3.5 text-red-400 fill-red-400/30" />
                              </div>
                            ) : (
                              <div className="bg-white/5 p-1.5 rounded-lg shrink-0 mt-0.5">
                                <User className="h-3.5 w-3.5 text-gray-400" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h3
                                className={`font-heading font-bold text-xs leading-snug uppercase tracking-wide truncate ${
                                  item.isKoordinator ? 'text-red-400' : 'text-gray-200'
                                }`}
                              >
                                {item.anggota?.namaLengkap}
                              </h3>

                              <div className="mt-1 flex flex-col gap-0.5">
                                {item.isKoordinator && (
                                  <span className="inline-self-start text-[9px] font-heading font-bold uppercase tracking-wider text-red-400 bg-red-600/20 px-1.5 py-0.5 rounded border border-red-500/30 w-fit">
                                    Koordinator
                                  </span>
                                )}
                                <p className="text-[10px] text-gray-400 truncate">
                                  {item.anggota?.kementerian?.nama || 'Pengurus BEM'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-red-900/10 bg-black/40">
        <p className="text-xs text-gray-500 font-body">
          Kabinet Kolektiva &middot; BEM Universitas Muhammadiyah Surakarta 2026
        </p>
      </footer>
    </div>
  );
}
