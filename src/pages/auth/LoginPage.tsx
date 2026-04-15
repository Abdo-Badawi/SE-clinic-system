import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Globe, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { MOCK_USERS } from '../../data/mockData';
import type { Role } from '../../types';
import clsx from 'clsx';

const ROLES: { key: Role; icon: string; color: string }[] = [
  { key: 'ADMIN',    icon: '👨‍⚕️', color: 'border-primary-400 bg-primary-50 text-primary-700' },
  { key: 'DOCTOR',   icon: '🩺',  color: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  { key: 'EMPLOYEE', icon: '📋',  color: 'border-amber-400 bg-amber-50 text-amber-700' },
  { key: 'PATIENT',  icon: '👤',  color: 'border-rose-400 bg-rose-50 text-rose-700' },
];

const FEATURES = [
  { icon: '📅', key: 'appointments' },
  { icon: '👥', key: 'patients' },
  { icon: '📋', key: 'medicalHistory' },
  { icon: '📊', key: 'dashboard' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginDirect, lang, toggleLang } = useAppStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Role>('ADMIN');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleLogin = () => {
    const ok = login(email, pass, role);
    if (ok) navigate('/dashboard');
    else setError(tr('invalidCreds', lang));
  };

  const handleDemo = (user: typeof MOCK_USERS[0]) => {
    loginDirect(user);
    navigate('/dashboard');
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regPass) return;
    loginDirect({
      id: Date.now(),
      name: regName,
      nameAr: regName,
      email: regEmail,
      password: regPass,
      role: 'PATIENT',
      avatar: regName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: 'bg-rose-500',
    });
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 items-center justify-center px-12 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Main illustration */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-32 h-32 bg-primary-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-1 ring-primary-400/30">
            <div className="w-20 h-20 bg-primary-600/40 rounded-2xl flex items-center justify-center">
              <Stethoscope size={40} className="text-primary-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">ClinicOS</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {lang === 'ar'
              ? 'نظام إدارة عيادة طبية متكامل لعيادة الطبيب الواحد. أدِر المرضى والمواعيد والسجلات الطبية بكل سهولة.'
              : 'A complete clinic management system for single-doctor clinics. Manage patients, appointments, and records effortlessly.'}
          </p>

          <div className="mt-8 space-y-3 text-start">
            {FEATURES.map((f) => (
              <div key={f.key} className="flex items-center gap-3 text-slate-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-base flex-shrink-0">
                  {f.icon}
                </div>
                {tr(f.key, lang)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[480px] flex flex-col bg-white">
        {/* top bar */}
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm text-slate-800">ClinicOS</span>
          </div>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Globe size={12} />
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm">
            {tab === 'login' ? (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{tr('welcomeBack', lang)}</h1>
                <p className="text-sm text-slate-400 mb-6">{tr('signInDesc', lang)}</p>

                {/* Role selector */}
                <div className="mb-5">
                  <label className="form-label">{tr('selectRole', lang)}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => setRole(r.key)}
                        className={clsx(
                          'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-center',
                          role === r.key ? r.color : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        )}
                      >
                        <span className="text-xl">{r.icon}</span>
                        <span className="text-xs font-semibold">{tr(r.key.toLowerCase(), lang)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="form-label">{tr('emailAddress', lang)}</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">{tr('password', lang)}</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input pe-10"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    {tr('rememberMe', lang)}
                  </label>
                  <span className="text-primary-600 font-medium cursor-pointer hover:underline">
                    {tr('forgotPassword', lang)}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button className="btn-primary w-full justify-center py-2.5 text-sm" onClick={handleLogin}>
                  {tr('signIn', lang)} →
                </button>

                {/* Quick demo */}
                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {tr('quickDemo', lang)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_USERS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleDemo(u)}
                        className="btn-secondary justify-center text-xs py-2"
                      >
                        {ROLES.find((r) => r.key === u.role)?.icon} {tr(u.role.toLowerCase(), lang)}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-sm text-slate-400 mt-5">
                  {tr('noAccount', lang)}{' '}
                  <span className="text-primary-600 font-semibold cursor-pointer hover:underline" onClick={() => setTab('register')}>
                    {tr('registerHere', lang)}
                  </span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{tr('createAccount', lang)}</h1>
                <p className="text-sm text-slate-400 mb-6">{lang === 'ar' ? 'سجّل كمريض جديد' : 'Register as a new patient'}</p>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="form-label">{tr('fullName', lang)}</label>
                    <input className="form-input" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'} />
                  </div>
                  <div>
                    <label className="form-label">{tr('emailAddress', lang)}</label>
                    <input type="email" className="form-input" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">{tr('password', lang)}</label>
                    <input type="password" className="form-input" value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                  </div>
                </div>

                <button className="btn-primary w-full justify-center py-2.5 text-sm" onClick={handleRegister}>
                  {tr('createAccount', lang)} →
                </button>

                <p className="text-center text-sm text-slate-400 mt-5">
                  {tr('alreadyAccount', lang)}{' '}
                  <span className="text-primary-600 font-semibold cursor-pointer hover:underline" onClick={() => setTab('login')}>
                    {tr('signInLink', lang)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
