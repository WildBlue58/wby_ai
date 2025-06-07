// 内置的hook 函数
import { useState } from 'react'
import '../TodoList.css'
import TodoForm from './TodoForm'
import Todos from './Todos'
function TodoList() {
    // 数据驱动的界面
    // 静态页面
    // DOM 数组 -> map -> join('') -> innerHTML 底层API 编程
    // 缺点 低效、面向API
    // 面向业务 懂业务
    // 数据 -> 变化 -> 数据状态 -> 自动刷新页面 -> **数据** **驱动**页面
    // 数组,第一项是数据变量,第二项函数 执行，并传入新的todos
    // 页面会自动更新
    // 挂载点 tbody
    // { todos.map }
    // setTodos DOM 及动态更新
    // 响应式界面开发 
    // hi 数据状态 setHi 修改数据状态的方法
    // ES6 解构
    
    // const hi = useState('嗨嗨嗨~')[0]
    // const setHi = useState('嗨嗨嗨~')[1]
    const [hi, setHi] = useState('嗨嗨嗨~')
    const [title, setTitle] = useState('Todo List')
    const [todos, setTodos] = useState([
        {
            id:1,
            text: '吃饭',
            completed: false
        }
    ])
    // setTimeout(() => {
    //     setTodos([
    //     ...todos,
    //         {
    //             id: 2,
    //             text: '睡觉',
    //             completed: false
    //         } 
    //     ])
    //     // 找到DOM,设置innerHTML
    //     // 更新业务 setTitle 
    //     setTitle('Todo List 2')
    //     setHi('奥利给')
    // },3000)
    
    const handleAdd = (text) => { 
        setTodos([
            ...todos,
            {
                id: todos.length+1,
                text,
                completed: false
            } 
        ])
    }
    return (
      <div className="container">
            <h1 className="title">{title} {hi}</h1>
            {/* 表单 */}
            <TodoForm onAdd={handleAdd}/>
            {/* 列表 */}
            <Todos todos = {todos}/>
            {
                // 当下这个位置
                // 数据为王 界面是被驱动的 
                // 数据驱动
                // 数据绑定 data binding
                // 发生改变后 自动的改变
                // todos.map(todo => (
                //     <li>{ todo.text }</li>
                // ))
            }
      </div>
    )
}

export default TodoList