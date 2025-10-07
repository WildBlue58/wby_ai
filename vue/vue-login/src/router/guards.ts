/**
 * 路由守卫配置
 */

import type { Router } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { ElMessage } from "element-plus";

/**
 * 设置页面标题
 */
export function setPageTitle(title: string) {
  const appStore = useAppStore();
  appStore.setPageTitle(title);
}

/**
 * 检查用户认证状态
 */
export function checkAuth(): boolean {
  const userStore = useUserStore();
  return userStore.isLogin && userStore.checkTokenValidity();
}

/**
 * 检查用户权限
 */
export function checkPermission(requiredRoles?: string[]): boolean {
  const userStore = useUserStore();

  if (!userStore.userInfo) return false;

  if (!requiredRoles || requiredRoles.length === 0) return true;

  return requiredRoles.includes(userStore.userInfo.role || "");
}

/**
 * 路由守卫配置
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, _from, next) => {
    // 设置页面标题
    const title = (to.meta?.title as string) || "Vue Login System";
    setPageTitle(title);

    // 检查是否需要认证
    if (to.meta?.requireAuth) {
      if (!checkAuth()) {
        ElMessage.warning("请先登录");
        next("/login");
        return;
      }

      // 检查角色权限
      const requiredRoles = to.meta?.roles as string[];
      if (requiredRoles && !checkPermission(requiredRoles)) {
        ElMessage.error("没有权限访问该页面");
        next("/");
        return;
      }
    }

    // 如果已登录用户访问登录页，重定向到首页
    if (to.path === "/login" && checkAuth()) {
      next("/");
      return;
    }

    next();
  });

  // 全局后置钩子
  router.afterEach((to) => {
    // 清除错误状态
    const appStore = useAppStore();
    appStore.clearError();

    // 记录页面访问
    console.log(`访问页面: ${to.path}`);
  });

  // 路由错误处理
  router.onError((error) => {
    console.error("路由错误:", error);
    const appStore = useAppStore();
    appStore.setError("页面加载失败");
  });
}
