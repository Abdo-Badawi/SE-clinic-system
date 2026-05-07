import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function PatientDashboard() {
  return (
    <div>
      <Navbar />
      <h1>Patient Panel</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="profile">My Profile</Link> |{' '}
        <Link to="appointments">My Appointments</Link> |{' '}
        <Link to="history">Medical History</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}