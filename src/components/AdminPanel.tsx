import React, { useState, useEffect } from 'react';
import { 
  Lock, KeyRound, Save, Plus, Edit, Trash2, CheckCircle, 
  Settings, Milk, FileText, Activity, Users, ShieldAlert,
  ClipboardList, Check, X, RefreshCw, Layers, MapPin, Eye,
  HelpCircle, Sparkles, Film, Upload, Copy, Download, Code,
  Info, ExternalLink, FileJson, Phone
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  insertProduct, updateProduct, deleteProduct,
  insertMitra, updateMitra, deleteMitra,
  insertArticle, updateArticle, deleteArticle,
  insertLabReport, updateLabReport, deleteLabReport,
  insertOrder, updateOrder, deleteOrder,
  insertTicket, updateTicket, deleteTicket,
  insertPromo, updatePromo, deletePromo,
  insertDelivery, updateDelivery, deleteDelivery,
  upsertLandingSettings,
  upsertAboutSettings
} from '../lib/db';
import { loginWithEmail, registerFirstAdmin, logout as authLogout, isAdminSession, getCurrentUser } from '../lib/auth';
import { Product, Article, LabReport, MitraSPPG, Order, Ticket, Promo } from '../types';
import { formatWhatsAppUrl } from '../utils';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  labReports: LabReport[];
  setLabReports: React.Dispatch<React.SetStateAction<LabReport[]>>;
  mitraList: MitraSPPG[];
  setMitraList: React.Dispatch<React.SetStateAction<MitraSPPG[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  landingSettings: any;
  setLandingSettings: (settings: any) => void;
  aboutSettings: any;
  setAboutSettings: (settings: any) => void;
  promos: Promo[];
  setPromos: React.Dispatch<React.SetStateAction<Promo[]>>;
}

// Emergency access passcode from environment variable
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'admin';

type AdminTab = 'beranda_tentang' | 'promos' | 'produk' | 'artikel' | 'lab_reports' | 'mitra' | 'orders_tickets';

