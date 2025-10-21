# 项目信息

## 项目概述

**项目名称**：前端学习笔记与示例代码库

**项目类型**：个人学习资源集合

**主要目的**：

- 记录前端技术学习过程
- 收集和整理面试题及解答
- 实践各种技术栈和框架
- 探索 AI 辅助开发的应用

**维护方式**：持续更新，逐步积累

## 技术栈

### 前端框架

- **React** - 主流前端框架，包含 Hooks、状态管理、路由等
- **Vue** - 渐进式框架，包含 Vue 3 Composition API
- **Next.js** - React 服务端渲染框架

### 编程语言

- **JavaScript** - ES6+ 现代语法
- **TypeScript** - 类型安全的 JavaScript 超集

### 样式方案

- **CSS** - 原生 CSS，包括布局、定位、响应式等
- **TailwindCSS** - 实用优先的 CSS 框架

### 构建工具

- **Webpack** - 模块打包工具
- **Vite** - 下一代前端构建工具

### AI 技术集成

- **OpenAI** - GPT 系列模型应用
- **DeepSeek** - 国产大模型应用
- **Ollama** - 本地大模型部署
- **RAG** - 检索增强生成
- **MCP** - Model Context Protocol

### 其他技术

- **Node.js** - 服务端 JavaScript
- **HTML5** - 现代 Web 标准
- **算法与数据结构** - LeetCode 题解
- **低代码平台** - 可视化开发探索

## 目录结构

### 核心目录说明

```
lesson_si/
├── interview/          # 面试题集合
│   ├── algorithm/      # 算法题（LeetCode 等）
│   ├── js/            # JavaScript 面试题
│   ├── css/           # CSS 面试题
│   ├── react/         # React 相关面试题
│   ├── http/          # 网络协议相关
│   ├── hooks/         # React Hooks 实践
│   └── ...
├── React/             # React 学习示例
│   ├── hooks/         # Hooks 用法
│   ├── router/        # 路由实践
│   ├── interview/     # React 面试题
│   └── ...
├── vue/               # Vue 学习示例
├── next/              # Next.js 项目
├── algorithm/         # 通用算法学习
├── JS/                # JavaScript 深入学习
│   ├── cross_domain/  # 跨域解决方案
│   └── ...
├── css/               # CSS 深入学习
├── html5/             # HTML5 特性实践
├── typescript/        # TypeScript 学习
├── tailwindcss/       # TailwindCSS 实践
├── lowcode/           # 低代码平台探索
├── ysw_ai/            # AI 相关项目（个人 AI 实践）
│   ├── react/         # React + AI
│   ├── openai/        # OpenAI 应用
│   ├── deepseek/      # DeepSeek 应用
│   └── ...
├── deepseek/          # DeepSeek 专项实践
├── ollama/            # Ollama 本地模型
├── rag/               # RAG 应用
├── mcp/               # MCP 协议学习
├── openspec/          # OpenSpec 变更管理
│   ├── AGENTS.md      # AI 协作指南
│   ├── project.md     # 本文件
│   ├── changes/       # 变更提案
│   └── specs/         # 规范文档
└── readme.md          # 项目总览
```

### 目录组织原则

1. **技术栈分类**：按主要技术栈（React、Vue、Next.js）分目录
2. **面试专区**：`interview/` 集中存放面试相关内容
3. **AI 实践独立**：AI 相关探索在独立目录（`ysw_ai/`、`deepseek/` 等）
4. **示例自包含**：每个示例尽量包含完整的 `readme.md` 和可运行代码

## 编码约定

### 文档规范

1. **中文为主**：
   - 所有 README 和注释使用中文
   - 代码变量和函数名使用英文
   - 技术术语保持英文原文

2. **README 结构**：

   ```markdown
   # [主题标题]
   
   ## 问题描述 / 学习目标
   
   ## 解决方案 / 实现思路
   
   ## 关键点
   - 重点 1
   - 重点 2
   
   ## 代码说明（可选）
   
   ## 参考资料（可选）
   ```

3. **代码注释**：
   - 关键算法必须有注释
   - 复杂逻辑需要说明思路
   - 技巧性代码要解释原理

### 代码风格

1. **JavaScript/TypeScript**：
   - 使用 ES6+ 语法
   - 优先使用 `const`，必要时用 `let`
   - 函数优先使用箭头函数
   - 异步操作使用 `async/await`

