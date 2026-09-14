import { useParams } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle, ArrowRight, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

import * as api from '@client/src/api';
import type { GroupDetail, SettlementResponse } from '@shared/api.interface';

const SettlementPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId]);

  const loadData = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const [groupData, settlementData] = await Promise.all([
        api.groups.getGroupDetail(groupId),
        api.settlements.getSettlement(groupId),
      ]);
      setGroup(groupData);
      setSettlement(settlementData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getMemberLabel = (userId: string) => {
    const member = settlement?.members.find((m) => m.userId === userId);
    return member?.nickname || userId;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">加载中...</div>;
  }

  if (!settlement) {
    return <div className="p-8 text-center text-slate-400">加载失败</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">分账结算</h1>
          <p className="text-sm text-slate-500 mt-1">
            共 {settlement.expenseCount} 笔账目，总支出 ¥{settlement.totalAmount}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-slate-500" />
              收支明细
            </h2>
            <div className="space-y-3">
              {settlement.members.map((member) => {
                const balance = Number(member.balance);
                const isPositive = balance > 0.001;
                const isNegative = balance < -0.001;
                return (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="font-medium text-slate-700">
                      {member.nickname || member.userId}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">
                        已付 ¥{member.paid} · 应摊 ¥{member.shouldPay}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-0.5 flex items-center justify-end gap-1 ${
                          isPositive
                            ? 'text-green-600'
                            : isNegative
                              ? 'text-red-500'
                              : 'text-slate-400'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownCircle size={14} />
                        ) : isNegative ? (
                          <ArrowUpCircle size={14} />
                        ) : null}
                        {isPositive
                          ? `应收 ¥${Math.abs(balance).toFixed(2)}`
                          : isNegative
                            ? `应付 ¥${Math.abs(balance).toFixed(2)}`
                            : '已结清'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowRight size={18} className="text-slate-500" />
              转账建议
              <span className="text-xs font-normal text-slate-400 ml-auto">
                最少 {settlement.transfers.length} 次转账
              </span>
            </h2>
            {settlement.transfers.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownCircle
                    size={24}
                    className="text-green-600"
                  />
                </div>
                <p>所有账目已结清，无需转账</p>
              </div>
            ) : (
              <div className="space-y-3">
                {settlement.transfers.map((transfer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1 text-right">
                      <span className="font-medium text-slate-700">
                        {getMemberLabel(transfer.fromUserId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>支付</span>
                      <ArrowRight size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-700">
                        {getMemberLabel(transfer.toUserId)}
                      </span>
                    </div>
                    <div className="text-right font-semibold text-slate-800">
                      ¥{transfer.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">结算说明</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>系统自动计算每人应分摊金额，并生成最少转账次数的结算方案</li>
            <li>「已付」是你作为付款人支付的总金额</li>
            <li>「应摊」是你参与的账目按均摊计算应承担的金额</li>
            <li>余额为正表示你应收钱，为负表示你应付钱</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettlementPage;
