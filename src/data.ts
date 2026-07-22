import { Product, MitraSPPG, Order, DeliveryLog, Ticket, Article, LabReport, Promo } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Susu Pasteurisasi Original NatNat',
    type: 'Pasteurisasi',
    volume: '125 ml',
    packaging: 'Cup Higienis Lid-sealed',
    price: 2900,
    targetAudience: 'Siswa SD & PAUD Program MBG',
    nutrients: {
      energy: '88 kcal',
      protein: '4.3 g',
      calcium: '135 mg',
      totalFat: '6.7 g',
      saturatedFat: '3.0 g',
      carbohydrates: '5.6 g'
    },
    description: 'Susu sapi segar 100% murni dari peternak lokal Singosari Malang, dipasteurisasi dengan suhu presisi untuk menjaga kesegaran dan enzim alami tanpa bahan pengawet. Dikemas dalam gelas cup sekali minum yang sangat disukai anak-anak.',
    certifications: ['BPOM MD 241031001099', 'Halal ID35110000214820323', 'ISO 22000:2018 Certified']
  },
  {
    id: 'prod-02',
    name: 'Susu UHT Cokelat NatNat',
    type: 'UHT',
    volume: '125 ml',
    packaging: 'Kotak TetraPak aseptic',
    price: 3100,
    targetAudience: 'Siswa SMP & SMA Program MBG',
    nutrients: {
      energy: '95 kcal',
      protein: '4.0 g',
      calcium: '120 mg',
      totalFat: '5.5 g',
      saturatedFat: '2.5 g',
      carbohydrates: '7.8 g'
    },
    description: 'Varian rasa cokelat yang lezat dengan proses Ultra High Temperature (UHT) sehingga memiliki daya simpan yang lebih panjang pada suhu ruang tanpa mengurangi nutrisi protein dan kalsium esensial.',
    certifications: ['BPOM MD 241031002099', 'Halal ID35110000214820324', 'HACCP Certified']
  },
  {
    id: 'prod-03',
    name: 'Susu Steril Medis NatNat',
    type: 'Steril',
    volume: '150 ml',
    packaging: 'Botol Kaca Hermetis',
    price: 4500,
    targetAudience: 'Ibu Hamil & Balita Gizi Kurang',
    nutrients: {
      energy: '110 kcal',
      protein: '5.2 g',
      calcium: '160 mg',
      totalFat: '8.0 g',
      saturatedFat: '3.8 g',
      carbohydrates: '6.5 g'
    },
    description: 'Susu steril dengan formulasi khusus kaya asam folat dan zat besi tambahan, ditujukan khusus bagi ibu hamil, ibu menyusui, serta balita dalam pencegahan stunting nasional.',
    certifications: ['BPOM MD 241031003099', 'Halal ID35110000214820325', 'GMP Certified']
  }
];

