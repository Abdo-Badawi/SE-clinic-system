import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <h1>Admin Panel</h1>
      <nav>
        <Link to="users">Manage Users</Link> |{' '}
        <Link to="doctors">Doctors</Link> |{' '}
        <Link to="patients">Patients</Link> |{' '}
        <Link to="audit">Audit Logs</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}