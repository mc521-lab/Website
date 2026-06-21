# Tasks

- [x] Task 1: 安装 skinview3d 依赖并验证
    - [x] SubTask 1.1: 运行 `pnpm add skinview3d` 安装依赖
    - [x] SubTask 1.2: 确认 skinview3d 可在项目中正常导入

- [x] Task 2: 创建共享古风导航栏组件
    - [x] SubTask 2.1: 创建 `src/components/toolbox/ToolboxNav.astro` — 古风导航栏（返回主页、页面标题、主题切换按钮）
    - [x] SubTask 2.2: 导航栏支持明暗主题切换（与主页相同的 localStorage + class toggle 逻辑）

- [x] Task 3: 迁移工具箱首页 (`/toolbox`)
    - [x] SubTask 3.1: 创建 `src/pages/toolbox/index.astro`
    - [x] SubTask 3.2: 实现 4 个工具入口卡片（护甲减伤计算器、换皮肤工具），使用 `.gufeng-card` 样式
    - [x] SubTask 3.3: 每个卡片跳转到对应子页面，使用古风按钮样式

- [x] Task 4: 迁移护甲减伤计算器 (`/toolbox/damage-calc`)
    - [x] SubTask 4.1: 创建 `src/pages/toolbox/damage-calc.astro`
    - [x] SubTask 4.2: 用原生 HTML range input + number input 实现 5 个参数调节（原始伤害、防御减伤、护甲数值、盔甲韧性、附魔系数）
    - [x] SubTask 4.3: 用 `<script>` 内联实现 `armorDamageReduction` 计算逻辑和实时结果更新
    - [x] SubTask 4.4: 添加 Minecraft Wiki 护甲机制参考链接
    - [x] SubTask 4.5: 使用 `.gufeng-card` 包裹计算区域，整体古风样式

- [x] Task 5: 迁移换皮肤工具 (`/toolbox/skindrop`)
    - [x] SubTask 5.1: 创建 `src/pages/toolbox/skindrop.astro`（Astro 页面框架）
    - [x] SubTask 5.2: 创建 `src/components/toolbox/SkinDrop.tsx`（React 客户端组件）
    - [x] SubTask 5.3: 实现步骤 1：文件上传（input[type="file"]）+ NameMC URL 输入
    - [x] SubTask 5.4: 实现步骤 2：3D 皮肤预览（skinview3d SkinViewer + WalkingAnimation）+ 玩家名输入
    - [x] SubTask 5.5: 实现步骤 3：自动上传（调用 `/api/skindrop/upload/:filename`）
    - [x] SubTask 5.6: 实现步骤 4：结果显示（成功/失败）、复制换肤命令按钮
    - [x] SubTask 5.7: 调用 `/api/skindrop/download/:id` 获取 NameMC 皮肤
    - [x] SubTask 5.8: 整体古风样式（宣纸背景、楷书标题、古风卡片）

- [x] Task 6: 验证与收尾
    - [x] SubTask 6.1: 运行 `pnpm astro check` 确认无新错误（修复了 damage-calc 类型断言）
    - [x] SubTask 6.2: 启动 dev server 验证所有 3 个页面可正常访问
    - [x] SubTask 6.3: 验证共享导航栏在每个子页面正常显示
    - [x] SubTask 6.4: 验证主题切换在所有工具箱页面同步工作

# Task Dependencies

- [Task 2] depends on [Task 1]（导航栏不直接依赖，但 skinview3d 安装应尽快完成）
- [Task 3] depends on [Task 2]（首页需要导航栏）
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1, Task 2]（换皮肤需要 skinview3d 和导航栏）
- [Task 6] depends on [Task 3, Task 4, Task 5]
- [Task 3, Task 4] 可在 Task 2 完成后
