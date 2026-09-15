'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, Calendar, ClipboardCheck, Home } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        {/* Top-left: Logo + Tag */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-24 h-16 sm:w-36 sm:h-20 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-kolektiva.png"
              alt="Kolektiva Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]"
              unoptimized
              priority
            />
          </div>
          <span className="hidden lg:block text-sm font-heading font-extrabold text-white uppercase tracking-[0.2em] leading-tight drop-shadow">
            ABSENSI PIKET<br />
            <span className="text-red-500">KOLEKTIVA 2026</span>
          </span>
        </Link>

        {/* Top-right: Nav links */}
        <div className="hidden md:flex items-center gap-3">
          {[
            { href: '/', label: 'BERANDA', icon: Home },
            { href: '/jadwal', label: 'JADWAL', icon: Calendar },
            { href: '/absen', label: 'ABSEN', icon: ClipboardCheck },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all font-heading font-bold text-xs uppercase tracking-wider"
              >
                <Icon className="h-4 w-4 text-red-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="ml-3 bg-red-600 text-white px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center gap-2 hover:scale-[1.03]"
          >
            <Shield className="h-4 w-4" />
            ADMIN
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl px-4 py-4 space-y-3 border-t border-red-900/30 animate-fade-in">
          {[
            { href: '/', label: 'BERANDA', icon: Home },
            { href: '/jadwal', label: 'JADWAL', icon: Calendar },
            { href: '/absen', label: 'ABSEN', icon: ClipboardCheck },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all font-heading font-bold text-sm uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5 text-red-500" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white font-heading font-bold text-sm uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            onClick={() => setIsOpen(false)}
          >
            <Shield className="h-4 w-4" />
            ADMIN
          </Link>
        </div>
      )}
    </header>
  );
}
