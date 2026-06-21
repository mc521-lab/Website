# 迁移工具箱页面为古风风格 Spec

## Why

工具箱页面仍位于 `.temp/` 旧 Next.js 项目中，需要迁移到当前 Astro 项目并使用与主页一致的古风视觉风格。为减少客户端加载压力，简单页面优先使用 Astro 原生实现。

## What Changes

- **新增工具箱路由**：创建 `src/pages/toolbox/` 目录结构
- **迁移工具箱首页** (`/toolbox`)：4 个工具入口，纯 Astro 实现
- **迁移护甲减伤计算器** (`/toolbox/damage-calc`)：纯计算逻辑，Astro + `<script>` 原生实现（无 React 运行时）
- **迁移换皮肤工具** (`/toolbox/skindrop`)：多步骤文件上传 + 3D 预览，React island 实现
- **抛弃不迁移**：工单系统 (`/toolbox/jira`) 和正版验证 (`/toolbox/genuine-title`) 暂不迁移
- **新增共享导航栏**：每个工具箱子页面顶部有古风导航栏（返回主页、页面标题、主题切换）
- **安装依赖**：`skinview3d` 用于 3D 皮肤预览
- **BREAKING**：不再使用像素字体 `FusionPixel` 和旧 `pixel-font` 样式；改用古风字体栈

## Impact

- Affected code: 新增 `src/pages/toolbox/*.astro`、`src/components/toolbox/*.tsx`、修改 `package.json`
- 路由结构：`/toolbox`、`/toolbox/damage-calc`、`/toolbox/skindrop`
- 不迁移 `/toolbox/jira` 和 `/toolbox/genuine-title`，旧代码保留在 `.temp/`

## ADDED Requirements

### Requirement: 工具箱首页

系统 SHALL 提供 `/toolbox` 路由，作为工具箱入口页。

#### Scenario: 页面内容

- **WHEN** 用户访问 `/toolbox`
- **THEN** 页面展示 4 个工具入口卡片（护甲减伤计算器、换皮肤工具），每个卡片含工具名称和简短描述
- **THEN** 点击卡片跳转到对应子页面

#### Scenario: 古风风格

- **WHEN** 页面渲染
- **THEN** 使用 `.gufeng-paper` 宣纸纹理背景，标题用楷书字体，卡片用 `.gufeng-card` 样式

### Requirement: 护甲减伤计算器

系统 SHALL 提供 `/toolbox/damage-calc` 路由，实现 Minecraft 护甲减伤计算功能。

#### Scenario: 计算功能

- **WHEN** 用户调整原始伤害、防御减伤、护甲数值、盔甲韧性、附魔系数
- **THEN** 实时显示实际伤害计算结果
- **THEN** 使用与原页面相同的 `armorDamageReduction` 算法

#### Scenario: 技术实现

- **WHEN** 页面加载
- **THEN** 不使用 React 客户端组件，用 Astro + 原生 `<script>` + HTML input[type="range"] 实现
- **THEN** 减少客户端 JS 加载量

#### Scenario: 参考链接

- **WHEN** 页面渲染
- **THEN** 提供指向 Minecraft Wiki 护甲机制页面的外部链接

### Requirement: 换皮肤工具

系统 SHALL 提供 `/toolbox/skindrop` 路由，实现 Minecraft 皮肤上传和预览功能。

#### Scenario: 多步骤流程

- **WHEN** 用户访问页面
- **THEN** 进入步骤 1：可选择上传皮肤文件或输入 NameMC URL
- **WHEN** 用户完成步骤 1
- **THEN** 进入步骤 2：显示 3D 皮肤预览，要求输入玩家名
- **WHEN** 用户确认玩家名
- **THEN** 进入步骤 3：自动上传到服务器
- **WHEN** 上传完成
- **THEN** 进入步骤 4：显示成功/失败结果，提供复制命令按钮

#### Scenario: 3D 预览

- **WHEN** 用户进入步骤 2
- **THEN** 使用 `skinview3d` 库在 canvas 上渲染 3D 皮肤预览
- **THEN** 预览带有 WalkingAnimation 行走动画

#### Scenario: API 调用

- **WHEN** 用户输入 NameMC URL
- **THEN** 调用 `/api/skindrop/download/:id` 获取皮肤图片
- **WHEN** 用户确认上传
- **THEN** 调用 `/api/skindrop/upload/:filename` 上传皮肤文件

### Requirement: 共享古风导航栏

系统 SHALL 为所有工具箱子页面提供统一的古风导航栏。

#### Scenario: 导航栏内容

- **WHEN** 用户访问任何工具箱子页面
- **THEN** 页面顶部显示导航栏，包含：返回主页链接（←）、当前页面标题（楷书字体）、明暗主题切换按钮

#### Scenario: 风格一致性

- **WHEN** 导航栏渲染
- **THEN** 使用与主页相同的古风样式（宣纸/水墨色板、楷书字体）

### Requirement: 依赖安装

系统 SHALL 安装 `skinview3d` 依赖以支持 3D 皮肤预览。

#### Scenario: 安装验证

- **WHEN** 运行 `pnpm add skinview3d`
- **THEN** 依赖正确安装并可在 React 组件中导入使用

## REMOVED Requirements

### Requirement: 工单系统

**Reason**：暂不迁移，旧代码保留在 `.temp/app/(frontend-user-external)/toolbox/jira/page.tsx`
**Migration**：后续如需迁移，需重建 DataTable 组件或简化实现

### Requirement: 正版验证

**Reason**：暂不迁移，旧代码保留在 `.temp/app/(frontend-user-external)/toolbox/genuine-title/page.tsx`
**Migration**：后续如需迁移，需重建 ZhengbanSlice 组件
