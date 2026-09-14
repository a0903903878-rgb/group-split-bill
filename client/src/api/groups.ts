import type { GroupDetail, GroupInfo } from '@shared/api.interface';

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

export const getGroups = () => request<GroupInfo[]>('/groups');

export const getGroupDetail = (groupId: string) =>
  request<GroupDetail>(`/groups/${groupId}`);

export const createGroup = (body: { name: string; description?: string }) =>
  request<GroupInfo>('/groups', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const addMember = (
  groupId: string,
  body: { userId: string; nickname?: string },
) =>
  request(`/groups/${groupId}/members`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const removeMember = (groupId: string, userId: string) =>
  request(`/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
  });
