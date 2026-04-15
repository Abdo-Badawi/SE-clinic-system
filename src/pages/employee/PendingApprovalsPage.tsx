import { Check, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';

export default function PendingApprovalsPage() {
  const { lang, appointments, confirmAppointment, cancelAppointment } = useAppStore();
  const pending = appointments.filter((a) => a.status === 'Pending');

  return (
    <div>
      <PageHeader
        title={tr('pendingApprovals', lang)}
        subtitle={`${pending.length} ${lang === 'ar' ? 'طلب بانتظار الموافقة' : 'requests awaiting action'}`}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">{tr('patientName', lang)}</th>
                <th className="table-th">{tr('dateTime', lang)}</th>
                <th className="table-th">{tr('type', lang)}</th>
                <th className="table-th">{tr('notes', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/30 transition-colors border-s-2 border-s-amber-400">
                  <td className="table-td font-semibold">{lang === 'ar' ? a.patientNameAr : a.patientName}</td>
                  <td className="table-td">
                    <div>{a.date}</div><div className="text-xs text-slate-400">{a.time}</div>
                  </td>
                  <td className="table-td">{a.type}</td>
                  <td className="table-td text-xs text-slate-500">{lang === 'ar' ? a.notesAr : a.notes}</td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button className="btn-success" onClick={() => confirmAppointment(a.id)}>
                        <Check size={12} /> {tr('confirm', lang)}
                      </button>
                      <button className="btn-danger" onClick={() => cancelAppointment(a.id)}>
                        <X size={12} /> {tr('cancel', lang)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-td py-16 text-center text-slate-400">
                    ✅ {lang === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending approvals'}
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
