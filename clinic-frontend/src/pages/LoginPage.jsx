// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const QUICK_LOGINS = [
  { label: 'Admin',        email: 'admin@clinic.com' },
  { label: 'Doctor',       email: 'doctor@clinic.com' },
  { label: 'Receptionist', email: 'reception@clinic.com' },
  { label: 'Patient',      email: 'patient@clinic.com' },
];

export default function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [baseUrl,   setBaseUrl]   = useState(localStorage.getItem('baseUrl') || 'http://localhost:8080');
  const [email,     setEmail]     = useState('admin@clinic.com');
  const [password,  setPassword]  = useState('password123');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [showReg,   setShowReg]   = useState(false);
  const [regName,   setRegName]   = useState('');
  const [regEmail,  setRegEmail]  = useState('');
  const [regPass,   setRegPass]   = useState('');
  const [regMsg,    setRegMsg]    = useState('');

  const handleLogin = async () => {
    setLoading(true); setError('');
    localStorage.setItem('baseUrl', baseUrl);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) { onLogin(); }
    else { setError(res.data?.message || res.data?.error || 'Login failed. Check credentials.'); }
  };

  const handleRegister = async () => {
    const { authAPI } = await import('../services/api');
    const res = await authAPI.register(regName, regEmail, regPass);
    setRegMsg(res.ok ? '✓ Registered! You can now log in.' : 'Error: ' + JSON.stringify(res.data));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-tertiary)' }}>
      <div style={{ background: 'var(--bg-primary)', border: '0.5px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '32px', width: 380 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="brand-icon" style={{ width: 40, height: 40, fontSize: 20 }}>
            <i className="ti ti-building-hospital" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' }}>ClinicOS</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Clinic Management System</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">API Base URL</label>
          <input className="form-input" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
        </div>

        <div className="form-group">
          <label className="form-label">Quick login</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK_LOGINS.map(q => (
              <button key={q.email} className="btn btn-sm" onClick={() => { setEmail(q.email); setPassword('password123'); }}>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin} disabled={loading}>
          {loading ? <><span className="spinner" /> Signing in…</> : <><i className="ti ti-login" /> Sign in</>}
        </button>

        {error && <div style={{ fontSize: 12, color: 'var(--red-600)', marginTop: 10 }}>{error}</div>}

        <div className="divider" />

        <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
          No account?{' '}
          <span style={{ color: 'var(--blue-600)', cursor: 'pointer' }} onClick={() => setShowReg(!showReg)}>
            Register as patient
          </span>
        </div>

        {showReg && (
          <div style={{ marginTop: 16 }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" value={regName} onChange={e => setRegName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={regPass} onChange={e => setRegPass(e.target.value)} />
            </div>
            <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRegister}>
              <i className="ti ti-user-plus" /> Register
            </button>
            {regMsg && <div style={{ fontSize: 12, marginTop: 8, color: regMsg.startsWith('✓') ? 'var(--green-600)' : 'var(--red-600)' }}>{regMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
