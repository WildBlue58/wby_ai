import React, { useState, useEffect } from "react";

/**
 * ❌ 错误示例 1：在条件语句中使用 useState
 *
 * 问题分析：
 * - 当 show 为 true 时，调用顺序为：[0] useState, [1] useEffect
 * - 当 show 为 false 时，调用顺序为：[0] useEffect
 * - 顺序不一致，React 会读取错误的状态值
 *
 * 错误信息：
 * Warning: React has detected a change in the order of Hooks called by App.
 * This will lead to bugs and errors if not fixed.
 */
function BadExample1({ show }) {
  // ❌ 错误：在条件语句中调用 Hook
  if (show) {
    useState(0); // 这个 Hook 的调用是条件性的
  }

  useEffect(() => {
    console.log("effect");
  }, []);

  return <div>BadExample1</div>;
}

/**
 * ✅ 正确示例 1：始终调用 Hook，在 JSX 中处理条件
 *
 * 解决方案：
 * - 始终在组件顶层调用 useState
 * - 在渲染逻辑中根据 show 决定是否显示内容
 * - 保证每次渲染时 Hooks 调用顺序一致
 */
function GoodExample1({ show }) {
  // ✅ 正确：始终调用 Hook
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
  }, []);

  // 在返回的 JSX 中处理条件渲染
  return (
    <div>
      <h3>GoodExample1</h3>
      {show && (
        <div>
          <p>计数: {count}</p>
          <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
      )}
      {!show && <p>内容已隐藏</p>}
    </div>
  );
}

/**
 * ❌ 错误示例 2：在循环中使用 Hook
 *
 * 问题分析：
 * - items 数组长度可能变化
 * - 导致 Hook 调用次数不一致
 * - 违反了 Hooks 规则
 */
function BadExample2({ items }) {
  // ❌ 错误：在循环中调用 Hook
  for (let i = 0; i < items.length; i++) {
    const [state, setState] = useState(items[i]);
  }

  return <div>BadExample2</div>;
}

/**
 * ✅ 正确示例 2：使用单个状态管理数组
 *
 * 解决方案：
 * - 用一个 state 存储整个数组
 * - 通过 map 渲染列表项
 * - 保持 Hook 调用次数不变
 */
function GoodExample2({ initialItems }) {
  // ✅ 正确：使用单个状态存储数组
  const [items, setItems] = useState(initialItems);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>GoodExample2</h3>
      <button onClick={addItem}>添加项目</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ❌ 错误示例 3：在嵌套函数/回调中使用 Hook
 *
 * 问题分析：
 * - Hook 在事件处理函数中调用
 * - 不是在组件顶层调用
 * - 每次点击都会创建新的 Hook
 */
function BadExample3() {
  const handleClick = () => {
    // ❌ 错误：在回调函数中调用 Hook
    const [count, setCount] = useState(0);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>点击</button>;
}

/**
 * ✅ 正确示例 3：在顶层调用 Hook
 *
 * 解决方案：
 * - Hook 在组件顶层调用
 * - 在事件处理函数中使用 state
 * - 符合 Hooks 使用规则
 */
function GoodExample3() {
  // ✅ 正确：在组件顶层调用 Hook
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 在回调中使用 state，而不是调用 Hook
    setCount(count + 1);
  };

  return (
    <div>
      <h3>GoodExample3</h3>
      <p>点击次数: {count}</p>
      <button onClick={handleClick}>点击</button>
    </div>
  );
}

/**
 * ❌ 错误示例 4：在条件语句后使用 Hook
 *
 * 问题分析：
 * - 虽然 useState 本身不在条件内
 * - 但提前返回会导致后面的 Hook 不执行
 * - 不同渲染周期 Hook 数量不一致
 */
function BadExample4({ isError }) {
  // 提前返回
  if (isError) {
    return <div>出错了</div>;
  }

  // ❌ 错误：在可能的提前返回之后调用 Hook
  const [data, setData] = useState(null);

  return <div>{data}</div>;
}

/**
 * ✅ 正确示例 4：所有 Hook 在条件判断之前调用
 *
 * 解决方案：
 * - 所有 Hook 在最顶层调用
 * - 提前返回放在所有 Hook 之后
 * - 保证 Hook 调用次数一致
 */
function GoodExample4({ isError }) {
  // ✅ 正确：在任何条件判断之前调用所有 Hook
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isError) {
      setLoading(true);
      // 模拟数据加载
      setTimeout(() => {
        setData("加载的数据");
        setLoading(false);
      }, 1000);
    }
  }, [isError]);

  // 条件返回放在所有 Hook 之后
  if (isError) {
    return <div>❌ 出错了</div>;
  }

  if (loading) {
    return <div>⏳ 加载中...</div>;
  }

  return <div>✅ 数据: {data}</div>;
}

