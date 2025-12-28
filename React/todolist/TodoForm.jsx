import React, { useState } from "react";

const TodoForm = () => {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    console.log(text);
    setText("");
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleClear = () => {
    setText("");
  };

  const handleCancel = () => {
    setText("");
  };
  const handleEdit = () => {
    console.log(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={handleChange} />
      <button type="submit">添加</button>

      <button type="button" onClick={onClear}>
        清空
      </button>
      <button type="button" onClick={onSubmit}>
        提交
      </button>
      <button type="button" onClick={onCancel}>
        取消
      </button>
      <button type="button" onClick={onEdit}>
        编辑
      </button>
    </form>
  );
};
export default TodoForm;
