import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import type { Patient } from '../../types';

interface Props { onClose: () => void; }

export default function AddPatientModal({ onClose }: Props) {
  const { lang, addPatient } = useAppStore();
  const [form, setForm] = useState({
    name: '', nameAr: '', age: '', gender: 'Male',
    bloodType: 'O+', phone: '', email: '',
    address: '', addressAr: '', conditions: '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    const patient: Omit<Patient, 'id'> = {
      name: form.name,
      nameAr: form.nameAr || form.name,
      age: parseInt(form.age) || 0,
      gender: form.gender as 'Male' | 'Female',
      bloodType: form.bloodType,
      phone: form.phone,
      email: form.email,
      address: form.address,
      addressAr: form.addressAr || form.address,
      status: 'Active',
      lastVisit: new Date().toISOString().split('T')[0],
      conditions: form.conditions ? form.conditions.split(',').map((c) => c.trim()) : [],
      conditionsAr: [],
      avatar: form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: 'bg-primary-600',
    };
    addPatient(patient);
    onClose();
  };

  return (
    <Modal
      title={tr('addPatient', lang)}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>{tr('close', lang)}</button>
          <button className="btn-primary" onClick={handleSave}>{tr('savePatient', lang)}</button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{tr('fullName', lang)} (EN)</label>
          <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label className="form-label">{tr('fullName', lang)} (AR)</label>
          <input className="form-input" value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} placeholder="الاسم بالعربي" dir="rtl" />
        </div>
        <div>
          <label className="form-label">{tr('dateOfBirth', lang)}</label>
          <input type="date" className="form-input" />
        </div>
        <div>
          <label className="form-label">{tr('age', lang)}</label>
          <input type="number" className="form-input" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="30" />
        </div>
        <div>
          <label className="form-label">{tr('gender', lang)}</label>
          <select className="form-input" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
            <option value="Male">{tr('male', lang)}</option>
            <option value="Female">{tr('female', lang)}</option>
          </select>
        </div>
        <div>
          <label className="form-label">{tr('bloodType', lang)}</label>
          <select className="form-input" value={form.bloodType} onChange={(e) => set('bloodType', e.target.value)}>
            {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">{tr('phone', lang)}</label>
          <input className="form-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+966 5X XXX XXXX" />
        </div>
        <div>
          <label className="form-label">{tr('email', lang)}</label>
          <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">{tr('address', lang)}</label>
          <input className="form-input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, City" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">{tr('conditions', lang)}</label>
          <input className="form-input" value={form.conditions} onChange={(e) => set('conditions', e.target.value)} placeholder="Diabetes, Hypertension (comma separated)" />
        </div>
      </div>
    </Modal>
  );
}
