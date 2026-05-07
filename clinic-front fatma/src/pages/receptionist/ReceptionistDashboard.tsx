import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Calendar, Check, X, Loader } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useDoctors } from '../../hooks/useDoctors';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';
import { formatTime } from '../../utils/helpers';

export default function ReceptionistDashboard() {
  const { lang } = useAppStore();
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const firstDoctorId = doctors[0]?.id;

  // GET /api/appointments/doctor/:doctorId
  const { appointments, loading, error, refetch, updateStatus, cancelAppointment } =
    useAppointments(firstDoctorId ? { by: 'doctor', id: firstDoctorId } : undefined);

  const [actioning, setActioning] = useState<number | null>(null);
  const [showBook,  setShowBook]  = useState(false);

  const today     = new Date().toISOString().split('T')[0];
  const scheduled = appointments.filter((a) => a.status === 'scheduled');
  const checkedIn = appointments.filter((a) => a.status === 'checked_in').length;
  const todayAll  = appointments.filter((a) => a.appointmentDate === today);
  const cancelled = appointments.filter((a) => a.status === 'cancelled' && a.appointmentDate === today).length;

  // PUT /api/appointments/:id/status { status: "checked_in" }
  const handleCheckIn = async (id: number) => {
    setActioning(id);
    try { await updateStatus(id, 'checked_in'); } finally { setActioning(null); }
  };

  // PUT /api/appointments/:id/cancel?reason=...
  const handleCancel = async (id: number) => {
    setActioning(id);
    try { await cancelAppointment(id, 'Cancelled by receptionist'); } finally { setActioning(null); }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{tr('secretaryDash', lang)} 📋</h2>
        <p className="text-sm text-slate-400 mt-1">{tr('manageAppts', lang)}</p>
      </div>
      <div className="card p-5 text-center">
        <p className="text-sm text-slate-500 mb-3">{error}</p>
        <button className="btn-primary" onClick={refetch}>{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{tr('secretaryDash', lang)} 📋</h2>
          <p className="text-sm text-slate-400 mt-1">{tr('manageAppts', lang)}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowBook(true)}>
          <Calendar size={15} /> {tr('bookAppointment', lang)}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock size={22} />}       value={scheduled.length} label={tr('pendingConfirm', lang)}     color="amber" />
        <StatCard icon={<CheckCircle size={22} />} value={checkedIn}        label={tr('confirmedToday', lang)}     color="green" trendUp />
        <StatCard icon={<Calendar size={22} />}    value={todayAll.length}  label={lang === 'ar' ? 'مواعيد اليوم' : "Today's Total"} color="blue" />
        <StatCard icon={<XCircle size={22} />}     value={cancelled}        label={tr('cancellationsToday', lang)} color="red" />
      </div>

      {/* Scheduled — awaiting check-in (PUT /api/appointments/:id/status + cancel) */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div>
            <h3 className="font-semibold text-slate-800">{tr('pendingApprovals', lang)}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{tr('actionRequired', lang)}</p>
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {scheduled.length} {lang === 'ar' ? 'مجدول' : 'scheduled'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-3">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">{lang === 'ar' ? 'مريض' : 'Patient'}</th>
                <th className="table-th">{lang === 'ar' ? 'طبيب' : 'Doctor'}</th>
                <th className="table-th">{tr('date', lang)}</th>
                <th className="table-th">{tr('time', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/40 transition-colors border-l-2 border-l-amber-400">
                  <td className="table-td text-xs text-slate-400">#{a.id}</td>
                  <td className="table-td font-semibold">#{a.patientId}</td>
                  <td className="table-td text-sm">#{a.doctorId}</td>
                  <td className="table-td text-sm">{a.appointmentDate}</td>
                  <td className="table-td text-sm">{formatTime(a.startTime)}</td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      {/* PUT /api/appointments/:id/status { status: "checked_in" } */}
                      <button
                        className="btn-success"
                        onClick={() => handleCheckIn(a.id)}
                        disabled={actioning === a.id}
                      >
                        {actioning === a.id ? <Loader size={11} className="animate-spin" /> : <Check size={12} />}
                        {tr('checkIn', lang)}
                      </button>
                      {/* PUT /api/appointments/:id/cancel?reason=... */}
                      <button
                        className="btn-danger"
                        onClick={() => handleCancel(a.id)}
                        disabled={actioning === a.id}
                      >
                        <X size={12} /> {tr('cancel', lang)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {scheduled.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-td text-center py-10 text-slate-400">
                    ✅ {lang === 'ar' ? 'لا توجد مواعيد مجدولة' : 'No scheduled appointments'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's full schedule */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">{tr('todaySchedule', lang)}</h3>
        <div className="divide-y divide-slate-100">
          {todayAll.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
          )}
          {todayAll.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3 gap-4">
              <div className="text-sm font-bold text-primary-600 w-20 flex-shrink-0">{formatTime(a.startTime)}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}</div>
                <div className="text-xs text-slate-400">{lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}</div>
              </div>
              <Badge status={a.status} lang={lang} />
            </div>
          ))}
        </div>
      </div>

      {showBook && (
        <BookAppointmentModal onClose={() => setShowBook(false)} onCreated={refetch} />
      )}
    </div>
  );
}
