'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  History,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kementerian', label: 'Kementerian', icon: Building2 },
  { href: '/admin/jadwal', label: 'Jadwal Piket', icon: Calendar },
  { href: '/admin/riwayat', label: 'Riwayat Absensi', icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900/90 backdrop-blur-xl p-2.5 rounded-xl shadow-lg border border-white/10 text-white hover:bg-slate-800 transition-all"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl lg:translate-x-0 lg:static lg:z-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image src="/logo-kolektiva.png" alt="Logo" width={40} height={40} className="h-10 w-auto" unoptimized />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white tracking-wider uppercase">Admin Panel</h2>
                <p className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">BEM UMS 2026</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-red-600/15 text-red-400 border border-red-600/20'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full" />
                  )}
                  <Icon className={`h-5 w-5 ${isActive ? 'text-red-400' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-white/5">
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 w-full"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
