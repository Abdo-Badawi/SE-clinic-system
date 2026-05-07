// src/pages/DoctorsPage.jsx
import { useState } from 'react';
import { doctorAPI } from '../services/api';
import { Tabs, ResponseBox, SendButton, EmptyState, Alert } from '../components/UI';

function ListDoctors() {
  const [doctors, setDoctors] = useState(null);
  const [res,     setRes]     = useState(null);
  const [load,    setLoad]    = useState(false);
  const fetch = async () => {
    setLoad(true);
    const r = await doctorAPI.list();
    setRes(r);
    if (r.ok && Array.isArray(r.data)) setDoctors(r.data);
    setLoad(false);
  };
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title mb-0">GET /api/doctors</div>
          <div className="card-subtitle">Returns all doctors — Admin and Receptionist access</div>
        </div>
        <SendButton onClick={fetch} loading={load} label="Load doctors" icon="ti-refresh" />
      </div>
      {doctors === null && !res && <EmptyState icon="ti-stethoscope" message="Click Load to fetch doctors from the API" />}
      {doctors && doctors.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Email</th></tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text-tertiary)' }}>#{d.id}</td>
                  <td style={{ fontWeight: 500 }}>{d.fullName || d.name || '—'}</td>
                  <td><span className="badge badge-teal">{d.specialization || '—'}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {doctors && doctors.length === 0 && <EmptyState icon="ti-stethoscope" message="No doctors found" />}
      <ResponseBox result={res} />
    </div>
  );
}

function CreateDoctor() {
  const [userId, setUserId] = useState('3');
  const [spec,   setSpec]   = useState('Neurology');
  const [res,    setRes]    = useState(null);
  const [load,   setLoad]   = useState(false);
  const send = async () => { setLoad(true); const r = await doctorAPI.create({ userId: +userId, specialization: spec }); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/doctors</div>
      <div className="card-subtitle">Admin only — creates doctor profile for an existing user</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">User ID</label><input className="form-input" type="number" value={userId} onChange={e => setUserId(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Specialization</label><input className="form-input" value={spec} onChange={e => setSpec(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Create doctor" icon="ti-user-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function UpdateDoctor() {
  const [id,   setId]   = useState('3');
  const [spec, setSpec] = useState('Cardiology');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await doctorAPI.update(id, { specialization: spec }); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">PUT /api/doctors/:id</div>
      <div className="card-subtitle">Admin only — update doctor specialization</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Doctor ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">New specialization</label><input className="form-input" value={spec} onChange={e => setSpec(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Update" icon="ti-device-floppy" />
      <ResponseBox result={res} />
    </div>
  );
}

function DeleteDoctor() {
  const [id,   setId]   = useState('3');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const [conf, setConf] = useState(false);
  const send = async () => {
    if (!conf) { setConf(true); return; }
    setLoad(true); const r = await doctorAPI.delete(id); setRes(r); setLoad(false); setConf(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">DELETE /api/doctors/:id</div>
      <div className="card-subtitle">Admin only — permanently removes doctor profile</div>
      <div className="divider" />
      <Alert type="danger">This permanently removes the doctor profile from the system.</Alert>
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Doctor ID</label><input className="form-input" type="number" value={id} onChange={e => { setId(e.target.value); setConf(false); }} /></div>
      <SendButton onClick={send} loading={load} label={conf ? 'Click again to confirm' : 'Delete doctor'} icon="ti-trash" className="btn-danger" />
      <ResponseBox result={res} />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Tabs tabs={[
      { label: 'List all doctors', content: <ListDoctors /> },
      { label: 'Create profile',   content: <CreateDoctor /> },
      { label: 'Update doctor',    content: <UpdateDoctor /> },
      { label: 'Delete doctor',    content: <DeleteDoctor /> },
    ]} />
  );
}
