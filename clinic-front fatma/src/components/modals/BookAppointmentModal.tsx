import { useState } from 'react';
import { Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { createAppointmentApi } from '../../api/appointmentService';
import { getAvailableSlotsApi } from '../../api/appointmentService';
import { useDoctors } from '../../hooks/useDoctors';
import type { AvailableSlotDTO } from '../../api/appointmentService';

interface Props {
  onClose: () => void;
  onCreated?: () => void;
  prePatientId?: number;
}

export default function BookAppointmentModal({ onClose, onCreated, prePatientId }: Props) {
  const { lang, currentUser } = useAppStore();
  const { doctors, loading: dLoad } = useDoctors();

  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [slots,    setSlots]    = useState<AvailableSlotDTO[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    patientId:       prePatientId?.toString()
                     || (currentUser?.role === 'PATIENT' ? currentUser.patientId?.toString() || '' : ''),
    doctorId:        '',
    appointmentDate: '',
    startTime:       '',   // from available slots or typed manually
    endTime:         '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // POST /api/appointments/available-slots
  const loadSlots = async () => {
    if (!form.doctorId || !form.appointmentDate) return;
    setLoadingSlots(true);
    try {
      const data = await getAvailableSlotsApi({
        doctorId: parseInt(form.doctorId),
        date:     form.appointmentDate,
      });
      setSlots(data.filter((s) => s.available));
    } catch { setSlots([]); }
    finally { setLoadingSlots(false); }
  };

  // POST /api/appointments
  const handleSave = async () => {
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.startTime) {
      setApiError(lang === 'ar'
        ? 'المريض والطبيب والتاريخ والوقت مطلوبة.'
        : 'Patient, doctor, date, and start time are required.');
      return;
    }
    setSaving(true); setApiError('');
    try {
      await createAppointmentApi({
        patientId:       parseInt(form.patientId),
        doctorId:        parseInt(form.doctorId),
        appointmentDate: form.appointmentDate,       // "2026-04-29"
        startTime:       form.startTime,             // "10:00:00"
        endTime:         form.endTime || undefined,
      });
      onCreated?.();
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Failed to book appointment.');
      setApiError(msg);
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={tr('bookAppointment', lang)}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>{tr('close', lang)}</button>
          <button className="btn-primary"   onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader size={13} className="animate-spin" /> {lang === 'ar' ? 'جارٍ الحجز...' : 'Booking...'}</>
              : tr('bookAppointment', lang)}
          </button>
        </>
      }
    >
      {apiError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{apiError}</div>
      )}
      <div className="space-y-4">
        {/* Patient ID — hidden for patient role */}
        {currentUser?.role !== 'PATIENT' && (
          <div>
            <label className="form-label">{lang === 'ar' ? 'رقم المريض (Patient ID)' : 'Patient ID'}</label>
            <input
              type="number"
              className="form-input"
              placeholder={lang === 'ar' ? 'مثال: 5' : 'e.g. 5'}
              value={form.patientId}
              onChange={(e) => set('patientId', e.target.value)}
            />
          </div>
        )}

        {/* Doctor */}
        <div>
          <label className="form-label">{tr('selectDoctor', lang)}</label>
          <select
            className="form-input"
            value={form.doctorId}
            onChange={(e) => { set('doctorId', e.target.value); setSlots([]); }}
            disabled={dLoad}
          >
            <option value="">-- {tr('selectDoctor', lang)} --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Doctor #{d.id} — {d.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="form-label">{tr('appointmentDate', lang)}</label>
          <div className="flex gap-2">
            <input
              type="date"
              className="form-input flex-1"
              value={form.appointmentDate}
              onChange={(e) => { set('appointmentDate', e.target.value); setSlots([]); }}
            />
            <button
              type="button"
              className="btn-secondary text-xs px-3"
              onClick={loadSlots}
              disabled={!form.doctorId || !form.appointmentDate || loadingSlots}
            >
              {loadingSlots
                ? <Loader size={12} className="animate-spin" />
                : (lang === 'ar' ? 'تحقق' : 'Check slots')}
            </button>
          </div>
        </div>

        {/* Available slots */}
        {slots.length > 0 && (
          <div>
            <label className="form-label">{lang === 'ar' ? 'الأوقات المتاحة' : 'Available Slots'}</label>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s.startTime}
                  type="button"
                  className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition-all ${
                    form.startTime === s.startTime
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-primary-400'
                  }`}
                  onClick={() => { set('startTime', s.startTime); set('endTime', s.endTime); }}
                >
                  {s.startTime.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual time input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{tr('startTime', lang)} (HH:MM:SS)</label>
            <input
              type="time"
              step="1"
              className="form-input"
              value={form.startTime}
              onChange={(e) => set('startTime', e.target.value + ':00')}
            />
          </div>
          <div>
            <label className="form-label">{lang === 'ar' ? 'وقت الانتهاء' : 'End Time'} (optional)</label>
            <input
              type="time"
              step="1"
              className="form-input"
              value={form.endTime}
              onChange={(e) => set('endTime', e.target.value + ':00')}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
