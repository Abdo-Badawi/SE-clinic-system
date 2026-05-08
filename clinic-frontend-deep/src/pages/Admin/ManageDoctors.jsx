import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
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

  useEffect(() => { fetchDoctors(); }, []);

  // Start editing
  const handleEditStart = (doctor) => {
    setEditId(doctor.id);
    setEditData({ specialization: doctor.specialization });
  };

  // Save edit
  const handleEditSave = async (id) => {
    try {
      await api.put(`/api/doctors/${id}`, { specialization: editData.specialization });
      setSuccess('Doctor updated!');
      setEditId(null);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  // Cancel edit
  const handleEditCancel = () => setEditId(null);

  // Deactivate doctor
  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return;
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

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                {editId === doc.id ? (
                  <>
                    <td>{doc.id}</td>
                    <td>{doc.fullName}</td>
                    <td>
                      <input value={editData.specialization} onChange={e => setEditData({...editData, specialization: e.target.value})} />
                    </td>
                    <td>{doc.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEditSave(doc.id)}>Save</button>
                      <button onClick={handleEditCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{doc.id}</td>
                    <td>{doc.fullName}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEditStart(doc)}>Edit</button>
                      {doc.isActive && (
                        <button onClick={() => handleDeactivate(doc.id)}>Deactivate</button>
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