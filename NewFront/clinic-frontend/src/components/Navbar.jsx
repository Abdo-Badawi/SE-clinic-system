import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUserRole } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        {(role === "ADMIN" || role === "RECEPTIONIST") && (
          <>
            <Link to="/patients">Patients</Link>
            <Link to="/doctors">Doctors</Link>
          </>
        )}
        <Link to="/appointments">Appointments</Link>
        {(role === "DOCTOR" || role === "PATIENT") && (
          <Link to="/medical-records">Medical Records</Link>
        )}
        {role === "ADMIN" && <Link to="/audit-logs">Audit Logs</Link>}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}