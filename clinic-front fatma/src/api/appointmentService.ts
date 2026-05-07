import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: appointment-service AppointmentController  →  gateway /api/appointments/**
//
// Endpoints:
//   POST   /api/appointments                        createAppointment
//   GET    /api/appointments/{id}                   getById
//   GET    /api/appointments/patient/{patientId}    getByPatient
//   GET    /api/appointments/doctor/{doctorId}      getByDoctor
//   GET    /api/appointments/doctor/{doctorId}/date?date=YYYY-MM-DD  getByDoctorAndDate
//   PUT    /api/appointments/{id}/status            updateStatus     { status: string }
//   PUT    /api/appointments/{id}/cancel?reason=... cancelAppointment
//   POST   /api/appointments/available-slots        getAvailableSlots
//   DELETE /api/appointments/{id}                   deleteAppointment
//
// AppointmentStatus enum: scheduled | checked_in | completed | cancelled | no_show
// ─────────────────────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'scheduled'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

/** AppointmentResponse — exact fields from AppointmentResponse.java */
export interface AppointmentDTO {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;   // LocalDate → "2026-04-29"
  startTime: string;         // LocalTime → "10:00:00"
  endTime?: string;          // LocalTime → "10:30:00"
  status: AppointmentStatus;
  checkInTime?: string;      // LocalDateTime
  cancellationReason?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** AppointmentRequest — exact fields */
export interface CreateAppointmentRequest {
  patientId: number;         // @NotNull
  doctorId: number;          // @NotNull
  appointmentDate: string;   // @NotNull  "2026-04-29"
  startTime: string;         // @NotNull  "10:00:00"
  endTime?: string;          // optional  "10:30:00"
}

/** UpdateAppointmentStatusRequest — exact field */
export interface UpdateStatusRequest {
  status: string;            // @NotBlank: "checked_in" | "completed" | "no_show"
}

/** AvailableSlotsRequest */
export interface AvailableSlotsRequest {
  doctorId: number;          // @NotNull
  date: string;              // @NotNull  "2026-04-29"
}

/** AvailableSlotResponse */
export interface AvailableSlotDTO {
  startTime: string;
  endTime: string;
  available: boolean;
}

// ── API functions ─────────────────────────────────────────────────────────

/** POST /api/appointments */
export async function createAppointmentApi(body: CreateAppointmentRequest): Promise<AppointmentDTO> {
  const res = await api.post<AppointmentDTO>('/api/appointments', body);
  return res.data;
}

/** GET /api/appointments/{id} */
export async function getAppointmentByIdApi(id: number): Promise<AppointmentDTO> {
  const res = await api.get<AppointmentDTO>(`/api/appointments/${id}`);
  return res.data;
}

/** GET /api/appointments/patient/{patientId} */
export async function getAppointmentsByPatientApi(patientId: number): Promise<AppointmentDTO[]> {
  const res = await api.get<AppointmentDTO[]>(`/api/appointments/patient/${patientId}`);
  return res.data;
}

/** GET /api/appointments/doctor/{doctorId} */
export async function getAppointmentsByDoctorApi(doctorId: number): Promise<AppointmentDTO[]> {
  const res = await api.get<AppointmentDTO[]>(`/api/appointments/doctor/${doctorId}`);
  return res.data;
}

/** GET /api/appointments/doctor/{doctorId}/date?date=YYYY-MM-DD */
export async function getAppointmentsByDoctorAndDateApi(
  doctorId: number,
  date: string
): Promise<AppointmentDTO[]> {
  const res = await api.get<AppointmentDTO[]>(
    `/api/appointments/doctor/${doctorId}/date`,
    { params: { date } }
  );
  return res.data;
}

/**
 * PUT /api/appointments/{id}/status
 * Body: { status: "checked_in" | "completed" | "no_show" }
 * Roles: RECEPTIONIST, ADMIN, DOCTOR
 */
export async function updateAppointmentStatusApi(
  id: number,
  status: string
): Promise<AppointmentDTO> {
  const res = await api.put<AppointmentDTO>(`/api/appointments/${id}/status`, { status });
  return res.data;
}

/**
 * PUT /api/appointments/{id}/cancel?reason=...
 * Roles: RECEPTIONIST, ADMIN, PATIENT
 */
export async function cancelAppointmentApi(
  id: number,
  reason: string
): Promise<AppointmentDTO> {
  const res = await api.put<AppointmentDTO>(
    `/api/appointments/${id}/cancel`,
    null,
    { params: { reason } }
  );
  return res.data;
}

/** POST /api/appointments/available-slots */
export async function getAvailableSlotsApi(
  body: AvailableSlotsRequest
): Promise<AvailableSlotDTO[]> {
  const res = await api.post<AvailableSlotDTO[]>('/api/appointments/available-slots', body);
  return res.data;
}

/** DELETE /api/appointments/{id}  — RECEPTIONIST, ADMIN */
export async function deleteAppointmentApi(id: number): Promise<void> {
  await api.delete(`/api/appointments/${id}`);
}
