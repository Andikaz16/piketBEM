import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator BEM',
    },
  });

  // Seed Kementerian dan Anggota
  const data = [
    {
      nama: 'Pimpinan Umum',
      anggota: [
        { namaLengkap: 'Muh. Naufal Aulia Darojat', jabatan: 'Presiden Mahasiswa' },
        { namaLengkap: 'Muh. Faris Abid Muwaffaq', jabatan: 'Wakil Presiden Mahasiswa' },
        { namaLengkap: 'Figur Ahmad Brilian', jabatan: 'Sekretaris Kabinet' },
        { namaLengkap: 'Khalda Syifa Nida', jabatan: 'Wakil Sekretaris Kabinet' },
        { namaLengkap: 'Nisa Hidayanti Putri', jabatan: 'Bendahara Kabinet' },
      ],
    },
    {
      nama: 'POP',
      anggota: [
        { namaLengkap: 'Bramantyo Ikhsanul Hakim', jabatan: 'Menteri' },
        { namaLengkap: 'Sheila Mei Lisa', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Vivia Ayu Maharani', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Puput Rahmawati', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Muhamad Amarrudin Khan', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Naura Shifa Putri Sofiani', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Burhanuddin Alhakim', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Calista Putri Fatimaheswari', jabatan: 'Staff Menteri' },
      ],
    },
    {
      nama: 'ADVOKESMA',
      anggota: [
        { namaLengkap: 'Anggris Bagus Eka Saputra', jabatan: 'Menteri' },
        { namaLengkap: 'Pinkan Nuraini', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Abdullah Tsaqif Imtiyazi', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Arkan Ramadhani Inayatullah', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Muhammad Kafi Najamul Daim', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Sherlina Devi Oktavia', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Alya Nabila', jabatan: 'Staff Menteri' },
      ],
    },
    {
      nama: 'Luar Negeri',
      anggota: [
        { namaLengkap: 'Jody Julian Putra Caesar', jabatan: 'Menteri' },
        { namaLengkap: 'Arya Firmansyah', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Sabrina Qurrotul\'ain Dakhan', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Ahmad Rizky Fuady', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Aulia Annisa Musdhalifah', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Nisa Fadhilah Purnomo', jabatan: 'Staff Menteri' },
      ],
    },
    {
      nama: 'Dalam Negeri',
      anggota: [
        { namaLengkap: 'Firda Hayyuning Nusa', jabatan: 'Menteri' },
        { namaLengkap: 'Shilvy Ameilina Putri', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Febriani Sekar Cikal', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Yasinta Widia Anjati', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Rangga Budi Hartono', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Ridwan Dimas Arya Rangga Pangestu', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Astriana Dwi Yuliyanti', jabatan: 'Staff Menteri' },
      ],
    },
    {
      nama: 'Pergerakan',
      anggota: [
        { namaLengkap: 'Riezky Prayudha Anggito Prabowo', jabatan: 'Menteri' },
        { namaLengkap: 'Hafidh Dzaky Hananta', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Ahmad Muwaffiqul Choir', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Daffa Alfarozy Aristyanova', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Jordan Purwoko Putro', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Rafa Hanif Maulida', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Muhammad Rifqi Amani', jabatan: 'Staff Menteri' },
      ],
    },
    {
      nama: 'MEDINFO',
      anggota: [
        { namaLengkap: 'Chandra Nur Prasetya', jabatan: 'Menteri' },
        { namaLengkap: 'Farida Amani', jabatan: 'Sekretaris Menteri' },
        { namaLengkap: 'Muhammad Afrizal Zaini', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Siti Rusmiati', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Daffa Chandra Himawan', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Salsa Dwi Anggraini', jabatan: 'Staff Menteri' },
        { namaLengkap: 'Yoga Andika Hanryant Pratama', jabatan: 'Staff Menteri' },
      ],
    },
  ];

  for (const kementerian of data) {
    const created = await prisma.kementerian.upsert({
      where: { nama: kementerian.nama },
      update: {},
      create: {
        nama: kementerian.nama,
        anggota: {
          create: kementerian.anggota,
        },
      },
    });
    console.log(`Kementerian "${created.nama}" berhasil di-seed.`);
  }

  // Seed Jadwal Piket
  const jadwal = [
    {
      hari: 'Senin',
      koordinator: ['Bramantyo Ikhsanul Hakim'],
      anggota: [
        'Salsa Dwi Anggraini',
        'Hafidh Dzaky Hananta',
        'Siti Rusmiati',
        'Riezky Prayudha Anggito Prabowo',
        'Ahmad Muwaffiqul Choir',
        'Astriana Dwi Yuliyanti',
        'Ridwan Dimas Arya Rangga Pangestu',
        'Rafa Hanif Maulida',
      ],
    },
    {
      hari: 'Selasa',
      koordinator: ['Burhanuddin Alhakim'],
      anggota: [
        'Sherlina Devi Oktavia',
        'Muhammad Rifqi Amani',
        'Anggris Bagus Eka Saputra',
        'Jody Julian Putra Caesar',
        'Arkan Ramadhani Inayatullah',
        'Shilvy Ameilina Putri',
        'Chandra Nur Prasetya',
        'Jordan Purwoko Putro',
      ],
    },
    {
      hari: 'Rabu',
      koordinator: ['Sheila Mei Lisa', 'Puput Rahmawati'],
      anggota: [
        'Daffa Alfarozy Aristyanova',
        'Figur Ahmad Brilian',
        'Farida Amani',
        'Yoga Andika Hanryant Pratama',
        'Ahmad Rizky Fuady',
        'Daffa Chandra Himawan',
        'Sabrina Qurrotul\'ain Dakhan',
        'Pinkan Nuraini',
      ],
    },
    {
      hari: 'Kamis',
      koordinator: ['Vivia Ayu Maharani', 'Naura Shifa Putri Sofiani'],
      anggota: [
        'Muhammad Kafi Najamul Daim',
        'Febriani Sekar Cikal',
        'Muh. Naufal Aulia Darojat',
        'Arya Firmansyah',
        'Yasinta Widia Anjati',
        'Aulia Annisa Musdhalifah',
        'Abdullah Tsaqif Imtiyazi',
      ],
    },
    {
      hari: 'Jumat',
      koordinator: ['Muhamad Amarrudin Khan', 'Calista Putri Fatimaheswari'],
      anggota: [
        'Muh. Faris Abid Muwaffaq',
        'Khalda Syifa Nida',
        'Nisa Hidayanti Putri',
        'Alya Nabila',
        'Nisa Fadhilah Purnomo',
        'Firda Hayyuning Nusa',
        'Rangga Budi Hartono',
      ],
    },
  ];

  await prisma.jadwalPiket.deleteMany(); // Reset jadwal
  
  for (const j of jadwal) {
    const allNames = [...j.koordinator, ...j.anggota];
    
    for (const name of allNames) {
      const isKoord = j.koordinator.includes(name);
      
      const dbAnggota = await prisma.anggota.findFirst({
        where: { namaLengkap: name },
      });
      
      if (dbAnggota) {
        await prisma.jadwalPiket.create({
          data: {
            anggotaId: dbAnggota.id,
            hari: j.hari,
            isKoordinator: isKoord,
          },
        });
      } else {
        console.warn(`Anggota tidak ditemukan untuk jadwal: ${name}`);
      }
    }
  }

  console.log('Seed selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
