import { create } from 'zustand';
import type { User, Patient, Appointment, MedicalRecord, Lang, AppointmentStatus } from '../types';
import { MOCK_USERS, MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_RECORDS } from '../data/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string, role: string) => boolean;
  loginDirect: (user: User) => void;
  logout: () => void;

  // Language
  lang: Lang;
  toggleLang: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data
  patients: Patient[];
  appointments: Appointment[];
  records: MedicalRecord[];

  // Appointment actions
  confirmAppointment: (id: number) => void;
  cancelAppointment: (id: number) => void;
  addAppointment: (appt: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;

  // Patient actions
  addPatient: (patient: Omit<Patient, 'id'>) => void;

  // Record actions
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateRecord: (id: number, updates: Partial<MedicalRecord>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Auth ──
  currentUser: null,

  login: (email, password, role) => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  loginDirect: (user) => set({ currentUser: user }),

  logout: () => set({ currentUser: null }),

  // ── Language ──
  lang: 'ar',
  toggleLang: () => {
    const next = get().lang === 'ar' ? 'en' : 'ar';
    set({ lang: next });
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  },

  // ── Sidebar ──
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // ── Data ──
  patients: MOCK_PATIENTS,
  appointments: MOCK_APPOINTMENTS,
  records: MOCK_RECORDS,

  // ── Appointment actions ──
  confirmAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'Confirmed' } : a
      ),
    })),

  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'Cancelled' } : a
      ),
    })),

  addAppointment: (appt) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        { ...appt, id: Date.now() },
      ],
    })),

  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),

  // ── Patient actions ──
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, { ...patient, id: Date.now() }],
    })),

  // ── Record actions ──
  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, { ...record, id: Date.now() }],
    })),

  updateRecord: (id, updates) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
}));
