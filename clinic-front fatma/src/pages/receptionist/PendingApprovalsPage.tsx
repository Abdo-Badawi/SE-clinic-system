import { useState } from 'react';
import { Check, X, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import { useDoctors } from '../../hooks/useDoctors';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { formatTime } from '../../utils/helpers';
import clsx from 'clsx';

export default function PendingApprovalsPage() {
  const { lang } = useAppStore();
  const { doctors } = useDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const doctorId = selectedDoctorId ?? doctors[0]?.id;

  // GET /api/appointments/doctor/:doctorId — then filter scheduled
  const { appointments, loading, error, refetch, updateStatus, cancelAppointment } =
    useAppointments(doctorId ? { by: 'doctor', id: doctorId } : undefined);

  const [actioning, setActioning] = useState<number | null>(null);

  // All scheduled (not yet checked in) across all doctors
  const scheduled = appointments.filter((a) => a.status === 'scheduled');

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
  if (error)   return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={tr('pendingApprovals', lang)}
        subtitle={`${scheduled.length} ${lang === 'ar' ? 'موعد بانتظار الإجراء' : 'scheduled appointments awaiting action'}`}
      />

      {/* Doctor tabs */}
      {doctors.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 self-center">
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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">{lang === 'ar' ? 'مريض' : 'Patient'}</th>
                <th className="table-th">{lang === 'ar' ? 'طبيب' : 'Doctor'}</th>
                <th className="table-th">{tr('dateTime', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/30 transition-colors border-l-2 border-l-amber-400">
                  <td className="table-td text-xs text-slate-400">#{a.id}</td>
                  <td className="table-td font-semibold">
                    {lang === 'ar' ? 'مريض' : 'Patient'} #{a.patientId}
                  </td>
                  <td className="table-td text-sm">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                  </td>
                  <td className="table-td">
                    <div className="font-medium text-sm">{a.appointmentDate}</div>
                    <div className="text-xs text-slate-400">{formatTime(a.startTime)}</div>
                  </td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      {/* PUT /api/appointments/:id/status { status: "checked_in" } */}
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
                  <td colSpan={6} className="table-td py-16 text-center text-slate-400">
                    ✅ {lang === 'ar' ? 'لا توجد مواعيد مجدولة بانتظار الإجراء' : 'No scheduled appointments awaiting action'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
