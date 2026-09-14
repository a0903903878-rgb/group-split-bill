import { Outlet, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Users, Receipt, Calculator, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import type { GroupInfo } from '@shared/api.interface';

const SidebarLayout = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await api.groups.getGroups();
      setGroups(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const navItems = groupId
    ? [
        { path: `/groups/${groupId}`, label: '账目明细', icon: Receipt },
        { path: `/groups/${groupId}/settlement`, label: '分账结算', icon: Calculator },
        { path: `/groups/${groupId}/members`, label: '成员管理', icon: Users },
      ]
    : [];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800">记账分账</h1>
          <p className="text-xs text-slate-500 mt-1">多人共用，轻松算账</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-medium text-slate-500">我的群组</span>
            <button
              onClick={() => navigate('/groups/new')}
              className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              title="创建群组"
            >
              <Plus size={16} />
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-slate-400 px-2 py-4">加载中...</div>
          ) : groups.length === 0 ? (
            <div className="text-sm text-slate-400 px-2 py-4">暂无群组</div>
          ) : (
            <div className="space-y-1">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    groupId === group.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate">{group.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {group.memberCount} 人 · ¥{group.totalAmount || '0.00'}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>

      {groupId ? (
        <nav className="w-48 bg-white border-r border-slate-200 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 mb-2"
          >
            <ArrowLeft size={14} />
            返回群组列表
          </Link>
          <div className="border-t border-slate-100" />
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
