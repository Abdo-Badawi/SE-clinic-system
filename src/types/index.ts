export type Role = 'ADMIN' | 'DOCTOR' | 'EMPLOYEE' | 'PATIENT';
export type Lang = 'ar' | 'en';

export interface User {
  id: number;
  name: string;
  nameAr: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  avatarColor: string;
  patientId?: number;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type AppointmentType = 'Routine Checkup' | 'Follow-up' | 'New Patient' | 'Urgent';

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientNameAr: string;
  date: string;
  time: string;
  type: AppointmentType;
  doctor: string;
  doctorAr: string;
  status: AppointmentStatus;
  notes: string;
  notesAr: string;
}

export interface Patient {
  id: number;
  name: string;
  nameAr: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  status: 'Active' | 'Inactive';
  lastVisit: string;
  conditions: string[];
  conditionsAr: string[];
  avatar: string;
  avatarColor: string;
}

export interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
  oxygen: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  date: string;
  diagnosis: string;
  diagnosisAr: string;
  prescription: string;
  prescriptionAr: string;
  notes: string;
  notesAr: string;
  doctor: string;
  doctorAr: string;
  vitals: Vitals;
}

export interface NavItem {
  label: string;
  labelAr: string;
  icon: string;
  path: string;
  badge?: number;
}
