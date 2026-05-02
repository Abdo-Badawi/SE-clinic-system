import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ShieldAlert, Clock, Database } from 'lucide-react';

export default function Admin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await api.get('/api/audit');
        
        // Attempt to fetch names for the users who performed the actions
        const mergedLogs = await Promise.all(
          res.data.map(async (log) => {
            let userName = "System/Unknown";
            if (log.userId) {
              try {
                const userRes = await api.get(`/api/auth/internal/users/${log.userId}`);
                userName = userRes.data.fullName;
              } catch (e) {
                userName = `User ID: ${log.userId}`;
              }
            }
            return { ...log, userName };
          })
        );
        
        // Sort by newest first
        const sortedLogs = mergedLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLogs(sortedLogs);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const formatAction = (action) => {
    switch(action.toUpperCase()) {
      case 'CREATE': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">CREATE</span>;
      case 'UPDATE': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">UPDATE</span>;
      case 'DELETE': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">DELETE</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{action}</span>;
    }
  };

  if (loading) return <div className="p-6 text-gray-500 font-medium">Loading system logs...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <ShieldAlert className="text-red-600" size={28} />
        <h2 className="text-xl font-bold text-gray-800">System Audit Logs</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600 bg-gray-50">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Table</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="p-4 text-gray-500 flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4">{formatAction(log.action)}</td>
                <td className="p-4 flex items-center gap-2 font-medium text-gray-700">
                  <Database size={14} className="text-gray-400" />
                  {log.tableName} (ID: {log.recordId})
                </td>
                <td className="p-4 font-medium">{log.userName}</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            )) : <tr><td colSpan="5" className="py-8 text-center text-gray-500">No audit logs recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}