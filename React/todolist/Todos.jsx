import React, { useState } from "react";
import TodoForm from "./TodoForm";

// 列表的渲染
const Todos = (props) => {
  const { onAdd, onClear, onSubmit, onCancel, onEdit } = props;
  const [todos, setTodos] = useState([]);
  return (
    <div>
      <TodoForm
        onAdd={onAdd}
        onClear={onClear}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onEdit={onEdit}
        todos={todos}
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
        <button type="button" onClick={onAdd}>
          添加
        </button>
        <button type="button" onClick={onClear}>
          清空
        </button>
        <button type="button" onClick={onSubmit}>
          提交
        </button>
        <button type="button" onClick={onCancel}>
          取消
        </button>
      </ul>
      <button type="button" onClick={onEdit}>
        编辑文本
      </button>
      <button type="button" onClick={onCancel}>
        取消编辑
          </button>
          
    </div>
  );
};
export default Todos;
