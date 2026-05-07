import { useState, useEffect } from 'react';
import api from '../../api';

export default function Appointments() {
  const [doctors, setDoctors] = useState([]);            // list of doctors
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');          // doctor ID for search
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotDoctorId, setSlotDoctorId] = useState('');  // doctor ID for slots
  const [slotDate, setSlotDate] = useState('');
  const [bookForm, setBookForm] = useState({
    patientId: '',
    doctorId: '',               // will be selected from dropdown
    appointmentDate: '',
    startTime: '',
  });
  const [cancelReason, setCancelReason] = useState({});
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch doctors list on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/api/doctors');
        setDoctors(data);
      } catch (err) {
        console.error('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  // Fetch by patient
  const fetchByPatient = async () => {
    if (!patientId) return;
    setError('');
    try {
      const { data } = await api.get(`/api/appointments/patient/${patientId}`);
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load');
    }
  };

  // Fetch by doctor
  const fetchByDoctor = async () => {
    if (!doctorId) return;
    setError('');
    try {
      const { data } = await api.get(`/api/appointments/doctor/${doctorId}`);
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load');
    }
  };

  // Fetch available slots
  const fetchSlots = async () => {
    if (!slotDoctorId || !slotDate) return;
    setError('');
    try {
      const { data } = await api.post('/api/appointments/available-slots', {
        doctorId: parseInt(slotDoctorId),
        date: slotDate,
      });
      setSlots(data.filter((s) => s.available));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load slots');
    }
  };

  // Book appointment (startTime can come from slot click or manual input)
  const bookAppointment = async (startTime = null) => {
    setError('');
    setSuccess('');
    const time = startTime || bookForm.startTime;
    if (!time) {
      alert('Please provide a start time.');
      return;
    }
    try {
      await api.post('/api/appointments', {
        patientId: parseInt(bookForm.patientId),
        doctorId: parseInt(bookForm.doctorId),
        appointmentDate: bookForm.appointmentDate,
        startTime: time,
      });
      setSuccess('Appointment booked!');
      if (patientId) fetchByPatient();
      else if (doctorId) fetchByDoctor();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  // Update status (check‑in)
  const updateStatus = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/appointments/${id}/status`, { status });
      setSuccess(`Appointment ${id} updated to ${status}`);
      if (patientId) fetchByPatient();
      else if (doctorId) fetchByDoctor();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  // Cancel appointment
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
      setSuccess(`Appointment ${id} cancelled`);
      setShowCancelInput(null);
      setCancelReason((prev) => ({ ...prev, [id]: '' }));
      if (patientId) fetchByPatient();
      else if (doctorId) fetchByDoctor();
    } catch (err) {
      setError(err.response?.data?.message || 'Cancel failed');
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    if (!window.confirm('Permanently delete this appointment?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/appointments/${id}`);
      setSuccess(`Appointment ${id} deleted`);
      if (patientId) fetchByPatient();
      else if (doctorId) fetchByDoctor();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  // Helper: get doctor name from ID
  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === id);
    return doc ? `${doc.fullName} (Spec: ${doc.specialization})` : id;
  };

  return (
    <div>
      <h2>Appointment Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Search by Patient ID */}
      <div style={{ marginBottom: '1rem' }}>
        <input type="number" placeholder="Patient ID" value={patientId}
          onChange={e => setPatientId(e.target.value)} />
        <button onClick={fetchByPatient}>Search by Patient</button>
      </div>

      {/* Search by Doctor (Dropdown) */}
      <div style={{ marginBottom: '1rem' }}>
        <select value={doctorId} onChange={e => setDoctorId(e.target.value)}>
          <option value="">-- Select Doctor --</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.fullName} ({doc.specialization})
            </option>
          ))}
        </select>
        <button onClick={fetchByDoctor}>Search by Doctor</button>
      </div>

      {/* Available Slots (Doctor Dropdown) */}
      <details style={{ marginBottom: '1rem' }}>
        <summary>📅 Check Available Slots</summary>
        <div>
          <select value={slotDoctorId} onChange={e => setSlotDoctorId(e.target.value)}>
            <option value="">-- Select Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName} ({doc.specialization})
              </option>
            ))}
          </select>
          <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} />
          <button onClick={fetchSlots}>Show Slots</button>
        </div>
        {slots.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
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

      {/* Book Appointment (Doctor Dropdown) */}
      <details style={{ marginBottom: '1rem' }}>
        <summary>📝 Quick Book Appointment</summary>
        <form onSubmit={(e) => { e.preventDefault(); bookAppointment(); }}
          style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
          <input type="number" placeholder="Patient ID" value={bookForm.patientId}
            onChange={e => setBookForm({...bookForm, patientId: e.target.value})} required />
          <select value={bookForm.doctorId}
            onChange={e => setBookForm({...bookForm, doctorId: e.target.value})} required>
            <option value="">-- Select Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName} ({doc.specialization})
              </option>
            ))}
          </select>
          <input type="date" value={bookForm.appointmentDate}
            onChange={e => setBookForm({...bookForm, appointmentDate: e.target.value})} required />
          <input type="time" value={bookForm.startTime}
            onChange={e => setBookForm({...bookForm, startTime: e.target.value})} required />
          <button type="submit">Book</button>
        </form>
      </details>

      {/* Appointments Table */}
      {appointments.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.patientId}</td>
                <td>{getDoctorName(app.doctorId)}</td>
                <td>{app.appointmentDate}</td>
                <td>{app.startTime} – {app.endTime}</td>
                <td>{app.status}</td>
                <td>
                  {app.status === 'scheduled' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'checked_in')}>Check‑in</button>
                      {showCancelInput === app.id ? (
                        <>
                          <input type="text" placeholder="Reason"
                            value={cancelReason[app.id] || ''}
                            onChange={e => setCancelReason({...cancelReason, [app.id]: e.target.value})} />
                          <button onClick={() => cancelAppointment(app.id)}>Confirm Cancel</button>
                          <button onClick={() => setShowCancelInput(null)}>Back</button>
                        </>
                      ) : (
                        <button onClick={() => setShowCancelInput(app.id)}>Cancel</button>
                      )}
                      <button onClick={() => deleteAppointment(app.id)}>Delete</button>
                    </>
                  )}
                  {app.status === 'checked_in' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'completed')}>Completed</button>
                      <button onClick={() => deleteAppointment(app.id)}>Delete</button>
                    </>
                  )}
                  {(app.status === 'completed' || app.status === 'cancelled' || app.status === 'no_show') && (
                    <button onClick={() => deleteAppointment(app.id)}>Delete</button>
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