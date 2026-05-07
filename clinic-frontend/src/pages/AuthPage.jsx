// src/pages/AuthPage.jsx
import { useState } from 'react';
import { authAPI } from '../services/api';
import { Tabs, ResponseBox, SendButton } from '../components/UI';

function LoginTab() {
  const [email, setEmail] = useState('admin@clinic.com');
  const [pass,  setPass]  = useState('password123');
  const [res,   setRes]   = useState(null);
  const [load,  setLoad]  = useState(false);
  const send = async () => {
    setLoad(true);
    const r = await authAPI.login(email, pass);
    if (r.ok && r.data.token) {
      localStorage.setItem('token', r.data.token);
    }
    setRes(r); setLoad(false);
  };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/auth/login</div>
      <div className="card-subtitle">Authenticates user and returns JWT token</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={pass} onChange={e => setPass(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Login" icon="ti-login" />
      <ResponseBox result={res} />
    </div>
  );
}

function RegisterTab() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('newuser@example.com');
  const [pass,  setPass]  = useState('password123');
  const [res,   setRes]   = useState(null);
  const [load,  setLoad]  = useState(false);
  const send = async () => { setLoad(true); const r = await authAPI.register(name, email, pass); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/auth/register</div>
      <div className="card-subtitle">Self-registration — creates a PATIENT account</div>
      <div className="divider" />
      <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={pass} onChange={e => setPass(e.target.value)} /></div>
      </div>
      <SendButton onClick={send} loading={load} label="Register" icon="ti-user-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function AdminCreateTab() {
  const [form, setForm] = useState({ fullName: 'Dr. John Smith', email: 'newdoctor@clinic.com', password: 'password123', role: 'DOCTOR', specialization: 'Cardiology' });
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const send = async () => { setLoad(true); const r = await authAPI.adminCreateUser(form); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">POST /api/auth/admin/users</div>
      <div className="card-subtitle">Admin only — create user with any role</div>
      <div className="divider" />
      <div className="form-row">
        <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.fullName} onChange={e => set('fullName', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
            {['DOCTOR','RECEPTIONIST','ADMIN','PATIENT'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Specialization (doctors only)</label><input className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Create user" icon="ti-user-plus" />
      <ResponseBox result={res} />
    </div>
  );
}

function ValidateTab() {
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await authAPI.validate(); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/auth/validate</div>
      <div className="card-subtitle">Validates current Bearer token from session</div>
      <div className="divider" />
      <div className="form-group">
        <label className="form-label">Token (auto from session)</label>
        <input className="form-input" value={localStorage.getItem('token') || ''} readOnly style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }} />
      </div>
      <SendButton onClick={send} loading={load} label="Validate" icon="ti-shield-check" />
      <ResponseBox result={res} />
    </div>
  );
}

function InternalTab() {
  const [id,   setId]   = useState('1');
  const [res,  setRes]  = useState(null);
  const [load, setLoad] = useState(false);
  const send = async () => { setLoad(true); const r = await authAPI.internalGetUser(id); setRes(r); setLoad(false); };
  return (
    <div className="card">
      <div className="card-title mb-0">GET /api/auth/internal/users/:id</div>
      <div className="card-subtitle">Internal service call — no auth required</div>
      <div className="divider" />
      <div className="form-group" style={{ maxWidth: 200 }}><label className="form-label">User ID</label><input className="form-input" type="number" value={id} onChange={e => setId(e.target.value)} /></div>
      <SendButton onClick={send} loading={load} label="Lookup user" icon="ti-search" />
      <ResponseBox result={res} />
    </div>
  );
}

export default function AuthPage() {
  return (
    <div>
      <Tabs tabs={[
        { label: 'Login',              content: <LoginTab /> },
        { label: 'Register patient',   content: <RegisterTab /> },
        { label: 'Admin create user',  content: <AdminCreateTab /> },
        { label: 'Validate token',     content: <ValidateTab /> },
        { label: 'Internal lookup',    content: <InternalTab /> },
      ]} />
    </div>
  );
}
