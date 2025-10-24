import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  createContext,
} from "react";

/**
 * ==========================================
 * React 常用 Hooks 详细教程
 * ==========================================
 *
 * 这个文件详细介绍了 React 中最常用的 Hooks
 * 包括：useState, useEffect, useContext, useReducer,
 *      useCallback, useMemo, useRef
 */

// ============================================
// 1. useState - 状态管理
// ============================================

/**
 * useState 基础示例
 *
 * 功能：为函数组件添加状态
 * 语法：const [state, setState] = useState(initialValue)
 *
 * 特点：
 * - 返回当前状态和更新函数
 * - 可以存储任何类型的值
 * - 更新状态会触发组件重新渲染
 */
function UseStateExample() {
  // 基本用法
  const [count, setCount] = useState(0);

  // 存储对象
  const [user, setUser] = useState({ name: "张三", age: 25 });

  // 存储数组
  const [todos, setTodos] = useState(["学习 React", "写代码"]);

  // 惰性初始化（只在首次渲染时执行）
  const [expensiveValue, setExpensiveValue] = useState(() => {
    console.log("只执行一次的计算");
    return Array.from({ length: 1000 }).reduce((a, b) => a + 1, 0);
  });

  return (
    <div
      style={{ padding: "20px", border: "2px solid #4CAF50", margin: "10px" }}
    >
      <h3>1️⃣ useState 示例</h3>

      {/* 基本计数器 */}
      <div style={{ marginBottom: "15px" }}>
        <h4>基本计数器：</h4>
        <p>当前计数: {count}</p>
        <button onClick={() => setCount(count + 1)}>增加</button>
        <button
          onClick={() => setCount(count - 1)}
          style={{ marginLeft: "5px" }}
        >
          减少
        </button>
        <button onClick={() => setCount(0)} style={{ marginLeft: "5px" }}>
          重置
        </button>
      </div>

      {/* 对象状态 */}
      <div style={{ marginBottom: "15px" }}>
        <h4>对象状态：</h4>
        <p>
          姓名: {user.name}, 年龄: {user.age}
        </p>
        <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
          增加年龄
        </button>
      </div>

      {/* 数组状态 */}
      <div>
        <h4>数组状态：</h4>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
        <button
          onClick={() => setTodos([...todos, `任务 ${todos.length + 1}`])}
        >
          添加任务
        </button>
      </div>
    </div>
  );
}

// ============================================
// 2. useEffect - 副作用处理
// ============================================

/**
 * useEffect 完整示例
 *
 * 功能：处理副作用（数据获取、订阅、DOM 操作等）
 * 语法：useEffect(effectFunction, dependencies)
 *
 * 依赖项说明：
 * - 不传：每次渲染都执行
 * - []：只在挂载时执行一次
 * - [dep1, dep2]：依赖变化时执行
 */
function UseEffectExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // 1. 无依赖项：每次渲染都执行
  useEffect(() => {
    console.log("组件渲染了");
  });

  // 2. 空依赖项：只在挂载时执行一次
  useEffect(() => {
    console.log("组件挂载了");

    // 清理函数：在组件卸载时执行
    return () => {
      console.log("组件卸载了");
    };
  }, []);

  // 3. 有依赖项：依赖变化时执行
  useEffect(() => {
    console.log("count 变化了:", count);
    document.title = `点击了 ${count} 次`;
  }, [count]);

  // 4. 数据获取示例
  useEffect(() => {
    if (name) {
      console.log("搜索用户:", name);
      // 这里可以调用 API
    }
  }, [name]);

  // 5. 订阅示例（带清理）
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("定时器执行");
    }, 5000);

    // 清理定时器
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{ padding: "20px", border: "2px solid #2196F3", margin: "10px" }}
    >
      <h3>2️⃣ useEffect 示例</h3>

      <div style={{ marginBottom: "15px" }}>
        <p>点击次数: {count}</p>
        <button onClick={() => setCount(count + 1)}>点击</button>
        <p style={{ fontSize: "12px", color: "#666" }}>
          提示：查看浏览器标题和控制台输出
        </p>
      </div>

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入姓名搜索"
        />
        <p style={{ fontSize: "12px", color: "#666" }}>
          提示：输入内容查看控制台
        </p>
      </div>
    </div>
  );
}

// ============================================
// 3. useContext - 跨组件传值
// ============================================

// 创建 Context
const ThemeContext = createContext("light");
const UserContext = createContext(null);

/**
 * useContext 示例
 *
 * 功能：跨组件层级传递数据，避免 props 层层传递
 * 语法：const value = useContext(MyContext)
 *
 * 优势：
 * - 避免 prop drilling（属性钻取）
 * - 全局状态共享
 * - 主题、语言等全局配置
 */
