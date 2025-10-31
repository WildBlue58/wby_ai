import type { ReactNode } from "react";

/**
 * 树节点接口定义
 *
 * 这是一个泛型接口，支持任意数据类型的树节点配置。
 *
 * @template T - 节点数据类型，默认为 any
 *
 * @property id - 节点的唯一标识符，可以是字符串或数字
 * @property condition - 可选的条件函数，接收数据作为参数，返回布尔值
 *                       - 返回 true: 节点会被渲染
 *                       - 返回 false 或未定义: 节点不会被渲染
 * @property render - 必需的渲染函数，接收数据作为参数，返回 React 节点
 *                   用于自定义节点的展示方式
 * @property children - 可选的子节点数组，实现递归树结构
 *
 * @example
 * ```tsx
 * const node: TreeNode<User> = {
 *   id: "1",
 *   condition: (user) => user.role === "admin",
 *   render: (user) => <div>{user.name}</div>,
 *   children: [...]
 * };
 * ```
 */
export interface TreeNode<T = any> {
  /** 节点唯一标识 */
  id: string | number;

  /**
   * 条件函数：决定节点是否渲染
   * @param data - 传入的数据
   * @returns 返回 true 时节点会被渲染，false 时不会渲染
   */
  condition?: (data: T) => boolean;

  /**
   * 渲染函数：定义节点的展示内容
   * @param data - 传入的数据
   * @returns React 节点
   */
  render: (data: T) => ReactNode;

  /**
   * 子节点数组：支持递归树结构
   * 每个子节点也会按照相同的规则进行条件渲染
   */
  children?: TreeNode<T>[];
}
