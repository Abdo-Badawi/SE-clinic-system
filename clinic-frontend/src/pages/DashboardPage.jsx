// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { doctorAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    doctorAPI.list().then(r => { if (r.ok && Array.isArray(r.data)) setDoctors(r.data); });
  }, []);

  const name = user?.fullName || user?.email || 'User';

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Good morning, {name.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Welcome to your clinic dashboard.</p>
      </div>

      <div className="metrics-grid">
        {[
          { label: 'Active doctors',  icon: 'ti-stethoscope', value: doctors.length || '—', sub: 'Registered physicians' },
          { label: 'Patients',        icon: 'ti-users',        value: '—',                  sub: 'Total registered' },
          { label: 'Appointments',    icon: 'ti-calendar',     value: '—',                  sub: 'This month' },
          { label: 'Medical records', icon: 'ti-file-text',    value: '—',                  sub: 'On file' },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label"><i className={`ti ${m.icon}`} />{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">Quick actions</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Book appointment', icon: 'ti-calendar-plus', page: 'appointments' },
              { label: 'Add patient',      icon: 'ti-user-plus',     page: 'patients' },
              { label: 'Create record',    icon: 'ti-file-plus',     page: 'records' },
              { label: 'View doctors',     icon: 'ti-stethoscope',   page: 'doctors' },
              { label: 'Auth tools',       icon: 'ti-key',           page: 'auth' },
            ].map(a => (
              <button key={a.page} className="btn" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate(a.page)}>
                <i className={`ti ${a.icon}`} />{a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Session info</span></div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Role</div>
            <div style={{ marginBottom: 14 }}>
              <span className="badge badge-blue">{user?.role || 'UNKNOWN'}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>API Base</div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 14 }}>
              {localStorage.getItem('baseUrl') || 'http://localhost:8080'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>JWT Token</div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: 'var(--radius-md)', wordBreak: 'break-all', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)', maxHeight: 80, overflowY: 'auto' }}>
              {token || 'No token'}
            </div>
          </div>
        </div>
      </div>

      {doctors.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Doctors on staff</span>
            <button className="btn btn-sm" onClick={() => onNavigate('doctors')}><i className="ti ti-arrow-right" /> View all</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {doctors.slice(0, 5).map(d => (
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
        </div>
      )}
    </div>
  );
}
