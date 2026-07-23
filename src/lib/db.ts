import { supabase } from './supabase';
import type { Product, MitraSPPG, Article, LabReport, Order, DeliveryLog, Ticket, Promo } from '../types';

// Supabase integration - ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel

// =============================================
// Products
// =============================================
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('fetchProducts error:', error); return []; }
  return (data || []).map(rowToProduct);
}

export async function insertProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const id = `prod-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('products')
    .insert({ ...product, id })
    .select()
    .single();
  if (error) { console.error('insertProduct error:', error); return null; }
  return rowToProduct(data);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateProduct error:', error); return null; }
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) { console.error('deleteProduct error:', error); return false; }
  return true;
}

// =============================================
// Mitra SPPG
// =============================================
export async function fetchMitra(): Promise<MitraSPPG[]> {
  const { data, error } = await supabase
    .from('mitra_sppg')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('fetchMitra error:', error); return []; }
  return (data || []).map(rowToMitra);
}

export async function insertMitra(mitra: Omit<MitraSPPG, 'id'>): Promise<MitraSPPG | null> {
  const id = `mitra-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('mitra_sppg')
    .insert({ ...mitra, id })
    .select()
    .single();
  if (error) { console.error('insertMitra error:', error); return null; }
  return rowToMitra(data);
}

export async function updateMitra(id: string, mitra: Partial<MitraSPPG>): Promise<MitraSPPG | null> {
  const { data, error } = await supabase
    .from('mitra_sppg')
    .update({ ...mitra, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateMitra error:', error); return null; }
  return rowToMitra(data);
}

export async function deleteMitra(id: string): Promise<boolean> {
  const { error } = await supabase.from('mitra_sppg').delete().eq('id', id);
  if (error) { console.error('deleteMitra error:', error); return false; }
  return true;
}

// =============================================
// Articles
// =============================================
export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error('fetchArticles error:', error); return []; }
  return (data || []).map(rowToArticle);
}

export async function insertArticle(article: Omit<Article, 'id'>): Promise<Article | null> {
  const id = `art-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('articles')
    .insert({ ...article, id })
    .select()
    .single();
  if (error) { console.error('insertArticle error:', error); return null; }
  return rowToArticle(data);
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...article, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateArticle error:', error); return null; }
  return rowToArticle(data);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) { console.error('deleteArticle error:', error); return false; }
  return true;
}

// =============================================
// Lab Reports
// =============================================
export async function fetchLabReports(): Promise<LabReport[]> {
  const { data, error } = await supabase
    .from('lab_reports')
    .select('*')
    .order('test_date', { ascending: false });
  if (error) { console.error('fetchLabReports error:', error); return []; }
  return (data || []).map(rowToLabReport);
}

export async function insertLabReport(report: Omit<LabReport, 'id'>): Promise<LabReport | null> {
  const id = `lab-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('lab_reports')
    .insert({ ...report, id })
    .select()
    .single();
  if (error) { console.error('insertLabReport error:', error); return null; }
  return rowToLabReport(data);
}

export async function updateLabReport(id: string, report: Partial<LabReport>): Promise<LabReport | null> {
  const { data, error } = await supabase
    .from('lab_reports')
    .update({ ...report, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateLabReport error:', error); return null; }
  return rowToLabReport(data);
}

export async function deleteLabReport(id: string): Promise<boolean> {
  const { error } = await supabase.from('lab_reports').delete().eq('id', id);
  if (error) { console.error('deleteLabReport error:', error); return false; }
  return true;
}

// =============================================
// Orders
// =============================================
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false });
  if (error) { console.error('fetchOrders error:', error); return []; }
  return (data || []).map(rowToOrder);
}

export async function insertOrder(order: Omit<Order, 'id'>): Promise<Order | null> {
  const id = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('orders')
    .insert({ ...order, id })
    .select()
    .single();
  if (error) { console.error('insertOrder error:', error); return null; }
  return rowToOrder(data);
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...order, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateOrder error:', error); return null; }
  return rowToOrder(data);
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) { console.error('deleteOrder error:', error); return false; }
  return true;
}

