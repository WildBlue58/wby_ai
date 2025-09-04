# 响应式底层原理

- DOM API -> 响应式业务 自动化
- Object.defineProperty(obj,"value",{
    get,
    set
})
  对象上的某个属性的某些行为(get,set)进行定义，在完成本来的职责同时，去做dom 更新，
  这就是响应式
  拦截行为
- 缺点呢？有点麻烦，每次只能定义一个属性
- obj.value
- REACT,VUE 现代前端MVVM 框架，早期用Object.defineProperty
  实现响应式，现在使用Proxy
- ES6 Proxy 可以一次代理整个对象，代理的行为更多

## Object.defineProperty 详解

### 基本语法

```javascript
Object.defineProperty(obj, prop, descriptor)
```

### 属性描述符(property descriptor)

#### 数据描述符

- **value**: 属性的值
- **writable**: 是否可写，默认为 false
- **enumerable**: 是否可枚举，默认为 false
- **configurable**: 是否可配置（修改或删除），默认为 false

#### 访问器描述符

- **get**: 获取属性值时调用的函数
- **set**: 设置属性值时调用的函数

### 实际示例

#### 1. 基础响应式实现

```javascript
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`获取 ${key}: ${val}`);
      return val;
    },
    set(newVal) {
      console.log(`设置 ${key}: ${newVal}`);
      val = newVal;
      // 触发视图更新
      updateView();
    },
    enumerable: true,
    configurable: true
  });
}

function updateView() {
  console.log('视图更新');
}

// 使用示例
const data = {};
defineReactive(data, 'name', '张三');
defineReactive(data, 'age', 25);

data.name; // 获取 name: 张三
data.age = 26; // 设置 age: 26, 视图更新
```

#### 2. 深度响应式

```javascript
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  // 递归处理嵌套对象
  observe(val);
  
  Object.defineProperty(obj, key, {
    get() {
      console.log(`获取 ${key}`);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log(`设置 ${key}: ${val} -> ${newVal}`);
        observe(newVal); // 新值也需要响应式处理
        val = newVal;
        updateView();
      }
    },
    enumerable: true,
    configurable: true
  });
}

// 使用示例
const user = {
  name: '李四',
  info: {
    age: 30,
    city: '北京'
  }
};

observe(user);
user.name = '王五'; // 设置 name: 李四 -> 王五
user.info.age = 31; // 获取 info, 设置 age: 30 -> 31
```

#### 3. 数组响应式处理

```javascript
// 数组方法重写
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args);
    console.log(`数组方法 ${method} 被调用`);
    updateView();
    return result;
  };
});

function observeArray(arr) {
  arr.__proto__ = arrayMethods;
  arr.forEach(item => observe(item));
}

// 使用示例
const list = [1, 2, 3];
observeArray(list);
list.push(4); // 数组方法 push 被调用
```

## Proxy 响应式实现

### 基本用法

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      console.log(`获取属性 ${key}`);
      const result = Reflect.get(target, key, receiver);
      // 如果是对象，递归代理
      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }
      return result;
    },
    set(target, key, value, receiver) {
      console.log(`设置属性 ${key}: ${value}`);
      const result = Reflect.set(target, key, value, receiver);
      updateView();
      return result;
    },
    deleteProperty(target, key) {
      console.log(`删除属性 ${key}`);
      const result = Reflect.deleteProperty(target, key);
      updateView();
      return result;
    }
  });
}

// 使用示例
const data = reactive({
  name: '赵六',
  age: 28,
  hobbies: ['读书', '游泳']
});

data.name = '钱七'; // 设置属性 name: 钱七
data.hobbies.push('跑步'); // 获取属性 hobbies, 设置属性 2: 跑步
```

### 数组响应式处理

```javascript
function reactiveArray(arr) {
  return new Proxy(arr, {
    get(target, key, receiver) {
      // 拦截数组方法
      if (typeof key === 'string' && ['push', 'pop', 'shift', 'unshift', 'splice'].includes(key)) {
        return function(...args) {
          const result = Array.prototype[key].apply(target, args);
          console.log(`数组方法 ${key} 被调用`);
          updateView();
          return result;
        };
      }
      return Reflect.get(target, key, receiver);
    }
  });
}

