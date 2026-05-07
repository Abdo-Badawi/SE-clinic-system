import { useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function MedicalRecords() {
  const { user } = useAuth();
  const [patientId, setPatientId] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newRecord, setNewRecord] = useState({
    patientId: '',
    appointmentId: '',
    visitDate: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  const fetchHistory = async () => {
    setError('');
    setSuccess('');
    if (!patientId) return;
    try {
      const { data } = await api.get(`/api/medical-records/patient/${patientId}`);
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/medical-records', {
        patientId: parseInt(newRecord.patientId),
        appointmentId: newRecord.appointmentId ? parseInt(newRecord.appointmentId) : null,
        visitDate: newRecord.visitDate || null,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription,
        notes: newRecord.notes,
      });
      setSuccess('Medical record created!');
      setNewRecord({ patientId: '', appointmentId: '', visitDate: '', diagnosis: '', prescription: '', notes: '' });
      if (patientId === newRecord.patientId) fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <div>
      <h2>Medical Records</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* View Patient History */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Patient History</h3>
        <input
          type="number"
          placeholder="Patient ID"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
        />
        <button onClick={fetchHistory}>Load Records</button>

        {records.length > 0 && (
          <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Diagnosis</th>
                <th>Prescription</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.visitDate}</td>
                  <td>{rec.diagnosis}</td>
                  <td>{rec.prescription}</td>
                  <td>{rec.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create New Record */}
      <details>
        <summary>➕ Create New Medical Record</summary>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400, marginTop: '1rem' }}>
          <input type="number" placeholder="Patient ID" value={newRecord.patientId} onChange={e => setNewRecord({ ...newRecord, patientId: e.target.value })} required />
          <input type="number" placeholder="Appointment ID (optional)" value={newRecord.appointmentId} onChange={e => setNewRecord({ ...newRecord, appointmentId: e.target.value })} />
          <input type="datetime-local" placeholder="Visit Date" value={newRecord.visitDate} onChange={e => setNewRecord({ ...newRecord, visitDate: e.target.value })} />
          <textarea placeholder="Diagnosis" value={newRecord.diagnosis} onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })} />
          <textarea placeholder="Prescription" value={newRecord.prescription} onChange={e => setNewRecord({ ...newRecord, prescription: e.target.value })} />
          <textarea placeholder="Notes" value={newRecord.notes} onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })} />
          <button type="submit">Create Record</button>
        </form>
      </details>
    </div>
  );
}