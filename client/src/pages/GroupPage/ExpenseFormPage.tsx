import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import { CATEGORY_LABELS } from '@shared/api.interface';
import type {
  ExpenseInfo,
  GroupDetail,
  ExpenseCategory,
} from '@shared/api.interface';
import { toast } from 'sonner';
import { showConfirm } from '@lark-apaas/client-toolkit';

interface Props {
  mode: 'create' | 'edit';
}

const ExpenseFormPage = ({ mode }: Props) => {
  const { groupId, expenseId } = useParams<{
    groupId: string;
    expenseId: string;
  }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [description, setDescription] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId, expenseId]);

  const loadData = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const groupData = await api.groups.getGroupDetail(groupId);
      setGroup(groupData);
      setPayerId(groupData.members[0]?.userId || '');
      setParticipants(groupData.members.map((m) => m.userId));

      if (mode === 'edit' && expenseId) {
        const expense = await api.expenses.getExpenseDetail(groupId, expenseId);
        setTitle(expense.title);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDescription(expense.description || '');
        setPayerId(expense.payerId);
        setParticipants(expense.participants);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleParticipant = (userId: string) => {
    setParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((u) => u !== userId)
        : [...prev, userId],
    );
  };

  const getMemberLabel = (userId: string) => {
    if (!group) return userId;
    const member = group.members.find((m) => m.userId === userId);
    return member?.nickname || '未知成员';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !title.trim() || !amount || !payerId || participants.length === 0) return;

    setSubmitting(true);
    try {
      if (mode === 'create') {
        await api.expenses.createExpense(groupId, {
          title: title.trim(),
          amount,
          category,
          description: description.trim() || undefined,
          payerId,
          participants,
        });
      } else if (expenseId) {
        await api.expenses.updateExpense(groupId, expenseId, {
          title: title.trim(),
          amount,
          category,
          description: description.trim() || undefined,
          payerId,
          participants,
        });
      }
      navigate(`/groups/${groupId}`);
    } catch {
      toast('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!groupId || !expenseId) return;
    if (!await showConfirm('确定要删除这笔账目吗？')) return;

    try {
      await api.expenses.deleteExpense(groupId, expenseId);
      navigate(`/groups/${groupId}`);
    } catch {
      toast('删除失败，请重试');
    }
  };

  const perPerson = amount && participants.length > 0
    ? (Number(amount) / participants.length).toFixed(2)
    : '0.00';

  if (loading && !group) {
    return <div className="p-8 text-center text-slate-400">加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <ArrowLeft size={18} />
          返回
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-800">
              {mode === 'create' ? '记一笔' : '编辑账目'}
            </h1>
            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="删除账目"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                用途 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：午餐、打车、电费..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                金额 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ¥
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                分类
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                谁付的钱 <span className="text-red-500">*</span>
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {group?.members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.nickname || m.userId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                参与分摊的人 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {group?.members.map((m) => (
                  <label
                    key={m.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={participants.includes(m.userId)}
                      onChange={() => toggleParticipant(m.userId)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">
                      {m.nickname || m.userId}
                    </span>
                  </label>
                ))}
              </div>
              {participants.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">
                    每人分摊：¥{perPerson}（{participants.length} 人均摊）
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                备注
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="可选，添加一些说明..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !amount || participants.length === 0 || submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormPage;
