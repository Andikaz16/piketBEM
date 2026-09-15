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
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 p-2 rounded-lg shadow-md border border-white/10 text-white"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-950/95 backdrop-blur-xl border-r border-red-900/30 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Image src="/logo-kolektiva.png" alt="Logo" width={40} height={40} className="h-10 w-auto" unoptimized />
              <div>
                <h2 className="text-lg font-heading font-bold text-white tracking-wide uppercase">Admin Panel</h2>
                <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase">BEM UMS 2026</p>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                    isActive
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30 shadow-inner'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-red-400' : 'text-gray-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-white/5">
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 w-full"
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
