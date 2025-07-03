// ES6 模块化
// mjs 后缀使用ES6模块化
// 模块化是语言的能力
// node 默认不支持ES6 模块化
// node 最新版本支持了 22
// node 准备跟require common.js say goodbye
// ES6 module 更先进 mjs 
import http from 'http';

const server = http.createServer((req, res) => {
    res.end("Hello Http Server")
})

server.listen(1234);