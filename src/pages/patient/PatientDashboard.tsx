import { Calendar, FileText, Pill } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

export default function PatientDashboard() {
  const { lang, currentUser, appointments, records } = useAppStore();
  const patientId = currentUser?.patientId ?? 1;
  const myAppts = appointments.filter((a) => a.patientId === patientId);
  const myRecords = records.filter((r) => r.patientId === patientId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'ar'
            ? `مرحباً، ${currentUser?.nameAr?.split(' ')[0]} 👋`
            : `Hello, ${currentUser?.name?.split(' ')[0]} 👋`}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{tr('healthSummary', lang)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Calendar size={22} />} value={myAppts.length} label={tr('myAppointments', lang)} color="blue" />
        <StatCard icon={<FileText size={22} />} value={myRecords.length} label={tr('myRecords', lang)} color="green" />
        <StatCard icon={<Pill size={22} />} value="2" label={tr('activePrescriptions', lang)} color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Upcoming appointments */}
        <div className="card">
          <div className="px-5 pt-5 pb-2">
            <h3 className="font-semibold text-slate-800">{tr('upcomingAppts', lang)}</h3>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {myAppts.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {myAppts.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{a.type}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {a.date} · {a.time}
                  </div>
                  <div className="text-xs text-slate-400">{lang === 'ar' ? a.doctorAr : a.doctor}</div>
                </div>
                <Badge status={a.status} lang={lang} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent diagnoses */}
        <div className="card">
          <div className="px-5 pt-5 pb-2">
            <h3 className="font-semibold text-slate-800">{tr('recentDiagnoses', lang)}</h3>
          </div>
          <div className="divide-y divide-slate-100 px-5 pb-5">
            {myRecords.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {myRecords.map((r) => (
              <div key={r.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm">{lang === 'ar' ? r.diagnosisAr : r.diagnosis}</div>
                  <span className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">{r.date}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">💊 {lang === 'ar' ? r.prescriptionAr : r.prescription}</div>
                {/* Vitals strip */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[
                    { l: 'BP', v: r.vitals.bp },
                    { l: '♥', v: r.vitals.pulse },
                    { l: 'O₂', v: r.vitals.oxygen },
                  ].map((v) => (
                    <div key={v.l} className="bg-slate-50 px-2 py-1 rounded-lg text-center">
                      <div className="text-[9px] text-slate-400">{v.l}</div>
                      <div className="text-xs font-bold text-slate-700">{v.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
