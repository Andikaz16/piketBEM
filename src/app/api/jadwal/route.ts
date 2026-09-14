import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const jadwal = await prisma.jadwalPiket.findMany({
      include: {
        kementerian: {
          select: { id: true, nama: true },
        },
      },
      orderBy: [
        {
          hari: 'asc',
        },
      ],
    });

    // Sort by day order
    const hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    jadwal.sort((a, b) => hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari));

    return NextResponse.json(jadwal);
  } catch (error) {
    console.error('Error fetching jadwal:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil jadwal piket' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kementerianId, hari } = body;

    if (!kementerianId || !hari) {
      return NextResponse.json(
        { error: 'Kementerian dan hari wajib diisi' },
        { status: 400 }
      );
    }

    const jadwal = await prisma.jadwalPiket.create({
      data: {
        kementerianId: parseInt(kementerianId),
        hari,
      },
      include: {
        kementerian: {
          select: { nama: true },
        },
      },
    });

    return NextResponse.json(jadwal, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Jadwal untuk kementerian dan hari tersebut sudah ada' },
        { status: 409 }
      );
    }
    console.error('Error creating jadwal:', error);
    return NextResponse.json(
      { error: 'Gagal membuat jadwal piket' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID wajib diisi' },
        { status: 400 }
      );
    }

    await prisma.jadwalPiket.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting jadwal:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus jadwal' },
      { status: 500 }
    );
  }
}
