import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, FileText, UserCog,
  LogOut, X, Stethoscope, ClipboardList, CheckSquare,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import Avatar from '../ui/Avatar';
import type { Role } from '../../types';

interface NavItem {
  labelKey: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'dashboard',      icon: <LayoutDashboard size={18} />, path: '/dashboard',    roles: ['ADMIN','DOCTOR','EMPLOYEE','PATIENT'] },
  { labelKey: 'myDashboard',    icon: <LayoutDashboard size={18} />, path: '/my-dashboard', roles: [] }, // alias handled below
  { labelKey: 'patients',       icon: <Users size={18} />,           path: '/patients',     roles: ['ADMIN','DOCTOR','EMPLOYEE'] },
  { labelKey: 'appointments',   icon: <Calendar size={18} />,        path: '/appointments', roles: ['ADMIN','DOCTOR','EMPLOYEE'] },
  { labelKey: 'myAppointments', icon: <Calendar size={18} />,        path: '/my-appointments', roles: ['PATIENT'] },
  { labelKey: 'medicalHistory', icon: <FileText size={18} />,        path: '/records',      roles: ['ADMIN','DOCTOR'] },
  { labelKey: 'myRecords',      icon: <FileText size={18} />,        path: '/my-records',   roles: ['PATIENT'] },
  { labelKey: 'pendingApprovals', icon: <CheckSquare size={18} />,   path: '/pending',      roles: ['EMPLOYEE'] },
  { labelKey: 'userAccounts',   icon: <UserCog size={18} />,         path: '/users',        roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { currentUser, logout, lang, sidebarOpen, setSidebarOpen } = useAppStore();
  if (!currentUser) return null;

  const role = currentUser.role;
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.roles.includes(role) && item.labelKey !== 'myDashboard'
  );

  // Replace dashboard key for patients
  const finalItems = visibleItems.map((item) =>
    item.path === '/dashboard' && role === 'PATIENT'
      ? { ...item, labelKey: 'myDashboard' }
      : item
  );

  const roleLabel = {
    ADMIN: tr('administrator', lang),
    DOCTOR: tr('physician', lang),
    EMPLOYEE: tr('secretary', lang),
    PATIENT: tr('patient', lang),
  }[role];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 start-0 h-full z-50 w-64 bg-slate-900 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          lang === 'ar' && 'rtl'
        )}
        style={lang === 'ar' ? { right: 'auto', left: 0 } : {}}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <Stethoscope size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">ClinicOS</div>
                <div className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-wider">
                  {tr('clinicDesc', lang)}
                </div>
              </div>
            </div>
            <button
              className="lg:hidden w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          {/* Role badge */}
          <div className="mt-4 bg-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                {tr('loggedInAs', lang)}
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">{roleLabel}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
          {finalItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {!isActive && (
                    <span className="absolute start-0 top-1/4 h-1/2 w-0.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-50 transition-opacity" />
                  )}
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{tr(item.labelKey, lang)}</span>
                  {item.badge && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar
              code={currentUser.avatar}
              colorClass={currentUser.avatarColor}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {lang === 'ar' ? currentUser.nameAr : currentUser.name}
              </div>
              <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
            </div>
            <button
              onClick={logout}
              title={tr('logout', lang)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-900/40 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
