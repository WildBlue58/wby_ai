import { useReducer } from "react";
import todoReducer from "../reducers/todoReducer";
// ES6 参数的默认值
// {todos,} key:value 省略
// ``模板字符串
// 解构 [] = [] {} = {}
// 展开运算符，...rest 运算符
export function useTodos(initial = []) {
  const [todos, dispatch] = useReducer(todoReducer, initial);
  const addTodo = (text) => {
    dispatch({ type: "ADD_TODO", payload: text });
  };
  const toggleTodo = (id) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };
  const clearTodos = () => {
    dispatch({ type: "CLEAR_TODOS" });
  };
  const removeTodo = (id) => {
    dispatch({ type: "REMOVE_TODO", payload: id });
  };
  return {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    clearTodos,
  };
}
