import { useEffect, useState } from "react";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyContact: "",
    medicalSummary: "",
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients();
      setPatients(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePatient(editingId, form);
      } else {
        await createPatient(form);
      }
      resetForm();
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setForm({
      userId: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      emergencyContact: "",
      medicalSummary: "",
    });
    setEditingId(null);
  };

  const handleEdit = (patient) => {
    setEditingId(patient.id);
    setForm(patient);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this patient?")) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (err) {
        setError("Delete failed");
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Patients</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 grid grid-cols-2 gap-2">
        <input
          placeholder="User ID"
          className="border p-2"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          required
        />
        <input
          placeholder="Date of Birth (YYYY-MM-DD)"
          className="border p-2"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
        />
        <input
          placeholder="Phone"
          className="border p-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Address"
          className="border p-2"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="Emergency Contact"
          className="border p-2"
          value={form.emergencyContact}
          onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
        />
        <input
          placeholder="Medical Summary"
          className="border p-2"
          value={form.medicalSummary}
          onChange={(e) => setForm({ ...form, medicalSummary: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 col-span-2">
          {editingId ? "Update" : "Create"} Patient
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 col-span-2">
            Cancel Edit
          </button>
        )}
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr><th className="border p-2">ID</th><th>User ID</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.userId}</td>
              <td className="border p-2">{p.phone}</td>
              <td className="border p-2">{p.address}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}