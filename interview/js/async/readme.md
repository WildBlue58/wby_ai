# JavaScript 异步编程详解

## 概述

JavaScript 是单线程的，异步编程是为了解决阻塞问题，让耗时任务不阻塞主线程，提升用户体验。

## 异步编程的演进历程

### 1. 回调函数 (Callback)

**基本概念：** 通过回调函数在任务完成后执行

**特点：**

- 简单直观，易于理解
- 回调地狱问题：多层嵌套导致代码难以维护
- 错误处理困难：没有统一的错误处理机制

**代码示例：**

```javascript
// Node.js 文件读取示例
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }
  console.log('文件内容:', data);
});

// 回调地狱示例
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      // 嵌套过深，难以维护
    });
  });
});
```

### 2. Promise

**基本概念：** 链式调用管理异步流程，支持链式、统一错误捕获

**特点：**

- 支持 `.then()/.catch()/.finally()` 链式调用
- 统一的错误处理机制
- 链式过多时仍可读性下降

**代码示例：**

```javascript
// Promise 基本用法
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('操作成功');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('操作完成'));

// Promise 链式调用
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error));
```

### 3. Generator + yield

**基本概念：** ES6 可暂停的生成器函数

**特点：**

- 异步流程控制灵活
- 需要手动控制执行，调用 `next()` 执行下一个 `yield` 表达式
- 短暂流行后被 async/await 取代

**代码示例：**

```javascript
function* asyncGenerator() {
  try {
    const result1 = yield fetch('/api/data1');
    const result2 = yield fetch('/api/data2');
    return { result1, result2 };
  } catch (error) {
    console.error('Generator 错误:', error);
  }
}

// 手动执行 Generator
const gen = asyncGenerator();
const promise1 = gen.next().value;
promise1.then(result1 => {
  const promise2 = gen.next(result1).value;
  promise2.then(result2 => {
    console.log(gen.next(result2).value);
  });
});
```

### 4. async/await

**基本概念：** Promise 语法糖，用同步写法写异步逻辑

**特点：**

- 接近同步代码风格，语义清晰
- 需要配合 `try/catch/finally` 捕获错误
- 现代 JavaScript 异步编程的首选方案

**代码示例：**

```javascript
// async/await 基本用法
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  } finally {
    console.log('请求完成');
  }
}

// 并发执行多个异步操作
async function fetchMultipleData() {
  try {
    const [userData, postsData, commentsData] = await Promise.all([
      fetch('/api/user'),
      fetch('/api/posts'),
      fetch('/api/comments')
    ]);
    
    return {
      user: await userData.json(),
      posts: await postsData.json(),
      comments: await commentsData.json()
    };
  } catch (error) {
    console.error('批量请求失败:', error);
  }
}
```

### 5. 事件/发布订阅模式

**基本概念：** 事件触发后异步执行监听

**代码示例：**

```javascript
// 自定义事件系统
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// 使用示例
const emitter = new EventEmitter();
emitter.on('dataLoaded', (data) => {
  console.log('数据已加载:', data);
});
emitter.emit('dataLoaded', { users: 100 });
```

### 6. Web Worker

**基本概念：** 开辟子线程执行耗时任务，真正并行

**特点：**

- 不能操作 DOM，不能访问 window 对象
- 基于事件机制通信
- 适合 CPU 密集型任务

**代码示例：**

```javascript
// 主线程
const worker = new Worker('worker.js');

worker.postMessage({ type: 'CALCULATE', data: largeDataSet });

worker.onmessage = function(e) {
  console.log('计算结果:', e.data);
};

worker.onerror = function(error) {
  console.error('Worker 错误:', error);
};

// worker.js
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  if (type === 'CALCULATE') {
    // 执行耗时计算
    const result = performHeavyCalculation(data);
    self.postMessage(result);
  }
};
```

## 核心机制：事件循环

所有异步编程都基于事件循环和任务队列，让耗时任务放入异步队列，主线程继续执行。

### 事件循环详解

```javascript
// 微任务和宏任务示例
console.log('1. 同步代码');

setTimeout(() => console.log('2. 宏任务'), 0);

Promise.resolve().then(() => console.log('3. 微任务'));

console.log('4. 同步代码');

// 输出顺序：1, 4, 3, 2
```

### 任务队列优先级

1. **同步任务** - 立即执行
2. **微任务** - Promise.then, queueMicrotask
3. **宏任务** - setTimeout, setInterval, I/O 操作

## 最佳实践推荐

**推荐使用 async/await**，因为：

- 语义清晰，代码可读性强
- 能优雅处理错误
- 支持并发和串行控制
- 现代 JavaScript 标准

## 深入理解 async/await

### await 在等什么？

**await 等的本质是一个表达式的结果，通常是一个 Promise。**

```javascript
// 等待 Promise
async function example1() {
  const result = await fetch('/api/data'); // 等待 Promise
  return result;
}

// 等待非 Promise 值
async function example2() {
  const result = await 42; // 会被 Promise.resolve(42) 包装
  const result2 = await 'hello'; // 会被 Promise.resolve('hello') 包装
  return { result, result2 };
}
```

