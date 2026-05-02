import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/appointments');
      
      // Fetch names for patient and doctor
      const mergedData = await Promise.all(
        res.data.map(async (apt) => {
          const getFullName = async (id) => {
            try { 
              return (await api.get(`/api/auth/internal/users/${id}`)).data.fullName; 
            } catch { 
              return "Unknown"; 
            }
          };
          return {
            ...apt,
            patientName: await getFullName(apt.patientId),
            doctorName: await getFullName(apt.doctorId)
          };
        })
      );
      setAppointments(mergedData);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointments(); 
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      // Using query parameter as defined in your Postman collection
      await api.put(`/api/appointments/${id}/status?status=${newStatus}`);
      fetchAppointments(); // Refresh the list to show new status
    } catch (err) {
      alert("Failed to update status.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500 font-medium">Loading appointments...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6">Appointments</h2>
      <div className="space-y-4">
        {appointments.length > 0 ? appointments.map(apt => (
          <div key={apt.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
            <div>
              <p className="font-semibold text-gray-800">Patient: {apt.patientName}</p>
              <p className="text-sm text-gray-500 mt-1">Doctor: Dr. {apt.doctorName}</p>
            </div>
            
            <div className="text-right flex flex-col items-end gap-2">
              <p className="font-medium text-blue-600">
                {apt.appointmentDate} at {apt.startTime}
              </p>
              
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 uppercase tracking-wide font-semibold">
                  {apt.status}
                </span>
                
                {/* Status Action Buttons */}
                {apt.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(apt.id, 'checked_in')} 
                      className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 font-medium transition"
                    >
                      Check In
                    </button>
                    <button 
                      onClick={() => updateStatus(apt.id, 'cancelled')} 
                      className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {apt.status === 'checked_in' && (
                  <button 
                    onClick={() => updateStatus(apt.id, 'completed')} 
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 font-medium transition"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : <p className="text-gray-500 text-center py-4">No appointments found.</p>}
      </div>
    </div>
  );
}