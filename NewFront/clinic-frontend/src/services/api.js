import apiClient from "./axios";

// ---------- AUTH ----------
export const login = (email, password) => apiClient.post("/api/auth/login", { email, password });
export const register = (email, password, fullName) =>
  apiClient.post("/api/auth/register", { email, password, fullName });
export const adminCreateUser = (userData) => apiClient.post("/api/auth/admin/users", userData);

// ---------- PATIENTS ----------
export const getPatients = () => apiClient.get("/api/patients");
export const getPatient = (id) => apiClient.get(`/api/patients/${id}`);
export const createPatient = (data) => apiClient.post("/api/patients", data);
export const updatePatient = (id, data) => apiClient.put(`/api/patients/${id}`, data);
export const deletePatient = (id) => apiClient.delete(`/api/patients/${id}`);

// ---------- DOCTORS ----------
export const getDoctors = () => apiClient.get("/api/doctors");
export const getDoctor = (id) => apiClient.get(`/api/doctors/${id}`);
export const createDoctor = (data) => apiClient.post("/api/doctors", data);
export const updateDoctor = (id, data) => apiClient.put(`/api/doctors/${id}`, data);
export const deleteDoctor = (id) => apiClient.delete(`/api/doctors/${id}`);

// ---------- APPOINTMENTS ----------
export const getAppointmentsByPatient = (patientId) =>
  apiClient.get(`/api/appointments/patient/${patientId}`);
export const getAppointmentsByDoctor = (doctorId) =>
  apiClient.get(`/api/appointments/doctor/${doctorId}`);
export const bookAppointment = (data) => apiClient.post("/api/appointments", data);
export const updateAppointmentStatus = (id, status) =>
  apiClient.put(`/api/appointments/${id}/status`, { status });
export const cancelAppointment = (id, reason) =>
  apiClient.put(`/api/appointments/${id}/cancel?reason=${reason}`);
export const deleteAppointment = (id) => apiClient.delete(`/api/appointments/${id}`);
export const checkAvailableSlots = (doctorId, date) =>
  apiClient.post("/api/appointments/available-slots", { doctorId, date });

// ---------- MEDICAL RECORDS ----------
export const getMedicalRecordsByPatient = (patientId) =>
  apiClient.get(`/api/medical-records/patient/${patientId}`);
export const createMedicalRecord = (data) => apiClient.post("/api/medical-records", data);
export const updateMedicalRecord = (id, data) => apiClient.put(`/api/medical-records/${id}`, data);

// ---------- AUDIT LOGS (Admin only) ----------
export const getAllAuditLogs = () => apiClient.get("/api/audit/logs");
export const getAuditLogsByUser = (userId) => apiClient.get(`/api/audit/logs/user/${userId}`);
export const getAuditLogsByAction = (action) => apiClient.get(`/api/audit/logs/action/${action}`);