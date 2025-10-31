import type { ReactNode } from "react";
import { type TreeNode } from "./NodeData";

/**
 * ConditionalTree 组件的 Props 接口
 *
 * @template T - 数据类型，可以是任意类型
 * @property data - 传递给树节点的数据
 * @property nodes - 树节点配置数组
 */
interface ConditionalTreeProps<T> {
  data: T;
  nodes: TreeNode<T>[];
}

/**
 * 条件树渲染组件
 *
 * 这是一个递归组件，用于根据条件动态渲染树形结构。
 *
 * 核心功能：
 * 1. 遍历节点数组，对每个节点评估条件
 * 2. 如果条件满足（返回 true），则渲染该节点
 * 3. 递归处理子节点，支持任意层级的嵌套
 * 4. 实现了逻辑与展示的分离，提高可复用性
 *
 * @template T - 数据类型泛型
 * @param props - 组件属性
 * @returns 渲染的树形结构
 *
 * @example
 * ```tsx
 * const tree = [
 *   {
 *     id: "1",
 *     condition: (data) => data.type === "number",
 *     render: (data) => <div>{data.value}</div>,
 *     children: [...]
 *   }
 * ];
 *
 * <ConditionalTree data={myData} nodes={tree} />
 * ```
 */
export default function ConditionalTree<T>({
  data,
  nodes,
}: ConditionalTreeProps<T>) {
  /**
   * 递归渲染节点函数
   *
   * 这个函数是组件的核心逻辑：
   * - 遍历节点数组
   * - 检查每个节点的条件（如果有）
   * - 如果条件满足或没有条件，则渲染节点
   * - 递归处理子节点
   *
   * @param nodes - 当前层级的节点数组
   * @returns React 节点或 null（如果条件不满足）
   */
  const renderNodes = (nodes: TreeNode<T>[]): ReactNode => {
    return nodes.map((node) => {
      // 如果节点有条件函数，先评估条件
      // 条件返回 false 时，该节点及其所有子节点都不会渲染
      if (node.condition && !node.condition(data)) {
        return null;
      }

      // 渲染当前节点及其子节点
      return (
        <div key={node.id} className="tree-node-wrapper">
          {/* 使用节点配置的 render 函数渲染节点内容 */}
          {node.render(data)}

          {/* 如果存在子节点，递归渲染 */}
          {node.children && node.children.length > 0 && (
            <div className="tree-children">{renderNodes(node.children)}</div>
          )}
        </div>
      );
    });
  };

  // 返回渲染结果
  return <>{renderNodes(nodes)}</>;
}
