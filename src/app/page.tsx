import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowRight, CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg_#0d0000_0%_#1a0000_25%_#3b0a0a_50%_#1a0000_75%_#0d0000_100%)] pointer-events-none" />

      {/* Subtle red glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-800/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Shared sticky Header */}
      <Navbar />

      {/* Main Single-Page Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Centered Large Logo */}
          <div className="mb-8 animate-fade-in flex justify-center">
            <div className="relative w-64 h-32 sm:w-80 sm:h-40 lg:w-96 lg:h-48">
              <Image
                src="/logo-kolektiva.png"
                alt="Kolektiva Logo"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.35)]"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-6 animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/40 text-red-400 text-xs sm:text-sm font-heading font-bold uppercase tracking-[0.25em] bg-red-950/20 backdrop-blur-sm shadow-[0_0_15px_rgba(220,38,38,0.15)]">
              # KABINET KOLEKTIVA 2026
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white uppercase tracking-tight leading-[1.05] animate-slide-up-delay">
            SISTEM ABSENSI
            <span className="block text-white mt-1 sm:mt-2">PIKET BEM UMS</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto font-body animate-fade-in-delay">
            Platform digital pencatatan kehadiran piket pengurus Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-slide-up-delay w-full sm:w-auto">
            <Link
              href="/absen"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-3.5 rounded-xl text-base font-heading font-bold uppercase tracking-wider hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98]"
            >
              MULAI ABSEN
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/jadwal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white px-8 py-3.5 rounded-xl text-base font-heading font-bold uppercase tracking-wider border border-red-500/60 hover:border-red-400 hover:bg-red-600/15 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(220,38,38,0.1)]"
            >
              <CalendarDays className="h-5 w-5 text-red-400" />
              LIHAT JADWAL
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-red-900/10 bg-black/40">
        <p className="text-xs text-gray-500 font-body">
          Kabinet Kolektiva &middot; BEM Universitas Muhammadiyah Surakarta 2026
        </p>
      </footer>
    </div>
  );
}
