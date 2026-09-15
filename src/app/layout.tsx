import type { Metadata } from "next";
import { Inter, Oswald, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", weight: ["400", "500", "600", "700"] });
const rajdhani = Rajdhani({ subsets: ["latin"], variable: "--font-rajdhani", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Absensi Piket BEM UMS - Kabinet Kolektiva 2026",
  description: "Sistem Absensi Piket Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${oswald.variable} ${rajdhani.variable} font-body grain-overlay`}>{children}</body>
    </html>
  );
}
