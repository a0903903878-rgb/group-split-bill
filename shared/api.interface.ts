export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  expenseCount: number;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  nickname?: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

export type ExpenseCategory = 'food' | 'transport' | 'utilities' | 'entertainment' | 'shopping' | 'other';

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: '餐饮',
  transport: '交通',
  utilities: '水电',
  entertainment: '娱乐',
  shopping: '购物',
  other: '其他',
};

export interface ExpenseInfo {
  id: string;
  groupId: string;
  title: string;
  amount: string;
  category: ExpenseCategory;
  description?: string;
  payerId: string;
  participants: string[];
  expenseDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: string;
  category: ExpenseCategory;
  description?: string;
  payerId: string;
  participants: string[];
}

export interface SettlementMember {
  userId: string;
  nickname?: string;
  paid: string;
  shouldPay: string;
  balance: string;
}

export interface SettlementTransfer {
  fromUserId: string;
  toUserId: string;
  amount: string;
}

export interface SettlementResponse {
  groupId: string;
  expenseCount: number;
  totalAmount: string;
  members: SettlementMember[];
  transfers: SettlementTransfer[];
}
