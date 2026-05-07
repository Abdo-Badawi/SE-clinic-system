import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: doctor-service DoctorController  →  gateway /api/doctors/**
// Endpoints:
//   POST   /api/doctors             createDoctor    (ADMIN)
//   GET    /api/doctors             getAllDoctors   (any authenticated)
//   GET    /api/doctors/{id}        getDoctorById   (any authenticated)
//   PUT    /api/doctors/{id}        updateDoctor    (ADMIN)
//   DELETE /api/doctors/{id}        deleteDoctor    (ADMIN)
// ─────────────────────────────────────────────────────────────────────────────

/** DoctorResponse — exact fields from DoctorResponse.java */
export interface DoctorDTO {
  id: number;               // Long — same as userId
  specialization: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** CreateDoctorRequest — exact fields */
export interface CreateDoctorRequest {
  userId: number;           // @NotNull Long
  specialization: string;   // @NotBlank
}

/** UpdateDoctorRequest — exact fields */
export interface UpdateDoctorRequest {
  specialization?: string;
}

/** GET /api/doctors */
export async function getDoctorsApi(): Promise<DoctorDTO[]> {
  const res = await api.get<DoctorDTO[]>('/api/doctors');
  return res.data;
}

/** GET /api/doctors/{id} */
export async function getDoctorByIdApi(id: number): Promise<DoctorDTO> {
  const res = await api.get<DoctorDTO>(`/api/doctors/${id}`);
  return res.data;
}

/** POST /api/doctors — ADMIN only */
export async function createDoctorApi(body: CreateDoctorRequest): Promise<DoctorDTO> {
  const res = await api.post<DoctorDTO>('/api/doctors', body);
  return res.data;
}

/** PUT /api/doctors/{id} — ADMIN only */
export async function updateDoctorApi(id: number, body: UpdateDoctorRequest): Promise<DoctorDTO> {
  const res = await api.put<DoctorDTO>(`/api/doctors/${id}`, body);
  return res.data;
}

/** DELETE /api/doctors/{id} — ADMIN only */
export async function deleteDoctorApi(id: number): Promise<void> {
  await api.delete(`/api/doctors/${id}`);
}
