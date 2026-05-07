// src/pages/AppointmentsPage.jsx
import { useState } from 'react';
import { appointmentAPI } from '../services/api';
import { Tabs, ResponseBox, SendButton, Alert } from '../components/UI';

function BookAppointment() {
  const [form, setForm] = useState({ patientId: '5', doctorId: '3', appointmentDate: '2026-04-29', startTime: '10:00' });
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const send = async () => {
    setLoad(true);
    const r = await appointmentAPI.book({ ...form, patientId: +form.patientId, doctorId: +form.doctorId, startTime: form.startTime + ':00' });
    setRes(r); setLoad(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/appointments</div>
      <div className="card-subtitle">Book a new appointment — Admin, Receptionist, or Patient</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Patient ID</label><input className="form-input" type="number" value={form.patientId} onChange={e => set('patientId', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Doctor ID</label><input className="form-input" type="number" value={form.doctorId} onChange={e => set('doctorId', e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Appointment date</label><input className="form-input" type="date" value={form.appointmentDate} onChange={e => set('appointmentDate', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Start time</label><input className="form-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Book appointment" icon="ti-calendar-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function AvailableSlots() {
  const [doctorId, setDoctorId] = useState('3');
  const [date,     setDate]     = useState('2026-04-29');
  const [res,      setRes]      = useState(null);
  const [load,     setLoad]     = useState(false);
  const send = async () => { setLoad(true); const r = await appointmentAPI.availableSlots({ doctorId: +doctorId, date }); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/appointments/available-slots</div>
      <div className="card-subtitle">Public endpoint — no authentication required</div>
      <div className="divider" />
      <Alert type="info">This endpoint is public and sends no Authorization header.</Alert>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Doctor ID</label><input className="form-input" type="number" value={doctorId} onChange={e => setDoctorId(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Check slots" icon="ti-clock" />
      <ResponseBox result={res} />
    </div>
  );
}

function ByPatient() {
  const [id,   setId]   = useState('5');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await appointmentAPI.getByPatient(id); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/appointments/patient/:id</div>
      <div className="card-subtitle">Get all appointments for a patient</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Patient ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Fetch" icon="ti-search" />
      <ResponseBox result={res} />
    </div>
  );
}

function ByDoctor() {
  const [id,   setId]   = useState('3');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await appointmentAPI.getByDoctor(id); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/appointments/doctor/:id</div>
      <div className="card-subtitle">Get doctor schedule — accessible by Doctor and Admin</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Doctor ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Fetch schedule" icon="ti-search" />
      <ResponseBox result={res} />
    </div>
  );
}

function UpdateStatus() {
  const [id,     setId]     = useState('1');
  const [status, setStatus] = useState('checked_in');
  const [res,    setRes]    = useState(null);
  const [load,   setLoad]   = useState(false);
  const send = async () => { setLoad(true); const r = await appointmentAPI.updateStatus(id, status); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">PUT /api/appointments/:id/status</div>
      <div className="card-subtitle">Doctor updates to completed; Receptionist can check-in</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Appointment ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">New status</label>
          <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="checked_in">checked_in</option>
            <option value="completed">completed</option>
            <option value="no_show">no_show</option>
            <option value="scheduled">scheduled</option>
          </select>
        </div>
      </div>
      <SendButton onClick={send} loading={load} label="Update status" icon="ti-circle-check" />
      <ResponseBox result={res} />
    </div>
  );
}

function CancelAppointment() {
  const [id,     setId]     = useState('1');
  const [reason, setReason] = useState('Patient request');
  const [res,    setRes]    = useState(null);
  const [load,   setLoad]   = useState(false);
  const send = async () => { setLoad(true); const r = await appointmentAPI.cancel(id, reason); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">PUT /api/appointments/:id/cancel?reason=…</div>
      <div className="card-subtitle">Reason is passed as a query parameter</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Appointment ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Reason</label><input className="form-input" value={reason} onChange={e => setReason(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Cancel appointment" icon="ti-x" className="btn-danger" />
      <ResponseBox result={res} />
    </div>
  );
}

function DeleteAppointment() {
  const [id,   setId]   = useState('1');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const [conf, setConf] = useState(false);
  const send = async () => {
    if (!conf) { setConf(true); return; }
    setLoad(true); const r = await appointmentAPI.delete(id); setRes(r); setLoad(false); setConf(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">DELETE /api/appointments/:id</div>
      <div className="card-subtitle">Receptionist or Admin — permanently removes the record</div>
      <div className="divider" />
      <Alert type="danger">This permanently deletes the appointment record.</Alert>
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">Appointment ID</label><input className="form-input" type="number" value={id} onChange={e => { setId(e.target.value); setConf(false); }} /></div>
      <SendButton onClick={send} loading={load} label={conf ? 'Click again to confirm' : 'Delete'} icon="ti-trash" className="btn-danger" />
      <ResponseBox result={res} />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Tabs tabs={[
      { label: 'Book',            content: <BookAppointment /> },
      { label: 'Available slots', content: <AvailableSlots /> },
      { label: 'By patient',      content: <ByPatient /> },
      { label: 'By doctor',       content: <ByDoctor /> },
      { label: 'Update status',   content: <UpdateStatus /> },
      { label: 'Cancel',          content: <CancelAppointment /> },
      { label: 'Delete',          content: <DeleteAppointment /> },
    ]} />
  );
}
