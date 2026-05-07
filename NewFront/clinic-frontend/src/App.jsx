import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import AuditLogs from "./pages/AuditLogs";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR", "PATIENT"]}>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
