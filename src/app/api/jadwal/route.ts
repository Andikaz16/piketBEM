import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jadwal = await prisma.jadwalPiket.findMany({
      include: {
        anggota: {
          select: {
            id: true,
            namaLengkap: true,
            jabatan: true,
            kementerian: { select: { nama: true } },
          },
        },
      },
      orderBy: [
        {
          hari: 'asc',
        },
      ],
    });

    return NextResponse.json(jadwal);
  } catch (error) {
    console.error('Error fetching jadwal:', error);
    return NextResponse.json({ error: 'Gagal mengambil jadwal piket' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anggotaId, hari, isKoordinator } = body;

    if (!anggotaId || !hari) {
      return NextResponse.json({ error: 'Anggota dan hari wajib diisi' }, { status: 400 });
    }

    const jadwal = await prisma.jadwalPiket.create({
      data: {
        anggotaId: parseInt(anggotaId),
        hari,
        isKoordinator: isKoordinator || false,
      },
      include: {
        anggota: { select: { namaLengkap: true } },
      },
    });

    return NextResponse.json(jadwal, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Anggota tersebut sudah memiliki jadwal di hari yang sama' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Gagal membuat jadwal piket' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });

    await prisma.jadwalPiket.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 });
  }
}
