# reducer

- 聊聊组件通信
  单向数据流

  - 父子组件 props 通信
  - 子父组件通信-自定义事件 props 传递
  - 兄弟组件通信 通过父组件中转
    跨层级通信 全局通信
  - useContext + useReducer
  - redux

- useContext + createContext 打理复杂的全局跨层次共享
  力不从心了
- useReducer 全局状态**管理**
  - 俄罗斯套娃
  - 多状态
  - 公司一样 制定一个制度
    - 单纯 reducer 纯函数
- 纯函数和规定

## useReducer

- useState 响应式状态
- 响应式状态管理
  上手段

## 什么是 useReducer？

`useReducer` 是 React 提供的一个 Hook，用于管理复杂的状态逻辑。它基于 Redux 的设计模式，通过 reducer 函数来管理状态的变化。

### 基本语法

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

- `state`: 当前状态
- `dispatch`: 派发 action 的函数
- `reducer`: 纯函数，接收当前状态和 action，返回新状态
- `initialState`: 初始状态

## 纯函数概念

### 什么是纯函数？

纯函数具有以下特征：

- **相同输入，相同输出**：对于相同的参数，总是返回相同的结果
- **无副作用**：不修改外部变量、不发送请求、不操作 DOM
- **可预测性**：函数的行为完全由输入决定

### 纯函数示例

```javascript
// 纯函数 - 相同输入，相同输出，无副作用
function add(a, b) {
  return a + b;
}

// 不纯的函数 - 有副作用，修改外部变量
let total = 0;
function addTotal(a) {
  total += a; // 修改外部变量
  return total;
}
```

## useReducer 的核心概念

### 1. Action

Action 是一个描述"发生了什么"的普通对象，必须包含 `type` 属性：

```javascript
// 基本 action
{ type: 'increment' }

// 带数据的 action
{ type: 'incrementByNum', payload: 5 }
```

### 2. Reducer

Reducer 是一个纯函数，接收当前状态和 action，返回新状态：

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      return {
        ...state,
        count: state.count - 1,
      };
    case "incrementByNum":
      return {
        ...state,
        count: state.count + parseInt(action.payload),
      };
    default:
      return state;
  }
};
```

### 3. Dispatch

Dispatch 函数用于派发 action，触发状态更新：

```javascript
// 派发基本 action
dispatch({ type: "increment" });

// 派发带数据的 action
dispatch({ type: "incrementByNum", payload: count });
```

## 完整示例

### 计数器示例

```javascript
import { useReducer } from "react";

// 初始状态
const initialState = {
  count: 0,
};

// Reducer 函数
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      return {
        ...state,
        count: state.count - 1,
      };
    case "incrementByNum":
      return {
        ...state,
        count: state.count + parseInt(action.payload),
      };
    default:
      return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <input type="text" onChange={(e) => setCount(e.target.value)} />
      <button
        onClick={() =>
          dispatch({
            type: "incrementByNum",
            payload: count,
          })
        }
      >
        incrementByNum
      </button>
    </div>
  );
}
```

## useReducer vs useState

### 何时使用 useState？

- 简单的状态管理
- 状态逻辑简单
- 组件内部状态

### 何时使用 useReducer？

- 复杂的状态逻辑
- 多个子值相互依赖
- 下一个状态依赖于之前的状态
- 需要可预测的状态更新

## 最佳实践

### 1. Action 命名规范

```javascript
// 使用描述性的 action 类型
{
  type: "USER_LOGIN_SUCCESS";
}
{
  type: "TODO_ADD";
}
{
  type: "TODO_TOGGLE";
}
```

### 2. 状态结构设计

```javascript
// 好的状态结构
const initialState = {
  todos: [],
  loading: false,
  error: null,
  filter: "all",
};

// 避免嵌套过深
const badState = {
  user: {
    profile: {
      personal: {
        name: "John",
      },
    },
  },
};
```

### 3. Reducer 函数组织

```javascript
// 按功能模块拆分 reducer
const todoReducer = (state, action) => {
  switch (action.type) {
    case "TODO_ADD":
      return { ...state, todos: [...state.todos, action.payload] };
    case "TODO_TOGGLE":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    default:
      return state;
  }
};
```

### 4. 使用 useReducer + useContext 进行全局状态管理

```javascript
// 创建 Context
const TodoContext = createContext();

// 创建 Provider 组件
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// 在组件中使用
function TodoList() {
  const { state, dispatch } = useContext(TodoContext);

  return (
    <div>
      {state.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

## 常见模式

### 1. 异步操作处理

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

### 2. 表单状态管理

```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};
```

## 总结

useReducer 是 React 中管理复杂状态的重要工具，它通过纯函数的方式确保状态更新的可预测性和一致性。在以下场景中特别有用：

- 状态逻辑复杂
- 多个状态相互依赖
- 需要可预测的状态更新
- 全局状态管理

通过合理使用 useReducer，可以构建更加健壮和可维护的 React 应用。

## 这篇博客已完成
