import React, { useState, useEffect, useRef } from 'react';
import { Order, DeliveryLog, Ticket, LabReport, MitraSPPG, Product } from '../types';
import { ShieldCheck, LogIn, LogOut, KeyRound, Truck, ShoppingCart, RefreshCw, CheckCircle2, AlertTriangle, FilePen, Activity, FileSpreadsheet, Plus, HelpCircle, ThermometerSnowflake, FileSignature, ArrowRight } from 'lucide-react';
import { useDBSync } from '../hooks/useDBSync';

interface PortalSPPGProps {
  products: Product[];
  mitraList: MitraSPPG[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  deliveries: DeliveryLog[];
  setDeliveries: React.Dispatch<React.SetStateAction<DeliveryLog[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  labReports: LabReport[];
  setLabReports: React.Dispatch<React.SetStateAction<LabReport[]>>;
}

export default function PortalSPPG({
  products,
  mitraList,
  orders,
  setOrders,
  deliveries,
  setDeliveries,
  tickets,
  setTickets,
  labReports,
  setLabReports
}: PortalSPPGProps) {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'operator' | 'qc' | 'driver'; id: string; targetId?: string } | null>(null);
  const { syncOrder, syncDelivery, syncTicket, useDB } = useDBSync();

  // SPPG Form states
  const [orderProduct, setOrderProduct] = useState(() => products[0]?.id || 'prod-01');
  const [orderQty, setOrderQty] = useState(500);
  const [orderDate, setOrderDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Signature canvas states for BAST signing
  const [signingOrder, setSigningOrder] = useState<Order | null>(null);
  const [signName, setSignName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // QC Supervisor states
  const [newBatchNo, setNewBatchNo] = useState('B-260722-A');
  const [newBacteria, setNewBacteria] = useState('8.2 x 10³ CFU/ml');
  const [newFat, setNewFat] = useState('3.6 %');
  const [newProtein, setNewProtein] = useState('3.4 %');
  const [resolvingTicket, setResolvingTicket] = useState<Ticket | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Driver Simulation States
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryLog | null>(null);
  const [simulatedTemp, setSimulatedTemp] = useState(3.0);

  // Sync state helper that writes to props, localStorage, and Supabase
  const syncDB = (updatedOrders: Order[], updatedDeliveries: DeliveryLog[], updatedTickets: Ticket[]) => {
    setOrders(updatedOrders);
    setDeliveries(updatedDeliveries);
    setTickets(updatedTickets);

    localStorage.setItem('natnat_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('natnat_deliveries', JSON.stringify(updatedDeliveries));
    localStorage.setItem('natnat_tickets', JSON.stringify(updatedTickets));

    // Sync new/updated orders to Supabase
    if (useDB) {
      updatedOrders.forEach(o => syncOrder(o, 'insert').catch(() => {}));
      updatedDeliveries.forEach(d => syncDelivery(d, 'insert').catch(() => {}));
      updatedTickets.forEach(t => syncTicket(t, 'insert').catch(() => {}));
    }
  };

  // Sign BAST Handler
  const handleSignBAST = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingOrder) return;
    if (!signName.trim()) {
      alert('Mohon masukkan nama penerima BAST!');
      return;
    }

    // Capture simulated signature data
    let signatureBase64 = 'signed_marker';
    if (canvasRef.current) {
      signatureBase64 = canvasRef.current.toDataURL();
    }

    const updatedOrders = orders.map(o => {
      if (o.id === signingOrder.id) {
        return {
          ...o,
          status: 'Selesai' as const,
          signedBy: signName,
          signatureData: signatureBase64,
          receivedDate: new Date().toLocaleString('id-ID')
        };
      }
      return o;
    });

    // Also set delivery logs status to finished
    const updatedDeliveries = deliveries.map(d => {
      if (d.orderId === signingOrder.id) {
        return { ...d, status: 'Selesai' as const };
      }
      return d;
    });

    syncDB(updatedOrders, updatedDeliveries, tickets);
    setSigningOrder(null);
    setSignName('');
    alert('Berita Acara Serah Terima (BAST) Berhasil Ditandatangani secara Digital!');
  };

  // Setup canvas drawing logic
  useEffect(() => {
    if (signingOrder && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0284c7'; // sky-600
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        // Clear previous drawing
        ctx.clearRect(0,0, canvas.width, canvas.height);
      }
    }
  }, [signingOrder]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Place Order Handler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.targetId) return;
    if (orderQty <= 0) {
      alert('Jumlah kuota harus lebih besar dari 0!');
      return;
    }

    const currentMitra = mitraList.find(m => m.id === currentUser.targetId);
    const selectedProd = products.find(p => p.id === orderProduct);

    if (!currentMitra || !selectedProd) return;

    const newOrder: Order = {
      id: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      mitraId: currentMitra.id,
      mitraName: currentMitra.name,
      productName: selectedProd.name,
      quantity: orderQty,
      deliveryDate: orderDate || new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // tomorrow
      status: 'Dipesan',
      orderDate: new Date().toISOString().split('T')[0],
      notes: orderNotes
    };

    const updatedOrders = [newOrder, ...orders];
    syncDB(updatedOrders, deliveries, tickets);
    setOrderQty(currentMitra.dailyQuota);
    setOrderNotes('');
    alert('Pemesanan Kebutuhan Susu Harian Berhasil Dijadwalkan!');
  };

