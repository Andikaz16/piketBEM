'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import QRScanner from '@/components/QRScanner';
import { QrCode, Info } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();

  const handleScanSuccess = (decodedText: string) => {
    // If the QR code contains a URL, navigate to it
    if (decodedText.includes('/absen')) {
      router.push('/absen');
    } else {
      // Otherwise, just go to the absen page
      router.push('/absen');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
            <p className="text-gray-500 mt-1">Arahkan kamera ke QR Code yang tersedia</p>
          </div>

          {/* Scanner */}
          <QRScanner onScanSuccess={handleScanSuccess} />

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Petunjuk</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Pastikan kamera dalam keadaan bersih</li>
                <li>Arahkan kamera tepat ke QR Code</li>
                <li>Jaga jarak sekitar 15-20 cm dari QR Code</li>
                <li>Pastikan pencahayaan cukup</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
