import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import MedicalRecords from './pages/MedicalRecords';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          
          {/* Accessible by EVERYONE who is logged in */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Accessible by ADMIN & RECEPTIONIST */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST']} />}>
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          {/* Accessible by ADMIN & DOCTOR */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
            <Route path="/records" element={<MedicalRecords />} />
          </Route>

          {/* Accessible by ADMIN ONLY */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/doctors" element={<Doctors />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}