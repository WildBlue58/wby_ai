# React Context API 完整教程

## 项目简介

这是一个完整的 React Context API 演示项目，展示了如何使用 React 的 Context API 实现全局状态管理，解决组件间深层嵌套通信的问题。

## 技术栈

- **React 18+** - 使用最新的 React 版本
- **Vite** - 现代化的构建工具
- **React Hooks** - useState, useContext, 自定义 Hooks
- **Context API** - React 内置的状态管理方案

## 核心概念

### useContext

- 组件层次太深，组件通信机械化
- 上下文对象 **全局**状态共享
- 使用流程
  - 创建一个上下文对象
  - Provider 全局申明
  - 在任何地方,useContext 使用状态

## 数据状态共享，肯定不只有一种方式

- 组件单向数据流通信
- 创建上下文对象
  - 在它 Provider 的内部,useContext 拿到状态
    ThemeContext.Provider 组件，react 的一贯作风，将组件进行到底
  - 一般在全局使用

## 项目结构

```
src/
├── main.jsx              # 应用入口文件
├── App.jsx               # 根组件，包含 Context Provider
├── ThemeContext.js       # 主题上下文定义
├── components/
│   ├── Page/
│   │   └── index.jsx     # 页面组件，使用自定义 Hook
│   └── Child/
│       └── index1.jsx    # 子组件，直接使用 useContext
└── hooks/
    └── useTheme.js       # 自定义 Hook，封装 Context 使用
```

## 核心知识点详解

### 1. Context 创建 (`ThemeContext.js`)

```javascript
import { createContext } from "react";
export const ThemeContext = createContext("light");
```

**知识点：**

- `createContext()` 创建上下文对象
- 参数是默认值，当组件不在 Provider 内部时使用
- 返回一个包含 Provider 和 Consumer 的对象

### 2. Context Provider (`App.jsx`)

```javascript
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
      <button onClick={() => setTheme("dark")}>切换主题</button>
    </ThemeContext.Provider>
  );
}
```

**知识点：**

- `Provider` 组件提供上下文值
- `value` 属性传递要共享的数据
- 状态更新会触发所有消费组件的重新渲染
- 使用 `useState` 管理主题状态

### 3. 直接使用 useContext (`Child/index1.jsx`)

```javascript
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";

const Child = () => {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Child {theme}</div>;
};
```

**知识点：**

- `useContext(ThemeContext)` 获取上下文值
- 组件会自动订阅上下文变化
- 当 Provider 的 value 变化时，组件会重新渲染

### 4. 自定义 Hook (`hooks/useTheme.js`)

```javascript
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}
```

**知识点：**

- 自定义 Hook 封装 Context 使用逻辑
- 提高代码复用性和可维护性
- 遵循 React Hooks 命名规范（use 开头）

### 5. 使用自定义 Hook (`Page/index.jsx`)

```javascript
import { useTheme } from "../../hooks/useTheme";

const Page = () => {
  const theme = useTheme();
  return (
    <>
      {theme}
      <Child />
    </>
  );
};
```

**知识点：**

- 通过自定义 Hook 获取上下文值
- 代码更简洁，逻辑更清晰
- 便于测试和维护

## 使用说明

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 功能演示

1. **主题切换**：点击页面上的"切换主题"按钮
2. **状态共享**：观察 Page 和 Child 组件都能获取到相同的主题状态
3. **响应式更新**：主题变化时，所有使用该上下文的组件都会自动更新

## 最佳实践

### 1. Context 设计原则

- 将相关的状态放在同一个 Context 中
- 避免创建过多的小 Context
- 合理设置默认值

### 2. 性能优化

- 使用 `useMemo` 优化 Provider 的 value
- 避免在 Context 中存储频繁变化的数据
- 考虑使用 `useCallback` 优化函数传递

### 3. 代码组织

- 将 Context 定义放在单独的文件中
- 使用自定义 Hook 封装 Context 使用逻辑
- 保持组件职责单一

## 常见问题

### Q: Context 和 Redux 有什么区别？

A: Context 是 React 内置的状态管理方案，适合简单的全局状态；Redux 是第三方库，适合复杂的状态管理。

### Q: 什么时候使用 Context？

A: 当需要在多个组件间共享状态，且组件层次较深时，使用 Context 可以避免 props 层层传递。

### Q: Context 会影响性能吗？

A: Context 的值变化会导致所有消费组件重新渲染，因此要避免在 Context 中存储频繁变化的数据。

## 扩展阅读

- [React Context 官方文档](https://react.dev/reference/react/createContext)
- [React Hooks 官方文档](https://react.dev/reference/react/hooks)
- [自定义 Hooks 最佳实践](https://react.dev/learn/reusing-logic-with-custom-hooks)

## 许可证

MIT License
