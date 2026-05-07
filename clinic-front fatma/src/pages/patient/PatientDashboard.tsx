import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Pill } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatTime, dateOnly } from '../../utils/helpers';

export default function PatientDashboard() {
  const { lang, currentUser } = useAppStore();
  const navigate = useNavigate();

  // Patient's ID = their userId (from JwtResponse.userId)
  const patientId = currentUser?.patientId ?? currentUser?.id;

  // GET /api/appointments/patient/:patientId
  const { appointments, loading: aLoad } =
    useAppointments(patientId ? { by: 'patient', id: patientId } : undefined);

  // GET /api/medical-records/patient/:patientId
  const { records, loading: rLoad } =
    useMedicalRecords(patientId ? { by: 'patient', id: patientId } : undefined);

  const upcoming  = appointments.filter((a) => a.status === 'scheduled' || a.status === 'checked_in');
  const withRx    = records.filter((r) => !!r.prescription);

  if (aLoad || rLoad) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'ar' ? `مرحباً، ${currentUser?.fullName?.split(' ')[0] ?? ''} 👋` : `Hello, ${currentUser?.fullName?.split(' ')[0] ?? ''} 👋`}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{tr('healthSummary', lang)}</p>
        {patientId && (
          <p className="text-xs text-slate-400 mt-0.5">Patient ID: #{patientId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Calendar size={22} />} value={appointments.length} label={tr('myAppointments', lang)} color="blue" />
        <StatCard icon={<FileText size={22} />}  value={records.length}      label={tr('myRecords', lang)}      color="green" />
        <StatCard icon={<Pill size={22} />}      value={withRx.length}       label={tr('activePrescriptions', lang)} color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Upcoming — GET /api/appointments/patient/:id */}
        <div className="card">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{tr('upcomingAppts', lang)}</h3>
            <button className="btn-ghost text-xs" onClick={() => navigate('/my-appointments')}>
              {tr('viewAll', lang)}
            </button>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {upcoming.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {upcoming.slice(0, 5).map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {a.appointmentDate} · {formatTime(a.startTime)}
                  </div>
                  {a.checkInTime && (
                    <div className="text-[10px] text-emerald-600 mt-0.5">
                      {lang === 'ar' ? 'وقت الحضور:' : 'Checked in at:'} {a.checkInTime.split('T')[1]?.slice(0, 5)}
                    </div>
                  )}
                </div>
                <Badge status={a.status} lang={lang} />
              </div>
            ))}
          </div>
        </div>

        {/* Medical records — GET /api/medical-records/patient/:id */}
        <div className="card">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{tr('recentDiagnoses', lang)}</h3>
            <button className="btn-ghost text-xs" onClick={() => navigate('/my-records')}>
              {tr('viewAll', lang)}
            </button>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {records.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {records.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm">{r.diagnosis || '—'}</div>
                  <span className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                    {dateOnly(r.visitDate)}
                  </span>
                </div>
                {r.prescription && (
                  <div className="text-xs text-slate-500 mt-1">💊 {r.prescription}</div>
                )}
                {r.notes && (
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{r.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
