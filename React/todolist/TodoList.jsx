import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todos from "./Todos";

const TodoList = () => {
  return (
    <div>
      <TodoForm
        onAdd={handleAdd}
        onClear={handleClear}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onEdit={handleEdit}
      />
      <Todos
        todos={todos}
        onAdd={handleAdd}
        onClear={handleClear}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onEdit={handleEdit}
      />
    </div>
  );
};
export default TodoList;
