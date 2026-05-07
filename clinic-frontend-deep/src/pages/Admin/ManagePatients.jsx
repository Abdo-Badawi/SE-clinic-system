import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    userId: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalSummary: '',
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');

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

  // Create new patient
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/patients', {
        userId: parseInt(newPatient.userId),
        dateOfBirth: newPatient.dateOfBirth,
        phone: newPatient.phone,
        address: newPatient.address,
        emergencyContact: newPatient.emergencyContact,
        medicalSummary: newPatient.medicalSummary,
      });
      setNewPatient({ userId: '', dateOfBirth: '', phone: '', address: '', emergencyContact: '', medicalSummary: '' });
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
  };

  // Start editing a patient
  const handleEditStart = (patient) => {
    setEditId(patient.id);
    setEditData({
      phone: patient.phone,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      medicalSummary: patient.medicalSummary,
    });
  };

  // Save edited patient
  const handleEditSave = async (id) => {
    try {
      await api.put(`/api/patients/${id}`, {
        phone: editData.phone,
        address: editData.address,
        emergencyContact: editData.emergencyContact,
        medicalSummary: editData.medicalSummary,
      });
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
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h2>Manage Patients</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create New Patient Form */}
      <details>
        <summary>Create New Patient Profile</summary>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
          <input placeholder="User ID" value={newPatient.userId} onChange={e => setNewPatient({...newPatient, userId: e.target.value})} required />
          <input type="date" placeholder="Date of Birth" value={newPatient.dateOfBirth} onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} />
          <input placeholder="Phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
          <input placeholder="Address" value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} />
          <input placeholder="Emergency Contact" value={newPatient.emergencyContact} onChange={e => setNewPatient({...newPatient, emergencyContact: e.target.value})} />
          <textarea placeholder="Medical Summary" value={newPatient.medicalSummary} onChange={e => setNewPatient({...newPatient, medicalSummary: e.target.value})} />
          <button type="submit">Create Patient</button>
        </form>
      </details>

      <hr />

      {/* Patient List with Edit/Delete */}
      <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Emergency Contact</th>
            <th>Medical Summary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              {editId === p.id ? (
                // Editable row
                <>
                  <td>{p.id}</td>
                  <td>{p.userId}</td>
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
                // Display row
                <>
                  <td>{p.id}</td>
                  <td>{p.userId}</td>
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