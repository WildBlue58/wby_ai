import {
  NextResponse, // res
} from "next/server"; // api server

// ts 是js 超集
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
let todos: Todo[] = [
  {
    id: 1,
    text: "Learn Next.js",
    completed: false,
  },
  {
    id: 2,
    text: "Learn React",
    completed: false,
  },
];

// RESTful 一切皆资源
// 向用户暴露资源的
// method + 资源 URL定义规则
export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  // 获取请求体 body json
  const { text } = await request.json();
  // 核心的数据，函数的参数，返回值
  const newTodo: Todo = {
    id: todos.length + 1,
    text,
    // typescript 除了强类型外，代码提示更好，写起来更快
    completed: false,
  };
  todos.push(newTodo);
  return NextResponse.json(newTodo);
}
