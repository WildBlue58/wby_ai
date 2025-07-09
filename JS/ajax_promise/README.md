# AJAX、Promise 与异步编程：从 XMLHttpRequest 到 Fetch API

## 📖 概述

本文将通过两个实际案例，深入探讨 JavaScript 中异步编程的演进历程：从传统的 XMLHttpRequest 到现代的 Fetch API，以及 Promise 和 async/await 的使用。

## 🎯 学习目标

- 理解 AJAX 的基本概念和工作原理
- 掌握 XMLHttpRequest 的使用方法
- 学习 Promise 的基本概念和状态
- 掌握 Fetch API 的现代用法
- 理解 async/await 语法糖的优势

## 📁 项目结构

```
ajax_promise/
├── ajax.html      # XMLHttpRequest + Promise 示例
├── index.html     # Fetch API + async/await 示例
└── README.md      # 本文档
```

## 🔧 技术栈

- **HTML5**
- **JavaScript (ES6+)**
- **GitHub API** (用于演示数据获取)

## 📚 核心概念

### 1. AJAX (Asynchronous JavaScript and XML)

AJAX 是一种在无需重新加载整个页面的情况下，能够更新部分网页的技术。它允许网页异步地向服务器发送请求并处理响应。

**主要特点：**
- 异步通信
- 无需刷新页面
- 提升用户体验
- 减少服务器负载

### 2. Promise 状态

Promise 有三种状态：
- **Pending（待定）**：初始状态，既没有被兑现，也没有被拒绝
- **Fulfilled（已兑现）**：操作成功完成
- **Rejected（已拒绝）**：操作失败

## 💻 代码示例

### 案例一：XMLHttpRequest + Promise 封装

```javascript
// ajax.html 中的核心代码
const getJSON = async(url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest() // 实例化 XHR 对象
        
        // 打开连接
        xhr.open('GET', 'https://api.github.com/users/WildBlue58/repos')
        
        // 发送请求
        xhr.send()
        
        // 监听状态变化
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                // 响应完成，解析 JSON 数据
                resolve(JSON.parse(xhr.responseText))
            }
        }
    })
}

// 使用 async/await 调用
const data = await getJSON('https://api.github.com/users/WildBlue58/repos')
document.getElementById('repos').innerHTML = data.map(item => `<li>${item.name}</li>`).join('')
```

**关键点解析：**

1. **XMLHttpRequest 对象**：早期浏览器提供的 AJAX 接口
2. **readyState 状态**：
   - 0: 请求未初始化
   - 1: 服务器连接已建立
   - 2: 请求已接收
   - 3: 请求处理中
   - 4: 请求已完成，且响应已就绪
3. **Promise 封装**：将回调地狱转换为 Promise 链式调用
4. **async/await**：使异步代码看起来像同步代码

### 案例二：Fetch API + async/await

```javascript
// index.html 中的现代写法
console.log(fetch('https://api.github.com/users/WildBlue58/repos')) // Promise {<pending>}

const result = await fetch('https://api.github.com/users/WildBlue58/repos')
const data = await result.json()

document.getElementById('repos').innerHTML = data.map(item => `<li>${item.name}</li>`).join('')
```

**关键点解析：**

1. **Fetch API**：现代浏览器原生支持的 HTTP 请求接口
2. **自动返回 Promise**：无需手动封装
3. **更简洁的语法**：相比 XMLHttpRequest 更易用
4. **内置 JSON 解析**：通过 `.json()` 方法直接解析

## 🔄 技术演进对比

| 特性 | XMLHttpRequest | Fetch API |
|------|----------------|-----------|
| **语法复杂度** | 较复杂，需要手动封装 | 简洁，原生支持 Promise |
| **错误处理** | 需要手动检查状态码 | 只有网络错误才会 reject |
| **JSON 处理** | 需要手动解析 | 内置 `.json()` 方法 |
| **浏览器支持** | 所有浏览器 | 现代浏览器 |
| **取消请求** | 支持 | 需要 AbortController |

## 🎨 实际应用场景

### 1. 前后端分离架构

```javascript
// 前端主动请求后端 API
const userData = await fetch('/api/user/profile')
const user = await userData.json()
```

### 2. 动态内容加载

```javascript
// 根据用户操作动态加载数据
async function loadUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    const repos = await response.json()
    displayRepos(repos)
}
```

### 3. 表单提交

```javascript
// 异步提交表单数据
async function submitForm(formData) {
    const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData
    })
    return await response.json()
}
```

## 🚀 最佳实践

### 1. 错误处理

```javascript
async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}
```

### 2. 超时处理

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
        const response = await fetch(url, {
            signal: controller.signal
        })
        clearTimeout(timeoutId)
        return await response.json()
    } catch (error) {
        clearTimeout(timeoutId)
        throw error
    }
}
```

### 3. 并发请求

```javascript
// 并行请求多个资源
async function fetchMultiple(urls) {
    const promises = urls.map(url => fetch(url).then(res => res.json()))
    return await Promise.all(promises)
}
```

## 🔍 调试技巧

### 1. 网络面板监控

- 打开浏览器开发者工具
- 查看 Network 面板
- 观察请求状态和响应时间

### 2. 控制台调试

```javascript
// 添加调试日志
console.log('开始请求:', url)
const response = await fetch(url)
console.log('响应状态:', response.status)
const data = await response.json()
console.log('响应数据:', data)
```

## 📖 扩展阅读

- [MDN - XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [MDN - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [MDN - Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

## 🎯 总结

通过这两个案例，我们可以看到 JavaScript 异步编程的演进：

1. **XMLHttpRequest** → **Fetch API**：语法更简洁，功能更强大
2. **回调函数** → **Promise** → **async/await**：代码更易读，错误处理更优雅
3. **手动封装** → **原生支持**：开发体验更佳

现代前端开发中，Fetch API + async/await 的组合已经成为标准做法，它提供了更好的开发体验和更清晰的代码结构。

---

*本文档基于实际项目代码编写，所有示例都可以直接运行。建议读者动手实践，加深理解。* 

## 这篇博客已完成
