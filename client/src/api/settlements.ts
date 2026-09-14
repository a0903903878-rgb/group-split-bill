import type { SettlementResponse } from '@shared/api.interface';

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

export const getSettlement = (groupId: string) =>
  request<SettlementResponse>(`/groups/${groupId}/settlements`);
