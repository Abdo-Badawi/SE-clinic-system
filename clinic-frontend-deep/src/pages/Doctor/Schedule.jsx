import { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function Schedule() {
  const { user } = useAuth();
  const doctorId = user?.userId;   // <-- changed to userId
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    } else {
      setError('Doctor ID not available. Please log in again.');
    }
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get(`/api/appointments/doctor/${doctorId}`);
      setAppointments(data);
      setError('');
    } catch (err) {
      setError('Failed to load schedule');
    }
  };

  const updateStatus = async (id, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/appointments/${id}/status`, { status: newStatus });
      setSuccess(`Appointment ${id} updated to ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (error) {
    return (
      <div>
        <h2>My Schedule</h2>
        <p style={{ color: 'red' }}>{error}</p>
        {doctorId === undefined && (
          <button onClick={() => window.location.reload()}>Re‑login</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>My Schedule</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.patientId}</td>
                <td>{app.appointmentDate}</td>
                <td>{app.startTime} – {app.endTime}</td>
                <td>{app.status}</td>
                <td>{app.cancellationReason || '—'}</td>
                <td>
                  {app.status === 'scheduled' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'checked_in')}>Check‑in</button>
                      <button onClick={() => updateStatus(app.id, 'completed')}>Completed</button>
                    </>
                  )}
                  {app.status === 'checked_in' && (
                    <button onClick={() => updateStatus(app.id, 'completed')}>Completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}