import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
    activeDoctors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data concurrently from the 3 services
        const [patientsRes, appointmentsRes, doctorsRes] = await Promise.allSettled([
          api.get('/api/patients/'),
          api.get('/api/appointments'),
          api.get('/api/doctors')
        ]);

        let totalPatients = 0;
        let pendingAppointments = 0;
        let activeDoctors = 0;

        // Parse Patients
        if (patientsRes.status === 'fulfilled' && Array.isArray(patientsRes.value.data)) {
          totalPatients = patientsRes.value.data.length;
        }

        // Parse Appointments (Filter for 'scheduled' status)
        if (appointmentsRes.status === 'fulfilled' && Array.isArray(appointmentsRes.value.data)) {
          pendingAppointments = appointmentsRes.value.data.filter(
            apt => apt.status?.toLowerCase() === 'scheduled'
          ).length;
        }

        // Parse Doctors
        if (doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value.data)) {
          activeDoctors = doctorsRes.value.data.length;
        }

        setStats({ totalPatients, pendingAppointments, activeDoctors });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-gray-500 font-medium">Loading overview...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Patients</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pending Appointments</p>
          <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Doctors</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeDoctors}</p>
        </div>
      </div>
    </div>
  );
}