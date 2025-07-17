# reducer and context

- useReducer 的核心
  - 响应式状态管理
  - reducer 纯函数 状态生产 为状态的改变定规矩
  - initValue
  - dispatch 派发一个 action
    {type:'',payload:}
- useContext
  createContext 创建一个上下文
  Context.Provider 提供上下文
  useContext 获取上下文

- useContext(通信) + useReducer(响应式状态)
  跨层级全局 -> 应用(theme/login/todos/...) 状态管理

- 自定义 hook
  组件(渲染) + hook(状态)
- hook + useContext
  全局应用级别响应式状态
- hook + useContext + useReducer
  全局应用级别响应式状态管理

---

## 项目结构

```md
<code_block_to_apply_changes_from>
src/
  ├── App.jsx                // 应用入口，状态管理和组件挂载
  ├── TodoContext.js         // 创建全局上下文
  ├── components/
  │   ├── AddTodo.jsx        // 新增 Todo 输入组件
  │   └── TodoList.jsx       // Todo 列表组件
  ├── hooks/
  │   ├── useTodoContext.js  // 自定义 Hook，简化 Context 使用
  │   └── useTodos.js        // 自定义 Hook，封装 useReducer 逻辑
  └── reducers/
      └── todoReducer.js     // reducer 纯函数，定义状态变更规则
```

## 技术要点详解

### 1. useReducer 响应式状态管理

- `useReducer` 适合管理复杂状态或多状态联动的场景。
- reducer 纯函数，接收旧状态和 action，返回新状态，保证状态变更的可预测性和可追溯性。

```js
// reducers/todoReducer.js
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload,
          completed: false,
        },
      ];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "CLEAR_TODOS":
      return [];
    default:
      return state;
  }
}
```

### 2. useContext 实现全局状态共享

- `createContext` 创建全局上下文，`Provider` 提供状态，`useContext` 消费状态。
- 结合 `useReducer`，实现跨组件、跨层级的全局状态管理。

```js
// TodoContext.js
import { createContext } from "react";
export const TodoContext = createContext(null);
```

```js
// App.jsx
import { TodoContext } from "./TodoContext";
import { useTodos } from "./hooks/useTodos";
function App() {
  const todosHook = useTodos([]);
  return (
    <TodoContext.Provider value={todosHook}>{/* ... */}</TodoContext.Provider>
  );
}
```

### 3. 自定义 Hook 提升复用性

- `useTodos` 封装了所有与 Todo 相关的状态和操作，便于复用和测试。
- `useTodoContext` 简化了 Context 的消费，避免多层嵌套。

```js
// hooks/useTodos.js
import { useReducer } from "react";
import todoReducer from "../reducers/todoReducer";
export function useTodos(initial = []) {
  const [todos, dispatch] = useReducer(todoReducer, initial);
  const addTodo = (text) => dispatch({ type: "ADD_TODO", payload: text });
  const toggleTodo = (id) => dispatch({ type: "TOGGLE_TODO", payload: id });
  const clearTodos = () => dispatch({ type: "CLEAR_TODOS" });
  const removeTodo = (id) => dispatch({ type: "REMOVE_TODO", payload: id });
  return { todos, addTodo, removeTodo, toggleTodo, clearTodos };
}
```

```js
// hooks/useTodoContext.js
import { useContext } from "react";
import { TodoContext } from "../TodoContext";
export function useTodoContext() {
  return useContext(TodoContext);
}
```

### 4. 组件解耦与职责分明

- `AddTodo` 只负责输入和添加任务。
- `TodoList` 只负责展示、切换、删除、清空任务。
- 组件通过 Context 获取全局状态和操作，避免 props 层层传递。

```js
// components/AddTodo.jsx
const AddTodo = () => {
  const [text, setText] = useState("");
  const { addTodo } = useTodoContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};
```

```js
// components/TodoList.jsx
const TodoList = () => {
  const { todos, toggleTodo, removeTodo, clearTodos } = useTodoContext();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Remove</button>
          <button onClick={() => clearTodos()}>Clear</button>
        </li>
      ))}
    </ul>
  );
};
```

## 使用说明

1. 启动项目（假设已配置好 React 环境）：

   ```bash
   npm install
   npm start
   ```

2. 在输入框输入内容，点击“Add Todo”添加任务。
3. 点击任务可切换完成状态，点击“Remove”删除单个任务，点击“Clear”清空所有任务。

## 进阶思考

- 可以将 todos 状态持久化到 localStorage，实现刷新页面数据不丢失。
- 支持任务编辑、优先级、分类等功能，进一步扩展 reducer 的能力。
- 结合 useMemo、useCallback 优化性能，避免不必要的渲染。

## 总结

本项目通过 `useReducer` + `useContext` + 自定义 Hook，实现了一个高内聚、低耦合、可扩展的全局状态管理方案，适合中大型 React 应用的状态管理需求。