// =============================================
// Deliveries
// =============================================
export async function fetchDeliveries(): Promise<DeliveryLog[]> {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchDeliveries error:', error); return []; }
  return (data || []).map(rowToDelivery);
}

export async function insertDelivery(delivery: Omit<DeliveryLog, 'id'>): Promise<DeliveryLog | null> {
  const id = `TRK-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('deliveries')
    .insert({ ...delivery, id })
    .select()
    .single();
  if (error) { console.error('insertDelivery error:', error); return null; }
  return rowToDelivery(data);
}

export async function updateDelivery(id: string, delivery: Partial<DeliveryLog>): Promise<DeliveryLog | null> {
  const { data, error } = await supabase
    .from('deliveries')
    .update({ ...delivery, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateDelivery error:', error); return null; }
  return rowToDelivery(data);
}

export async function deleteDelivery(id: string): Promise<boolean> {
  const { error } = await supabase.from('deliveries').delete().eq('id', id);
  if (error) { console.error('deleteDelivery error:', error); return false; }
  return true;
}

// =============================================
// Tickets
// =============================================
export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error('fetchTickets error:', error); return []; }
  return (data || []).map(rowToTicket);
}

export async function insertTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket | null> {
  const id = `TCK-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('tickets')
    .insert({ ...ticket, id })
    .select()
    .single();
  if (error) { console.error('insertTicket error:', error); return null; }
  return rowToTicket(data);
}

export async function updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .update({ ...ticket, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateTicket error:', error); return null; }
  return rowToTicket(data);
}

export async function deleteTicket(id: string): Promise<boolean> {
  const { error } = await supabase.from('tickets').delete().eq('id', id);
  if (error) { console.error('deleteTicket error:', error); return false; }
  return true;
}

// =============================================
// Promos
// =============================================
export async function fetchPromos(): Promise<Promo[]> {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('fetchPromos error:', error); return []; }
  return (data || []).map(rowToPromo);
}