/**
 * ✅ 正确示例 5：条件逻辑放在 useEffect 内部
 *
 * 最佳实践：
 * - Hook 始终调用
 * - 条件判断在 Hook 内部处理
 * - 通过依赖项控制执行时机
 */
function GoodExample5({ shouldFetch, userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // ✅ 正确：始终调用 useEffect，条件判断在内部
  useEffect(() => {
    // 条件逻辑在 effect 内部
    if (!shouldFetch) {
      return;
    }

    // 模拟 API 请求
    const fetchUser = async () => {
      try {
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();

        // 模拟数据
        setTimeout(() => {
          setUser({ id: userId, name: "张三", age: 25 });
        }, 500);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [shouldFetch, userId]); // 依赖项数组

  if (error) {
    return <div>❌ 错误: {error}</div>;
  }

  if (!shouldFetch) {
    return <div>⚠️ 暂不获取数据</div>;
  }

  if (!user) {
    return <div>⏳ 加载中...</div>;
  }

  return (
    <div>
      <h3>GoodExample5</h3>
      <p>用户ID: {user.id}</p>
      <p>姓名: {user.name}</p>
      <p>年龄: {user.age}</p>
    </div>
  );
}

/**
 * 📚 总结和对比演示组件
 */
function HooksRulesDemo() {
  const [showBad, setShowBad] = useState(false);
  const [showGood, setShowGood] = useState(true);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>React Hooks 使用规则演示</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>❌ 错误示例</h2>
        <label>
          <input
            type="checkbox"
            checked={showBad}
            onChange={(e) => setShowBad(e.target.checked)}
          />
          显示错误示例（可能导致警告）
        </label>
        {/* 注意：实际使用时这些会导致 React 警告 */}
        {/* {showBad && <BadExample1 show={true} />} */}
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>✅ 正确示例</h2>
        <label>
          <input
            type="checkbox"
            checked={showGood}
            onChange={(e) => setShowGood(e.target.checked)}
          />
          显示正确示例
        </label>
        {showGood && (
          <div
            style={{
              border: "2px solid green",
              padding: "15px",
              marginTop: "10px",
            }}
          >
            <GoodExample1 show={true} />
            <hr />
            <GoodExample2 initialItems={["Item 1", "Item 2"]} />
            <hr />
            <GoodExample3 />
            <hr />
            <GoodExample4 isError={false} />
            <hr />
            <GoodExample5 shouldFetch={true} userId={123} />
          </div>
        )}
      </section>

      <section
        style={{
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>🎯 核心要点</h3>
        <ul>
          <li>✅ 始终在组件最顶层调用 Hooks</li>
          <li>✅ 始终以相同顺序调用 Hooks</li>
          <li>✅ 只在 React 函数组件或自定义 Hooks 中调用</li>
          <li>❌ 不要在条件语句中调用 Hooks</li>
          <li>❌ 不要在循环中调用 Hooks</li>
          <li>❌ 不要在嵌套函数中调用 Hooks</li>
        </ul>
      </section>
    </div>
  );
}

export default HooksRulesDemo;