// 使用示例
const list = reactiveArray([1, 2, 3]);
list.push(4); // 数组方法 push 被调用
```

## Object.defineProperty vs Proxy 对比

### Object.defineProperty 的局限性

1. **无法监听数组变化**：无法检测数组索引和长度的变化
2. **无法监听对象属性的添加/删除**：只能监听已存在的属性
3. **性能问题**：需要递归遍历对象的所有属性
4. **嵌套对象处理复杂**：需要深度遍历

### Proxy 的优势

1. **完整的对象代理**：可以拦截对象的所有操作
2. **数组支持**：可以监听数组的所有变化
3. **性能更好**：按需代理，不需要预先定义
4. **更丰富的拦截器**：支持13种拦截操作

### 对比示例

```javascript
// Object.defineProperty 无法监听新增属性
const obj1 = {};
Object.defineProperty(obj1, 'name', {
  get() { return this._name; },
  set(val) { 
    this._name = val; 
    console.log('name 变化了');
  }
});

obj1.name = '张三'; // 会触发
obj1.age = 25; // 不会触发，因为 age 属性没有定义

// Proxy 可以监听所有操作
const obj2 = new Proxy({}, {
  set(target, key, value) {
    console.log(`${key} 被设置为 ${value}`);
    target[key] = value;
    return true;
  }
});

obj2.name = '李四'; // name 被设置为 李四
obj2.age = 30; // age 被设置为 30
```

## 实际应用场景

### 1. Vue 2.x 响应式原理

```javascript
// 简化的 Vue 2.x 响应式实现
class Vue {
  constructor(options) {
    this._data = options.data;
    this.observe(this._data);
  }
  
  observe(data) {
    if (typeof data !== 'object' || data === null) return;
    
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }
  
  defineReactive(obj, key, val) {
    this.observe(val); // 递归处理嵌套对象
    
    Object.defineProperty(obj, key, {
      get() {
        // 依赖收集
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          // 触发更新
          console.log('触发视图更新');
        }
      }
    });
  }
}
```

### 2. Vue 3.x 响应式原理

```javascript
// 简化的 Vue 3.x 响应式实现
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      // 依赖收集
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新
      trigger(target, key);
      return result;
    }
  });
}

function track(target, key) {
  console.log('收集依赖:', key);
}

function trigger(target, key) {
  console.log('触发更新:', key);
}
```

## 性能优化技巧

### 1. 懒代理

```javascript
function lazyReactive(obj) {
  const proxyCache = new WeakMap();
  
  return new Proxy(obj, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      
      // 只有访问时才创建代理
      if (typeof result === 'object' && result !== null) {
        if (!proxyCache.has(result)) {
          proxyCache.set(result, lazyReactive(result));
        }
        return proxyCache.get(result);
      }
      
      return result;
    }
  });
}
```

### 2. 批量更新

```javascript
let updateQueue = [];
let isUpdating = false;

function queueUpdate(fn) {
  updateQueue.push(fn);
  
  if (!isUpdating) {
    isUpdating = true;
    Promise.resolve().then(() => {
      updateQueue.forEach(fn => fn());
      updateQueue = [];
      isUpdating = false;
    });
  }
}

function updateView() {
  queueUpdate(() => {
    console.log('批量更新视图');
  });
}
```

## 总结

- **Object.defineProperty**：Vue 2.x 使用，需要预先定义属性，无法监听数组和新增属性
- **Proxy**：Vue 3.x 使用，功能更强大，可以监听所有对象操作
- **选择建议**：新项目推荐使用 Proxy，老项目可以继续使用 Object.defineProperty
- **性能考虑**：合理使用懒代理和批量更新来优化性能
