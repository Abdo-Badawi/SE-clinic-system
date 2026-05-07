import api from './axios';

// ─────────────────────────────────────────────────────────────────────────────
// Source: auth-service AuthController  →  gateway route /api/auth/**
// ─────────────────────────────────────────────────────────────────────────────

// ── REQUEST DTOs (match common-library exactly) ────────────────────────────

/** POST /api/auth/login  — LoginRequest */
export interface LoginRequest {
  email: string;       // @Email @NotBlank
  password: string;    // @NotBlank
}

/**
 * POST /api/auth/register   → role is forced to "PATIENT" by server
 * POST /api/auth/admin/users → role must be provided, requires ADMIN JWT
 * Both use RegisterRequest
 */
export interface RegisterRequest {
  email: string;           // @Email @NotBlank
  password: string;        // @NotBlank @Size(min=6)
  fullName: string;        // @NotBlank
  role?: string;           // required for admin/users; ignored for /register
  phone?: string;
  address?: string;
  specialization?: string; // for DOCTOR role
}

// ── RESPONSE DTO (JwtResponse from common-library) ────────────────────────

export interface JwtResponse {
  token: string;
  type: string;        // "Bearer"
  userId: number;      // Long
  email: string;
  fullName: string;
  role: string;        // "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT"
}

// ── UserResponse (GET /api/auth/internal/users/:id) ───────────────────────

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// ── API FUNCTIONS ─────────────────────────────────────────────────────────

/** POST /api/auth/login */
export async function loginApi(body: LoginRequest): Promise<JwtResponse> {
  const res = await api.post<JwtResponse>('/api/auth/login', body);
  return res.data;
}

/** POST /api/auth/register  — self-registration, role forced to PATIENT */
export async function selfRegisterApi(
  body: Omit<RegisterRequest, 'role'>
): Promise<JwtResponse> {
  const res = await api.post<JwtResponse>('/api/auth/register', body);
  return res.data;
}

/** POST /api/auth/admin/users  — ADMIN only, role required in body */
export async function adminCreateUserApi(body: RegisterRequest): Promise<JwtResponse> {
  const res = await api.post<JwtResponse>('/api/auth/admin/users', body);
  return res.data;
}

/** GET /api/auth/validate  — returns 200 if token valid */
export async function validateTokenApi(): Promise<boolean> {
  try { await api.get('/api/auth/validate'); return true; }
  catch { return false; }
}

/** GET /api/auth/internal/users/:id  — internal use */
export async function getUserByIdApi(id: number): Promise<UserResponse> {
  const res = await api.get<UserResponse>(`/api/auth/internal/users/${id}`);
  return res.data;
}
