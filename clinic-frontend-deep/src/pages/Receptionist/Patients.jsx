import { useState, useEffect } from 'react';
import api from '../../api';

export default function ReceptionistPatients() {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
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

  useEffect(() => { fetchAllPatients(); }, []);

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

  // Delete patient (optional – depends on role, but we keep it)
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this patient?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/patients/${id}`);
      setSuccess('Patient deleted.');
      fetchAllPatients();
      if (selectedPatient && selectedPatient.id === id) setSelectedPatient(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Patient Management</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* ===== CREATE FORM REMOVED ===== */}

      {/* Search by ID */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="Search Patient by ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          style={{ width: '200px', marginRight: '0.5rem' }}
        />
        <button onClick={searchPatient}>Search</button>
        <button onClick={fetchAllPatients} style={{ marginLeft: '0.5rem' }}>List All</button>
      </div>

      {/* Display searched patient */}
      {selectedPatient && (
        <div className="section" style={{ marginBottom: '1.5rem' }}>
          <h3>Patient Details (ID: {selectedPatient.id})</h3>
          {editId === selectedPatient.id ? (
            <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
              <input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} placeholder="Phone" />
              <input value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} placeholder="Address" />
              <input value={editData.emergencyContact} onChange={e => setEditData({...editData, emergencyContact: e.target.value})} placeholder="Emergency Contact" />
              <textarea value={editData.medicalSummary} onChange={e => setEditData({...editData, medicalSummary: e.target.value})} placeholder="Medical Summary" />
              <div>
                <button onClick={() => handleEditSave(selectedPatient.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>DOB:</strong> {selectedPatient.dateOfBirth}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Emergency:</strong> {selectedPatient.emergencyContact}</p>
              <p><strong>Summary:</strong> {selectedPatient.medicalSummary}</p>
              <button onClick={() => handleEditStart(selectedPatient)}>Edit</button>
              <button onClick={() => handleDelete(selectedPatient.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
            </>
          )}
        </div>
      )}

      {/* All Patients Table */}
      {patients.length > 0 && (
        <table>
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
      )}
    </div>
  );
}