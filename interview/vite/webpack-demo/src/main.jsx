import { aMessage } from "./a.js";
import Hello from "./Hello.jsx";
import React from "react";
import { createRoot } from "react-dom/client";
// 引入css 文件
import "./main.css";

// 使用 React 渲染
const root = createRoot(document.getElementById("app"));
root.render(
  <div>
    <h1>Webpack</h1>
    <p>{aMessage()}</p>
    <Hello />
  </div>
);
