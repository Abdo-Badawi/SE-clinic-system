import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function DoctorDashboard() {
  return (
    <div className="page-container">
      <Navbar />
      <h1>Doctor Dashboard</h1>
      <nav>
        <Link to="schedule">My Schedule</Link> |{' '}
        <Link to="records">Medical Records</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}