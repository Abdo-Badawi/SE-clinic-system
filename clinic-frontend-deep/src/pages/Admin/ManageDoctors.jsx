import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ userId: '', specialization: '' });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/api/doctors');
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Create new doctor
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/doctors', {
        userId: parseInt(newDoctor.userId, 10),
        specialization: newDoctor.specialization,
      });
      setNewDoctor({ userId: '', specialization: '' });
      setSuccess('Doctor created successfully!');
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    }
  };

  // Start editing
  const handleEditStart = (doctor) => {
    setEditId(doctor.id);
    setEditData({ specialization: doctor.specialization });
  };

  // Save edit
  const handleEditSave = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/doctors/${id}`, {
        specialization: editData.specialization,
      });
      setEditId(null);
      setSuccess('Doctor updated!');
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditId(null);
  };

  // Soft‑delete (deactivate)
  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this doctor? This will disable their account.')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/doctors/${id}`);
      setSuccess('Doctor deactivated.');
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Deactivation failed');
    }
  };

  return (
    <div>
      <h2>Manage Doctors</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Create New Doctor */}
      <details>
        <summary>➕ Create New Doctor Profile</summary>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400, marginTop: '1rem' }}>
          <label>
            User ID (from users table):
            <input
              type="number"
              value={newDoctor.userId}
              onChange={e => setNewDoctor({ ...newDoctor, userId: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Specialization:
            <input
              type="text"
              value={newDoctor.specialization}
              onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </label>
          <button type="submit">Create Doctor</button>
        </form>
      </details>

      <hr />

      {/* Doctor List */}
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>ID</th>
              <th>Specialization</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                {editId === doc.id ? (
                  // Editable row
                  <>
                    <td>{doc.id}</td>
                    <td>
                      <input
                        type="text"
                        value={editData.specialization}
                        onChange={e => setEditData({ ...editData, specialization: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>{doc.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEditSave(doc.id)}>Save</button>
                      <button onClick={handleEditCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  // Display row
                  <>
                    <td>{doc.id}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEditStart(doc)}>Edit</button>
                      {doc.isActive && (
                        <button onClick={() => handleDeactivate(doc.id)} style={{ marginLeft: '0.5rem' }}>
                          Deactivate
                        </button>
                      )}
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