export const MITRA_SPPG: MitraSPPG[] = [
  {
    id: 'mitra-01',
    name: 'SPPG Singosari 01 (Dapur Sentral)',
    location: 'Singosari, Malang',
    address: 'Jl. Raya Singosari No. 45, Singosari',
    coordinator: 'Budi Santoso, S.Gz',
    phone: '0812-3456-7890',
    beneficiariesCount: 1200,
    dailyQuota: 1200
  },
  {
    id: 'mitra-02',
    name: 'SPPG Lawang Utara',
    location: 'Lawang, Malang',
    address: 'Jl. Argopuro No. 12, Lawang',
    coordinator: 'Siti Rahma, A.Md.Gz',
    phone: '0856-7890-1234',
    beneficiariesCount: 850,
    dailyQuota: 850
  },
  {
    id: 'mitra-03',
    name: 'SPPG Karangploso Madani',
    location: 'Karangploso, Malang',
    address: 'Jl. Diponegoro Gg. 3, Karangploso',
    coordinator: 'dr. H. Ahmad Fauzi',
    phone: '0813-9876-5432',
    beneficiariesCount: 950,
    dailyQuota: 950
  },
  {
    id: 'mitra-04',
    name: 'SPPG Klojen Kota Malang',
    location: 'Klojen, Kota Malang',
    address: 'Jl. Ijen No. 18, Klojen',
    coordinator: 'Dewi Lestari, S.KM',
    phone: '0878-1234-5678',
    beneficiariesCount: 1500,
    dailyQuota: 1500
  },
  {
    id: 'mitra-05',
    name: 'SPPG Lowokwaru Mandiri',
    location: 'Lowokwaru, Kota Malang',
    address: 'Jl. Soekarno-Hatta No. 88, Lowokwaru',
    coordinator: 'Hendro Wijaya, S.E',
    phone: '0821-4567-8901',
    beneficiariesCount: 1100,
    dailyQuota: 1100
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-01',
    title: 'Peran Krusial Susu Segar dalam Menurunkan Angka Stunting Nasional',
    summary: 'Bagaimana konsumsi harian 125ml susu pasteurisasi berkualitas tinggi membantu pemenuhan mikronutrisi anak sekolah dalam program MBG.',
    category: 'Gizi',
    date: '2026-07-15',
    author: 'Tim Ahli Gizi PT. SABP',
    content: `Stunting masih menjadi tantangan besar dalam pembangunan kualitas sumber daya manusia di Indonesia. Program Makan Bergizi Gratis (MBG) merupakan momentum emas untuk melakukan intervensi gizi terintegrasi secara nasional.

Susu pasteurisasi murni, seperti NatNat Fresh Milk, mengandung protein whey dan kasein berkualitas tinggi yang kaya asam amino esensial. Kandungan kalsium yang melimpah (135 mg per cup 125 ml) dipadukan dengan fosfor dalam rasio optimal memastikan penyerapan kalsium maksimal untuk pertumbuhan tulang dan tinggi badan anak.

Dengan moto "Menu MBG Belum Lengkap Tanpa Susu!", penambahan satu cup susu segar setiap hari terbukti klinis mempercepat perbaikan indeks tinggi badan menurut umur (TB/U) pada anak sekolah dasar.`
  },
  {
    id: 'art-02',
    title: 'SOP Penyimpanan Cold Chain & Distribusi Susu Pasteurisasi di Dapur SPPG',
    summary: 'Panduan teknis bagi petugas dapur gizi SPPG agar kualitas dan higienitas susu NatNat tetap terjaga prima hingga dikonsumsi anak-anak.',
    category: 'SOP Distribusi',
    date: '2026-07-10',
    author: 'Dept. Quality Assurance PT. SABP',
    content: `Susu pasteurisasi adalah produk segar tanpa bahan pengawet kimia. Oleh karena itu, integritas rantai dingin (cold chain) wajib dijaga dari pabrik hingga meja makan anak.

Berikut adalah SOP Penanganan di Dapur SPPG:
1. **Penerimaan Barang**: Cek kondisi kemasan dan pastikan suhu susu saat diterima berkisar antara 2°C s.d 4°C menggunakan termometer inframerah.
2. **Penyimpanan Segera**: Langsung masukkan susu ke dalam Freezer Box atau Chiller yang disediakan gratis dari NatNat. Suhu penyimpanan ideal adalah 0°C s.d 4°C.
3. **Prinsip FIFO**: Terapkan metode First-In, First-Out (Susu yang diterima lebih awal harus didistribusikan terlebih dahulu).
4. **Penyajian**: Jangan membiarkan susu di luar mesin pendingin lebih dari 2 jam sebelum dikonsumsi agar bakteri pembusuk tidak berkembang biak.`
  },
  {
    id: 'art-03',
    title: 'Sourcing Transparan: Dari Peternak Kemitraan Singosari ke Meja Makan Anak',
    summary: 'Melalui kemitraan dengan 150+ peternak sapi perah lokal Malang, kami memastikan perputaran ekonomi sirkular dan keaslian susu murni.',
    category: 'Siaran Pers',
    date: '2026-07-01',
    author: 'Public Relations',
    content: `PT Satriyo Abimanyu Prabangkara berkomitmen penuh tidak hanya pada kesehatan anak-anak penerima MBG, tetapi juga pada kesejahteraan peternak sapi lokal di wilayah Singosari dan lereng Gunung Arjuno, Malang.

Susu segar yang diolah di pabrik modern kami dikumpulkan setiap pagi dan sore dari koperasi peternak mitra pilihan. Kami menguji kualitas susu segar (BJ, kadar lemak, alkohol test) secara ketat di pos penampungan sebelum dibawa menggunakan truk tangki insulated ke pabrik.

Dengan model rantai pasok terintegrasi ini, setiap tetes NatNat Fresh Milk menyalurkan kebaikan nutrisi untuk generasi bangsa sekaligus menggerakkan ekonomi riil UMKM peternakan Jawa Timur.`
  }
];

