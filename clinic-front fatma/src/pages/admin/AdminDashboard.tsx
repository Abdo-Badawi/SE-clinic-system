import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useDoctors } from '../../hooks/useDoctors';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { getStatusDot, formatTime } from '../../utils/helpers';

export default function AdminDashboard() {
  const { lang, currentUser } = useAppStore();
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const firstDoctorId = doctors[0]?.id;

  // GET /api/appointments/doctor/:doctorId
  const { appointments, loading, error, refetch } =
    useAppointments(firstDoctorId ? { by: 'doctor', id: firstDoctorId } : undefined);

  const today      = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.appointmentDate === today);
  const scheduled  = appointments.filter((a) => a.status === 'scheduled').length;
  const checkedIn  = appointments.filter((a) => a.status === 'checked_in').length;
  const completed  = appointments.filter((a) => a.status === 'completed').length;
  const cancelled  = appointments.filter((a) => a.status === 'cancelled').length;

  const barData = [40, 65, 50, 80, 60, 90, 75];
  const days = lang === 'ar'
    ? ['إث', 'ث', 'أر', 'خ', 'ج', 'س', 'ح']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading && !firstDoctorId) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {tr('goodMorning', lang)} {currentUser?.fullName?.split(' ')[0] ?? ''} 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">{tr('todayOverview', lang)}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/appointments')}>
          <Plus size={16} /> {tr('newAppointment', lang)}
        </button>
      </div>

      {/* Stats — from actual appointment data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={22} />}     value={todayAppts.length} label={tr('todayAppts', lang)}                              color="blue" />
        <StatCard icon={<Clock size={22} />}         value={checkedIn}         label={lang === 'ar' ? 'في الانتظار' : 'Checked In'}        color="amber" />
        <StatCard icon={<CheckCircle size={22} />}   value={completed}         label={lang === 'ar' ? 'مكتملة' : 'Completed'}              color="green" />
        <StatCard icon={<XCircle size={22} />}       value={cancelled}         label={lang === 'ar' ? 'ملغية / لم يحضر' : 'Cancelled'}     color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Today's schedule */}
        <div className="xl:col-span-3 card">
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <h3 className="font-semibold text-slate-800">{tr('todaySchedule', lang)}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' ? `${todayAppts.length} موعد اليوم` : `${todayAppts.length} appointment(s) today`}
              </p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => navigate('/appointments')}>
              {tr('viewAll', lang)}
            </button>
          </div>
          <div className="p-5 divide-y divide-slate-100">
            {loading && <LoadingSpinner />}
            {!loading && todayAppts.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {todayAppts.map((a) => (
              <div key={a.id} className="flex items-start gap-4 py-3">
                <div className="text-end w-20 flex-shrink-0">
                  <div className="text-xs font-bold text-primary-600">{formatTime(a.startTime)}</div>
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(a.status)} mt-0.5`} />
                  <div className="w-px flex-1 bg-slate-200 min-h-[16px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                    {a.endTime && ` · ${formatTime(a.startTime)} – ${formatTime(a.endTime)}`}
                  </div>
                  <div className="mt-1.5"><Badge status={a.status} lang={lang} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-5">
          {/* Weekly mini-chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{tr('weeklyOverview', lang)}</h3>
            <div className="flex items-end gap-1.5 h-16">
              {barData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md ${i === new Date().getDay() ? 'bg-primary-500' : 'bg-primary-100'}`}
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[9px] text-slate-400">{days[i]}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 mt-4 pt-4 border-t border-slate-100 gap-2">
              {[
                { v: appointments.length, l: lang === 'ar' ? 'إجمالي' : 'Total' },
                { v: scheduled,           l: lang === 'ar' ? 'مجدول'  : 'Scheduled' },
                { v: completed,           l: lang === 'ar' ? 'مكتمل'  : 'Completed' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-base font-bold text-slate-800">{item.v}</div>
                  <div className="text-[10px] text-slate-400">{item.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors list — GET /api/doctors */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">
              {lang === 'ar' ? 'الأطباء المسجلون' : 'Registered Doctors'}
            </h3>
            <div className="space-y-3">
              {doctors.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    DR
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-700">
                      {lang === 'ar' ? 'طبيب' : 'Doctor'} #{d.id}
                    </div>
                    <div className="text-xs text-slate-400">{d.specialization}</div>
                  </div>
                  {d.isActive === false && (
                    <span className="badge-gray text-[10px]">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                  )}
                </div>
              ))}
              {doctors.length === 0 && (
                <p className="text-xs text-slate-400">{tr('noData', lang)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
