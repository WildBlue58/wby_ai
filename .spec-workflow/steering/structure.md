# Project Structure

## Directory Organization

```
lesson_si/                          # 项目根目录
├── .spec-workflow/                 # Spec Workflow 配置和文档
│   ├── steering/                   # 项目指导文档
│   ├── specs/                      # 功能规范文档
│   ├── templates/                  # 默认模板
│   └── user-templates/             # 自定义模板
├── ai_coding/                      # AI编程相关项目
├── aigc/                          # AIGC应用和工具
├── algorithm/                     # 算法实现和练习
├── batjtmd/                       # 特定项目模块
├── colab/                         # Google Colab相关
├── count/                         # 计数相关功能
├── coze/                          # Coze平台集成
├── css/                           # CSS样式和组件
├── dashboard/                     # 仪表板应用
├── deepseek/                      # DeepSeek AI集成
│   └── webllm/                    # WebLLM应用
├── html5/                         # HTML5相关项目
├── interview/                     # 面试题和解答
│   └── js/                        # JavaScript面试题
│       └── virtual_list/          # 虚拟列表实现
├── JS/                            # JavaScript项目集合
├── json/                          # JSON数据处理
├── manus/                         # Manus AI总管项目
├── nlp/                           # 自然语言处理
├── ollama/                        # Ollama本地模型
├── openai/                        # OpenAI API集成
├── React/                         # React项目集合
├── tailwindcss/                   # Tailwind CSS项目
├── typescript/                    # TypeScript项目
├── vue/                           # Vue.js项目
├── ysw_ai/                        # AI相关项目集合
└── vibe/                          # Vibe Coding理念和实践
```

## Naming Conventions

### Files

- **Components/Modules**: `PascalCase` (如：`UserProfile.jsx`)
- **Services/Handlers**: `camelCase` (如：`userService.js`)
- **Utilities/Helpers**: `camelCase` (如：`dateUtils.js`)
- **Tests**: `[filename].test.js` 或 `[filename].spec.js`
- **配置文件**: `kebab-case` (如：`config.example.toml`)

### Code

- **Classes/Types**: `PascalCase` (如：`UserProfile`, `ApiResponse`)
- **Functions/Methods**: `camelCase` (如：`getUserData`, `handleClick`)
- **Constants**: `UPPER_SNAKE_CASE` (如：`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Variables**: `camelCase` (如：`userName`, `isLoading`)

## Import Patterns

### Import Order

1. **外部依赖**：React、Vue、第三方库
2. **内部模块**：项目内部的服务、工具
3. **相对导入**：同目录或子目录的文件
4. **样式导入**：CSS、SCSS文件

### Module/Package Organization

```javascript
// 示例导入顺序
import React, { useState, useEffect } from 'react';
import { Router } from 'express';
import { UserService } from '../services/UserService';
import { formatDate } from '../utils/dateUtils';
import { validateInput } from './validation';
import './styles.css';
```

## Code Structure Patterns

### Module/Class Organization

```javascript
// 1. 导入和依赖
import React from 'react';
import { UserService } from '../services/UserService';

// 2. 常量和配置
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// 3. 类型/接口定义
interface User {
  id: string;
  name: string;
  email: string;
}

// 4. 主要实现
const UserProfile = ({ userId }: { userId: string }) => {
  // 组件逻辑
};

// 5. 辅助函数
const formatUserName = (user: User) => {
  return user.name.toUpperCase();
};

// 6. 导出
export { UserProfile, formatUserName };
```

### Function/Method Organization

```javascript
const processUserData = (rawData) => {
  // 1. 输入验证
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Invalid input data');
  }

  // 2. 核心逻辑
  const processedData = {
    id: rawData.id,
    name: rawData.name.trim(),
    email: rawData.email.toLowerCase()
  };

  // 3. 错误处理
  try {
    validateUser(processedData);
  } catch (error) {
    console.error('Validation failed:', error);
    return null;
  }

  // 4. 清晰的返回点
  return processedData;
};
```

### File Organization Principles

- **一个组件一个文件**：每个React组件独立文件
- **相关功能分组**：相关工具函数放在同一文件
- **公共API在顶部**：导出的函数和类在文件顶部
- **实现细节隐藏**：内部辅助函数放在文件底部

## Code Organization Principles

1. **单一职责**：每个文件只负责一个明确的功能
2. **模块化**：代码组织成可重用的模块
3. **可测试性**：结构便于单元测试
4. **一致性**：遵循已建立的代码模式

## Module Boundaries

### 核心模块边界

- **AI集成层**：`deepseek/`, `openai/`, `ollama/` - 独立的AI服务集成
- **前端框架层**：`React/`, `vue/`, `html5/` - 不同前端技术栈
- **工具库层**：`css/`, `json/`, `algorithm/` - 可复用的工具和算法
- **学习资源层**：`interview/`, `JS/`, `typescript/` - 学习材料和示例

### 依赖方向

```
AI集成层 → 工具库层 → 前端框架层
    ↓           ↓           ↓
学习资源层 ← 项目应用层 ← 仪表板层
```

### 平台特定代码隔离

- **浏览器端**：`html5/`, `css/`, `React/`, `vue/`
- **Node.js端**：`ollama/`, `openai/`, `dashboard/`
- **通用代码**：`algorithm/`, `json/`, `typescript/`

## Code Size Guidelines

- **文件大小**：单个文件不超过300行
- **函数/方法大小**：单个函数不超过50行
- **类/模块复杂度**：圈复杂度不超过10
- **嵌套深度**：最大嵌套层级不超过4层

## Dashboard/Monitoring Structure

### 仪表板结构

```
dashboard/
├── src/                          # 源代码
│   ├── components/               # React组件
│   │   ├── charts/              # 图表组件
│   │   ├── forms/               # 表单组件
│   │   └── layout/              # 布局组件
│   ├── services/                # 服务层
│   │   ├── api.js              # API调用
│   │   └── websocket.js        # WebSocket连接
│   ├── hooks/                   # 自定义Hooks
│   ├── utils/                   # 工具函数
│   └── styles/                  # 样式文件
├── public/                      # 静态资源
└── dist/                        # 构建输出
```

### 关注点分离

- **仪表板独立**：与核心业务逻辑分离
- **独立入口**：可独立运行和部署
- **最小依赖**：对主应用依赖最小
- **可禁用**：不影响核心功能

## Documentation Standards

- **公共API文档**：所有导出的函数和类必须有JSDoc注释
- **复杂逻辑注释**：复杂算法和业务逻辑需要内联注释
- **模块README**：主要模块需要README文件说明
- **语言特定约定**：遵循JavaScript/TypeScript文档约定

### 文档示例

```javascript
/**
 * 处理用户数据的工具函数
 * @param {Object} rawData - 原始用户数据
 * @param {string} rawData.id - 用户ID
 * @param {string} rawData.name - 用户姓名
 * @param {string} rawData.email - 用户邮箱
 * @returns {Object|null} 处理后的用户数据，失败时返回null
 * @throws {Error} 当输入数据无效时抛出错误
 */
const processUserData = (rawData) => {
  // 实现...
};
```
