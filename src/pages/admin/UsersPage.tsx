import { Plus, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import { MOCK_USERS } from '../../data/mockData';

const ROLE_BADGE: Record<string, string> = {
  ADMIN:    'badge-blue',
  DOCTOR:   'badge-green',
  EMPLOYEE: 'badge-amber',
  PATIENT:  'badge-gray',
};

export default function UsersPage() {
  const { lang } = useAppStore();

  return (
    <div>
      <PageHeader
        title={tr('userAccounts', lang)}
        subtitle={`${MOCK_USERS.length} ${lang === 'ar' ? 'مستخدم' : 'users'}`}
        action={
          <button className="btn-primary">
            <Plus size={16} /> {tr('addUser', lang)}
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                <th className="table-th">{tr('email', lang)}</th>
                <th className="table-th">{tr('role', lang)}</th>
                <th className="table-th">{tr('actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <Avatar code={u.avatar} colorClass={u.avatarColor} size="sm" />
                      <div className="font-semibold text-slate-800">
                        {lang === 'ar' ? u.nameAr : u.name}
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-sm">{u.email}</td>
                  <td className="table-td">
                    <span className={ROLE_BADGE[u.role]}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
                      {tr(u.role.toLowerCase(), lang)}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button className="btn-ghost p-1.5"><Edit size={14} /></button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
