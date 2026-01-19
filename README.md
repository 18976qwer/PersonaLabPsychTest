# 144 Types Personality Test (Refactored)

全新重构版的 MBTI + 九型人格综合测评项目，前后端分离，支持中文 / 英文双语、AI 深度分析报告以及多模块可视化结果展示。

## 项目结构

- `client`：React + Vite + TypeScript 前端应用  
  - 多语言支持（中文 / 英文）
  - 报告页（阅读指引 / 人格特质 / 个人成长 / 职业路径 / 人际关系 / 报告总结）
  - AI 深度分析开关（按 Section 独立控制，支持 Loading 状态保持）
  - 移动端深度适配（九型人格 9 列布局、阅读指引章节跳转）
- `server`：Express + TypeScript 后端服务  
  - 对接 DeepSeek API 生成 AI 报告
  - 通过环境变量管理 API Key
  - CORS 安全配置与 API 代理支持

## 环境依赖

- Node.js 18+（推荐）
- npm 8+ 或兼容版本

## 安装与启动

### 1. 克隆仓库

```bash
git clone <your-repo-url>
cd psych-test-web-refactor
```

### 2. 配置环境变量

#### 后端配置 (DeepSeek API)

在 `server` 目录下：

1. 复制示例配置：
   ```bash
   cd server
   cp .env.example .env   # Windows 可手动复制重命名
   ```

2. 编辑 `.env`，填入 DeepSeek API Key：
   ```ini
   PORT=3000
   DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
   DEEPSEEK_API_KEY=你的_deepseek_api_key
   ```

#### 前端配置 (本地开发)

在 `client` 目录下创建 `.env.development` 文件，指定本地后端地址：

```ini
# client/.env.development
VITE_API_URL=http://localhost:3000/api
```

> **说明**：此配置采用 **方案 A（直连模式）** 进行本地验证，前端直接请求后端接口。

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
npm run start  # 或 npm run dev
```
默认访问地址：`http://localhost:5173`

## 部署与 CI/CD 流程

本项目支持通过 GitHub 触发 Vercel (前端) 和 Render (后端) 的自动部署。

### 部署流程
1. **代码推送**：将代码 push 到 GitHub 仓库（如 `verified-version` 或 `main` 分支）。
2. **自动构建**：
   - **Vercel** 检测到 commit，自动拉取代码构建前端静态资源。
   - **Render** 检测到 commit，自动拉取代码构建后端服务。
3. **环境同步**：确保云端环境变量已正确配置。

### 环境变量配置

#### Vercel (Frontend)
- `VITE_API_URL`: 设置为 Render 后端的完整 API 地址（例如 `https://your-backend.onrender.com/api`）。
  - *如果不设置，将默认使用 `/api` 相对路径，并依赖 `vercel.json` 的 rewrites 规则转发（方案 B）。*

#### Render (Backend)
- `DEEPSEEK_API_KEY`: 必须配置。
- `DEEPSEEK_API_URL`: `https://api.deepseek.com/chat/completions`
- `PORT`: `3000` (或平台默认端口)

## 主要功能与优化

### 核心功能
- **MBTI 测试**：支持题目进度、未答题提示。
- **九型人格测试**：
  - PC 端标准布局。
  - **移动端优化**：答题进度栏展开后支持 **每行 9 题** 显示，完美适配九型人格（9种类型）的视觉逻辑。
- **多维度结果报告**：
  - 阅读指引、人格特质、个人成长、职业路径、人际关系、报告总结。
  - **移动端导航**：阅读指引页新增章节快捷跳转按钮，提升长文阅读体验。

### AI 深度分析
- **智能 Loading**：修复了 AI 分析时报告总结版块 Loading 条丢失的问题，确保用户感知数据加载状态。
- **状态持久化**：优化了多次测试后的 AI 状态逻辑，避免开关开启但显示 Mock 数据的问题。
- **安全集成**：API Key 仅在后端存储，前端通过 API 获取分析结果。

### 国际化
- 支持中/英双语切换，语言偏好本地持久化。

## 目录引用（常用文件）

- **前端页面**：
  - `client/src/pages/ResultsPage.tsx`: 结果页主逻辑（含 AI 状态管理）。
  - `client/src/pages/EnneagramPage.tsx`: 九型人格测试页（含移动端布局适配）。
- **报告组件**：
  - `client/src/components/report/ReadingGuideSection.tsx`: 阅读指引（含移动端跳转）。
  - `client/src/components/report/ReportSummarySection.tsx`: 报告总结。
- **配置与工具**：
  - `client/src/utils/ai.ts`: AI 请求封装。
  - `server/src/index.ts`: 后端入口与 CORS 配置。
