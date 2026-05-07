import { useState } from 'react';
import { Plus, X, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { useAppointments } from '../../hooks/useAppointments';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';
import { formatTime } from '../../utils/helpers';

export default function MyAppointmentsPage() {
  const { lang, currentUser } = useAppStore();
  const patientId = currentUser?.patientId ?? currentUser?.id;

  // GET /api/appointments/patient/:patientId
  const { appointments, loading, error, refetch, cancelAppointment } =
    useAppointments(patientId ? { by: 'patient', id: patientId } : undefined);

  const [showBook,  setShowBook]  = useState(false);
  const [actioning, setActioning] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('Personal reason');

  // PUT /api/appointments/:id/cancel?reason=...
  const handleCancel = async (id: number) => {
    setActioning(id);
    try { await cancelAppointment(id, cancelReason); } finally { setActioning(null); }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={tr('myAppointments', lang)}
        subtitle={`${appointments.length} ${lang === 'ar' ? 'موعد' : 'appointments'}`}
        action={
          <button className="btn-primary" onClick={() => setShowBook(true)}>
            <Plus size={16} /> {tr('bookAppointment', lang)}
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">{lang === 'ar' ? 'طبيب' : 'Doctor ID'}</th>
                <th className="table-th">{tr('date', lang)}</th>
                <th className="table-th">{tr('time', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td text-xs text-slate-400">#{a.id}</td>
                  <td className="table-td font-semibold">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                  </td>
                  <td className="table-td text-sm">{a.appointmentDate}</td>
                  <td className="table-td text-sm">{formatTime(a.startTime)}</td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  <td className="table-td">
                    {/* PUT /api/appointments/:id/cancel?reason=... — patient cancels own */}
                    {(a.status === 'scheduled') && (
                      <button
                        className="btn-danger"
                        onClick={() => handleCancel(a.id)}
                        disabled={actioning === a.id}
                      >
                        {actioning === a.id ? <Loader size={11} className="animate-spin" /> : <X size={12} />}
                        {tr('cancel', lang)}
                      </button>
                    )}
                    {a.cancellationReason && a.status === 'cancelled' && (
                      <span className="text-[10px] text-slate-400 italic">{a.cancellationReason}</span>
                    )}
                    {a.checkInTime && a.status === 'checked_in' && (
                      <span className="text-[10px] text-emerald-600">
                        ✓ {lang === 'ar' ? 'تم الحضور' : 'Checked in'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-td py-12 text-center text-slate-400">{tr('noData', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBook && (
        <BookAppointmentModal
          onClose={() => setShowBook(false)}
          onCreated={refetch}
          prePatientId={patientId}
        />
      )}
    </div>
  );
}
