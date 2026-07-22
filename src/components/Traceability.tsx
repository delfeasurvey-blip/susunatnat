import React, { useState } from 'react';
import { Compass, ShieldCheck, ThermometerSnowflake, FileText, MapPin, Truck, Check, Factory, Search, Layers, ClipboardCheck } from 'lucide-react';
import { LabReport, MitraSPPG } from '../types';

interface TraceabilityProps {
  labReports: LabReport[];
  mitraList: MitraSPPG[];
}

export default function Traceability({ labReports, mitraList }: TraceabilityProps) {
  const [searchBatch, setSearchBatch] = useState('B-260721-A');
  const [selectedBatch, setSelectedBatch] = useState<LabReport | null>(() => labReports[0] || null);
  const [showResult, setShowResult] = useState(true);

  // Sync selectedBatch if the list of reports changes or on initialization
  React.useEffect(() => {
    if (labReports.length > 0 && (!selectedBatch || !labReports.find(r => r.id === selectedBatch.id))) {
      setSelectedBatch(labReports[0]);
    }
  }, [labReports, selectedBatch]);

  const handleSearch = (batchNo: string) => {
    const report = labReports.find(r => r.batchNo.toLowerCase() === batchNo.trim().toLowerCase());
    if (report) {
      setSelectedBatch(report);
      setShowResult(true);
    } else {
      alert(`Batch tidak ditemukan! Silakan masukkan nomor batch yang valid seperti: ${labReports.map(r => r.batchNo).slice(0, 3).join(', ')}`);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Pemerahan & Sourcing Peternak',
      desc: 'Susu murni diperas dari sapi laktasi unggulan di kelompok tani Watugede, Singosari. Diuji keasliannya (BJ, uji alkohol negatif).',
      source: 'Koperasi Susu Mitra Watugede',
      temp: '3.8°C',
      icon: <Compass className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Pengolahan Pabrik PT. SABP',
      desc: 'Susu dikirim via tangki insulated, disaring ganda, lalu dipasteurisasi (72°C selama 15 detik) untuk mengeliminasi bakteri patogen tanpa merusak gizi alami.',
      source: 'Lini Produksi 2 Singosari',
      temp: '72°C / 4°C',
      icon: <Factory className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Uji Lab & Sertifikasi Batch',
      desc: `Pengambilan sampel acak per batch untuk uji hitung bakteri (SPC), kadar protein lemak murni, serta organoleptik lengkap sebelum dikemas.`,
      source: `Supervisor QC: ${selectedBatch?.certifiedBy || 'Hendra M.Si'}`,
      temp: 'Lulus Uji',
      icon: <ClipboardCheck className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Distribusi Armada Cold Chain',
      desc: 'Susu dikemas dalam cup steril dan dimuat langsung ke Reefer Truck (truk pendingin) untuk menjaga kualitas tetap segar.',
      source: 'Reefer Fleet PT. SABP',
      temp: '2.5°C - 3.5°C',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Serah Terima di SPPG',
      desc: 'Susu diturunkan langsung ke Freezer Box RSA di dapur SPPG. Berita Acara Serah Terima (BAST) ditandatangani digital oleh Koordinator Gizi.',
      source: 'Dapur SPPG Gizi Kab. Malang',
      temp: '3.0°C',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <div id="traceability-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      
      {/* Introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Transparansi & Rantai Pasok
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          Traceability: Lacak Keaslian Susu Dari Peternak ke Sekolah
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kami memelopori transparansi rantai pasok susu untuk program Makan Bergizi Gratis (MBG). Melalui nomor Batch yang tertera di tutup Cup Susu, siapa saja dapat melacak alur kebersihan, asal-usul peternak, hingga hasil uji laboratorium resmi.
        </p>
      </section>

      {/* Batch Tracker Search Cockpit */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-bl-full -z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-900/50">
              <Layers className="w-3.5 h-3.5" />
              <span>Sistem Keterunutan Pangan (Food Trace)</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Pencarian Batch Produksi</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Masukkan kode Batch Produksi yang tercetak pada kemasan cup susu Anda untuk melacak sertifikasi analisis kimia dan kebersihan mikrobiologi.
            </p>

            {/* Quick selectors for simulator */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Klik Batch Simulasi Berikut:</span>
              <div className="flex flex-wrap gap-2">
                {labReports.map(rep => (
                  <button
                    key={rep.id}
                    onClick={() => {
                      setSearchBatch(rep.batchNo);
                      setSelectedBatch(rep);
                      setShowResult(true);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedBatch && selectedBatch.batchNo === rep.batchNo
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {rep.batchNo}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual input */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Contoh: B-260721-A"
                  value={searchBatch}
                  onChange={(e) => setSearchBatch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 text-white"
                />
              </div>
              <button
                onClick={() => handleSearch(searchBatch)}
                className="bg-sky-500 hover:bg-sky-600 px-5 py-3 rounded-xl text-xs font-bold transition-all"
              >
                Lacak
              </button>
            </div>
          </div>

          {/* Results Sheet inside the cockpit */}
          {showResult && selectedBatch && (
            <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono">Hasil Lacak Keterunutan</span>
                  <h3 className="font-mono font-bold text-base text-sky-400">{selectedBatch.batchNo}</h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {selectedBatch.status}
                </span>
              </div>

              {/* Lab reports summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase">Tanggal Uji</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">{selectedBatch.testDate}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase">Kandungan Lemak</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">{selectedBatch.fatContent}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase">Kandungan Protein</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">{selectedBatch.proteinContent}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase">Uji Mikrobiologi</span>
                  <span className="font-semibold text-emerald-400 block mt-0.5">{selectedBatch.bacteriaCount}</span>
                </div>
              </div>

              {/* Lab Certification Signature */}
              <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-xl text-xs text-slate-300">
                <FileText className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="block text-[9px] text-slate-400">Verifikator Laboratorium PT SABP:</span>
                  <strong className="text-white">{selectedBatch.certifiedBy}</strong>
                </div>
              </div>

              {/* Traceability map quick snippet */}
              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                📌 **Keterangan Sourcing**: Batch ini diproduksi menggunakan bahan baku dari koperasi sapi perah **KAN Jabung & Mitra Peternak Watugede Singosari** yang diserap pada tanggal {(new Date(new Date(selectedBatch.testDate).getTime() - 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visual Timeline / Steps Map */}
      <section className="space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-sans font-black text-2xl text-slate-800">Visualisasi Rantai Higienitas</h2>
          <p className="text-xs text-slate-500">
            Berikut adalah peta perjalanan susu semenjak diperas dari sapi mitra binaan hingga disajikan di Dapur SPPG.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative max-w-4xl mx-auto pl-4 sm:pl-0">
          {/* Vertical axis line */}
          <div className="absolute left-8 top-4 bottom-4 w-1 bg-sky-100 hidden sm:block sm:left-1/2 sm:-ml-0.5"></div>

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col sm:flex-row items-start sm:items-center">
                
                {/* Odd/Even direction alignment */}
                <div className={`w-full sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:order-2 sm:pl-12'}`}>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-[10px] font-mono text-sky-600 font-bold bg-sky-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                      Fase {step.id}: {step.temp}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 sm:justify-start">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="font-medium italic">{step.source}</span>
                    </div>
                  </div>
                </div>

                {/* Bullet node centered */}
                <div className="absolute left-0 sm:left-1/2 top-4 sm:top-1/2 -mt-4 sm:-ml-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md ring-4 ring-sky-50">
                    {step.icon}
                  </div>
                </div>

                {/* Empty placeholder column for Desktop symmetry */}
                <div className="hidden sm:block sm:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QC & Assurance Standards Summary */}
      <section className="bg-sky-50/50 rounded-3xl p-6 sm:p-8 border border-sky-100 text-center space-y-4">
        <h3 className="font-bold text-slate-800 text-base flex items-center justify-center space-x-2">
          <ThermometerSnowflake className="w-5 h-5 text-sky-500" />
          <span>Pengawasan Suhu Rantai Dingin (Cold Chain Assurance)</span>
        </h3>
        <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Suhu penyimpanan susu pasteurisasi segar wajib berada di rentang **0°C s.d 4°C** sepanjang jalur. Pengawasan suhu terpantau ketat secara digital menggunakan sensor terhubung. Jika terdeteksi anomali suhu diatas standar selama distribusi, sistem penanganan QC akan otomatis memberikan peringatan.
        </p>
      </section>
    </div>
  );
}
