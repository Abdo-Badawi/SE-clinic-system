import { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientAppointments() {
  const { user } = useAuth();
  const patientId = user?.userId;
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookDoctor, setBookDoctor] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [cancelReason, setCancelReason] = useState({});
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!patientId) return;
    // Fetch own appointments
    api.get(`/api/appointments/patient/${patientId}`)
      .then(res => setAppointments(res.data))
      .catch(err => setError('Failed to load appointments'));
    // Fetch doctors for booking
    api.get('/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Failed to load doctors'));
  }, [patientId]);

  const fetchSlots = async () => {
    if (!bookDoctor || !bookDate) return;
    setError('');
    try {
      const { data } = await api.post('/api/appointments/available-slots', {
        doctorId: parseInt(bookDoctor),
        date: bookDate,
      });
      setSlots(data.filter(s => s.available));
    } catch (err) {
      setError('Failed to load slots');
    }
  };

  const bookAppointment = async (startTime) => {
    setError('');
    setSuccess('');
    try {
      await api.post('/api/appointments', {
        patientId: parseInt(patientId),
        doctorId: parseInt(bookDoctor),
        appointmentDate: bookDate,
        startTime: startTime,
      });
      setSuccess('Appointment booked!');
      setSlots([]);
      // Refresh appointments
      const { data } = await api.get(`/api/appointments/patient/${patientId}`);
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const cancelAppointment = async (id) => {
    const reason = cancelReason[id] || '';
    if (!reason) {
      alert('Please provide a cancellation reason.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`);
      setSuccess('Appointment cancelled');
      setShowCancelInput(null);
      const { data } = await api.get(`/api/appointments/patient/${patientId}`);
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div>
      <h2>My Appointments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Book Appointment */}
      <details style={{ marginBottom: '1rem' }}>
        <summary>📝 Book New Appointment</summary>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <select value={bookDoctor} onChange={e => setBookDoctor(e.target.value)}>
            <option value="">-- Select Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.fullName} ({doc.specialization})</option>
            ))}
          </select>
          <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} />
          <button onClick={fetchSlots}>Show Slots</button>
        </div>
        {slots.length > 0 && (
          <div>
            <strong>Free slots:</strong>
            <ul>
              {slots.map((s, idx) => (
                <li key={idx}>
                  {s.startTime} – {s.endTime}{' '}
                  <button onClick={() => bookAppointment(s.startTime)}>Book</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </details>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <p>No appointments.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => {
              const doc = doctors.find(d => d.id === app.doctorId);
              const doctorName = doc ? `${doc.fullName} (${doc.specialization})` : app.doctorId;
              return (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{doctorName}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.startTime} – {app.endTime}</td>
                  <td>{app.status}</td>
                  <td>
                    {app.status === 'scheduled' && (
                      showCancelInput === app.id ? (
                        <>
                          <input type="text" placeholder="Reason"
                            value={cancelReason[app.id] || ''}
                            onChange={e => setCancelReason({...cancelReason, [app.id]: e.target.value})} />
                          <button onClick={() => cancelAppointment(app.id)}>Confirm Cancel</button>
                          <button onClick={() => setShowCancelInput(null)}>Back</button>
                        </>
                      ) : (
                        <button onClick={() => setShowCancelInput(app.id)}>Cancel</button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}