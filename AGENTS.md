# 多人共用记账+分账应用

## 应用概述
一个多人共用的记账与分账全端应用，支持创建群组、成员管理、记账、自动分账结算。

## 技术架构

### 后端模块
- `groups` - 群组管理模块
- `expenses` - 记账模块
- `settlements` - 分账结算模块

### 前端页面
- `/` - 群组列表页（首页）
- `/groups/:id` - 群组详情页（含账目列表、分账结算）
- `/groups/:id/expenses/new` - 新增账目
- `/groups/:id/expenses/:expenseId/edit` - 编辑账目
- `/groups/:id/settlement` - 分账结算详情

### 数据库表设计
- `groups` - 群组表
- `group_members` - 群组成员关联表
- `expenses` - 账目表
- `expense_splits` - 账目分摊明细（可选，用于非均摊场景）

## 设计规范

### 色彩系统
- 主色：蓝色系（`hsl(221 83% 53%)`），代表信任与财务
- 成功色：绿色（应收）
- 警告色：红色（应付）
- 背景：浅灰白，卡片纯白

### 排版
- 标题：text-xl font-semibold
- 副标题：text-base font-medium
- 正文：text-sm
- 辅助文字：text-xs text-muted-foreground

### 间距
- 页面边距：p-6
- 卡片内边距：p-4
- 元素间距：gap-3 / gap-4

### 布局
- 左侧边栏导航（群组列表）+ 右侧主内容区
- 移动端：顶部导航 + 内容区堆叠
- 卡片式布局，圆角 lg，轻微阴影
