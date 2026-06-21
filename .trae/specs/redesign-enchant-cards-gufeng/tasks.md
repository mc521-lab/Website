# Tasks

- [x] Task 1: 清理重复组件并准备图标资源
    - [x] SubTask 1.1: 删除未使用的 `src/components/starlight/custom/EnchantsShowcase.astro`
    - [x] SubTask 1.2: 将 `targetIcons` 中的 emoji 映射为 Lucide 图标名称，保留 `targetNames` 中文映射（保留 emoji 作为游戏物品图标，改进标签容器样式）
    - [x] SubTask 1.3: 在 `global.css` 中补充附魔卡片专用的古风工具类（`.gufeng-enchant-card`、`.gufeng-seal-sm`、`.gufeng-corner-all`）
- [x] Task 2: 改造卡片外壳与内部布局结构
    - [x] SubTask 2.1: 将 `.enchant-card` 的 `rounded-xl` 改为无圆角，应用双层边框和四角角花装饰（`gufeng-card` + `gufeng-corner-all`）
    - [x] SubTask 2.2: 保留顶部品质色渐变装饰线，调整为 2px 粗细、90% 透明度
    - [x] SubTask 2.3: 调整卡片内 padding 和 gap（`p-4 gap-3`），使信息层级更清晰
    - [x] SubTask 2.4: 为 hover 状态添加品质色边框过渡和微弱光晕（`gufeng-enchant-card`）
- [x] Task 3: 改造卡片标题、描述和标签区域
    - [x] SubTask 3.1: 附魔名称使用楷体（`var(--font-heading)`），品质/类型标签改为印章风格小标签（`.gufeng-seal-sm`）
    - [x] SubTask 3.2: 描述文本使用宋体（`var(--font-sans)`），行高 `leading-relaxed`，字间距 `0.02em`
    - [x] SubTask 3.3: 数值区域背景使用半透明深色卡片（`bg-[var(--background)]/60`），边框使用品质色细线
- [x] Task 4: 改造等级选择器和数值交互区
    - [x] SubTask 4.1: 等级按钮改为方形（无圆角），边框和背景适配古风
    - [x] SubTask 4.2: active 等级按钮使用 `rarityColor` 填充背景、深墨文字，JS 交互逻辑完全保留
    - [x] SubTask 4.3: 数值键值对布局优化，标签与数值的视觉权重分明
- [x] Task 5: 改造适用装备、冲突和底部状态区
    - [x] SubTask 5.1: 适用装备标签使用 emoji 图标（MC 语境下更直观），标签容器样式统一为小型 pill（`rounded-sm`）
    - [x] SubTask 5.2: 冲突标签保持暗红色系，字体改为宋体
    - [x] SubTask 5.3: 底部状态标签（附魔台/交易/探索）使用 SVG 图标，字体改为宋体，间距放宽
- [x] Task 6: 改造搜索框和筛选器
    - [x] SubTask 6.1: 搜索框应用古风双层边框风格，图标和 placeholder 颜色适配
    - [x] SubTask 6.2: 类型和稀有度筛选按钮改为小型印章标签风格（`.gufeng-seal-sm`），active 状态填充对应颜色
    - [x] SubTask 6.3: 分组标题（稀有度）使用楷体，左侧竖条保留品质色
- [x] Task 7: 最终验证
    - [x] SubTask 7.1: 预览附魔图鉴页面，卡片视觉匹配古风风格
    - [x] SubTask 7.2: 验证交互功能完好（搜索、筛选、等级切换、数值计算）
    - [x] SubTask 7.3: 检查暗色模式下的对比度和品质颜色标记可见性
    - [x] SubTask 7.4: 检查移动端响应式布局（grid 列数、卡片内文字换行）

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] can run in parallel with Tasks 3-5
- [Task 7] depends on all other tasks