export const LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-001',
    batchNo: 'B-260718-A',
    testDate: '2026-07-18',
    bacteriaCount: '8.5 x 10³ CFU/ml', // Standard is < 10^5
    fatContent: '3.6 %',
    proteinContent: '3.4 %',
    sensoryTest: 'Sesuai Standar',
    status: 'Lulus Uji',
    certifiedBy: 'Hendra Wijaya, M.Si (Lab QC Supervisor)'
  },
  {
    id: 'lab-002',
    batchNo: 'B-260719-A',
    testDate: '2026-07-19',
    bacteriaCount: '9.1 x 10³ CFU/ml',
    fatContent: '3.5 %',
    proteinContent: '3.3 %',
    sensoryTest: 'Sesuai Standar',
    status: 'Lulus Uji',
    certifiedBy: 'Hendra Wijaya, M.Si (Lab QC Supervisor)'
  },
  {
    id: 'lab-003',
    batchNo: 'B-260720-A',
    testDate: '2026-07-20',
    bacteriaCount: '7.8 x 10³ CFU/ml',
    fatContent: '3.7 %',
    proteinContent: '3.5 %',
    sensoryTest: 'Sesuai Standar',
    status: 'Lulus Uji',
    certifiedBy: 'Hendra Wijaya, M.Si (Lab QC Supervisor)'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-20260721-01',
    mitraId: 'mitra-01',
    mitraName: 'SPPG Singosari 01 (Dapur Sentral)',
    productName: 'Susu Pasteurisasi Original NatNat',
    quantity: 1200,
    deliveryDate: '2026-07-21',
    status: 'Dalam Perjalanan',
    orderDate: '2026-07-20',
    notes: 'Kirim pagi sebelum jam 06.00 WIB untuk sarapan siswa SD'
  },
  {
    id: 'ORD-20260721-02',
    mitraId: 'mitra-04',
    mitraName: 'SPPG Klojen Kota Malang',
    productName: 'Susu Pasteurisasi Original NatNat',
    quantity: 1500,
    deliveryDate: '2026-07-21',
    status: 'Dalam Perjalanan',
    orderDate: '2026-07-20',
    notes: 'Pastikan freezer box kosong siap menampung suplai harian'
  },
  {
    id: 'ORD-20260720-01',
    mitraId: 'mitra-02',
    mitraName: 'SPPG Lawang Utara',
    productName: 'Susu Pasteurisasi Original NatNat',
    quantity: 850,
    deliveryDate: '2026-07-20',
    status: 'Selesai',
    orderDate: '2026-07-19',
    notes: 'Diterima dalam kondisi dingin yang sempurna',
    signedBy: 'Siti Rahma, A.Md.Gz',
    receivedDate: '2026-07-20 05:45'
  },
  {
    id: 'ORD-20260720-02',
    mitraId: 'mitra-03',
    mitraName: 'SPPG Karangploso Madani',
    productName: 'Susu UHT Cokelat NatNat',
    quantity: 950,
    deliveryDate: '2026-07-20',
    status: 'Selesai',
    orderDate: '2026-07-19',
    notes: 'Varian cokelat untuk tingkat SMP',
    signedBy: 'dr. H. Ahmad Fauzi',
    receivedDate: '2026-07-20 06:10'
  }
];

