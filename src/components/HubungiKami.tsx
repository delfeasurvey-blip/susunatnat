import React, { useState, useEffect } from 'react';
import { Ticket, MitraSPPG } from '../types';
import { Phone, Mail, MapPin, Send, AlertTriangle, MessageSquare, History, Check, Clock, ExternalLink } from 'lucide-react';
import { formatWhatsAppUrl } from '../utils';

interface HubungiKamiProps {
  mitraList: MitraSPPG[];
  ticketsList: Ticket[];
  setTicketsList: React.Dispatch<React.SetStateAction<Ticket[]>>;
  landingSettings?: any;
}

export default function HubungiKami({ mitraList, ticketsList, setTicketsList, landingSettings }: HubungiKamiProps) {
  const [mitraId, setMitraId] = useState(() => mitraList[0]?.id || 'mitra-01');
  const [type, setType] = useState<'Kemasan Rusak' | 'Rasa Masam / Basi' | 'Suhu Rantai Dingin Naik' | 'Keterlambatan' | 'Lainnya'>('Kemasan Rusak');
  const [severity, setSeverity] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'>('Sedang');
  const [description, setDescription] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const whatsappNum = landingSettings?.whatsappNumber || '0812-1768-7815';

  // Keep selected ID valid if list changes
  useEffect(() => {
    if (mitraList.length > 0 && !mitraList.find(m => m.id === mitraId)) {
      setMitraId(mitraList[0].id);
    }
  }, [mitraList, mitraId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Mohon masukkan rincian kendala pengaduan!');
      return;
    }

    const selectedMitra = mitraList.find(m => m.id === mitraId);

    const newTicket: Ticket = {
      id: `TCK-${new Date().toISOString().slice(2,10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      mitraId,
      mitraName: selectedMitra ? selectedMitra.name : 'Mitra Umum',
      type,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'Baru',
      severity
    };

    const updated = [newTicket, ...ticketsList];
    localStorage.setItem('natnat_tickets', JSON.stringify(updated));
    setTicketsList(updated);
    
    // Reset form
    setDescription('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Kontak & Bantuan QC
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          Pusat Bantuan & Layanan Pengaduan Cepat
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Ada kendala pengiriman atau penurunan suhu cold-chain? Laporkan segera ke tim Penjaminan Mutu (Quality Control) kami. Kami menanggapi tiket aduan gizi kurang dari 15 menit.
        </p>
      </section>

      {/* Grid: Left - Contact Details, Right - Complaint Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Column: Factory coordinates & hotlines */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-sans font-black text-lg text-slate-800">Kontak Koordinasi SPPG</h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Gunakan saluran berikut untuk koordinasi pengiriman mendesak, perubahan kuota harian penerima manfaat MBG, atau pengajuan klaim promo freezer harian.
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-all">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>WhatsApp / Telepon Hotline</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Online</span>
                  </h4>
                  <a
                    href={formatWhatsAppUrl(whatsappNum, 'Halo Admin NatNat Fresh Milk, saya ingin berkoordinasi seputar program SPPG...')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-mono font-bold text-sm hover:underline mt-0.5 flex items-center space-x-1"
                  >
                    <span>{whatsappNum}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                  <span className="text-[10px] text-slate-500 block italic mt-0.5">Klik nomor di atas untuk langsung terhubung via WhatsApp</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Email Korespondensi Resmi</h4>
                  <p className="text-slate-600 font-mono mt-0.5">natnatfreshmilk@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Lokasi Kantor & Pabrik Produksi</h4>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    <strong>PT Satriyo Abimanyu Prabangkara</strong><br />
                    Perum New Watugede Kav. 12 B RT/RW 001/004 Singosari, Kabupaten Malang, Jawa Timur, 65153
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Help Desk notice */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start space-x-3 text-xs text-sky-800">
            <MessageSquare className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>Komitmen Pelayanan</strong>
              <p className="text-sky-700/90 mt-0.5">
                Filosofi kami: **"Urusan Susu? Serahkan Pada Kami!"**. Setiap komplain mengenai keaslian rasa atau kerusakan kemasan akan diganti 100% baru gratis.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Rapid Response Ticket Form */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500 text-white shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-black text-lg text-slate-800">Modul Pengaduan Cepat QC (Rapid Ticket)</h2>
              <p className="text-xs text-slate-400">Saluran pelaporan kendala kualitas langsung terhubung ke Lab QC Pabrik</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Dapur SPPG / Unit Anda</label>
                <select
                  value={mitraId}
                  onChange={(e) => setMitraId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50 bg-white"
                >
                  {mitraList.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Jenis Kendala Kualitas</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50 bg-white"
                >
                  <option value="Kemasan Rusak">Kemasan Pecah / Bocor</option>
                  <option value="Rasa Masam / Basi">Rasa Masam / Basi (Rusak Asam)</option>
                  <option value="Suhu Rantai Dingin Naik">Suhu Logistik Naik (&gt; 4°C)</option>
                  <option value="Keterlambatan">Keterlambatan Armada Delivery</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Tingkat Keparahan / Urgensi</label>
              <div className="flex gap-2">
                {(['Rendah', 'Sedang', 'Tinggi', 'Kritis'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      severity === sev
                        ? sev === 'Rendah' ? 'bg-green-100 border-green-300 text-green-700' :
                          sev === 'Sedang' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                          sev === 'Tinggi' ? 'bg-orange-100 border-orange-300 text-orange-700' :
                          'bg-red-100 border-red-300 text-red-700 font-bold animate-pulse'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Rincian Kendala & No. Batch (jika ada)</label>
              <textarea
                rows={3}
                placeholder="Contoh: Ditemukan susu berbau tidak sedap pada kardus batch B-260721-A sebanyak 2 cup saat diturunkan dari reefer truck driver Slamet."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50 bg-white text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Kirim Laporan Pengaduan</span>
            </button>

            {isSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center space-x-1.5 animate-bounce">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Laporan Berhasil Terkirim! QC Supervisor akan segera mengevaluasi pengiriman Anda.</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Live Ticket History Display */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="font-sans font-black text-lg text-slate-800">Status Tiket Pengaduan Terkini</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ticketsList.length === 0 ? (
            <p className="text-xs text-slate-400 italic col-span-2">Belum ada tiket pengaduan terdaftar harian.</p>
          ) : (
            ticketsList.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">ID TIKET: {t.id}</span>
                    <strong className="text-slate-800">{t.mitraName}</strong>
                  </div>
                  <div className="flex space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.severity === 'Rendah' ? 'bg-green-50 text-green-600' :
                      t.severity === 'Sedang' ? 'bg-yellow-50 text-yellow-600' :
                      t.severity === 'Tinggi' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {t.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.status === 'Baru' ? 'bg-blue-50 text-blue-600' :
                      t.status === 'Diproses QC' ? 'bg-amber-50 text-amber-600' :
                      t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 border-l-2 border-slate-200 pl-3 italic">
                  <strong>Kendala: {t.type}</strong><br />
                  "{t.description}"
                </div>

                {t.resolution ? (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-800">
                    <span className="font-bold text-[10px] uppercase block text-emerald-600">Resolusi Tim QC:</span>
                    <p className="mt-0.5 text-slate-600">{t.resolution}</p>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Menunggu verifikasi lapangan tim Quality Control pabrik.</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
