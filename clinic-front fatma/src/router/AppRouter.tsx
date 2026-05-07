import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

import LoginPage              from '../pages/auth/LoginPage';
import AdminDashboard         from '../pages/admin/AdminDashboard';
import PatientsPage           from '../pages/admin/PatientsPage';
import AppointmentsPage       from '../pages/admin/AppointmentsPage';
import MedicalHistoryPage     from '../pages/admin/MedicalHistoryPage';
import UsersPage              from '../pages/admin/UsersPage';
import DoctorDashboard        from '../pages/doctor/DoctorDashboard';
import ReceptionistDashboard  from '../pages/receptionist/ReceptionistDashboard';
import PendingApprovalsPage   from '../pages/receptionist/PendingApprovalsPage';
import PatientDashboard       from '../pages/patient/PatientDashboard';
import MyAppointmentsPage     from '../pages/patient/MyAppointmentsPage';
import MyRecordsPage          from '../pages/patient/MyRecordsPage';

function DashboardRouter() {
  const { currentUser } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  switch (currentUser.role) {
    case 'ADMIN':        return <AdminDashboard />;
    case 'DOCTOR':       return <DoctorDashboard />;
    case 'RECEPTIONIST': return <ReceptionistDashboard />;
    case 'PATIENT':      return <PatientDashboard />;
    default:             return <Navigate to="/login" replace />;
  }
}

export default function AppRouter() {
  const { currentUser } = useAppStore();
  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Role-adaptive dashboard */}
        <Route path="dashboard" element={<DashboardRouter />} />

        {/* Admin + Doctor + Receptionist */}
        <Route path="patients" element={
          <ProtectedRoute allowedRoles={['ADMIN','DOCTOR','RECEPTIONIST']}>
            <PatientsPage />
          </ProtectedRoute>
        } />
        <Route path="appointments" element={
          <ProtectedRoute allowedRoles={['ADMIN','DOCTOR','RECEPTIONIST']}>
            <AppointmentsPage />
          </ProtectedRoute>
        } />

        {/* Admin + Doctor only */}
        <Route path="records" element={
          <ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}>
            <MedicalHistoryPage />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        } />

        {/* Receptionist only */}
        <Route path="pending" element={
          <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
            <PendingApprovalsPage />
          </ProtectedRoute>
        } />

        {/* Patient only */}
        <Route path="my-appointments" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <MyAppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="my-records" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <MyRecordsPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
