import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');

  const handleClick = () => {
    // 异步 不是同步
    // react 性能优化，合并多次更新 统一处理
    // 重绘重排
    // 数据绑定，界面更新
    // JS 引擎 V8,高速过路费 渲染引擎 Blink
    // 重绘重排
    // 浏览器渲染过程
    // 1. 解析HTML，生成DOM树
    // 2. 解析CSS，生成CSSOM树
    // 3. 合并DOM树和CSSOM树，生成渲染树
    // 4. 布局渲染树，生成布局树
    // 5. 绘制渲染树，生成绘制记录
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);
    // setTitle('');
    // setColor('');
    // setState 函数式更新语法
    // 保证每个更新都基于上一个最新的更新
    // 界面的更新合并为一次的
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }

  return (
    <>
      <p>当前计数:{count}</p>
      <button onClick={handleClick}>+3</button>
    </>
  )
}

export default App
