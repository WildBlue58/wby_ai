# TypeScript 在 React 中的使用

## TypeScript 简介

- **JavaScript 的超集**：TypeScript 是 JavaScript 的扩展，添加了静态类型系统
- **类型约束**：在编译阶段进行类型检查，提前发现错误，提高代码质量
- **编译时检查**：类型错误在编译阶段就会被发现，而不是运行时

## TypeScript 在 React 业务中的用法

### 1. 子组件 + Props 的约定

使用 `interface` 或 `type` 定义组件的 Props 类型：

```typescript
// 定义 Props 接口
interface Props {
  userName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 使用 React.FC 声明函数组件
const NameEditComponent: React.FC<Props> = ({ userName, onChange }) => {
  return (
    <>
      <label>Update name:</label>
      <input
        type="text"
        value={userName}
        onChange={onChange}
        placeholder="请输入姓名"
      />
    </>
  );
};
```

**说明：**

- `React.FC<Props>`：React 提供的函数组件类型，泛型参数是 Props 类型
- `interface Props`：定义组件接收的 props 结构
- TypeScript 会在编译时检查 props 的类型和必填性

### 2. 组件 State 的类型约束

#### 2.1 useState 的类型声明

```typescript
// JavaScript 写法（无类型约束）
const [name, setName] = useState("initialName");

// TypeScript 写法（显式类型约束）
const [name, setName] = useState<string>("initialName");
```

**类型推断：**

- 如果初始值类型明确，TypeScript 可以自动推断类型
- 显式声明类型可以避免类型错误

#### 2.2 单向数据流

React 采用单向数据流，数据从父组件流向子组件：

```typescript
// 父组件 App.tsx
function App() {
  const [name, setName] = useState<string>("initialName");
  
  // 事件处理函数的类型约束
  const setUsernameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  
  return (
    <NameEditComponent userName={name} onChange={setUsernameState} />
  );
}
```

**要点：**

- 数据通过 props 向下传递
- 通过 callback 函数向上传递数据变化
- TypeScript 确保类型安全

### 3. Props Callback 函数类型

#### 3.1 函数类型定义

```typescript
interface Props {
  // 函数类型：() => void（无参数，无返回值）
  onSave: () => void;
  
  // 函数类型：带参数和返回值
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // 函数类型：带多个参数
  onSubmit: (name: string, age: number) => void;
}
```

#### 3.2 参数的类型约定

```typescript
// React 事件类型
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

// 自定义参数类型
interface User {
  name: string;
  age: number;
}
onUserChange: (user: User) => void;
```

### 4. React 对 TypeScript 的原生支持

React 提供了丰富的类型定义，开箱即用：

#### 4.1 React.FC

```typescript
// React.FC 是 React.FunctionComponent 的简写
const MyComponent: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};
```

**注意：** React 18+ 中，`React.FC` 的使用有所争议，也可以直接使用函数声明：

```typescript
// 推荐写法（React 18+）
function MyComponent({ userName, onChange }: Props) {
  return <div>...</div>;
}
```

#### 4.2 React 事件类型

```typescript
// 输入框变化事件
React.ChangeEvent<HTMLInputElement>

// 按钮点击事件
React.MouseEvent<HTMLButtonElement>

// 表单提交事件
React.FormEvent<HTMLFormElement>

// 键盘事件
React.KeyboardEvent<HTMLInputElement>
```

### 5. 常见类型约束示例

#### 5.1 可选属性

```typescript
interface Props {
  userName: string;        // 必填
  age?: number;            // 可选
  isActive?: boolean;      // 可选
}
```

#### 5.2 联合类型

```typescript
type Status = "pending" | "success" | "error";

interface Props {
  status: Status;
}
```

#### 5.3 数组类型

```typescript
interface Props {
  items: string[];                    // 字符串数组
  users: Array<{ name: string }>;     // 对象数组
}
```

### 6. 实际应用示例

参考项目中的实际代码：

- **父组件**：`src/App.tsx` - 管理 state，通过 props 传递数据
- **子组件**：`src/components/NameEditComponent.tsx` - 接收 props，触发回调

**核心概念：**

- ✅ 类型约束在编译阶段检查
- ✅ Props 接口定义组件契约
- ✅ 事件类型确保事件处理函数类型安全
- ✅ 单向数据流 + TypeScript = 更可靠的代码

### 7. 最佳实践

1. **优先使用 interface 定义 Props**：更清晰，支持扩展
2. **显式声明 useState 类型**：避免类型推断错误
3. **使用 React 提供的类型**：`React.ChangeEvent`、`React.MouseEvent` 等
4. **函数类型要明确**：参数类型和返回值类型都要声明
5. **利用 IDE 提示**：TypeScript 会在编写代码时提供类型提示和错误检查

---

> **提示**：TypeScript 的类型检查在编译阶段进行，不会影响运行时性能。编写时多写一些类型声明，可以避免 99.99% 的类型相关错误。
