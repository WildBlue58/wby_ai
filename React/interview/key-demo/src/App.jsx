import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, title: "❤️乡❤️" },
    { id: 2, title: "乡❤️乡" },
    { id: 3, title: "❤️乡❤️" },
  ]);

  const handleClick = () => {};

  useEffect(() => {
    setTimeout(() => {
      // setTodos((prev) =>
      //   prev.map((todo) => {
      //     if (todo.id === 1) {
      //       return {
      //         ...todo,
      //         title: "❤️爱❤️",
      //       };
      //     }
      //       return todo;
      //     })
      //   );
      setTodos((prev) => [
        {
          id: 4,
          title: "❤️爱❤️",
        },
        ...prev,
      ]);
    }, 5000);
  }, []);
  return (
    <>
      {todos.map((todo, index) => (
        <li key={index} onClick={handleClick}>
          {todo.title}
        </li>
      ))}
    </>
  );
}

export default App;
