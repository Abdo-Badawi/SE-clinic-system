import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';

const pageTitles: Record<string, string> = {
  '/dashboard':        'dashboard',
  '/patients':         'patients',
  '/appointments':     'appointments',
  '/records':          'medicalHistory',
  '/users':            'userAccounts',
  '/my-dashboard':     'myDashboard',
  '/my-appointments':  'myAppointments',
  '/my-records':       'myRecords',
  '/pending':          'pendingApprovals',
};

export default function AppLayout() {
  const { lang } = useAppStore();
  const location = useLocation();
  const titleKey = pageTitles[location.pathname] || 'dashboard';
  const title = tr(titleKey, lang);

  return (
    <div className={`flex h-screen overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ms-64">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 lg:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
