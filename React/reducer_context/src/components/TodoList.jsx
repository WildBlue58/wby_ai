import { useTodoContext } from "../hooks/useTodoContext";

const TodoList = () => {
  const { todos, toggleTodo, removeTodo, clearTodos } = useTodoContext();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Remove</button>
          <button onClick={() => clearTodos()}>Clear</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
