/**
 * Auth helper module for NatNat Fresh Milk Admin Panel
 * Uses Supabase Auth for secure admin authentication
 */

import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AdminUser;
}

/**
 * Login with email and password using Supabase Auth
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Login gagal. Silakan coba lagi.' };
    }

    // Verify the user is in admin_profiles
    const isAdmin = await checkAdminStatus(data.user.id);
    if (!isAdmin) {
      // User authenticated but not an admin — sign them out
      await supabase.auth.signOut();
      return { success: false, error: 'Akun ini tidak memiliki akses admin. Hubungi administrator.' };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
    };
  } catch (err) {
    return { success: false, error: 'Terjadi kesalahan jaringan. Silakan coba lagi.' };
  }
}

/**
 * Register the first admin user
 * Only works if no admin_profiles exist yet
 */
export async function registerFirstAdmin(email: string, password: string): Promise<AuthResult> {
  try {
    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admin_profiles')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('registerFirstAdmin check error:', checkError);
      return { success: false, error: 'Gagal memeriksa data admin. Pastikan Supabase terkonfigurasi.' };
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return { success: false, error: 'Admin pertama sudah terdaftar. Gunakan form Masuk untuk login.' };
    }

    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Pendaftaran gagal. Silakan coba lagi.' };
    }

    // Add to admin_profiles
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({ id: data.user.id, email });

    if (profileError) {
      console.error('registerFirstAdmin profile error:', profileError);
      // Rollback: try to delete the auth user
      await supabase.auth.admin.deleteUser(data.user.id).catch(() => {});
      return { success: false, error: 'Gagal membuat profil admin. Pastikan RLS migration sudah dijalankan.' };
    }

    // Sign in immediately after registration
    const loginResult = await loginWithEmail(email, password);
    return loginResult;
  } catch (err) {
    return { success: false, error: 'Terjadi kesalahan jaringan. Silakan coba lagi.' };
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Check if a user ID exists in admin_profiles
 */
export async function checkAdminStatus(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('checkAdminStatus error:', error);
      return false;
    }

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
    };
  } catch {
    return null;
  }
}

/**
 * Check if there's an active admin session
 */
export async function isAdminSession(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return checkAdminStatus(user.id);
}
