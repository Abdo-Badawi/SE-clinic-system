import { useState, useCallback } from 'react';
import { getPatientByIdApi, updatePatientApi } from '../api/patientService';
import type { PatientDTO, UpdatePatientRequest } from '../api/patientService';

/** Single patient lookup by profile ID — GET /api/patients/{id} */
export function usePatient() {
  const [patient,  setPatient]  = useState<PatientDTO | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const fetchPatient = useCallback(async (id: number) => {
    try {
      setLoading(true); setError(null);
      setPatient(await getPatientByIdApi(id));
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (e instanceof Error ? e.message : 'Patient not found');
      setError(msg);
      setPatient(null);
    } finally { setLoading(false); }
  }, []);

  const updatePatient = async (id: number, body: UpdatePatientRequest) => {
    const updated = await updatePatientApi(id, body);
    setPatient(updated);
    return updated;
  };

  return { patient, loading, error, fetchPatient, updatePatient, setPatient };
}
