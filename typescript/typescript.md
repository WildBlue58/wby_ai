# TypeScript 学习指南

## 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，由微软开发。它在 JavaScript 的基础上添加了静态类型检查，让开发更加安全和高效。

## 主要优势

### 1. 类型安全

```typescript
// JavaScript - 运行时才发现错误
function add(a, b) {
  return a + b;
}
add("1", 2); // 返回 "12"，可能不是预期结果

// TypeScript - 编译时发现错误
function add(a: number, b: number): number {
  return a + b;
}
add("1", 2); // 编译错误：类型"string"的参数不能赋给类型"number"的参数
```

### 2. 更好的 IDE 支持

- 智能代码提示
- 自动补全
- 重构支持
- 错误检测

### 3. 面向对象编程

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
```

## 基本类型

```typescript
// 基本类型
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let arr: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// 联合类型
let id: string | number = "user123";

// 对象类型
let obj: { name: string; age: number } = { name: "张三", age: 25 };

// 函数类型
let func: (a: number, b: number) => number = (a, b) => a + b;
```

## 高级特性

### 1. 泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用
let output1 = identity<string>("hello");
let output2 = identity(42); // 类型推断
```

### 2. 接口

```typescript
interface Vehicle {
  brand: string;
  model: string;
  year?: number;
  readonly vin: string;
}

const car: Vehicle = {
  brand: "Toyota",
  model: "Camry",
  vin: "123456789"
};
```

### 3. 枚举

```typescript
enum Status {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

let currentStatus: Status = Status.Pending;
```

### 4. 类型别名

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;
```

## 与 React 结合

```typescript
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  const addTodo = (text: string): void => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setInput(e.target.value)
        } 
      />
      <button onClick={() => addTodo(input)}>添加</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};
```

## 最佳实践

### 1. 使用严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. 避免 any 类型

```typescript
// 不推荐
let data: any = getData();

// 推荐
interface ApiResponse {
  data: User[];
  status: string;
}
let data: ApiResponse = getData();
```

### 3. 使用类型推断

```typescript
// TypeScript 可以推断类型
let message = "Hello"; // 类型为 string
let numbers = [1, 2, 3]; // 类型为 number[]
```

## 学习资源

1. [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
2. [TypeScript 中文手册](https://typescript.bootcss.com/)
3. [TypeScript Playground](https://www.typescriptlang.org/play)

## 项目结构

```bash
todolist/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── typescript-demo.ts # TypeScript 示例
│   └── ...
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖
```

## 总结

TypeScript 通过静态类型检查提高了代码质量和开发效率，特别适合大型项目的开发。它完全兼容 JavaScript，可以逐步迁移现有项目。
