# Tasks

- [x] Task 1: 创建 Astro 化基础设施与共享工具
    - [x] SubTask 1.1: 确定 `src/components/starlight/custom/` 目录结构（采用扁平化单文件方案）
    - [x] SubTask 1.2: 在各自 Showcase 组件内直接实现 utils（颜色映射、数值格式化等）
    - [x] SubTask 1.3: 创建通用的搜索/过滤 `<script>` 模式与样式约定

- [x] Task 2: 迁移 gems 图鉴为 Astro 纯组件
    - [x] SubTask 2.1: 重写 `GemShowcase.astro`（服务端加载 gems.json，原生 JS 搜索）
    - [x] SubTask 2.2: 验证 gems.mdx 页面正常渲染与搜索交互

- [x] Task 3: 迁移 equipment / weapon 图鉴为 Astro 纯组件
    - [x] SubTask 3.1: 重写 `EquipmentShowcase.astro`（服务端加载 equipment.json，原生 JS 搜索+职业过滤）
    - [x] SubTask 3.2: 重写 `WeaponShowcase.astro`
    - [x] SubTask 3.3: 验证 equipment.mdx 与 weapons.mdx 正常渲染与交互

- [x] Task 4: 迁移 enchants 图鉴为 Astro 纯组件
    - [x] SubTask 4.1: 重写 `EnchantmentShowcase.astro`（服务端加载 enchants.json，原生 JS 搜索+类型/稀有度过滤+等级选择器）
    - [x] SubTask 4.2: 验证 enchantments.mdx 正常渲染与交互

- [x] Task 5: 迁移 tools 图鉴为 Astro 纯组件
    - [x] SubTask 5.1: 重写 `ToolsShowcase.astro`（服务端加载 tools.json，原生 JS 搜索+类别过滤）
    - [x] SubTask 5.2: 验证 tools.mdx 正常渲染与交互

- [x] Task 6: 迁移 materials 图鉴为 Astro 纯组件
    - [x] SubTask 6.1: 重写 `MaterialShowcase.astro`（服务端加载 materials.json，原生 JS 搜索+类别过滤）
    - [x] SubTask 6.2: 验证 materials.mdx 正常渲染与交互

- [x] Task 7: 迁移 jewelries 图鉴为 Astro 纯组件
    - [x] SubTask 7.1: 重写 `JewelryShowcase.astro`（服务端加载 jewelries.json，原生 JS 搜索+职业过滤）
    - [x] SubTask 7.2: 验证 jewelries.mdx 正常渲染与交互

- [x] Task 8: 清理旧代码与类型检查
    - [x] SubTask 8.1: 删除 `src/components/starlight/custom/_react/itemframe/` 目录
    - [x] SubTask 8.2: 运行 `npx astro check` 确认无编译错误

- [x] Task 9: 清理 Vite 缓存并验证浏览器渲染
    - [x] SubTask 9.1: 停止 dev server，删除 `node_modules/.vite` 缓存目录
    - [x] SubTask 9.2: 重启 `nr dev` 开发服务器
    - [x] SubTask 9.3: 浏览器访问所有 7 个 Wiki 图鉴页面，确认无控制台报错、数据正常显示、搜索过滤可用

# Task Dependencies

- Task 1 为所有后续任务的基础，必须先完成
- Task 2~7 互相独立，可并行
- Task 8 依赖 Task 2~7 全部完成
- Task 9 依赖 Task 8 完成
