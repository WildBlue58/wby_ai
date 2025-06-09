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
    
    const [title] = useState('我的待办事项🎈')
    const [todos, setTodos] = useState([
        {
            id: 1,
            text: '学习 React',
            completed: false,
            category: '学习'
        },
        {
            id: 2,
            text: '完成项目',
            completed: false,
            category: '工作'
        }
    ])

    // 新增状态：搜索关键词和当前筛选的分类
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('全部')

    // 预定义的分类选项
    const categories = ['全部', '工作', '学习', '生活', '其他']

    // 添加待办事项
    const handleAdd = (text, category) => { 
        setTodos([
            ...todos,
            {
                id: Date.now(), // 使用时间戳作为唯一ID
                text,
                completed: false,
                category: category || '其他'
            } 
        ])
    }

    // 切换待办事项完成状态
    const handleToggle = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id 
                ? { ...todo, completed: !todo.completed }
                : todo
        ))
    }

    // 删除待办事项
    const handleDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    // 编辑待办事项
    const handleEdit = (id, newText) => {
        setTodos(todos.map(todo => 
            todo.id === id 
                ? { ...todo, text: newText }
                : todo
        ))
    }

    // 过滤显示的待办事项（搜索 + 分类筛选）
    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === '全部' || todo.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="container">
            <h1 className="title">{title}</h1>
            
            {/* 表单组件 */}
            <TodoForm onAdd={handleAdd} categories={categories.slice(1)} />
            
            {/* 搜索和筛选区域 */}
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="搜索待办事项..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-filter"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            
            {/* 待办事项列表组件 */}
            <Todos 
                todos={filteredTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    )
}

export default TodoList