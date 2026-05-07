// src/App.jsx
import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RecordsPage from './pages/RecordsPage';
import AuditPage from './pages/AuditPage';
import './styles/global.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  auth:         'Authentication',
  patients:     'Patients',
  doctors:      'Doctors',
  appointments: 'Appointments',
  records:      'Medical Records',
  audit:        'Audit Logs',
};

function AppInner() {
  const { isLoggedIn, user } = useAuth();
  const [page,      setPage]      = useState('dashboard');
  const [viewRole,  setViewRole]  = useState('admin');
  const [loggedIn,  setLoggedIn]  = useState(isLoggedIn);

  const handleLogin = () => {
    const role = (user?.role || 'ADMIN').toLowerCase();
    const map  = { admin: 'admin', doctor: 'doctor', receptionist: 'receptionist', patient: 'patient' };
    setViewRole(map[role] || 'admin');
    setLoggedIn(true);
  };

  if (!loggedIn && !isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pages = { dashboard: DashboardPage, auth: AuthPage, patients: PatientsPage, doctors: DoctorsPage, appointments: AppointmentsPage, records: RecordsPage, audit: AuditPage };
  const PageComponent = pages[page] || DashboardPage;

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={page}
        viewRole={viewRole}
        onNavigate={setPage}
        onRoleChange={r => { setViewRole(r); setPage('dashboard'); }}
      />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">{PAGE_TITLES[page] || page}</span>
          <div className="topbar-right">
            <span className="base-url-text">{localStorage.getItem('baseUrl') || 'http://localhost:8080'}</span>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="dot dot-green" />Token active
            </span>
          </div>
        </div>
        <div className="page-content">
          <PageComponent onNavigate={setPage} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const validateToken = useAuthStore((state) => state.validateToken);

  useEffect(() => {
    validateToken();
  }, [validateToken]);
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
