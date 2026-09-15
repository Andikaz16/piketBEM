import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ClipboardCheck, Shield, Users, Calendar, ArrowRight, CalendarDays, Camera } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-red-glow" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-700/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="text-center max-w-3xl mx-auto">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Image 
                    src="/logo-kolektiva.png" 
                    alt="Kabinet Kolektiva" 
                    width={120} 
                    height={120} 
                    className="h-24 w-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/30 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                <ClipboardCheck className="h-4 w-4" />
                Kabinet Kolektiva 2026
              </div>

              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-white leading-none tracking-tight uppercase">
                Sistem Absensi
                <span className="block text-red-500 mt-2">Piket BEM UMS</span>
              </h1>

              <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Platform digital untuk pencatatan kehadiran piket pengurus 
                Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta. 
                Isi form, dokumentasikan kegiatan, dan verifikasi kehadiran.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/absen"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5"
                >
                  Mulai Absen
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/jadwal"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-5 w-5" />
                  Lihat Jadwal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />
        </section>

        {/* Features Section */}
        <section className="relative bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-white uppercase tracking-tight">Cara Kerja</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
              <p className="mt-6 text-gray-400 text-lg">Proses absensi piket yang mudah dan cepat</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-dark-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-red-600/30 transition-all group hover:-translate-y-1">
                <div className="bg-red-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <Camera className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-red-500 font-heading text-sm font-bold uppercase tracking-widest mb-2">Langkah 01</div>
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-3">
                  Buka Website
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Scan QR Code yang tersedia di ruangan BEM atau buka langsung link website ini dari smartphone Anda.
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-dark-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-red-600/30 transition-all group hover:-translate-y-1">
                <div className="bg-red-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <Users className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-red-500 font-heading text-sm font-bold uppercase tracking-widest mb-2">Langkah 02</div>
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-3">
                  Isi Data & Foto
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Pilih kementerian, nama Anda, lalu ambil foto selfie dan bukti kegiatan piket yang telah dilakukan.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-dark-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-red-600/30 transition-all group hover:-translate-y-1">
                <div className="bg-red-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors">
                  <Shield className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-red-500 font-heading text-sm font-bold uppercase tracking-widest mb-2">Langkah 03</div>
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-3">
                  Terverifikasi
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Data absensi tercatat otomatis dan dapat dilihat oleh admin melalui dashboard manajemen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-950 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Image src="/logo-kolektiva.png" alt="Logo" width={32} height={32} className="h-7 w-auto" />
                <span className="font-heading font-bold text-white uppercase tracking-wide text-sm">Absensi Piket BEM UMS</span>
              </div>
              <p className="text-sm text-gray-500">
                Kabinet Kolektiva - Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta 2026
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
