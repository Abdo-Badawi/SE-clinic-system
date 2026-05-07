import { useState, useEffect, useCallback } from 'react';
import {
  getAppointmentsByPatientApi,
  getAppointmentsByDoctorApi,
  getAppointmentsByDoctorAndDateApi,
  createAppointmentApi,
  updateAppointmentStatusApi,
  cancelAppointmentApi,
  deleteAppointmentApi,
} from '../api/appointmentService';
import type { AppointmentDTO, CreateAppointmentRequest } from '../api/appointmentService';

export type FetchMode =
  | { by: 'patient'; id: number }
  | { by: 'doctor';  id: number }
  | { by: 'doctor-date'; id: number; date: string };

export function useAppointments(mode?: FetchMode) {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(!!mode);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!mode) { setLoading(false); return; }
    try {
      setLoading(true); setError(null);
      let data: AppointmentDTO[];
      if (mode.by === 'patient')       data = await getAppointmentsByPatientApi(mode.id);
      else if (mode.by === 'doctor')   data = await getAppointmentsByDoctorApi(mode.id);
      else                              data = await getAppointmentsByDoctorAndDateApi(mode.id, mode.date);
      setAppointments(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load appointments');
      setAppointments([]);
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode?.by, (mode as { id?: number })?.id, (mode as { date?: string })?.date]);

  useEffect(() => { fetch(); }, [fetch]);

  /** POST /api/appointments */
  const bookAppointment = async (body: CreateAppointmentRequest) => {
    const created = await createAppointmentApi(body);
    setAppointments((p) => [...p, created]);
    return created;
  };

  /**
   * PUT /api/appointments/:id/status  — { status: string }
   * Receptionist uses: "checked_in"
   * Doctor uses:       "completed" | "no_show"
   */
  const updateStatus = async (id: number, status: string) => {
    const updated = await updateAppointmentStatusApi(id, status);
    setAppointments((p) => p.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  /**
   * PUT /api/appointments/:id/cancel?reason=...
   * Roles: RECEPTIONIST, ADMIN, PATIENT
   */
  const cancelAppointment = async (id: number, reason = 'Cancelled') => {
    const updated = await cancelAppointmentApi(id, reason);
    setAppointments((p) => p.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  /** DELETE /api/appointments/:id */
  const deleteAppointment = async (id: number) => {
    await deleteAppointmentApi(id);
    setAppointments((p) => p.filter((a) => a.id !== id));
  };

  return { appointments, loading, error, refetch: fetch, bookAppointment, updateStatus, cancelAppointment, deleteAppointment };
}
