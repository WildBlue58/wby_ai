/**
 * API接口类型定义
 */

import { LoginCredentials, LoginResponse, UserInfo } from "@/types/user";

// 登录API接口
export interface LoginApi {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<{ token: string }>;
  getUserInfo(): Promise<UserInfo>;
}

// 用户API接口
export interface UserApi {
  getProfile(): Promise<UserInfo>;
  updateProfile(data: Partial<UserInfo>): Promise<UserInfo>;
  changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void>;
  uploadAvatar(file: File): Promise<{ url: string }>;
}

// 认证API接口
export interface AuthApi {
  checkToken(token: string): Promise<{ valid: boolean; user?: UserInfo }>;
  revokeToken(token: string): Promise<void>;
  getPermissions(): Promise<string[]>;
}

// API错误类型
export interface ApiErrorResponse {
  code: number;
  message: string;
  details?: string;
  field?: string;
}

// 请求拦截器配置
export interface RequestInterceptorConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// 响应拦截器配置
export interface ResponseInterceptorConfig {
  onSuccess?: (response: any) => any;
  onError?: (error: any) => Promise<never>;
}

// 登录请求参数
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

// 登录响应数据
export interface LoginResponseData {
  token: string;
  username: string;
  userInfo: UserInfo;
  expiresIn: number;
  refreshToken?: string;
}

// 用户信息更新请求
export interface UpdateUserInfoRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

// 密码修改请求
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 文件上传响应
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
