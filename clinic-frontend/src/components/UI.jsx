// src/components/UI.jsx
import { useState } from 'react';

// ── Response Box ──────────────────────────────────────────────────────────────
export function ResponseBox({ result }) {
  if (!result) return null;
  const cls = result.ok ? 'ok' : 'error';
  return (
    <div className={`response-box ${cls}`}>
      {`HTTP ${result.status}\n`}{JSON.stringify(result.data, null, 2)}
    </div>
  );
}

// ── Send Button ───────────────────────────────────────────────────────────────
export function SendButton({ onClick, loading, label = 'Send', icon = 'ti-send', className = 'btn-primary' }) {
  return (
    <button className={`btn ${className}`} onClick={onClick} disabled={loading}>
      {loading ? <span className="spinner" /> : <i className={`ti ${icon}`} />}
      {loading ? 'Sending…' : label}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'gray', children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  completed:  { v: 'green',  label: 'Completed' },
  checked_in: { v: 'blue',   label: 'Checked in' },
  scheduled:  { v: 'teal',   label: 'Scheduled' },
  cancelled:  { v: 'red',    label: 'Cancelled' },
  no_show:    { v: 'amber',  label: 'No show' },
  DOCTOR:        { v: 'blue',  label: 'Doctor' },
  PATIENT:       { v: 'teal',  label: 'Patient' },
  RECEPTIONIST:  { v: 'amber', label: 'Receptionist' },
  ADMIN:         { v: 'red',   label: 'Admin' },
};
export function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { v: 'gray', label: status };
  return <Badge variant={cfg.v}>{cfg.label}</Badge>;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="tab-bar">
        {tabs.map((t, i) => (
          <div key={i} className={`tab-item${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
            {t.label}
          </div>
        ))}
      </div>
      {tabs[active]?.content}
    </>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', icon, children }) {
  const icons = { info: 'ti-info-circle', warning: 'ti-alert-triangle', danger: 'ti-alert-circle' };
  return (
    <div className={`alert alert-${type}`}>
      <i className={`ti ${icon || icons[type]}`} />
      <span>{children}</span>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'ti-inbox', message = 'No data' }) {
  return (
    <div className="empty-state">
      <i className={`ti ${icon}`} />
      <p>{message}</p>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name = '', color = 'blue', size = 32 }) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `var(--${color}-100,#B5D4F4)`, color: `var(--${color}-800,#0C447C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 600, flexShrink: 0 }}>
      {initials || '?'}
    </div>
  );
}
