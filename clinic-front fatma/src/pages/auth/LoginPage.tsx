import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Globe, Eye, EyeOff, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import { selfRegisterApi } from '../../api/authService';
import clsx from 'clsx';

type RoleKey = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

// Visual role tiles — role is determined by backend JWT, tiles are UI-only hints
const ROLES: { key: RoleKey; icon: string; color: string }[] = [
  { key: 'ADMIN',        icon: '👨‍⚕️', color: 'border-primary-400 bg-primary-50 text-primary-700' },
  { key: 'DOCTOR',       icon: '🩺',  color: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  { key: 'RECEPTIONIST', icon: '📋',  color: 'border-amber-400 bg-amber-50 text-amber-700' },
  { key: 'PATIENT',      icon: '👤',  color: 'border-rose-400 bg-rose-50 text-rose-700' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials, lang, toggleLang } = useAppStore();

  const [tab,          setTab]          = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<RoleKey>('ADMIN'); // visual only
  const [email,        setEmail]        = useState('');
  const [pass,         setPass]         = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const [regFullName, setRegFullName] = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPass,     setRegPass]     = useState('');
  const [regError,    setRegError]    = useState('');
  const [regLoading,  setRegLoading]  = useState(false);

  // POST /api/auth/login
  const handleLogin = async () => {
    if (!email || !pass) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد وكلمة المرور.' : 'Please enter email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await loginWithCredentials(email, pass);
    setLoading(false);
    if (result.ok) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? tr('invalidCreds', lang));
    }
  };

  // POST /api/auth/register  (patient self-register: { email, password, fullName })
  const handleRegister = async () => {
    if (!regFullName || !regEmail || !regPass) {
      setRegError(lang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Please fill in all fields.');
      return;
    }
    setRegLoading(true);
    setRegError('');
    try {
      await selfRegisterApi({ fullName: regFullName, email: regEmail, password: regPass });
      // Auto login after register
      const result = await loginWithCredentials(regEmail, regPass);
      if (result.ok) navigate('/dashboard');
      else { setTab('login'); setEmail(regEmail); }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : lang === 'ar' ? 'فشل التسجيل.' : 'Registration failed.');
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-28 h-28 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-400/30">
            <div className="w-20 h-20 bg-blue-600/40 rounded-2xl flex items-center justify-center p-4">
              <Stethoscope size={44} className="text-blue-300" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">ClinicOS</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {lang === 'ar'
              ? 'نظام إدارة عيادة طبية متكامل — مواعيد، مرضى، سجلات طبية.'
              : 'Complete clinic management — appointments, patients, medical records.'}
          </p>
          <div className="mt-8 space-y-3 text-left rtl:text-right">
            {['📅 ' + tr('appointments', lang), '👥 ' + tr('patients', lang),
              '📋 ' + tr('medicalHistory', lang), '📊 ' + tr('dashboard', lang)
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-base">
                  {item.split(' ')[0]}
                </div>
                <span>{item.substring(item.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-[480px] flex flex-col bg-white min-h-screen">
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
            <Globe size={12} /> {lang === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm">
            {tab === 'login' ? (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{tr('welcomeBack', lang)}</h1>
                <p className="text-sm text-slate-400 mb-6">{tr('signInDesc', lang)}</p>

                {/* Role tiles — visual only */}
                <div className="mb-5">
                  <label className="form-label">{tr('selectRole', lang)}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setSelectedRole(r.key)}
                        className={clsx(
                          'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-center',
                          selectedRole === r.key ? r.color : 'border-slate-200 text-slate-500 hover:border-slate-300'
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
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="form-label">{tr('password', lang)}</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input pr-10"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
                )}

                <button
                  type="button"
                  className="btn-primary w-full justify-center py-2.5 text-sm"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading
                    ? <><Loader size={14} className="animate-spin" /> {lang === 'ar' ? 'جارٍ الدخول...' : 'Signing in...'}</>
                    : <>{tr('signIn', lang)} →</>}
                </button>

                {/* Demo credentials hint */}
                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {lang === 'ar' ? 'بيانات تجريبية' : 'Demo credentials'}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { role: 'Admin',        email: 'admin@clinic.com',    pass: 'password123' },
                      { role: 'Doctor',       email: 'doctor@clinic.com',   pass: 'password123' },
                      { role: 'Receptionist', email: 'reception@clinic.com',pass: 'password123' },
                      { role: 'Patient',      email: 'patient@clinic.com',  pass: 'password123' },
                    ].map((d) => (
                      <button
                        key={d.role}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-between gap-2"
                        onClick={() => { setEmail(d.email); setPass(d.pass); }}
                      >
                        <span className="font-semibold text-slate-600">{d.role}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{d.email}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    {lang === 'ar' ? 'انقر لملء البيانات تلقائياً' : 'Click to auto-fill'}
                  </p>
                </div>

                <p className="text-center text-sm text-slate-400 mt-5">
                  {tr('noAccount', lang)}{' '}
                  <button type="button" className="text-primary-600 font-semibold hover:underline" onClick={() => setTab('register')}>
                    {tr('registerHere', lang)}
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{tr('createAccount', lang)}</h1>
                <p className="text-sm text-slate-400 mb-6">
                  {lang === 'ar' ? 'سجّل كمريض جديد في العيادة' : 'Register as a new patient'}
                </p>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="form-label">{tr('fullName', lang)}</label>
                    <input
                      className="form-input"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'}
                    />
                  </div>
                  <div>
                    <label className="form-label">{tr('emailAddress', lang)}</label>
                    <input type="email" className="form-input" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="form-label">{tr('password', lang)}</label>
                    <input type="password" className="form-input" value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                  </div>
                </div>

                {regError && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{regError}</div>
                )}

                <button
                  type="button"
                  className="btn-primary w-full justify-center py-2.5 text-sm"
                  onClick={handleRegister}
                  disabled={regLoading}
                >
                  {regLoading
                    ? <><Loader size={14} className="animate-spin" /> {lang === 'ar' ? 'جارٍ التسجيل...' : 'Registering...'}</>
                    : <>{tr('createAccount', lang)} →</>}
                </button>

                <p className="text-center text-sm text-slate-400 mt-5">
                  {tr('alreadyAccount', lang)}{' '}
                  <button type="button" className="text-primary-600 font-semibold hover:underline" onClick={() => setTab('login')}>
                    {tr('signInLink', lang)}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
