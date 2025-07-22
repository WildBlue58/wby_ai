import { useTodosStore } from "../../store/todos";

const TodoList = () => {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodosStore();
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button onClick={() => addTodo(todo.text)}>Add</button>
            <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          </li>
        ))}
      </ul>
      <input type="text" />
    </div>
  );
};

export default TodoList;
