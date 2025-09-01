# Map 和 WeakMap

## 概述

- ES6 新增的数据结构，作为企业级大型应用需要的内置数据结构
- key 可以是对象（这是与普通对象的主要区别）
- Map(强引用)，WeakMap(弱引用)

## Map（强引用映射）

### 基本特性

- 键值对的集合，类似于对象
- 键可以是任何类型（对象、函数、原始类型等）
- 保持插入顺序
- 强引用：键被引用时，对象不会被垃圾回收

### 常用方法

```javascript
// 创建 Map
const map = new Map();

// 设置键值对
map.set('key', 'value');
map.set({}, 'object key');

// 获取值
map.get('key'); // 'value'

// 检查键是否存在
map.has('key'); // true

// 删除键值对
map.delete('key');

// 清空所有键值对
map.clear();

// 获取大小
map.size;

// 遍历
map.forEach((value, key) => {
    console.log(key, value);
});

// 获取所有键
for (let key of map.keys()) {
    console.log(key);
}

// 获取所有值
for (let value of map.values()) {
    console.log(value);
}

// 获取所有键值对
for (let [key, value] of map.entries()) {
    console.log(key, value);
}
```

### 使用场景

- 需要键值对映射的场景
- 需要保持插入顺序
- 需要频繁增删键值对
- 键的类型多样化

## WeakMap（弱引用映射）

### 基本特性

- 键只能是对象（不能是原始类型）
- 弱引用：键对象被垃圾回收时，对应的值也会被回收
- 不可遍历（没有 size 属性，没有 clear 方法）
- 主要用于存储与对象相关的元数据

### 常用方法

```javascript
// 创建 WeakMap
const weakMap = new WeakMap();

// 设置键值对（键必须是对象）
const obj = {};
weakMap.set(obj, 'metadata');

// 获取值
weakMap.get(obj); // 'metadata'

// 检查键是否存在
weakMap.has(obj); // true

// 删除键值对
weakMap.delete(obj);
```

### 使用场景

- 存储对象的私有数据
- 缓存与对象相关的信息
- 避免内存泄漏
- DOM 元素的事件监听器存储

## Map vs WeakMap 对比

| 特性 | Map | WeakMap |
|------|-----|---------|
| 键的类型 | 任何类型 | 只能是对象 |
| 引用类型 | 强引用 | 弱引用 |
| 可遍历 | 是 | 否 |
| size 属性 | 有 | 无 |
| clear 方法 | 有 | 无 |
| 垃圾回收 | 不会自动回收 | 会自动回收 |
| 使用场景 | 一般映射 | 对象元数据 |

## 实际应用示例

### Map 应用：用户权限管理

```javascript
const userPermissions = new Map();

// 设置用户权限
userPermissions.set('admin', ['read', 'write', 'delete']);
userPermissions.set('user', ['read']);
userPermissions.set('guest', []);

// 检查权限
function hasPermission(user, action) {
    const permissions = userPermissions.get(user);
    return permissions && permissions.includes(action);
}

console.log(hasPermission('admin', 'delete')); // true
console.log(hasPermission('user', 'delete')); // false
```

### WeakMap 应用：DOM 元素数据存储

```javascript
const elementData = new WeakMap();

// 为 DOM 元素存储数据
function setElementData(element, data) {
    elementData.set(element, data);
}

function getElementData(element) {
    return elementData.get(element);
}

// 使用示例
const button = document.querySelector('#myButton');
setElementData(button, { clickCount: 0, lastClick: null });

// 当 button 被删除时，相关数据也会被垃圾回收
```

### WeakMap 应用：私有属性模拟

```javascript
const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        privateData.set(this, { name, age });
    }
    
    getName() {
        return privateData.get(this).name;
    }
    
    getAge() {
        return privateData.get(this).age;
    }
    
    setAge(age) {
        const data = privateData.get(this);
        data.age = age;
    }
}

const person = new Person('Alice', 25);
console.log(person.getName()); // 'Alice'
console.log(person.getAge()); // 25

// 无法直接访问私有数据
console.log(person.name); // undefined
```

## 内存管理示例

```javascript
// 演示 WeakMap 的垃圾回收特性
let obj = { name: 'test' };
const weakMap = new WeakMap();
const map = new Map();

// 在 WeakMap 中存储
weakMap.set(obj, 'weakmap data');
// 在 Map 中存储
map.set(obj, 'map data');

console.log('Before setting obj to null:');
console.log('WeakMap has obj:', weakMap.has(obj)); // true
console.log('Map has obj:', map.has(obj)); // true

// 删除对 obj 的引用
obj = null;

// 手动触发垃圾回收（在 Node.js 中）
global.gc();

console.log('After garbage collection:');
console.log('WeakMap has obj:', weakMap.has(obj)); // false
console.log('Map has obj:', map.has(obj)); // false
console.log('Map size:', map.size); // 仍然为 1，因为 Map 保持强引用
```

## 注意事项

1. **WeakMap 不可遍历**：无法获取所有键或值
2. **WeakMap 键必须是对象**：原始类型会报错
3. **内存管理**：WeakMap 适合存储临时数据，避免内存泄漏
4. **性能考虑**：Map 在频繁增删时性能优于普通对象
5. **兼容性**：ES6+ 环境支持，需要 polyfill 支持旧浏览器
