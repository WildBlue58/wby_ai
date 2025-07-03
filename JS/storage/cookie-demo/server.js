// node 后端
// node 内置的核心模块
// js 在命令行运行
// js 有两种模块化方案
// require node 早期模块化commonJS
// import ES6 更先进的模块化方案
const http = require('http');

const server = http.createServer((req, res) => {
    res.end("Hello Http Server")
})

server.listen(8080);