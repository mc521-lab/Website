# Tasks

- [x] Task 1: 创建 Wiki 入口页基础结构与 Hero 区域
    - [x] SubTask 1.1: 新建 `src/pages/wiki/index.astro`，引入 `Layout.astro`
    - [x] SubTask 1.2: 实现 Hero 区域：标题"君庭阁百科"、副标题、装饰分隔线
    - [x] SubTask 1.3: 确保页面应用 `gufeng-paper` 背景与暗色模式兼容

- [x] Task 2: 实现四大分类导航卡片
    - [x] SubTask 2.1: 定义 4 个分类的数据结构（名称、描述、链接列表、图标）
    - [x] SubTask 2.2: 使用 `gufeng-card` 样式渲染卡片网格（桌面 2×2 / 手机 1 列）
    - [x] SubTask 2.3: 为每张卡片添加关键页面链接和"进入分类"按钮
    - [x] SubTask 2.4: 实现卡片 hover 动效（边框变朱砂红 + 微光晕）

- [x] Task 3: 完善页面细节与交互
    - [x] SubTask 3.1: 添加页面底部返回主页链接
    - [x] SubTask 3.2: 验证暗色/亮色模式切换下所有元素视觉正确
    - [x] SubTask 3.3: 验证移动端响应式布局与触控目标尺寸

# Task Dependencies

- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
