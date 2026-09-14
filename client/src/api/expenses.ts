import type { ExpenseInfo, CreateExpenseInput } from '@shared/api.interface';

const BASE_URL = '/api';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || `请求失败 (${res.status})`);
  }

  return res.json() as Promise<T>;
};

export const getExpenses = (params: { groupId: string; category?: string }) => {
  const query = params.category ? `?category=${encodeURIComponent(params.category)}` : '';
  return request<{ items: ExpenseInfo[]; total: number }>(
    `/groups/${params.groupId}/expenses${query}`,
  );
};

export const getExpenseDetail = (groupId: string, expenseId: string) =>
  request<ExpenseInfo>(`/groups/${groupId}/expenses/${expenseId}`);

export const createExpense = (groupId: string, body: CreateExpenseInput) =>
  request<ExpenseInfo>(`/groups/${groupId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateExpense = (
  groupId: string,
  expenseId: string,
  body: CreateExpenseInput,
) =>
  request<ExpenseInfo>(`/groups/${groupId}/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const deleteExpense = (groupId: string, expenseId: string) =>
  request(`/groups/${groupId}/expenses/${expenseId}`, {
    method: 'DELETE',
  });
