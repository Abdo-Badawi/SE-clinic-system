const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'src', 'pages');
const files = {
  'Appointments.jsx': `import { useState } from "react";
import {
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  bookAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterBy, setFilterBy] = useState("patient");
  const [filterId, setFilterId] = useState("");
  const [form, setForm] = useState({ patientId: "", doctorId: "", appointmentDate: "", startTime: "" });

  const fetchAppointments = async () => {
    if (!filterId) {
      setError("Please enter a patient or doctor ID to fetch appointments.");
      return;
    }

    setLoading(true);
    try {
      const res =
        filterBy === "patient"
          ? await getAppointmentsByPatient(filterId)
          : await getAppointmentsByDoctor(filterId);
      setAppointments(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.startTime) {
      setError("All appointment fields are required.");
      return;
    }

    try {
      await bookAppointment(form);
      setForm({ patientId: "", doctorId: "", appointmentDate: "", startTime: "" });
      fetchAppointments();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Appointment booking failed");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      try {
        await cancelAppointment(id, "Cancelled by user");
        fetchAppointments();
      } catch (err) {
        setError("Cancel failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment?")) {
      try {
        await deleteAppointment(id);
        fetchAppointments();
      } catch (err) {
        setError("Delete failed");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Appointments</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="bg-gray-100 p-4 rounded mb-6 gap-3 md:grid md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Fetch by</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-2 rounded ${filterBy === "patient" ? "bg-blue-500 text-white" : "bg-white border"}`}
              onClick={() => setFilterBy("patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={`px-3 py-2 rounded ${filterBy === "doctor" ? "bg-blue-500 text-white" : "bg-white border"}`}
              onClick={() => setFilterBy("doctor")}
            >
              Doctor
            </button>
          </div>
          <input
            placeholder={`${filterBy === "patient" ? "Patient" : "Doctor"} ID`}
            className="border p-2 w-full"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          />
          <button onClick={fetchAppointments} className="bg-blue-500 text-white px-4 py-2 rounded">
            Load Appointments
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="font-semibold">Book Appointment</h2>
          <input
            placeholder="Patient ID"
            className="border p-2 w-full"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          />
          <input
            placeholder="Doctor ID"
            className="border p-2 w-full"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 w-full"
            value={form.appointmentDate}
            onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
          />
          <input
            type="time"
            className="border p-2 w-full"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Book Appointment
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border p-2">{appointment.id}</td>
                <td className="border p-2">{appointment.patientId}</td>
                <td className="border p-2">{appointment.doctorId}</td>
                <td className="border p-2">{appointment.appointmentDate || appointment.date}</td>
                <td className="border p-2">{appointment.startTime || appointment.time}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleCancel(appointment.id)} className="bg-yellow-500 text-white px-2 rounded">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(appointment.id)} className="bg-red-500 text-white px-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
`,
  'MedicalRecords.jsx': `import { useState } from "react";
import {
  getMedicalRecordsByPatient,
  createMedicalRecord,
  updateMedicalRecord,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ patientId: "", diagnosis: "", prescription: "", notes: "" });

  const fetchRecords = async () => {
    if (!patientId) {
      setError("Enter a patient ID to load records.");
      return;
    }

    setLoading(true);
    try {
      const res = await getMedicalRecordsByPatient(patientId);
      setRecords(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis) {
      setError("Patient ID and diagnosis are required.");
      return;
    }

    try {
      if (editingId) {
        await updateMedicalRecord(editingId, form);
      } else {
        await createMedicalRecord(form);
      }
      setForm({ patientId: "", diagnosis: "", prescription: "", notes: "" });
      setEditingId(null);
      fetchRecords();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Medical record save failed");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      patientId: record.patientId || "",
      diagnosis: record.diagnosis || "",
      prescription: record.prescription || "",
      notes: record.notes || record.medicalSummary || "",
    });
  };

  const resetForm = () => {
    setForm({ patientId: "", diagnosis: "", prescription: "", notes: "" });
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Medical Records</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="bg-gray-100 p-4 rounded mb-6 gap-3 md:grid md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-semibold">Load Records</h2>
          <input
            placeholder="Patient ID"
            className="border p-2 w-full"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <button onClick={fetchRecords} className="bg-blue-500 text-white px-4 py-2 rounded">
            Load Records
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="font-semibold">Add / Update Record</h2>
          <input
            placeholder="Patient ID"
            className="border p-2 w-full"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            required
          />
          <input
            placeholder="Diagnosis"
            className="border p-2 w-full"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            required
          />
          <input
            placeholder="Prescription"
            className="border p-2 w-full"
            value={form.prescription}
            onChange={(e) => setForm({ ...form, prescription: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            className="border p-2 w-full"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            {editingId ? "Update" : "Create"} Record
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Patient ID</th>
            <th className="border p-2">Diagnosis</th>
            <th className="border p-2">Prescription</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td className="border p-2">{record.id}</td>
              <td className="border p-2">{record.patientId}</td>
              <td className="border p-2">{record.diagnosis}</td>
              <td className="border p-2">{record.prescription}</td>
              <td className="border p-2">{record.notes || record.medicalSummary}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(record)} className="bg-yellow-500 text-white px-2 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
  'AuditLogs.jsx': `import { useEffect, useState } from "react";
import { getAllAuditLogs, getAuditLogsByUser, getAuditLogsByAction } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAllAuditLogs();
      setLogs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchByUser = async () => {
    if (!userId) {
      setError("Enter a user ID to filter logs.");
      return;
    }

    setLoading(true);
    try {
      const res = await getAuditLogsByUser(userId);
      setLogs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load audit logs for user");
    } finally {
      setLoading(false);
    }
  };

  const fetchByAction = async () => {
    if (!action) {
      setError("Enter an action to filter logs.");
      return;
    }

    setLoading(true);
    try {
      const res = await getAuditLogsByAction(action);
      setLogs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load audit logs for action");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Audit Logs</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="bg-gray-100 p-4 rounded mb-6 grid gap-3 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">All Logs</h2>
          <button onClick={fetchLogs} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Load All Logs
          </button>
        </div>
        <div>
          <h2 className="font-semibold">Filter by User</h2>
          <input
            placeholder="User ID"
            className="border p-2 w-full"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={fetchByUser} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
            Search
          </button>
        </div>
        <div>
          <h2 className="font-semibold">Filter by Action</h2>
          <input
            placeholder="Action"
            className="border p-2 w-full"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <button onClick={fetchByAction} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
            Search
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.id}</td>
              <td className="border p-2">{log.userId || log.user?.id || log.user}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.timestamp || log.createdAt || log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
};
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(base, name), content, { encoding: 'utf8' });
}
console.log('pages written');
