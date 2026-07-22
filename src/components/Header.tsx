import React, { useState } from 'react';
import { Milk, Menu, X, ShieldAlert, KeyRound, Building2 } from 'lucide-react';
import logoImg from '../assets/images/logo_1784628827555.jpg';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openPortal: () => void;
}

export default function Header({ activeTab, setActiveTab, openPortal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'promo', label: 'Promo Gizi' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'katalog', label: 'Katalog & Gizi' },
    { id: 'lacak', label: 'Lacak Susu (Traceability)' },
    { id: 'edukasi', label: 'Edukasi & Dokumen' },
    { id: 'kontak', label: 'Hubungi Kami' },
  ];

  const handleNavigation = (id: string) => {
    if (id === 'promo') {
      setActiveTab('beranda');
      setIsOpen(false);
      setTimeout(() => {
        const promoSection = document.getElementById('promo-section');
        if (promoSection) {
          promoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      setActiveTab(id);
      setIsOpen(false);
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Brand */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => { handleNavigation('beranda'); }}
          >
            <img 
              src={logoImg} 
              alt="NatNat Fresh Milk" 
              className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavigation(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                  activeTab === item.id || (item.id === 'promo' && activeTab === 'beranda' && typeof window !== 'undefined' && window.location.hash === '#promo-section')
                    ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100/50'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Portal SPPG Action */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <button
              id="nav-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-sky-100 text-sky-700 font-bold border border-sky-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:scale-[1.02]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-sky-500" />
              <span>Admin Panel</span>
            </button>

            <button
              id="nav-portal-btn"
              onClick={openPortal}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-md ${
                activeTab === 'portal'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-blue-200 ring-2 ring-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200 hover:scale-[1.02]'
              }`}
            >
              <KeyRound className="w-4 h-4 text-sky-300" />
              <span>Portal SPPG</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center justify-center p-2 rounded-lg text-xs font-semibold px-2.5 transition-all ${
                activeTab === 'admin' ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Admin
            </button>
            <button
              onClick={openPortal}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-900 text-white text-xs font-semibold px-3"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              Portal
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div id="mobile-navigation" className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-500'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsOpen(false);
              }}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-sky-500" />
              <span>Masuk Admin Panel (Sistem CMS)</span>
            </button>
            <button
              onClick={() => {
                openPortal();
                setIsOpen(false);
              }}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-md transition-all"
            >
              <KeyRound className="w-4 h-4 text-sky-300" />
              <span>Masuk Portal SPPG (Dashboard)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
