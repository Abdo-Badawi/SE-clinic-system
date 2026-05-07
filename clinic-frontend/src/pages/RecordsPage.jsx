// src/pages/RecordsPage.jsx
import { useState } from 'react';
import { medicalRecordAPI } from '../services/api';
import { Tabs, ResponseBox, SendButton } from '../components/UI';

function ViewHistory() {
  const [id,   setId]   = useState('5');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await medicalRecordAPI.getByPatient(id); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/medical-records/patient/:id</div>
      <div className="card-subtitle">View full medical history — Doctor or the Patient themselves</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Patient ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Fetch history" icon="ti-search" />
      <ResponseBox result={res} />
    </div>
  );
}

function CreateRecord() {
  const [form, setForm] = useState({
    patientId: '5', appointmentId: '1',
    visitDate: '2026-04-28T10:30',
    diagnosis: 'Seasonal allergies',
    prescription: 'Cetirizine 10mg daily',
    notes: 'Avoid pollen',
  });
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const send = async () => {
    setLoad(true);
    const r = await medicalRecordAPI.create({
      ...form,
      patientId: +form.patientId,
      appointmentId: +form.appointmentId,
      visitDate: form.visitDate + ':00',
    });
    setRes(r); setLoad(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/medical-records</div>
      <div className="card-subtitle">Doctor only — create a new medical record after a visit</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Patient ID</label><input className="form-input" type="number" value={form.patientId} onChange={e => set('patientId', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Appointment ID</label><input className="form-input" type="number" value={form.appointmentId} onChange={e => set('appointmentId', e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Visit date & time</label><input className="form-input" type="datetime-local" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Diagnosis</label><input className="form-input" value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Prescription</label><input className="form-input" value={form.prescription} onChange={e => set('prescription', e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Notes</label><input className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Create record" icon="ti-file-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function UpdateRecord() {
  const [id,    setId]    = useState('1');
  const [diag,  setDiag]  = useState('Updated diagnosis');
  const [presc, setPresc] = useState('New prescription');
  const [res,   setRes]   = useState(null);
  const [load,  setLoad]  = useState(false);
  const send = async () => { setLoad(true); const r = await medicalRecordAPI.update(id, { diagnosis: diag, prescription: presc }); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">PUT /api/medical-records/:id</div>
      <div className="card-subtitle">Doctor only — update an existing medical record</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Record ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Diagnosis</label><input className="form-input" value={diag} onChange={e => setDiag(e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Prescription</label><input className="form-input" value={presc} onChange={e => setPresc(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Update record" icon="ti-device-floppy" />
      <ResponseBox result={res} />
    </div>
  );
}

export default function RecordsPage() {
  return (
    <Tabs tabs={[
      { label: 'View history',   content: <ViewHistory /> },
      { label: 'Create record',  content: <CreateRecord /> },
      { label: 'Update record',  content: <UpdateRecord /> },
    ]} />
  );
}
