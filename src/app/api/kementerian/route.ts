import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const kementerian = await prisma.kementerian.findMany({
      include: {
        anggota: {
          orderBy: { id: 'asc' },
        },
        _count: {
          select: { anggota: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(kementerian);
  } catch (error) {
    console.error('Error fetching kementerian:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kementerian' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama } = body;

    if (!nama) {
      return NextResponse.json(
        { error: 'Nama kementerian wajib diisi' },
        { status: 400 }
      );
    }

    const kementerian = await prisma.kementerian.create({
      data: { nama },
    });

    return NextResponse.json(kementerian, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Kementerian dengan nama tersebut sudah ada' },
        { status: 409 }
      );
    }
    console.error('Error creating kementerian:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kementerian' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nama } = body;

    if (!id || !nama) {
      return NextResponse.json(
        { error: 'ID dan nama wajib diisi' },
        { status: 400 }
      );
    }

    const kementerian = await prisma.kementerian.update({
      where: { id },
      data: { nama },
    });

    return NextResponse.json(kementerian);
  } catch (error) {
    console.error('Error updating kementerian:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate kementerian' },
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

    await prisma.kementerian.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Kementerian berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting kementerian:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kementerian' },
      { status: 500 }
    );
  }
}
