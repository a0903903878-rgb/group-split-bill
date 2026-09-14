import { Injectable } from '@nestjs/common';

interface ExpenseRecord {
  id: string;
  groupId: string;
  title: string;
  amount: string;
  payerId: string;
  participants: string[];
}

interface MemberRecord {
  id: string;
  groupId: string;
  userId: string;
  nickname?: string;
  role: string;
}

interface BalanceEntry {
  userId: string;
  nickname?: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

const expensesStore: ExpenseRecord[] = [];
const membersStore: MemberRecord[] = [];

@Injectable()
export class SettlementsService {
  async calculate(groupId: string, userId: string) {
    const members = membersStore.filter((m) => m.groupId === groupId);
    if (members.length === 0) throw new Error('群组不存在');
    if (!members.some((m) => m.userId === userId)) throw new Error('无权访问该群组');

    const groupExpenses = expensesStore.filter((e) => e.groupId === groupId);
    const balances = this.computeBalances(members, groupExpenses);
    const transfers = this.calculateTransfers(balances);

    return {
      groupId,
      expenseCount: groupExpenses.length,
      totalAmount: groupExpenses
        .reduce((sum, e) => sum + Number(e.amount), 0)
        .toFixed(2),
      members: balances.map((b) => ({
        userId: b.userId,
        nickname: b.nickname,
        paid: b.paid.toFixed(2),
        shouldPay: b.shouldPay.toFixed(2),
        balance: b.balance.toFixed(2),
      })),
      transfers,
    };
  }

  private computeBalances(members: MemberRecord[], expenses: ExpenseRecord[]): BalanceEntry[] {
    const map = new Map<string, BalanceEntry>();
    members.forEach((m) =>
      map.set(m.userId, {
        userId: m.userId,
        nickname: m.nickname,
        paid: 0,
        shouldPay: 0,
        balance: 0,
      }),
    );

    expenses.forEach((expense) => {
      const amount = Number(expense.amount);
      const entry = map.get(expense.payerId);
      if (entry) entry.paid += amount;

      const share = amount / expense.participants.length;
      expense.participants.forEach((pid) => {
        const e = map.get(pid);
        if (e) e.shouldPay += share;
      });
    });

    map.forEach((entry) => {
      entry.balance = Math.round((entry.paid - entry.shouldPay) * 100) / 100;
    });

    return Array.from(map.values());
  }

  private calculateTransfers(balances: BalanceEntry[]) {
    const creditors = balances
      .filter((b) => b.balance > 0.001)
      .sort((a, b) => b.balance - a.balance);
    const debtors = balances
      .filter((b) => b.balance < -0.001)
      .sort((a, b) => a.balance - b.balance);

    const transfers: { fromUserId: string; toUserId: string; amount: string }[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const debt = -debtor.balance;
      const credit = creditor.balance;
      const amount = Math.min(debt, credit);

      if (amount > 0.001) {
        transfers.push({
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amount: amount.toFixed(2),
        });
        debtor.balance += amount;
        creditor.balance -= amount;
      }

      if (Math.abs(debtor.balance) < 0.001) i += 1;
      if (Math.abs(creditor.balance) < 0.001) j += 1;
    }

    return transfers;
  }
}
