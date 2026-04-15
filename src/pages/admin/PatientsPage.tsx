import { useState } from 'react';
import { Search, Plus, Eye, Edit, Droplets, Phone, Mail } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import AddPatientModal from '../../components/modals/AddPatientModal';
import MedicalRecordModal from '../../components/modals/MedicalRecordModal';
import type { Patient } from '../../types';

export default function PatientsPage() {
  const { lang, patients, appointments, records } = useAppStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const filtered = patients.filter((p) =>
    (lang === 'ar' ? p.nameAr : p.name).toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={tr('patients', lang)}
        subtitle={`${patients.length} ${lang === 'ar' ? 'مريض مسجل' : 'registered patients'}`}
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> {tr('addPatient', lang)}
          </button>
        }
      />

      {selected ? (
        <PatientDetail
          patient={selected}
          onBack={() => setSelected(null)}
          onAddRecord={() => setShowRecord(true)}
          lang={lang}
          appointments={appointments}
          records={records}
        />
      ) : (
        <>
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 mb-4 shadow-sm">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              className="flex-1 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
              placeholder={tr('searchPatients', lang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-th">{tr('patientName', lang)}</th>
                    <th className="table-th">{tr('age', lang)} / {tr('bloodType', lang)}</th>
                    <th className="table-th">{tr('contact', lang)}</th>
                    <th className="table-th">{tr('conditions', lang)}</th>
                    <th className="table-th">{tr('lastVisit', lang)}</th>
                    <th className="table-th">{tr('status', lang)}</th>
                    <th className="table-th">{tr('actions', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <Avatar code={p.avatar} colorClass={p.avatarColor} size="sm" />
                          <div>
                            <div className="font-semibold text-slate-800">{lang === 'ar' ? p.nameAr : p.name}</div>
                            <div className="text-xs text-slate-400">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="font-medium">{p.age} {tr('years', lang)}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Droplets size={10} /> {p.bloodType}
                        </div>
                      </td>
                      <td className="table-td text-sm">{p.phone}</td>
                      <td className="table-td">
                        <div className="flex flex-wrap gap-1">
                          {p.conditions.length > 0 ? (
                            p.conditions.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                                {lang === 'ar' && p.conditionsAr[i] ? p.conditionsAr[i] : c}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">{tr('none', lang)}</span>
                          )}
                        </div>
                      </td>
                      <td className="table-td text-sm">{p.lastVisit}</td>
                      <td className="table-td">
                        <Badge status={p.status} lang={lang} />
                      </td>
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-ghost p-1.5"
                            onClick={() => setSelected(p)}
                            title={tr('viewDetails', lang)}
                          >
                            <Eye size={15} />
                          </button>
                          <button className="btn-ghost p-1.5" title={tr('edit', lang)}>
                            <Edit size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-slate-400 text-sm">{tr('noData', lang)}</div>
              )}
            </div>
          </div>
        </>
      )}

      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} />}
      {showRecord && selected && (
        <MedicalRecordModal prePatientId={selected.id} onClose={() => setShowRecord(false)} />
      )}
    </div>
  );
}

/* ── Patient Detail Panel ── */
function PatientDetail({
  patient, onBack, onAddRecord, lang, appointments, records,
}: {
  patient: Patient;
  onBack: () => void;
  onAddRecord: () => void;
  lang: 'ar' | 'en';
  appointments: ReturnType<typeof useAppStore>['appointments'];
  records: ReturnType<typeof useAppStore>['records'];
}) {
  const patAppts = appointments.filter((a) => a.patientId === patient.id);
  const patRecords = records.filter((r) => r.patientId === patient.id);
  const [editRecord, setEditRecord] = useState<(typeof records)[0] | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <button className="btn-secondary text-xs" onClick={onBack}>{tr('backToPatients', lang)}</button>

      {/* Profile card */}
      <div className="card p-5">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar code={patient.avatar} colorClass={patient.avatarColor} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-800">{lang === 'ar' ? patient.nameAr : patient.name}</h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Droplets size={13} /> {patient.bloodType}</span>
              <span>🎂 {patient.age} {tr('years', lang)}</span>
              <span className="flex items-center gap-1"><Phone size={13} /> {patient.phone}</span>
              <span className="flex items-center gap-1"><Mail size={13} /> {patient.email}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {patient.conditions.map((c, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-semibold">
                  {lang === 'ar' && patient.conditionsAr[i] ? patient.conditionsAr[i] : c}
                </span>
              ))}
              <Badge status={patient.status} lang={lang} />
            </div>
          </div>
          <button className="btn-primary" onClick={onAddRecord}>
            <Plus size={15} /> {tr('newRecord', lang)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Medical records */}
        <div className="card">
          <div className="flex items-center justify-between px-5 pt-5">
            <h4 className="font-semibold text-slate-800">{tr('medicalRecords', lang)} ({patRecords.length})</h4>
          </div>
          <div className="p-5 space-y-4">
            {patRecords.length === 0 && <p className="text-sm text-slate-400">{tr('noData', lang)}</p>}
            {patRecords.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">{r.date}</span>
                  <button className="btn-ghost p-1" onClick={() => setEditRecord(r)}><Edit size={14} /></button>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tr('diagnosis', lang)}</div>
                  <div className="text-sm font-semibold mt-0.5">{lang === 'ar' ? r.diagnosisAr : r.diagnosis}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tr('prescription', lang)}</div>
                  <div className="text-sm mt-0.5">💊 {lang === 'ar' ? r.prescriptionAr : r.prescription}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tr('clinicalNotes', lang)}</div>
                  <div className="text-xs text-slate-600 leading-relaxed mt-0.5">{lang === 'ar' ? r.notesAr : r.notes}</div>
                </div>
                {/* Vitals */}
                <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100">
                  {[
                    { label: 'BP', val: r.vitals.bp },
                    { label: '♥', val: r.vitals.pulse },
                    { label: '🌡', val: r.vitals.temp },
                    { label: '⚖', val: r.vitals.weight },
                    { label: 'O₂', val: r.vitals.oxygen },
                  ].map((v) => (
                    <div key={v.label} className="bg-slate-50 rounded-lg px-2.5 py-1.5 text-center">
                      <div className="text-[9px] text-slate-400 uppercase tracking-wide">{v.label}</div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">{v.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="card">
          <div className="px-5 pt-5">
            <h4 className="font-semibold text-slate-800">{tr('appointments', lang)} ({patAppts.length})</h4>
          </div>
          <div className="p-5 divide-y divide-slate-100">
            {patAppts.length === 0 && <p className="text-sm text-slate-400">{tr('noData', lang)}</p>}
            {patAppts.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{a.type}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.date} · {a.time}</div>
                  <div className="text-xs text-slate-400">{lang === 'ar' ? a.doctorAr : a.doctor}</div>
                </div>
                <Badge status={a.status} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {editRecord && (
        <MedicalRecordModal existingRecord={editRecord} onClose={() => setEditRecord(null)} />
      )}
    </div>
  );
}
