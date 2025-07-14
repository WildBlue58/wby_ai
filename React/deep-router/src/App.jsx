import { useState, lazy, Suspense } from "react"; // 懒加载 异步加载占位符
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navigation from "./components";
import ProtectRoute from "./pages/ProtectRoute";
import Pay from "./pages/Pay";
// 函数 路由 -> Route -> 懒加载
// 新的组件
// 懒加载
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
// import Home from "./pages/Home";
// import About from "./pages/About";
// 30几个页面

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Suspense fallback={<div>加载中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            {/* 校验权限 鉴权 保护路由 */}
            <Route path="/pay" element={
              <ProtectRoute>
                {/* <Pay /> */}
                <div>123</div>
                <div>456</div>
              </ProtectRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
