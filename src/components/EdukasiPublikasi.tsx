import React, { useState } from 'react';
import { Article } from '../types';
import { FileDown, BookOpen, Calendar, User, Filter, ArrowRight, X, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

interface EdukasiPublikasiProps {
  articles: Article[];
}

export default function EdukasiPublikasi({ articles }: EdukasiPublikasiProps) {
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Gizi' | 'SOP Distribusi' | 'Siaran Pers'>('Semua');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const categories = ['Semua', 'Gizi', 'SOP Distribusi', 'Siaran Pers'];

  const filteredArticles = activeCategory === 'Semua' 
    ? articles 
    : articles.filter(art => art.category === activeCategory);

  const simulateDownload = (docName: string) => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
      alert(`Berhasil mengunduh dokumen: ${docName}. File PDF terunduh ke sistem Anda.`);
    }, 1500);
  };

  const publicDocuments = [
    {
      id: 'doc-halal',
      title: 'Sertifikat Halal Indonesia (BPJPH)',
      no: 'ID35110000214820323',
      size: '1.2 MB',
      type: 'PDF'
    },
    {
      id: 'doc-bpom',
      title: 'Izin Edar Pangan Olahan Badan POM RI',
      no: 'MD 241031001099',
      size: '890 KB',
      type: 'PDF'
    },
    {
      id: 'doc-lab',
      title: 'Laporan Uji Lab Kimia & Mikrobiologi Berkala',
      no: 'Report of Analysis (ROA)',
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      id: 'doc-flyer',
      title: 'Brosur & Panduan Teknis Kemitraan SPPG',
      no: 'Flyer NatNat Fresh Milk',
      size: '3.1 MB',
      type: 'PDF'
    }
  ];

  return (
    <div id="education-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      
      {/* Introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Pusat Informasi & Unduh
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          Edukasi Gizi & Kepatuhan Dokumen Publik
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kami menyediakan bahan edukasi mengenai stunting, SOP penanganan cold-chain untuk dapur SPPG, serta akses terbuka bagi instansi pengawas pemerintah untuk mengunduh izin edar dan sertifikat legalitas.
        </p>
      </section>

      {/* Grid: Left - Download Center, Right - Articles List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Public Download Center */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500 text-white shadow-md">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-black text-lg text-slate-800">Unduh Dokumen Publik</h2>
              <p className="text-xs text-slate-400">Verifikasi legalitas untuk instansi pengawas</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Daftar dokumen legalitas, perizinan, dan laporan kualitas berkala PT. Satriyo Abimanyu Prabangkara yang dapat diakses secara terbuka.
          </p>

          {/* List of documents */}
          <div className="space-y-3">
            {publicDocuments.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm hover:border-sky-300 transition-colors flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold block uppercase">NO: {doc.no}</span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">{doc.title}</h4>
                  <span className="inline-block text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-mono">{doc.type} • {doc.size}</span>
                </div>

                <button
                  onClick={() => simulateDownload(doc.title)}
                  disabled={downloadingDoc !== null}
                  className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
                  title="Unduh PDF"
                >
                  {downloadingDoc === doc.title ? (
                    <span className="text-xs font-semibold animate-pulse">Unduh...</span>
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* SOP Poster teaser */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-start space-x-3 text-xs text-orange-800">
            <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <strong>Klaim Poster Fisik SOP Dapur</strong>
              <p className="text-orange-700/90 mt-0.5">
                Setiap SPPG mitra mendapat kiriman gratis poster laminasi SOP Penyimpanan & Distribusi untuk dipasang di dinding dapur gizi.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Articles Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <h2 className="font-sans font-black text-xl text-slate-800">Artikel & Publikasi Mutu</h2>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-6">
            {filteredArticles.map((art) => (
              <article 
                key={art.id} 
                onClick={() => setSelectedArticle(art)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all duration-300 cursor-pointer space-y-3.5 group"
              >
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <span className="bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded">{art.category}</span>
                  <span>•</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {art.date}</span>
                  <span>•</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {art.author}</span>
                </div>

                <h3 className="font-sans font-black text-lg text-slate-800 group-hover:text-sky-600 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {art.summary}
                </p>

                <div className="flex items-center text-xs text-sky-600 font-bold group-hover:text-sky-700">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Article Detail Modal Dialog */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative">
            
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Meta */}
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
              <span className="bg-sky-50 text-sky-600 font-bold px-2.5 py-0.5 rounded">{selectedArticle.category}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.author}</span>
            </div>

            {/* Title */}
            <h2 className="font-sans font-black text-2xl text-slate-800 leading-tight">
              {selectedArticle.title}
            </h2>

            {/* Detailed Content */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-5">
              {selectedArticle.content}
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-between items-center text-xs text-slate-400">
              <span>Halaman Publikasi PT. SABP</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
