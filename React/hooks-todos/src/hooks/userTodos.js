import {
    useState,
    useEffect
} from "react";

export const useTodos = () => { 
    const [todos, setTodos] = useState(JSON.parse(
        localStorage.getItem('todos')
    ))

    useEffect(() => {
        // console.log("todos 数据变化了");
        // JSON字符串
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

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


    return {
        todos,
        setTodos,
        addTodo,
        onToggle,
        onDelete
    }
}

