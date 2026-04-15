import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';

export default function MyAppointmentsPage() {
  const { lang, currentUser, appointments } = useAppStore();
  const [showBook, setShowBook] = useState(false);
  const patientId = currentUser?.patientId ?? 1;
  const myAppts = appointments.filter((a) => a.patientId === patientId);

  return (
    <div>
      <PageHeader
        title={tr('myAppointments', lang)}
        subtitle={`${myAppts.length} ${lang === 'ar' ? 'موعد' : 'appointments'}`}
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
                <th className="table-th">{tr('dateTime', lang)}</th>
                <th className="table-th">{tr('type', lang)}</th>
                <th className="table-th">{tr('doctor', lang) || 'Doctor'}</th>
                <th className="table-th">{tr('notes', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {myAppts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td">
                    <div className="font-medium">{a.date}</div>
                    <div className="text-xs text-slate-400">{a.time}</div>
                  </td>
                  <td className="table-td">{a.type}</td>
                  <td className="table-td text-sm">{lang === 'ar' ? a.doctorAr : a.doctor}</td>
                  <td className="table-td text-xs text-slate-500">{lang === 'ar' ? a.notesAr : a.notes}</td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                </tr>
              ))}
              {myAppts.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-td py-12 text-center text-slate-400">{tr('noData', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBook && <BookAppointmentModal onClose={() => setShowBook(false)} prePatientId={patientId} />}
    </div>
  );
}