**执行机制：**

- 如果是 Promise，JS 会暂停当前 async 函数的执行
- 把后续代码放入微任务队列中
- 直到该 Promise resolve/reject 后再继续执行
- 如果是非 Promise 值，会被 `Promise.resolve()` 包装成 resolved 状态的 Promise，立即执行

### await 后面一定是 Promise 吗？

**不是！** await 后面可以跟任何表达式，包括：

- 基本类型：`await 42`
- 对象：`await { name: 'test' }`
- 函数调用：`await someFunction()`
- 变量：`await myVariable`

```javascript
async function demonstrateAwait() {
  // 基本类型
  const num = await 123;
  
  // 对象
  const obj = await { name: 'JavaScript' };
  
  // 函数调用（可能返回 Promise 或普通值）
  const result = await Math.random();
  
  // 变量
  const value = await someVariable;
  
  return { num, obj, result, value };
}
```

## 进程与线程详解

### 基本概念

**进程（Process）：**

- 操作系统进行资源分配和调度的最小单位
- 程序的执行实例，拥有独立的内存空间（堆、栈、代码段等）
- 进程间相互独立，一个进程崩溃不会影响其他进程

**线程（Thread）：**

- CPU 调度和执行的基本单位
- 进程内的一个执行流
- 一个进程可以包含多个线程，共享进程的内存空间和资源

### 对比分析

| 特性 | 进程 | 线程 |
|------|------|------|
| **资源开销** | 独立内存空间，切换开销大 | 共享进程资源，切换开销小 |
| **内存隔离** | 独立地址空间，崩溃不影响其他进程 | 共享内存，一个线程出错可能影响其他线程 |
| **通信方式** | IPC（进程间通信）较复杂，需要管道、消息队列等 | 通过共享变量直接通信 |
| **创建成本** | 高 | 低 |
| **安全性** | 高（内存隔离） | 低（共享内存） |

### 浏览器多进程架构

```javascript
// 浏览器进程模型
/*
主进程 (Browser Process)
├── 渲染进程 (Renderer Process) - 每个标签页
├── GPU 进程 (GPU Process)
├── 网络进程 (Network Process)
├── 插件进程 (Plugin Process)
└── 扩展进程 (Extension Process)
*/

// JavaScript 主线程
console.log('JavaScript 运行在主线程中');
```

### 死锁问题

**死锁产生条件：**

1. 互斥条件：资源不能被多个线程同时使用
2. 请求和保持：线程持有资源的同时请求其他资源
3. 不可剥夺：资源不能被强制释放
4. 循环等待：形成资源请求的环形链

**经典死锁示例：**

```javascript
// 伪代码示例
// 线程1：先拿锁A，再拿锁B
lockA.acquire();
// ... 一些操作
lockB.acquire(); // 等待线程2释放锁B

// 线程2：先拿锁B，再拿锁A  
lockB.acquire();
// ... 一些操作
lockA.acquire(); // 等待线程1释放锁A

// 结果：两个线程互相等待，形成死锁
```

## 网络协议层次

### HTTP 协议位置

### HTTP 属于应用层协议

```text
OSI 七层模型：
7. 应用层    ← HTTP、HTTPS、FTP、SMTP
6. 表示层    ← 数据加密、压缩
5. 会话层    ← 建立、管理会话
4. 传输层    ← TCP、UDP
3. 网络层    ← IP、ICMP
2. 数据链路层 ← 以太网、WiFi
1. 物理层    ← 电缆、光纤
```

### HTTP 协议特点

```javascript
// HTTP 请求示例
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

**HTTP 特点：**

- 无状态协议
- 基于请求/响应模型
- 支持多种方法（GET、POST、PUT、DELETE等）
- 可缓存
- 明文传输（HTTPS 提供加密）

## 实际应用场景

### 1. 数据获取与处理

```javascript
// 串行处理
async function processDataSequentially() {
  try {
    const user = await fetchUser();
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    return { user, posts, comments };
  } catch (error) {
    console.error('数据处理失败:', error);
  }
}

// 并行处理
async function processDataParallel() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ]);
    return { user, posts, comments };
  } catch (error) {
    console.error('并行处理失败:', error);
  }
}
```

### 2. 错误处理最佳实践

```javascript
// 统一错误处理
class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function robustApiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP Error: ${response.status}`,
        response.status,
        'HTTP_ERROR'
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new ApiError(
      '网络请求失败',
      0,
      'NETWORK_ERROR'
    );
  }
}
```

### 3. 性能优化技巧

```javascript
// 请求去重
const requestCache = new Map();

async function cachedRequest(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }
  
  const promise = fetch(url).then(response => response.json());
  requestCache.set(url, promise);
  
  return promise;
}

// 超时控制
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('请求超时');
    }
    throw error;
  }
}
```

## 总结

异步编程是 JavaScript 的核心特性，从回调函数到 async/await 的演进，体现了语言的发展趋势。掌握异步编程不仅能提升代码质量，还能优化用户体验。在实际开发中，应根据具体场景选择合适的异步方案，并注重错误处理和性能优化。
