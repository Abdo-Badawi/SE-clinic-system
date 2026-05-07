// src/components/Sidebar.jsx
import { useAuth } from '../hooks/useAuth';

const NAV_CONFIG = {
  admin: [
    { label: 'Dashboard',      icon: 'ti-layout-dashboard', page: 'dashboard' },
    { section: 'Auth' },
    { label: 'Auth tools',     icon: 'ti-key',              page: 'auth' },
    { section: 'Management' },
    { label: 'Patients',       icon: 'ti-users',            page: 'patients' },
    { label: 'Doctors',        icon: 'ti-stethoscope',      page: 'doctors' },
    { label: 'Appointments',   icon: 'ti-calendar',         page: 'appointments' },
    { label: 'Medical records',icon: 'ti-file-text',        page: 'records' },
    { section: 'Admin' },
    { label: 'Audit logs',     icon: 'ti-shield-check',     page: 'audit' },
  ],
  doctor: [
    { label: 'Dashboard',      icon: 'ti-layout-dashboard', page: 'dashboard' },
    { section: 'My work' },
    { label: 'My schedule',    icon: 'ti-calendar',         page: 'appointments' },
    { label: 'Medical records',icon: 'ti-file-text',        page: 'records' },
    { label: 'Patients',       icon: 'ti-users',            page: 'patients' },
  ],
  receptionist: [
    { label: 'Dashboard',      icon: 'ti-layout-dashboard', page: 'dashboard' },
    { section: 'Front desk' },
    { label: 'Patients',       icon: 'ti-users',            page: 'patients' },
    { label: 'Appointments',   icon: 'ti-calendar',         page: 'appointments' },
    { label: 'Doctors',        icon: 'ti-stethoscope',      page: 'doctors' },
  ],
  patient: [
    { label: 'Dashboard',      icon: 'ti-layout-dashboard', page: 'dashboard' },
    { section: 'My account' },
    { label: 'My profile',     icon: 'ti-user',             page: 'patients' },
    { label: 'My appointments',icon: 'ti-calendar',         page: 'appointments' },
    { label: 'My records',     icon: 'ti-file-text',        page: 'records' },
  ],
};

export default function Sidebar({ currentPage, viewRole, onNavigate, onRoleChange }) {
  const { user, logout } = useAuth();
  const nav = NAV_CONFIG[viewRole] || NAV_CONFIG.admin;
  const name  = user?.fullName || user?.email || 'User';
  const email = user?.email || '';
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><i className="ti ti-building-hospital" /></div>
        <div>
          <div className="brand-name">ClinicOS</div>
          <div className="brand-sub">Management System</div>
        </div>
      </div>

      <div className="sidebar-role-wrap">
        <select className="role-select" value={viewRole} onChange={e => onRoleChange(e.target.value)}>
          <option value="admin">View as Admin</option>
          <option value="doctor">View as Doctor</option>
          <option value="receptionist">View as Receptionist</option>
          <option value="patient">View as Patient</option>
        </select>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item, i) =>
          item.section
            ? <div key={i} className="nav-section-label">{item.section}</div>
            : (
              <button
                key={i}
                className={`nav-link${currentPage === item.page ? ' active' : ''}`}
                onClick={() => onNavigate(item.page)}
              >
                <i className={`ti ${item.icon}`} />
                {item.label}
              </button>
            )
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{name}</div>
            <div className="user-email">{email}</div>
          </div>
        </div>
        <button className="btn btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
          <i className="ti ti-logout" /> Sign out
        </button>
      </div>
    </aside>
  );
}
