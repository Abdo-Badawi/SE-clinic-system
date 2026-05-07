// src/services/api.js
// All endpoints mapped from clinic-api Postman collection

const getBaseUrl = () => localStorage.getItem('baseUrl') || 'http://localhost:8080';
const getToken   = () => localStorage.getItem('token') || '';

async function request(method, path, body = null, noAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (!noAuth && getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(getBaseUrl() + path, options);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (email, password)           => request('POST', '/api/auth/login', { email, password }, true),
  register:       (fullName, email, password) => request('POST', '/api/auth/register', { fullName, email, password }, true),
  adminCreateUser:(body)                      => request('POST', '/api/auth/admin/users', body),
  validate:       ()                          => request('GET',  '/api/auth/validate'),
  internalGetUser:(id)                        => request('GET',  `/api/auth/internal/users/${id}`, null, true),
};

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
export const patientAPI = {
  get:    (id)           => request('GET',    `/api/patients/${id}`),
  create: (body)         => request('POST',   '/api/patients', body),
  update: (id, body)     => request('PUT',    `/api/patients/${id}`, body),
  delete: (id)           => request('DELETE', `/api/patients/${id}`),
};

// ─── DOCTORS ─────────────────────────────────────────────────────────────────
export const doctorAPI = {
  list:   ()             => request('GET',    '/api/doctors'),
  create: (body)         => request('POST',   '/api/doctors', body),
  update: (id, body)     => request('PUT',    `/api/doctors/${id}`, body),
  delete: (id)           => request('DELETE', `/api/doctors/${id}`),
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const appointmentAPI = {
  book:           (body)          => request('POST',   '/api/appointments', body),
  availableSlots: (body)          => request('POST',   '/api/appointments/available-slots', body, true),
  getByPatient:   (patientId)     => request('GET',    `/api/appointments/patient/${patientId}`),
  getByDoctor:    (doctorId)      => request('GET',    `/api/appointments/doctor/${doctorId}`),
  updateStatus:   (id, status)    => request('PUT',    `/api/appointments/${id}/status`, { status }),
  cancel:         (id, reason)    => request('PUT',    `/api/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`),
  delete:         (id)            => request('DELETE', `/api/appointments/${id}`),
};

// ─── MEDICAL RECORDS ──────────────────────────────────────────────────────────
export const medicalRecordAPI = {
  getByPatient: (patientId) => request('GET',  `/api/medical-records/patient/${patientId}`),
  create:       (body)      => request('POST',  '/api/medical-records', body),
  update:       (id, body)  => request('PUT',   `/api/medical-records/${id}`, body),
};

// ─── AUDIT ────────────────────────────────────────────────────────────────────
export const auditAPI = {
  getAll:      ()        => request('GET', '/api/audit/logs'),
  getByUser:   (userId)  => request('GET', `/api/audit/logs/user/${userId}`),
  getByAction: (action)  => request('GET', `/api/audit/logs/action/${action}`),
};
