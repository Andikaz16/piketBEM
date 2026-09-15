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
          console.error('Data jadwal bukan array:', data);
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
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Jadwal Piket BEM UMS</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Daftar fungsionaris yang bertugas piket kebersihan sekretariat setiap harinya.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {HARI_LIST.map((hari) => {
                const items = getJadwalByHari(hari);
                return (
                  <div key={hari} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="bg-blue-600 px-4 py-4 text-center">
                      <h2 className="text-xl font-bold text-white">{hari}</h2>
                      <p className="text-blue-100 text-sm mt-1">{items.length} Fungsionaris</p>
                    </div>
                    
                    <div className="p-4 flex-1 space-y-3 bg-gray-50/50">
                      {items.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 text-sm">Belum ada jadwal</p>
                      ) : (
                        items.map((item) => (
                          <div 
                            key={item.id}
                            className={`flex flex-col p-3 rounded-xl border bg-white ${
                              item.isKoordinator 
                                ? 'border-blue-200 shadow-sm ring-1 ring-blue-50' 
                                : 'border-gray-100'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {item.isKoordinator ? (
                                <div className="bg-blue-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                                  <Star className="h-4 w-4 text-blue-600" />
                                </div>
                              ) : (
                                <div className="bg-gray-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <h3 className={`font-semibold leading-tight ${
                                  item.isKoordinator ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {item.anggota.namaLengkap}
                                </h3>
                                <div className="mt-1 space-y-0.5">
                                  {item.isKoordinator && (
                                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md mb-1">
                                      Koordinator
                                    </span>
                                  )}
                                  <p className="text-xs text-gray-500">
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
