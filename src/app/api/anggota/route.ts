import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kementerianId = searchParams.get('kementerian_id');

    const where = kementerianId
      ? { kementerianId: parseInt(kementerianId) }
      : {};

    const anggota = await prisma.anggota.findMany({
      where,
      include: {
        kementerian: {
          select: { nama: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(anggota);
  } catch (error) {
    console.error('Error fetching anggota:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anggota' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaLengkap, jabatan, kementerianId } = body;

    if (!namaLengkap || !jabatan || !kementerianId) {
      return NextResponse.json(
        { error: 'Nama lengkap, jabatan, dan kementerian wajib diisi' },
        { status: 400 }
      );
    }

    const anggota = await prisma.anggota.create({
      data: {
        namaLengkap,
        jabatan,
        kementerianId: parseInt(kementerianId),
      },
    });

    return NextResponse.json(anggota, { status: 201 });
  } catch (error) {
    console.error('Error creating anggota:', error);
    return NextResponse.json(
      { error: 'Gagal menambah anggota' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, namaLengkap, jabatan, kementerianId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID wajib diisi' },
        { status: 400 }
      );
    }

    const anggota = await prisma.anggota.update({
      where: { id },
      data: {
        ...(namaLengkap && { namaLengkap }),
        ...(jabatan && { jabatan }),
        ...(kementerianId && { kementerianId: parseInt(kementerianId) }),
      },
    });

    return NextResponse.json(anggota);
  } catch (error) {
    console.error('Error updating anggota:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate anggota' },
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

    await prisma.anggota.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Anggota berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting anggota:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus anggota' },
      { status: 500 }
    );
  }
}
