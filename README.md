# 144 Types Personality Test (Refactored)

全新重构版的 MBTI + 九型人格综合测评项目，前后端分离，支持中文 / 英文双语、AI 深度分析报告以及多模块可视化结果展示。

## 项目文件结构

```text
D:\TRAE PROJECT\PSYCH-TEST-WEB-REFACTOR
│  .gitignore
│  README.md
│
├─client                    # 前端项目 (React + Vite)
│  │  .env.development      # 本地开发配置
│  │  index.html
│  │  package.json
│  │  vite.config.ts
│  │
│  └─src
│      │  App.tsx
│      │  main.tsx
│      │
│      ├─components
│      │  │  AIReportView.tsx        # AI 报告视图入口
│      │  │  AIConfigModal.tsx       # AI 配置弹窗
│      │  │  ...
│      │  │
│      │  ├─common          # 通用组件
│      │  │      ResponsiveStyles.tsx
│      │  │      ScrollProgress.tsx
│      │  │
│      │  ├─report          # 报告页核心组件
│      │  │      AiSettingsPanel.tsx      # AI 设置面板
│      │  │      ReadingGuideSection.tsx  # 阅读指引 (含FAQ)
│      │  │      ReportSummarySection.tsx # 报告总结 (含AI流式输出)
│      │  │      DataVisualizationSection.tsx # 数据可视化
│      │  │      PersonalityTraitsSection.tsx # 人格特质
│      │  │      CareerPathSection.tsx    # 职业路径
│      │  │      RelationshipsSection.tsx # 人际关系
│      │  │      ...
│      │  │
│      │  └─...
│      │
│      ├─context            # 全局状态管理
│      │      AiContext.tsx # AI 开关、Provider 状态、流式控制
│      │      LanguageContext.tsx
│      │
│      ├─data               # 静态数据与多语言文案
│      │      locales.ts    # 中英文案资源
│      │      mbti.ts       # MBTI 题库
│      │      enneagram.ts  # 九型人格题库
│      │
│      ├─pages              # 页面路由组件
│      │      LandingPage.tsx
│      │      MBTIPage.tsx
│      │      EnneagramPage.tsx
│      │      ResultsPage.tsx # 结果页主入口
│      │
│      ├─utils
│      │      ai.ts         # 前端 AI 请求封装 (Fetch & SSE)
│      │      textSimilarity.ts # 文本相似度计算与去重算法
│      │      scoring.ts    # 评分逻辑
│      │
│      └─styles             # 全局样式与主题
│
└─server                    # 后端服务 (Express + TypeScript)
    │  .env.example         # 环境变量示例
    │  package.json
    │
    └─src
        │  index.ts         # 服务入口 (API 路由、SSE 流式响应)
        │
        ├─services
        │  │  promptTemplates.ts # 统一 Prompt 模板管理
        │  │  lexicon.ts         # 敏感词过滤与锚点数据
        │  │
        │  └─providers      # 多模型接入层
        │          qwen.ts      # 通义千问实现
        │          minimax.ts   # MiniMax 实现 (支持个人开发者)
        │          moonshot.ts  # Moonshot (Kimi) 实现
        │          deepseek.ts  # DeepSeek 实现 (兜底策略)
        │          utils.ts     # 厂商通用工具函数
```

## 多 AI 模型集成

本项目后端集成了多家主流大模型厂商，提供灵活的切换与高可用兜底机制。

### 1. 支持的模型厂商
- **通义千问 (Qwen)**：默认推荐，响应速度快，综合能力强。
- **MiniMax**：极速模式，适合高并发场景。
  - *注：支持个人开发者账号（无需配置 Group ID）。*
- **Moonshot (Kimi)**：擅长长文本处理。
- **DeepSeek**：作为系统的**最终兜底方案**，当其他厂商服务不可用时自动接管。

### 2. 后端配置 (.env)

在 `server/.env` 文件中配置 API Key 与首选服务商：

```ini
# 服务端口
PORT=3000

# 首选 AI 服务商 (qwen | minimax | moonshot | deepseek)
PRIMARY_PROVIDER=qwen

# --- 厂商配置 (按需填写) ---

# 1. 通义千问 (Qwen)
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxx

# 2. MiniMax
MINIMAX_API_KEY=eyJxxxxxxxxxxxx
# 企业账号需填写 Group ID，个人开发者请留空
MINIMAX_GROUP_ID=

# 3. Moonshot (Kimi)
MOONSHOT_API_KEY=sk-xxxxxxxxxxxx

# 4. DeepSeek (兜底必填)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
```

### 3. 核心特性
- **流式输出 (Streaming)**：
  - 支持 Server-Sent Events (SSE) 协议。
  - 前端 `ReportSummarySection` 等组件支持按模块（Section-based）实时渲染 AI 生成的内容。
- **自动降级策略**：
  - 系统会自动捕获 `PRIMARY_PROVIDER` 的调用错误。
  - 一旦首选服务商失败，自动回退到 `DeepSeek` 进行重试，确保用户报告生成的成功率。
- **统一 Prompt 管理**：
  - 所有模型的 Prompt 逻辑集中在 `server/src/services/promptTemplates.ts`。
  - 确保不同模型输出的 JSON 结构严格一致，兼容前端渲染组件。
- **智能去重 (Smart Deduplication)**：
  - 在 `client/src/utils/textSimilarity.ts` 中实现了基于 Jaccard 相似度的文本去重算法。
  - 自动过滤 AI 生成内容中与静态数据或其他模块重复的信息，确保报告内容的独特性和高价值。

## 环境依赖

- Node.js 18+（推荐）
- npm 8+ 或兼容版本

## 安装与启动

### 1. 克隆仓库

```bash
git clone <your-repo-url>
cd psych-test-web-refactor
```

### 2. 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 3. 本地开发启动

建议先启动后端，再启动前端。

**启动后端**
```bash
cd server
npm run dev
# 服务运行在 http://localhost:3000
```

**启动前端**
```bash
cd client
npm run dev
# 服务运行在 http://localhost:5173
```

## 部署与 CI/CD 流程

本项目支持通过 GitHub 触发 Vercel (前端) 和 Render (后端) 的自动部署。

### 环境变量配置

#### Vercel (Frontend)
- `VITE_API_URL`: 设置为 Render 后端的完整 API 地址（例如 `https://your-backend.onrender.com/api`）。

#### Render (Backend)
- 确保配置了上述 **多 AI 模型集成** 章节中提到的所有必要的环境变量。

## 主要功能与优化

### 核心功能
- **MBTI 测试**：支持题目进度、未答题提示。
- **九型人格测试**：
  - **移动端优化**：答题进度栏展开后支持 **每行 9 题** 显示，完美适配九型人格（9种类型）的视觉逻辑。
- **多维度结果报告**：
  - 阅读指引、人格特质、个人成长、职业路径、人际关系、报告总结。
  - **移动端导航**：阅读指引页新增章节快捷跳转按钮，提升长文阅读体验。

### 用户体验优化
- **智能排版**：
  - 针对移动端优化了图表（SVG）与标题之间的间距，确保视觉舒适度。
  - 修复了职业路径等模块在英文模式下的标题显示问题。
- **数据兜底与验证**：
  - 完善了“人际关系”等模块的兜底数据逻辑，确保在 AI 分析未开启或失败时仍能展示有价值的默认建议。
  - 引入了严格的数据去重机制，防止报告中出现重复的观点。

### 国际化
- 支持中/英双语切换，语言偏好本地持久化。
- **英文适配优化**：针对移动端英文文案进行了专门的排版优化（如防止标题换行、卡片居中对齐）。
