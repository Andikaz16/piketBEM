import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ClipboardCheck, Shield, Users, Calendar, ArrowRight, CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ClipboardCheck className="h-4 w-4" />
                Kabinet Kolektiva 2026
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Sistem Absensi Piket
                <span className="block text-blue-600">BEM UMS</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Platform digital untuk pencatatan kehadiran piket pengurus 
                Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta. 
                Scan QR Code, isi form, dan dokumentasikan kegiatan piket Anda.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/absen"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Mulai Absen
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/jadwal"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <CalendarDays className="h-5 w-5" />
                  Lihat Jadwal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
              <p className="mt-3 text-gray-600">Proses absensi piket yang mudah dan cepat</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  1. Scan QR Code
                </h3>
                <p className="text-gray-600">
                  Pindai QR Code yang tersedia di ruangan BEM menggunakan kamera smartphone Anda.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2. Isi Data & Foto
                </h3>
                <p className="text-gray-600">
                  Pilih kementerian, nama Anda, lalu ambil foto selfie dan bukti kegiatan piket.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  3. Terverifikasi
                </h3>
                <p className="text-gray-600">
                  Data absensi tercatat otomatis dan dapat dilihat oleh admin melalui dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Absensi Piket BEM UMS</span>
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