function UseContextExample() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({ name: "李四", role: "admin" });

  return (
    <div
      style={{ padding: "20px", border: "2px solid #FF9800", margin: "10px" }}
    >
      <h3>3️⃣ useContext 示例</h3>

      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        切换主题
      </button>

      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={user}>
          <ChildComponent />
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

function ChildComponent() {
  // 使用 Context
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);

  const styles = {
    padding: "15px",
    marginTop: "10px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
  };

  return (
    <div style={styles}>
      <p>当前主题: {theme}</p>
      <p>
        用户信息: {user.name} ({user.role})
      </p>
      <GrandChildComponent />
    </div>
  );
}

function GrandChildComponent() {
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{ padding: "10px", border: "1px dashed #ccc", marginTop: "10px" }}
    >
      <p>孙组件也能访问 Context: {theme}</p>
    </div>
  );
}

// ============================================
// 4. useReducer - 复杂状态管理
// ============================================

/**
 * useReducer 示例
 *
 * 功能：管理复杂的状态逻辑
 * 语法：const [state, dispatch] = useReducer(reducer, initialState)
 *
 * 适用场景：
 * - 状态逻辑复杂
 * - 多个子值
 * - 下一个状态依赖于前一个状态
 */

// Reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    case "set":
      return { count: action.payload };
    default:
      throw new Error("未知的 action 类型");
  }
}

function UseReducerExample() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div
      style={{ padding: "20px", border: "2px solid #9C27B0", margin: "10px" }}
    >
      <h3>4️⃣ useReducer 示例</h3>

      <p style={{ fontSize: "24px" }}>计数: {state.count}</p>

      <button onClick={() => dispatch({ type: "increment" })}>增加</button>
      <button
        onClick={() => dispatch({ type: "decrement" })}
        style={{ marginLeft: "5px" }}
      >
        减少
      </button>
      <button
        onClick={() => dispatch({ type: "reset" })}
        style={{ marginLeft: "5px" }}
      >
        重置
      </button>
      <button
        onClick={() => dispatch({ type: "set", payload: 100 })}
        style={{ marginLeft: "5px" }}
      >
        设为 100
      </button>
    </div>
  );
}

// ============================================
// 5. useCallback - 函数缓存
// ============================================

/**
 * useCallback 示例
 *
 * 功能：缓存函数，避免子组件不必要的重新渲染
 * 语法：const memoizedCallback = useCallback(fn, dependencies)
 *
 * 使用场景：
 * - 函数作为 props 传递给子组件
 * - 函数作为 useEffect 的依赖
 */
function UseCallbackExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 不使用 useCallback：每次渲染都创建新函数
  const handleClick1 = () => {
    console.log("点击了", count);
  };

  // 使用 useCallback：只在 count 变化时创建新函数
  const handleClick2 = useCallback(() => {
    console.log("点击了", count);
  }, [count]);

  return (
    <div
      style={{ padding: "20px", border: "2px solid #00BCD4", margin: "10px" }}
    >
      <h3>5️⃣ useCallback 示例</h3>

      <div style={{ marginBottom: "15px" }}>
        <p>计数: {count}</p>
        <button onClick={() => setCount(count + 1)}>增加计数</button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本（不会触发子组件重渲染）"
        />
      </div>

      <MemoizedChild onClick={handleClick2} />
    </div>
  );
}

// 使用 React.memo 优化的子组件
const MemoizedChild = React.memo(({ onClick }) => {
  console.log("子组件渲染了");

  return (
    <div style={{ padding: "10px", backgroundColor: "#e0f7fa" }}>
      <p>我是子组件</p>
      <button onClick={onClick}>触发父组件函数</button>
      <p style={{ fontSize: "12px", color: "#666" }}>
        提示：输入文本时我不会重新渲染
      </p>
    </div>
  );
});

// ============================================
// 6. useMemo - 值缓存
// ============================================

/**
 * useMemo 示例
 *
 * 功能：缓存计算结果，避免重复计算
 * 语法：const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
 *
 * 使用场景：
 * - 复杂计算
 * - 大量数据处理
 * - 对象或数组的引用稳定性
 */
function UseMemoExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 不使用 useMemo：每次渲染都计算
  const expensiveValue1 = (() => {
    console.log("计算 expensiveValue1");
    let sum = 0;
    for (let i = 0; i < count * 100000; i++) {
      sum += i;
    }
    return sum;
  })();

  // 使用 useMemo：只在 count 变化时计算
  const expensiveValue2 = useMemo(() => {
    console.log("计算 expensiveValue2");
    let sum = 0;
    for (let i = 0; i < count * 100000; i++) {
      sum += i;
    }
    return sum;
  }, [count]);

  return (
    <div
      style={{ padding: "20px", border: "2px solid #E91E63", margin: "10px" }}
    >
      <h3>6️⃣ useMemo 示例</h3>

      <div style={{ marginBottom: "15px" }}>
        <p>计数: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          增加计数（会触发计算）
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本（查看控制台）"
        />
        <p style={{ fontSize: "12px", color: "#666" }}>
          提示：输入文本时，只有 useMemo 的值不会重新计算
        </p>
      </div>

      <p>计算结果: {expensiveValue2.toLocaleString()}</p>
    </div>
  );
}

// ============================================
// 7. useRef - 引用和 DOM 访问
// ============================================

/**
 * useRef 示例
 *
 * 功能：
 * 1. 访问 DOM 元素
 * 2. 保存可变值（不会触发重新渲染）
 *
 * 语法：const refContainer = useRef(initialValue)
 *
 * 特点：
 * - .current 属性可变
 * - 修改不触发重新渲染
 * - 在整个组件生命周期内保持不变
 */
function UseRefExample() {
  const [count, setCount] = useState(0);

  // 1. 访问 DOM 元素
  const inputRef = useRef(null);
  const divRef = useRef(null);

  // 2. 保存可变值
  const renderCount = useRef(0);
  const previousCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    previousCount.current = count;
  });

  const focusInput = () => {
    inputRef.current.focus();
  };

  const scrollToDiv = () => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{ padding: "20px", border: "2px solid #607D8B", margin: "10px" }}
    >
      <h3>7️⃣ useRef 示例</h3>

      {/* DOM 访问 */}
      <div style={{ marginBottom: "15px" }}>
        <h4>1. 访问 DOM 元素：</h4>
        <input ref={inputRef} type="text" placeholder="点击按钮聚焦我" />
        <button onClick={focusInput} style={{ marginLeft: "5px" }}>
          聚焦输入框
        </button>
      </div>

      {/* 保存可变值 */}
      <div style={{ marginBottom: "15px" }}>
        <h4>2. 保存可变值：</h4>
        <p>当前计数: {count}</p>
        <p>上一次计数: {previousCount.current}</p>
        <p>渲染次数: {renderCount.current}</p>
        <button onClick={() => setCount(count + 1)}>增加计数</button>
      </div>

      {/* 滚动示例 */}
      <div
        style={{
          height: "200px",
          overflow: "auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ height: "150px" }}>向下滚动...</div>
        <div
          ref={divRef}
          style={{ padding: "20px", backgroundColor: "#ffeb3b" }}
        >
          目标位置
        </div>
        <div style={{ height: "150px" }}>...</div>
      </div>
      <button onClick={scrollToDiv} style={{ marginTop: "10px" }}>
        滚动到目标位置
      </button>
    </div>
  );
}

// ============================================
// 主演示组件
// ============================================

function CommonHooksDemo() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        🎣 React 常用 Hooks 完整教程
      </h1>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>📚 Hooks 快速对比</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Hook</th>
              <th style={{ padding: "10px", textAlign: "left" }}>用途</th>
              <th style={{ padding: "10px", textAlign: "left" }}>何时使用</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useState
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                状态管理
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                需要组件状态
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useEffect
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                副作用处理
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                数据获取、订阅、DOM 操作
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useContext
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                跨组件传值
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                避免 props 层层传递
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useReducer
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                复杂状态管理
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                状态逻辑复杂
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useCallback
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                函数缓存
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                优化子组件渲染
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                useMemo
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                值缓存
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                避免重复计算
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>useRef</td>
              <td style={{ padding: "10px" }}>引用和 DOM</td>
              <td style={{ padding: "10px" }}>访问 DOM 或保存可变值</td>
            </tr>
          </tbody>
        </table>
      </div>

      <UseStateExample />
      <UseEffectExample />
      <UseContextExample />
      <UseReducerExample />
      <UseCallbackExample />
      <UseMemoExample />
      <UseRefExample />

      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>🎯 学习建议</h2>
        <ol>
          <li>
            <strong>从基础开始：</strong>先掌握 useState 和 useEffect
          </li>
          <li>
            <strong>理解原理：</strong>了解每个 Hook 解决什么问题
          </li>
          <li>
            <strong>实践练习：</strong>在项目中多使用
          </li>
          <li>
            <strong>性能优化：</strong>合理使用 useCallback 和 useMemo
          </li>
          <li>
            <strong>遵守规则：</strong>始终遵守 Hooks 使用规则
          </li>
        </ol>
      </div>
    </div>
  );
}

export default CommonHooksDemo;
