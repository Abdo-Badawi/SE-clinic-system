import { useState } from 'react';
import { Plus, Loader, Edit } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { usePatient } from '../../hooks/usePatients';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useAppointments } from '../../hooks/useAppointments';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AddPatientModal from '../../components/modals/AddPatientModal';
import MedicalRecordModal from '../../components/modals/MedicalRecordModal';
import type { PatientDTO } from '../../api/patientService';
import type { MedicalRecordDTO } from '../../api/medicalRecordService';
import { formatTime, dateOnly } from '../../utils/helpers';

export default function PatientsPage() {
  const { lang, currentUser } = useAppStore();
  const canAdd = currentUser?.role === 'ADMIN' || currentUser?.role === 'RECEPTIONIST';
  const canAddRecord = currentUser?.role === 'ADMIN' || currentUser?.role === 'DOCTOR';

  // No GET /api/patients list — must look up by ID
  const [searchId, setSearchId]   = useState('');
  const [showAdd,  setShowAdd]    = useState(false);
  const { patient, loading: pLoad, error: pErr, fetchPatient, setPatient } = usePatient();

  const lookup = async () => {
    const id = parseInt(searchId.trim());
    if (!id) return;
    await fetchPatient(id);
  };

  return (
    <div>
      <PageHeader
        title={tr('patients', lang)}
        action={canAdd ? (
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> {tr('addPatient', lang)}
          </button>
        ) : undefined}
      />

      {/* GET /api/patients/{id} lookup */}
      <div className="card p-5 mb-5">
        <div className="text-sm font-semibold text-slate-700 mb-3">
          {lang === 'ar' ? 'البحث عن مريض بـ Patient Profile ID' : 'Look up patient by Profile ID'}
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            className="form-input max-w-[200px]"
            placeholder={lang === 'ar' ? 'مثال: 5' : 'e.g. 5'}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') lookup(); }}
          />
          <button className="btn-primary" onClick={lookup} disabled={pLoad}>
            {pLoad
              ? <Loader size={14} className="animate-spin" />
              : lang === 'ar' ? 'بحث' : 'Search'}
          </button>
          {patient && (
            <button className="btn-secondary" onClick={() => setPatient(null)}>
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
        {pErr && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{pErr}</div>
        )}
      </div>

      {/* Patient detail */}
      {patient && (
        <PatientDetail
          patient={patient}
          lang={lang}
          canAddRecord={canAddRecord}
        />
      )}

      {showAdd && (
        <AddPatientModal onClose={() => setShowAdd(false)} onCreated={() => setShowAdd(false)} />
      )}
    </div>
  );
}

/* ── Patient Detail Panel ── */
function PatientDetail({
  patient, lang, canAddRecord,
}: { patient: PatientDTO; lang: 'ar' | 'en'; canAddRecord: boolean }) {
  const { records, loading: rLoad, refetch: rRefetch } =
    useMedicalRecords({ by: 'patient', id: patient.id });
  const { appointments, loading: aLoad } =
    useAppointments({ by: 'patient', id: patient.id });
  const [showRecord, setShowRecord] = useState(false);
  const [editRecord, setEditRecord] = useState<MedicalRecordDTO | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Profile card */}
      <div className="card p-5">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            #{patient.id}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-800">
              {lang === 'ar' ? 'مريض' : 'Patient'} #{patient.id}
            </h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
              {patient.dateOfBirth && <span>🎂 {patient.dateOfBirth}</span>}
              {patient.phone       && <span>📞 {patient.phone}</span>}
              {patient.address     && <span>📍 {patient.address}</span>}
            </div>
            {patient.emergencyContact && (
              <div className="mt-1 text-xs text-slate-500">
                🆘 {lang === 'ar' ? 'طوارئ:' : 'Emergency:'} {patient.emergencyContact}
              </div>
            )}
            {patient.medicalSummary && (
              <div className="mt-2 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg inline-block">
                📝 {patient.medicalSummary}
              </div>
            )}
          </div>
          {canAddRecord && (
            <button className="btn-primary" onClick={() => setShowRecord(true)}>
              <Plus size={15} /> {tr('newRecord', lang)}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* GET /api/medical-records/patient/:id */}
        <div className="card">
          <div className="flex items-center justify-between px-5 pt-5">
            <h4 className="font-semibold text-slate-800">{tr('medicalRecords', lang)} ({records.length})</h4>
          </div>
          <div className="p-5 space-y-4">
            {rLoad && <LoadingSpinner />}
            {!rLoad && records.length === 0 && (
              <p className="text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {records.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                    {dateOnly(r.visitDate)}
                  </span>
                  {canAddRecord && (
                    <button className="btn-ghost p-1 text-xs" onClick={() => setEditRecord(r)}>
                      <Edit size={13} />
                    </button>
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">{tr('diagnosis', lang)}</div>
                  <div className="text-sm font-semibold mt-0.5">{r.diagnosis || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">{tr('prescription', lang)}</div>
                  <div className="text-sm mt-0.5">💊 {r.prescription || '—'}</div>
                </div>
                {r.notes && (
                  <div className="text-xs text-slate-600 leading-relaxed">{r.notes}</div>
                )}
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'طبيب' : 'Doctor'} #{r.doctorId}
                  {r.appointmentId && ` · Appt #${r.appointmentId}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GET /api/appointments/patient/:id */}
        <div className="card">
          <div className="px-5 pt-5">
            <h4 className="font-semibold text-slate-800">{tr('appointments', lang)} ({appointments.length})</h4>
          </div>
          <div className="p-5 divide-y divide-slate-100">
            {aLoad && <LoadingSpinner />}
            {!aLoad && appointments.length === 0 && (
              <p className="text-sm text-slate-400">{tr('noData', lang)}</p>
            )}
            {appointments.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">
                    {lang === 'ar' ? 'طبيب' : 'Doctor'} #{a.doctorId}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {a.appointmentDate} · {formatTime(a.startTime)}
                  </div>
                  {a.cancellationReason && (
                    <div className="text-[10px] text-red-400 mt-0.5">{a.cancellationReason}</div>
                  )}
                </div>
                <Badge status={a.status} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {(showRecord || editRecord) && (
        <MedicalRecordModal
          existingRecord={editRecord || undefined}
          prePatientId={patient.id}
          onClose={() => { setShowRecord(false); setEditRecord(null); }}
          onSaved={rRefetch}
        />
      )}
    </div>
  );
}
