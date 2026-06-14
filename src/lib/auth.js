const ADMIN_AUTH_STORAGE_KEY = "wedding-auth-user";
const GUEST_AUTH_STORAGE_KEY = "wedding-guest-user";

export function loginUser(email) {
  if (!email) return;
  localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, email);
}

export function logoutUser() {
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export function getLoggedUserEmail() {
  return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
}

export function isLoggedIn() {
  return Boolean(getLoggedUserEmail());
}

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
