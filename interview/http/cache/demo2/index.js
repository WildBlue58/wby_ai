// 协商缓存，在返回文件的同时，响应头
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto"); // 加密 hash计算

// 单向加密
function md5(data) {
  return crypto.createHash("md5").update(data).digest("hex");
}

http.createServer((req, res) => {
  if (req.url === "/") {
    const html = fs.readFileSync("test-html", "utf-8");
    Response.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "max-age=10,public",
      ETag: md5(html),
    });
    res.end(html);
  }
  if (req.url === "/script.js") {
    // 浏览器缓存文件的 hash
    const noneMatch = req.headers["if-none-match"];
    const filePath = path.join(__dirname, "script.js");
    const buffer = fs.readFileSync(filePath);
    const fileMd5 = md5(buffer);
    if (noneMatch === fileMd5) {
      res.writeHead(304, {
        "Content-Type": "text/javascript",
        "Cache-Control": "max-age=10,public",
        ETag: md5(html),
      });
      res.end();
    }
  }
});
