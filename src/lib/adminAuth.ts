// Demo-only admin gate. There is no backend in this prototype, so the "login"
// simply checks a fixed passcode client-side and remembers the session in
// sessionStorage. Do not treat this as real authentication in production.

const SESSION_KEY = "mediroute-admin-session";
export const ADMIN_PASSCODE = "admin123";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "true";
}

export function loginAdmin(passcode: string): boolean {
  if (passcode !== ADMIN_PASSCODE) return false;
  if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, "true");
  return true;
}

export function logoutAdmin() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_KEY);
}
