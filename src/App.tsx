/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import KatalogProduk from './components/KatalogProduk';
import Traceability from './components/Traceability';
import EdukasiPublikasi from './components/EdukasiPublikasi';
import HubungiKami from './components/HubungiKami';
import PortalSPPG from './components/PortalSPPG';
import AdminPanel from './components/AdminPanel';

import {
  PRODUCTS,
  MITRA_SPPG,
  ARTICLES,
  LAB_REPORTS,
  INITIAL_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_TICKETS,
  INITIAL_PROMOS
} from './data';
import {
  fetchProducts, insertProduct, updateProduct, deleteProduct,
  fetchMitra, insertMitra, updateMitra, deleteMitra,
  fetchArticles, insertArticle, updateArticle, deleteArticle,
  fetchLabReports, insertLabReport, updateLabReport, deleteLabReport,
  fetchOrders, insertOrder, updateOrder, deleteOrder,
  fetchDeliveries, insertDelivery, updateDelivery, deleteDelivery,
  fetchTickets, insertTicket, updateTicket, deleteTicket,
  fetchPromos, insertPromo, updatePromo, deletePromo,
  fetchLandingSettings, upsertLandingSettings,
  fetchAboutSettings, upsertAboutSettings,
  seedInitialData
} from './lib/db';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Product, Article, LabReport, MitraSPPG, Order, DeliveryLog, Ticket, Promo } from './types';

// Default Settings for Beranda / Landing Page
const defaultLandingSettings = {
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

// Default Settings for Tentang Kami
const defaultAboutSettings = {
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

function getLocalStorageData(key: string, fallback: any) {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [supabaseReady, setSupabaseReady] = useState(false);
  const useSupabase = isSupabaseConfigured();

  // Initialize state from localStorage as fallback
  const [products, setProducts] = useState<Product[]>(() => getLocalStorageData('natnat_products', PRODUCTS));
  const [articles, setArticles] = useState<Article[]>(() => getLocalStorageData('natnat_articles', ARTICLES));
  const [labReports, setLabReports] = useState<LabReport[]>(() => getLocalStorageData('natnat_lab_reports', LAB_REPORTS));
  const [mitraList, setMitraList] = useState<MitraSPPG[]>(() => getLocalStorageData('natnat_mitra_list', MITRA_SPPG));
  const [orders, setOrders] = useState<Order[]>(() => getLocalStorageData('natnat_orders', INITIAL_ORDERS));
  const [deliveries, setDeliveries] = useState<DeliveryLog[]>(() => getLocalStorageData('natnat_deliveries', INITIAL_DELIVERIES));
  const [tickets, setTickets] = useState<Ticket[]>(() => getLocalStorageData('natnat_tickets', INITIAL_TICKETS));
  const [landingSettings, setLandingSettings] = useState<any>(() => getLocalStorageData('natnat_landing_settings', defaultLandingSettings));
  const [aboutSettings, setAboutSettings] = useState<any>(() => getLocalStorageData('natnat_about_settings', defaultAboutSettings));
  const [promos, setPromos] = useState<Promo[]>(() => getLocalStorageData('natnat_promos', INITIAL_PROMOS));

  // Load data from Supabase on mount
  useEffect(() => {
    if (!useSupabase) return;

    let cancelled = false;

    async function loadData() {
      try {
        // Seed initial data if tables are empty
        await seedInitialData();

        if (cancelled) return;

        const [
          productsData, articlesData, labReportsData, mitraData,
          ordersData, deliveriesData, ticketsData, promosData,
          landingData, aboutData
        ] = await Promise.all([
          fetchProducts(), fetchArticles(), fetchLabReports(), fetchMitra(),
          fetchOrders(), fetchDeliveries(), fetchTickets(), fetchPromos(),
          fetchLandingSettings(), fetchAboutSettings()
        ]);

        if (cancelled) return;

        if (productsData.length > 0) setProducts(productsData);
        if (articlesData.length > 0) setArticles(articlesData);
        if (labReportsData.length > 0) setLabReports(labReportsData);
        if (mitraData.length > 0) setMitraList(mitraData);
        if (ordersData.length > 0) setOrders(ordersData);
        if (deliveriesData.length > 0) setDeliveries(deliveriesData);
        if (ticketsData.length > 0) setTickets(ticketsData);
        if (promosData.length > 0) setPromos(promosData);
        if (landingData) setLandingSettings(landingData);
        if (aboutData) setAboutSettings(aboutData);

        setSupabaseReady(true);
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
        setSupabaseReady(false);
      }
    }

    loadData();

    return () => { cancelled = true; };
  }, [useSupabase]);

  // Keep localStorage as cache (backward compatibility)
  const syncToLocalStorage = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorage quota exceeded for ${key}`, e);
    }
  }, []);

  useEffect(() => { syncToLocalStorage('natnat_products', products); }, [products, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_articles', articles); }, [articles, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_lab_reports', labReports); }, [labReports, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_mitra_list', mitraList); }, [mitraList, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_orders', orders); }, [orders, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_deliveries', deliveries); }, [deliveries, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_tickets', tickets); }, [tickets, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_landing_settings', landingSettings); }, [landingSettings, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_about_settings', aboutSettings); }, [aboutSettings, syncToLocalStorage]);
  useEffect(() => { syncToLocalStorage('natnat_promos', promos); }, [promos, syncToLocalStorage]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <LandingPage 
            setActiveTab={setActiveTab} 
            openPortal={() => setActiveTab('portal')} 
            landingSettings={landingSettings}
            promos={promos}
          />
        );
      case 'tentang':
        return <AboutUs aboutSettings={aboutSettings} />;
      case 'katalog':
        return <KatalogProduk products={products} />;
      case 'lacak':
        return <Traceability labReports={labReports} mitraList={mitraList} />;
      case 'edukasi':
        return <EdukasiPublikasi articles={articles} />;
      case 'kontak':
        return (
          <HubungiKami 
            mitraList={mitraList} 
            ticketsList={tickets} 
            setTicketsList={setTickets} 
            landingSettings={landingSettings}
          />
        );
      case 'portal':
        return (
          <PortalSPPG 
            products={products}
            mitraList={mitraList}
            orders={orders}
            setOrders={setOrders}
            deliveries={deliveries}
            setDeliveries={setDeliveries}
            tickets={tickets}
            setTickets={setTickets}
            labReports={labReports}
            setLabReports={setLabReports}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            products={products}
            setProducts={setProducts}
            articles={articles}
            setArticles={setArticles}
            labReports={labReports}
            setLabReports={setLabReports}
            mitraList={mitraList}
            setMitraList={setMitraList}
            orders={orders}
            setOrders={setOrders}
            tickets={tickets}
            setTickets={setTickets}
            landingSettings={landingSettings}
            setLandingSettings={setLandingSettings}
            aboutSettings={aboutSettings}
            setAboutSettings={setAboutSettings}
            promos={promos}
            setPromos={setPromos}
          />
        );
      default:
        return (
          <LandingPage 
            setActiveTab={setActiveTab} 
            openPortal={() => setActiveTab('portal')} 
            landingSettings={landingSettings}
            promos={promos}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans text-slate-700 antialiased selection:bg-sky-500 selection:text-white">
      {/* Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openPortal={() => setActiveTab('portal')} 
      />

      {/* Main Content Body */}
      <main className="flex-grow">
        {useSupabase && !supabaseReady ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">Memuat data...</p>
            </div>
          </div>
        ) : (
          renderActiveComponent()
        )}
      </main>

      {/* Footer Details */}
      <Footer setActiveTab={setActiveTab} landingSettings={landingSettings} />
    </div>
  );
}
