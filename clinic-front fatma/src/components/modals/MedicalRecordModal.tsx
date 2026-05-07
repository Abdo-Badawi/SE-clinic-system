import { useState } from 'react';
import { Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { createMedicalRecordApi, updateMedicalRecordApi } from '../../api/medicalRecordService';
import type { MedicalRecordDTO } from '../../api/medicalRecordService';

interface Props {
  onClose: () => void;
  onSaved?: () => void;
  existingRecord?: MedicalRecordDTO;
  prePatientId?: number;
}

export default function MedicalRecordModal({ onClose, onSaved, existingRecord, prePatientId }: Props) {
  const { lang, currentUser } = useAppStore();
  const isEdit = !!existingRecord;

  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  // MedicalRecordRequest exact fields from source
  const [form, setForm] = useState({
    patientId:    existingRecord?.patientId?.toString() || prePatientId?.toString() || '',
    appointmentId:existingRecord?.appointmentId?.toString() || '',
    visitDate:    existingRecord?.visitDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    visitTime:    existingRecord?.visitDate?.split('T')[1]?.slice(0,5) || '10:00',
    diagnosis:    existingRecord?.diagnosis    || '',
    prescription: existingRecord?.prescription || '',
    notes:        existingRecord?.notes        || '',
    attachments:  existingRecord?.attachments  || '',
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!isEdit && !form.patientId) {
      setApiError(lang === 'ar' ? 'رقم المريض مطلوب.' : 'Patient ID is required.');
      return;
    }
    setSaving(true); setApiError('');
    try {
      if (isEdit && existingRecord) {
        // PUT /api/medical-records/:id — UpdateMedicalRecordRequest
        await updateMedicalRecordApi(existingRecord.id, {
          diagnosis:    form.diagnosis    || undefined,
          prescription: form.prescription || undefined,
          notes:        form.notes        || undefined,
          attachments:  form.attachments  || undefined,
        });
      } else {
        // POST /api/medical-records — MedicalRecordRequest
        // visitDate is LocalDateTime: "2026-04-28T10:30:00"
        const visitDateTime = form.visitDate && form.visitTime
          ? `${form.visitDate}T${form.visitTime}:00`
          : undefined;
        await createMedicalRecordApi({
          patientId:     parseInt(form.patientId),
          appointmentId: form.appointmentId ? parseInt(form.appointmentId) : undefined,
          visitDate:     visitDateTime,
          diagnosis:     form.diagnosis    || undefined,
          prescription:  form.prescription || undefined,
          notes:         form.notes        || undefined,
          attachments:   form.attachments  || undefined,
        });
      }
      onSaved?.();
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Failed to save record.');
      setApiError(msg);
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={isEdit ? tr('editRecord', lang) : tr('newRecord', lang)}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>{tr('close', lang)}</button>
          <button className="btn-primary"   onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader size={13} className="animate-spin" /> {lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}</>
              : tr('saveRecord', lang)}
          </button>
        </>
      }
    >
      {apiError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{apiError}</div>
      )}
      <div className="space-y-4">
        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{lang === 'ar' ? 'رقم المريض (patientId) *' : 'Patient ID *'}</label>
              <input
                type="number"
                className="form-input"
                value={form.patientId}
                onChange={(e) => set('patientId', e.target.value)}
                placeholder="e.g. 5"
                disabled={!!prePatientId}
              />
            </div>
            <div>
              <label className="form-label">{lang === 'ar' ? 'رقم الموعد (appointmentId)' : 'Appointment ID'}</label>
              <input
                type="number"
                className="form-input"
                value={form.appointmentId}
                onChange={(e) => set('appointmentId', e.target.value)}
                placeholder={lang === 'ar' ? 'اختياري' : 'Optional'}
              />
            </div>
          </div>
        )}

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">{tr('visitDate', lang)}</label>
              <input
                type="date"
                className="form-input"
                value={form.visitDate}
                onChange={(e) => set('visitDate', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">{lang === 'ar' ? 'وقت الزيارة' : 'Visit Time'}</label>
              <input
                type="time"
                className="form-input"
                value={form.visitTime}
                onChange={(e) => set('visitTime', e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <label className="form-label">{tr('diagnosis', lang)}</label>
          <input
            className="form-input"
            value={form.diagnosis}
            onChange={(e) => set('diagnosis', e.target.value)}
            placeholder={lang === 'ar' ? 'التشخيص الأساسي...' : 'Primary diagnosis...'}
          />
        </div>

        <div>
          <label className="form-label">{tr('prescription', lang)}</label>
          <input
            className="form-input"
            value={form.prescription}
            onChange={(e) => set('prescription', e.target.value)}
            placeholder={lang === 'ar' ? 'الأدوية والجرعات...' : 'Medications and dosage...'}
          />
        </div>

        <div>
          <label className="form-label">{tr('clinicalNotes', lang)}</label>
          <textarea
            className="form-input"
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder={lang === 'ar' ? 'ملاحظات سريرية...' : 'Clinical observations...'}
          />
        </div>

        <div>
          <label className="form-label">{lang === 'ar' ? 'المرفقات (رابط)' : 'Attachments (URL)'}</label>
          <input
            className="form-input"
            value={form.attachments}
            onChange={(e) => set('attachments', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {!isEdit && currentUser && (
          <div className="text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2">
            {lang === 'ar'
              ? `سيتم تسجيل هذا السجل باسم الدكتور (ID: ${currentUser.id})`
              : `This record will be attributed to Doctor ID: ${currentUser.id}`}
          </div>
        )}
      </div>
    </Modal>
  );
}
