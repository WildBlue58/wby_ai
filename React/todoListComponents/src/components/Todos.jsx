// 列表的渲染
function Todos(props) { 
    // console.log(props, '/////')
    const todos = props.todos
    return (
        // 父组件传过来的数据状态呢?传参
        <ul>
            {
                todos.map(todo => (
                    <li key={ todo.id }>{ todo.text }</li>
                ))
            }
        </ul>
    )
}
export default Todos