import { useState, createElement } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, title: "🥰Love" },
    { id: 2, title: "Xiang😍" },
    { id: 3, title: "❤️" },
  ]);
  // 背后调用 createElement 方法
  const element = <h1 className="title">🥰Love Xiang❤️</h1>;
  // 手动调用 createElement 方法
  const element2 = createElement(
    "h1",
    { className: "title", id: "title" },
    "🥰Love Xiang❤️"
  );
  return (
    <>
      <ul>
        {todos.map((todo) => {
          return <li key={todo.id}>{todo.title}</li>;
        })}
      </ul>

      <ul>
        {todos.map((todo) => {
          return React.createElement("li", { key: todo.id }, todo.title);
        })}
      </ul>
      {element}
      {element2}
    </>
  );
}

export default App;
