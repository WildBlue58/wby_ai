# useInterval

用 useRef 保存回调，避免闭包捕获旧值。 callback 闭包了
闭包陷阱使用useRef 可以搞定
useEffect 单独监听 callback，只更新引用，不重启定时器。
另一个 useEffect 管理定时器，依赖 delay。 暂停定时器 delay = null
delay 变化时或组件卸载时自动清除旧定时器，防止内存泄漏。
支持传 null 暂停定时器，实现灵活控制。
分离依赖，逻辑清晰，避免重复创建。
封装良好，可复用，是处理副作用的优秀实践。

## 功能特性

- **闭包陷阱解决**：使用 `useRef` 保存回调函数，避免闭包捕获旧值
- **灵活控制**：支持传入 `null` 来暂停定时器
- **自动清理**：组件卸载时自动清除定时器，防止内存泄漏
- **依赖分离**：将回调更新和定时器管理分离到不同的 `useEffect` 中

## 使用示例

```jsx
import useInterval from './hooks/useInterval';

function App() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  // 每秒增加 count
  useInterval(
    () => setCount((prev) => prev + 1),
    running ? 1000 : null // running=false 时暂停
  );

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setRunning(!running)}>
        {running ? "Pause" : "Start"}
      </button>
    </div>
  );
}
```

## 实现原理

1. **回调函数管理**：使用 `useRef` 保存最新的回调函数引用
2. **定时器管理**：根据 `delay` 参数创建或清除定时器
3. **依赖优化**：分离回调更新和定时器管理的依赖，避免不必要的重启

## 注意事项

- 传入 `null` 作为 `delay` 可以暂停定时器
- 组件卸载时会自动清理定时器
- 回调函数变化时不会重启定时器，只更新引用
