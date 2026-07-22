import React, { useState } from 'react';
import { Product } from '../types';
import { Milk, Sparkles, Plus, Calculator, ChevronRight, FileSpreadsheet, ShieldCheck, Heart } from 'lucide-react';

interface KatalogProdukProps {
  products: Product[];
}

export default function KatalogProduk({ products }: KatalogProdukProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => products[0] || {} as Product);
  const [recipientCount, setRecipientCount] = useState<number>(150);

  // If selectedProduct is empty or not in the array (e.g. was deleted), sync it
  React.useEffect(() => {
    if (products.length > 0 && (!selectedProduct.id || !products.find(p => p.id === selectedProduct.id))) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct.id]);

  // Parse numeric values for calculator
  const getNumericValue = (str: string): number => {
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  };

  // Calculations
  const calculatedNutrients = {
    energy: getNumericValue(selectedProduct.nutrients.energy) * recipientCount,
    protein: getNumericValue(selectedProduct.nutrients.protein) * recipientCount,
    calcium: getNumericValue(selectedProduct.nutrients.calcium) * recipientCount,
    totalFat: getNumericValue(selectedProduct.nutrients.totalFat) * recipientCount,
    saturatedFat: getNumericValue(selectedProduct.nutrients.saturatedFat) * recipientCount,
    carbohydrates: getNumericValue(selectedProduct.nutrients.carbohydrates) * recipientCount,
    totalVolume: parseFloat(selectedProduct.volume) * recipientCount, // in ml
    totalCost: selectedProduct.price * recipientCount
  };

  // Recommended Daily Intake (AKG) contributions benchmarks for Indonesian school age children (approximate average per child):
  // Energy: 1800 kcal, Protein: 45g, Calcium: 1000mg.
  // We calculate total contribution:
  const contributionPercentage = {
    energy: Math.min(100, Math.round(((getNumericValue(selectedProduct.nutrients.energy) / 1800) * 100))),
    protein: Math.min(100, Math.round(((getNumericValue(selectedProduct.nutrients.protein) / 45) * 100))),
    calcium: Math.min(100, Math.round(((getNumericValue(selectedProduct.nutrients.calcium) / 1000) * 100))),
  };

  return (
    <div id="katalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 animate-in fade-in duration-500">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Katalog Produk Susu MBG
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
          Formulasi Nutrisi Terukur untuk Setiap Kelompok Usaha
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          PT Satriyo Abimanyu Prabangkara menyediakan varian kemasan susu yang disesuaikan dengan sasaran kelompok penerima program Makan Bergizi Gratis (MBG), lengkap dengan dokumen pengawasan Certificate of Analysis (COA).
        </p>
      </section>

      {/* Catalog Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {products.map((prod) => (
          <div 
            key={prod.id} 
            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
              selectedProduct.id === prod.id 
                ? 'border-sky-400 ring-2 ring-sky-300/30 shadow-lg shadow-sky-50' 
                : 'border-slate-100 shadow-sm hover:border-slate-200'
            }`}
          >
            {/* Top Info */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  prod.type === 'Pasteurisasi' ? 'bg-sky-50 text-sky-600' :
                  prod.type === 'UHT' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {prod.type}
                </span>
                <span className="text-lg font-black text-slate-800">
                  Rp {prod.price.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/ cup</span>
                </span>
              </div>

              <div>
                <h3 className="font-sans font-black text-xl text-slate-800 group-hover:text-sky-600 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">Kemasan: {prod.packaging} ({prod.volume})</p>
                <p className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 p-2 rounded-xl mt-3">
                  🎯 Sasaran: {prod.targetAudience}
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {prod.description}
              </p>

              {/* Nutrition Facts Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-700 border-b border-slate-100">
                  Informasi Nilai Gizi ({prod.volume})
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: 'Energi Total', value: prod.nutrients.energy },
                    { label: 'Protein Alami', value: prod.nutrients.protein, highlight: true },
                    { label: 'Kalsium Murni', value: prod.nutrients.calcium, highlight: true },
                    { label: 'Lemak Total', value: prod.nutrients.totalFat },
                    { label: 'Karbohidrat', value: prod.nutrients.carbohydrates },
                  ].map((nut, index) => (
                    <div key={index} className={`flex justify-between px-4 py-2 ${nut.highlight ? 'bg-sky-50/45 font-medium' : ''}`}>
                      <span className="text-slate-600">{nut.label}</span>
                      <span className={`font-mono ${nut.highlight ? 'text-sky-600 font-bold' : 'text-slate-800'}`}>{nut.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selector Bottom Bar */}
            <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">MD: {prod.certifications[0].split(' ')[2] || ''}</span>
              <button
                onClick={() => setSelectedProduct(prod)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedProduct.id === prod.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {selectedProduct.id === prod.id ? 'Terpilih untuk Kalkulasi' : 'Pilih untuk Kalkulator'}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Nutrition Calculator */}
      <section className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-10 border border-sky-100/60 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500 text-white shadow-md">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-sans font-black text-xl text-slate-800">Kalkulator Gizi Penerima MBG</h2>
                <p className="text-xs text-slate-400">Verifikasi standar gizi harian siswa sekolah secara real-time</p>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Varian Susu Terpilih</label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setSelectedProduct(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.volume})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jumlah Siswa / Penerima Manfaat</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={recipientCount}
                    onChange={(e) => setRecipientCount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 bg-white font-semibold text-slate-800"
                  />
                  <div className="flex space-x-1">
                    {[100, 250, 500].map(val => (
                      <button
                        key={val}
                        onClick={() => setRecipientCount(val)}
                        className="px-3 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AKG contribution cards */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Kontribusi per Anak Terhadap Kebutuhan Gizi Harian (AKG)</span>
              
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Protein Susu ({selectedProduct.nutrients.protein} / target 45g)</span>
                    <span className="font-bold text-emerald-600">{contributionPercentage.protein}% AKG</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${contributionPercentage.protein}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Kalsium ({selectedProduct.nutrients.calcium} / target 1000mg)</span>
                    <span className="font-bold text-sky-600">{contributionPercentage.calcium}% AKG</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${contributionPercentage.calcium}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                Estimasi Penyaluran Kumulatif
              </span>
              <h3 className="font-sans font-black text-xl text-slate-800 mt-2">
                Suplai Gizi untuk {recipientCount.toLocaleString('id-ID')} Siswa
              </h3>
            </div>

            {/* Cumulative Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Volume Susu</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{(calculatedNutrients.totalVolume / 1000).toLocaleString('id-ID')} L</span>
                <span className="text-[9px] text-slate-400">{recipientCount} Cup</span>
              </div>
              
              <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100/50">
                <span className="text-[10px] text-sky-600 uppercase tracking-widest font-mono block">Energi Total</span>
                <span className="text-lg font-black text-sky-700 mt-1 block">{calculatedNutrients.energy.toLocaleString('id-ID')} kcal</span>
                <span className="text-[9px] text-sky-500">Mendukung Belajar</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-mono block">Total Protein</span>
                <span className="text-lg font-black text-emerald-700 mt-1 block">{(calculatedNutrients.protein / 1000).toFixed(2)} kg</span>
                <span className="text-[9px] text-emerald-500">{calculatedNutrients.protein.toFixed(0)} gram</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                <span className="text-[10px] text-blue-600 uppercase tracking-widest font-mono block">Total Kalsium</span>
                <span className="text-lg font-black text-blue-700 mt-1 block">{(calculatedNutrients.calcium / 1000).toFixed(2)} g</span>
                <span className="text-[9px] text-blue-500">{calculatedNutrients.calcium.toLocaleString('id-ID')} mg</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Karbohidrat</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{(calculatedNutrients.carbohydrates / 1000).toFixed(2)} kg</span>
                <span className="text-[9px] text-slate-400">{calculatedNutrients.carbohydrates.toFixed(0)} g</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-white">
                <span className="text-[10px] text-sky-300 uppercase tracking-widest font-mono block">Estimasi Biaya</span>
                <span className="text-sm font-extrabold mt-1.5 block">Rp {calculatedNutrients.totalCost.toLocaleString('id-ID')}</span>
                <span className="text-[9px] text-slate-400">Termasuk Ongkir</span>
              </div>
            </div>

            {/* QA Affirmation */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start space-x-3 text-xs text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Jaminan Laboratorium (COA Verified)</strong>
                <p className="text-emerald-700/90 mt-0.5">
                  Setiap pengiriman susu disertai Lembar Data Teknis Hasil Uji Lab Mikrobiologi harian untuk menjamin 100% bebas patogen dan bakteri pembusuk berbahaya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
