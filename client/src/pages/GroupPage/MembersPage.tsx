import { useParams, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import type { GroupDetail, GroupMember } from '@shared/api.interface';
import { toast } from 'sonner';
import { showConfirm } from '@lark-apaas/client-toolkit';

const MembersPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  const loadGroup = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const data = await api.groups.getGroupDetail(groupId);
      setGroup(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!groupId || !newUserId.trim()) return;
    setAdding(true);
    try {
      await api.groups.addMember(groupId, {
        userId: newUserId.trim(),
        nickname: newNickname.trim() || undefined,
      });
      setShowAddModal(false);
      setNewUserId('');
      setNewNickname('');
      loadGroup();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast('该用户已在群组中');
      } else {
        toast('添加失败，请重试');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!groupId) return;
    if (!await showConfirm('确定要移除该成员吗？')) return;

    try {
      await api.groups.removeMember(groupId, userId);
      loadGroup();
    } catch {
      toast('移除失败，请重试');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">加载中...</div>;
  }

  if (!group) {
    return <div className="p-8 text-center text-slate-400">群组不存在</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">成员管理</h1>
            <p className="text-sm text-slate-500 mt-1">
              共 {group.members.length} 位成员
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} />
            添加成员
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {group.members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                {(member.nickname || member.userId).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-800">
                  {member.nickname || member.userId}
                  {index === 0 && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      创建者
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  加入于 {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              {index > 0 && (
                <button
                  onClick={() => handleRemoveMember(member.userId)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="移除成员"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                添加成员
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    用户 ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    placeholder="输入用户ID"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    输入用户的妙搭用户ID来添加成员
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    昵称（可选）
                  </label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="给这位成员起个昵称"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUserId('');
                    setNewNickname('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!newUserId.trim() || adding}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {adding ? '添加中...' : '添加'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
