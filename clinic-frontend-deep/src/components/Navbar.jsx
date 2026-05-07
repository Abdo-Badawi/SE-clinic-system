import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0f0f0' }}>
      <span>Welcome, {user?.fullName} ({user?.role})</span>
      <Link to={`/${user?.role.toLowerCase()}`}>Home</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}