import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Admin / shared pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PatientsPage from '../pages/admin/PatientsPage';
import AppointmentsPage from '../pages/admin/AppointmentsPage';
import MedicalHistoryPage from '../pages/admin/MedicalHistoryPage';
import UsersPage from '../pages/admin/UsersPage';

// Doctor
import DoctorDashboard from '../pages/doctor/DoctorDashboard';

// Employee
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import PendingApprovalsPage from '../pages/employee/PendingApprovalsPage';

// Patient
import PatientDashboard from '../pages/patient/PatientDashboard';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage';
import MyRecordsPage from '../pages/patient/MyRecordsPage';

function DashboardRouter() {
  const { currentUser } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;

  switch (currentUser.role) {
    case 'ADMIN':    return <AdminDashboard />;
    case 'DOCTOR':   return <DoctorDashboard />;
    case 'EMPLOYEE': return <EmployeeDashboard />;
    case 'PATIENT':  return <PatientDashboard />;
    default:         return <Navigate to="/login" replace />;
  }
}

export default function AppRouter() {
  const { currentUser } = useAppStore();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard — role-aware */}
        <Route path="dashboard" element={<DashboardRouter />} />

        {/* Admin + Doctor + Employee */}
        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'EMPLOYEE']}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'EMPLOYEE']}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin + Doctor */}
        <Route
          path="records"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
              <MedicalHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Employee only */}
        <Route
          path="pending"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <PendingApprovalsPage />
            </ProtectedRoute>
          }
        />

        {/* Patient only */}
        <Route
          path="my-dashboard"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-appointments"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-records"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MyRecordsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
