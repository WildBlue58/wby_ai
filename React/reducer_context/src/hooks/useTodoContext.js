import {
    useContext
} from "react";
import { TodoContext } from "../TodoContext";

// 自定义Hooks
export function useTodoContext() {
  return useContext(TodoContext);
}
