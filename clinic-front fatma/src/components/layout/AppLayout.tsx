import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/dashboard':       'dashboard',
  '/patients':        'patients',
  '/appointments':    'appointments',
  '/records':         'medicalHistory',
  '/users':           'userAccounts',
  '/pending':         'pendingApprovals',
  '/my-appointments': 'myAppointments',
  '/my-records':      'myRecords',
};

export default function AppLayout() {
  const { lang } = useAppStore();
  const { pathname } = useLocation();
  const titleKey = PAGE_TITLE_KEYS[pathname] || 'dashboard';

  return (
    <div className={`flex h-screen overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Topbar title={tr(titleKey, lang)} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 lg:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