export default function AdminPanel({
  products, setProducts,
  articles, setArticles,
  labReports, setLabReports,
  mitraList, setMitraList,
  orders, setOrders,
  tickets, setTickets,
  landingSettings, setLandingSettings,
  aboutSettings, setAboutSettings,
  promos, setPromos
}: AdminPanelProps) {
  // Authentication state — Supabase Auth with emergency passcode fallback
  const [authMethod, setAuthMethod] = useState<'email' | 'passcode'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('natnat_admin_auth') === 'true';
  });

  // Restore Supabase session on mount
  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      const adminSession = await isAdminSession();
      if (!cancelled && adminSession) {
        setIsAuthenticated(true);
        localStorage.setItem('natnat_admin_auth', 'true');
      }
    }
    restoreSession();
    return () => { cancelled = true; };
  }, []);

  // Listen for Supabase auth state changes (logout from another tab, etc.)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        localStorage.removeItem('natnat_admin_auth');
      } else if (event === 'SIGNED_IN' && session.user) {
        const admin = await isAdminSession();
        if (admin) {
          setIsAuthenticated(true);
          localStorage.setItem('natnat_admin_auth', 'true');
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('natnat_admin_auth');
          await supabase.auth.signOut();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // UI tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('beranda_tentang');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<LabReport | null>(null);

  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<MitraSPPG | null>(null);

  // Export / Deploy Vercel Sync Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTab, setExportTab] = useState<'code' | 'json'>('code');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form input states
  // Product Form states
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '',
    type: 'Pasteurisasi',
    volume: '125 ml',
    packaging: 'Cup Higienis Lid-sealed',
    price: 3000,
    targetAudience: 'Siswa SD',
    nutrients: {
      energy: '80 kcal',
      protein: '4.0 g',
      calcium: '120 mg',
      totalFat: '6.0 g',
      saturatedFat: '3.0 g',
      carbohydrates: '5.0 g'
    },
    description: '',
    certifications: []
  });

  const [prodCertString, setProdCertString] = useState('');

  // Article Form states
  const [artForm, setArtForm] = useState<Omit<Article, 'id'>>({
    title: '',
    summary: '',
    content: '',
    category: 'Gizi',
    date: new Date().toISOString().split('T')[0],
    author: 'Tim Ahli Gizi'
  });

  // Lab Report Form states
  const [labForm, setLabForm] = useState<Omit<LabReport, 'id'>>({
    batchNo: 'B-260722-A',
    testDate: new Date().toISOString().split('T')[0],
    bacteriaCount: '8.0 x 10³ CFU/ml',
    fatContent: '3.5 %',
    proteinContent: '3.3 %',
    sensoryTest: 'Sesuai Standar',
    status: 'Lulus Uji',
    certifiedBy: 'Hendra Wijaya, M.Si (Lab QC Supervisor)'
  });

  // Mitra Form states
  const [mitraForm, setMitraForm] = useState<Omit<MitraSPPG, 'id'>>({
    name: '',
    location: '',
    address: '',
    coordinator: '',
    phone: '',
    beneficiariesCount: 500,
    dailyQuota: 500
  });

  // Landing Page Settings editing states
  const [tempLanding, setTempLanding] = useState(() => ({
    whatsappNumber: '0812-1768-7815',
    ...landingSettings
  }));
  // About Page Settings editing states
  const [tempAbout, setTempAbout] = useState(aboutSettings);
  const [misiInputString, setMisiInputString] = useState(() => aboutSettings.misiList.join('\n'));

  // Notification helper
  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Show sync error to user
  const triggerError = (msg: string) => {
    setShowNotification(`⚠ ${msg} — Data tersimpan di browser ini saja. Periksa koneksi Supabase.`);
    setTimeout(() => setShowNotification(null), 5000);
  };

  // Promos management state and form
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoForm, setPromoForm] = useState<Omit<Promo, 'id'>>({
    title: '',
    description: '',
    mediaType: 'image',
    mediaUrl: '',
    linkUrl: 'portal',
    buttonText: 'Pelajari Selengkapnya',
    isActive: true
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Supabase sync helpers (replaces useDBSync hook)
  const useDB = isSupabaseConfigured();
  
  const syncProduct = async (product: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertProduct(product);
    else if (action === 'update') await updateProduct(product.id, product);
    else await deleteProduct(product.id);
  };
  const syncMitra = async (mitra: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertMitra(mitra);
    else if (action === 'update') await updateMitra(mitra.id, mitra);
    else await deleteMitra(mitra.id);
  };
  const syncArticle = async (article: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertArticle(article);
    else if (action === 'update') await updateArticle(article.id, article);
    else await deleteArticle(article.id);
  };
  const syncLab = async (lab: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertLabReport(lab);
    else if (action === 'update') await updateLabReport(lab.id, lab);
    else await deleteLabReport(lab.id);
  };
  const syncOrder = async (order: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertOrder(order);
    else if (action === 'update') await updateOrder(order.id, order);
    else await deleteOrder(order.id);
  };
  const syncDelivery = async (delivery: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertDelivery(delivery);
    else if (action === 'update') await updateDelivery(delivery.id, delivery);
    else await deleteDelivery(delivery.id);
  };
  const syncTicket = async (ticket: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertTicket(ticket);
    else if (action === 'update') await updateTicket(ticket.id, ticket);
    else await deleteTicket(ticket.id);
  };
  const syncPromo = async (promo: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertPromo(promo);
    else if (action === 'update') await updatePromo(promo.id, promo);
    else await deletePromo(promo.id);
  };
  const syncLandingSettings = async (settings: any) => {
    if (!useDB) return;
    await upsertLandingSettings(settings);
  };
  const syncAboutSettings = async (settings: any) => {
    if (!useDB) return;
    await upsertAboutSettings(settings);
  };

  // Compress image helper using canvas to keep Base64 size lightweight (~100KB instead of 5MB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            resolve(compressed);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => reject('Gagal memuat file gambar');
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject('Gagal membaca file');
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar. Maksimum 15MB.");
        return;
      }
      setIsUploadingImage(true);
      try {
        const compressedBase64 = await compressImage(file);
        setPromoForm(prev => ({ ...prev, mediaUrl: compressedBase64 }));
        triggerNotification('Foto flyer berhasil diunggah & dioptimasi!');
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPromoForm(prev => ({ ...prev, mediaUrl: reader.result as string }));
          triggerNotification('Foto flyer berhasil diunggah!');
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const openAddPromo = () => {
    setEditingPromo(null);
    setPromoForm({
      title: '',
      description: '',
      mediaType: 'image',
      mediaUrl: '',
      linkUrl: 'portal',
      buttonText: 'Pelajari Selengkapnya',
      isActive: true
    });
    setIsPromoModalOpen(true);
  };

  const openEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoForm({
      title: promo.title,
      description: promo.description,
      mediaType: promo.mediaType,
      mediaUrl: promo.mediaUrl,
      linkUrl: promo.linkUrl || '',
      buttonText: promo.buttonText || 'Pelajari Selengkapnya',
      isActive: promo.isActive
    });
    setIsPromoModalOpen(true);
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.title.trim()) {
      alert("Judul Promo harus diisi");
      return;
    }
    const promoData: Promo = {
      id: editingPromo ? editingPromo.id : `promo-${crypto.randomUUID().slice(0, 8)}`,
      ...promoForm
    };

    let updatedPromos;
    if (editingPromo) {
      updatedPromos = promos.map(p => p.id === editingPromo.id ? promoData : p);
      triggerNotification('Promo berhasil diperbarui!');
    } else {
      updatedPromos = [...promos, promoData];
      triggerNotification('Promo baru berhasil ditambahkan!');
    }

    setPromos(updatedPromos);
    if (editingPromo) { syncPromo(promoData, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    else { syncPromo(promoData, 'insert').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    setIsPromoModalOpen(false);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
      const updatedPromos = promos.filter(p => p.id !== id);
      setPromos(updatedPromos);
      syncPromo({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Promo berhasil dihapus!');
    }
  };

  const togglePromoStatus = (id: string) => {
    const updatedPromos = promos.map(p => {
      if (p.id === id) {
        const nextStatus = !p.isActive;
        triggerNotification(nextStatus ? 'Promo diaktifkan!' : 'Promo dinonaktifkan!');
        return { ...p, isActive: nextStatus };
      }
      return p;
    });
    setPromos(updatedPromos);
  };


  // Auth handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('natnat_admin_auth', 'true');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Login gagal');
      }
    } catch {
      setAuthError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await registerFirstAdmin(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('natnat_admin_auth', 'true');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Pendaftaran gagal');
      }
    } catch {
      setAuthError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmergencyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem('natnat_admin_auth', 'true');
      setPasscode('');
      setAuthError('');
    } else {
      setAuthError('Passcode salah! Hubungi administrator untuk mendapatkan passcode.');
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setIsAuthenticated(false);
    localStorage.removeItem('natnat_admin_auth');
  };

  // PRODUCT CRUD
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      type: 'Pasteurisasi',
      volume: '125 ml',
      packaging: 'Cup Higienis Lid-sealed',
      price: 3000,
      targetAudience: 'Siswa SD & PAUD Program MBG',
      nutrients: {
        energy: '88 kcal',
        protein: '4.3 g',
        calcium: '135 mg',
        totalFat: '6.7 g',
        saturatedFat: '3.0 g',
        carbohydrates: '5.6 g'
      },
      description: '',
      certifications: ['BPOM MD 241031001099', 'Halal ID35110000214820323']
    });
    setProdCertString('BPOM MD 241031001099, Halal ID35110000214820323');
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      type: prod.type,
      volume: prod.volume,
      packaging: prod.packaging,
      price: prod.price,
      targetAudience: prod.targetAudience,
      nutrients: { ...prod.nutrients },
      description: prod.description,
      certifications: [...prod.certifications]
    });
    setProdCertString(prod.certifications.join(', '));
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const certifications = prodCertString.split(',').map(s => s.trim()).filter(Boolean);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${crypto.randomUUID().slice(0, 8)}`,
      ...prodForm,
      certifications
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      triggerNotification('Produk berhasil diperbarui!');
    } else {
      updatedProducts = [...products, productData];
      triggerNotification('Produk baru berhasil ditambahkan!');
    }

    setProducts(updatedProducts);
    localStorage.setItem('natnat_products_v2', JSON.stringify(updatedProducts));
    if (editingProduct) { syncProduct(productData, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    else { syncProduct(productData, 'insert').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('natnat_products_v2', JSON.stringify(updated));
      syncProduct({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Produk berhasil dihapus!');
    }
  };


  // ARTICLE CRUD
  const openAddArticle = () => {
    setEditingArticle(null);
    setArtForm({
      title: '',
      summary: '',
      content: '',
      category: 'Gizi',
      date: new Date().toISOString().split('T')[0],
      author: 'Tim Ahli Gizi'
    });
    setIsArticleModalOpen(true);
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtForm({
      title: art.title,
      summary: art.summary,
      content: art.content,
      category: art.category,
      date: art.date,
      author: art.author
    });
    setIsArticleModalOpen(true);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingArticle ? editingArticle.id : `art-${crypto.randomUUID().slice(0, 8)}`,
      ...artForm
    };

    let updatedArticles;
    if (editingArticle) {
      updatedArticles = articles.map(a => a.id === editingArticle.id ? articleData : a);
      triggerNotification('Artikel berhasil diperbarui!');
    } else {
      updatedArticles = [...articles, articleData];
      triggerNotification('Artikel baru berhasil ditambahkan!');
    }

    setArticles(updatedArticles);
    localStorage.setItem('natnat_articles_v2', JSON.stringify(updatedArticles));
    if (editingArticle) { syncArticle(articleData, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    else { syncArticle(articleData, 'insert').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('natnat_articles_v2', JSON.stringify(updated));
      syncArticle({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Artikel berhasil dihapus!');
    }
  };


  // LAB REPORTS CRUD
  const openAddLab = () => {
    setEditingLab(null);
    setLabForm({
      batchNo: `B-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-A`,
      testDate: new Date().toISOString().split('T')[0],
      bacteriaCount: '8.5 x 10³ CFU/ml',
      fatContent: '3.6 %',
      proteinContent: '3.4 %',
      sensoryTest: 'Sesuai Standar',
      status: 'Lulus Uji',
      certifiedBy: 'Hendra Wijaya, M.Si (Lab QC Supervisor)'
    });
    setIsLabModalOpen(true);
  };

  const openEditLab = (lab: LabReport) => {
    setEditingLab(lab);
    setLabForm({
      batchNo: lab.batchNo,
      testDate: lab.testDate,
      bacteriaCount: lab.bacteriaCount,
      fatContent: lab.fatContent,
      proteinContent: lab.proteinContent,
      sensoryTest: lab.sensoryTest,
      status: lab.status,
      certifiedBy: lab.certifiedBy
    });
    setIsLabModalOpen(true);
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const labData: LabReport = {
      id: editingLab ? editingLab.id : `lab-${crypto.randomUUID().slice(0, 8)}`,
      ...labForm
    };

    let updatedLabs;
    if (editingLab) {
      updatedLabs = labReports.map(l => l.id === editingLab.id ? labData : l);
      triggerNotification('Laporan lab batch berhasil diperbarui!');
    } else {
      updatedLabs = [labData, ...labReports];
      triggerNotification('Laporan lab batch baru berhasil diregistrasi!');
    }

    setLabReports(updatedLabs);
    localStorage.setItem('natnat_lab_reports_v2', JSON.stringify(updatedLabs));
    if (editingLab) { syncLab(labData, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    else { syncLab(labData, 'insert').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    setIsLabModalOpen(false);
  };

  const handleDeleteLab = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data analisis batch ini?')) {
      const updated = labReports.filter(l => l.id !== id);
      setLabReports(updated);
      localStorage.setItem('natnat_lab_reports_v2', JSON.stringify(updated));
      syncLab({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Data analisis batch berhasil dihapus!');
    }
  };


  // MITRA SPPG CRUD
  const openAddMitra = () => {
    setEditingMitra(null);
    setMitraForm({
      name: '',
      location: '',
      address: '',
      coordinator: '',
      phone: '',
      beneficiariesCount: 800,
      dailyQuota: 800
    });
    setIsMitraModalOpen(true);
  };

  const openEditMitra = (m: MitraSPPG) => {
    setEditingMitra(m);
    setMitraForm({
      name: m.name,
      location: m.location,
      address: m.address,
      coordinator: m.coordinator,
      phone: m.phone,
      beneficiariesCount: m.beneficiariesCount,
      dailyQuota: m.dailyQuota
    });
    setIsMitraModalOpen(true);
  };

  const handleMitraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mData: MitraSPPG = {
      id: editingMitra ? editingMitra.id : `mitra-${crypto.randomUUID().slice(0, 8)}`,
      ...mitraForm
    };

    let updatedMitra;
    if (editingMitra) {
      updatedMitra = mitraList.map(m => m.id === editingMitra.id ? mData : m);
      triggerNotification('Data Mitra SPPG berhasil diperbarui!');
    } else {
      updatedMitra = [...mitraList, mData];
      triggerNotification('Mitra SPPG baru berhasil didaftarkan!');
    }

    setMitraList(updatedMitra);
    localStorage.setItem('natnat_mitra_v2', JSON.stringify(updatedMitra));
    if (editingMitra) { syncMitra(mData, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    else { syncMitra(mData, 'insert').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase')); }
    setIsMitraModalOpen(false);
  };

  const handleDeleteMitra = (id: string) => {
    if (confirm('Yakin ingin menghapus kemitraan SPPG ini?')) {
      const updated = mitraList.filter(m => m.id !== id);
      setMitraList(updated);
      localStorage.setItem('natnat_mitra_v2', JSON.stringify(updated));
      syncMitra({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Kemitraan berhasil dihapus!');
    }
  };


  const handleSaveLandingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLandingSettings(tempLanding);
    localStorage.setItem('natnat_landing_settings_v2', JSON.stringify(tempLanding));
    syncLandingSettings(tempLanding).catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
    triggerNotification('Pengaturan Landing Page berhasil disimpan!');
  };

  const handleSaveAboutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const splitMisi = misiInputString.split('\n').map(l => l.trim()).filter(Boolean);
    const updatedAbout = {
      ...tempAbout,
      misiList: splitMisi
    };
    setAboutSettings(updatedAbout);
    localStorage.setItem('natnat_about_settings_v2', JSON.stringify(updatedAbout));
    syncAboutSettings(updatedAbout).catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
    triggerNotification('Profil & Visi Misi berhasil disimpan!');
  };

  // ORDERS & COMPLAINTS WORKFLOW
  const handleOrderStatusChange = (id: string, newStatus: any) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('natnat_orders', JSON.stringify(updated));
    syncOrder({ id, status: newStatus }, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
    triggerNotification(`Status pesanan ${id} diubah menjadi: ${newStatus}`);
  };

  const handleTicketStatusChange = (id: string, newStatus: any) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTickets(updated);
    localStorage.setItem('natnat_tickets', JSON.stringify(updated));
    syncTicket({ id, status: newStatus }, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
    triggerNotification(`Status tiket aduan ${id} diubah menjadi: ${newStatus}`);
  };

  const handleTicketResolve = (id: string, resolution: string) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: 'Selesai' as const, resolution } : t);
    setTickets(updated);
    localStorage.setItem('natnat_tickets', JSON.stringify(updated));
    syncTicket({ id, status: 'Selesai', resolution }, 'update').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
    triggerNotification(`Aduan tiket ${id} berhasil diselesaikan!`);
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm('Hapus tiket aduan ini dari database?')) {
      const updated = tickets.filter(t => t.id !== id);
      setTickets(updated);
      localStorage.setItem('natnat_tickets', JSON.stringify(updated));
      syncTicket({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Tiket aduan berhasil dihapus!');
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Hapus riwayat pesanan ini?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('natnat_orders', JSON.stringify(updated));
      syncOrder({ id }, 'delete').catch(err => triggerError(err.message || 'Gagal menyinkronkan ke Supabase'));
      triggerNotification('Log pesanan berhasil dihapus!');
    }
  };

  if (!isAuthenticated) {
    const supabaseAvailable = isSupabaseConfigured();
    
    return (
      <div className="max-w-md mx-auto px-4 py-20 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-sans font-black text-2xl text-slate-800 tracking-tight">Portal Admin NatNat</h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Sistem Manajemen Konten (CMS) terintegrasi untuk mengedit data katalog, batch lab, publikasi, dan pengaturan fitur aplikasi.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('passcode')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === 'passcode'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Akses Darurat
            </button>
          </div>

          {/* Email Login Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@natnat.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {!supabaseAvailable && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-700">
                  <span className="font-bold">⚠ Supabase belum dikonfigurasi.</span>
                  <p className="mt-1">Gunakan tab "Akses Darurat" dengan passcode admin, atau konfigurasikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Vercel.</p>
                </div>
              )}

              {authError && <p className="text-red-500 text-[11px] font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk Dashboard</span>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400">atau</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuthMethod('register')}
                className="w-full py-2.5 rounded-xl border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-bold text-xs tracking-wider transition-all"
              >
                Daftar Admin Pertama
              </button>
            </form>
          )}

          {/* Register First Admin Form */}
          {authMethod === 'register' && (
            <form onSubmit={handleRegisterFirstAdmin} className="space-y-4 text-left">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-[11px] text-sky-800">
                <span className="font-bold">📝 Daftar Admin Pertama</span>
                <p className="mt-1">Hanya bisa dilakukan jika belum ada admin yang terdaftar. Setelah admin pertama dibuat, gunakan form Masuk untuk login.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Email Admin
                </label>
                <input
                  type="email"
                  placeholder="admin@natnat.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Buat password yang kuat..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {authError && <p className="text-red-500 text-[11px] font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  <span>Daftar Admin Pertama</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setAuthError(''); }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                ← Kembali ke Masuk
              </button>
            </form>
          )}

          {/* Emergency Passcode Form */}
          {authMethod === 'passcode' && (
            <form onSubmit={handleEmergencyLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Passcode Admin
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="Masukkan passcode..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 font-mono"
                    autoFocus
                  />
                </div>
                {authError && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{authError}</p>}
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] text-sky-700 space-y-1">
                <span className="font-bold flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Akses Darurat:
                </span>
                <p>Gunakan passcode admin untuk masuk langsung. Passcode diatur oleh administrator sistem.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider transition-all"
              >
                Masuk Dashboard
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setAuthError(''); }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                ← Kembali ke Login Email
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="admin-panel-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10 animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-800">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm shadow-sky-100">
              CMS ACTIVE
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 font-mono">PT Satriyo Abimanyu Prabangkara</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-800 tracking-tight">
            Dashboard Kontrol & Pengaturan Utama
          </h1>
          <p className="text-xs text-slate-500">
            Edit konten landing page, kelola produk, artikel publikasi gizi, laporan analisis laboratorium, data mitra, dan tiket aduan.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-colors flex items-center space-x-1"
        >
          <span>Keluar Admin</span>
        </button>
      </div>

      {/* Grid Layout: Left Nav Tabs, Right Config Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar Tabs Navigation */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 block">Menu Manajemen</span>
          {[
            { id: 'beranda_tentang', label: 'Beranda & Profil', icon: <Settings className="w-4 h-4" /> },
            { id: 'promos', label: 'Kelola Promo & Media', icon: <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> },
            { id: 'produk', label: 'Katalog Produk', icon: <Milk className="w-4 h-4" /> },
            { id: 'artikel', label: 'Artikel & Edukasi', icon: <FileText className="w-4 h-4" /> },
            { id: 'lab_reports', label: 'Lacak & Hasil Lab', icon: <Activity className="w-4 h-4" /> },
            { id: 'mitra', label: 'Mitra Dapur SPPG', icon: <Users className="w-4 h-4" /> },
            { id: 'orders_tickets', label: 'Pesanan & Aduan', icon: <ClipboardList className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-3 ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Working Desk of selected Tab */}
        <div className="lg:col-span-9 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* TAB 1: BERANDA & TENTANG COPY CONFIGURATION */}
          {activeTab === 'beranda_tentang' && (
            <div className="space-y-8">
              
              {/* Beranda/Landing settings */}
              <form onSubmit={handleSaveLandingSettings} className="space-y-6">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800 flex items-center space-x-2 pb-3 border-b border-slate-100">
                    <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600"><Settings className="w-4 h-4" /></span>
                    <span>Pengaturan Teks Beranda / Landing Page & Kontak</span>
                  </h3>
                </div>

                {/* DEDICATED WHATSAPP HOTLINE CONFIGURATION CARD */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-black text-slate-800 text-sm">Nomor WhatsApp Resmi / Hotline Admin</h4>
                        <p className="text-[11px] text-emerald-800">Ubah nomor ini untuk memperbarui seluruh link WhatsApp di Beranda, Flyer Promo, Footer, & Kontak</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Nomor WhatsApp Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nomor WhatsApp / Hotline SPPG (Format: 0812-1768-7815 / 0812xxxxxxxx)
                      </label>
                      <input
                        type="text"
                        value={tempLanding.whatsappNumber || ''}
                        onChange={(e) => setTempLanding({ ...tempLanding, whatsappNumber: e.target.value })}
                        placeholder="0812-1768-7815"
                        className="w-full bg-white border border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/30 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none shadow-sm"
                      />
                    </div>

                    <div className="sm:col-span-4 flex items-end">
                      <a
                        href={formatWhatsAppUrl(tempLanding.whatsappNumber || '0812-1768-7815', 'Tes kirim pesan dari Admin Panel NatNat Fresh Milk...')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
                      >
                        <span>💬 Uji Link WA</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white/90 p-2.5 rounded-xl border border-emerald-100 flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-emerald-700">Preview Link WA Tergenerasi:</span>
                    <code className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-bold">
                      {formatWhatsAppUrl(tempLanding.whatsappNumber || '0812-1768-7815')}
                    </code>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Judul Utama Hero (Landing Title)</label>
                    <input
                      type="text"
                      value={tempLanding.heroTitle}
                      onChange={(e) => setTempLanding({ ...tempLanding, heroTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Sub-judul Deskripsi Hero</label>
                    <textarea
                      rows={3}
                      value={tempLanding.heroSubtitle}
                      onChange={(e) => setTempLanding({ ...tempLanding, heroSubtitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kampanye Gizi Title</label>
                    <input
                      type="text"
                      value={tempLanding.campaignTitle}
                      onChange={(e) => setTempLanding({ ...tempLanding, campaignTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kampanye Gizi Slogan</label>
                    <input
                      type="text"
                      value={tempLanding.campaignSlogan}
                      onChange={(e) => setTempLanding({ ...tempLanding, campaignSlogan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Kampanye Gizi Detail</label>
                    <input
                      type="text"
                      value={tempLanding.campaignDesc}
                      onChange={(e) => setTempLanding({ ...tempLanding, campaignDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stat: Jumlah Kemitraan Dapur</label>
                    <input
                      type="text"
                      value={tempLanding.mitraCount}
                      onChange={(e) => setTempLanding({ ...tempLanding, mitraCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stat: Jumlah Peternak Lokal</label>
                    <input
                      type="text"
                      value={tempLanding.peternakCount}
                      onChange={(e) => setTempLanding({ ...tempLanding, peternakCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Judul Penawaran Freezer Box</label>
                    <input
                      type="text"
                      value={tempLanding.freezerTitle}
                      onChange={(e) => setTempLanding({ ...tempLanding, freezerTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Keterangan Penawaran Freezer Box</label>
                    <textarea
                      rows={2}
                      value={tempLanding.freezerDesc}
                      onChange={(e) => setTempLanding({ ...tempLanding, freezerDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs tracking-wider transition-colors flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Beranda</span>
                  </button>
                </div>
              </form>

              {/* About Us settings */}
              <form onSubmit={handleSaveAboutSettings} className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800 flex items-center space-x-2 pb-3 border-b border-slate-100">
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><Users className="w-4 h-4" /></span>
                    <span>Profil Produsen & Visi Misi (Tentang Kami)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan / Judul Profil</label>
                    <input
                      type="text"
                      value={tempAbout.profilTitle}
                      onChange={(e) => setTempAbout({ ...tempAbout, profilTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap Profil</label>
                    <textarea
                      rows={4}
                      value={tempAbout.profilDesc}
                      onChange={(e) => setTempAbout({ ...tempAbout, profilDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kapasitas Produksi - Judul</label>
                    <input
                      type="text"
                      value={tempAbout.capacityTitle}
                      onChange={(e) => setTempAbout({ ...tempAbout, capacityTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kapasitas Produksi - Nilai</label>
                    <input
                      type="text"
                      value={tempAbout.capacityValue}
                      onChange={(e) => setTempAbout({ ...tempAbout, capacityValue: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Kapasitas Produksi - Deskripsi</label>
                    <input
                      type="text"
                      value={tempAbout.capacityDesc}
                      onChange={(e) => setTempAbout({ ...tempAbout, capacityDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kebersihan Pabrik - Nilai</label>
                    <input
                      type="text"
                      value={tempAbout.hygieneValue}
                      onChange={(e) => setTempAbout({ ...tempAbout, hygieneValue: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sumber Bahan Baku - Nilai</label>
                    <input
                      type="text"
                      value={tempAbout.sourcingValue}
                      onChange={(e) => setTempAbout({ ...tempAbout, sourcingValue: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Judul Visi Utama</label>
                    <input
                      type="text"
                      value={tempAbout.visiTitle}
                      onChange={(e) => setTempAbout({ ...tempAbout, visiTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Isi Visi Utama</label>
                    <textarea
                      rows={2}
                      value={tempAbout.visiDesc}
                      onChange={(e) => setTempAbout({ ...tempAbout, visiDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-bold text-slate-700">Daftar Misi Layanan (Satu misi per baris)</label>
                      <span className="text-[10px] text-slate-400">Tekan Enter untuk membuat misi baru</span>
                    </div>
                    <textarea
                      rows={4}
                      value={misiInputString}
                      onChange={(e) => setMisiInputString(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg p-2.5 font-sans focus:outline-none"
                      placeholder="Masukkan misi pertama...&#10;Masukkan misi kedua..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider transition-colors flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Profil & Misi</span>
                  </button>
                </div>
              </form>

            </div>
          )}


          {/* TAB 1.5: PROMO CAMPAIGN CRUD */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800">Manajemen Media & Banner Promo</h3>
                  <p className="text-xs text-slate-400">Atur kampanye gizi, tutorial video, dan program bagi-bagi freezer harian untuk dapur SPPG di beranda depan.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                    title="Ekspor kode data untuk Vercel / GitHub"
                  >
                    <Code className="w-3.5 h-3.5 text-sky-400" />
                    <span>Sinkronkan ke Vercel / GitHub</span>
                  </button>

                  <button
                    onClick={openAddPromo}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-sm shadow-sky-100"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Promo</span>
                  </button>
                </div>
              </div>

              {/* Vercel Deployment Notice Banner */}
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-4 flex items-start space-x-3 text-xs text-sky-900 shadow-sm">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sky-950">
                    💡 Mengapa Foto / Promo Kembali ke Default di Vercel?
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Foto flyer yang Anda unggah melalui Admin Panel secara otomatis tersimpan di browser komputer Anda (<span className="font-mono bg-sky-100 text-sky-800 px-1 py-0.5 rounded">localStorage</span>). Namun, Vercel merender tampilan publik dari file <span className="font-mono bg-sky-100 text-sky-800 px-1 py-0.5 rounded">src/data.ts</span> di GitHub.
                  </p>
                  <div className="pt-1 flex items-center space-x-2">
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="font-bold text-sky-700 underline hover:text-sky-900 flex items-center space-x-1 text-[11px]"
                    >
                      <span>Klik di sini untuk menyalin Kode Data (`data.ts`) & panduan Vercel</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo List Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="p-4 w-32">Media Preview</th>
                      <th className="p-4">Detail Promo</th>
                      <th className="p-4">Tautan Aksi / CTA</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {promos && promos.length > 0 ? (
                      promos.map((promo) => (
                        <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            {promo.mediaType === 'image' ? (
                              <div className="w-24 aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                  src={promo.mediaUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=120&q=80'}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=120&q=80';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-24 aspect-video rounded-lg bg-slate-900 flex flex-col items-center justify-center text-white border border-slate-800 p-1 text-[8px] text-center overflow-hidden">
                                <Film className="w-4 h-4 text-sky-400 mb-0.5 shrink-0" />
                                <span className="truncate w-full max-w-full font-mono text-[7px] text-slate-300 block">{promo.mediaUrl}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 space-y-1">
                            <h4 className="font-black text-slate-800 text-sm">{promo.title}</h4>
                            <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 max-w-sm font-normal">{promo.description}</p>
                          </td>
                          <td className="p-4 space-y-1">
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-150 text-[10px] rounded text-slate-600 block w-max font-bold">
                              {promo.buttonText || 'Pelajari Selengkapnya'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              Link: {promo.linkUrl || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => togglePromoStatus(promo.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                                promo.isActive
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-slate-50 text-slate-400 border border-slate-100'
                              }`}
                            >
                              {promo.isActive ? 'Aktif' : 'Nonaktif'}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => openEditPromo(promo)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-colors"
                                title="Ubah Promo"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                                title="Hapus Promo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-normal">
                          Tidak ada data promo terdaftar. Klik "+ Tambah Promo" untuk menyisipkan banner perdana.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 2: PRODUCT CATALOG CRUD */}
          {activeTab === 'produk' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800">Manajemen Katalog Produk</h3>
                  <p className="text-xs text-slate-400">Tambah, ubah, dan hapus variasi kemasan susu serta nilai gizinya.</p>
                </div>
                <button
                  onClick={openAddProduct}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              {/* Product list table */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="p-4">Varian Susu</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4">Kemasan & Vol</th>
                      <th className="p-4">Harga / Cup</th>
                      <th className="p-4">Sasaran</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{prod.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prod.type === 'Pasteurisasi' ? 'bg-sky-50 text-sky-600' :
                            prod.type === 'UHT' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {prod.type}
                          </span>
                        </td>
                        <td className="p-4">{prod.packaging} ({prod.volume})</td>
                        <td className="p-4 font-mono font-semibold">Rp {prod.price.toLocaleString('id-ID')}</td>
                        <td className="p-4 text-slate-500 truncate max-w-[150px]" title={prod.targetAudience}>
                          {prod.targetAudience}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-1.5">
                            <button
                              onClick={() => openEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 3: ARTICLES CRUD */}
          {activeTab === 'artikel' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800">Manajemen Publikasi & SOP</h3>
                  <p className="text-xs text-slate-400">Tulis atau edit artikel penyuluhan gizi dan prosedur cold-chain.</p>
                </div>
                <button
                  onClick={openAddArticle}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Artikel</span>
                </button>
              </div>

              {/* Articles table list */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="p-4">Judul Artikel</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Penulis</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {articles.map(art => (
                      <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 max-w-[280px] truncate" title={art.title}>{art.title}</td>
                        <td className="p-4">
                          <span className="bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded text-[10px]">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono">{art.date}</td>
                        <td className="p-4 text-slate-500">{art.author}</td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-1.5">
                            <button
                              onClick={() => openEditArticle(art)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 4: TRACEABILITY / LAB REPORTS CRUD */}
          {activeTab === 'lab_reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800">Manajemen Hasil Lab Batch Produksi</h3>
                  <p className="text-xs text-slate-400">Sertifikasi dan verifikasi kualitas kimia / mikrobiologi susu yang divalidasi harian.</p>
                </div>
                <button
                  onClick={openAddLab}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Analisis Batch</span>
                </button>
              </div>

              {/* Lab reports list */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="p-4">No. Batch</th>
                      <th className="p-4">Tanggal Uji</th>
                      <th className="p-4">Kandungan Lemak</th>
                      <th className="p-4">Kandungan Protein</th>
                      <th className="p-4">Bakteri (SPC)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {labReports.map(lab => (
                      <tr key={lab.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-sky-600">{lab.batchNo}</td>
                        <td className="p-4 font-mono text-slate-500">{lab.testDate}</td>
                        <td className="p-4 font-medium">{lab.fatContent}</td>
                        <td className="p-4 font-medium">{lab.proteinContent}</td>
                        <td className="p-4 text-slate-500 font-mono">{lab.bacteriaCount}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lab.status === 'Lulus Uji' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {lab.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-1.5">
                            <button
                              onClick={() => openEditLab(lab)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLab(lab.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 5: MITRA SPPG CRUD */}
          {activeTab === 'mitra' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800">Manajemen Mitra Dapur SPPG</h3>
                  <p className="text-xs text-slate-400">Pengaturan koordinasi lokasi, penanggung jawab gizi, dan kuota penerima manfaat harian.</p>
                </div>
                <button
                  onClick={openAddMitra}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Mitra</span>
                </button>
              </div>

              {/* Mitra table */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="p-4">Nama Dapur Gizi</th>
                      <th className="p-4">Koordinator</th>
                      <th className="p-4">Telepon</th>
                      <th className="p-4">Wilayah</th>
                      <th className="p-4">Kuota (Cup/Hari)</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {mitraList.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">
                          <div>{m.name}</div>
                          <span className="text-[10px] text-slate-400 block max-w-[200px] truncate font-normal">{m.address}</span>
                        </td>
                        <td className="p-4 font-medium">{m.coordinator}</td>
                        <td className="p-4 font-mono text-slate-500">{m.phone}</td>
                        <td className="p-4 text-slate-600">{m.location}</td>
                        <td className="p-4 font-bold font-mono text-sky-600">{m.dailyQuota.toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-1.5">
                            <button
                              onClick={() => openEditMitra(m)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMitra(m.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 6: ORDERS & COMPLAINTS WORKFLOW */}
          {activeTab === 'orders_tickets' && (
            <div className="space-y-10">
              
              {/* ORDERS section */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800 pb-2 border-b border-slate-100">
                    Daftar & Konfirmasi Status Pesanan Logistik (BAST)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Ubah status armada logistik atau hapus logs pesanan yang bermasalah.</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="p-4">ID Pesanan</th>
                        <th className="p-4">Dapur SPPG</th>
                        <th className="p-4">Susu & Qty</th>
                        <th className="p-4">Tgl Kirim</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ubah Status / BAST</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {orders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-800">{ord.id}</td>
                          <td className="p-4 font-medium">{ord.mitraName}</td>
                          <td className="p-4">
                            <div>{ord.productName}</div>
                            <span className="text-[10px] text-sky-600 font-bold font-mono">{ord.quantity} Cup</span>
                          </td>
                          <td className="p-4 font-mono text-slate-500">{ord.deliveryDate}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                              ord.status === 'Dalam Perjalanan' ? 'bg-sky-50 text-sky-600' :
                              ord.status === 'Dibatalkan' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {ord.status}
                            </span>
                            {ord.signedBy && (
                              <span className="text-[9px] text-slate-400 block mt-1">BAST: {ord.signedBy}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-1.5">
                              <select
                                value={ord.status}
                                onChange={(e) => handleOrderStatusChange(ord.id, e.target.value as any)}
                                className="bg-slate-100 border border-slate-200 rounded-lg p-1 text-[11px] focus:outline-none"
                              >
                                <option value="Dipesan">Dipesan</option>
                                <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                              </select>
                              <button
                                onClick={() => handleDeleteOrder(ord.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TICKETS section */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <h3 className="font-sans font-black text-lg text-slate-800 pb-2 border-b border-slate-100">
                    Pengaduan & Tiket Penjaminan Mutu (QC)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Review laporan aduan susu rusak, perubahan suhu, rasa masam, lalu submit resolusi resmi.</p>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada aduan aktif saat ini. Kualitas mutu terjaga sempurna!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(t => (
                      <div key={t.id} className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50/50 space-y-4 text-xs">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">Tiket: {t.id} • {t.date}</span>
                            <h4 className="font-bold text-slate-800 text-sm mt-0.5">{t.mitraName}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.severity === 'Kritis' || t.severity === 'Tinggi' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600'
                            }`}>
                              Sifat: {t.severity}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              Status: {t.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rincian Aduan:</span>
                          <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold text-[10px] ml-2">{t.type}</span>
                          <p className="text-slate-600 leading-relaxed mt-1">{t.description}</p>
                        </div>

                        {t.resolution && (
                          <div className="bg-emerald-50/45 border border-emerald-100 p-3 rounded-xl text-emerald-800">
                            <strong>Resolusi Resmi QC:</strong>
                            <p className="text-emerald-700/95 mt-0.5">{t.resolution}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap justify-between items-center gap-3 pt-1 border-t border-slate-100/60">
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-500">Ganti Status:</span>
                            <select
                              value={t.status}
                              onChange={(e) => handleTicketStatusChange(t.id, e.target.value as any)}
                              className="bg-white border border-slate-200 rounded-lg p-1 focus:outline-none"
                            >
                              <option value="Baru">Baru</option>
                              <option value="Diproses QC">Diproses QC</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Ditolak">Ditolak</option>
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            {t.status !== 'Selesai' && (
                              <button
                                onClick={() => {
                                  const reso = prompt('Masukkan keterangan penyelesaian aduan / tindakan korektif:');
                                  if (reso) handleTicketResolve(t.id, reso);
                                }}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all"
                              >
                                Tuntaskan Aduan (Resolve)
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTicket(t.id)}
                              className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-lg transition-colors"
                              title="Hapus Tiket"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>


      {/* MODAL 1: PRODUCT MODAL DIALOG */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">FORM INTEGRASI</span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                {editingProduct ? `Edit Varian: ${editingProduct.name}` : 'Tambah Varian Susu Baru'}
              </h2>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Produk Varian *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                    placeholder="Contoh: Susu Pasteurisasi Original"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Produk *</label>
                  <select
                    value={prodForm.type}
                    onChange={(e) => setProdForm({ ...prodForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  >
                    <option value="Pasteurisasi">Pasteurisasi</option>
                    <option value="UHT">UHT</option>
                    <option value="Steril">Steril</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga per Cup (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume Bersih (e.g. 125 ml) *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.volume}
                    onChange={(e) => setProdForm({ ...prodForm, volume: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kemasan (e.g. Cup Gelas Lid) *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.packaging}
                    onChange={(e) => setProdForm({ ...prodForm, packaging: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Kelompok Target Penerima Gizi *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.targetAudience}
                    onChange={(e) => setProdForm({ ...prodForm, targetAudience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                    placeholder="e.g. Siswa SD & PAUD Program MBG"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi & Keunggulan Gizi *</label>
                  <textarea
                    rows={3}
                    required
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5 focus:outline-none"
                    placeholder="Tuliskan spesifikasi detail..."
                  />
                </div>

                {/* Nutrients details */}
                <div className="sm:col-span-2 border-t border-slate-100 pt-4 space-y-3">
                  <span className="font-bold text-slate-800 block">Kandungan Nutrisi (per saji):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">Energi Total (e.g. 88 kcal)</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.energy}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, energy: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Protein Alami (e.g. 4.3 g)</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.protein}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, protein: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Kalsium Murni (e.g. 135 mg)</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.calcium}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, calcium: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Lemak Total (e.g. 6.7 g)</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.totalFat}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, totalFat: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Lemak Jenuh</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.saturatedFat}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, saturatedFat: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Karbohidrat</label>
                      <input
                        type="text"
                        value={prodForm.nutrients.carbohydrates}
                        onChange={(e) => setProdForm({
                          ...prodForm,
                          nutrients: { ...prodForm.nutrients, carbohydrates: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">No Sertifikasi (Pisahkan dengan tanda koma)</label>
                  <input
                    type="text"
                    value={prodCertString}
                    onChange={(e) => setProdCertString(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                    placeholder="BPOM MD 241031001099, Halal ID35110000214820323"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 2: ARTICLE MODAL DIALOG */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsArticleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">PENERBITAN ARTIKEL</span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                {editingArticle ? `Edit Artikel: ${editingArticle.title}` : 'Tulis Publikasi Baru'}
              </h2>
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-5 text-xs text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Judul Artikel *</label>
                  <input
                    type="text"
                    required
                    value={artForm.title}
                    onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                    placeholder="Contoh: Manfaat Protein Susu Terhadap Penurunan Stunting"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Publikasi *</label>
                  <select
                    value={artForm.category}
                    onChange={(e) => setArtForm({ ...artForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  >
                    <option value="Gizi">Gizi</option>
                    <option value="SOP Distribusi">SOP Distribusi</option>
                    <option value="Siaran Pers">Siaran Pers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={artForm.author}
                    onChange={(e) => setArtForm({ ...artForm, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ringkasan Pendek (Summary) *</label>
                  <input
                    type="text"
                    required
                    value={artForm.summary}
                    onChange={(e) => setArtForm({ ...artForm, summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5"
                    placeholder="Ringkasan singkat di halaman depan..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Konten Lengkap Artikel (Mendukung Multi-paragraf) *</label>
                  <textarea
                    rows={8}
                    required
                    value={artForm.content}
                    onChange={(e) => setArtForm({ ...artForm, content: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-xl p-2.5 font-sans focus:outline-none"
                    placeholder="Tulis artikel selengkapnya..."
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold"
                >
                  Penerbitan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 3: LAB REPORTS MODAL DIALOG */}
      {isLabModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsLabModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">SERTIFIKAT MUTU</span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                {editingLab ? `Edit Laporan: ${editingLab.batchNo}` : 'Registrasi Laporan Lab Batch Baru'}
              </h2>
            </div>

            <form onSubmit={handleLabSubmit} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Batch Produksi *</label>
                  <input
                    type="text"
                    required
                    value={labForm.batchNo}
                    onChange={(e) => setLabForm({ ...labForm, batchNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    placeholder="e.g. B-260722-A"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Pengujian Lab *</label>
                  <input
                    type="date"
                    required
                    value={labForm.testDate}
                    onChange={(e) => setLabForm({ ...labForm, testDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kandungan Lemak (e.g. 3.6 %) *</label>
                  <input
                    type="text"
                    required
                    value={labForm.fatContent}
                    onChange={(e) => setLabForm({ ...labForm, fatContent: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kandungan Protein (e.g. 3.4 %) *</label>
                  <input
                    type="text"
                    required
                    value={labForm.proteinContent}
                    onChange={(e) => setLabForm({ ...labForm, proteinContent: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hasil Hitung Bakteri SPC *</label>
                  <input
                    type="text"
                    required
                    value={labForm.bacteriaCount}
                    onChange={(e) => setLabForm({ ...labForm, bacteriaCount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    placeholder="e.g. 8.5 x 10³ CFU/ml"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Uji Sensorik Organoleptik *</label>
                  <select
                    value={labForm.sensoryTest}
                    onChange={(e) => setLabForm({ ...labForm, sensoryTest: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="Sesuai Standar">Sesuai Standar</option>
                    <option value="Tidak Sesuai">Tidak Sesuai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kelulusan *</label>
                  <select
                    value={labForm.status}
                    onChange={(e) => setLabForm({ ...labForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Lulus Uji" className="text-emerald-600 font-bold">Lulus Uji</option>
                    <option value="Gagal Uji" className="text-red-600 font-bold">Gagal Uji</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Sertifikator / Supervisor QC *</label>
                  <input
                    type="text"
                    required
                    value={labForm.certifiedBy}
                    onChange={(e) => setLabForm({ ...labForm, certifiedBy: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLabModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold"
                >
                  Sertifikasi Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 4: MITRA SPPG MODAL DIALOG */}
      {isMitraModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsMitraModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">ADMINISTRASI KEMITRAAN</span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                {editingMitra ? `Edit Mitra: ${editingMitra.name}` : 'Registrasi Mitra Dapur SPPG Baru'}
              </h2>
            </div>

            <form onSubmit={handleMitraSubmit} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama SPPG / Dapur Gizi *</label>
                  <input
                    type="text"
                    required
                    value={mitraForm.name}
                    onChange={(e) => setMitraForm({ ...mitraForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="Contoh: SPPG Kepanjen Kidul"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Koordinator Lapangan *</label>
                  <input
                    type="text"
                    required
                    value={mitraForm.coordinator}
                    onChange={(e) => setMitraForm({ ...mitraForm, coordinator: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="Nama Lengkap"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    value={mitraForm.phone}
                    onChange={(e) => setMitraForm({ ...mitraForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan / Wilayah *</label>
                  <input
                    type="text"
                    required
                    value={mitraForm.location}
                    onChange={(e) => setMitraForm({ ...mitraForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="e.g. Kepanjen, Malang"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kuota Harian (Cup/Hari) *</label>
                  <input
                    type="number"
                    required
                    value={mitraForm.dailyQuota}
                    onChange={(e) => setMitraForm({ 
                      ...mitraForm, 
                      dailyQuota: parseInt(e.target.value) || 0,
                      beneficiariesCount: parseInt(e.target.value) || 0 
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Pengiriman Detail *</label>
                  <textarea
                    rows={2}
                    required
                    value={mitraForm.address}
                    onChange={(e) => setMitraForm({ ...mitraForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                    placeholder="Tuliskan alamat jalan, nomor, RT/RW lengkap..."
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsMitraModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold"
                >
                  Registrasi Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PROMO CAMPAIGN MODAL DIALOG */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-sky-500 animate-pulse" />
                <span>ATUR KAMPANYE PROMO & MEDIA</span>
              </span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                {editingPromo ? `Edit Promo: ${editingPromo.title}` : 'Buat Banner Promo Baru'}
              </h2>
            </div>

            <form onSubmit={handlePromoSubmit} className="space-y-4 text-xs text-left">
              <div className="space-y-3 font-medium">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Judul Promo *</label>
                  <input
                    type="text"
                    required
                    value={promoForm.title}
                    onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    placeholder="Contoh: AMBIL PROMO GRATIS FREEZER RSA"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keterangan / Deskripsi Singkat *</label>
                  <textarea
                    rows={3}
                    required
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                    placeholder="Masukkan detail penawaran promo, syarat kepemilikan, atau deskripsi video kampanye gizi..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipe Media *</label>
                    <select
                      value={promoForm.mediaType}
                      onChange={(e) => setPromoForm({ ...promoForm, mediaType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    >
                      <option value="image">Gambar Banner (Image)</option>
                      <option value="video">Video Embed / URL (Youtube, FB, TikTok, IG)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status Keaktifan *</label>
                    <select
                      value={promoForm.isActive ? 'aktif' : 'nonaktif'}
                      onChange={(e) => setPromoForm({ ...promoForm, isActive: e.target.value === 'aktif' })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    >
                      <option value="aktif">Aktif (Tampilkan di Beranda)</option>
                      <option value="nonaktif">Nonaktif (Sembunyikan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  {promoForm.mediaType === 'image' ? (
                    <div className="space-y-3">
                      <label className="block font-bold text-slate-700">Foto Flyer Promo *</label>
                      
                      {/* Drag & Drop Upload Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                          isDragging
                            ? 'border-sky-500 bg-sky-50 text-sky-600'
                            : promoForm.mediaUrl
                            ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800'
                            : 'border-slate-250 hover:border-sky-400 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
                        }`}
                        onClick={() => document.getElementById('promo-image-file')?.click()}
                      >
                        <input
                          type="file"
                          id="promo-image-file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        
                        {promoForm.mediaUrl ? (
                          <div className="space-y-3 w-full flex flex-col items-center">
                            <div className="relative w-40 aspect-video rounded-xl overflow-hidden border border-emerald-200 shadow-sm bg-white shrink-0">
                              <img
                                src={promoForm.mediaUrl}
                                alt="Flyer Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-[11px] font-bold text-emerald-700 flex items-center justify-center space-x-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span>Foto Flyer Siap Diterbitkan!</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Klik atau tarik foto baru di sini untuk mengganti</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-700">Tarik & Letakkan Foto Flyer di Sini</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Atau klik untuk menelusuri file dari komputer Anda (Maks. 5MB)</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Optional URL input in case they want to link to a web image instead */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-slate-500">Atau gunakan URL Gambar Internet (Opsional)</label>
                          <span className="text-[8px] text-slate-400">Ganti jika ingin menggunakan link luar</span>
                        </div>
                        <input
                          type="text"
                          value={promoForm.mediaUrl.startsWith('data:image') ? '' : promoForm.mediaUrl}
                          onChange={(e) => setPromoForm({ ...promoForm, mediaUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-[10px]"
                          placeholder="https://images.unsplash.com/photo-xxxx..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-slate-700">Link URL Media (Video Embed) *</label>
                        <span className="text-[9px] text-sky-600 font-bold">Mendukung Youtube, FB, Tiktok, IG</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={promoForm.mediaUrl}
                        onChange={(e) => setPromoForm({ ...promoForm, mediaUrl: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                        placeholder="https://www.youtube.com/watch?v=xxxx atau link IG / Tiktok"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 font-normal">
                        Masukkan link video dari Youtube, TikTok, Instagram Reels, Facebook, dll. Sistem akan memuatnya secara otomatis.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teks Tombol Aksi (CTA Button)</label>
                    <input
                      type="text"
                      value={promoForm.buttonText}
                      onChange={(e) => setPromoForm({ ...promoForm, buttonText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      placeholder="Contoh: Ajukan Kemitraan"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tujuan Tombol Aksi (Halaman / URL)</label>
                    <input
                      type="text"
                      value={promoForm.linkUrl}
                      onChange={(e) => setPromoForm({ ...promoForm, linkUrl: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                      placeholder="Contoh: portal, katalog, lacak, kontak, atau link kustom (https://wa.me/...)"
                    />
                    <p className="text-[9px] text-slate-400 mt-1 font-normal">
                      Ketik tab internal (<strong className="text-slate-600">portal, katalog, lacak, kontak, tentang</strong>) atau link URL eksternal kustom.
                    </p>
                  </div>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all shadow-md shadow-sky-100"
                >
                  {editingPromo ? 'Simpan Perubahan' : 'Terbitkan Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EXPORT & VERCEL SYNC MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block flex items-center space-x-1">
                <Code className="w-3.5 h-3.5 text-sky-500" />
                <span>SINKRONISASI DATA DEPLOYMENT VERCEL / GITHUB</span>
              </span>
              <h2 className="font-sans font-black text-xl text-slate-800">
                Ekspor Kode Data Promo & Flyer
              </h2>
            </div>

            {/* Modal Tabs */}
            <div className="flex space-x-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setExportTab('code')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  exportTab === 'code'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Kode TypeScript (`src/data.ts`)</span>
              </button>
              <button
                onClick={() => setExportTab('json')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  exportTab === 'json'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>Backup JSON & Restore</span>
              </button>
            </div>

            {exportTab === 'code' ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-[10px] relative max-h-60 overflow-y-auto border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre-wrap break-all leading-relaxed">
{`export const INITIAL_PROMOS: Promo[] = ${JSON.stringify(promos, null, 2)};`}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                  <div className="text-emerald-900 text-[11px] font-medium">
                    <span className="font-bold block">1-Klik Salin Kode Data Promo:</span>
                    Salin kode di atas lalu buka file <span className="font-mono bg-emerald-100 text-emerald-950 px-1 py-0.5 rounded">src/data.ts</span> di GitHub untuk memperbarui nilai <span className="font-mono font-bold">INITIAL_PROMOS</span>.
                  </div>

                  <button
                    onClick={() => {
                      const code = `export const INITIAL_PROMOS: Promo[] = ${JSON.stringify(promos, null, 2)};`;
                      navigator.clipboard.writeText(code);
                      setCopiedSuccess(true);
                      triggerNotification('Kode INITIAL_PROMOS berhasil disalin!');
                      setTimeout(() => setCopiedSuccess(false), 3000);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center space-x-1.5 shadow-md ${
                      copiedSuccess 
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSuccess ? 'Berhasil Disalin!' : 'Salin Kode TS'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800 flex items-center space-x-1">
                    <Info className="w-4 h-4 text-sky-500" />
                    <span>Langkah Mudah Agar Foto Tampil Permanen di Vercel:</span>
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 font-normal">
                    <li>Klik tombol <strong className="text-slate-800">"Salin Kode TS"</strong> di atas.</li>
                    <li>Buka repository GitHub Anda dan edit file <strong className="text-slate-800">src/data.ts</strong>.</li>
                    <li>Ganti variabel <strong className="text-slate-800">export const INITIAL_PROMOS = [...]</strong> dengan kode yang baru Anda salin.</li>
                    <li>Simpan (Commit changes) di GitHub. Vercel secara otomatis akan memuat foto flyer & promo terbaru untuk seluruh pengunjung web!</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Anda juga dapat mengunduh seluruh promo dan foto flyer ini sebagai file JSON cadangan untuk disimpan di HP / Komputer, atau diimpor kembali kapan saja.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                        <Download className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-800 text-xs">Unduh Backup JSON</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Simpan konfigurasi promo saat ini ke file .json</p>
                    </div>

                    <button
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(promos, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute("href", dataStr);
                        downloadAnchor.setAttribute("download", "natnat_promos_backup.json");
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                        triggerNotification('File backup natnat_promos_backup.json diunduh!');
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File .JSON</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                        <Upload className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-800 text-xs">Impor File Backup JSON</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Muat ulang data promo dari file .json cadangan</p>
                    </div>

                    <label className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih File .JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const imported = JSON.parse(event.target?.result as string);
                                if (Array.isArray(imported)) {
                                  setPromos(imported);
                                  triggerNotification('Data promo berhasil diimpor!');
                                  setIsExportModalOpen(false);
                                } else {
                                  alert('Format file JSON tidak valid.');
                                }
                              } catch {
                                alert('Gagal membaca file JSON.');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Tutup Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
