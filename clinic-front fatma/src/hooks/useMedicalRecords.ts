import { useState, useEffect, useCallback } from 'react';
import {
  getMedicalRecordsByPatientApi,
  getMedicalRecordsByDoctorApi,
  createMedicalRecordApi,
  updateMedicalRecordApi,
  deleteMedicalRecordApi,
} from '../api/medicalRecordService';
import type {
  MedicalRecordDTO,
  CreateMedicalRecordRequest,
  UpdateMedicalRecordRequest,
} from '../api/medicalRecordService';

export type RecordsFetchMode =
  | { by: 'patient'; id: number }
  | { by: 'doctor';  id: number };

export function useMedicalRecords(mode?: RecordsFetchMode) {
  const [records,  setRecords]  = useState<MedicalRecordDTO[]>([]);
  const [loading,  setLoading]  = useState(!!mode);
  const [error,    setError]    = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!mode) { setLoading(false); return; }
    try {
      setLoading(true); setError(null);
      const data = mode.by === 'patient'
        ? await getMedicalRecordsByPatientApi(mode.id)
        : await getMedicalRecordsByDoctorApi(mode.id);
      setRecords(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load records');
      setRecords([]);
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode?.by, (mode as { id?: number })?.id]);

  useEffect(() => { fetch(); }, [fetch]);

  /** POST /api/medical-records */
  const addRecord = async (body: CreateMedicalRecordRequest) => {
    const created = await createMedicalRecordApi(body);
    setRecords((p) => [created, ...p]);
    return created;
  };

  /** PUT /api/medical-records/:id */
  const editRecord = async (id: number, body: UpdateMedicalRecordRequest) => {
    const updated = await updateMedicalRecordApi(id, body);
    setRecords((p) => p.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  /** DELETE /api/medical-records/:id — ADMIN only */
  const removeRecord = async (id: number) => {
    await deleteMedicalRecordApi(id);
    setRecords((p) => p.filter((r) => r.id !== id));
  };

  return { records, loading, error, refetch: fetch, addRecord, editRecord, removeRecord };
}
