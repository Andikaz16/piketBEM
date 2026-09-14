import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal');
    const kementerianId = searchParams.get('kementerian_id');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');

    let where: any = {};

    if (tanggal) {
      const startOfDay = new Date(tanggal);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(tanggal);
      endOfDay.setHours(23, 59, 59, 999);
      where.tanggal = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (bulan && tahun) {
      const startOfMonth = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
      const endOfMonth = new Date(parseInt(tahun), parseInt(bulan), 0, 23, 59, 59, 999);
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

export async function POST(request: NextRequest) {
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
    const jamMasuk = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Check if already absent today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

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
