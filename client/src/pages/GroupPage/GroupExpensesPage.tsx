import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Utensils, Car, Zap, Gamepad2, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import { CATEGORY_LABELS } from '@shared/api.interface';
import type { ExpenseInfo, GroupDetail, ExpenseCategory } from '@shared/api.interface';

const categoryIcons: Record<ExpenseCategory, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  utilities: Zap,
  entertainment: Gamepad2,
  shopping: ShoppingBag,
  other: MoreHorizontal,
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: 'bg-orange-100 text-orange-600',
  transport: 'bg-blue-100 text-blue-600',
  utilities: 'bg-yellow-100 text-yellow-600',
  entertainment: 'bg-purple-100 text-purple-600',
  shopping: 'bg-pink-100 text-pink-600',
  other: 'bg-slate-100 text-slate-600',
};

const GroupExpensesPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [expenses, setExpenses] = useState<ExpenseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId, category]);

  const loadData = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const [groupData, expensesData] = await Promise.all([
        api.groups.getGroupDetail(groupId),
        api.expenses.getExpenses({ groupId, category: category || undefined }),
      ]);
      setGroup(groupData);
      setExpenses(expensesData.items);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getMemberLabel = (userId: string) => {
    if (!group) return userId;
    const member = group.members.find((m) => m.userId === userId);
    return member?.nickname || '未知成员';
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0,
  );

  if (loading && !group) {
    return (
      <div className="p-8 text-center text-slate-400">加载中...</div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center text-slate-400">群组不存在</div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{group.name}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {group.members.length} 位成员 · 共 ¥{totalAmount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => navigate(`/groups/${groupId}/expenses/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            记一笔
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              category === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            全部
          </button>
          {(Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <MoreHorizontal size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {category ? '该分类暂无账目' : '还没有账目'}
            </h3>
            <p className="text-slate-500 mb-6">
              点击右上角「记一笔」开始记账吧
            </p>
            <button
              onClick={() => navigate(`/groups/${groupId}/expenses/new`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              记第一笔
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {expenses.map((expense) => {
              const Icon = categoryIcons[expense.category];
              return (
                <Link
                  key={expense.id}
                  to={`/groups/${groupId}/expenses/${expense.id}/edit`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[expense.category]}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">
                      {expense.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {CATEGORY_LABELS[expense.category]} · {formatDate(expense.expenseDate)} ·{' '}
                      {getMemberLabel(expense.payerId)} 支付
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">
                      ¥{expense.amount}
                    </div>
                    <div className="text-xs text-slate-400">
                      {expense.participants.length} 人分摊
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupExpensesPage;
