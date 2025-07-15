# 单例模式

## 实现Storage，使得该对象为单例，基于LocalStorage 进行封装。实现方法

setItem(key, value) 和 getItem(key)

## 单例模式介绍

单例模式是一种创建型设计模式，确保一个类只有一个实例，并提供一个全局访问点。

### 特点

- 保证一个类只有一个实例
- 提供全局访问点
- 延迟初始化（可选）

## 实现方式

### 1. 构造函数方式

```javascript
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
}
```

### 2. 静态方法方式

```javascript
class Storage {
    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }
}
```

## 核心方法

### setItem(key, value)

- 将数据存储到LocalStorage
- 自动将值转换为JSON字符串
- 返回操作是否成功

### getItem(key)

- 从LocalStorage获取数据
- 自动解析JSON字符串
- 如果键不存在返回null

## 额外功能

- `removeItem(key)`: 删除指定键的数据
- `clear()`: 清空所有数据
- `keys()`: 获取所有键名
- `length`: 获取存储的数据数量

## 使用示例

```javascript
// 导入单例Storage
import storage from './Storage.js';

// 存储数据
storage.setItem('user', '张三');
storage.setItem('age', 25);
storage.setItem('hobbies', ['读书', '游泳']);

// 获取数据
const user = storage.getItem('user'); // '张三'
const age = storage.getItem('age');   // 25
const hobbies = storage.getItem('hobbies'); // ['读书', '游泳']

// 验证单例
const storage1 = new Storage();
const storage2 = new Storage();
console.log(storage1 === storage2); // true
```

## 文件结构

- `Storage.js` - 单例Storage类的实现
- `example.html` - 完整的使用示例和演示页面
- `readme.md` - 说明文档

## 运行示例

1. 在浏览器中打开 `example.html`
2. 测试基本的数据存储和获取功能
3. 验证单例模式的正确性
4. 尝试存储复杂数据类型（对象、数组）

## 优势

1. **内存效率**: 只创建一个实例，节省内存
2. **全局访问**: 可以在应用的任何地方访问同一个实例
3. **数据一致性**: 确保所有地方操作的都是同一份数据
4. **封装性**: 对LocalStorage进行了封装，提供了更好的API
5. **错误处理**: 包含了完善的错误处理机制
