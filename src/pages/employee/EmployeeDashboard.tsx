import { Clock, CheckCircle, Users, XCircle, Check, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

export default function EmployeeDashboard() {
  const { lang, appointments, patients, confirmAppointment, cancelAppointment } = useAppStore();
  const pending = appointments.filter((a) => a.status === 'Pending');
  const confirmed = appointments.filter((a) => a.status === 'Confirmed' && a.date === '2025-04-09');
  const cancelled = appointments.filter((a) => a.status === 'Cancelled' && a.date === '2025-04-09');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{tr('secretaryDash', lang)} 📋</h2>
        <p className="text-sm text-slate-400 mt-1">{tr('manageAppts', lang)}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock size={22} />}         value={pending.length}   label={tr('pendingConfirm', lang)}     color="amber" />
        <StatCard icon={<CheckCircle size={22} />}   value={confirmed.length} label={tr('confirmedToday', lang)}     color="green" trendUp />
        <StatCard icon={<Users size={22} />}         value={patients.length}  label={tr('registeredPatients', lang)} color="blue" />
        <StatCard icon={<XCircle size={22} />}       value={cancelled.length} label={tr('cancellationsToday', lang)} color="red" />
      </div>

      {/* Pending approvals */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div>
            <h3 className="font-semibold text-slate-800">{tr('pendingApprovals', lang)}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{tr('actionRequired', lang)}</p>
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {pending.length} {lang === 'ar' ? 'معلق' : 'pending'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-3">
            <thead>
              <tr>
                <th className="table-th">{tr('patientName', lang)}</th>
                <th className="table-th">{tr('date', lang)}</th>
                <th className="table-th">{tr('time', lang)}</th>
                <th className="table-th">{tr('type', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/40 transition-colors border-s-2 border-s-amber-400">
                  <td className="table-td font-semibold">{lang === 'ar' ? a.patientNameAr : a.patientName}</td>
                  <td className="table-td text-sm">{a.date}</td>
                  <td className="table-td text-sm">{a.time}</td>
                  <td className="table-td text-sm">{a.type}</td>
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
                  <td colSpan={6} className="table-td text-center text-slate-400 py-10">{tr('noData', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All today appointments */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">{tr('todaySchedule', lang)}</h3>
        <div className="divide-y divide-slate-100">
          {appointments.filter((a) => a.date === '2025-04-09').map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3 gap-4">
              <div className="text-sm font-bold text-primary-600 w-12 flex-shrink-0">{a.time}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{lang === 'ar' ? a.patientNameAr : a.patientName}</div>
                <div className="text-xs text-slate-400">{a.type}</div>
              </div>
              <Badge status={a.status} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
