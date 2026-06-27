import { supabase } from "./supabaseClient";

const ADMIN_AUTH_STORAGE_KEY = "wedding-auth-user";
const GUEST_AUTH_STORAGE_KEY = "wedding-guest-user";

// ═══════════════════════════════════════════════
// ADMIN AUTH (Supabase Auth)
// ═══════════════════════════════════════════════

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    if (error.message?.toLowerCase().includes("invalid login credentials")) {
      throw new Error("Akun admin tidak ditemukan di Supabase Authentication, atau password salah.");
    }
    if (error.message?.toLowerCase().includes("email not confirmed")) {
      throw new Error("Email admin belum dikonfirmasi. Cek email verifikasi atau matikan Confirm email di Supabase Auth settings.");
    }
    throw error;
  }
  localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, email);
  return data;
}

export async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  await supabase.auth.signOut();
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export function getLoggedUserEmail() {
  return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
}

export function isLoggedIn() {
  return Boolean(getLoggedUserEmail());
}

// ═══════════════════════════════════════════════
// GUEST AUTH (tetap localStorage, tidak berubah)
// ═══════════════════════════════════════════════

export function loginGuestUser(email) {
  if (!email) return;
  localStorage.setItem(GUEST_AUTH_STORAGE_KEY, email);
}

export function logoutGuestUser() {
  localStorage.removeItem(GUEST_AUTH_STORAGE_KEY);
}

export function getGuestLoggedUserEmail() {
  return localStorage.getItem(GUEST_AUTH_STORAGE_KEY);
}

export function isGuestLoggedIn() {
  return Boolean(getGuestLoggedUserEmail());
}
