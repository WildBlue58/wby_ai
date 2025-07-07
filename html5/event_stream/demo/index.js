// 启动 http server
// 引入 express 框架
// import express from 'express';
// node 最初的 common.js 的模块化方案
const express = require('express');
// console.log(express);

const app = express();// 后端应用 App

// 路由
app.get('/', (req, res) => {
    // 返回index.html
    // res.send('Hello,World!');// str
    // response 有请求req 用户,浏览器(proxy) url localhost:1314 + get + path /
    // http 足够简单 高并发 用户赶快走 断开联系
    // __dirname 项目的根目录
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

// 添加一个支持server push 的路由
app.get('/sse', (req, res) => {
    // 支持server push 不断的服务器端推送 少量的
    // 设置响应头
    res.set({
        // stream 文本流 事件
        'Content-Type': 'text/event-stream',
        // 缓存
        'Cache-Control': 'no-cache',// 禁止前端使用缓存
        // 长连接
        'Connection': 'keep-alive', // 保持连接
    });
    res.flushHeaders();
    setInterval(() => {
        const message = `Current time: ${new Date().toLocaleTimeString()}`;
        // server push
        res.write(`data: ${message}\n\n`);
    }, 1000);
})

// node 内置模块
const http = require('http').Server(app);// Server 基本能力 B/S 架构


// 监听? 伺服状态 伺候用户
http.listen(1314, () => {
    console.log('Server is running on port 1314');
});