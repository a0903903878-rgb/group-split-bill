import { Injectable } from '@nestjs/common';

interface ExpenseRecord {
  id: string;
  groupId: string;
  title: string;
  amount: string;
  category: string;
  description?: string;
  payerId: string;
  participants: string[];
  expenseDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const expensesStore: ExpenseRecord[] = [];

const newId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

@Injectable()
export class ExpensesService {
  async getExpenses(groupId: string, userId: string, category?: string) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) throw new Error('群组不存在');
    if (!group.members.includes(userId)) throw new Error('无权访问该群组');

    let items = expensesStore.filter((e) => e.groupId === groupId);
    if (category) {
      items = items.filter((e) => e.category === category);
    }

    return {
      items: items.sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)),
      total: items.length,
    };
  }

  async getExpenseDetail(groupId: string, id: string, userId: string) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) throw new Error('群组不存在');
    if (!group.members.includes(userId)) throw new Error('无权访问该群组');

    const expense = expensesStore.find((e) => e.id === id && e.groupId === groupId);
    if (!expense) throw new Error('账目不存在');
    return expense;
  }

  async createExpense(groupId: string, body: any, userId: string) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) throw new Error('群组不存在');
    if (!group.members.includes(userId)) throw new Error('无权访问该群组');

    const now = new Date().toISOString();
    const expense: ExpenseRecord = {
      id: newId(),
      groupId,
      title: body.title,
      amount: String(Number(body.amount).toFixed(2)),
      category: body.category || 'other',
      description: body.description,
      payerId: body.payerId,
      participants: body.participants || [],
      expenseDate: body.expenseDate || now,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    expensesStore.push(expense);
    return expense;
  }

  async updateExpense(groupId: string, id: string, body: any, userId: string) {
    const expense = expensesStore.find((e) => e.id === id && e.groupId === groupId);
    if (!expense) throw new Error('账目不存在');
    if (expense.createdBy !== userId) throw new Error('只有记账人可以编辑');

    expense.title = body.title ?? expense.title;
    expense.amount = body.amount ? String(Number(body.amount).toFixed(2)) : expense.amount;
    expense.category = body.category ?? expense.category;
    expense.description = body.description ?? expense.description;
    expense.payerId = body.payerId ?? expense.payerId;
    expense.participants = body.participants ?? expense.participants;
    expense.updatedAt = new Date().toISOString();
    return expense;
  }

  async deleteExpense(groupId: string, id: string, userId: string) {
    const index = expensesStore.findIndex((e) => e.id === id && e.groupId === groupId);
    if (index === -1) throw new Error('账目不存在');
    if (expensesStore[index].createdBy !== userId) throw new Error('只有记账人可以删除');

    expensesStore.splice(index, 1);
    return { success: true };
  }
}

// 内存群组（与 groups 模块共享的简化引用）
const groups: { id: string; members: string[] }[] = [];
