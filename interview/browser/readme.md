# 浏览器

## 从URL输入到页面显示

知识体系考题

### 详细流程

1. **用户输入URL**
   - 地址栏输入，浏览器判断是搜索还是URL
   - 如果是URL，进行URL解析

2. **DNS解析**
   - 查询DNS缓存（浏览器缓存 → 系统缓存 → 路由器缓存）
   - 如果缓存没有，进行DNS查询（递归查询 → 迭代查询）
   - 获取IP地址

3. **建立TCP连接**
   - 三次握手建立连接
   - HTTPS需要TLS握手

4. **发送HTTP请求**
   - 构建HTTP请求报文
   - 通过TCP连接发送到服务器

5. **服务器处理请求**
   - 服务器接收请求并处理
   - 返回HTTP响应报文

6. **浏览器接收响应**
   - 接收响应数据
   - 根据Content-Type决定如何处理

7. **解析HTML**
   - 构建DOM树
   - 解析CSS构建CSSOM树
   - 构建渲染树（Render Tree）
   - 布局（Layout/Reflow）
   - 绘制（Paint）
   - 合成（Composite）

8. **页面渲染完成**
   - 触发DOMContentLoaded事件
   - 所有资源加载完成后触发load事件

## 多进程，多线程架构 Chrome 为例

### 浏览器的主要进程

- 浏览器主线程
- 渲染进程
- 下载进程
- 插件进程 Flash插件
- GPU进程

### 要点

- 输入url 到下载html，切入对浏览器多进程的讲解
- Browser进程 主要负责浏览器，导航功能等，
  还有各个子进程的创建和管理，通信
- GPU 进程只有一个，加速的
  transform:translate3D
- 渲染进程
  - 每个tab 都有独立的渲染进程
  - 安全、快
  - 多线程架构
    - **GUI渲染线程**
      - dom 树、cssom树、渲染树、Layout 树，图层合并...
      - bit map 交给主线程去绘制
      - 负责页面渲染、重绘、重排
    - **JS引擎线程**
      - V8 引擎，单线程
      - 执行JavaScript代码
      - GUI线程与JS线程互斥，如果JS执行时间过长，就会造成页面渲染阻塞
    - **事件触发线程**
      - 管理事件队列
      - 将事件添加到任务队列
    - **定时器线程**
      - setTimeout、setInterval
      - 计时完成后将回调添加到任务队列
    - **异步HTTP请求线程**
      - XMLHttpRequest
      - 请求完成后将回调添加到任务队列
    - **Event Loop线程**
      - 事件循环机制
      - 负责从任务队列中取出任务执行

- 进程间的通信
  - Browser进程(CEO) 管理的各个进程
  - Browser进程和外界，和硬件间的通信
  - 分配资源的最小单元
  - IPC（Inter-Process Communication）机制
  - 使用消息传递进行通信

## Event Loop 事件循环

### 宏任务（MacroTask）

- script（整体代码）
- setTimeout、setInterval
- I/O操作
- UI渲染
- postMessage
- MessageChannel

### 微任务（MicroTask）

- Promise.then/catch/finally
- queueMicrotask
- MutationObserver
- process.nextTick（Node.js）

### 执行顺序

1. 执行同步代码
2. 执行完所有微任务
3. 执行一个宏任务
4. 再次执行完所有微任务
5. 循环执行步骤3-4

## 渲染流程详解

### 1. 构建DOM树

- HTML解析器解析HTML文档
- 生成DOM节点树

### 2. 构建CSSOM树

- CSS解析器解析CSS
- 生成CSS规则树

### 3. 构建渲染树（Render Tree）

- 结合DOM树和CSSOM树
- 只包含需要渲染的节点（display:none不包含）

### 4. 布局（Layout/Reflow）

- 计算每个节点的位置和大小
- 生成布局树

### 5. 绘制（Paint）

- 将布局树转换为绘制指令
- 生成绘制列表

### 6. 合成（Composite）

- 将图层合并
- 提交给GPU进程渲染
- 显示到屏幕上

## 性能优化相关

### 重排（Reflow）

- 改变元素位置、大小等几何属性
- 影响布局的操作
- 性能开销大

### 重绘（Repaint）

- 改变元素外观（颜色、背景等）
- 不影响布局
- 性能开销相对较小

### 优化建议

- 避免频繁操作DOM
- 使用transform、opacity等属性（触发合成层）
- 批量修改DOM
- 使用DocumentFragment
- 使用虚拟滚动