2. **React**：
   - 优先使用函数组件和 Hooks
   - 组件文件使用 PascalCase
   - Props 使用解构
   - 避免不必要的 re-render

3. **Vue**：
   - 使用 Composition API（Vue 3）
   - 单文件组件（SFC）格式
   - 响应式数据使用 `ref` 和 `reactive`

4. **CSS**：
   - 语义化的类名
   - 避免深层嵌套
   - 响应式优先考虑移动端

### 示例组织

1. **独立性**：每个示例应能独立运行
2. **完整性**：包含必要的 HTML、CSS、JS 文件
3. **演示性**：代码应清晰展示学习点
4. **渐进性**：复杂主题分多个示例递进

### 命名规范

1. **目录命名**：
   - 使用小写字母和短横线：`algorithm/`, `react-hooks/`
   - 描述性名称，避免缩写

2. **文件命名**：
   - JavaScript 文件：`demo.js`, `solution.js`, `1.js`（练习题序号）
   - README 文件：统一使用 `readme.md`（小写）
   - HTML 文件：`index.html`, `demo.html`

3. **变量命名**：
   - 小驼峰：`userName`, `isLoading`
   - 常量大写：`MAX_SIZE`, `API_URL`
   - 布尔值加前缀：`isVisible`, `hasError`, `canSubmit`

## 包管理

### 依赖管理策略

- **项目级隔离**：每个示例项目有独立的 `package.json`
- **包管理器**：优先使用 `pnpm`，其次 `npm`
- **版本控制**：
  - 学习示例可以使用最新版本
  - 稳定项目锁定版本号

### 常用依赖

```json
{
  "react": "^18.x",
  "vue": "^3.x",
  "next": "^14.x",
  "typescript": "^5.x",
  "vite": "^5.x",
  "@tailwindcss/vite": "^4.x"
}
```

## 学习路径

### 推荐学习顺序

1. **基础阶段**：
   - JavaScript 基础 (`JS/`)
   - HTML5 + CSS (`html5/`, `css/`)
   - 算法基础 (`algorithm/`)

2. **框架阶段**：
   - React 核心概念 (`React/`)
   - Vue 3 基础 (`vue/`)
   - TypeScript (`typescript/`)

3. **进阶阶段**：
   - Next.js SSR (`next/`)
   - 性能优化
   - 工程化工具 (`interview/vite/`)

4. **AI 集成阶段**：
   - AI 应用开发 (`ysw_ai/`)
   - RAG 实践 (`rag/`)
   - MCP 协议 (`mcp/`)

### 面试准备路径

1. 算法刷题：`interview/algorithm/`
2. JavaScript 基础：`interview/js/`
3. React 面试题：`interview/react/`
4. CSS 布局：`interview/css/`
5. 网络协议：`interview/http/`

## AI 协作原则

### AI 在本项目中的角色

1. **学习助手**：
   - 解释技术概念
   - 提供代码示例
   - 解答疑问

2. **代码生成**：
   - 快速生成示例代码
   - 实现算法题解
   - 创建项目脚手架

3. **重构优化**：
   - 代码审查和优化建议
   - 性能改进
   - 最佳实践应用

### 何时使用 OpenSpec 提案

参见 `openspec/AGENTS.md` 的详细说明。

简单总结：

- ✅ 重大变更 → 创建提案
- ✅ 小修改 → 直接实施
- ✅ 不确定 → 询问用户

## 维护指南

### 定期维护任务

1. **依赖更新**：定期更新示例项目的依赖包
2. **文档完善**：补充缺失的 README
3. **代码审查**：检查代码质量和注释完整性
4. **归档整理**：整理过时的示例，移至 `archive/`（如需要）

### 新增内容检查清单

- [ ] 代码可以正常运行
- [ ] 包含 `readme.md` 说明
- [ ] 关键代码有注释
- [ ] 符合目录组织规范
- [ ] 遵循编码约定

## 项目目标

### 短期目标

- 持续积累面试题和算法题解
- 深入学习 React 和 Vue 生态
- 探索 AI 辅助开发的最佳实践

### 长期目标

- 建立完整的前端知识体系
- 形成可复用的代码片段库
- 打造 AI + 前端开发的工作流
- 成为前端 + AI 领域的实践者

## 更新日志

- **2024-10-21**：初始化 OpenSpec 框架，创建 `AGENTS.md` 和 `project.md`
