# React Hooks 使用规则详解

## 核心问题：为何 Hooks 不能放在条件语句中？

### 🎯 简单回答

**React Hooks 必须在组件的最顶层调用，不能放在条件语句、循环或嵌套函数中。**

### 📚 深入理解

#### 1. 问题的本质

函数组件每次渲染都不会保留局部变量，React 只能在一次次调用之间自己保存 state/effect 等 hooks 的状态。

**React 的做法是：**

- 给每个 Hook 在链表/数组里排位置（slot）
- 比如：第一个 slot 是 `useState`，第二个 slot 是 `useEffect`
- 下一次渲染时，React 会按照调用顺序一个一个取出对应的状态

#### 2. 工作原理图解

```text
第一次渲染：
┌─────────────────────────────────────┐
│ 组件函数调用                          │
├─────────────────────────────────────┤
│ [0] useState(0)      → state: 0     │
│ [1] useEffect(...)   → effect: fn1  │
│ [2] useState('hi')   → state: 'hi'  │
│ [3] useEffect(...)   → effect: fn2  │
└─────────────────────────────────────┘

第二次渲染：
┌─────────────────────────────────────┐
│ 组件函数调用                          │
├─────────────────────────────────────┤
│ [0] useState(0)      → 读取索引0    │
│ [1] useEffect(...)   → 读取索引1    │
│ [2] useState('hi')   → 读取索引2    │
│ [3] useEffect(...)   → 读取索引3    │
└─────────────────────────────────────┘
```

#### 3. 为什么会出错？

如果把 Hooks 放在条件语句中，调用顺序可能会改变：

```text
❌ 错误示例：
第一次渲染（show = true）：
[0] useState(0)      ← 在条件内
[1] useEffect(...)   

第二次渲染（show = false）：
[0] useEffect(...)   ← useState 被跳过了！
❌ 顺序错乱，React 会读取错误的状态
```

### 💡 React 内部实现原理

```javascript
// React 内部简化实现
let hooks = []; // 存储所有 hooks 的数组
let currentHook = 0; // 当前 hook 的索引

function useState(initialValue) {
  // 第一次渲染：保存初始值
  if (hooks[currentHook] === undefined) {
    hooks[currentHook] = initialValue;
  }
  
  // 获取当前 hook 的状态
  const state = hooks[currentHook];
  const setState = (newValue) => {
    hooks[currentHook] = newValue;
    render(); // 触发重新渲染
  };
  
  currentHook++; // 移动到下一个 hook
  return [state, setState];
}

// 组件渲染前重置索引
function render() {
  currentHook = 0; // 重置索引
  Component(); // 调用组件函数
}
```

### 🚨 常见错误示例

#### 错误 1：在条件语句中使用

```jsx
function App({ show }) {
  // ❌ 错误：条件调用
  if (show) {
    const [count, setCount] = useState(0);
  }
  
  const [name, setName] = useState('张三');
  return <div>{name}</div>;
}
```

**问题：** 当 `show` 从 `true` 变为 `false` 时，第一个 `useState` 不再调用，导致 `name` 的状态被读取到了错误的位置。

#### 错误 2：在循环中使用

```jsx
function App({ items }) {
  // ❌ 错误：在循环中调用
  for (let i = 0; i < items.length; i++) {
    const [state, setState] = useState(items[i]);
  }
  
  return <div>App</div>;
}
```

**问题：** 循环次数可能改变，导致 Hooks 调用次数不一致。

#### 错误 3：在嵌套函数中使用

```jsx
function App() {
  const handleClick = () => {
    // ❌ 错误：在事件处理函数中调用
    const [count, setCount] = useState(0);
  };
  
  return <button onClick={handleClick}>点击</button>;
}
```

**问题：** Hooks 只能在组件的顶层调用，不能在回调函数中。

### ✅ 正确的使用方式

#### 正确示例 1：条件渲染

```jsx
function App({ show }) {
  // ✅ 正确：始终调用 Hooks
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');
  
  // 在 JSX 中处理条件
  return (
    <div>
      {show && <div>计数: {count}</div>}
      <div>姓名: {name}</div>
    </div>
  );
}
```

#### 正确示例 2：条件逻辑

```jsx
function App({ shouldFetch }) {
  // ✅ 正确：始终调用 useEffect
  useEffect(() => {
    // 在 effect 内部处理条件
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);
  
  return <div>App</div>;
}
```

#### 正确示例 3：动态状态

```jsx
function App({ initialValue }) {
  // ✅ 正确：使用初始化函数
  const [count, setCount] = useState(() => {
    // 条件逻辑放在初始化函数中
    return initialValue > 0 ? initialValue : 0;
  });
  
  return <div>计数: {count}</div>;
}
```

## React Hooks 使用规则

### 📋 两大核心规则

#### 规则 1：只在最顶层调用 Hooks

**✅ 正确：**

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');
  useEffect(() => {}, []);
  
  return <div>App</div>;
}
```

**❌ 错误：**

```jsx
function App() {
  if (condition) {
    const [count, setCount] = useState(0); // ❌
  }
  
  for (let i = 0; i < 5; i++) {
    useEffect(() => {}, []); // ❌
  }
  
  return <div>App</div>;
}
```

#### 规则 2：只在 React 函数中调用 Hooks

**✅ 可以调用的地方：**

- React 函数组件内
- 自定义 Hooks 内

**❌ 不能调用的地方：**

- 普通 JavaScript 函数
- Class 组件
- 事件处理函数
- 条件语句、循环、嵌套函数

### 🔍 为什么要遵守这些规则？

1. **保证调用顺序一致**：React 依赖 Hooks 的调用顺序来正确管理状态
2. **避免状态混乱**：顺序改变会导致读取到错误的状态值
3. **确保性能优化**：React 可以正确地进行性能优化和状态复用

### 🛠️ 工具支持

#### ESLint 插件

安装 `eslint-plugin-react-hooks` 可以自动检测违反规则的代码：

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 实用技巧

### 💡 技巧 1：使用自定义 Hooks 封装条件逻辑

```jsx
// 自定义 Hook
function useConditionalState(condition, initialValue) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    if (condition) {
      // 条件逻辑在 effect 中处理
      setState(initialValue);
    }
  }, [condition, initialValue]);
  
  return [state, setState];
}

// 使用
function App({ show }) {
  const [count, setCount] = useConditionalState(show, 0);
  return <div>计数: {count}</div>;
}
```

### 💡 技巧 2：使用状态标志位

```jsx
function App({ enableFeature }) {
  // ✅ 始终调用 Hook
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // 根据标志位决定是否执行
    if (enableFeature && !data) {
      fetchData().then(setData);
    }
  }, [enableFeature, data]);
  
  return <div>{data}</div>;
}
```

### 💡 技巧 3：提前返回（Early Return）

```jsx
function App({ show }) {
  // ✅ 所有 Hooks 在条件判断之前调用
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');
  
  // 条件判断放在 Hooks 之后
  if (!show) {
    return null;
  }
  
  return (
    <div>
      <p>计数: {count}</p>
      <p>姓名: {name}</p>
    </div>
  );
}
```

## 总结

1. **核心原因**：React 通过 Hooks 调用顺序来管理状态，顺序改变会导致状态错乱
2. **必须遵守**：始终在组件最顶层、以相同顺序调用 Hooks
3. **工具辅助**：使用 ESLint 插件自动检测违规代码
4. **条件处理**：将条件逻辑放在 Hooks 内部，而不是控制 Hooks 是否调用

记住：**Hooks 的调用顺序必须在每次渲染中保持一致！** 🎯
