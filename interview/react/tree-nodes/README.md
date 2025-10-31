# 🌳 条件树渲染组件 (Conditional Tree Component)

一个功能强大、可复用的 React 树形结构组件，支持根据传入的数据和条件动态渲染任意层级的节点。

## ✨ 特性

- 🎯 **条件渲染**: 每个节点可根据条件函数决定是否显示
- 🔄 **递归处理**: 支持无限层级的嵌套树结构
- 🎨 **自定义渲染**: 通过渲染函数灵活控制节点展示样式
- 🧩 **逻辑分离**: 逻辑与展示完全分离，提高可复用性
- 📦 **TypeScript 支持**: 完整的类型定义，提供良好的开发体验
- 🎨 **现代化 UI**: 精美的蓝色主题设计，响应式布局

## 📋 目录结构

```
tree-nodes/
├── src/
│   ├── App.tsx              # 主应用组件（包含示例和使用说明）
│   ├── ConditionalTree.tsx  # 核心树组件
│   ├── NodeData.ts          # 类型定义
│   ├── App.css              # 应用样式
│   └── index.css            # 全局样式
├── package.json
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 运行项目

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 构建项目

```bash
npm run build
```

## 📖 核心概念

### TreeNode 接口

```typescript
interface TreeNode<T = any> {
  id: string | number;                    // 节点唯一标识
  condition?: (data: T) => boolean;       // 条件函数（可选）
  render: (data: T) => React.ReactNode;   // 渲染函数（必需）
  children?: TreeNode<T>[];                // 子节点数组（可选）
}
```

### 组件工作原理

1. **条件评估**: 组件遍历节点数组，对每个节点调用 `condition` 函数
2. **条件渲染**: 如果 `condition` 返回 `true` 或不存在，则渲染该节点
3. **递归处理**: 如果节点有 `children`，递归处理子节点
4. **自定义展示**: 使用 `render` 函数自定义每个节点的展示方式

## 💡 使用示例

### 基础示例

```tsx
import { useState } from "react";
import ConditionalTree from "./ConditionalTree";
import { type TreeNode } from "./NodeData";

// 定义数据类型
interface MyData {
  type: string;
  value: number;
}

// 配置树结构
const tree: TreeNode<MyData>[] = [
  {
    id: "1",
    // 只有当 data.type === "number" 时才显示
    condition: (data) => data.type === "number",
    // 自定义渲染函数
    render: (data) => (
      <div>
        <span>节点 1 - 值: {data.value}</span>
      </div>
    ),
    children: [
      {
        id: "1-1",
        condition: (data) => data.value > 0,
        render: (data) => <div>子节点 - {data.value}</div>,
      },
    ],
  },
];

// 使用组件
function App() {
  const [data, setData] = useState<MyData>({ 
    type: "number", 
    value: 1 
  });

  return (
    <div>
      <ConditionalTree data={data} nodes={tree} />
      <button onClick={() => setData({ type: "text", value: 0 })}>
        切换数据
      </button>
    </div>
  );
}
```

### 高级示例：权限菜单树

```tsx
interface User {
  role: "admin" | "user" | "guest";
  permissions: string[];
}

const menuTree: TreeNode<User>[] = [
  {
    id: "dashboard",
    condition: (user) => user.role !== "guest",
    render: (user) => (
      <MenuItem icon="🏠" label="仪表盘" />
    ),
  },
  {
    id: "settings",
    condition: (user) => user.role === "admin",
    render: (user) => (
      <MenuItem icon="⚙️" label="设置" />
    ),
    children: [
      {
        id: "users",
        condition: (user) => 
          user.permissions.includes("manage_users"),
        render: () => <MenuItem label="用户管理" />,
      },
    ],
  },
];
```

## 🎨 样式定制

组件使用 CSS 类名，你可以轻松自定义样式：

- `.tree-node`: 树节点样式
- `.tree-node-wrapper`: 节点包装器
- `.tree-children`: 子节点容器

### 自定义主题

```css
.tree-node {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
  border-radius: 8px;
  padding: 1rem;
  /* 你的自定义样式 */
}
```

## 🔧 API 参考

### ConditionalTree 组件

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `data` | `T` | ✅ | 传递给节点的数据 |
| `nodes` | `TreeNode<T>[]` | ✅ | 树节点配置数组 |

### TreeNode 类型

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | `string \| number` | ✅ | 节点唯一标识 |
| `condition` | `(data: T) => boolean` | ❌ | 条件函数，返回 `true` 时渲染 |
| `render` | `(data: T) => React.ReactNode` | ✅ | 渲染函数 |
| `children` | `TreeNode<T>[]` | ❌ | 子节点数组 |

## 🎓 学习要点

### 1. 递归组件的理解

这是一个经典的递归组件示例。`renderNodes` 函数调用自身来处理子节点，这就是递归。

```tsx
const renderNodes = (nodes: TreeNode<T>[]) => {
  return nodes.map((node) => {
    // 处理当前节点...
    
    // 递归处理子节点
    if (node.children) {
      renderNodes(node.children);
    }
  });
};
```

### 2. 条件渲染模式

通过函数式条件判断，实现了灵活的条件渲染：

```tsx
// 条件函数可以是任意逻辑
condition: (data) => {
  return data.type === "number" && data.value > 0;
}
```

### 3. 渲染函数模式

将展示逻辑通过函数传递给组件，实现了展示与逻辑的分离：

```tsx
render: (data) => {
  // 完全自定义的 JSX
  return <YourCustomComponent data={data} />;
}
```

### 4. TypeScript 泛型的使用

组件使用泛型 `<T>`，可以适配任意数据类型：

```tsx
ConditionalTree<User>  // 用户数据
ConditionalTree<Product>  // 产品数据
ConditionalTree<Menu>  // 菜单数据
```

## 🤔 常见问题

### Q: 如何让所有节点都显示？

A: 不设置 `condition` 属性，或者让 `condition` 始终返回 `true`：

```tsx
{
  id: "1",
  // 不设置 condition，或 condition: () => true
  render: (data) => <div>总是显示</div>,
}
```

### Q: 如何处理大量节点时的性能问题？

A: 可以考虑使用虚拟滚动（如 `react-window`）或懒加载子节点。

### Q: 可以在节点上添加交互功能吗？

A: 可以！在 `render` 函数中返回带有事件处理器的组件：

```tsx
render: (data) => (
  <div onClick={() => handleClick(data)}>
    可点击的节点
  </div>
),
```

## 📝 开发建议

1. **保持条件函数简单**: 复杂的条件逻辑应该提取到单独的函数中
2. **合理使用 id**: 确保每个节点的 `id` 在树中是唯一的
3. **优化渲染函数**: 避免在 `render` 中执行复杂计算，使用 `useMemo` 优化
4. **类型安全**: 充分利用 TypeScript 的类型检查，定义清晰的数据类型

## 🛠️ 技术栈

- **React 19**: UI 框架
- **TypeScript**: 类型系统
- **Vite**: 构建工具
- **CSS3**: 样式（现代 CSS 特性）

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**享受编码！** 🎉
