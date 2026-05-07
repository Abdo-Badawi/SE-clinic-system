// ── Roles — EXACTLY as User.UserRole enum in auth-service ─────────────────
export type Role = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

export type Lang = 'ar' | 'en';

// ── Appointment statuses — EXACTLY as Appointment.AppointmentStatus enum ──
export type AppointmentStatus =
  | 'scheduled'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

// ── Auth user stored in Zustand + localStorage ─────────────────────────────
export interface AuthUser {
  id: number;        // maps to JwtResponse.userId
  fullName: string;  // maps to JwtResponse.fullName
  email: string;
  role: Role;
  avatar: string;    // initials computed client-side
  avatarColor: string;
  /** For PATIENT: their patient-service profile id (= userId) */
  patientId?: number;
  /** For DOCTOR: their doctor-service profile id (= userId) */
  doctorId?: number;
}
