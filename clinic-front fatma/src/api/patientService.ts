import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: patient-service PatientController  →  gateway /api/patients/**
// Endpoints:
//   POST   /api/patients            createPatient      (ADMIN, RECEPTIONIST)
//   GET    /api/patients/{id}       getPatientById     (any authenticated)
//   PUT    /api/patients/{id}       updatePatient      (any authenticated)
//   DELETE /api/patients/{id}       deletePatient      (ADMIN)
// NOTE: There is NO GET /api/patients (list) endpoint in the source.
// ─────────────────────────────────────────────────────────────────────────────

/** PatientResponse — exact fields from PatientResponse.java */
export interface PatientDTO {
  id: number;                // Long — same as userId
  dateOfBirth?: string;      // LocalDate → "1990-01-01"
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalSummary?: string;
  createdAt?: string;        // LocalDateTime
  updatedAt?: string;
}

/** CreatePatientRequest — exact fields */
export interface CreatePatientRequest {
  userId: number;            // @NotNull Long
  dateOfBirth?: string;      // "1990-01-01"
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalSummary?: string;
}

/** UpdatePatientRequest — exact fields */
export interface UpdatePatientRequest {
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalSummary?: string;
}

/** POST /api/patients */
export async function createPatientApi(body: CreatePatientRequest): Promise<PatientDTO> {
  const res = await api.post<PatientDTO>('/api/patients', body);
  return res.data;
}

/** GET /api/patients/{id} */
export async function getPatientByIdApi(id: number): Promise<PatientDTO> {
  const res = await api.get<PatientDTO>(`/api/patients/${id}`);
  return res.data;
}

/** PUT /api/patients/{id} */
export async function updatePatientApi(id: number, body: UpdatePatientRequest): Promise<PatientDTO> {
  const res = await api.put<PatientDTO>(`/api/patients/${id}`, body);
  return res.data;
}

/** DELETE /api/patients/{id} — ADMIN only */
export async function deletePatientApi(id: number): Promise<void> {
  await api.delete(`/api/patients/${id}`);
}