  // Dispatch Order Handler (QC Supervisor action)
  const handleDispatchOrder = (order: Order) => {
    const updatedOrders = orders.map(o => {
      if (o.id === order.id) {
        return { ...o, status: 'Dalam Perjalanan' as const };
      }
      return o;
    });

    const newDelivery: DeliveryLog = {
      id: `TRK-${new Date().toISOString().slice(2,10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      driverName: 'Slamet Riyadi',
      vehicleNo: 'N 9401 U (Reefer Truck 2)',
      departureTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Dalam Perjalanan',
      currentTemp: 2.5,
      tempHistory: [
        { time: '05:00', temp: 2.2 },
        { time: '05:15', temp: 2.4 },
        { time: '05:30', temp: 2.5 }
      ],
      routeCoordinates: [
        { lat: -7.8923, lng: 112.6512 }, // Factory
        { lat: -7.8950, lng: 112.6530 }
      ],
      currentStepIndex: 1
    };

    const updatedDeliveries = [newDelivery, ...deliveries];
    syncDB(updatedOrders, updatedDeliveries, tickets);
    alert(`Order ${order.id} berhasil diberangkatkan! Reefer Truck Log aktif.`);
  };

  // Resolve Complaint Ticket (QC supervisor action)
  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket || !resolutionText.trim()) return;

    const updatedTickets = tickets.map(t => {
      if (t.id === resolvingTicket.id) {
        return {
          ...t,
          status: 'Selesai' as const,
          resolution: resolutionText
        };
      }
      return t;
    });

    syncDB(orders, deliveries, updatedTickets);
    setResolvingTicket(null);
    setResolutionText('');
    alert('Tiket Aduan Kualitas Berhasil Diselesaikan!');
  };

  // Simulate Driver logging temperature
  const handleDriverLogTemp = () => {
    if (!selectedDelivery) return;
    const newTemp = parseFloat(simulatedTemp.toFixed(1));
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const updatedDeliveries = deliveries.map(d => {
      if (d.id === selectedDelivery.id) {
        return {
          ...d,
          currentTemp: newTemp,
          tempHistory: [...d.tempHistory, { time: timeNow, temp: newTemp }]
        };
      }
      return d;
    });

    syncDB(orders, updatedDeliveries, tickets);
    const found = updatedDeliveries.find(d => d.id === selectedDelivery.id);
    if (found) setSelectedDelivery(found);
    alert(`Suhu ruangan pendingin truk berhasil dilaporkan: ${newTemp}°C`);
  };

  return (
    <div id="portal-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Header / Intro */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Portal Otorisasi Mitra SPPG
        </span>
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-800 tracking-tight leading-tight">
          Sistem Pengawasan Logistik & Mutu Susu Nasional
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Sistem internal terproteksi khusus untuk mencatatkan rencana kebutuhan susu harian, mengawasi suhu kompartemen pendingin selama distribusi, serta penandatanganan Berita Acara (BAST) digital.
        </p>
      </section>

      {/* 2. Login Page Switcher if not logged in */}
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="font-sans font-black text-lg text-slate-800">Otorisasi Simulasi Akun</h3>
            <p className="text-xs text-slate-400">Silakan pilih salah satu profil akun simulasi untuk menguji sistem</p>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Budi Santoso, S.Gz',
                role: 'operator' as const,
                title: 'Koordinator SPPG Singosari 01',
                desc: 'Melakukan pemesanan, pengajuan klaim freezer, dan penandatanganan BAST digital.',
                id: 'usr-01',
                targetId: 'mitra-01'
              },
              {
                name: 'Hendra Wijaya, M.Si',
                role: 'qc' as const,
                title: 'Lab QC Supervisor Pabrik',
                desc: 'Melihat log suhu reefer truck, melepas armada pengantaran, dan meresolusi aduan.',
                id: 'usr-02'
              },
              {
                name: 'Slamet Riyadi',
                role: 'driver' as const,
                title: 'Driver Reefer Truck 2',
                desc: 'Melaporkan update pembacaan suhu cold-chain selama perjalanan.',
                id: 'usr-03'
              }
            ].map((usr) => (
              <button
                key={usr.id}
                onClick={() => {
                  setCurrentUser(usr);
                  // Auto-populate order inputs
                  if (usr.role === 'operator') {
                    const currentMitra = mitraList.find(m => m.id === usr.targetId);
                    if (currentMitra) {
                      setOrderQty(currentMitra.dailyQuota);
                    }
                  }
                }}
                className="w-full text-left p-4 rounded-2xl border border-slate-200/80 hover:border-sky-400 hover:bg-sky-50/30 transition-all flex items-start space-x-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-600 shrink-0">
                  {usr.role === 'operator' ? <ShoppingCart className="w-5 h-5" /> :
                   usr.role === 'qc' ? <ShieldCheck className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">{usr.name}</span>
                  <span className="text-[10px] font-semibold text-sky-600 uppercase block tracking-wider">{usr.title}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">{usr.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] text-amber-700 leading-relaxed">
            ⚠️ **Catatan Simulasi**: Sistem ini menggunakan local storage browser. Data pesanan baru, laporan suhu, tiket komplain, dan tanda tangan digital Anda akan disimpan dan diperbarui secara real-time.
          </div>
        </div>
      ) : (
        /* Logged In Portal Dashboard Dashboard Container */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          {/* Active User Banner Top Bar */}
          <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs text-slate-400 font-mono">Sistem Logistik SPPG • Akun Simulasi</span>
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h4 className="font-bold text-sm">{currentUser.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-[9px] font-bold text-sky-400 uppercase tracking-widest">{currentUser.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Portal</span>
            </button>
          </div>

          {/* Core Panel Content by User Roles */}
          <div className="p-6 sm:p-8">
            
            {/* ----------------- operator VIEW ----------------- */}
            {currentUser.role === 'operator' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Intro status card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unit Gizi Anda</span>
                    <strong className="text-slate-800 text-sm block mt-1">SPPG Singosari 01 (Dapur Sentral)</strong>
                    <span className="text-xs text-slate-400 block mt-0.5">Kapasitas: 1.200 Anak/hari</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Freezer Box</span>
                    <strong className="text-slate-800 text-sm block mt-1">65% Tercapai</strong>
                    <span className="text-xs text-slate-400 block mt-0.5">78.000 / 120.000 Cup</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Mesin Freezer SPPG</span>
                      <strong className="text-emerald-800 text-sm block mt-1">Suhu Chiller: 2.8°C</strong>
                      <span className="text-xs text-emerald-600 block mt-0.5">Status: Aman & Higienis</span>
                    </div>
                    <ThermometerSnowflake className="w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Order Form */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4">
                    <h3 className="font-sans font-black text-base text-slate-800 flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-sky-500" />
                      <span>Jadwalkan Alokasi Susu Harian</span>
                    </h3>
                    <p className="text-xs text-slate-500">Buat permohonan pasokan harian susu bagi penerima manfaat MBG di wilayah Anda.</p>
                    
                    <form onSubmit={handlePlaceOrder} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Varian Susu</label>
                        <select
                          value={orderProduct}
                          onChange={(e) => setOrderProduct(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Kuantitas (Cup)</label>
                          <input
                            type="number"
                            value={orderQty}
                            onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Tanggal Kirim</label>
                          <input
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Instruksi Khusus Dapur</label>
                        <textarea
                          rows={2}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Contoh: Kirim sebelum jam 05.30 pagi."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none text-slate-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Kirim Jadwal Pasokan
                      </button>
                    </form>
                  </div>

                  {/* List of active orders and BAST Signings */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-sans font-black text-base text-slate-800 flex items-center space-x-2">
                      <FileSignature className="w-5 h-5 text-sky-500" />
                      <span>Daftar Order & Serah Terima Barang (BAST)</span>
                    </h3>

                    <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2">
                      {orders.filter(o => o.mitraId === currentUser.targetId).map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3.5">
                          <div className="flex justify-between items-start text-xs">
                            <div>
                              <span className="text-[9px] text-slate-400 font-mono block">ORD ID: {order.id}</span>
                              <strong className="text-slate-800 text-xs">{order.productName}</strong>
                              <span className="block text-slate-500 font-medium">Qty: {order.quantity} Cup • Kirim: {order.deliveryDate}</span>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                              order.status === 'Dipesan' ? 'bg-amber-50 text-amber-600' :
                              order.status === 'Dalam Perjalanan' ? 'bg-blue-50 text-blue-600 animate-pulse' :
                              order.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Action area: if status is Dalam Perjalanan, let user sign */}
                          {order.status === 'Dalam Perjalanan' && (
                            <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 flex justify-between items-center text-xs">
                              <span className="text-sky-800 font-medium">🚚 Armada telah dikirim. Suhu pendingin terverifikasi dingin.</span>
                              <button
                                onClick={() => setSigningOrder(order)}
                                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0"
                              >
                                Tanda Tangan BAST
                              </button>
                            </div>
                          )}

                          {order.status === 'Selesai' && (
                            <div className="text-[10px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-50">
                              <span>Diterima oleh: <strong>{order.signedBy}</strong></span>
                              <span>Pukul: {order.receivedDate}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Digital Signature Popup Modal */}
                {signingOrder && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSignBAST} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
                      <h3 className="font-sans font-black text-lg text-slate-800">Tanda Tangan Serah Terima (BAST)</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Silakan tuliskan tanda tangan digital Anda di area di bawah ini sebagai bukti konfirmasi penerimaan susu dalam keadaan dingin dan steril.
                      </p>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={380}
                          height={160}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="bg-slate-50 cursor-crosshair w-full"
                          style={{ height: '160px' }}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Lengkap Penerima</label>
                        <input
                          type="text"
                          required
                          value={signName}
                          onChange={(e) => setSignName(e.target.value)}
                          placeholder="Masukkan nama Anda (misal: Budi Santoso)"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSigningOrder(null)}
                          className="flex-1 py-2 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors"
                        >
                          Kirim BAST
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- QC SUPERVISOR VIEW ----------------- */}
            {currentUser.role === 'qc' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Pesanan Masuk</span>
                    <span className="text-xl font-bold text-slate-800 block mt-1">
                      {orders.filter(o => o.status === 'Dipesan').length} Order
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Truk dalam Perjalanan</span>
                    <span className="text-xl font-bold text-sky-600 block mt-1">
                      {deliveries.filter(d => d.status === 'Dalam Perjalanan').length} Reefer
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Tiket QC Aktif</span>
                    <span className="text-xl font-bold text-rose-600 block mt-1">
                      {tickets.filter(t => t.status !== 'Selesai').length} Aduan
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Batch Selesai Diuji</span>
                    <span className="text-xl font-bold text-emerald-600 block mt-1">3 Lulus</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Incoming orders queue to dispatch */}
                  <div className="lg:col-span-6 bg-slate-50 p-5 sm:p-6 rounded-2xl space-y-4">
                    <h3 className="font-sans font-black text-sm uppercase text-slate-800 border-b border-slate-200 pb-2">Antrean Order & Lepas Truk</h3>
                    
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {orders.filter(o => o.status === 'Dipesan').length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Tidak ada order masuk baru harian.</p>
                      ) : (
                        orders.filter(o => o.status === 'Dipesan').map(o => (
                          <div key={o.id} className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex justify-between items-center text-xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-400 font-mono block">ID: {o.id}</span>
                              <strong className="text-slate-800 text-xs block">{o.mitraName}</strong>
                              <span>{o.productName} • <strong>{o.quantity} Cup</strong></span>
                            </div>

                            <button
                              onClick={() => handleDispatchOrder(o)}
                              className="px-3 py-1.5 rounded bg-slate-900 text-sky-400 hover:text-white font-bold text-[10px] uppercase transition-colors"
                            >
                              Dispatch 🚚
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Temperature Logs Real-Time Tracking simulation */}
                  <div className="lg:col-span-6 bg-slate-50 p-5 sm:p-6 rounded-2xl space-y-4">
                    <h3 className="font-sans font-black text-sm uppercase text-slate-800 border-b border-slate-200 pb-2">Visual Monitoring Rantai Dingin</h3>
                    
                    {deliveries.filter(d => d.status === 'Dalam Perjalanan').length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Tidak ada pengiriman armada aktif saat ini.</p>
                    ) : (
                      <div className="space-y-4">
                        {deliveries.filter(d => d.status === 'Dalam Perjalanan').map(d => (
                          <div key={d.id} className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3">
                            <div className="flex justify-between text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-slate-400">ARMADA:</span>
                                <strong className="text-slate-800 block">{d.vehicleNo}</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400">SUHU AKHIR:</span>
                                <strong className={`block ${d.currentTemp > 4.0 ? 'text-red-500 animate-pulse font-black' : 'text-sky-600'}`}>
                                  {d.currentTemp}°C
                                </strong>
                              </div>
                            </div>

                            {/* Simulated SVG Graph of Temperature */}
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono text-slate-400">Grafik Suhu (Max 4.0°C)</span>
                              <div className="bg-slate-900 rounded-lg p-2 flex items-end justify-between h-20 space-x-1 border border-slate-800">
                                {d.tempHistory.map((h, i) => (
                                  <div key={i} className="flex-1 flex flex-col items-center">
                                    {/* Bar representing temperature */}
                                    <div 
                                      className={`w-3 rounded-t ${h.temp > 4.0 ? 'bg-red-500' : 'bg-sky-400'}`}
                                      style={{ height: `${Math.min(100, (h.temp / 6) * 100)}%` }}
                                      title={`Suhu: ${h.temp} C`}
                                    />
                                    <span className="text-[8px] text-slate-500 font-mono mt-1">{h.time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Complaint ticket response board */}
                <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-sans font-black text-sm uppercase text-slate-800 border-b border-slate-200 pb-2">Resolusi Cepat Pengaduan Gizi</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets.filter(t => t.status !== 'Selesai').length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Tidak ada tiket pengaduan aktif yang memerlukan respon.</p>
                    ) : (
                      tickets.filter(t => t.status !== 'Selesai').map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3 text-xs">
                          <div className="flex justify-between">
                            <strong>{t.mitraName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{t.id}</span>
                          </div>
                          <p className="text-slate-600 italic">"{t.description}"</p>
                          <button
                            onClick={() => {
                              setResolvingTicket(t);
                              setResolutionText(`Telah diproses oleh Lab QC. Penggantian susu baru gratis disetujui, dikirim via kloter reefer selanjutnya.`);
                            }}
                            className="w-full py-1.5 rounded bg-slate-900 text-white font-bold text-[10px] uppercase hover:bg-slate-800 transition-colors"
                          >
                            Tulis Resolusi QC & Selesaikan
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resolution input modal dialog */}
                {resolvingTicket && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleResolveTicket} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
                      <h3 className="font-sans font-black text-base text-slate-800">Resolusi Aduan QC: {resolvingTicket.id}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Tuliskan tindakan korektif dan penanganan kualitas yang disetujui untuk dapur SPPG **{resolvingTicket.mitraName}**.
                      </p>

                      <textarea
                        rows={3}
                        required
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1"
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setResolvingTicket(null)}
                          className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          Kirim & Simpan Selesai
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- DRIVER VIEW ----------------- */}
            {currentUser.role === 'driver' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h3 className="font-sans font-black text-sm text-slate-800">Panel Driver: Slamet Riyadi</h3>
                  <p className="text-xs text-slate-500">Pilih salah satu armada truk Anda yang sedang dalam pengiriman untuk melaporkan data log suhu pendingin terbaru.</p>
                </div>

                {deliveries.filter(d => d.status === 'Dalam Perjalanan').length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">Tidak ada penugasan pengantaran aktif hari ini.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* List of deliveries */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Pilih Penugasan Truk</span>
                      {deliveries.filter(d => d.status === 'Dalam Perjalanan').map(d => (
                        <button
                          key={d.id}
                          onClick={() => {
                            setSelectedDelivery(d);
                            setSimulatedTemp(d.currentTemp);
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                            selectedDelivery?.id === d.id
                              ? 'border-sky-400 bg-sky-50/20'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <div className="text-xs">
                            <strong className="text-slate-800 block">{d.vehicleNo}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {d.id} • Order: {d.orderId}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-sky-600">{d.currentTemp}°C</span>
                        </button>
                      ))}
                    </div>

                    {/* Temp logger form */}
                    {selectedDelivery ? (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Log Pembacaan Suhu Truk</span>
                        
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div>
                            <strong className="text-xs text-slate-800">{selectedDelivery.vehicleNo}</strong>
                            <span className="text-[10px] text-slate-400 block font-mono">Kirim pagi sebelum jam 06:00 WIB</span>
                          </div>
                          <span className="text-lg font-black text-sky-600">{selectedDelivery.currentTemp}°C</span>
                        </div>

                        {/* Slide Simulation or button */}
                        <div className="space-y-3">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Geser / Ubah Pembacaan Suhu (°C)</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="0.5"
                              max="6.0"
                              step="0.1"
                              value={simulatedTemp}
                              onChange={(e) => setSimulatedTemp(parseFloat(e.target.value))}
                              className="flex-1 accent-sky-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <span className={`text-xs font-mono font-bold p-1 px-2.5 rounded ${
                              simulatedTemp > 4.0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-sky-100 text-sky-600'
                            }`}>{simulatedTemp}°C</span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic leading-snug">
                            💡 **Ketentuan Mutu**: Laporkan jika suhu melebihi batas ideal **4.0°C** agar sistem pendingin kompartemen dapat ditinjau ulang oleh tim mekanik.
                          </p>
                        </div>

                        <button
                          onClick={handleDriverLogTemp}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Laporkan Suhu Log Baru
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-8 text-xs text-slate-400 italic">
                        Pilih armada truk di sebelah kiri untuk melihat panel sensor log suhu.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
