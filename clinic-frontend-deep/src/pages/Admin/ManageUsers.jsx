import { useState } from 'react';
import api from '../../api';

export default function ManageUsers() {
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', role: 'DOCTOR',
    phone: '', address: '', specialization: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: form.role,
      phone: form.role === 'PATIENT' ? form.phone : undefined,
      address: form.role === 'PATIENT' ? form.address : undefined,
      specialization: form.role === 'DOCTOR' ? form.specialization : undefined,
    };
    try {
      await api.post('/api/auth/admin/users', payload);
      setMessage('User created successfully!');
      setForm({ email: '', password: '', fullName: '', role: 'DOCTOR', phone: '', address: '', specialization: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="DOCTOR">Doctor</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="PATIENT">Patient</option>
        </select>
        {form.role === 'PATIENT' && (
          <>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          </>
        )}
        {form.role === 'DOCTOR' && (
          <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} required />
        )}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}