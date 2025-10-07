/**
 * 全局错误处理器
 */

import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { useAppStore } from "@/stores/app";

// 错误类型枚举
export enum ErrorType {
  NETWORK = "NETWORK",
  API = "API",
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  PERMISSION = "PERMISSION",
  UNKNOWN = "UNKNOWN",
}

// 错误级别枚举
export enum ErrorLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  level: ErrorLevel;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: number;
  userAgent: string;
  url: string;
  stack?: string;
}

// 错误处理器配置
export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableNotification: boolean;
  enableConsole: boolean;
  maxRetries: number;
  retryDelay: number;
}

// 默认配置
const defaultConfig: ErrorHandlerConfig = {
  enableLogging: true,
  enableNotification: true,
  enableConsole: true,
  maxRetries: 3,
  retryDelay: 1000,
};

/**
 * 全局错误处理器类
 */
export class GlobalErrorHandler {
  private config: ErrorHandlerConfig;
  private errorQueue: ErrorInfo[] = [];
  private retryCount: Map<string, number> = new Map();

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.init();
  }

  /**
   * 初始化错误处理器
   */
  private init(): void {
    // 捕获未处理的Promise错误
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(event.reason, ErrorType.UNKNOWN, ErrorLevel.MEDIUM);
    });

    // 捕获全局JavaScript错误
    window.addEventListener("error", (event) => {
      this.handleError(event.error, ErrorType.UNKNOWN, ErrorLevel.HIGH);
    });

    // 捕获Vue错误
    if ((window as any).Vue) {
      (window as any).Vue.config.errorHandler = (
        error: Error,
        instance: any,
        info: string
      ) => {
        this.handleError(error, ErrorType.UNKNOWN, ErrorLevel.HIGH, {
          instance,
          info,
        });
      };
    }
  }

  /**
   * 处理错误
   */
  handleError(
    error: any,
    type: ErrorType = ErrorType.UNKNOWN,
    level: ErrorLevel = ErrorLevel.MEDIUM,
    details?: any
  ): void {
    const errorInfo = this.createErrorInfo(error, type, level, details);

    // 添加到错误队列
    this.errorQueue.push(errorInfo);

    // 控制台输出
    if (this.config.enableConsole) {
      this.logToConsole(errorInfo);
    }

    // 发送通知
    if (this.config.enableNotification) {
      this.showNotification(errorInfo);
    }

    // 记录日志
    if (this.config.enableLogging) {
      this.logError(errorInfo);
    }

    // 更新应用状态
    this.updateAppState(errorInfo);
  }

  /**
   * 创建错误信息
   */
  private createErrorInfo(
    error: any,
    type: ErrorType,
    level: ErrorLevel,
    details?: any
  ): ErrorInfo {
    return {
      type,
      level,
      message: this.extractErrorMessage(error),
      code: this.extractErrorCode(error),
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error?.stack,
    };
  }

  /**
   * 提取错误消息
   */
  private extractErrorMessage(error: any): string {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.statusText) {
      return error.response.statusText;
    }

    return "未知错误";
  }

  /**
   * 提取错误代码
   */
  private extractErrorCode(error: any): string | number | undefined {
    if (error?.code) {
      return error.code;
    }

    if (error?.response?.status) {
      return error.response.status;
    }

    if (error?.response?.data?.code) {
      return error.response.data.code;
    }

    return undefined;
  }

  /**
   * 控制台输出
   */
  private logToConsole(errorInfo: ErrorInfo): void {
    const { type, level, message, code, stack } = errorInfo;

    const logMessage = `[${type}] ${message}${code ? ` (${code})` : ""}`;

    switch (level) {
      case ErrorLevel.LOW:
        console.info(logMessage);
        break;
      case ErrorLevel.MEDIUM:
        console.warn(logMessage);
        break;
      case ErrorLevel.HIGH:
        console.error(logMessage);
        break;
      case ErrorLevel.CRITICAL:
        console.error(logMessage, stack);
        break;
    }
  }

  /**
   * 显示通知
   */
  private showNotification(errorInfo: ErrorInfo): void {
    const { type, level, message } = errorInfo;

    let notificationType: "success" | "warning" | "error" | "info" = "info";

    switch (level) {
      case ErrorLevel.LOW:
        notificationType = "info";
        break;
      case ErrorLevel.MEDIUM:
        notificationType = "warning";
        break;
      case ErrorLevel.HIGH:
      case ErrorLevel.CRITICAL:
        notificationType = "error";
        break;
    }

    ElNotification({
      title: this.getErrorTitle(type),
      message,
      type: notificationType,
      duration: this.getNotificationDuration(level),
      showClose: true,
    });
  }

  /**
   * 获取错误标题
   */
  private getErrorTitle(type: ErrorType): string {
    const titles = {
      [ErrorType.NETWORK]: "网络错误",
      [ErrorType.API]: "接口错误",
      [ErrorType.VALIDATION]: "验证错误",
      [ErrorType.AUTH]: "认证错误",
      [ErrorType.PERMISSION]: "权限错误",
      [ErrorType.UNKNOWN]: "系统错误",
    };

    return titles[type] || "未知错误";
  }

  /**
   * 获取通知持续时间
   */
  private getNotificationDuration(level: ErrorLevel): number {
    switch (level) {
      case ErrorLevel.LOW:
        return 3000;
      case ErrorLevel.MEDIUM:
        return 5000;
      case ErrorLevel.HIGH:
        return 8000;
      case ErrorLevel.CRITICAL:
        return 0; // 不自动关闭
    }
  }

  /**
   * 记录错误日志
   */
  private logError(errorInfo: ErrorInfo): void {
    // 这里可以集成日志服务，如Sentry、LogRocket等
    console.log("Error logged:", errorInfo);

    // 发送到服务器
    this.sendErrorToServer(errorInfo);
  }

  /**
   * 发送错误到服务器
   */
  private async sendErrorToServer(_errorInfo: ErrorInfo): Promise<void> {
    try {
      // 这里可以调用API发送错误信息到服务器
      // await api.post('/errors', errorInfo);
    } catch (error) {
      console.error("Failed to send error to server:", error);
    }
  }

  /**
   * 更新应用状态
   */
  private updateAppState(errorInfo: ErrorInfo): void {
    const appStore = useAppStore();

    // 设置错误状态
    appStore.setError(errorInfo.message);

    // 根据错误类型执行特定操作
    switch (errorInfo.type) {
      case ErrorType.AUTH:
        this.handleAuthError(errorInfo);
        break;
      case ErrorType.PERMISSION:
        this.handlePermissionError(errorInfo);
        break;
      case ErrorType.NETWORK:
        this.handleNetworkError(errorInfo);
        break;
    }
  }

  /**
   * 处理认证错误
   */
  private handleAuthError(_errorInfo: ErrorInfo): void {
    ElMessageBox.confirm("登录状态已过期，请重新登录", "认证失败", {
      confirmButtonText: "重新登录",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 清除用户状态并跳转到登录页
      // const userStore = useUserStore();
      // userStore.logout();
      window.location.href = "/login";
    });
  }

  /**
   * 处理权限错误
   */
  private handlePermissionError(_errorInfo: ErrorInfo): void {
    ElMessage.error("您没有权限执行此操作");
  }

  /**
   * 处理网络错误
   */
  private handleNetworkError(_errorInfo: ErrorInfo): void {
    ElMessage.error("网络连接失败，请检查网络设置");
  }

  /**
   * 重试操作
   */
  async retry<T>(
    operation: () => Promise<T>,
    operationId: string = "default"
  ): Promise<T> {
    const currentRetries = this.retryCount.get(operationId) || 0;

    if (currentRetries >= this.config.maxRetries) {
      throw new Error("重试次数已达上限");
    }

    this.retryCount.set(operationId, currentRetries + 1);

    // 等待重试延迟
    await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));

    try {
      const result = await operation();
      this.retryCount.delete(operationId);
      return result;
    } catch (error) {
      if (currentRetries + 1 >= this.config.maxRetries) {
        this.retryCount.delete(operationId);
        throw error;
      }

      return this.retry(operation, operationId);
    }
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    byLevel: Record<ErrorLevel, number>;
  } {
    const stats = {
      total: this.errorQueue.length,
      byType: {} as Record<ErrorType, number>,
      byLevel: {} as Record<ErrorLevel, number>,
    };

    // 初始化统计对象
    Object.values(ErrorType).forEach((type) => {
      stats.byType[type] = 0;
    });

    Object.values(ErrorLevel).forEach((level) => {
      stats.byLevel[level] = 0;
    });

    // 统计错误
    this.errorQueue.forEach((error) => {
      stats.byType[error.type]++;
      stats.byLevel[error.level]++;
    });

    return stats;
  }

  /**
   * 清除错误队列
   */
  clearErrors(): void {
    this.errorQueue = [];
    this.retryCount.clear();
  }

  /**
   * 获取错误队列
   */
  getErrors(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建全局错误处理器实例
export const globalErrorHandler = new GlobalErrorHandler();

// 便捷函数
export function handleError(
  error: any,
  type: ErrorType = ErrorType.UNKNOWN,
  level: ErrorLevel = ErrorLevel.MEDIUM,
  details?: any
): void {
  globalErrorHandler.handleError(error, type, level, details);
}

export function retry<T>(
  operation: () => Promise<T>,
  operationId?: string
): Promise<T> {
  return globalErrorHandler.retry(operation, operationId);
}

export function getErrorStats() {
  return globalErrorHandler.getErrorStats();
}

export function clearErrors(): void {
  globalErrorHandler.clearErrors();
}

// 错误处理装饰器
export function withErrorHandling(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      handleError(error, ErrorType.UNKNOWN, ErrorLevel.MEDIUM);
      throw error;
    }
  };

  return descriptor;
}
