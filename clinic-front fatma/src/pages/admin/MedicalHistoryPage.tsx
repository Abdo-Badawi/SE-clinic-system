import { useState } from 'react';
import { Plus, Edit, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import MedicalRecordModal from '../../components/modals/MedicalRecordModal';
import type { MedicalRecordDTO } from '../../api/medicalRecordService';
import { dateOnly } from '../../utils/helpers';

interface Props {
  filterPatientId?: number;
  readOnly?: boolean;
}

export default function MedicalHistoryPage({ filterPatientId, readOnly = false }: Props) {
  const { lang, currentUser } = useAppStore();

  // Need patientId to call GET /api/medical-records/patient/:id
  const [patientInput,    setPatientInput]    = useState(filterPatientId?.toString() || '');
  const [activePatientId, setActivePatientId] = useState<number | undefined>(filterPatientId);
  const [loadingId,       setLoadingId]       = useState(false);

  // Or fetch by doctorId: GET /api/medical-records/doctor/:id
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>('patient');
  const [doctorInput, setDoctorInput] = useState('');
  const [activeDoctorId, setActiveDoctorId] = useState<number | undefined>();

  const mode = viewMode === 'patient' && activePatientId
    ? { by: 'patient' as const, id: activePatientId }
    : viewMode === 'doctor' && activeDoctorId
    ? { by: 'doctor' as const, id: activeDoctorId }
    : undefined;

  const { records, loading, error, refetch } = useMedicalRecords(mode);

  const [showModal,  setShowModal]  = useState(false);
  const [editRecord, setEditRecord] = useState<MedicalRecordDTO | null>(null);

  const canWrite = !readOnly && (currentUser?.role === 'ADMIN' || currentUser?.role === 'DOCTOR');
  const sorted   = [...records].sort((a, b) => (b.visitDate ?? '').localeCompare(a.visitDate ?? ''));

  const handleLoad = () => {
    setLoadingId(true);
    if (viewMode === 'patient') {
      const id = parseInt(patientInput);
      if (id) { setActivePatientId(id); setActiveDoctorId(undefined); }
    } else {
      const id = parseInt(doctorInput);
      if (id) { setActiveDoctorId(id); setActivePatientId(undefined); }
    }
    setTimeout(() => setLoadingId(false), 200);
  };

  return (
    <div>
      <PageHeader
        title={tr('medicalHistory', lang)}
        subtitle={`${records.length} ${lang === 'ar' ? 'سجل' : 'records'}`}
        action={canWrite && (activePatientId || activeDoctorId) ? (
          <button className="btn-primary" onClick={() => { setEditRecord(null); setShowModal(true); }}>
            <Plus size={16} /> {tr('newRecord', lang)}
          </button>
        ) : undefined}
      />

      {/* Lookup panel */}
      {!filterPatientId && (
        <div className="card p-5 mb-5">
          <div className="flex gap-3 mb-3">
            <button
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${viewMode === 'patient' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
              onClick={() => setViewMode('patient')}
            >
              {lang === 'ar' ? 'بحث بمريض' : 'By Patient ID'}
            </button>
            <button
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${viewMode === 'doctor' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
              onClick={() => setViewMode('doctor')}
            >
              {lang === 'ar' ? 'بحث بطبيب' : 'By Doctor ID'}
            </button>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              className="form-input max-w-[180px]"
              placeholder={viewMode === 'patient'
                ? (lang === 'ar' ? 'Patient ID' : 'Patient ID e.g. 5')
                : (lang === 'ar' ? 'Doctor ID' : 'Doctor ID e.g. 3')}
              value={viewMode === 'patient' ? patientInput : doctorInput}
              onChange={(e) => viewMode === 'patient' ? setPatientInput(e.target.value) : setDoctorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            />
            <button className="btn-primary" onClick={handleLoad} disabled={loadingId}>
              {loadingId ? <Loader size={14} className="animate-spin" /> : (lang === 'ar' ? 'تحميل' : 'Load')}
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error   && <ErrorAlert message={error} onRetry={refetch} />}

      {!loading && !error && (activePatientId || activeDoctorId) && (
        <div className="space-y-4">
          {sorted.length === 0 && (
            <div className="card py-16 text-center text-slate-400 text-sm">{tr('noData', lang)}</div>
          )}
          {sorted.map((r) => (
            <div key={r.id} className="card p-5 hover:border-primary-200 transition-colors">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    #{r.id}
                  </div>
                  <div>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span>{lang === 'ar' ? 'مريض' : 'Patient'} #{r.patientId}</span>
                      <span>{lang === 'ar' ? 'طبيب' : 'Doctor'} #{r.doctorId}</span>
                      {r.appointmentId && <span>{lang === 'ar' ? 'موعد' : 'Appt'} #{r.appointmentId}</span>}
                    </div>
                    <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {dateOnly(r.visitDate)}
                    </span>
                  </div>
                </div>
                {canWrite && (
                  <button className="btn-ghost text-xs" onClick={() => { setEditRecord(r); setShowModal(true); }}>
                    <Edit size={13} /> {tr('edit', lang)}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('diagnosis', lang)}</div>
                  <div className="text-sm font-semibold text-slate-800">{r.diagnosis || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('prescription', lang)}</div>
                  <div className="text-sm">💊 {r.prescription || '—'}</div>
                </div>
              </div>

              {r.notes && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('clinicalNotes', lang)}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.notes}</p>
                </div>
              )}

              {r.attachments && (
                <div className="text-xs">
                  <span className="text-slate-400">{lang === 'ar' ? 'مرفق: ' : 'Attachment: '}</span>
                  <a href={r.attachments} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">{r.attachments}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MedicalRecordModal
          existingRecord={editRecord || undefined}
          prePatientId={activePatientId}
          onClose={() => { setShowModal(false); setEditRecord(null); }}
          onSaved={refetch}
        />
      )}
    </div>
  );
}
