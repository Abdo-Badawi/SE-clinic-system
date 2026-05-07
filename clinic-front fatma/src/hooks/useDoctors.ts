import { useState, useEffect, useCallback } from 'react';
import { getDoctorsApi, getDoctorByIdApi } from '../api/doctorService';
import type { DoctorDTO } from '../api/doctorService';

export function useDoctors() {
  const [doctors,  setDoctors]  = useState<DoctorDTO[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      setDoctors(await getDoctorsApi());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load doctors');
      setDoctors([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { doctors, loading, error, refetch: fetch };
}

export function useDoctorById(id?: number) {
  const [doctor,  setDoctor]  = useState<DoctorDTO | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true); setError(null);
        setDoctor(await getDoctorByIdApi(id));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load doctor');
      } finally { setLoading(false); }
    })();
  }, [id]);

  return { doctor, loading, error };
}
