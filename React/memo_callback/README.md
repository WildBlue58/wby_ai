# 性能优化 Hook

- 父子组件渲染顺序
  - 执行的时候先外到内 组件树
  - 完成渲染 完成组件的挂载 先内到外
- Button 组件该不该重新渲染?

  - 父组件局部，count 改变和 Button 组件没有关系
    Button JSX 不重新渲染 重绘重排
  - 性能优化
    响应式和性能 非常好
    切分组件 热更新
    组件之间独立
    子组件 React.memo
    createContext useContext 所有的状态全部给一个 Context 好吗?
    不好，性能 所有状态都是通过一个 reducer 生成

- 组件划分的粒度
  - 组件拆分 单向数据流
  - 就负责渲染的子组件(props + jsx)
  - 复用，好管理之外 提升性能
  - 状态更新后组件函数要重新运行
  - useCallback + React.memo 性能优化

---

## memo、useMemo、useCallback 技术详解

### 1. React.memo

- **作用**：高阶组件，用于包裹函数组件，实现组件的“记忆化”，只有 props 发生变化时才会重新渲染。
- **原理**：对比前后 props，如果没有变化则跳过渲染，提升性能。
- **适用场景**：
  - 组件依赖的 props 很少变化
  - 父组件频繁更新但子组件无需每次都渲染
- **注意事项**：
  - 只对 props 浅比较，复杂对象需自定义对比
- **示例**：

  ```jsx
  import { memo } from "react";
  const Button = ({ num }) => <button>{num}</button>;
  export default memo(Button);
  ```

### 2. useMemo

- **作用**：缓存一个计算开销较大的值，只有依赖项变化时才重新计算。
- **原理**：依赖数组不变时，返回上一次缓存的值，避免重复计算。
- **适用场景**：
  - 复杂计算、数据处理等性能瓶颈
  - 依赖项变化频率低
- **注意事项**：
  - 依赖项要写全，否则可能出现“脏数据”
- **示例**：

  ```jsx
  const result = useMemo(() => expensiveComputation(num), [num]);
  ```

### 3. useCallback

- **作用**：缓存一个回调函数，只有依赖项变化时才重新生成函数实例。
- **原理**：依赖数组不变时，返回上一次缓存的函数引用，避免子组件不必要的渲染。
- **适用场景**：
  - 需要将回调函数传递给子组件，且子组件用 React.memo 包裹
  - 避免因函数引用变化导致子组件重复渲染
- **注意事项**：
  - 依赖项要写全，否则闭包内变量可能不是最新值
- **示例**：

  ```jsx
  const handleClick = useCallback(() => {
    console.log("handleClick");
  }, [num]);
  <Button onClick={handleClick} />;
  ```

### 4. 结合使用场景

- 父组件中用 useMemo 缓存计算结果，用 useCallback 缓存事件处理函数，子组件用 React.memo 包裹，实现最大化性能优化。
- 代码示例：

  ```jsx
  // App.jsx
  const result = useMemo(() => expensiveComputation(num), [num]);
  const handleClick = useCallback(() => {
    /* ... */
  }, [num]);
  <Button num={num} onClick={handleClick} />;
  // Button.jsx
  export default memo(Button);
  ```

### 5. 总结

- memo、useMemo、useCallback 是 React 性能优化的三大利器，合理使用可显著减少不必要的渲染和计算，提高应用性能。

## 这篇博客已写完
