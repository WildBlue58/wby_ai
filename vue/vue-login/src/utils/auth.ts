/**
 * 认证相关工具函数
 */

import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  const userStore = useUserStore();
  return userStore.isLogin;
}

/**
 * 检查token是否有效
 */
export function isTokenValid(): boolean {
  const userStore = useUserStore();
  return userStore.checkTokenValidity();
}

/**
 * 获取当前用户token
 */
export function getToken(): string {
  const userStore = useUserStore();
  return userStore.token;
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  const userStore = useUserStore();
  return {
    username: userStore.username,
    userInfo: userStore.userInfo,
    isLogin: userStore.isLogin,
  };
}

/**
 * 登出用户
 */
export function logout(): void {
  const userStore = useUserStore();
  const appStore = useAppStore();

  userStore.logout();
  appStore.resetApp();
}

/**
 * 检查用户权限
 */
export function hasPermission(permission: string): boolean {
  const userStore = useUserStore();
  if (!userStore.userInfo) return false;

  return userStore.userInfo.permissions?.includes(permission) || false;
}

/**
 * 检查用户角色
 */
export function hasRole(role: string): boolean {
  const userStore = useUserStore();
  if (!userStore.userInfo) return false;

  return userStore.userInfo.role === role;
}

/**
 * 检查是否为管理员
 */
export function isAdmin(): boolean {
  return hasRole("admin");
}

/**
 * 格式化用户显示名称
 */
export function formatUserDisplayName(): string {
  const userStore = useUserStore();
  return userStore.userDisplayName;
}

/**
 * 获取用户头像URL
 */
export function getUserAvatar(): string {
  const userStore = useUserStore();
  return userStore.userInfo?.avatar || "/default-avatar.png";
}

/**
 * 检查是否需要重新登录
 */
export function shouldReauth(): boolean {
  const userStore = useUserStore();
  return !userStore.isLogin || userStore.isTokenExpired;
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  const userStore = useUserStore();
  const appStore = useAppStore();

  userStore.logout();
  appStore.resetApp();

  // 清除所有localStorage中的认证相关数据
  const keysToRemove = [
    "token",
    "username",
    "userInfo",
    "loginTime",
    "rememberMe",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * 设置认证信息
 */
export function setAuth(token: string, username: string, userInfo?: any): void {
  const userStore = useUserStore();

  userStore.setToken(token);
  userStore.setUsername(username);
  if (userInfo) {
    userStore.setUserInfo(userInfo);
  }
  userStore.setLoginTime();
}
