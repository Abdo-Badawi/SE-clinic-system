import { Calendar, FileText, Users, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { getStatusDot } from '../../utils/helpers';

export default function DoctorDashboard() {
  const { lang, appointments, records, patients } = useAppStore();
  const today = appointments.filter((a) => a.date === '2025-04-09');
  const pending = appointments.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'ar' ? `${tr('workspaceTitle', lang)} 🩺` : `${tr('workspaceTitle', lang)} 🩺`}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {lang === 'ar' ? 'نظرة عامة على يومك السريري' : 'Your clinical overview for today'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={22} />} value={today.length} label={tr('todayAppts', lang)} trend={`${pending.length} ${tr('pending', lang)}`} color="blue" />
        <StatCard icon={<FileText size={22} />} value={records.length} label={tr('pendingRecords', lang)} trend={tr('needCompletion', lang)} color="amber" />
        <StatCard icon={<Users size={22} />} value={patients.filter((p) => p.status === 'Active').length} label={tr('activePatients', lang)} trendUp color="green" />
        <StatCard icon={<AlertCircle size={22} />} value="2" label={tr('criticalFollowups', lang)} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Today's appointments */}
        <div className="card">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{tr('todaySchedule', lang)}</h3>
            <span className="text-xs text-slate-400">{today.length} {lang === 'ar' ? 'موعد' : 'appointments'}</span>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {today.map((a) => (
              <div key={a.id} className="py-3 flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(a.status)} mt-1`} />
                  <div className="w-px h-4 bg-slate-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{lang === 'ar' ? a.patientNameAr : a.patientName}</div>
                    <div className="text-xs text-slate-400">{a.time}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.type}</div>
                  <div className="mt-1"><Badge status={a.status} lang={lang} /></div>
                </div>
              </div>
            ))}
            {today.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
          </div>
        </div>

        {/* Recent records */}
        <div className="card">
          <div className="px-5 pt-5 pb-2">
            <h3 className="font-semibold text-slate-800">
              {lang === 'ar' ? 'آخر السجلات الطبية' : 'Recent Medical Records'}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {records.slice(0, 4).map((r) => {
              const patient = patients.find((p) => p.id === r.patientId);
              return (
                <div key={r.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">
                      {patient ? (lang === 'ar' ? patient.nameAr : patient.name) : '—'}
                    </div>
                    <span className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-semibold">{r.date}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{lang === 'ar' ? r.diagnosisAr : r.diagnosis}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
