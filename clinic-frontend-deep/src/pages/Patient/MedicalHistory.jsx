import { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function MedicalHistory() {
  const { user } = useAuth();
  const patientId = user?.userId;
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) return;
    api.get(`/api/medical-records/patient/${patientId}`)
      .then(res => setRecords(res.data))
      .catch(err => setError('Failed to load medical history'));
  }, [patientId]);

  return (
    <div>
      <h2>Medical History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {records.length === 0 ? (
        <p>No medical records found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Notes</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <tr key={rec.id}>
                <td>{rec.id}</td>
                <td>{rec.visitDate}</td>
                <td>{rec.diagnosis}</td>
                <td>{rec.prescription}</td>
                <td>{rec.notes}</td>
                <td>{rec.doctorId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}