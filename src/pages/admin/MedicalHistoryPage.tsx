import { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import MedicalRecordModal from '../../components/modals/MedicalRecordModal';
import type { MedicalRecord } from '../../types';

interface Props { filterPatientId?: number; readOnly?: boolean; }

export default function MedicalHistoryPage({ filterPatientId, readOnly = false }: Props) {
  const { lang, records, patients } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = filterPatientId
    ? records.filter((r) => r.patientId === filterPatientId)
    : records;

  const sorted = [...filteredRecords].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title={tr('medicalHistory', lang)}
        subtitle={`${filteredRecords.length} ${lang === 'ar' ? 'سجل طبي' : 'medical records'}`}
        action={
          !readOnly ? (
            <button className="btn-primary" onClick={() => { setEditRecord(null); setShowModal(true); }}>
              <Plus size={16} /> {tr('newRecord', lang)}
            </button>
          ) : undefined
        }
      />

      <div className="space-y-4">
        {sorted.length === 0 && (
          <div className="card py-16 text-center text-slate-400 text-sm">{tr('noData', lang)}</div>
        )}
        {sorted.map((r) => {
          const patient = patients.find((p) => p.id === r.patientId);
          return (
            <div key={r.id} className="card p-5 hover:border-primary-200 transition-colors">
              {/* Record header */}
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {patient && <Avatar code={patient.avatar} colorClass={patient.avatarColor} size="sm" />}
                  <div>
                    <div className="font-semibold text-slate-800">
                      {patient ? (lang === 'ar' ? patient.nameAr : patient.name) : '—'}
                    </div>
                    <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full mt-0.5 inline-block">
                      {r.date}
                    </span>
                  </div>
                </div>
                {!readOnly && (
                  <button
                    className="btn-ghost text-xs"
                    onClick={() => { setEditRecord(r); setShowModal(true); }}
                  >
                    <Edit size={13} /> {tr('edit', lang)}
                  </button>
                )}
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('diagnosis', lang)}</div>
                  <div className="text-sm font-semibold text-slate-800">{lang === 'ar' ? r.diagnosisAr : r.diagnosis}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('prescription', lang)}</div>
                  <div className="text-sm">💊 {lang === 'ar' ? r.prescriptionAr : r.prescription}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{tr('clinicalNotes', lang)}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{lang === 'ar' ? r.notesAr : r.notes}</p>
              </div>

              {/* Vitals */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{tr('vitals', lang)}</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: tr('bloodPressure', lang), val: r.vitals.bp },
                    { label: tr('pulse', lang), val: r.vitals.pulse + ' bpm' },
                    { label: tr('temperature', lang), val: r.vitals.temp + '°C' },
                    { label: tr('weight', lang), val: r.vitals.weight },
                    { label: tr('oxygen', lang), val: r.vitals.oxygen },
                  ].map((v) => (
                    <div key={v.label} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center min-w-[80px]">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide leading-tight">{v.label}</div>
                      <div className="text-sm font-bold text-slate-700 mt-1">{v.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                {tr('prescribedBy', lang)}: {lang === 'ar' ? r.doctorAr : r.doctor}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <MedicalRecordModal
          existingRecord={editRecord || undefined}
          prePatientId={filterPatientId}
          onClose={() => { setShowModal(false); setEditRecord(null); }}
        />
      )}
    </div>
  );
}
