/**
 * useDBSync - Wraps state setters to automatically sync to Supabase when configured.
 * Falls back to localStorage-only mode if Supabase is not configured.
 */

import { useEffect, useRef, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  insertProduct, updateProduct, deleteProduct,
  insertMitra, updateMitra, deleteMitra,
  insertArticle, updateArticle, deleteArticle,
  insertLabReport, updateLabReport, deleteLabReport,
  insertOrder, updateOrder, deleteOrder,
  insertDelivery, updateDelivery, deleteDelivery,
  insertTicket, updateTicket, deleteTicket,
  insertPromo, updatePromo, deletePromo,
  upsertLandingSettings,
  upsertAboutSettings,
  seedInitialData
} from '../lib/db';

export function useDBSync() {
  const useDB = isSupabaseConfigured();
  const seeded = useRef(false);

  // Seed initial data once
  useEffect(() => {
    if (useDB && !seeded.current) {
      seeded.current = true;
      seedInitialData().catch(console.error);
    }
  }, [useDB]);

  // Product sync
  const syncProduct = useCallback(async (product: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertProduct(product);
    else if (action === 'update') await updateProduct(product.id, product);
    else await deleteProduct(product.id);
  }, [useDB]);

  // Mitra sync
  const syncMitra = useCallback(async (mitra: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertMitra(mitra);
    else if (action === 'update') await updateMitra(mitra.id, mitra);
    else await deleteMitra(mitra.id);
  }, [useDB]);

  // Article sync
  const syncArticle = useCallback(async (article: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertArticle(article);
    else if (action === 'update') await updateArticle(article.id, article);
    else await deleteArticle(article.id);
  }, [useDB]);

  // Lab Report sync
  const syncLab = useCallback(async (lab: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertLabReport(lab);
    else if (action === 'update') await updateLabReport(lab.id, lab);
    else await deleteLabReport(lab.id);
  }, [useDB]);

  // Order sync
  const syncOrder = useCallback(async (order: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertOrder(order);
    else if (action === 'update') await updateOrder(order.id, order);
    else await deleteOrder(order.id);
  }, [useDB]);

  // Delivery sync
  const syncDelivery = useCallback(async (delivery: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertDelivery(delivery);
    else if (action === 'update') await updateDelivery(delivery.id, delivery);
    else await deleteDelivery(delivery.id);
  }, [useDB]);

  // Ticket sync
  const syncTicket = useCallback(async (ticket: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertTicket(ticket);
    else if (action === 'update') await updateTicket(ticket.id, ticket);
    else await deleteTicket(ticket.id);
  }, [useDB]);

  // Promo sync
  const syncPromo = useCallback(async (promo: any, action: 'insert' | 'update' | 'delete') => {
    if (!useDB) return;
    if (action === 'insert') await insertPromo(promo);
    else if (action === 'update') await updatePromo(promo.id, promo);
    else await deletePromo(promo.id);
  }, [useDB]);

  // Settings sync
  const syncLandingSettings = useCallback(async (settings: any) => {
    if (!useDB) return;
    await upsertLandingSettings(settings);
  }, [useDB]);

  const syncAboutSettings = useCallback(async (settings: any) => {
    if (!useDB) return;
    await upsertAboutSettings(settings);
  }, [useDB]);

  return {
    useDB,
    syncProduct, syncMitra, syncArticle, syncLab,
    syncOrder, syncDelivery, syncTicket, syncPromo,
    syncLandingSettings, syncAboutSettings
  };
}
