import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import type { MedicalRecord } from '../../types';

interface Props {
  onClose: () => void;
  existingRecord?: MedicalRecord;
  prePatientId?: number;
}

export default function MedicalRecordModal({ onClose, existingRecord, prePatientId }: Props) {
  const { lang, patients, addRecord, updateRecord } = useAppStore();
  const isEdit = !!existingRecord;

  const [form, setForm] = useState({
    patientId: existingRecord?.patientId?.toString() || prePatientId?.toString() || '',
    date: existingRecord?.date || new Date().toISOString().split('T')[0],
    diagnosis: existingRecord?.diagnosis || '',
    diagnosisAr: existingRecord?.diagnosisAr || '',
    prescription: existingRecord?.prescription || '',
    prescriptionAr: existingRecord?.prescriptionAr || '',
    notes: existingRecord?.notes || '',
    notesAr: existingRecord?.notesAr || '',
    bp: existingRecord?.vitals.bp || '',
    pulse: existingRecord?.vitals.pulse || '',
    temp: existingRecord?.vitals.temp || '',
    weight: existingRecord?.vitals.weight || '',
    oxygen: existingRecord?.vitals.oxygen || '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.patientId || !form.diagnosis) return;

    const data: Omit<MedicalRecord, 'id'> = {
      patientId: parseInt(form.patientId),
      date: form.date,
      diagnosis: form.diagnosis,
      diagnosisAr: form.diagnosisAr || form.diagnosis,
      prescription: form.prescription,
      prescriptionAr: form.prescriptionAr || form.prescription,
      notes: form.notes,
      notesAr: form.notesAr || form.notes,
      doctor: 'Dr. Mitchell',
      doctorAr: 'د. ميتشل',
      vitals: { bp: form.bp, pulse: form.pulse, temp: form.temp, weight: form.weight, oxygen: form.oxygen },
    };

    if (isEdit && existingRecord) {
      updateRecord(existingRecord.id, data);
    } else {
      addRecord(data);
    }
    onClose();
  };

  return (
    <Modal
      title={isEdit ? tr('editRecord', lang) : tr('newRecord', lang)}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>{tr('close', lang)}</button>
          <button className="btn-primary" onClick={handleSave}>{tr('saveRecord', lang)}</button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="form-label">{tr('selectPatient', lang)}</label>
            <select className="form-input" value={form.patientId} onChange={(e) => set('patientId', e.target.value)} disabled={isEdit}>
              <option value="">--</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{lang === 'ar' ? p.nameAr : p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">{tr('visitDate', lang)}</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">{tr('diagnosis', lang)} (EN)</label>
          <input className="form-input" value={form.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} placeholder="Primary diagnosis..." />
        </div>
        <div>
          <label className="form-label">{tr('diagnosis', lang)} (AR)</label>
          <input className="form-input" value={form.diagnosisAr} onChange={(e) => set('diagnosisAr', e.target.value)} placeholder="التشخيص بالعربي..." dir="rtl" />
        </div>
        <div>
          <label className="form-label">{tr('prescription', lang)}</label>
          <input className="form-input" value={form.prescription} onChange={(e) => set('prescription', e.target.value)} placeholder="Medications and dosage..." />
        </div>
        <div>
          <label className="form-label">{tr('clinicalNotes', lang)}</label>
          <textarea className="form-input" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Detailed clinical observations..." />
        </div>

        {/* Vitals */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{tr('vitals', lang)}</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'bp', label: tr('bloodPressure', lang), placeholder: '120/80' },
              { key: 'pulse', label: tr('pulse', lang), placeholder: '72' },
              { key: 'temp', label: tr('temperature', lang), placeholder: '37.0' },
              { key: 'weight', label: tr('weight', lang), placeholder: '70 kg' },
              { key: 'oxygen', label: tr('oxygen', lang), placeholder: '98%' },
            ].map((v) => (
              <div key={v.key}>
                <label className="form-label text-[9px]">{v.label}</label>
                <input
                  className="form-input text-center"
                  value={(form as Record<string, string>)[v.key]}
                  onChange={(e) => set(v.key, e.target.value)}
                  placeholder={v.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
