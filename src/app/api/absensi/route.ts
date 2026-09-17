import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal');
    const kementerianId = searchParams.get('kementerian_id');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');

    let where: any = {};

    if (tanggal) {
      // Set boundaries in WIB (UTC+7)
      const startOfDay = new Date(`${tanggal}T00:00:00.000+07:00`);
      const endOfDay = new Date(`${tanggal}T23:59:59.999+07:00`);
      where.tanggal = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (bulan && tahun) {
      const paddedBulan = bulan.padStart(2, '0');
      const daysInMonth = new Date(parseInt(tahun), parseInt(bulan), 0).getDate();
      const startOfMonth = new Date(`${tahun}-${paddedBulan}-01T00:00:00.000+07:00`);
      const endOfMonth = new Date(`${tahun}-${paddedBulan}-${daysInMonth}T23:59:59.999+07:00`);
      where.tanggal = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    if (kementerianId) {
      where.anggota = {
        kementerianId: parseInt(kementerianId),
      };
    }

    const absensi = await prisma.absensi.findMany({
      where,
      include: {
        anggota: {
          include: {
            kementerian: {
              select: { nama: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(absensi);
  } catch (error) {
    console.error('Error fetching absensi:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data absensi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anggotaId, fotoSelfie, fotoKegiatan, keterangan } = body;

    if (!anggotaId || !fotoSelfie || !fotoKegiatan) {
      return NextResponse.json(
        { error: 'Anggota, foto selfie, dan foto kegiatan wajib diisi' },
        { status: 400 }
      );
    }

    const now = new Date();
    
    // Explicitly set timezone to Indonesia/Jakarta (WIB)
    const jamMasuk = now.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Check if already absent today (in WIB)
    const wibDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // Output: YYYY-MM-DD
    const startOfDay = new Date(`${wibDateString}T00:00:00.000+07:00`);
    const endOfDay = new Date(`${wibDateString}T23:59:59.999+07:00`);

    const existing = await prisma.absensi.findFirst({
      where: {
        anggotaId: parseInt(anggotaId),
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Anda sudah melakukan absensi hari ini' },
        { status: 409 }
      );
    }

    const absensi = await prisma.absensi.create({
      data: {
        anggotaId: parseInt(anggotaId),
        jamMasuk,
        fotoSelfie,
        fotoKegiatan,
        keterangan: keterangan || null,
      },
      include: {
        anggota: {
          include: {
            kementerian: true,
          },
        },
      },
    });

    return NextResponse.json(absensi, { status: 201 });
  } catch (error) {
    console.error('Error creating absensi:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan absensi' },
      { status: 500 }
    );
  }
}
