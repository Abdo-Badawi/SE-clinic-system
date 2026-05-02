import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FileText, User, Stethoscope, Calendar } from 'lucide-react';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/api/medical-records');
        
        // Resolve patient and doctor names
        const mergedData = await Promise.all(
          res.data.map(async (record) => {
            const getFullName = async (id) => {
              if (!id) return "N/A";
              try { 
                return (await api.get(`/api/auth/internal/users/${id}`)).data.fullName; 
              } catch { 
                return "Unknown"; 
              }
            };
            return {
              ...record,
              patientName: await getFullName(record.patientId),
              doctorName: await getFullName(record.doctorId)
            };
          })
        );
        
        setRecords(mergedData);
      } catch (err) {
        console.error("Failed to fetch medical records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <div className="p-6 text-gray-500 font-medium">Loading medical records...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Medical Records</h2>
      </div>
      
      <div className="space-y-6">
        {records.length > 0 ? records.map(record => (
          <div key={record.id} className="p-5 border rounded-xl bg-gray-50 shadow-sm">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div className="flex gap-6 text-sm">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <User size={16} className="text-blue-600"/> Patient: {record.patientName}
                </span>
                <span className="flex items-center gap-2 text-gray-700">
                  <Stethoscope size={16} className="text-green-600"/> Dr. {record.doctorName}
                </span>
              </div>
              <span className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} /> 
                {new Date(record.visitDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                <p className="text-gray-800">{record.diagnosis || "No diagnosis provided."}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescription</h4>
                <p className="text-gray-800">{record.prescription || "No prescription."}</p>
              </div>
            </div>
            
            {record.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText size={14} /> Doctor's Notes
                </h4>
                <p className="text-gray-600 text-sm italic">{record.notes}</p>
              </div>
            )}
          </div>
        )) : <p className="text-gray-500 text-center py-8">No medical records found in the system.</p>}
      </div>
    </div>
  );
}