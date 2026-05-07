import { create } from 'zustand';
import type { Lang, Role, AuthUser } from '../types';
import { loginApi } from '../api/authService';
import type { JwtResponse } from '../api/authService';

interface AppState {
  currentUser: AuthUser | null;
  token: string | null;
  loginWithCredentials: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginDirect: (user: AuthUser, token: string) => void;
  logout: () => void;
  lang: Lang;
  toggleLang: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// ── localStorage helpers ───────────────────────────────────────────────────
const ls    = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /**/ } };
const lsDel = (k: string) => { try { localStorage.removeItem(k); } catch { /**/ } };

// ── Avatar helpers ─────────────────────────────────────────────────────────
function buildAvatar(name: string): string {
  return (name || 'U').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function colorForRole(role: Role): string {
  if (role === 'ADMIN')        return 'bg-primary-600';
  if (role === 'DOCTOR')       return 'bg-emerald-600';
  if (role === 'RECEPTIONIST') return 'bg-amber-500';
  return 'bg-rose-500'; // PATIENT
}

// ── Map JwtResponse → AuthUser ─────────────────────────────────────────────
function mapJwt(res: JwtResponse): AuthUser {
  const role = res.role as Role;
  const id   = Number(res.userId);
  return {
    id,
    fullName:    res.fullName ?? res.email,
    email:       res.email,
    role,
    avatar:      buildAvatar(res.fullName ?? res.email),
    avatarColor: colorForRole(role),
    patientId:   role === 'PATIENT' ? id : undefined,
    doctorId:    role === 'DOCTOR'  ? id : undefined,
  };
}

// ── CRITICAL: never call window at module-load time ───────────────────────
function initialSidebar(): boolean {
  try { return typeof window !== 'undefined' && window.innerWidth >= 1024; }
  catch { return true; }
}

// ── Store ─────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>((set, get) => ({
  currentUser: (() => {
    try { const r = ls('user'); return r ? (JSON.parse(r) as AuthUser) : null; } catch { return null; }
  })(),
  token: ls('token'),

  loginWithCredentials: async (email, password) => {
    try {
      const res  = await loginApi({ email, password });
      const user = mapJwt(res);
      lsSet('token', res.token);
      lsSet('user',  JSON.stringify(user));
      set({ currentUser: user, token: res.token });
      return { ok: true };
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Login failed');
      return { ok: false, error: msg };
    }
  },

  loginDirect: (user, token) => {
    lsSet('token', token);
    lsSet('user',  JSON.stringify(user));
    set({ currentUser: user, token });
  },

  logout: () => {
    lsDel('token');
    lsDel('user');
    set({ currentUser: null, token: null });
  },

  lang: (ls('lang') as Lang) || 'ar',
  toggleLang: () => {
    const next: Lang = get().lang === 'ar' ? 'en' : 'ar';
    lsSet('lang', next);
    try { document.documentElement.lang = next; document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'; }
    catch { /**/ }
    set({ lang: next });
  },

  sidebarOpen: initialSidebar(),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
