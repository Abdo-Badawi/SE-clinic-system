import { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const patientId = user?.userId;
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!patientId) return;
    api.get(`/api/patients/${patientId}`)
      .then(res => setProfile(res.data))
      .catch(err => setError('Failed to load profile'));
  }, [patientId]);

  const handleEditStart = () => {
    setEditData({
      phone: profile.phone,
      address: profile.address,
      emergencyContact: profile.emergencyContact,
      medicalSummary: profile.medicalSummary,
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/patients/${patientId}`, editData);
      setSuccess('Profile updated!');
      setEditMode(false);
      // Refetch profile
      const { data } = await api.get(`/api/patients/${patientId}`);
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {editMode ? (
        <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
          <label>Phone: <input value={editData.phone}
            onChange={e => setEditData({...editData, phone: e.target.value})} /></label>
          <label>Address: <input value={editData.address}
            onChange={e => setEditData({...editData, address: e.target.value})} /></label>
          <label>Emergency Contact: <input value={editData.emergencyContact}
            onChange={e => setEditData({...editData, emergencyContact: e.target.value})} /></label>
          <label>Medical Summary: <textarea value={editData.medicalSummary}
            onChange={e => setEditData({...editData, medicalSummary: e.target.value})} /></label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Date of Birth:</strong> {profile.dateOfBirth}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Emergency Contact:</strong> {profile.emergencyContact}</p>
          <p><strong>Medical Summary:</strong> {profile.medicalSummary}</p>
          <button onClick={handleEditStart}>Edit</button>
        </div>
      )}
    </div>
  );
}