export const INITIAL_DELIVERIES: DeliveryLog[] = [
  {
    id: 'TRK-260721-01',
    orderId: 'ORD-20260721-01',
    driverName: 'Eko Prasetyo',
    vehicleNo: 'N 8824 AB (Reefer Truck 1)',
    departureTime: '2026-07-21 04:30',
    status: 'Dalam Perjalanan',
    currentTemp: 2.8,
    tempHistory: [
      { time: '04:30', temp: 2.2 },
      { time: '04:45', temp: 2.4 },
      { time: '05:00', temp: 2.5 },
      { time: '05:15', temp: 2.7 },
      { time: '05:30', temp: 2.8 }
    ],
    routeCoordinates: [
      { lat: -7.8923, lng: 112.6512 }, // Factory
      { lat: -7.8950, lng: 112.6530 },
      { lat: -7.8985, lng: 112.6565 },
      { lat: -7.9020, lng: 112.6590 }  // Heading to Singosari School
    ],
    currentStepIndex: 3
  },
  {
    id: 'TRK-260721-02',
    orderId: 'ORD-20260721-02',
    driverName: 'Slamet Riyadi',
    vehicleNo: 'N 9401 U (Reefer Truck 2)',
    departureTime: '2026-07-21 04:45',
    status: 'Dalam Perjalanan',
    currentTemp: 3.1,
    tempHistory: [
      { time: '04:45', temp: 2.5 },
      { time: '05:00', temp: 2.7 },
      { time: '05:15', temp: 3.0 },
      { time: '05:30', temp: 3.1 }
    ],
    routeCoordinates: [
      { lat: -7.8923, lng: 112.6512 }, // Factory
      { lat: -7.9100, lng: 112.6480 },
      { lat: -7.9300, lng: 112.6350 },
      { lat: -7.9550, lng: 112.6280 }  // Klojen Malang
    ],
    currentStepIndex: 3
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-260719-01',
    mitraId: 'mitra-03',
    mitraName: 'SPPG Karangploso Madani',
    type: 'Kemasan Rusak',
    description: 'Ditemukan 3 cup penyok di pojok kardus nomor 4 saat proses unloading harian.',
    date: '2026-07-19',
    status: 'Selesai',
    severity: 'Rendah',
    resolution: 'QC pabrik telah menyetujui penggantian 3 cup baru secara gratis, dikirimkan bersama kloter pengiriman berikutnya tanggal 20 Juli.'
  },
  {
    id: 'TCK-260721-01',
    mitraId: 'mitra-02',
    mitraName: 'SPPG Lawang Utara',
    type: 'Suhu Rantai Dingin Naik',
    description: 'Suhu saat unloading sempat terbaca 5.5°C (diatas batas ideal 4°C). Mohon evaluasi kompartemen reefer truck driver.',
    date: '2026-07-21',
    status: 'Diproses QC',
    severity: 'Sedang'
  }
];

export const INITIAL_PROMOS: Promo[] = [
  {
    id: 'promo-01',
    title: 'AMBIL PROMO GRATIS FREEZER UNTUK SPPG',
    description: 'Dapatkan kemudahan suplai susu berkualitas untuk SPPG Anda dengan fasilitas Freezer Box RSA Gratis! Pengiriman langsung dari pabrik, suplai rutin terjadwal, tanpa perlu repot stok & penyimpanan, serta jaminan praktis, higienis, dan tepat waktu.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1200&q=80',
    linkUrl: 'portal',
    buttonText: 'Ambil Promo Sekarang',
    isActive: true
  },
  {
    id: 'promo-02',
    title: 'DAPATKAN FREEZER GRATIS SELAMA BULAN PROMO',
    description: 'Program Ketahanan Gizi Anak Indonesia bersama Susu NATNAT. Dapatkan Freezer Box Gratis untuk setiap dapur SPPG dengan supply susu murni harian berkualitas yang higienis, steril, dan sangat disukai anak-anak.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
    linkUrl: 'kontak',
    buttonText: 'Daftar Dapur SPPG',
    isActive: true
  },
  {
    id: 'promo-03',
    title: 'KAMPANYE GIZI NASIONAL: MENU MBG LENGKAP DENGAN SUSU',
    description: 'Mengandung kalsium tinggi, protein alami, dan tanpa bahan pengawet buatan. Simak tayangan edukatif mengenai alur rantai dingin (cold chain) NatNat Fresh Milk dari peternakan hingga meja konsumsi.',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    linkUrl: 'katalog',
    buttonText: 'Lihat Brosur Edukasi',
    isActive: true
  }
];

