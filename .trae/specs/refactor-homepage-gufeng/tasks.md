# Tasks

- [x] Task 1: 搭建古风设计系统：在 `src/styles/global.css` 中定义古风色板、字体栈和装饰工具类
    - [x] SubTask 1.1: 引入楷书字体（霞鹜文楷 LXGW WenKai）和宋体字体（Noto Serif SC），替换主页默认字体
    - [x] SubTask 1.2: 定义宣纸浅色 / 水墨深色两套古风色板 CSS 变量（背景、前景、主色朱砂、点缀赭石/暖金、卡片、边框等）
    - [x] SubTask 1.3: 添加古风装饰工具类（回纹边框、卷轴分隔线、印章样式、卡片角花等纯 CSS 实现）
    - [x] SubTask 1.4: 调整 `src/layouts/Layout.astro` 默认主题为浅色（宣纸），确保 ThemeProvider 支持 `defaultTheme="light"`

- [x] Task 2: 构建主页 Hero 区块：标题、副标题、三个入口按钮、背景视频
    - [x] SubTask 2.1: 在 `src/pages/index.astro` 中搭建 Hero 区块结构，含 MC521 标题（楷书大字）、副标题"二十余年，同在一片方块天"
    - [x] SubTask 2.2: 实现三个入口按钮（开始游戏 / 查看百科 / 打开工具箱），古风按钮样式
    - [x] SubTask 2.3: 集成背景视频（`public/videos/mc-background-video.webm`），叠加古风边框 / 遮罩处理使风格协调
    - [x] SubTask 2.4: 添加向下滚动提示箭头（古风样式）

- [x] Task 3: 构建服务器介绍区块：关于君庭阁 + 适合哪些玩家
    - [x] SubTask 3.1: 搭建"关于君庭阁"文字介绍区块，使用宋体正文、古风书页 / 卷轴布局
    - [x] SubTask 3.2: 实现"适合哪些玩家"四类列表（生存 / 技术 / 冒险 / 商业玩家），古风列表样式，用 SVG 图标替换 emoji

- [x] Task 4: 构建分区介绍区块：九个分区卡片网格
    - [x] SubTask 4.1: 搭建分区卡片网格容器，响应式列数（手机 1 列 / 平板 2 列 / 电脑 3 列）
    - [x] SubTask 4.2: 实现单个分区卡片：分区名（楷书）、标签（印章 / 标签样式）、描述文字、现有 ecosystem 图片
    - [x] SubTask 4.3: 为卡片添加古风边框 / 角花装饰，图片加古风滤镜或边框处理

- [x] Task 5: 构建社区活动区块和加入我们区块
    - [x] SubTask 5.1: 搭建社区活动区块，展示当前活动状态（暂无活动时的空状态文案）
    - [x] SubTask 5.2: 搭建"准备好加入了吗"区块，含引导文案
    - [x] SubTask 5.3: 实现服务器地址 `mc521.cc` 点击复制功能（含复制成功反馈）
    - [x] SubTask 5.4: 实现 QQ 群链接（`https://qm.qq.com/q/nLEPToNgpq`），古风按钮样式

- [x] Task 6: 实现交互行为：按钮跳转、平滑滚动、主题切换
    - [x] SubTask 6.1: "开始游戏"按钮平滑滚动至 #join；"查看百科"跳转 /wiki；"打开工具箱"跳转 /toolbox
    - [x] SubTask 6.2: 实现明暗主题切换按钮（固定在页面角落），切换宣纸 / 水墨色板
    - [x] SubTask 6.3: 确保所有交互在移动端可用（触摸目标 ≥44px）

- [x] Task 7: 响应式优化与验证
    - [x] SubTask 7.1: 移动端优先布局检查（375px），确保无横向滚动、字体 ≥16px
    - [x] SubTask 7.2: 平板（768px）和桌面（1024px+）断点布局验证
    - [x] SubTask 7.3: 运行 lint / typecheck 确保代码无误，启动 dev server 验证页面渲染

# Task Dependencies

- [Task 2] depends on [Task 1]（需要古风设计系统才能构建区块）
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 2, Task 5]（按钮和区块需要先存在）
- [Task 7] depends on [Task 2, Task 3, Task 4, Task 5, Task 6]
- [Task 2, Task 3, Task 4, Task 5] 可在 Task 1 完成后并行
