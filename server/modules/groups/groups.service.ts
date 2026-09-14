import { Injectable } from '@nestjs/common';

interface GroupRecord {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface MemberRecord {
  id: string;
  groupId: string;
  userId: string;
  nickname?: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

const groupsStore: GroupRecord[] = [];
const membersStore: MemberRecord[] = [];

const newId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

@Injectable()
export class GroupsService {
  async getGroups(userId: string) {
    const myGroups = membersStore
      .filter((m) => m.userId === userId)
      .map((m) => m.groupId);

    return groupsStore
      .filter((g) => myGroups.includes(g.id))
      .map((g) => ({
        ...g,
        memberCount: membersStore.filter((m) => m.groupId === g.id).length,
      }));
  }

  async getGroupDetail(id: string, userId: string) {
    const group = groupsStore.find((g) => g.id === id);
    if (!group) {
      throw new Error('群组不存在');
    }

    const isMember = membersStore.some((m) => m.groupId === id && m.userId === userId);
    if (!isMember) {
      throw new Error('无权访问该群组');
    }

    return {
      ...group,
      members: membersStore.filter((m) => m.groupId === id),
    };
  }

  async createGroup(body: { name: string; description?: string }, userId: string) {
    const now = new Date().toISOString();
    const group: GroupRecord = {
      id: newId(),
      name: body.name,
      description: body.description,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    groupsStore.push(group);

    membersStore.push({
      id: newId(),
      groupId: group.id,
      userId,
      nickname: '创建者',
      role: 'owner',
      joinedAt: now,
    });

    return group;
  }

  async addMember(
    id: string,
    body: { userId: string; nickname?: string },
    requesterId: string,
  ) {
    const group = groupsStore.find((g) => g.id === id);
    if (!group) {
      throw new Error('群组不存在');
    }

    const isOwner = membersStore.some(
      (m) => m.groupId === id && m.userId === requesterId && m.role === 'owner',
    );
    if (!isOwner) {
      throw new Error('只有群主可以添加成员');
    }

    const exists = membersStore.some((m) => m.groupId === id && m.userId === body.userId);
    if (exists) {
      throw new Error('该用户已在群组中');
    }

    const member: MemberRecord = {
      id: newId(),
      groupId: id,
      userId: body.userId,
      nickname: body.nickname,
      role: 'member',
      joinedAt: new Date().toISOString(),
    };
    membersStore.push(member);
    return member;
  }

  async removeMember(id: string, userId: string, requesterId: string) {
    const isOwner = membersStore.some(
      (m) => m.groupId === id && m.userId === requesterId && m.role === 'owner',
    );
    if (!isOwner) {
      throw new Error('只有群主可以移除成员');
    }

    const index = membersStore.findIndex(
      (m) => m.groupId === id && m.userId === userId && m.role !== 'owner',
    );
    if (index === -1) {
      throw new Error('成员不存在或不可移除');
    }

    membersStore.splice(index, 1);
    return { success: true };
  }
}
