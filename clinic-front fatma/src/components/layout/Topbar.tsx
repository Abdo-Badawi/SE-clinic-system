import { Bell, Menu, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';

interface TopbarProps { title: string; }

export default function Topbar({ title }: TopbarProps) {
  const { currentUser, lang, toggleLang, setSidebarOpen, sidebarOpen } = useAppStore();
  if (!currentUser) return null;

  const roleLabel = {
    ADMIN:        tr('administrator', lang),
    DOCTOR:       tr('physician', lang),
    RECEPTIONIST: tr('receptionist', lang),
    PATIENT:      tr('patient', lang),
  }[currentUser.role] || currentUser.role;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">ClinicOS › {title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Globe size={13} />
          {lang === 'ar' ? 'EN' : 'ع'}
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div
            className={`w-9 h-9 rounded-xl ${currentUser.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {currentUser.avatar}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-700 leading-none">{currentUser.fullName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{roleLabel}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
