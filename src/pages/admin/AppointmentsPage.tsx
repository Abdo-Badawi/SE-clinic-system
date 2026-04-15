import { useState } from 'react';
import { Plus, Check, X, Filter, Download } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';
import type { AppointmentStatus } from '../../types';
import clsx from 'clsx';

const STATUS_FILTERS: (AppointmentStatus | 'All')[] = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'];

const TYPE_COLORS: Record<string, string> = {
  'Urgent':         'bg-red-50 text-red-600',
  'New Patient':    'bg-primary-50 text-primary-700',
  'Follow-up':      'bg-emerald-50 text-emerald-700',
  'Routine Checkup':'bg-slate-100 text-slate-600',
};

interface Props { canEdit?: boolean; filterPatientId?: number; }

export default function AppointmentsPage({ canEdit = true, filterPatientId }: Props) {
  const { lang, appointments, confirmAppointment, cancelAppointment } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  const [showBook, setShowBook] = useState(false);

  let list = filterPatientId
    ? appointments.filter((a) => a.patientId === filterPatientId)
    : appointments;

  if (statusFilter !== 'All') {
    list = list.filter((a) => a.status === statusFilter);
  }

  return (
    <div>
      <PageHeader
        title={tr('appointments', lang)}
        subtitle={`${appointments.length} ${lang === 'ar' ? 'موعد إجمالاً' : 'total appointments'}`}
        action={
          canEdit ? (
            <button className="btn-primary" onClick={() => setShowBook(true)}>
              <Plus size={16} /> {tr('newAppointment', lang)}
            </button>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                statusFilter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              {f === 'All' ? tr('allStatuses', lang) : tr(f.toLowerCase(), lang)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs"><Filter size={13} /> {tr('filterDate', lang)}</button>
          <button className="btn-secondary text-xs"><Download size={13} /> {tr('exportData', lang)}</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">{tr('patientName', lang)}</th>
                <th className="table-th">{tr('dateTime', lang)}</th>
                <th className="table-th">{tr('type', lang)}</th>
                <th className="table-th">{tr('doctor', lang) || 'Doctor'}</th>
                <th className="table-th">{tr('notes', lang)}</th>
                <th className="table-th">{tr('status', lang)}</th>
                {canEdit && <th className="table-th">{tr('actions', lang)}</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr
                  key={a.id}
                  className={clsx(
                    'hover:bg-slate-50 transition-colors border-s-2',
                    a.status === 'Pending'   ? 'border-s-amber-400' :
                    a.status === 'Confirmed' ? 'border-s-emerald-400' :
                    a.status === 'Cancelled' ? 'border-s-red-400' : 'border-s-transparent'
                  )}
                >
                  <td className="table-td">
                    <div className="font-semibold">{lang === 'ar' ? a.patientNameAr : a.patientName}</div>
                  </td>
                  <td className="table-td">
                    <div className="font-medium text-slate-700">{a.date}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.time}</div>
                  </td>
                  <td className="table-td">
                    <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold', TYPE_COLORS[a.type] || 'bg-slate-100 text-slate-600')}>
                      {a.type}
                    </span>
                  </td>
                  <td className="table-td text-sm">{lang === 'ar' ? a.doctorAr : a.doctor}</td>
                  <td className="table-td">
                    <div className="text-xs text-slate-500 max-w-[160px] truncate">
                      {lang === 'ar' ? a.notesAr : a.notes}
                    </div>
                  </td>
                  <td className="table-td"><Badge status={a.status} lang={lang} /></td>
                  {canEdit && (
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        {a.status === 'Pending' && (
                          <button className="btn-success" onClick={() => confirmAppointment(a.id)}>
                            <Check size={12} /> {tr('confirm', lang)}
                          </button>
                        )}
                        {(a.status === 'Pending' || a.status === 'Confirmed') && (
                          <button className="btn-danger" onClick={() => cancelAppointment(a.id)}>
                            <X size={12} /> {tr('cancel', lang)}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">{tr('noData', lang)}</div>
          )}
        </div>
      </div>

      {showBook && <BookAppointmentModal onClose={() => setShowBook(false)} />}
    </div>
  );
}
