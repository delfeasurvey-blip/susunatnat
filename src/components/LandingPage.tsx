import React, { useState, useEffect } from 'react';
import { Milk, Award, ShieldCheck, ThermometerSnowflake, Users, ChevronRight, TrendingUp, Sparkles, AlertCircle, HelpCircle, ExternalLink, Play, Film, Image as ImageIcon, Check, Download, Printer, Heart, Info, X, Eye, ZoomIn, Maximize2, PhoneCall } from 'lucide-react';
import { Promo } from '../types';
import { formatWhatsAppUrl } from '../utils';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  openPortal: () => void;
  landingSettings: any;
  promos?: Promo[];
}

export default function LandingPage({ setActiveTab, openPortal, landingSettings, promos = [] }: LandingPageProps) {
  const [liveCounter, setLiveCounter] = useState(345210);
  const [activeMediaIndex, setActiveMediaIndex] = useState<{ [key: string]: boolean }>({});
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Safe fallbacks for config
  const settings = landingSettings || {
    heroTitle: 'Susu Pasteurisasi Segar & Higienis untuk Anak Bangsa',
    heroSubtitle: 'Kami memahami pentingnya gizi seimbang harian anak sekolah. Melalui filosofi layanan "Urusan Susu? Serahkan Pada Kami!", NatNat Fresh Milk siap menyuplai kebutuhan dapur SPPG dengan standar rantai dingin terjamin.',
    campaignTitle: 'Kampanye Gizi Nasional:',
    campaignSlogan: '"Menu MBG Belum Lengkap Tanpa Susu!"',
    campaignDesc: 'Mengandung Kalsium Tinggi, Protein Alami, dan Tanpa Bahan Pengawet Buatan.',
    mitraCount: '52 Dapur',
    peternakCount: '150+ Mitra',
    freezerTitle: 'Klaim Freezer Box RSA Gratis untuk Dapur Anda!',
    freezerDesc: 'Dapatkan fasilitas Freezer Box RSA Gratis sebagai media penyimpanan susu dingin agar senantiasa steril di titik SPPG. Cukup dengan mendaftar kemitraan suplai rutin, Freezer akan menjadi hak milik penuh dapur gizi setelah memenuhi kuota distribusi.',
    whatsappNumber: '0812-1768-7815'
  };

  const whatsappNum = settings.whatsappNumber || '0812-1768-7815';

  // Simulate slowly increasing milk cup count to show real-time distribution
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="landing-page" className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-sky-100/40 py-16 lg:py-24">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-500" />
                <span>Mendukung Program Makan Bergizi Gratis (MBG)</span>
              </div>

              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-slate-800 tracking-tight leading-none">
                {settings.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-sans max-w-2xl leading-relaxed">
                {settings.heroSubtitle}
              </p>

              {/* MBG Banner Slogan */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 max-w-xl">
                <div className="flex items-center justify-center p-2.5 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{settings.campaignTitle}</h4>
                  <p className="text-xs text-slate-500 font-medium italic">{settings.campaignSlogan}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{settings.campaignDesc}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={openPortal}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Akses Portal SPPG</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('katalog')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm tracking-wide border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Tabel Nutrisi & Katalog</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Mini-Dashboard Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
                {/* Accent design */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-bl-full -z-10"></div>
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Status Pasokan MBG</h3>
                    <p className="text-xs text-slate-400 font-mono">Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>

                {/* Real-time counters list */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Total Susu Terdistribusi</span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-black text-slate-800 tracking-tight">{liveCounter.toLocaleString('id-ID')}</span>
                      <span className="text-xs text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-full flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        Live Cup
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kemitraan SPPG</span>
                      <span className="text-lg font-extrabold text-slate-800 mt-0.5 block">{settings.mitraCount}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peternak Lokal</span>
                      <span className="text-lg font-extrabold text-slate-800 mt-0.5 block">{settings.peternakCount}</span>
                    </div>
                  </div>

                  {/* Operational Quality metrics snippet */}
                  <div className="bg-sky-50/50 border border-sky-100/80 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Suhu Cold Chain Rata-Rata</span>
                      <span className="text-sky-700 font-bold font-mono">2.9°C (Optimal)</span>
                    </div>
                    <div className="w-full bg-sky-200/50 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full w-[85%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min 2.0°C</span>
                      <span>Target Ideal 2-4°C</span>
                      <span>Max 4.0°C</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setActiveTab('lacak')}
                    className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center hover:underline"
                  >
                    Lacak Alur Pengiriman & Cold-Chain &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Promos Section */}
      <section id="promo-section" className="py-16 bg-slate-100/50 border-t border-b border-slate-200/40 relative scroll-mt-24">
        <div className="absolute top-12 left-10 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
                <span>PROGRAM PROMO NATNAT FRESH MILK</span>
              </span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Penawaran Khusus & Kampanye Gizi
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl">
                Kami berkomitmen penuh mempermudah operasional dapur SPPG melalui program freezer gratis, promo kemitraan berkala, dan video tutorial edukatif.
              </p>
            </div>
            {/* Quick action button to contact us if they want specific custom offers */}
            <button
              onClick={() => setActiveTab('kontak')}
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm hover:border-slate-300 transition-all flex items-center space-x-1.5 self-start md:self-end"
            >
              <span>Tanyakan Penawaran Khusus</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {promos && promos.filter(p => p.isActive).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promos
                .filter(p => p.isActive)
                .map((promo) => {
                  // Helper to trigger action link (external vs internal tab)
                  const handlePromoAction = (linkUrl?: string) => {
                    if (!linkUrl) return;
                    if (linkUrl.startsWith('http') || linkUrl.includes('.') || linkUrl.startsWith('www')) {
                      let formattedUrl = linkUrl;
                      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
                        formattedUrl = 'https://' + linkUrl;
                      }
                      window.open(formattedUrl, '_blank');
                    } else {
                      setActiveTab(linkUrl);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  };

                  // Helper to parse external videos (youtube, tiktok, instagram, facebook, etc.)
                  const renderPromoVideo = (url: string) => {
                    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
                    const isDirectVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

                    if (isYoutube) {
                      let embedUrl = url;
                      try {
                        if (url.includes('watch?v=')) {
                          const videoId = url.split('watch?v=')[1]?.split('&')[0];
                          embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        } else if (url.includes('youtu.be/')) {
                          const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                          embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        } else if (url.includes('embed/')) {
                          embedUrl = url;
                        }
                      } catch (e) {
                        console.error("Error parsing YouTube URL", e);
                      }

                      return (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-black">
                          <iframe
                            src={embedUrl}
                            title="Video Promo Youtube"
                            className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }

                    if (isDirectVideo) {
                      return (
                        <video 
                          src={url} 
                          controls 
                          className="w-full aspect-video rounded-2xl object-cover shadow-md bg-slate-950" 
                        />
                      );
                    }

                    // Determine platform logo / icon for external social videos (Instagram, TikTok, Facebook)
                    let platformLabel = "Video External";
                    let platformDesc = "Saksikan video selengkapnya di media sosial";
                    let badgeColor = "bg-rose-500 text-white";

                    if (url.includes('tiktok.com')) {
                      platformLabel = "TikTok Video";
                      platformDesc = "Buka aplikasi TikTok untuk menyaksikan video interaktif";
                      badgeColor = "bg-slate-900 text-white border border-slate-700";
                    } else if (url.includes('instagram.com')) {
                      platformLabel = "Instagram Reels";
                      platformDesc = "Kunjungi halaman Instagram kami untuk konten promosi lengkap";
                      badgeColor = "bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white";
                    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
                      platformLabel = "Facebook Video";
                      platformDesc = "Saksikan siaran video dokumentasi langsung di Facebook";
                      badgeColor = "bg-blue-600 text-white";
                    }

                    return (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 text-center border border-slate-100 shadow-lg group">
                        <div className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80')` }}></div>
                        <div className="absolute inset-0 bg-slate-950/80"></div>
                        <div className="relative z-10 space-y-4 max-w-sm px-4">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                            <Film className="w-3 h-3" />
                            <span>{platformLabel}</span>
                          </span>
                          <p className="text-sm font-semibold text-white leading-snug">{platformDesc}</p>
                          <p className="text-[10px] text-slate-400 font-mono break-all line-clamp-1">{url}</p>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-xl"
                          >
                            <Play className="w-3.5 h-3.5 text-sky-500 fill-current" />
                            <span>Tonton Video</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div
                      key={promo.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedPromo(promo)}
                    >
                      {/* Media Display Container */}
                      <div className="relative overflow-hidden bg-slate-900 shrink-0">
                        {promo.mediaType === 'image' ? (
                          <div className="relative w-full aspect-video">
                            <img
                              src={promo.mediaUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'}
                              alt={promo.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            {/* Hover zoom overlay */}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-1.5 backdrop-blur-[1px]">
                              <div className="px-3.5 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-md flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <Eye className="w-3.5 h-3.5 text-sky-500" />
                                <span>Perbesar & Baca Flyer</span>
                              </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm shadow-sm text-[10px] text-sky-700 font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                              <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                              <span>Flyer Gizi</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full aspect-video relative" onClick={(e) => e.stopPropagation()}>
                            {renderPromoVideo(promo.mediaUrl)}
                          </div>
                        )}
                      </div>

                      {/* Content Detail */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-sans font-black text-slate-800 text-lg group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight">
                            {promo.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                            {promo.description}
                          </p>
                        </div>

                        {/* Interactive Button */}
                        {promo.linkUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromoAction(promo.linkUrl);
                            }}
                            className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-100 hover:border-sky-200 font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-1.5"
                          >
                            <span>{promo.buttonText || 'Pelajari Lebih Lanjut'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center bg-white border border-slate-200 rounded-2xl py-12 px-6 space-y-4 max-w-md mx-auto shadow-sm">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 text-base">Tidak ada Promo Aktif</h4>
                <p className="text-xs text-slate-500">
                  Saat ini tidak ada promo aktif yang ditampilkan di halaman depan.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition-colors"
              >
                Atur Promo di CMS Admin
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Special Promo Highlight Box: Freezer RSA */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl shadow-xl overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold uppercase tracking-widest">
                  PROMO KHUSUS SPPG BARU
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  {settings.freezerTitle}
                </h2>
                <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-xl">
                  {settings.freezerDesc}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</div>
                    <span>Dukungan Kapasitas Besar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</div>
                    <span>Garansi Suhu Stabil &lt; 4°C</span>
                  </div>
                </div>
              </div>

              {/* Progress & Info Box */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
                <h4 className="font-bold text-center border-b border-white/10 pb-2">Skema & Syarat Kepemilikan</h4>
                <ul className="space-y-2 text-xs text-sky-50">
                  <li className="flex items-start space-x-2">
                    <span className="font-bold text-yellow-300">1.</span>
                    <span>Pengiriman rutin sesuai jadwal kebutuhan harian dapur SPPG.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold text-yellow-300">2.</span>
                    <span>Dalam 6 bulan minimal tersalurkan 120.000 cup susu NatNat.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold text-yellow-300">3.</span>
                    <span>Fasilitas Freezer otomatis diserahkan sepenuhnya sebagai aset SPPG.</span>
                  </li>
                </ul>

                {/* Simulated Target Progress Tracker */}
                <div className="bg-black/20 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span>Target Kepemilikan</span>
                    <span>120.000 Cup</span>
                  </div>
                  <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[65%]"></div>
                  </div>
                  <p className="text-[10px] text-yellow-200 text-center italic">Rata-rata mitra SPPG mencapai target dalam 4.5 bulan!</p>
                </div>

                <button
                  onClick={() => setActiveTab('kontak')}
                  className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  Ajukan Klaim Freezer Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Service Blocks */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-sans font-black text-3xl text-slate-800">Alur Kerja Suplai Terintegrasi</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Kami mematangkan seluruh rantai produksi dari peternak hingga konsumsi untuk memastikan keamanan pangan tertinggi bagi masa depan anak Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Kemitraan Peternak',
                desc: 'Susu segar diserap setiap hari dari peternak sapi perah binaan di Singosari Malang untuk menjamin keaslian dan kesejahteraan sirkular.',
                color: 'bg-emerald-500'
              },
              {
                step: '02',
                title: 'Pasteurisasi Steril',
                desc: 'Pengolahan higienis di pabrik PT. SABP dengan uji kelayakan laboratorium mikrobiologi dan jaminan halal Indonesia.',
                color: 'bg-sky-500'
              },
              {
                step: '03',
                title: 'Rantai Dingin Fleet',
                desc: 'Distribusi khusus menggunakan armada berpendingin (reefer truck) menjaga temperatur susu tetap stabil di angka 2°C s.d 4°C.',
                color: 'bg-blue-500'
              },
              {
                step: '04',
                title: 'Serah Terima Digital',
                desc: 'Konfirmasi serah terima di titik SPPG berbasis tanda tangan digital (BAST) & penanganan aduan cepat terintegrasi QC.',
                color: 'bg-indigo-500'
              }
            ].map((workflow, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-sky-100 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-mono font-bold text-white px-2.5 py-1 rounded-lg ${workflow.color}`}>
                    Langkah {workflow.step}
                  </span>
                  <Milk className="w-5 h-5 text-slate-300 group-hover:text-sky-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-800 text-md mb-2">{workflow.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{workflow.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Flyer Lightbox Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-4 sm:my-8 flex flex-col border border-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedPromo(null);
                setIsZoomed(false);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg backdrop-blur-sm"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Flyer Graphic or Image/Video (Span 7) */}
              <div className="md:col-span-7 bg-slate-950 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[450px] relative overflow-hidden group">
                
                {/* Perbesar Button Overlay on Media */}
                {selectedPromo.mediaType === 'image' && (
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-3 left-3 z-30 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl shadow-lg border border-white/20 backdrop-blur-sm flex items-center space-x-1.5 transition-all"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Perbesar Fullscreen</span>
                  </button>
                )}

                {selectedPromo.id === 'promo-01' && selectedPromo.mediaUrl.includes('photo-1584269600464-37b1b58a9fe7') ? (
                  /* RENDERING DYNAMIC FLYER 1 EXACTLY LIKE THE USER'S ATTACHED IMAGE 1 */
                  <div className="w-full h-full min-h-[420px] sm:min-h-[480px] bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900 text-white p-4 sm:p-6 flex flex-col justify-between font-sans relative overflow-hidden select-none">
                    {/* Milk Splashes & decorative bg circles */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    
                    {/* Flyer Header */}
                    <div className="relative z-10 flex justify-between items-start border-b border-white/15 pb-3 w-full">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <Milk className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300 animate-bounce" />
                          <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase font-sans">Susu Pasteurisasi</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter text-yellow-300 drop-shadow-md">NatNat <span className="text-white text-xs not-italic font-normal">Fresh Milk</span></h2>
                      </div>
                      
                      {/* Halal and BPOM badging style */}
                      <div className="flex space-x-1.5 sm:space-x-2 text-[8px] font-bold">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-1.5 py-0.5 text-center flex flex-col items-center">
                          <span className="text-emerald-400 font-black">HALAL</span>
                          <span className="text-[6px] text-slate-300">INDONESIA</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-1.5 py-0.5 text-center flex flex-col items-center">
                          <span className="text-sky-300 font-black">BPOM RI</span>
                          <span className="text-[6px] text-slate-300">LULUS UJI</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Slogan & Hero Freezer */}
                    <div className="relative z-10 my-3 sm:my-4 space-y-2 sm:space-y-3 flex-grow flex flex-col justify-center">
                      <div className="space-y-1 transform -rotate-1">
                        <span className="inline-block px-2.5 py-0.5 bg-yellow-400 text-slate-900 text-[10px] sm:text-xs font-black rounded-lg uppercase tracking-widest shadow-md">
                          SPECIAL PROMO SPPG
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-white drop-shadow-lg">
                          AMBIL PROMO <br />
                          <span className="text-yellow-400 text-3xl sm:text-4xl font-extrabold block my-1">GRATIS FREEZER</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs font-bold text-sky-200 uppercase tracking-widest">
                          {selectedPromo.title}
                        </p>
                      </div>

                      {/* Display freezer mockup */}
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center space-x-3 my-1 sm:my-2 shadow-inner">
                        <div className="w-20 h-16 sm:w-24 sm:h-20 bg-slate-200 rounded-lg flex flex-col items-center justify-center border border-slate-300 text-slate-800 text-center font-bold p-1 shrink-0 shadow-md relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-3.5 bg-sky-500 text-white text-[7px] flex items-center justify-center font-sans">RSA FREEZER</div>
                          <ThermometerSnowflake className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 mt-1 sm:mt-2 animate-pulse" />
                          <span className="text-[8px] text-slate-500">NatNat Branded</span>
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="text-[11px] sm:text-xs font-black text-yellow-300">GRATIS UNTUK SPPG</h4>
                          <p className="text-[9px] sm:text-[10px] text-sky-100 leading-snug line-clamp-3">
                            {selectedPromo.description}
                          </p>
                        </div>
                      </div>

                      {/* Flyer bullets */}
                      <div className="space-y-1 text-left bg-black/10 p-2.5 sm:p-3 rounded-xl">
                        <p className="text-[9px] sm:text-[10px] font-black text-sky-300 uppercase tracking-wide">Kemudahan Suplai Susu Berkualitas SPPG Anda:</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] sm:text-[9px] font-bold text-slate-200">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">✓</span>
                            <span>Pengiriman Langsung Pabrik</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">✓</span>
                            <span>Suplai Rutin Sesuai Kebutuhan</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">✓</span>
                            <span>Bebas Repot Penyimpanan</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">✓</span>
                            <span>Praktis, Higienis & Tepat Waktu</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flyer Footer Bar */}
                    <div className="relative z-10 pt-2 sm:pt-3 border-t border-white/10 text-center space-y-1.5">
                      <div className="px-2.5 py-1 bg-rose-600 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white shadow animate-pulse">
                        Ambil Promo Freezer Pendukung Layanan Makan Bergizi Gratis (MBG)
                      </div>
                      
                      <div className="flex justify-between items-center text-[7px] sm:text-[8px] text-sky-200 font-mono w-full">
                        <span>🇮🇩 Dari UMKM Untuk Indonesia</span>
                        <span>Program Gizi Nasional</span>
                      </div>
                    </div>
                  </div>
                ) : (selectedPromo.id === 'promo-02' && selectedPromo.mediaUrl.includes('photo-1550583724-b2692b85b150')) ? (
                  /* RENDERING DYNAMIC FLYER 2 EXACTLY LIKE THE USER'S ATTACHED IMAGE 2 */
                  <div className="w-full h-full min-h-[420px] sm:min-h-[480px] bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700 text-white p-4 sm:p-6 flex flex-col justify-between font-sans relative overflow-hidden select-none">
                    {/* Splash accents */}
                    <div className="absolute top-0 right-0 w-56 h-56 bg-sky-300/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-center border-b border-sky-300/20 pb-2.5 w-full">
                      <div className="flex items-center space-x-1.5">
                        <Milk className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                        <span className="font-black text-[11px] sm:text-xs uppercase tracking-widest text-sky-100">NatNat Fresh Milk</span>
                      </div>
                      <div className="bg-yellow-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded shadow">
                        <span>SUSU PASTEURISASI</span>
                      </div>
                    </div>

                    {/* Main Title */}
                    <div className="relative z-10 text-center my-2 space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] uppercase leading-none">
                        DAPATKAN <br />
                        <span className="text-white text-3xl sm:text-4xl block font-extrabold mt-1">FREEZER GRATIS</span>
                      </h1>
                      <div className="inline-block px-2.5 py-0.5 bg-white text-blue-700 text-[9px] sm:text-[10px] font-black rounded-full shadow-md uppercase tracking-wider">
                        SELAMA BULAN PROMO UNTUK DAPUR SPPG
                      </div>
                    </div>

                    {/* Left sticker & freezer stage */}
                    <div className="relative z-10 my-2 flex items-center justify-between bg-black/15 p-3 sm:p-4 rounded-2xl border border-white/10 w-full">
                      <div className="w-1/2 text-left space-y-1">
                        <div className="inline-flex items-center space-x-1 bg-yellow-400 text-slate-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                          <span>SUPPLY JAMINAN</span>
                        </div>
                        <h4 className="text-[10px] sm:text-xs font-bold leading-tight text-white uppercase">Susu Tiap Minggu Sesuai Kebutuhan SPPG</h4>
                        <p className="text-[8px] sm:text-[9px] text-sky-100 font-medium">
                          {selectedPromo.description}
                        </p>
                      </div>

                      <div className="w-5/12 flex flex-col items-center justify-center relative">
                        <div className="w-16 h-14 sm:w-20 sm:h-16 bg-white rounded-xl border-2 border-yellow-300 flex flex-col items-center justify-center text-slate-800 font-bold p-1 shadow-lg relative transform rotate-2">
                          <ThermometerSnowflake className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
                          <span className="text-[6px] sm:text-[7px] text-slate-500 uppercase mt-0.5">FREEZER MITRA</span>
                        </div>
                      </div>
                    </div>

                    {/* Feature badges */}
                    <div className="relative z-10 grid grid-cols-4 gap-1.5 text-center w-full">
                      {[
                        { icon: "🚚", label: "Kirim Langsung", desc: "Dari Pabrik" },
                        { icon: "⏱️", label: "Praktis & Hemat", desc: "Waktu" },
                        { icon: "🛡️", label: "Kualitas Suhu", desc: "Higienis" },
                        { icon: "👦", label: "Dukung Gizi", desc: "Anak Gizi" }
                      ].map((feat, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-1 flex flex-col items-center justify-center space-y-0.5">
                          <span className="text-xs">{feat.icon}</span>
                          <span className="text-[6px] sm:text-[7px] font-bold leading-none text-yellow-300 uppercase">{feat.label}</span>
                          <span className="text-[5px] sm:text-[6px] leading-none text-slate-300">{feat.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 pt-2 border-t border-sky-300/20 flex flex-col items-center space-y-1 text-center w-full">
                      <div className="px-2.5 py-0.5 bg-rose-600 text-[8px] sm:text-[9px] font-extrabold rounded-full uppercase text-white shadow-md flex items-center space-x-1">
                        <Heart className="w-2.5 h-2.5 text-white fill-current animate-pulse" />
                        <span>Susu Disukai Anak-Anak!</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STANDARD FLYER VIEW FOR UPLOADED IMAGES/VIDEOS */
                  selectedPromo.mediaType === 'image' ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-2 sm:p-4">
                      <img
                        src={selectedPromo.mediaUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80'}
                        alt={selectedPromo.title}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[65vh] sm:max-h-[80vh] object-contain shadow-2xl rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </div>
                  ) : (
                    /* Embedded video player */
                    <div className="w-full aspect-video p-2 sm:p-4 bg-black">
                      {selectedPromo.mediaUrl.includes('youtube.com') || selectedPromo.mediaUrl.includes('youtu.be') ? (
                        <iframe
                          src={selectedPromo.mediaUrl.includes('embed') ? selectedPromo.mediaUrl : `https://www.youtube.com/embed/${selectedPromo.mediaUrl.split('v=')[1]?.split('&')[0] || ''}`}
                          title="Promo Video"
                          className="w-full h-full aspect-video border-0 rounded-lg"
                          allowFullScreen
                        />
                      ) : (
                        <video src={selectedPromo.mediaUrl} controls className="w-full h-full aspect-video object-contain" />
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Right Side: Flyer Information Detail Panel (Span 5) */}
              <div className="md:col-span-5 p-5 sm:p-8 flex flex-col justify-between space-y-5 bg-slate-50">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-700 font-extrabold text-[10px] uppercase tracking-widest rounded-lg inline-block">
                      {selectedPromo.mediaType === 'image' ? 'FLYER GAMBAR PROMO' : 'VIDEO KAMPANYE'}
                    </span>
                    <h2 className="font-sans font-black text-slate-800 text-lg sm:text-xl leading-tight">
                      {selectedPromo.title}
                    </h2>
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-sm space-y-2">
                    <p className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider border-b pb-1 flex items-center space-x-1 text-sky-600">
                      <Info className="w-3.5 h-3.5" />
                      <span>Detail Informasi & Penawaran:</span>
                    </p>
                    <p className="whitespace-pre-line font-medium text-slate-600 text-[11px] sm:text-xs">
                      {selectedPromo.description}
                    </p>
                  </div>
                </div>

                {/* Print/Download and WhatsApp Action buttons */}
                <div className="space-y-2.5 pt-3 border-t border-slate-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsZoomed(true)}
                      className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-sky-600" />
                      <span>Perbesar Flyer</span>
                    </button>
                    <a
                      href={selectedPromo.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Buka File Asli</span>
                    </a>
                  </div>

                  {/* WhatsApp Direct Inquiry Button */}
                  <a
                    href={formatWhatsAppUrl(whatsappNum, `Halo Admin NatNat Fresh Milk, saya ingin bertanya tentang promo: ${selectedPromo.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <span className="text-sm">💬</span>
                    <span>Tanya Promo via WhatsApp ({whatsappNum})</span>
                  </a>

                  {selectedPromo.linkUrl && (
                    <button
                      onClick={() => {
                        const url = selectedPromo.linkUrl || '';
                        setSelectedPromo(null);
                        setIsZoomed(false);
                        if (url.startsWith('http') || url.includes('.') || url.startsWith('www')) {
                          let formattedUrl = url;
                          if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            formattedUrl = 'https://' + url;
                          }
                          window.open(formattedUrl, '_blank');
                        } else {
                          setActiveTab(url);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-sky-100 flex items-center justify-center space-x-1.5"
                    >
                      <span>{selectedPromo.buttonText || 'Ajukan Klaim Sekarang'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM OVERLAY FOR MOBILE / HANDPHONES */}
      {isZoomed && selectedPromo && (
        <div className="fixed inset-0 bg-black/95 z-[99] flex flex-col items-center justify-center p-2 sm:p-6 overflow-auto animate-in zoom-in-95 duration-150">
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
            <button
              onClick={() => setIsZoomed(false)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-xs backdrop-blur-md flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Tutup Perbesar</span>
            </button>
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
            {selectedPromo.mediaType === 'image' ? (
              <img
                src={selectedPromo.mediaUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80'}
                alt={selectedPromo.title}
                referrerPolicy="no-referrer"
                className="max-w-none w-auto h-auto max-h-[92vh] min-w-[300px] object-contain shadow-2xl rounded-xl"
              />
            ) : (
              <div className="w-full max-w-4xl aspect-video">
                <iframe
                  src={selectedPromo.mediaUrl}
                  title="Promo Video Full"
                  className="w-full h-full border-0 rounded-xl"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        <a
          href={formatWhatsAppUrl(whatsappNum, 'Halo Admin NatNat Fresh Milk, saya ingin bertanya seputar produk & kemitraan SPPG...')}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 border-2 border-white/20"
          title={`Chat WhatsApp NatNat (${whatsappNum})`}
        >
          <span className="text-xl animate-bounce">💬</span>
          <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline-block">
            Chat WhatsApp ({whatsappNum})
          </span>
          <span className="font-extrabold text-xs sm:hidden">
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
