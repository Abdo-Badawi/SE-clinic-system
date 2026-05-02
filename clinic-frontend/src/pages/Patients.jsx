import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // 1. Get patient medical details
        const patientRes = await api.get('/api/patients/');
        const patientRecords = patientRes.data;

        // 2. Fetch User details (Name, Email) for each patient
        const mergedData = await Promise.all(
          patientRecords.map(async (patient) => {
            try {
              const userRes = await api.get(`/api/auth/internal/users/${patient.id}`);
              return { 
                ...patient, 
                fullName: userRes.data.fullName, 
                email: userRes.data.email 
              };
            } catch (err) {
              return { ...patient, fullName: "Unknown User", email: "N/A" };
            }
          })
        );

        setPatients(mergedData);
      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading patients...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4">Patient Directory</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Phone</th>
            <th className="pb-3">DOB</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? patients.map(p => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 font-medium text-gray-800">{p.fullName}</td>
              <td className="py-3 text-gray-600">{p.email}</td>
              <td className="py-3 text-gray-600">{p.phone}</td>
              <td className="py-3 text-gray-600">{p.dateOfBirth}</td>
            </tr>
          )) : <tr><td colSpan="4" className="py-4 text-center text-gray-500">No patients found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}