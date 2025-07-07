import { 
    // 响应式状态hooks
    useState // react 函数式编程 好用的以 use 开头的函数
} from 'react'

import TodoForm from './TodoForm'
import TodoList from './TodoList'
import TodoItem from './TodoItem'

const Todos = () => {
    // 数据流管理
    // 父组件持有管理数据 props 传递数据 子组件通过 props 自定义函数
    // 通知父组件
    const [todos, setTodos] = useState([
        {
            id: 1,
            title: '学习react',
            isCompleted: false
        },
        {
            id: 2,
            title: '学习vue',
            isCompleted: false
        },
    ])

    // 新增todo
    const addTodo = (title) => {
        // setTodo
        // setTodos([...todos, todo])
    }
    
    return (
        <div className="app">
            Todos
            {/* 自定义事件 */}
            <TodoForm onAddTodo={addTodo}/>
            <TodoList todos={todos} />
            <TodoItem />
        </div>
    )
}

export default Todos