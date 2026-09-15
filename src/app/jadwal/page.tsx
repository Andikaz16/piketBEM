'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { CalendarDays, Loader2, User, Star } from 'lucide-react';

interface JadwalItem {
  id: number;
  hari: string;
  isKoordinator: boolean;
  anggota: {
    namaLengkap: string;
    jabatan: string;
    kementerian: { nama: string };
  };
}

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalPublicPage() {
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jadwal')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJadwal(data);
        } else {
          setJadwal([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getJadwalByHari = (hari: string) => {
    return jadwal
      .filter((j) => j.hari === hari)
      .sort((a, b) => Number(b.isKoordinator) - Number(a.isKoordinator));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white uppercase tracking-tight">
              Jadwal Piket
            </h1>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
              Daftar fungsionaris yang bertugas piket kebersihan sekretariat setiap harinya.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {HARI_LIST.map((hari) => {
                const items = getJadwalByHari(hari);
                return (
                  <div key={hari} className="bg-dark-900/60 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full hover:border-red-600/30 transition-all">
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-4 text-center">
                      <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">{hari}</h2>
                      <p className="text-red-100/80 text-xs mt-1 font-semibold uppercase tracking-widest">{items.length} Fungsionaris</p>
                    </div>
                    
                    {/* Members */}
                    <div className="p-3 flex-1 space-y-2">
                      {items.length === 0 ? (
                        <p className="text-gray-600 text-center py-8 text-sm">Belum ada jadwal</p>
                      ) : (
                        items.map((item) => (
                          <div 
                            key={item.id}
                            className={`flex flex-col p-3 rounded-xl border ${
                              item.isKoordinator 
                                ? 'bg-red-600/10 border-red-600/20' 
                                : 'bg-white/[0.03] border-white/5'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {item.isKoordinator ? (
                                <div className="bg-red-600/20 p-1.5 rounded-lg shrink-0 mt-0.5">
                                  <Star className="h-3.5 w-3.5 text-red-400" />
                                </div>
                              ) : (
                                <div className="bg-white/5 p-1.5 rounded-lg shrink-0 mt-0.5">
                                  <User className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h3 className={`font-semibold leading-tight text-sm ${
                                  item.isKoordinator ? 'text-red-300' : 'text-gray-200'
                                }`}>
                                  {item.anggota.namaLengkap}
                                </h3>
                                <div className="mt-1 space-y-0.5">
                                  {item.isKoordinator && (
                                    <span className="inline-block px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                      Koordinator
                                    </span>
                                  )}
                                  <p className="text-[11px] text-gray-500">
                                    {item.anggota.kementerian.nama}
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
        </div>
      </main>
    </>
  );
}
