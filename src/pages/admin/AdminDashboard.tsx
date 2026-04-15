import { useNavigate } from 'react-router-dom';
import { Users, Calendar, AlertCircle, Activity, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { getStatusDot } from '../../utils/helpers';

export default function AdminDashboard() {
  const { lang, appointments, patients } = useAppStore();
  const navigate = useNavigate();
  const today = appointments.filter((a) => a.date === '2025-04-09');
  const pending = appointments.filter((a) => a.status === 'Pending');
  const urgent = appointments.filter((a) => a.type === 'Urgent');

  const barData = [40, 65, 50, 80, 60, 90, 75];
  const days = lang === 'ar'
    ? ['إث', 'ث', 'أر', 'خ', 'ج', 'س', 'ح']
    : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {tr('goodMorning', lang)} {lang === 'ar' ? 'د. ميتشل 👋' : 'Dr. Mitchell 👋'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{tr('todayOverview', lang)}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/appointments')}>
          <Plus size={16} /> {tr('newAppointment', lang)}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={22} />} value={patients.length} label={tr('totalPatients', lang)} trend={`+12 ${tr('thisMonth', lang)}`} trendUp color="blue" />
        <StatCard icon={<Calendar size={22} />} value={today.length} label={tr('todayAppts', lang)} trend={`${pending.length} ${tr('pending', lang)}`} color="amber" />
        <StatCard icon={<Activity size={22} />} value="3" label={tr('followUps', lang)} color="green" />
        <StatCard icon={<AlertCircle size={22} />} value={urgent.length} label={tr('urgentCases', lang)} color="red" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Today's schedule */}
        <div className="xl:col-span-3 card">
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <h3 className="font-semibold text-slate-800">{tr('todaySchedule', lang)}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Apr 9, 2025 · {today.length} {tr('appointments', lang)}</p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => navigate('/appointments')}>
              {tr('viewAll', lang)}
            </button>
          </div>
          <div className="p-5 space-y-0 divide-y divide-slate-100">
            {today.map((appt) => (
              <div key={appt.id} className="flex items-start gap-4 py-3">
                <div className="text-end w-14 flex-shrink-0">
                  <div className="text-xs font-bold text-primary-600">{appt.time.split(':')[0]}:{appt.time.split(':')[1]}</div>
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(appt.status)} mt-0.5`} />
                  <div className="w-px flex-1 bg-slate-200 min-h-[16px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {lang === 'ar' ? appt.patientNameAr : appt.patientName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {appt.type} · {lang === 'ar' ? appt.notesAr : appt.notes}
                  </div>
                  <div className="mt-1.5">
                    <Badge status={appt.status} lang={lang} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Weekly chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{tr('weeklyOverview', lang)}</h3>
            <div className="flex items-end gap-1.5 h-16">
              {barData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all ${i === 5 ? 'bg-primary-500' : 'bg-primary-100'}`}
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[9px] text-slate-400">{days[i]}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 mt-4 pt-4 border-t border-slate-100 gap-2">
              {[
                { v: '38', l: tr('thisWeek', lang) },
                { v: '94%', l: tr('attendance', lang) },
                { v: '4.9⭐', l: tr('rating', lang) },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-base font-bold text-slate-800">{item.v}</div>
                  <div className="text-[10px] text-slate-400">{item.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent patients */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{tr('recentPatients', lang)}</h3>
            <div className="space-y-3">
              {patients.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Avatar code={p.avatar} colorClass={p.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-700 truncate">
                      {lang === 'ar' ? p.nameAr : p.name}
                    </div>
                    <div className="text-xs text-slate-400">{p.lastVisit}</div>
                  </div>
                  <Badge status={p.status} lang={lang} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
