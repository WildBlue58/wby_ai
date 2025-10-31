import { useState } from "react";
import { type TreeNode } from "./NodeData";
import ConditionalTree from "./ConditionalTree";
import "./App.css";

/**
 * 定义树节点使用的数据类型
 * 这里演示了一个简单的数据结构，你可以根据实际需求自定义
 */
interface MyData {
  type: string; // 数据类型标识
  value: number; // 数值
}

/**
 * 树形结构配置
 *
 * 每个节点包含：
 * - id: 唯一标识符
 * - condition: 条件函数，返回 true 时该节点才会被渲染
 * - render: 渲染函数，决定节点如何展示
 * - children: 子节点数组（可选），实现递归树结构
 */
const tree: TreeNode<MyData>[] = [
  {
    id: "1",
    // 只有当 data.type === "number" 时，这个节点才会显示
    condition: (data) => data.type === "number",
    // 自定义渲染函数：显示数据的值
    render: (data) => (
      <div className="tree-node">
        <span className="node-label">节点 1</span>
        <span className="node-value">值: {data.value}</span>
      </div>
    ),
    children: [
      {
        id: "2",
        condition: (data) => data.type === "number",
        render: (data) => (
          <div className="tree-node">
            <span className="node-label">节点 1-1</span>
            <span className="node-value">值: {data.value}</span>
          </div>
        ),
      },
    ],
  },
  {
    id: "3",
    condition: (data) => data.type === "number",
    render: (data) => (
      <div className="tree-node">
        <span className="node-label">节点 2</span>
        <span className="node-value">值: {data.value}</span>
      </div>
    ),
    children: [
      {
        id: "4",
        condition: (data) => data.type === "number",
        render: (data) => (
          <div className="tree-node">
            <span className="node-label">节点 2-1</span>
            <span className="node-value">值: {data.value}</span>
          </div>
        ),
      },
    ],
  },
];

/**
 * 主应用组件
 *
 * 功能说明：
 * 1. 使用 useState 管理数据状态
 * 2. 将数据传递给 ConditionalTree 组件进行条件渲染
 * 3. 提供按钮让用户修改数据，观察树的变化
 */
export default function App() {
  // React Hooks: useState 用于管理组件状态
  // 初始值为 { type: "number", value: 1 }
  const [data, setData] = useState<MyData>({ type: "number", value: 1 });

  /**
   * 更新数据为不同的值
   * 当点击按钮时，树会根据新的数据重新评估条件并渲染
   */
  const handleChangeValue = () => {
    // 切换 value 值，用于演示条件渲染
    setData((prev) => ({
      type: "number",
      value: prev.value === 1 ? 2 : 1,
    }));
  };

  /**
   * 切换到非 number 类型，观察节点是否会隐藏（因为 condition 返回 false）
   */
  const handleChangeType = () => {
    setData({ type: "text", value: 0 });
  };

  /**
   * 重置为初始状态
   */
  const handleReset = () => {
    setData({ type: "number", value: 1 });
  };

  return (
    <div className="app-container">
      {/* 应用头部区域 */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">🌳</span>
          条件树渲染组件
        </h1>
        <p className="app-description">
          根据传入的数据和条件动态渲染树形结构，支持递归处理任意层级节点
        </p>
      </header>

      {/* 当前数据状态显示 */}
      <div className="data-display">
        <div className="data-card">
          <h3 className="data-title">当前数据</h3>
          <div className="data-content">
            <div className="data-item">
              <span className="data-label">类型 (type):</span>
              <span className="data-value">{data.type}</span>
            </div>
            <div className="data-item">
              <span className="data-label">数值 (value):</span>
              <span className="data-value">{data.value}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 树形结构渲染区域 */}
      <div className="tree-container">
        <h2 className="tree-title">
          <span className="tree-icon">📊</span>
          树形结构渲染结果
        </h2>
        <div className="tree-wrapper">
          <ConditionalTree data={data} nodes={tree} />
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div className="actions-container">
        <h3 className="actions-title">操作按钮</h3>
        <div className="buttons-group">
          <button className="btn btn-primary" onClick={handleChangeValue}>
            🔄 切换数值 (1 ↔ 2)
          </button>
          <button className="btn btn-secondary" onClick={handleChangeType}>
            🔀 切换类型 (number → text)
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            🔙 重置数据
          </button>
        </div>
        <p className="actions-hint">
          💡 提示：尝试切换数据类型，观察树节点如何根据条件显示或隐藏
        </p>
      </div>
    </div>
  );
}
