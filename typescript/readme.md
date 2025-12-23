## TypeScript + React

大型项目标配：**类型安全 + 组件化开发**

---

## TypeScript 是什么？

- **由谁发明？**
  - 微软发明的语言
  - 最终仍然会编译成 JavaScript 在浏览器 / Node 中运行

- **和 JavaScript 的关系**
  - TypeScript 是 **JavaScript 的超集**
  - 所有合法的 JS 代码，在 TS 中基本也能跑
  - **在 JS 的基础上加上：类型系统 + 新语法（装饰器、接口等）**

- **为什么说“可以按 JS 来写”？**
  - `.ts`/`.tsx` 文件里，可以像写 JS 一样写代码
  - 不写类型声明也能跑，只是失去了类型检查的好处
  - 推荐：**从“加少量类型”开始，而不是一次性写很重的类型**

---

## JS 开发容易出现的问题

- **类型随意 / 不受约束**
  - 一个变量一会儿是 `number`，一会儿是 `string`
  - 接口返回的数据结构和注释不一致，运行时才报错

- **常见痛点**
  - 接口字段拼写错误（多了 / 少了 / 写错）
  - 函数参数数量不对、顺序写反
  - 调用方和实现方对“数据长什么样”理解不一致

- **TypeScript 能带来的改善**
  - 编译阶段就能发现类型错误（IDE 也会红线提示）
  - 更好地自动补全（知道对象上有哪些字段）
  - 更可靠的重构（改类型，编译器帮你找所有影响点）

---

## 一点点 TypeScript 基本语法（只看概念）

- **基础类型**
  - `string`、`number`、`boolean`、`null`、`undefined`
  - 数组：`number[]` / `Array<number>`
  - 对象：`{ name: string; age: number }`

- **类型别名（type）**
  - 给一组类型起名字，便于复用

- **接口（interface）**
  - 描述“一个对象应该长什么样”
  - 常用来约束 props、接口返回值等

---

## React：什么是组件？

- **最简定义**
  - **组件 = 函数 + JSX**
  - 一个函数，**接收 props，返回 JSX**

- **函数组件示意（仅看结构）**

```tsx
type HelloProps = {
  name: string; // 名字，必须是字符串
};

function Hello(props: HelloProps) {
  return <div>你好，{props.name}</div>;
}
```

- **上面发生了什么？**
  - `HelloProps`：用 TypeScript 描述 `props` 的结构
  - `name: string`：React 在运行时不检查类型，但 TS 在**编译阶段**会帮你校验

---

## 在 React 中使用 TypeScript：类型约束的几个常见场景

- **组件的 props**
  - 用 `type` 或 `interface` 描述 props 结构
  - 减少“传错字段名 / 少传字段 / 类型不对”的问题

- **组件内部状态（state）**
  - `const [count, setCount] = useState<number>(0);`
  - 避免 `count` 被意外赋值为字符串等其他类型

- **接口数据（API 返回值）**
  - 用 TS 类型描述接口返回结构
  - 一处定义，多处使用：组件、hooks、服务层都复用同一份类型

---

## 可以如何开始练习？

- **从 JS 迁移到 TS 的简单路径**
  - 先把 `.js` 改成 `.ts` / `.tsx`，IDE 会立刻给出一些类型提示
  - 先给组件的 props 和 API 返回值加上类型
  - 遇到复杂类型时，优先保证“能表达清楚”而不是“写得特别高级”

- **练习建议**
  - 任意写一个简单的 React 组件（比如 TodoList）
  - 给它的 props、state、以及列表项的结构都加上类型
  - 尝试故意传错类型，看 IDE / 编译器如何提示

---

> 这份 `readme` 只做**概念级**梳理，后续可以再按模块拆分：
>
> - TypeScript 基础语法
> - 在 React 组件中的常见用法（props / state / 自定义 hooks）
> - 和后端接口对接时的类型管理
