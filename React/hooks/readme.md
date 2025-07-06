# React Hooks 编程

## useState Hook
- 非常好用的函数式编程
  - 函数是一等对象(JS)
  - 函数还是类(JS 原型式面向对象)
  - 函数也是组件 return JSX
- 以 use 开头,函数式编程

### 基本用法示例
```jsx
// 单个状态
const [count, setCount] = useState(0)

// 多个状态
const [num, setNumber] = useState(0)
const [repos, setRepos] = useState([])
const [isTimerOn, setIsTimerOn] = useState(true)
```

## useEffect Hook
- 处理副作用
- 替代类组件的生命周期方法

### 生命周期 lifecycle 函数
- **mounted 挂载后 渲染完成**
  - 只在渲染完成后执行，更新后不执行 `[]`
  - 用于初始化操作，如数据请求、定时器设置

- **updated 更新后** 
  - 依赖项数组 `[count]` 控制何时执行
  - 当依赖项变化时重新执行

- **unmounted 卸载后的副作用**
  - 定时器等会造成内存泄漏的，要回收，取消
  - 请求数据 卸载时，响应式数据和 dom 不在了
  - 通过 return 清理函数实现

### 组件应该在什么时候去请求接口呢?
- 组件的第一时间渲染是最重要的
- useEffect 去请求接口
  - 不会和渲染争抢
  - 依赖项为 `[]` - 组件状态发生改变不需要再次请求

### 为什么useEffect 函数不可以直接用async
- 再声明一个 async 函数
- 执行

## 实际代码示例

### App.jsx 中的 useEffect 使用
```jsx
// 只在组件挂载时运行一次 - 数据请求
useEffect(() => {
  console.log('只在组件挂载时运行一次!!!')
  const fetchRepos = async () => {
    const response = await fetch('https://api.github.com/users/WildBlue58/repos')
    const data = await response.json()
    console.log(data)
    setRepos(data)
  }
  fetchRepos();
}, [])
```

### Timer 组件中的 useEffect 使用
```jsx
// 定时器设置和清理
useEffect(() => {
  console.log('组件渲染完成');
  const interval = setInterval(() => {
    setTime(prevTime => prevTime + 1);
  }, 1000);
  
  // 清理函数 - 组件卸载时执行
  return () => {
    console.log('组件卸载');
    clearInterval(interval);
  }
}, [])
```

## 组件渲染流程
1. **组件函数执行** - `console.log('组件函数执行')`
2. **JSX 编译** - `console.log("JSX 编译")`
3. **组件渲染完成** - useEffect 执行
4. **组件卸载** - useEffect 清理函数执行

## 条件渲染示例
```jsx
// 通过状态控制组件显示/隐藏
{isTimerOn && <Timer />}
<button onClick={() => {
  setIsTimerOn(!isTimerOn)
}}>
  toggle timer
</button>
```

## 注意事项
- useEffect 的依赖项数组很重要，控制执行时机
- 异步操作要在 useEffect 内部定义函数
- 清理函数用于防止内存泄漏
- 状态更新使用函数式更新 `setTime(prevTime => prevTime + 1)`
  