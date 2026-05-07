import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function ReceptionistDashboard() {
  return (
    <div>
      <Navbar />
      <h1>Receptionist Panel</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="patients">Patients</Link> |{' '}
        <Link to="appointments">Appointments</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}