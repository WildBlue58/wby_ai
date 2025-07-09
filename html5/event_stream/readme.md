# 流式输出

- 为什么会考这道题?
  25 年大厂必考题

  - LLM 聊天机器人(23 年的 AI 爆款 -> 24 年 推理 -> 25 年 AI Agent 年) AI 产品
  - 流式输出属于用户体验，前端职责

- 为何需要流式输出?

  - 边生成边输出?
    后端、LLM API 方式提供给我们？
    AIGC 生成式的大模型 一个 token 一个 token transform (google) 出来的
    "我是你的 assistant," token 开销付费的
    更快的看到响应

- 前端的职责

  - 良好的用户体验
  - 尽快返回结果
    障眼法 生成要花时间哦，我愿意等
    最懂用户心理的

- 步骤

  - 前端能实现流式输出?
    setInterval 异步 事件机制 message

  - 后端又怎么实现?
    socket 长链接
    http 请求是基于请求响应式简单协议 关闭链接?
    http 2.0 server push 服务器端推送

## 全栈能力

- npm init -y node 后端
- npm i express 老牌的 node 框架

## 具体实现

### 前端实现 (index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LLM Chatbot</title>
  </head>
  <body>
    <h1>流式输出</h1>
    <div id="messages"></div>
    <script>
      // 发送请求
      // HTML5 事件流 给他支持 SSE 的地址
      // SSE Server Sent Events 服务器端推送事件
      const source = new EventSource("/sse");
      source.onmessage = function (event) {
        // console.log(event.data);
        const messages = document.getElementById("messages");
        messages.innerHTML += event.data + "<br>";
      };
    </script>
  </body>
</html>
```

**关键点：**

- 使用 `EventSource` API 建立 SSE 连接
- 监听 `onmessage` 事件接收服务器推送的数据
- 实时将接收到的数据追加到页面显示

### 后端实现 (index.js)

```javascript
const express = require("express");
const app = express();

// 静态文件服务
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// SSE 路由实现
app.get("/sse", (req, res) => {
  // 设置 SSE 响应头
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // 定时推送数据
  setInterval(() => {
    const message = `Current time: ${new Date().toLocaleTimeString()}`;
    res.write(`data: ${message}\n\n`);
  }, 1000);
});

const http = require("http").Server(app);
http.listen(1314, () => {
  console.log("Server is running on port 1314");
});
```

**关键点：**

- 设置正确的 SSE 响应头：`text/event-stream`
- 使用 `res.write()` 推送数据，格式为 `data: message\n\n`
- 使用 `setInterval` 模拟流式数据推送
- 保持长连接不断开

### 技术要点

1. **SSE (Server-Sent Events)**

   - HTML5 标准，用于服务器向客户端推送数据
   - 单向通信，只能服务器向客户端推送
   - 自动重连机制

2. **响应头设置**

   - `Content-Type: text/event-stream` - 标识 SSE 流
   - `Cache-Control: no-cache` - 禁用缓存
   - `Connection: keep-alive` - 保持连接

3. **数据格式**

   - 每条消息以 `data:` 开头
   - 以 `\n\n` 结尾表示消息结束
   - 支持多行数据

4. **启动方式**

   ```bash
   node index.js
   ```

   然后访问 `http://localhost:1314`

### 应用场景

- LLM 聊天机器人的流式回复
- 实时数据推送（股票、天气等）
- 进度条更新
- 实时通知系统

## 这篇博客已写完
