/**
 * 存储工具函数
 * 提供统一的本地存储和会话存储接口
 */

// 存储类型枚举
export enum StorageType {
  LOCAL = "localStorage",
  SESSION = "sessionStorage",
}

// 存储配置接口
export interface StorageConfig {
  type: StorageType;
  prefix?: string;
  expire?: number; // 过期时间（毫秒）
  encrypt?: boolean; // 是否加密
}

// 存储项接口
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expire?: number;
}

/**
 * 存储工具类
 */
export class Storage {
  private config: StorageConfig;
  private storage: globalThis.Storage;

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = {
      type: StorageType.LOCAL,
      prefix: "",
      ...config,
    };

    this.storage =
      this.config.type === StorageType.LOCAL
        ? window.localStorage
        : window.sessionStorage;
  }

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T, expire?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expire: expire || this.config.expire,
      };

      const serializedValue = this.config.encrypt
        ? this.encrypt(JSON.stringify(item))
        : JSON.stringify(item);

      const fullKey = this.getFullKey(key);
      this.storage.setItem(fullKey, serializedValue);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  }

  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const fullKey = this.getFullKey(key);
      const item = this.storage.getItem(fullKey);

      if (!item) {
        return defaultValue || null;
      }

      const parsedItem = this.config.encrypt
        ? JSON.parse(this.decrypt(item))
        : JSON.parse(item);

      // 检查是否过期
      if (this.isExpired(parsedItem)) {
        this.remove(key);
        return defaultValue || null;
      }

      return parsedItem.value;
    } catch (error) {
      console.error("Storage get error:", error);
      return defaultValue || null;
    }
  }

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      const fullKey = this.getFullKey(key);
      this.storage.removeItem(fullKey);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  }

  /**
   * 清空存储
   */
  clear(): void {
    try {
      if (this.config.prefix) {
        // 只清空带前缀的项
        const keys = this.getAllKeys();
        keys.forEach((key) => {
          if (key.startsWith(this.config.prefix!)) {
            this.storage.removeItem(key);
          }
        });
      } else {
        this.storage.clear();
      }
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }

  /**
   * 检查存储项是否存在
   */
  has(key: string): boolean {
    const fullKey = this.getFullKey(key);
    return this.storage.getItem(fullKey) !== null;
  }

  /**
   * 获取所有键
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * 获取存储大小
   */
  getSize(): number {
    let size = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        const value = this.storage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size;
  }

  /**
   * 获取完整键名
   */
  private getFullKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}_${key}` : key;
  }

  /**
   * 检查是否过期
   */
  private isExpired(item: StorageItem): boolean {
    if (!item.expire) return false;
    return Date.now() - item.timestamp > item.expire;
  }

  /**
   * 简单加密
   */
  private encrypt(text: string): string {
    // 简单的Base64编码，实际项目中应使用更安全的加密方法
    return btoa(encodeURIComponent(text));
  }

  /**
   * 简单解密
   */
  private decrypt(text: string): string {
    try {
      return decodeURIComponent(atob(text));
    } catch {
      return text;
    }
  }
}

// 创建默认存储实例
export const localStorage = new Storage({
  type: StorageType.LOCAL,
  prefix: "vue-login",
});
export const sessionStorage = new Storage({
  type: StorageType.SESSION,
  prefix: "vue-login",
});

/**
 * 便捷函数
 */

/**
 * 设置本地存储
 */
export function setLocal<T>(key: string, value: T, expire?: number): void {
  localStorage.set(key, value, expire);
}

/**
 * 获取本地存储
 */
export function getLocal<T>(key: string, defaultValue?: T): T | null {
  return localStorage.get(key, defaultValue);
}

/**
 * 删除本地存储
 */
export function removeLocal(key: string): void {
  localStorage.remove(key);
}

/**
 * 设置会话存储
 */
export function setSession<T>(key: string, value: T, expire?: number): void {
  sessionStorage.set(key, value, expire);
}

/**
 * 获取会话存储
 */
export function getSession<T>(key: string, defaultValue?: T): T | null {
  return sessionStorage.get(key, defaultValue);
}

/**
 * 删除会话存储
 */
export function removeSession(key: string): void {
  sessionStorage.remove(key);
}

/**
 * 清空所有存储
 */
export function clearAll(): void {
  localStorage.clear();
  sessionStorage.clear();
}

/**
 * 存储管理器
 */
export class StorageManager {
  private storages: Map<string, Storage> = new Map();

  /**
   * 创建存储实例
   */
  createStorage(name: string, config: Partial<StorageConfig> = {}): Storage {
    const storage = new Storage(config);
    this.storages.set(name, storage);
    return storage;
  }

  /**
   * 获取存储实例
   */
  getStorage(name: string): Storage | undefined {
    return this.storages.get(name);
  }

  /**
   * 删除存储实例
   */
  removeStorage(name: string): boolean {
    return this.storages.delete(name);
  }

  /**
   * 获取所有存储实例
   */
  getAllStorages(): Storage[] {
    return Array.from(this.storages.values());
  }

  /**
   * 清空所有存储
   */
  clearAllStorages(): void {
    this.storages.forEach((storage) => storage.clear());
  }
}

// 创建全局存储管理器
export const storageManager = new StorageManager();

/**
 * 存储工具函数
 */

/**
 * 检查浏览器是否支持存储
 */
export function isStorageSupported(): boolean {
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取存储配额信息
 */
export function getStorageQuota(): Promise<{ quota: number; usage: number }> {
  return new Promise((resolve) => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        resolve({
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
        });
      });
    } else {
      resolve({ quota: 0, usage: 0 });
    }
  });
}

/**
 * 清理过期数据
 */
export function cleanupExpiredData(): void {
  const keys = localStorage.getAllKeys();
  keys.forEach((key) => {
    const value = localStorage.get(key);
    if (value === null) {
      localStorage.remove(key);
    }
  });
}

/**
 * 导出存储数据
 */
export function exportStorageData(): string {
  const data: Record<string, any> = {};
  const keys = localStorage.getAllKeys();

  keys.forEach((key) => {
    const value = localStorage.get(key);
    if (value !== null) {
      data[key] = value;
    }
  });

  return JSON.stringify(data, null, 2);
}

/**
 * 导入存储数据
 */
export function importStorageData(data: string): boolean {
  try {
    const parsedData = JSON.parse(data);

    Object.entries(parsedData).forEach(([key, value]) => {
      localStorage.set(key, value);
    });

    return true;
  } catch {
    return false;
  }
}
