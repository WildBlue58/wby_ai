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
            text: '学习react',
            isCompleted: false
        },
        {
            id: 2,
            text: '学习vue',
            isCompleted: false
        },
    ])

    // 新增todo
    const addTodo = (text) => {
        // setTodo
        // setTodos([...todos, todo])
        // 数据状态是对象的时候
        setTodos([
            ...todos,
            {
                id: Date.now(), // 时间戳
                text: text,
                isCompleted: false
            }
        ])
    }

    const onToggle = (id) => {
        console.log(id);
        // todos 数组找到id 为 id，isCompleted !isCompleted
        // 响应式? 返回一个全新的todos map
        // state 是对象或数组的时候
        
        setTodos(todos.map(
            todo => todo.id === id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ))
    }

    const onDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id))// 过滤器 返回一个全新的todos
    }
    
    return (
        <div className="app">
            {/* 自定义事件 */}
            <TodoForm onAddTodo={addTodo}/>
            <TodoList
                todos={todos}
                onToggle={onToggle}
                onDelete={onDelete}
            />
            <TodoItem />
        </div>
    )
}

export default Todos