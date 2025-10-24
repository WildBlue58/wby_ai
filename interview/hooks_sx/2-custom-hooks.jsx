import { useState, useEffect, useCallback, useRef } from "react";

/**
 * ==========================================
 * 自定义 Hooks 最佳实践示例
 * ==========================================
 *
 * 这个文件展示了如何创建和使用自定义 Hooks
 * 自定义 Hooks 可以复用逻辑，让代码更简洁
 */

/**
 * 自定义 Hook 1：useLocalStorage
 *
 * 功能：将状态同步到 localStorage
 * 用途：持久化存储数据，刷新页面后数据不丢失
 *
 * @param {string} key - localStorage 的键名
 * @param {any} initialValue - 初始值
 * @returns {[any, Function]} - [值, 设置值的函数]
 */
function useLocalStorage(key, initialValue) {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("读取 localStorage 失败:", error);
      return initialValue;
    }
  });

  // 更新 localStorage 和状态
  const setValue = (value) => {
    try {
      // 支持函数式更新
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("保存到 localStorage 失败:", error);
    }
  };

  return [storedValue, setValue];
}

// 使用示例
function LocalStorageExample() {
  const [name, setName] = useLocalStorage("user-name", "");
  const [age, setAge] = useLocalStorage("user-age", 0);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>📦 useLocalStorage 示例</h3>
      <p>刷新页面后数据依然保存</p>

      <div>
        <label>
          姓名：
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入姓名"
          />
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          年龄：
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="输入年龄"
          />
        </label>
      </div>

      <div style={{ marginTop: "10px", color: "#666" }}>
        <p>
          存储的数据：姓名={name}, 年龄={age}
        </p>
      </div>
    </div>
  );
}

/**
 * 自定义 Hook 2：useDebounce
 *
 * 功能：防抖，延迟更新值
 * 用途：搜索框输入、滚动事件等需要减少触发频率的场景
 *
 * @param {any} value - 需要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {any} - 防抖后的值
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用示例
function DebounceExample() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchCount, setSearchCount] = useState(0);

  // 当防抖后的搜索词变化时触发搜索
  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchCount((prev) => prev + 1);
      console.log("执行搜索:", debouncedSearchTerm);
      // 这里可以调用 API 进行搜索
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>⏱️ useDebounce 示例</h3>
      <p>输入后 500ms 才会触发搜索</p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="输入搜索关键词"
        style={{ width: "300px", padding: "8px" }}
      />

      <div style={{ marginTop: "10px", color: "#666" }}>
        <p>即时输入值：{searchTerm}</p>
        <p>防抖后的值：{debouncedSearchTerm}</p>
        <p>搜索执行次数：{searchCount}</p>
      </div>
    </div>
  );
}

/**
 * 自定义 Hook 3：useFetch
 *
 * 功能：封装数据请求逻辑
 * 用途：简化 API 调用，统一处理加载和错误状态
 *
 * @param {string} url - 请求地址
 * @returns {object} - { data, loading, error, refetch }
 */
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟 API 请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 实际使用时取消注释：
      // const response = await fetch(url);
      // const result = await response.json();

      // 模拟数据
      const result = {
        id: 1,
        title: "示例数据",
        description: "这是从 API 获取的模拟数据",
      };

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 使用示例
function FetchExample() {
  const { data, loading, error, refetch } = useFetch("/api/data");

  if (loading) return <div style={{ padding: "20px" }}>⏳ 加载中...</div>;
  if (error)
    return (
      <div style={{ padding: "20px", color: "red" }}>❌ 错误: {error}</div>
    );

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>🌐 useFetch 示例</h3>

      {data && (
        <div>
          <p>
            <strong>ID:</strong> {data.id}
          </p>
          <p>
            <strong>标题:</strong> {data.title}
          </p>
          <p>
            <strong>描述:</strong> {data.description}
          </p>
        </div>
      )}

      <button
        onClick={refetch}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        重新加载
      </button>
    </div>
  );
}

/**
 * 自定义 Hook 4：useToggle
 *
 * 功能：管理布尔值状态的切换
 * 用途：开关、显示/隐藏等场景
 *
 * @param {boolean} initialValue - 初始值
 * @returns {[boolean, Function]} - [值, 切换函数]
 */
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}

