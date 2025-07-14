import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router, // 前端路由二选一
  Routes,
  Route,
  Link,// SPA Link 代替 a标签
} from "react-router-dom";
import Home from "./pages/Home/index";
import About from "./pages/About/index";

function App() {
  return (
    <>
      {/* 前端路由 单页面应用  */}
      <Router>
        <nav>
          <ul>
            {/* 传统路由  a标签 刷新页面 默认发送一个请求 */}
            {/* <li><a href='/'>Home</a></li> */}
            {/* <li><a href='/about'>About</a></li> */}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
