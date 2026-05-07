import { useState, useEffect } from 'react';
import api from '../../api';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
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
  const [success, setSuccess] = useState('');

  // Fetch all patients
  const fetchAllPatients = async () => {
    setError('');
    try {
      const { data } = await api.get('/api/patients/');
      setPatients(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patients');
    }
  };

  // Search patient by ID
  const searchPatient = async () => {
    if (!searchId) return;
    setError('');
    try {
      const { data } = await api.get(`/api/patients/${searchId}`);
      setSelectedPatient(data);
      setPatients([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found');
      setSelectedPatient(null);
    }
  };

  // Create new patient
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/patients', {
        userId: parseInt(newPatient.userId),
        dateOfBirth: newPatient.dateOfBirth,
        phone: newPatient.phone,
        address: newPatient.address,
        emergencyContact: newPatient.emergencyContact,
        medicalSummary: newPatient.medicalSummary,
      });
      setSuccess('Patient created successfully!');
      setNewPatient({
        userId: '', dateOfBirth: '', phone: '', address: '',
        emergencyContact: '', medicalSummary: '',
      });
      fetchAllPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
  };

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
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/patients/${id}`, {
        phone: editData.phone,
        address: editData.address,
        emergencyContact: editData.emergencyContact,
        medicalSummary: editData.medicalSummary,
      });
      setSuccess('Patient updated!');
      setEditId(null);
      fetchAllPatients();
      if (selectedPatient && selectedPatient.id === id) {
        setSelectedPatient({ ...selectedPatient, ...editData });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h2>Patient Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Create New Patient */}
      <details>
        <summary>➕ Create New Patient Profile</summary>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400, marginTop: '1rem' }}>
          <input type="number" placeholder="User ID" value={newPatient.userId}
            onChange={e => setNewPatient({...newPatient, userId: e.target.value})} required />
          <input type="date" placeholder="Date of Birth" value={newPatient.dateOfBirth}
            onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} />
          <input placeholder="Phone" value={newPatient.phone}
            onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
          <input placeholder="Address" value={newPatient.address}
            onChange={e => setNewPatient({...newPatient, address: e.target.value})} />
          <input placeholder="Emergency Contact" value={newPatient.emergencyContact}
            onChange={e => setNewPatient({...newPatient, emergencyContact: e.target.value})} />
          <textarea placeholder="Medical Summary" value={newPatient.medicalSummary}
            onChange={e => setNewPatient({...newPatient, medicalSummary: e.target.value})} />
          <button type="submit">Create Patient</button>
        </form>
      </details>

      {/* Search by ID */}
      <div style={{ marginTop: '1rem' }}>
        <input type="number" placeholder="Search Patient by ID" value={searchId}
          onChange={e => setSearchId(e.target.value)} />
        <button onClick={searchPatient}>Search</button>
        <button onClick={fetchAllPatients} style={{ marginLeft: '0.5rem' }}>List All</button>
      </div>

      {/* Display searched patient */}
      {selectedPatient && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h4>Patient Details (ID: {selectedPatient.id})</h4>
          {editId === selectedPatient.id ? (
            <div>
              <input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
              <input value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} />
              <input value={editData.emergencyContact} onChange={e => setEditData({...editData, emergencyContact: e.target.value})} />
              <textarea value={editData.medicalSummary} onChange={e => setEditData({...editData, medicalSummary: e.target.value})} />
              <button onClick={() => handleEditSave(selectedPatient.id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>DOB: {selectedPatient.dateOfBirth}</p>
              <p>Phone: {selectedPatient.phone}</p>
              <p>Address: {selectedPatient.address}</p>
              <p>Emergency: {selectedPatient.emergencyContact}</p>
              <p>Summary: {selectedPatient.medicalSummary}</p>
              <button onClick={() => handleEditStart(selectedPatient)}>Edit</button>
            </div>
          )}
        </div>
      )}

      {/* All Patients Table */}
      {patients.length > 0 && (
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
                    <td><button onClick={() => handleEditStart(p)}>Edit</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}