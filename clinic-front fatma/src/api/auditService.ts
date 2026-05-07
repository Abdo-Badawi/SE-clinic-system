import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: audit-service AuditController  →  gateway /api/audit/**
// All GET endpoints require ADMIN role.
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditLogDTO {
  id: number;
  userId?: number;
  action: string;
  tableName?: string;
  recordId?: number;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt?: string;
}

/** GET /api/audit/logs  — ADMIN only */
export async function getAllAuditLogsApi(): Promise<AuditLogDTO[]> {
  const res = await api.get<AuditLogDTO[]>('/api/audit/logs');
  return res.data;
}

/** GET /api/audit/logs/{id}  — ADMIN only */
export async function getAuditLogByIdApi(id: number): Promise<AuditLogDTO> {
  const res = await api.get<AuditLogDTO>(`/api/audit/logs/${id}`);
  return res.data;
}

/** GET /api/audit/logs/user/{userId}  — ADMIN only */
export async function getAuditLogsByUserApi(userId: number): Promise<AuditLogDTO[]> {
  const res = await api.get<AuditLogDTO[]>(`/api/audit/logs/user/${userId}`);
  return res.data;
}

/** GET /api/audit/logs/action/{action}  — ADMIN only */
export async function getAuditLogsByActionApi(action: string): Promise<AuditLogDTO[]> {
  const res = await api.get<AuditLogDTO[]>(`/api/audit/logs/action/${action}`);
  return res.data;
}
