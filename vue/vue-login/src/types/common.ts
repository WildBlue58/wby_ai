/**
 * 通用类型定义
 */

// 基础实体接口
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// 选项接口
export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  children?: Option<T>[];
}

// 键值对接口
export interface KeyValue<T = any> {
  key: string;
  value: T;
}

// 树节点接口
export interface TreeNode<T = any> {
  id: string | number;
  label: string;
  children?: TreeNode<T>[];
  data?: T;
  expanded?: boolean;
  selected?: boolean;
}

// 表单验证规则接口
export interface ValidationRule {
  required?: boolean;
  message?: string;
  trigger?: string | string[];
  validator?: (rule: any, value: any, callback: any) => void;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

// 表格列配置接口
export interface TableColumn {
  prop: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  fixed?: boolean | "left" | "right";
  sortable?: boolean;
  formatter?: (row: any, column: any, cellValue: any, index: number) => any;
}

// 菜单项接口
export interface MenuItem {
  id: string | number;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    roles?: string[];
  };
}

// 主题类型
export type Theme = "light" | "dark" | "auto";

// 语言类型
export type Language = "zh-CN" | "en-US" | "ja-JP";

// 尺寸类型
export type Size = "small" | "medium" | "large";

// 状态类型
export type Status = "success" | "warning" | "error" | "info";

// 方向类型
export type Direction = "horizontal" | "vertical";

// 位置类型
export type Position = "top" | "bottom" | "left" | "right";

// 对齐类型
export type Alignment = "start" | "center" | "end" | "stretch";

// 事件处理器类型
export type EventHandler<T = any> = (event: T) => void;

// 异步函数类型
export type AsyncFunction<T = any, R = any> = (params: T) => Promise<R>;

// 回调函数类型
export type Callback<T = any> = (data: T) => void;

// 错误回调类型
export type ErrorCallback = (error: Error) => void;
