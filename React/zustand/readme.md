# 全家桶开发之 Zustand 状态管理

- 现代前端开发模式
  - UI 组件 + 全局应用状态管理
- 轻巧，hooks 化的状态管理库

  - count 响应式状态
  - 全局应用管理
    useContext + useReducer + React.createContext
  - redux/zustand 简化

- 小项目 store 没必要
- 中大型项目 router store 配上
  react-router-dom
  zustand
  全部都用状态管理 UI 组件
  组件状态 收归中央管理(store)统一管理

---

## 一、Zustand 简介

Zustand 是一个轻量级、hooks 化的 React 状态管理库，API 简洁，易于上手，适合中小型项目，也能胜任大型项目的全局状态管理。

- 无需 Provider，直接在组件中使用
- 支持中间件、持久化等高级用法
- 适合替代 Redux、Context+Reducer 方案

## 二、Zustand 基本用法

### 1. 安装

```bash
npm install zustand
```

### 2. 创建 Store

以计数器为例：

```js
// src/store/count.js
import { create } from "zustand";

export const useCounterStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  getCount: () => get().count,
}));
```

### 3. 在组件中使用 Store

```jsx
// src/components/Counter/index.jsx
import { useCounterStore } from "../../store/count";

const Counter = () => {
  const { count, increment, decrement } = useCounterStore();
  return (
    <div>
      <h1>Love❤️Xiang: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
```

## 三、Zustand 实战案例

### 1. 计数器（Counter）

- 全局响应式状态管理
- 多组件共享同一份状态

```jsx
// src/App.jsx
import { useCounterStore } from "./store/count";
import Counter from "./components/Counter";

function App() {
  const { count, increment, decrement } = useCounterStore();
  return (
    <>
      <h1>App 中的 Love❤️Xiang: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <Counter />
    </>
  );
}

export default App;
```

### 2. TodoList 全局状态管理

- 任务列表的增删改查
- 状态集中管理，组件间共享

```js
// src/store/todos.js
import { create } from "zustand";

export const useTodosStore = create((set) => ({
  todos: [
    { id: 1, text: "Love Xiang Forever❤️", completed: false },
    { id: 2, text: "❤️Forever Love Xiang", completed: false },
  ],
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: state.todos.length + 1, text, completed: false },
      ],
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
}));
```

```jsx
// src/components/TodoList/index.jsx
import { useTodosStore } from "../../store/todos";

const TodoList = () => {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodosStore();
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button onClick={() => addTodo(todo.text)}>Add</button>
            <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          </li>
        ))}
      </ul>
      <input type="text" />
    </div>
  );
};

export default TodoList;
```

### 3. Github Repo 列表（异步请求+全局状态）

- 结合 axios 异步请求
- 全局 loading/error 状态

```js
// src/api/config.js
import axios from "axios";
axios.defaults.baseURL = "https://api.github.com";
export default axios;

// src/api/repo.js
import axios from "./config";
export const getRepos = async (owner, repo) =>
  await axios.get(`/repos/${owner}/${repo}`);
export const getRepoList = async (owner) =>
  await axios.get(`/users/${owner}/repos`);
```

```js
// src/store/repos.js
import { create } from "zustand";
import { getRepoList } from "../api/repo";

export const useReposStore = create((set) => ({
  repos: [],
  loading: false,
  error: null,
  fetchRepos: async (owner) => {
    set({ loading: true, error: null });
    try {
      const response = await getRepoList(owner);
      set({ repos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

```jsx
// src/components/RepoList/index.jsx
import { useReposStore } from "../../store/repos";
import { useEffect } from "react";

const RepoList = () => {
  const { repos, loading, error, fetchRepos } = useReposStore();
  useEffect(() => {
    fetchRepos("WildBlue58");
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>Repo List</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <p>{repo.description || "No description"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoList;
```

## 四、总结

- Zustand 让 React 状态管理变得简单高效
- 适合中小型项目的全局状态管理
- 支持异步、模块化、组合式开发

---

> 以上为基于实际代码的 Zustand 实战案例，适合用于博客撰写和学习参考。
