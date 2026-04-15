import { Bell, Menu, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import Avatar from '../ui/Avatar';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { currentUser, lang, toggleLang, setSidebarOpen, sidebarOpen } = useAppStore();
  if (!currentUser) return null;

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
          <p className="text-xs text-slate-400 hidden sm:block">
            ClinicOS › {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Globe size={13} />
          {lang === 'ar' ? 'EN' : 'ع'}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Bell size={16} />
          </button>
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 ps-2 border-s border-slate-200">
          <Avatar code={currentUser.avatar} colorClass={currentUser.avatarColor} size="sm" />
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-700 leading-none">
              {lang === 'ar' ? currentUser.nameAr : currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{tr(currentUser.role.toLowerCase(), lang)}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
