// 单例模式 - Storage类
class Storage {
  constructor() {
    // 如果已经存在实例，直接返回该实例
    if (Storage.instance) {
      return Storage.instance;
    }

    // 初始化LocalStorage
    this.storage = window.localStorage;

    // 将实例保存到静态属性中
    Storage.instance = this;
  }

  // 设置数据
  setItem(key, value) {
    try {
      // 将值转换为JSON字符串存储
      const jsonValue = JSON.stringify(value);
      this.storage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error("Storage setItem error:", error);
      return false;
    }
  }

  // 获取数据
  getItem(key) {
    try {
      const value = this.storage.getItem(key);
      if (value === null) {
        return null;
      }
      // 尝试解析JSON，如果失败则返回原始字符串
      return JSON.parse(value);
    } catch (error) {
      console.error("Storage getItem error:", error);
      // 如果JSON解析失败，返回原始字符串
      return this.storage.getItem(key);
    }
  }

  // 删除数据
  removeItem(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Storage removeItem error:", error);
      return false;
    }
  }

  // 清空所有数据
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }

  // 获取所有键
  keys() {
    return Object.keys(this.storage);
  }

  // 获取存储大小
  get length() {
    return this.storage.length;
  }
}

// 创建单例实例
const storage = new Storage();

// 导出单例实例
export default storage;
