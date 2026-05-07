import { useState, useEffect } from 'react';
import api from '../../api';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const { data } = await api.get('/api/doctors');
    setDoctors(data);
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return;
    await api.delete(`/api/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <div>
      <h2>Doctors</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr><th>ID</th><th>Specialization</th><th>Active</th><th>Action</th></tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.specialization}</td>
              <td>{doc.isActive ? 'Yes' : 'No'}</td>
              <td>
                {doc.isActive && (
                  <button onClick={() => handleDeactivate(doc.id)}>Deactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}