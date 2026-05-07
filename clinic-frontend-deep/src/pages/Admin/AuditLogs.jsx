import { useState, useEffect } from 'react';
import api from '../../api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/api/audit/logs').then((res) => setLogs(res.data));
  }, []);

  return (
    <div>
      <h2>Audit Logs</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr><th>ID</th><th>User ID</th><th>Action</th><th>Table</th><th>Record ID</th><th>Date</th></tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{log.tableName}</td>
              <td>{log.recordId}</td>
              <td>{log.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}