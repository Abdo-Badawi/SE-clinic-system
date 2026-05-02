import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const docRes = await api.get('/api/doctors');
        const docRecords = docRes.data;

        const mergedData = await Promise.all(
          docRecords.map(async (doc) => {
            try {
              const userRes = await api.get(`/api/auth/internal/users/${doc.id}`);
              return { 
                ...doc, 
                fullName: userRes.data.fullName, 
                email: userRes.data.email 
              };
            } catch (err) {
              return { ...doc, fullName: "Unknown User", email: "N/A" };
            }
          })
        );

        setDoctors(mergedData);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading doctors...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4">Doctor Directory</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-3">Name</th>
            <th className="pb-3">Specialization</th>
            <th className="pb-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? doctors.map(d => (
            <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 font-medium text-gray-800">Dr. {d.fullName}</td>
              <td className="py-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {d.specialization}
                </span>
              </td>
              <td className="py-3 text-gray-600">{d.email}</td>
            </tr>
          )) : <tr><td colSpan="4" className="py-4 text-center text-gray-500">No doctors found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}