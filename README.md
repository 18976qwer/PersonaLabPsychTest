# 144 Types Personality Test (Refactored)

全新重构版的 MBTI + 九型人格综合测评项目，前后端分离，支持中文 / 英文双语、AI 深度分析报告以及多模块可视化结果展示。

## 项目结构

- `client`：React + Vite + TypeScript 前端应用  
  - 多语言支持（中文 / 英文）
  - 报告页（阅读指引 / 人格特质 / 个人成长 / 职业路径 / 人际关系 / 报告总结）
  - AI 深度分析开关（按 Section 独立控制）
  - AI 分析独立页面（含 ChatGPT Prompt 生成）
- `server`：Express + TypeScript 后端服务  
  - 对接 DeepSeek API 生成 AI 报告
  - 通过环境变量管理 API Key
  - 预留数据库（SQLite / Sequelize）扩展能力

## 环境依赖

- Node.js 18+（推荐）
- npm 8+ 或兼容版本

## 安装与启动

### 1. 克隆仓库

```bash
git clone <your-repo-url>
cd psych-test-web-refactor
```

### 2. 配置后端环境变量（DeepSeek API）

在 `server` 目录下：

1. 复制示例配置：

   ```bash
   cd server
   cp .env.example .env   # Windows 可手动复制重命名
   ```

2. 编辑 `.env`，填入你的 DeepSeek API Key：

   ```ini
   PORT=3000
   DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
   DEEPSEEK_API_KEY=你的_deepseek_api_key
   ```

> 注意：API Key 只需要配置在 `server/.env`，不会在前端暴露。

### 3. 安装依赖

#### 前端（client）

```bash
cd client
npm install
```

#### 后端（server）

```bash
cd server
npm install
```

### 4. 本地开发启动

建议先启动后端，再启动前端。

#### 启动后端

```bash
cd server
npm run dev
```

默认启动在 `http://localhost:3000`。

#### 启动前端

```bash
cd client
npm run dev
```

默认访问地址：`http://localhost:5173`

前端会通过 `/api/generate-report` 调用后端接口，生成 AI 深度分析报告。

### 5. 生产构建

#### 构建前端

```bash
cd client
npm run build
```

构建产物输出在 `client/dist` 目录，可用于部署到 Vercel 等静态托管平台。

#### 构建并启动后端

```bash
cd server
npm run build   # tsc 编译 TypeScript -> dist
npm start       # 等价于 node dist/index.js
```

## 主要功能一览

- MBTI 测试页面（支持题目进度、未答题提示、返回首页二次确认）
- 九型人格测试页面
- 结果页多模块报告：
  - 阅读指引（如何使用报告 / 报告能解答什么）
  - 人格特质解码（战略层 / 行动层 / 资源层、组合特质概述、时间线推测等）
  - 个人成长（内在反应模式、优劣势深度分析）
  - 职业路径（核心优势、潜在盲点、团队角色、协作风格、最佳环境、互补同伴、职业陷阱）
  - 人际关系（沟通模式调整清单、亲密关系动态、关系成长方向）
  - 报告总结（关键要点与一页总结）
  - 移动端专属阅读指引导航（吸顶悬浮、章节跳转）
- AI 深度分析能力：
  - 后端通过 DeepSeek API 生成结构化报告数据
  - 前端每个 Section 有独立的 AI 开关与加载状态（只刷新当前分区）
  - AI 加载状态会统一通过顶部 Header 禁用语言切换，防止中途切换导致结果错乱
- AI 分析独立页面（`/ai-analysis`）：
  - 展示 AI 报告的完整文本版
  - 自动填充的 ChatGPT Prompt，可一键复制继续深挖
- PDF 下载（基于 html2canvas + jsPDF 的前端导出）
- 本地存储与安全：
  - 使用 `StorageManager` 封装 localStorage
  - 使用 `crypto-js` 进行 AES 加密（兼容旧版逻辑）
- 移动端深度适配：
  - 首页标题与排版自适应
  - 测试页答题进度栏在移动端自动折叠，支持悬浮预览
  - 结果页卡片与图表在小屏设备上的布局优化
- 界面与交互：
  - 使用 `styled-components` 构建响应式 UI
  - 使用 `framer-motion` 提供动效
  - 带进度条的 Header，测试中途返回首页时弹出确认弹窗

### 近期 AI 报告优化（个人成长 & 人格特质）

- 人格特质 · 主观画像：
  - 「你的独特之处」文案通过占位符渲染 AI 输出，不再出现 `{text}` 原样展示的问题
- 个人成长 · 内在反应模式：
  - 每个状态下的「工作表现」「亲密关系表现」严格拆分为 3 条，使用「标签：简短描述」形式
  - 通过 DeepSeek Prompt 控制单条长度在 20 字左右，阅读更轻量，不依赖前端暴力截断
- 个人成长 · 优劣势深度分析：
  - 评估等级固定为：顶尖天赋（1 条）→ 显著才能（3 条）→ 优势领域（3 条）→ 需留意领域（3 条）
  - 等级徽章与说明文案与 UI 图标一一对应，保持视觉与语义一致
  - 数据结构与 AI 输出严格对齐，避免某些等级缺失或条数不一致

## 国际化（i18n）

- 所有核心文案（题目、报告文案、导航、按钮等）集中在  
  [`client/src/data/locales.ts`](client/src/data/locales.ts) 中维护。
- 通过 `LanguageContext` 提供 `language` 和 `t(key)` 函数：
  - 支持中文（`zh`）和英文（`en`）切换
  - 当前语言会持久化到 localStorage，刷新后仍然生效

## 部署建议（简要）

- 前端（client）：
  - 使用 `npm run build` 生成静态资源
  - 可部署到 Vercel、Netlify 等静态网站托管平台
- 后端（server）：
  - 部署到 Render、Railway 等 Node.js 平台
  - 在部署平台配置环境变量 `DEEPSEEK_API_KEY`、`DEEPSEEK_API_URL`、`PORT`
  - 如需与前端同域，可以通过平台或自建 Nginx 做反向代理，将 `/api` 路由到后端

## 目录引用（常用文件）

- 前端入口与路由：
  - `client/src/main.tsx`
  - `client/src/App.tsx`
- 关键页面：
  - `client/src/pages/MBTIPage.tsx`
  - `client/src/pages/EnneagramPage.tsx`
  - `client/src/pages/ResultsPage.tsx`
  - `client/src/pages/AIAnalysisPage.tsx`
- 报告模块组件：
  - `client/src/components/report/ReadingGuideSection.tsx`
  - `client/src/components/report/ReportNavigation.tsx`
  - `client/src/components/report/DataVisualizationSection.tsx`
  - `client/src/components/report/PersonalityTraitsSection.tsx`
  - `client/src/components/report/PersonalGrowthSection.tsx`
  - `client/src/components/report/CareerPathSection.tsx`
  - `client/src/components/report/RelationshipsSection.tsx`
  - `client/src/components/report/ReportSummarySection.tsx`
- AI 相关：
  - 前端调用封装：`client/src/utils/ai.ts`
  - AI 设置面板：`client/src/components/report/AiSettingsPanel.tsx`
  - AI 上下文：`client/src/context/AiContext.tsx`
  - 后端 DeepSeek 服务：`server/src/services/deepseek.ts`
  - 后端入口：`server/src/index.ts`
