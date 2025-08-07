const http = require("http");

const server = http.createServer((req, res) => {
  // 设置CORS头，允许所有来源（开发环境）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, PATCH, GET, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/api/test" && req.method === "PATCH") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "跨域成功！！！",
      })
    );
  } else {
    // 处理其他路径
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: "Not Found",
      })
    );
  }
});

server.listen(8000, () => {
  console.log("CORS server is running on port 8000");
});
