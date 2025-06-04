import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// todos 列表需要渲染
// 函数组件 App组件 组合其他的组件完成应用
// 返回 HTML 的函数
// HTML CSS JS 组合在一起 -> 组件
// function App() {
//   // React 比 Vue 更纯粹
//   const todos = ['吃饭', '睡觉', '学习'];// 数组 -> 数据
//   return (
//     <>
//       <table>
//         <thead>
//           <tr>
//             <th>序号</th>
//             <th>任务</th>
//           </tr>
//         </thead>
//         <tbody>
//           {
//             // 动态 
//             // React 一个括号 
//             // JS DOM 编程API
//             // 在 HTML 里 写 JS 代码
//             todos.map((item, index) => (
//               <tr>
//               <td>{index + 1}</td>
//               <td>{item}</td>
//               </tr>
//             )
//             )
//           }
//         </tbody>
//      </table>
//     </>
//   )
// }
function App() {
  // 数据 -> 数据状态 数据业务 改变的 数据状态
  const [todos, setTodos] = useState(['吃饭', '睡觉', '学习']);
  const [title, setTitle] = useState('ECUT 之星');
  setTimeout(() => {
    setTodos(['吃饭', '睡觉', '学习', '养鱼'])
    setTitle('字节之星')
  }, 5000);

  return (
    <div>
      <h1 className='title'>{title}</h1>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>任务</th>
          </tr>
        </thead>
        <tbody>
          {
            // HTML 模板
            todos.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
export default App
