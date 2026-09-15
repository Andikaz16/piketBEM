'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-950/95 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo-kolektiva.png" alt="Logo Kolektiva" width={400} height={400} className="h-9 w-auto" unoptimized />
              <div className="flex flex-col">
                <span className="text-lg font-heading font-bold text-white tracking-wide uppercase leading-tight">Absensi Piket</span>
                <span className="text-[10px] text-red-400 font-semibold tracking-widest uppercase">BEM UMS 2026</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium text-sm">
              Beranda
            </Link>
            <Link href="/jadwal" className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium text-sm">
              Jadwal
            </Link>
            <Link href="/absen" className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium text-sm">
              Absen
            </Link>
            <Link
              href="/admin/login"
              className="ml-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold text-sm uppercase tracking-wide"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-red-900/30 bg-dark-950/98 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-medium" onClick={() => setIsOpen(false)}>
              Beranda
            </Link>
            <Link href="/jadwal" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-medium" onClick={() => setIsOpen(false)}>
              Jadwal
            </Link>
            <Link href="/absen" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-medium" onClick={() => setIsOpen(false)}>
              Absen
            </Link>
            <Link href="/admin/login" className="block px-3 py-2.5 rounded-lg bg-red-600 text-white text-center hover:bg-red-700 font-bold uppercase tracking-wide" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
