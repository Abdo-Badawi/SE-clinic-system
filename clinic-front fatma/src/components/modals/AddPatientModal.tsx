import { useState } from 'react';
import { Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { createPatientApi } from '../../api/patientService';

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddPatientModal({ onClose, onCreated }: Props) {
  const { lang } = useAppStore();
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  // CreatePatientRequest exact fields from source
  const [form, setForm] = useState({
    userId:           '',   // @NotNull Long — required
    dateOfBirth:      '',   // "1990-01-01"
    phone:            '',
    address:          '',
    emergencyContact: '',
    medicalSummary:   '',
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.userId) {
      setApiError(lang === 'ar' ? 'رقم المستخدم (userId) مطلوب.' : 'userId is required.');
      return;
    }
    setSaving(true); setApiError('');
    try {
      await createPatientApi({
        userId:           parseInt(form.userId),
        dateOfBirth:      form.dateOfBirth || undefined,
        phone:            form.phone       || undefined,
        address:          form.address     || undefined,
        emergencyContact: form.emergencyContact || undefined,
        medicalSummary:   form.medicalSummary   || undefined,
      });
      onCreated?.();
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Failed to create patient.');
      setApiError(msg);
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={tr('addPatient', lang)}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>{tr('close', lang)}</button>
          <button className="btn-primary"   onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader size={13} className="animate-spin" /> {lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}</>
              : tr('savePatient', lang)}
          </button>
        </>
      }
    >
      {apiError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{apiError}</div>
      )}
      <div className="space-y-3">
        <div>
          <label className="form-label">{tr('userId', lang)} *</label>
          <input
            type="number"
            className="form-input"
            placeholder={lang === 'ar' ? 'رقم المستخدم المُسجَّل' : 'Auth user ID (from /api/auth/admin/users)'}
            value={form.userId}
            onChange={(e) => set('userId', e.target.value)}
          />
          <p className="text-[11px] text-slate-400 mt-1">
            {lang === 'ar'
              ? 'يجب إنشاء مستخدم أولاً عبر /api/auth/admin/users ثم إدخال رقمه هنا.'
              : 'Create the user account first, then enter their userId here.'}
          </p>
        </div>
        <div>
          <label className="form-label">{tr('dateOfBirth', lang)}</label>
          <input type="date" className="form-input" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
        </div>
        <div>
          <label className="form-label">{tr('phone', lang)}</label>
          <input className="form-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+20123456789" />
        </div>
        <div>
          <label className="form-label">{tr('address', lang)}</label>
          <input className="form-input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St, City" />
        </div>
        <div>
          <label className="form-label">{tr('emergencyContact', lang)}</label>
          <input className="form-input" value={form.emergencyContact} onChange={(e) => set('emergencyContact', e.target.value)} placeholder="Jane Doe +2011223344" />
        </div>
        <div>
          <label className="form-label">{tr('medicalSummary', lang)}</label>
          <textarea className="form-input" rows={2} value={form.medicalSummary} onChange={(e) => set('medicalSummary', e.target.value)} placeholder="No known allergies..." />
        </div>
      </div>
    </Modal>
  );
}
