import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/api/patients/');
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  // Start editing
  const handleEditStart = (patient) => {
    setEditId(patient.id);
    setEditData({
      phone: patient.phone,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      medicalSummary: patient.medicalSummary,
    });
  };

  // Save edit
  const handleEditSave = async (id) => {
    try {
      await api.put(`/api/patients/${id}`, editData);
      setSuccess('Patient updated!');
      setEditId(null);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  // Delete patient
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this patient?')) return;
    try {
      await api.delete(`/api/patients/${id}`);
      setSuccess('Patient deleted.');
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h2>Manage Patients</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Patient List */}
      <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Emergency</th>
            <th>Summary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              {editId === p.id ? (
                <>
                  <td>{p.id}</td>
                  <td>{p.dateOfBirth}</td>
                  <td><input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} /></td>
                  <td><input value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} /></td>
                  <td><input value={editData.emergencyContact} onChange={e => setEditData({...editData, emergencyContact: e.target.value})} /></td>
                  <td><textarea value={editData.medicalSummary} onChange={e => setEditData({...editData, medicalSummary: e.target.value})} /></td>
                  <td>
                    <button onClick={() => handleEditSave(p.id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.id}</td>
                  <td>{p.dateOfBirth}</td>
                  <td>{p.phone}</td>
                  <td>{p.address}</td>
                  <td>{p.emergencyContact}</td>
                  <td>{p.medicalSummary}</td>
                  <td>
                    <button onClick={() => handleEditStart(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}