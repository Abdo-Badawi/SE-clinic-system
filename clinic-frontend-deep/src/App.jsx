import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/Admin/Dashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import DoctorList from "./pages/Admin/DoctorList";
import AuditLogs from "./pages/Admin/AuditLogs";
import ManagePatients from "./pages/Admin/ManagePatients";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import DoctorDashboard from "./pages/Doctor/Dashboard";
import Schedule from "./pages/Doctor/Schedule";
import MedicalRecords from "./pages/Doctor/MedicalRecords";
import ReceptionistDashboard from './pages/Receptionist/Dashboard';
import ReceptionistPatients from './pages/Receptionist/Patients';      // ✅ single import
import ReceptionistAppointments from './pages/Receptionist/Appointments';
import PatientDashboard from './pages/Patient/Dashboard';
import PatientProfile from './pages/Patient/Profile';
import PatientAppointments from './pages/Patient/Appointments';
import PatientMedicalHistory from './pages/Patient/MedicalHistory';
// We'll add Doctor, Receptionist, Patient later

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h2>Select a section</h2>} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="doctors" element={<ManageDoctors />} />
          </Route>
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h2>Select a section</h2>} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="records" element={<MedicalRecords />} />
          </Route>
          <Route path="/receptionist" element={
  <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
    <ReceptionistDashboard />
  </ProtectedRoute>
}>
  <Route index element={<h2>Select a section</h2>} />
  <Route path="patients" element={<ReceptionistPatients />} />
  <Route path="appointments" element={<ReceptionistAppointments />} />
</Route>
<Route path="/patient" element={
  <ProtectedRoute allowedRoles={['PATIENT']}>
    <PatientDashboard />
  </ProtectedRoute>
}>
  <Route index element={<h2>Select a section</h2>} />
  <Route path="profile" element={<PatientProfile />} />
  <Route path="appointments" element={<PatientAppointments />} />
  <Route path="history" element={<PatientMedicalHistory />} />
</Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
