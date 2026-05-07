import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { getStatusDot, formatTime, dateOnly } from '../../utils/helpers';

export default function DoctorDashboard() {
  const { lang, currentUser } = useAppStore();
  const navigate = useNavigate();

  // GET /api/appointments/doctor/:doctorId
  const doctorId = currentUser?.doctorId ?? currentUser?.id;
  const { appointments, loading: aLoad, error: aErr, refetch: aRefetch, updateStatus } =
    useAppointments(doctorId ? { by: 'doctor', id: doctorId } : undefined);

  // GET /api/medical-records/doctor/:doctorId
  const { records, loading: rLoad } =
    useMedicalRecords(doctorId ? { by: 'doctor', id: doctorId } : undefined);

  const today      = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.appointmentDate === today);
  const checkedIn  = appointments.filter((a) => a.status === 'checked_in');
  const completed  = appointments.filter((a) => a.status === 'completed').length;
  const scheduled  = appointments.filter((a) => a.status === 'scheduled').length;

  if (aLoad) return <LoadingSpinner message={lang === 'ar' ? 'جارٍ تحميل الجدول...' : 'Loading schedule...'} />;
  if (aErr)  return <ErrorAlert message={aErr} onRetry={aRefetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {tr('workspaceTitle', lang)} 🩺
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {lang === 'ar' ? 'نظرة عامة على يومك السريري' : 'Your clinical overview for today'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={22} />}    value={todayAppts.length} label={tr('todayAppts', lang)}                              color="blue" />
        <StatCard icon={<Clock size={22} />}        value={checkedIn.length}  label={lang === 'ar' ? 'بانتظارك (حاضر)' : 'Waiting (Checked In)'} color="amber" />
        <StatCard icon={<CheckCircle size={22} />}  value={completed}         label={lang === 'ar' ? 'مكتملة اليوم' : 'Completed Today'}  color="green" />
        <StatCard icon={<FileText size={22} />}     value={records.length}    label={lang === 'ar' ? 'سجلاتي الطبية' : 'My Records'}      color="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Today's appointments — GET /api/appointments/doctor/:id */}
        <div className="card">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{tr('todaySchedule', lang)}</h3>
            <span className="text-xs text-slate-400">{todayAppts.length} {lang === 'ar' ? 'موعد' : 'today'}</span>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {todayAppts.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {todayAppts.map((a) => (
              <div key={a.id} className="py-3 flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(a.status)} mt-1`} />
                  <div className="w-px h-4 bg-slate-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm">
                      {lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">{formatTime(a.startTime)}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <Badge status={a.status} lang={lang} />
                    {/* PUT /api/appointments/:id/status { status: "completed" } */}
                    {a.status === 'checked_in' && (
                      <button
                        className="btn-success text-[11px] px-2 py-1"
                        onClick={async () => { await updateStatus(a.id, 'completed'); }}
                      >
                        ✓ {tr('markComplete', lang)}
                      </button>
                    )}
                    {/* PUT /api/appointments/:id/status { status: "no_show" } */}
                    {a.status === 'checked_in' && (
                      <button
                        className="btn-ghost text-[11px] px-2 py-1"
                        onClick={async () => { await updateStatus(a.id, 'no_show'); }}
                      >
                        {lang === 'ar' ? 'لم يحضر' : 'No Show'}
                      </button>
                    )}
                  </div>
                  {a.status === 'checked_in' && (
                    <button
                      className="btn-primary text-[11px] px-2 py-1 mt-1"
                      onClick={() => navigate('/records')}
                    >
                      + {tr('newRecord', lang)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent medical records — GET /api/medical-records/doctor/:id */}
        <div className="card">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              {lang === 'ar' ? 'آخر السجلات الطبية' : 'Recent Medical Records'}
            </h3>
            <button className="btn-ghost text-xs" onClick={() => navigate('/records')}>
              {tr('viewAll', lang)}
            </button>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {rLoad && <LoadingSpinner />}
            {!rLoad && records.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {records.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">
                    {lang === 'ar' ? 'مريض' : 'Patient'} #{r.patientId}
                    {r.appointmentId && <span className="text-[10px] text-slate-400 ml-2">· Appt #{r.appointmentId}</span>}
                  </div>
                  <span className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-semibold">
                    {dateOnly(r.visitDate)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{r.diagnosis || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All checked-in patients (not just today) */}
      {checkedIn.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-4">
            {lang === 'ar' ? 'جميع المرضى الحاضرون بانتظارك' : 'All Checked-In Patients'}
          </h3>
          <div className="divide-y divide-slate-100">
            {checkedIn.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm">{lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}</div>
                  <div className="text-xs text-slate-400">{a.appointmentDate} · {formatTime(a.startTime)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-primary text-xs px-3 py-1.5" onClick={() => navigate('/records')}>
                    + {tr('newRecord', lang)}
                  </button>
                  <button className="btn-success text-xs" onClick={async () => { await updateStatus(a.id, 'completed'); }}>
                    ✓ {tr('markComplete', lang)}
                  </button>
                  <button className="btn-ghost text-xs" onClick={async () => { await updateStatus(a.id, 'no_show'); }}>
                    {lang === 'ar' ? 'لم يحضر' : 'No Show'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
