/**
 * 用户相关类型定义
 */

// 用户信息接口
export interface UserInfo {
  id: string | number;
  username: string;
  email?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// 用户状态接口
export interface UserState {
  token: string;
  username: string;
  userInfo: UserInfo | null;
  loginTime: string;
  rememberMe: boolean;
}

// 登录凭据接口
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 登录响应接口
export interface LoginResponse {
  token: string;
  username: string;
  userInfo: UserInfo;
  expiresIn?: number;
}

// 用户权限枚举
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

// 用户权限类型
export type UserPermission =
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "user_management"
  | "system_config";

// 用户状态枚举
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
}
