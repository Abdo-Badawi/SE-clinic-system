// src/pages/PatientsPage.jsx
import { useState } from 'react';
import { patientAPI } from '../services/api';
import { Tabs, ResponseBox, SendButton, Alert } from '../components/UI';

function ViewPatient() {
  const [id,  setId]  = useState('5');
  const [res, setRes] = useState(null);
  const [load,setLoad]= useState(false);
  const send = async () => { setLoad(true); const r = await patientAPI.get(id); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/patients/:id</div>
      <div className="card-subtitle">Accessible by Admin, Receptionist, and the Patient themselves</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Patient ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Fetch patient" icon="ti-search" />
      <ResponseBox result={res} />
    </div>
  );
}

function CreatePatient() {
  const [form, setForm] = useState({ userId: '5', dateOfBirth: '1990-01-01', phone: '+20123456789', address: '123 Main St', emergencyContact: 'Jane Doe +2011223344', medicalSummary: 'No known allergies' });
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const send = async () => {
    setLoad(true);
    const r = await patientAPI.create({ ...form, userId: +form.userId });
    setRes(r); setLoad(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/patients</div>
      <div className="card-subtitle">Admin or Receptionist creates a patient profile for an existing user</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">User ID</label><input className="form-input" type="number" value={form.userId} onChange={e => set('userId', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Date of birth</label><input className="form-input" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Emergency contact</label><input className="form-input" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Medical summary</label><input className="form-input" value={form.medicalSummary} onChange={e => set('medicalSummary', e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Create patient" icon="ti-user-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function UpdatePatient() {
  const [id,    setId]    = useState('5');
  const [phone, setPhone] = useState('+20199999999');
  const [addr,  setAddr]  = useState('456 New Address');
  const [res,   setRes]   = useState(null);
  const [load,  setLoad]  = useState(false);
  const send = async () => { setLoad(true); const r = await patientAPI.update(id, { phone, address: addr }); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">PUT /api/patients/:id</div>
      <div className="card-subtitle">Update patient contact details — Admin, Receptionist, or own Patient</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Patient ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={addr} onChange={e => setAddr(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Update" icon="ti-device-floppy" />
      <ResponseBox result={res} />
    </div>
  );
}

function DeletePatient() {
  const [id,   setId]   = useState('5');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const [conf, setConf] = useState(false);
  const send = async () => {
    if (!conf) { setConf(true); return; }
    setLoad(true); const r = await patientAPI.delete(id); setRes(r); setLoad(false); setConf(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">DELETE /api/patients/:id</div>
      <div className="card-subtitle">Admin only — permanently removes patient profile</div>
      <div className="divider" />
      <Alert type="danger">This action permanently deletes the patient profile and cannot be undone.</Alert>
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Patient ID</label><input className="form-input" type="number" value={id} onChange={e => { setId(e.target.value); setConf(false); }} /></div>
      <SendButton onClick={send} loading={load} label={conf ? 'Click again to confirm' : 'Delete patient'} icon="ti-trash" className="btn-danger" />
      <ResponseBox result={res} />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Tabs tabs={[
      { label: 'View patient',   content: <ViewPatient /> },
      { label: 'Create profile', content: <CreatePatient /> },
      { label: 'Update patient', content: <UpdatePatient /> },
      { label: 'Delete patient', content: <DeletePatient /> },
    ]} />
  );
}
