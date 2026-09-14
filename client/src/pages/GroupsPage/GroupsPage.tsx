import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Receipt } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import type { GroupInfo } from '@shared/api.interface';

const GroupsPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的群组</h1>
            <p className="text-slate-500 mt-1">管理你的记账群组，多人共用一目了然</p>
          </div>
          <button
            onClick={() => navigate('/groups/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            创建群组
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">加载中...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Users size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">还没有群组</h3>
            <p className="text-slate-500 mb-6">创建一个群组，和朋友一起记账吧</p>
            <button
              onClick={() => navigate('/groups/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              创建第一个群组
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 truncate flex-1">
                    {group.name}
                  </h3>
                  <Receipt size={18} className="text-blue-500 flex-shrink-0 ml-2" />
                </div>
                {group.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Users size={14} />
                    <span>{group.memberCount} 人</span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    ¥{group.totalAmount || '0.00'}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  {group.expenseCount} 笔账目
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
