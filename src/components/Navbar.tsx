'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ClipboardCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Absensi Piket BEM</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Beranda
            </Link>
            <Link href="/absen" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Absen
            </Link>
            <Link href="/scan" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Scan QR
            </Link>
            <Link
              href="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/absen"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Absen
            </Link>
            <Link
              href="/scan"
              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Scan QR
            </Link>
            <Link
              href="/admin/login"
              className="block px-3 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
