import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import type { Appointment, AppointmentType } from '../../types';

interface Props { onClose: () => void; prePatientId?: number; }

const TYPES: AppointmentType[] = ['Routine Checkup', 'Follow-up', 'New Patient', 'Urgent'];

export default function BookAppointmentModal({ onClose, prePatientId }: Props) {
  const { lang, patients, addAppointment } = useAppStore();
  const [form, setForm] = useState({
    patientId: prePatientId?.toString() || '',
    type: 'Routine Checkup' as AppointmentType,
    date: '',
    time: '',
    notes: '',
    notesAr: '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.patientId || !form.date || !form.time) return;
    const patient = patients.find((p) => p.id === parseInt(form.patientId));
    if (!patient) return;
    const appt: Omit<Appointment, 'id'> = {
      patientId: patient.id,
      patientName: patient.name,
      patientNameAr: patient.nameAr,
      date: form.date,
      time: form.time,
      type: form.type,
      doctor: 'Dr. Mitchell',
      doctorAr: 'د. ميتشل',
      status: 'Pending',
      notes: form.notes || '-',
      notesAr: form.notesAr || form.notes || '-',
    };
    addAppointment(appt);
    onClose();
  };

  return (
    <Modal
      title={tr('bookAppointment', lang)}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>{tr('close', lang)}</button>
          <button className="btn-primary" onClick={handleSave}>{tr('bookAppointment', lang)}</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="form-label">{tr('selectPatient', lang)}</label>
          <select className="form-input" value={form.patientId} onChange={(e) => set('patientId', e.target.value)}>
            <option value="">-- {tr('selectPatient', lang)} --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === 'ar' ? p.nameAr : p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">{tr('appointmentType', lang)}</label>
          <select className="form-input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{tr('date', lang)}</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{tr('time', lang)}</label>
            <input type="time" className="form-input" value={form.time} onChange={(e) => set('time', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="form-label">{tr('notes', lang)}</label>
          <textarea
            className="form-input"
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder={lang === 'ar' ? 'سبب الزيارة والتعليمات الخاصة...' : 'Reason for visit, special instructions...'}
          />
        </div>
      </div>
    </Modal>
  );
}