// 使用示例
function ToggleExample() {
  const [isVisible, toggleVisible] = useToggle(true);
  const [isEnabled, toggleEnabled] = useToggle(false);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>🔄 useToggle 示例</h3>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={toggleVisible}>
          {isVisible ? "隐藏" : "显示"}内容
        </button>
        {isVisible && (
          <p
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#e8f4f8",
            }}
          >
            这是可以切换显示/隐藏的内容
          </p>
        )}
      </div>

      <div>
        <button onClick={toggleEnabled}>
          {isEnabled ? "禁用" : "启用"}功能
        </button>
        <p style={{ marginTop: "10px", color: isEnabled ? "green" : "gray" }}>
          功能状态: {isEnabled ? "✅ 已启用" : "❌ 已禁用"}
        </p>
      </div>
    </div>
  );
}

/**
 * 自定义 Hook 5：usePrevious
 *
 * 功能：获取上一次的值
 * 用途：对比前后值的变化
 *
 * @param {any} value - 当前值
 * @returns {any} - 上一次的值
 */
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 使用示例
function PreviousExample() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>⏮️ usePrevious 示例</h3>

      <div style={{ fontSize: "24px", margin: "20px 0" }}>
        <p>
          当前值: <strong>{count}</strong>
        </p>
        <p>
          上一次的值: <strong>{previousCount ?? "无"}</strong>
        </p>
      </div>

      <div>
        <button
          onClick={() => setCount(count + 1)}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          增加
        </button>
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: "8px 16px" }}
        >
          减少
        </button>
      </div>

      {previousCount !== undefined && (
        <p style={{ marginTop: "10px", color: "#666" }}>
          变化:{" "}
          {count > previousCount
            ? "📈 增加"
            : count < previousCount
            ? "📉 减少"
            : "➡️ 不变"}
          ({previousCount} → {count})
        </p>
      )}
    </div>
  );
}

/**
 * 自定义 Hook 6：useWindowSize
 *
 * 功能：获取窗口尺寸
 * 用途：响应式布局、移动端适配
 *
 * @returns {object} - { width, height }
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// 使用示例
function WindowSizeExample() {
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>📐 useWindowSize 示例</h3>
      <p>尝试调整浏览器窗口大小</p>

      <div style={{ fontSize: "18px", marginTop: "10px" }}>
        <p>
          窗口宽度: <strong>{width}px</strong>
        </p>
        <p>
          窗口高度: <strong>{height}px</strong>
        </p>
        <p>
          设备类型:{" "}
          <strong>
            {width < 768 ? "📱 移动设备" : width < 1024 ? "📱 平板" : "💻 桌面"}
          </strong>
        </p>
      </div>
    </div>
  );
}

/**
 * 主演示组件
 */
function CustomHooksDemo() {
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
        🎣 自定义 Hooks 完整示例
      </h1>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>📖 什么是自定义 Hook？</h2>
        <p>
          自定义 Hook 是以 "use" 开头的 JavaScript 函数，可以在其中调用其他
          Hooks。
        </p>
        <p>它可以让你在组件间复用状态逻辑，而不需要改变组件结构。</p>
      </div>

      <LocalStorageExample />
      <DebounceExample />
      <FetchExample />
      <ToggleExample />
      <PreviousExample />
      <WindowSizeExample />

      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2>🎯 自定义 Hook 的优势</h2>
        <ul>
          <li>
            ✅ <strong>代码复用：</strong>将重复的逻辑抽取成独立的 Hook
          </li>
          <li>
            ✅ <strong>关注点分离：</strong>不同的功能用不同的 Hook 管理
          </li>
          <li>
            ✅ <strong>可测试性：</strong>自定义 Hook 可以独立测试
          </li>
          <li>
            ✅ <strong>可组合性：</strong>自定义 Hook 可以互相调用
          </li>
          <li>
            ✅ <strong>清晰的命名：</strong>见名知意，提高代码可读性
          </li>
        </ul>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
          border: "1px solid #ffc107",
        }}
      >
        <h2>⚠️ 注意事项</h2>
        <ul>
          <li>自定义 Hook 必须以 "use" 开头</li>
          <li>自定义 Hook 内部可以调用其他 Hooks</li>
          <li>自定义 Hook 必须遵守 Hooks 规则</li>
          <li>自定义 Hook 不共享状态，每次调用都创建独立的状态</li>
        </ul>
      </div>
    </div>
  );
}

export default CustomHooksDemo;
