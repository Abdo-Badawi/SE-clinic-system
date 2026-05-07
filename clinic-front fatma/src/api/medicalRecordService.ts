import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: medical-record-service MedicalRecordController  →  gateway /api/medical-records/**
//
// Endpoints:
//   POST   /api/medical-records                    createMedicalRecord  (DOCTOR, ADMIN)
//   GET    /api/medical-records/{id}               getById
//   GET    /api/medical-records/patient/{patientId} getByPatient
//   GET    /api/medical-records/doctor/{doctorId}  getByDoctor          (DOCTOR, ADMIN, RECEPTIONIST)
//   PUT    /api/medical-records/{id}               updateMedicalRecord  (DOCTOR, ADMIN)
//   DELETE /api/medical-records/{id}               deleteMedicalRecord  (ADMIN)
// ─────────────────────────────────────────────────────────────────────────────

/** MedicalRecordResponse — exact fields from MedicalRecordResponse.java */
export interface MedicalRecordDTO {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  visitDate?: string;        // LocalDateTime → "2026-04-28T10:30:00"
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  attachments?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** MedicalRecordRequest — exact fields */
export interface CreateMedicalRecordRequest {
  patientId: number;         // @NotNull
  appointmentId?: number;
  visitDate?: string;        // "2026-04-28T10:30:00"
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  attachments?: string;
}

/** UpdateMedicalRecordRequest — exact fields */
export interface UpdateMedicalRecordRequest {
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  attachments?: string;
}

/** POST /api/medical-records  — DOCTOR or ADMIN */
export async function createMedicalRecordApi(
  body: CreateMedicalRecordRequest
): Promise<MedicalRecordDTO> {
  const res = await api.post<MedicalRecordDTO>('/api/medical-records', body);
  return res.data;
}

/** GET /api/medical-records/{id} */
export async function getMedicalRecordByIdApi(id: number): Promise<MedicalRecordDTO> {
  const res = await api.get<MedicalRecordDTO>(`/api/medical-records/${id}`);
  return res.data;
}

/** GET /api/medical-records/patient/{patientId} */
export async function getMedicalRecordsByPatientApi(patientId: number): Promise<MedicalRecordDTO[]> {
  const res = await api.get<MedicalRecordDTO[]>(`/api/medical-records/patient/${patientId}`);
  return res.data;
}

/** GET /api/medical-records/doctor/{doctorId}  — DOCTOR, ADMIN, RECEPTIONIST */
export async function getMedicalRecordsByDoctorApi(doctorId: number): Promise<MedicalRecordDTO[]> {
  const res = await api.get<MedicalRecordDTO[]>(`/api/medical-records/doctor/${doctorId}`);
  return res.data;
}

/** PUT /api/medical-records/{id}  — DOCTOR or ADMIN */
export async function updateMedicalRecordApi(
  id: number,
  body: UpdateMedicalRecordRequest
): Promise<MedicalRecordDTO> {
  const res = await api.put<MedicalRecordDTO>(`/api/medical-records/${id}`, body);
  return res.data;
}

/** DELETE /api/medical-records/{id}  — ADMIN only */
export async function deleteMedicalRecordApi(id: number): Promise<void> {
  await api.delete(`/api/medical-records/${id}`);
}
