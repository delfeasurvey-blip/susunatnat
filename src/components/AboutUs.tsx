import React from 'react';
import { Award, ShieldCheck, HeartPulse, Sparkles, Star, Target, Factory, CheckCircle2 } from 'lucide-react';

interface AboutUsProps {
  aboutSettings?: any;
}

export default function AboutUs({ aboutSettings }: AboutUsProps) {
  const settings = aboutSettings || {
    profilTitle: 'PT Satriyo Abimanyu Prabangkara',
    profilDesc: 'Kami adalah industri pengolahan susu pasteurisasi modern yang berkedudukan di Singosari, Malang, Jawa Timur. Didirikan dengan komitmen kuat untuk memajukan peternakan lokal Jawa Timur dan menyuplai kebutuhan pangan bergizi tinggi berskala nasional.',
    capacityTitle: 'Kapasitas Produksi Harian',
    capacityValue: '15.000+ Cup / Hari',
    capacityDesc: 'Fasilitas pasteurisasi kontinu modern berskala industri kecil-menengah siap mendukung pemenuhan gizi massal.',
    hygieneValue: 'HACCP & GMP Compliant',
    sourcingValue: '100% Sapi Perah Malang',
    visiTitle: 'Visi Khusus Program Gizi',
    visiDesc: 'Menjadi pilar penyuplai utama susu pasteurisasi berkualitas terbaik yang terpercaya dan terintegrasi di Indonesia, guna mewujudkan generasi masa depan yang bebas stunting, sehat, cerdas, dan tangguh menyongsong Indonesia Emas 2045.',
    misiList: [
      'Mempertahankan kemurnian 100% susu sapi murni tanpa penambahan air atau zat pengental.',
      'Menjaga suhu rantai dingin (cold chain) stabil dibawah 4°C dari pemelukan sapi hingga meja konsumsi.',
      'Menerapkan digitalisasi logistik transparan untuk mendeteksi dini setiap kendala kualitas.',
      'Meringankan beban dapur SPPG dengan komitmen servis prima "Urusan Susu? Serahkan Pada Kami!"'
    ]
  };

  return (
    <div id="about-us-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      {/* Intro Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Profil Produsen & Legalitas Resmi
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          {settings.profilTitle}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {settings.profilDesc}
        </p>
      </section>

      {/* Visual Stats Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Factory className="w-8 h-8 text-sky-500" />,
            title: settings.capacityTitle || 'Kapasitas Produksi Harian',
            value: settings.capacityValue || '15.000+ Cup / Hari',
            desc: settings.capacityDesc || 'Fasilitas pasteurisasi kontinu modern berskala industri kecil-menengah siap mendukung pemenuhan gizi massal.'
          },
          {
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            title: 'Standar Kebersihan Pabrik',
            value: settings.hygieneValue || 'HACCP & GMP Compliant',
            desc: 'Penerapan sanitasi ruangan dan sterilisasi alat secara otomatis berbasis Clean-In-Place (CIP).'
          },
          {
            icon: <HeartPulse className="w-8 h-8 text-emerald-500" />,
            title: 'Sumber Bahan Baku',
            value: settings.sourcingValue || '100% Sapi Perah Malang',
            desc: 'Diserap segar setiap pagi dari koperasi peternak lereng Gunung Arjuno demi menjamin kualitas tertinggi.'
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-4">{stat.icon}</div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{stat.title}</h3>
            <span className="text-xl font-black text-sky-600 block mb-2">{stat.value}</span>
            <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </section>

      {/* Visi & Misi */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100/50 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-black text-2xl text-slate-800">{settings.visiTitle}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.visiDesc}
            </p>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white border border-sky-100/80 text-xs text-sky-700 italic">
            "Kami mengedepankan kualitas nutrisi murni tanpa bahan pengawet sintesis demi kelangsungan tumbuh kembang optimal anak didik."
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-black text-2xl text-slate-800">Misi Layanan Terintegrasi</h2>
            <ul className="space-y-3">
              {(settings.misiList || []).map((misi: string, index: number) => (
                <li key={index} className="flex items-start space-x-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{misi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certifications and BPOM / Halal Showcase */}
      <section className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Jaminan Standardisasi</span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-800">Sertifikasi & Kepatuhan Regulasi</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Seluruh produk NatNat Fresh Milk telah melewati proses verifikasi ketat dari instansi berwenang Republik Indonesia. Legalitas usaha kami terbuka untuk diaudit demi menjaga akuntabilitas keuangan dan operasional program MBG.
            </p>
            <div className="flex flex-col space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>**Izin Usaha Terdaftar**: Perizinan Berusaha Berbasis Risiko</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>**Sertifikasi Halal**: Badan Penyelenggara Jaminan Produk Halal (BPJPH)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                BPJPH INDONESIA
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Sertifikat Halal Resmi</h3>
              <p className="text-xs text-slate-500 font-mono">No ID: ID35110000214820323</p>
              <p className="text-xs text-slate-400">
                Menjamin kehalalan mutlak mulai dari pakan ternak sapi, penanganan pemerahan, hingga bahan pendukung sanitasi pengolahan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                BADAN POM RI
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Izin Edar Pangan Olahan</h3>
              <p className="text-xs text-slate-500 font-mono">No MD: 241031001099</p>
              <p className="text-xs text-slate-400">
                Melalui pengawasan kelayakan pangan Badan Pengawas Obat dan Makanan guna menjamin keamanan konsumsi harian massal anak-anak.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 shadow-sm hover:-translate-y-1 transition-transform sm:col-span-2">
              <div className="inline-block px-2.5 py-1 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">
                MUTU ISO 22000
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Sistem Manajemen Keamanan Pangan (Food Safety Management)</h3>
              <p className="text-xs text-slate-500">
                Pabrik kami mengadopsi standar internasional penjaminan mutu alur proses produksi guna mencegah kontaminasi fisik, kimia, ataupun biologis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
