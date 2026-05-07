import { useAppStore } from '../../store/useAppStore';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { tr } from '../../utils/i18n';
import { dateOnly } from '../../utils/helpers';

export default function MyRecordsPage() {
  const { lang, currentUser } = useAppStore();
  const patientId = currentUser?.patientId ?? currentUser?.id;

  // GET /api/medical-records/patient/:patientId
  const { records, loading, error, refetch } =
    useMedicalRecords(patientId ? { by: 'patient', id: patientId } : undefined);

  const sorted = [...records].sort((a, b) => (b.visitDate ?? '').localeCompare(a.visitDate ?? ''));

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={tr('myRecords', lang)}
        subtitle={`${records.length} ${lang === 'ar' ? 'سجل طبي' : 'medical records'}`}
      />

      {sorted.length === 0 && (
        <div className="card py-16 text-center text-slate-400 text-sm">{tr('noData', lang)}</div>
      )}

      <div className="space-y-4">
        {sorted.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  #{r.id}
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full">
                    {dateOnly(r.visitDate)}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{r.doctorId}
                    {r.appointmentId && ` · ${lang === 'ar' ? 'موعد' : 'Appt'} #${r.appointmentId}`}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {tr('diagnosis', lang)}
                </div>
                <div className="text-sm font-semibold text-slate-800">{r.diagnosis || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {tr('prescription', lang)}
                </div>
                <div className="text-sm">💊 {r.prescription || '—'}</div>
              </div>
            </div>

            {r.notes && (
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {tr('clinicalNotes', lang)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.notes}</p>
              </div>
            )}

            {r.attachments && (
              <div className="text-xs">
                <span className="text-slate-400">
                  {lang === 'ar' ? 'مرفق: ' : 'Attachment: '}
                </span>
                <a
                  href={r.attachments}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {r.attachments}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
