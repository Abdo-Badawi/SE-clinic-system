import { useState } from 'react';
import { Plus, Check, X, Loader } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useDoctors } from '../../hooks/useDoctors';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';
import { formatTime } from '../../utils/helpers';
import type { AppointmentStatus } from '../../api/appointmentService';

type Filter = 'all' | AppointmentStatus;

export default function AppointmentsPage() {
  const { lang, currentUser } = useAppStore();
  const { doctors } = useDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const doctorId = selectedDoctorId ?? doctors[0]?.id;

  const { appointments, loading, error, refetch, updateStatus, cancelAppointment } =
    useAppointments(doctorId ? { by: 'doctor', id: doctorId } : undefined);

  const [filter,    setFilter]    = useState<Filter>('all');
  const [showBook,  setShowBook]  = useState(false);
  const [actioning, setActioning] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('Cancelled by staff');

  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'RECEPTIONIST';

  const visible = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  // PUT /api/appointments/:id/status { status: "checked_in" }
  const handleCheckIn = async (id: number) => {
    setActioning(id);
    try { await updateStatus(id, 'checked_in'); } finally { setActioning(null); }
  };

  // PUT /api/appointments/:id/status { status: "completed" }
  const handleComplete = async (id: number) => {
    setActioning(id);
    try { await updateStatus(id, 'completed'); } finally { setActioning(null); }
  };

  // PUT /api/appointments/:id/status { status: "no_show" }
  const handleNoShow = async (id: number) => {
    setActioning(id);
    try { await updateStatus(id, 'no_show'); } finally { setActioning(null); }
  };

  // PUT /api/appointments/:id/cancel?reason=...
  const handleCancel = async (id: number) => {
    setActioning(id);
    try { await cancelAppointment(id, cancelReason); } finally { setActioning(null); }
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',        label: lang === 'ar' ? 'الكل'       : 'All' },
    { key: 'scheduled',  label: lang === 'ar' ? 'مجدول'      : 'Scheduled' },
    { key: 'checked_in', label: lang === 'ar' ? 'حاضر'       : 'Checked In' },
    { key: 'completed',  label: lang === 'ar' ? 'مكتمل'      : 'Completed' },
    { key: 'cancelled',  label: lang === 'ar' ? 'ملغي'       : 'Cancelled' },
    { key: 'no_show',    label: lang === 'ar' ? 'لم يحضر'    : 'No Show' },
  ];

  if (loading) return <LoadingSpinner message={lang === 'ar' ? 'جارٍ تحميل المواعيد...' : 'Loading appointments...'} />;
  if (error)   return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={tr('appointments', lang)}
        subtitle={`${appointments.length} ${lang === 'ar' ? 'موعد' : 'appointments'}`}
        action={canManage ? (
          <button className="btn-primary" onClick={() => setShowBook(true)}>
            <Plus size={16} /> {tr('newAppointment', lang)}
          </button>
        ) : undefined}
      />

      {/* Doctor tabs (Admin sees all doctors) */}
      {currentUser?.role === 'ADMIN' && doctors.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 self-center mr-1">
            {lang === 'ar' ? 'الطبيب:' : 'Doctor:'}
          </span>
          {doctors.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDoctorId(d.id)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                (selectedDoctorId ?? doctors[0]?.id) === d.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              Doctor #{d.id} ({d.specialization})
            </button>
          ))}
        </div>
      )}

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
              filter === f.key
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">{visible.length} {lang === 'ar' ? 'موعد' : 'results'}</span>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">{lang === 'ar' ? 'مريض' : 'Patient ID'}</th>
                <th className="table-th">{lang === 'ar' ? 'طبيب' : 'Doctor ID'}</th>
                <th className="table-th">{tr('date', lang)}</th>
                <th className="table-th">{tr('time', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr
                  key={a.id}
                  className={clsx(
                    'hover:bg-slate-50 transition-colors border-l-2',
                    a.status === 'scheduled'  ? 'border-l-blue-400' :
                    a.status === 'checked_in' ? 'border-l-amber-400' :
                    a.status === 'completed'  ? 'border-l-emerald-400' :
                    a.status === 'cancelled'  ? 'border-l-red-400' :
                    a.status === 'no_show'    ? 'border-l-slate-400' : 'border-l-transparent'
                  )}
                >
                  <td className="table-td text-xs text-slate-400">#{a.id}</td>
                  <td className="table-td font-semibold">
                    {lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}
                  </td>
                  <td className="table-td text-sm">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                  </td>
                  <td className="table-td text-sm">{a.appointmentDate}</td>
                  <td className="table-td text-sm">{formatTime(a.startTime)}</td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Receptionist/Admin: check in scheduled → checked_in */}
                      {canManage && a.status === 'scheduled' && (
                        <button
                          className="btn-success"
                          onClick={() => handleCheckIn(a.id)}
                          disabled={actioning === a.id}
                        >
                          {actioning === a.id
                            ? <Loader size={11} className="animate-spin" />
                            : <Check size={12} />}
                          {tr('checkIn', lang)}
                        </button>
                      )}
                      {/* Doctor: complete checked_in → completed */}
                      {(currentUser?.role === 'DOCTOR' || currentUser?.role === 'ADMIN') && a.status === 'checked_in' && (
                        <button
                          className="btn-success"
                          onClick={() => handleComplete(a.id)}
                          disabled={actioning === a.id}
                        >
                          {actioning === a.id ? <Loader size={11} className="animate-spin" /> : <Check size={12} />}
                          {tr('markComplete', lang)}
                        </button>
                      )}
                      {/* Doctor/Admin: mark no-show */}
                      {(currentUser?.role === 'DOCTOR' || currentUser?.role === 'ADMIN') && a.status === 'checked_in' && (
                        <button
                          className="btn-ghost text-xs"
                          onClick={() => handleNoShow(a.id)}
                          disabled={actioning === a.id}
                        >
                          {lang === 'ar' ? 'لم يحضر' : 'No Show'}
                        </button>
                      )}
                      {/* Cancel — Receptionist or Admin on scheduled/checked_in */}
                      {canManage && (a.status === 'scheduled' || a.status === 'checked_in') && (
                        <button
                          className="btn-danger"
                          onClick={() => handleCancel(a.id)}
                          disabled={actioning === a.id}
                        >
                          <X size={12} /> {tr('cancel', lang)}
                        </button>
                      )}
                      {a.cancellationReason && a.status === 'cancelled' && (
                        <span className="text-[10px] text-slate-400 italic">{a.cancellationReason}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-td py-16 text-center text-slate-400">{tr('noData', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBook && <BookAppointmentModal onClose={() => setShowBook(false)} onCreated={refetch} />}
    </div>
  );
}
