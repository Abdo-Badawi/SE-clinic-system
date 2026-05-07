import { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { adminCreateUserApi } from '../../api/authService';
import { createDoctorApi } from '../../api/doctorService';
import { createPatientApi } from '../../api/patientService';
import { useDoctors } from '../../hooks/useDoctors';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import Modal from '../../components/ui/Modal';

const ROLE_BADGE: Record<string, string> = {
  ADMIN:        'badge-blue',
  DOCTOR:       'badge-green',
  RECEPTIONIST: 'badge-amber',
  PATIENT:      'badge-gray',
};

export default function UsersPage() {
  const { lang } = useAppStore();
  const { doctors, loading, error, refetch } = useDoctors();
  const [showAdd, setShowAdd] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [formErr, setFormErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // RegisterRequest fields
  const [form, setForm] = useState({
    fullName:       '',
    email:          '',
    password:       '',
    role:           'DOCTOR' as 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT',
    phone:          '',
    address:        '',
    specialization: '',
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setFormErr(lang === 'ar' ? 'الاسم والبريد وكلمة المرور مطلوبة.' : 'Name, email, and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setFormErr(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }
    setSaving(true); setFormErr(''); setSuccessMsg('');
    try {
      // Step 1: POST /api/auth/admin/users — RegisterRequest
      const jwt = await adminCreateUserApi({
        fullName:       form.fullName,
        email:          form.email,
        password:       form.password,
        role:           form.role,
        phone:          form.phone       || undefined,
        address:        form.address     || undefined,
        specialization: form.role === 'DOCTOR' ? form.specialization : undefined,
      });

      // Step 2: Create profile if DOCTOR → POST /api/doctors
      if (form.role === 'DOCTOR' && form.specialization) {
        await createDoctorApi({ userId: jwt.userId, specialization: form.specialization });
      }

      // Step 3: Create profile if PATIENT → POST /api/patients
      if (form.role === 'PATIENT') {
        await createPatientApi({
          userId: jwt.userId,
          phone:   form.phone   || undefined,
          address: form.address || undefined,
        });
      }

      setSuccessMsg(
        lang === 'ar'
          ? `تم إنشاء المستخدم بنجاح. ID: ${jwt.userId}`
          : `User created. ID: ${jwt.userId}`
      );
      setForm({ fullName: '', email: '', password: '', role: 'DOCTOR', phone: '', address: '', specialization: '' });
      refetch();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Failed to create user.');
      setFormErr(msg);
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={tr('userAccounts', lang)}
        subtitle={`${doctors.length} ${lang === 'ar' ? 'طبيب مسجل' : 'registered doctors'}`}
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> {tr('addUser', lang)}
          </button>
        }
      />

      {/* Doctors — GET /api/doctors (only list endpoint available) */}
      <div className="card overflow-hidden">
        <div className="px-5 pt-4 pb-1 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">{lang === 'ar' ? 'قائمة الأطباء' : 'Doctors'}</div>
          <div className="text-xs text-slate-400">
            {lang === 'ar' ? '* GET /api/doctors فقط' : '* Only GET /api/doctors is available'}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">{lang === 'ar' ? 'التخصص' : 'Specialization'}</th>
                <th className="table-th">{tr('role', lang)}</th>
                <th className="table-th">{lang === 'ar' ? 'النشاط' : 'Active'}</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td font-mono text-sm">#{d.id}</td>
                  <td className="table-td text-sm">{d.specialization}</td>
                  <td className="table-td">
                    <span className={ROLE_BADGE['DOCTOR']}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
                      {tr('doctor', lang)}
                    </span>
                  </td>
                  <td className="table-td">
                    {d.isActive === false
                      ? <span className="badge-red">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                      : <span className="badge-green">{lang === 'ar' ? 'نشط' : 'Active'}</span>}
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr><td colSpan={4} className="table-td py-16 text-center text-slate-400">{tr('noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <Modal
          title={tr('addUser', lang)}
          onClose={() => { setShowAdd(false); setFormErr(''); setSuccessMsg(''); }}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setShowAdd(false)} disabled={saving}>{tr('close', lang)}</button>
              <button className="btn-primary"   onClick={handleAdd} disabled={saving}>
                {saving
                  ? <><Loader size={13} className="animate-spin" /> {lang === 'ar' ? 'جارٍ الإنشاء...' : 'Creating...'}</>
                  : tr('save', lang)}
              </button>
            </>
          }
        >
          {formErr   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{formErr}</div>}
          {successMsg && <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">{successMsg}</div>}
          <div className="space-y-3">
            <div>
              <label className="form-label">{tr('fullName', lang)} *</label>
              <input className="form-input" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Dr. John Smith" />
            </div>
            <div>
              <label className="form-label">{tr('emailAddress', lang)} *</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="doctor@clinic.com" />
            </div>
            <div>
              <label className="form-label">{tr('password', lang)} * (min 6 chars)</label>
              <input type="password" className="form-input" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label className="form-label">{tr('role', lang)} *</label>
              <select className="form-input" value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="DOCTOR">{tr('doctor', lang)}</option>
                <option value="RECEPTIONIST">{tr('receptionist', lang)}</option>
                <option value="PATIENT">{tr('patient', lang)}</option>
              </select>
            </div>
            {form.role === 'DOCTOR' && (
              <div>
                <label className="form-label">{tr('specialization', lang)}</label>
                <input className="form-input" value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Cardiology, General..." />
              </div>
            )}
            <div>
              <label className="form-label">{tr('phone', lang)}</label>
              <input className="form-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+20123456789" />
            </div>
            {form.role === 'PATIENT' && (
              <div>
                <label className="form-label">{tr('address', lang)}</label>
                <input className="form-input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St, City" />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
