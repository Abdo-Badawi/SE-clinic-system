import { Outlet, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  LogOut, 
  Activity, 
  Stethoscope, 
  ShieldAlert 
} from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Safely extract role, fallback to null if token is missing/invalid
  let userRole = null;
  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600 border-b">
          Clinic Portal <br/>
          <span className="text-xs text-gray-500 font-normal">Role: {userRole || 'UNKNOWN'}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          {/* Shared Link */}
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          {/* Receptionist & Admin & Patient Links */}
          {(userRole === 'ADMIN' || userRole === 'RECEPTIONIST' || userRole === 'PATIENT') && (
            <Link to="/appointments" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Calendar size={20} /> Appointments
            </Link>
          )}

          {/* Receptionist & Admin Links */}
          {(userRole === 'ADMIN' || userRole === 'RECEPTIONIST') && (
            <Link to="/patients" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Users size={20} /> Patients
            </Link>
          )}

          {/* Doctor & Admin Links */}
          {(userRole === 'ADMIN' || userRole === 'DOCTOR') && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">Clinical</p>
              <Link to="/records" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <Activity size={20} /> Medical Records
              </Link>
            </>
          )}

          {/* Admin Only Links */}
          {userRole === 'ADMIN' && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">System</p>
              <Link to="/doctors" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <Stethoscope size={20} /> Doctors
              </Link>
              <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600">
                <ShieldAlert size={20} /> Admin Panel
              </Link>
            </>
          )}

        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 m-4 rounded-lg font-medium transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}