export async function insertPromo(promo: Omit<Promo, 'id'>): Promise<Promo | null> {
  const id = `promo-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from('promos')
    .insert({ ...promo, id })
    .select()
    .single();
  if (error) { console.error('insertPromo error:', error); return null; }
  return rowToPromo(data);
}

export async function updatePromo(id: string, promo: Partial<Promo>): Promise<Promo | null> {
  const { data, error } = await supabase
    .from('promos')
    .update({ ...promo, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updatePromo error:', error); return null; }
  return rowToPromo(data);
}

export async function deletePromo(id: string): Promise<boolean> {
  const { error } = await supabase.from('promos').delete().eq('id', id);
  if (error) { console.error('deletePromo error:', error); return false; }
  return true;
}

// =============================================
// Landing Settings
// =============================================
export async function fetchLandingSettings(): Promise<Record<string, any> | null> {
  const { data, error } = await supabase
    .from('landing_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) { console.error('fetchLandingSettings error:', error); return null; }
  return data || null;
}

export async function upsertLandingSettings(settings: Record<string, any>): Promise<boolean> {
  const { error } = await supabase
    .from('landing_settings')
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
  if (error) { console.error('upsertLandingSettings error:', error); return false; }
  return true;
}

// =============================================
// About Settings
// =============================================
export async function fetchAboutSettings(): Promise<Record<string, any> | null> {
  const { data, error } = await supabase
    .from('about_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) { console.error('fetchAboutSettings error:', error); return null; }
  return data || null;
}

export async function upsertAboutSettings(settings: Record<string, any>): Promise<boolean> {
  const { error } = await supabase
    .from('about_settings')
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
  if (error) { console.error('upsertAboutSettings error:', error); return false; }
  return true;
}

// =============================================
// Seed initial data
// =============================================
export async function seedInitialData(): Promise<void> {
  // Check if data already exists
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  if (productCount && productCount > 0) return; // Already seeded

  // Import and seed all initial data
  const { PRODUCTS, MITRA_SPPG, ARTICLES, LAB_REPORTS, INITIAL_ORDERS, INITIAL_DELIVERIES, INITIAL_TICKETS, INITIAL_PROMOS } = await import('../data');

  // Insert all data in parallel
  const [prodResult, mitraResult, artResult, labResult, orderResult, delivResult, ticketResult, promoResult] = await Promise.all([
    supabase.from('products').insert(PRODUCTS.map(p => ({ ...p, id: p.id }))),
    supabase.from('mitra_sppg').insert(MITRA_SPPG.map(m => ({ ...m, id: m.id }))),
    supabase.from('articles').insert(ARTICLES.map(a => ({ ...a, id: a.id }))),
    supabase.from('lab_reports').insert(LAB_REPORTS.map(l => ({ ...l, id: l.id }))),
    supabase.from('orders').insert(INITIAL_ORDERS.map(o => ({ ...o, id: o.id }))),
    supabase.from('deliveries').insert(INITIAL_DELIVERIES.map(d => ({ ...d, id: d.id }))),
    supabase.from('tickets').insert(INITIAL_TICKETS.map(t => ({ ...t, id: t.id }))),
    supabase.from('promos').insert(INITIAL_PROMOS.map(p => ({ ...p, id: p.id }))),
  ]);

  // Check for errors
  const errors = [prodResult, mitraResult, artResult, labResult, orderResult, delivResult, ticketResult, promoResult]
    .filter(r => r.error)
    .map(r => r.error!.message);
  if (errors.length > 0) {
    console.error('Seed errors:', errors);
  }
}

// =============================================
// Row mappers (DB → TypeScript)
// =============================================
function rowToProduct(row: Record<string, any>): Product {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    volume: row.volume,
    packaging: row.packaging,
    price: row.price,
    targetAudience: row.target_audience,
    nutrients: row.nutrients || {},
    description: row.description,
    certifications: row.certifications || [],
  };
}

function rowToMitra(row: Record<string, any>): MitraSPPG {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    address: row.address,
    coordinator: row.coordinator,
    phone: row.phone,
    beneficiariesCount: row.beneficiaries_count,
    dailyQuota: row.daily_quota,
  };
}

function rowToArticle(row: Record<string, any>): Article {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: row.category,
    date: row.date,
    author: row.author,
  };
}

function rowToLabReport(row: Record<string, any>): LabReport {
  return {
    id: row.id,
    batchNo: row.batch_no,
    testDate: row.test_date,
    bacteriaCount: row.bacteria_count,
    fatContent: row.fat_content,
    proteinContent: row.protein_content,
    sensoryTest: row.sensory_test,
    status: row.status,
    certifiedBy: row.certified_by,
  };
}

function rowToOrder(row: Record<string, any>): Order {
  return {
    id: row.id,
    mitraId: row.mitra_id,
    mitraName: row.mitra_name,
    productName: row.product_name,
    quantity: row.quantity,
    deliveryDate: row.delivery_date,
    status: row.status,
    orderDate: row.order_date,
    notes: row.notes,
    signedBy: row.signed_by,
    signatureData: row.signature_data,
    receivedDate: row.received_date,
  };
}

function rowToDelivery(row: Record<string, any>): DeliveryLog {
  return {
    id: row.id,
    orderId: row.order_id,
    driverName: row.driver_name,
    vehicleNo: row.vehicle_no,
    departureTime: row.departure_time,
    status: row.status,
    currentTemp: row.current_temp,
    tempHistory: row.temp_history || [],
    routeCoordinates: row.route_coordinates || [],
    currentStepIndex: row.current_step_index,
  };
}

function rowToTicket(row: Record<string, any>): Ticket {
  return {
    id: row.id,
    mitraId: row.mitra_id,
    mitraName: row.mitra_name,
    type: row.type,
    description: row.description,
    date: row.date,
    status: row.status,
    resolution: row.resolution,
    severity: row.severity,
  };
}

function rowToPromo(row: Record<string, any>): Promo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    linkUrl: row.link_url,
    buttonText: row.button_text,
    isActive: row.is_active,
  };
}
