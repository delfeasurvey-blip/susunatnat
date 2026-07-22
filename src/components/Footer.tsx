import React from 'react';
import { Milk, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import logoImg from '../assets/images/logo_1784628827555.jpg';
import { formatWhatsAppUrl } from '../utils';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  landingSettings?: any;
}

export default function Footer({ setActiveTab, landingSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const whatsappNum = landingSettings?.whatsappNumber || '0812-1768-7815';

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div 
              className="cursor-pointer inline-block"
              onClick={() => setActiveTab('beranda')}
            >
              <img 
                src={logoImg} 
                alt="NatNat Fresh Milk" 
                className="h-14 w-auto object-contain bg-white p-1 rounded-xl shadow-md border border-slate-700/30 hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Produk susu pasteurisasi berkualitas tinggi produksi **PT Satriyo Abimanyu Prabangkara** untuk mendukung program ketahanan pangan nasional dan pengentasan stunting melalui Makan Bergizi Gratis (MBG).
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-sky-400 bg-sky-950/40 border border-sky-900/50 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Mitra Resmi Pemenuhan Gizi SPPG Kabupaten Malang</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi Halaman</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'beranda', label: 'Beranda Utama' },
                { id: 'tentang', label: 'Profil & Komitmen' },
                { id: 'katalog', label: 'Katalog Gizi Susu' },
                { id: 'lacak', label: 'Traceability & Sourcing' },
                { id: 'edukasi', label: 'Artikel & Panduan' },
                { id: 'kontak', label: 'Layanan Pengaduan' },
                { id: 'admin', label: '🔑 Otorisasi Admin CMS' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className="text-slate-400 hover:text-sky-400 text-xs transition-colors duration-200 block py-1"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hubungi Kami</h3>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>PT Satriyo Abimanyu Prabangkara</strong><br />
                  Perum New Watugede Kav. 12 B RT/RW 001/004 Singosari,<br />
                  Kabupaten Malang, Jawa Timur, Indonesia 65153
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={formatWhatsAppUrl(whatsappNum, 'Halo Admin NatNat Fresh Milk, saya ingin menghubungi Anda dari Footer Website...')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors font-medium flex items-center space-x-1"
                >
                  <span>{whatsappNum}</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">WA</span>
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>natnatfreshmilk@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Legal Certification Badge */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Sertifikasi Legalitas</h3>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex flex-col justify-center">
                <span className="text-emerald-400 font-bold uppercase block text-[11px]">Halal Indonesia</span>
                <span>ID35110000214820323</span>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex flex-col justify-center">
                <span className="text-blue-400 font-bold uppercase block text-[11px]">BPOM MD RI</span>
                <span>Lolos Izin Edar Pangan</span>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 col-span-2 text-center">
                <span className="text-sky-400 font-semibold block text-[10px]">Filosofi Layanan SPPG:</span>
                <span className="italic text-slate-300">"Urusan Susu? Serahkan Pada Kami!"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} NatNat Fresh Milk - PT Satriyo Abimanyu Prabangkara. Semua Hak Dilindungi.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            <span>Mendukung Masa Depan Indonesia Emas 2045</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 ml-1.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
