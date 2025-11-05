# 低代码、零代码

- 代码
- Prompt vibe Coding
- coze  
  0 代码 AI Agent 开发工具
  完成和写代码一样的功能

## 常见低代码平台

- **Aisuda（爱速搭）**：阿里巴巴推出的企业级低代码平台
- **OutSystems**：企业级低代码开发平台
- **Mendix**：西门子旗下的低代码平台
- **Power Apps**：微软的低代码应用开发平台
- **Dify**：开源 LLM 应用开发平台，支持工作流编排
- **n8n**：开源的工作流自动化工具

## 概念定义

低代码或零代码是通过可视化的拖拽代替手写代码来构建应用，低代码适合开发者提效，零代码
让非技术人员也能搭建简单应用，常用于表单、审批流程、数据看板等场景，快速满足业务需求。

- 可视化 canvas
- 拖拽 好理解 工作流，程序流

### 低代码 vs 零代码

- **低代码（Low-Code）**：需要少量编码，主要面向开发者，提供更多灵活性和定制能力
- **零代码（No-Code）**：完全可视化，无需编程知识，面向业务人员，但功能相对受限

### 适用场景

- 表单构建和数据收集
- 审批流程自动化
- 数据看板和报表
- 内部管理系统
- 快速原型开发

## aisuda

Aisuda（爱速搭）是阿里巴巴推出的一款低代码应用搭建平台，旨在通过可视化拖拽等方式，让开发者和业务人员能快速、高效地构建企业级应用。

### Aisuda 特点

- 基于 React 和 Ant Design 组件库
- 支持自定义组件扩展
- 通过 JSON Schema 描述页面结构
- 提供完整的组件属性配置面板

## 核心

- 业务或产品需要实现
- 快一点、容易一点、成本低一点
- 低代码编辑器
  - 物料区域(type,props 的组件) 可拖拽的
  - 组合显示区域（drop） 网页、agent、工作流（n8n, dify）
  - 属性修改区域

## 阿里的Antd 组件库

  蚂蚁金服（Ant Design）

### Ant Design 简介

- 企业级 UI 设计语言和 React UI 库
- 提供丰富的组件（Button、Form、Table 等）
- 支持 TypeScript
- 广泛用于低代码平台的物料库基础

## 物料区组件

  可扩展的 组件库

- Container（容器组件）
- Form（表单组件）
- Table（表格组件）
- Button（按钮组件）
- Input（输入框组件）
- 自定义组件（可扩展）

### 组件注册机制

每个组件需要定义：

- `type`：组件类型标识
- `props`：组件属性配置
- `defaultProps`：默认属性值
- `render`：渲染函数

## 我们要开发或维护低代码平台

### 核心技术栈

- **ReactFlow**：用于构建节点编辑器和工作流可视化
- **react-dnd**：拖拽功能实现
- **React**：UI 框架
- **TypeScript**：类型安全
- **Zustand**：状态管理
- **Tailwind CSS**：样式工具
- **Allotment**：分割面板布局

### 架构要点

- 组件树结构（通过 children 属性串联）
- JSON Schema 描述页面结构
- 拖拽生成组件树
- 属性面板实时编辑

## 第一次总结

使用了aisuda阿里低代码编辑器，发现核心是一个json的数据结构。
一个通过children 属性串联的组件对象树。
alloment split pane 布局，用tailwindcss 写样式，zustand
来全局状态管理
数据结构就是树，并不复杂，但是是低代码编辑器的核心

### 编辑器布局（三栏式）

- **物料区**：展示可拖拽的组件列表
- **编辑区**：画布区域，显示页面预览和组件层级
- **设置区**：属性配置面板，编辑选中组件的属性

### JSON Schema 结构示例

```json
{
  "type": "Page",
  "props": {},
  "children": [
    {
      "type": "Container",
      "props": { "width": "100%" },
      "children": []
    }
  ]
}
```

## Typescript

Record<string, any> 是 TypeScript 中的一个工具类型，它表示一个对象，其所有属性的键都是字符串类型，而属性的值可以是任意类型（any）。

### 常用类型定义

```typescript
// 组件节点类型
interface ComponentNode {
  type: string;
  props: Record<string, any>;
  children?: ComponentNode[];
  id?: string;
}

// 组件物料定义
interface ComponentMaterial {
  type: string;
  name: string;
  defaultProps: Record<string, any>;
  propsSchema: Record<string, any>;
}
```

## 拖拽生成

react-dnd 是一个用于在 React 应用中实现拖放（Drag and Drop）功能的流行库，通过提供可组合的 API 和后端抽象（如 HTML5 或触摸）来简化复杂拖拽交互的开发。

### 使用方式

- **根上包着**：在应用根组件包裹 `DndProvider`
- **useDrag**：定义可拖拽的物料组件
- **useDrop**：定义可放置的容器区域
- **拖拽上下文**：通过 `DndProvider` 提供拖拽上下文

### 拖拽流程

1. 从物料区拖拽组件（useDrag）
2. 在编辑区放置组件（useDrop）
3. 触发回调，更新组件树
4. 重新渲染画布

## 遇到的问题

- useDrop 时候会插入多次
- useDrop 多次重复
  违反了dry 原则
  封装一下

### 解决方案

1. **防抖处理**：在拖拽放置时添加防抖，避免重复触发
2. **状态锁定**：使用标志位防止重复插入
3. **封装 Hook**：将 useDrop 逻辑封装为自定义 Hook，复用代码

```typescript
// 封装 useDrop 示例
const useComponentDrop = (onDrop: (item: any) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item) => {
      if (!isDragging) {
        setIsDragging(true);
        onDrop(item);
        setTimeout(() => setIsDragging(false), 100);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  return { drop, isOver };
};
```

### 最佳实践

- 遵循 DRY（Don't Repeat Yourself）原则
- 统一拖拽逻辑处理
- 添加错误边界处理
- 优化拖拽性能（避免频繁重渲染）
