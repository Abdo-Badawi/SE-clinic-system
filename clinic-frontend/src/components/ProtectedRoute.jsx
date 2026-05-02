import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    // Assuming your token payload has a 'role' field
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/dashboard" replace />; // or an 'Unauthorized' page
    }
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
}