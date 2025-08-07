// commonjs
const http = require("http");
// js 异步 异步无阻塞
// node 天生性能好 相同用户访问数，使用的服务器数量少，更便宜
const server = http.createServer((req, res) => {
  // 添加 CORS 头部
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/api/hello" && req.method === "GET") {
    console.log("//////");

    // 检查是否是 JSONP 请求
    const url = new URL(req.url, `http://${req.headers.host}`);
    const callback = url.searchParams.get("callback");

    const data = {
      code: 0,
      msg: "字节，我来了",
    };

    if (callback) {
      // JSONP 响应
      res.writeHead(200, {
        "Content-Type": "text/javascript",
      });
      res.end(callback + "(" + JSON.stringify(data) + ")");
    } else {
      // 普通 JSON 响应
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(data));
    }
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
// 服务器程序在8080 端口上运行
server.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
