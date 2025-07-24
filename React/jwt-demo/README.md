# jwt 登录鉴权

- isLogin user 全局状态 zustand
- mock 登录模拟

  - apifox api 请求模拟
    不用写页面，就可以发送请求
    curl

- 会话授权

  - 服务器知道我们是谁?
  - http 是无状态的
    - 请求头 cookie
    - server 种下一个 cookie 唯一 sid 值 sid => user
    - 每次请求中 从 cookie 读取到 sid 值
    - 服务器多就知道是我们了

- 登录和用户鉴权方案 JWT JSON Web Token
  - {id:112,username:'帅的惊动党中央',level:4...} user JSON 格式的数据
  - 一种算法 生成一个 hash 串
  - token 服务器端令牌
  - 带上 token
  - decode 解码
    {id:112,username:'帅的惊动党中央',level:4...}
- jsonwebtoken
  jwt 鉴权的库
  sign 颁发一个 token user,secret
  decode secret 验证 token user
  - pnpm i jwt
  - import jwt from "jsonwebtoken";
  - sign
  - HTTP 请求头 Authorization 带上 token
  - Cookie 每次自动带上
  - token 需要手动设置的
- 加盐
  secret
  传递 token 前面会加上 Bearer ${token} 持有者
  通过 http headers Authorization

- 前端的用户权限状态 流程
  - zustand
    登录、user useUserStore
  - 登录页面
    受控/非受控组件
  - 路由守卫

---

# JWT 实战项目博客

## 1. 项目简介

本项目是一个基于 React 的 JWT 登录鉴权实战示例，包含 mock 后端、前端鉴权、全局状态管理、路由守卫等完整流程，适合前端开发者学习和实践。

## 2. JWT 原理简述

JWT（JSON Web Token）是一种用于身份验证的令牌机制。用户登录后，服务器颁发 token，前端存储并在后续请求中通过 HTTP Header 发送，后端验证 token 以确认用户身份。

## 3. 项目目录结构

```
React/jwt-demo/
├── mock/           # mock 后端接口
│   └── login.js    # 登录与用户信息接口，签发和校验 JWT
├── src/
│   ├── api/        # axios 配置与接口封装
│   │   ├── config.js
│   │   └── user.js
│   ├── components/ # 公共组件
│   │   ├── NavBar
│   │   └── RequireAuth
│   ├── store/      # zustand 用户状态管理
│   │   └── user.js
│   ├── views/      # 页面组件
│   │   ├── Home
│   │   ├── Login
│   │   └── Pay
│   ├── App.jsx     # 路由与主逻辑
│   └── main.jsx    # 入口文件
└── README.md
```

## 4. 关键代码讲解

### 4.1 mock 后端（mock/login.js）

- 使用 `jsonwebtoken` 库，模拟登录接口，校验用户名密码，签发 JWT。
- 用户信息接口校验 Authorization 头部的 token，解码后返回用户信息。

### 4.2 axios 拦截器（src/api/config.js）

- 请求拦截器：自动从 localStorage 获取 token，添加到请求头 Authorization。
- 响应拦截器：可统一处理响应。

### 4.3 用户状态管理（src/store/user.js）

- 使用 zustand 管理 user 和 isLogin 状态。
- login 方法调用登录接口，保存 token 和用户信息。
- logout 方法清除 token 和状态。

### 4.4 路由守卫（src/components/RequireAuth）

- 通过 isLogin 判断用户是否已登录，未登录则跳转到登录页。

### 4.5 登录页面（src/views/Login）

- 非受控组件获取用户名和密码，调用 login 方法，登录成功后跳转首页。

### 4.6 其他

- NavBar 根据登录状态显示不同内容。
- App.jsx 负责路由配置和全局用户信息获取。

## 5. 实战流程详解

1. 用户访问登录页，输入用户名和密码。
2. 前端调用 `/api/login`，mock 后端校验并返回 JWT token。
3. 前端保存 token 到 localStorage，并更新全局登录状态。
4. 访问需要鉴权的页面（如 /pay），RequireAuth 组件判断 isLogin，未登录则重定向到登录页。
5. 已登录用户访问时，axios 自动携带 token，请求 `/api/user` 获取用户信息。
6. 用户可点击登出，清除 token 和状态。

## 6. 总结与思考

- JWT 适合前后端分离项目的无状态鉴权。
- 前端需妥善存储和管理 token，避免 XSS 泄露。
- 路由守卫和全局状态管理是前端鉴权的关键。
- mock 后端便于本地开发和测试。

---

> 本文覆盖了 JWT 实战项目的完整流程与核心知识点，适合前端开发者参考与实践。

## 7. 相关知识点讲解

### 7.1 JWT 的结构

JWT 由三部分组成：Header、Payload、Signature。  
格式：`xxxxx.yyyyy.zzzzz`

- **Header**：声明类型（typ）和签名算法（alg）。
- **Payload**：存放用户信息和自定义字段（如用户 ID、权限等），但不要存敏感信息。
- **Signature**：用密钥对前两部分签名，防止篡改。

### 7.2 Token 存储位置选择

- **localStorage**：简单易用，但易受 XSS 攻击。
- **sessionStorage**：生命周期短，刷新页面不丢失，但同样有 XSS 风险。
- **Cookie**：可设置 httpOnly，防止 XSS，但需防范 CSRF。
- **最佳实践**：如有安全要求，推荐后端设置 httpOnly Cookie，前端无法直接访问。

### 7.3 Token 过期与刷新机制

- JWT 通常设置有效期（如 1 小时），过期后需重新登录或刷新 token。
- **刷新方案**：可引入 refresh token，短 token 用于鉴权，refresh token 用于换取新 token，提升安全性和用户体验。

### 7.4 前后端分离下的鉴权流程

- 前端登录后保存 token，每次请求带上 Authorization 头。
- 后端校验 token，返回数据或 401 未授权。
- 前端收到 401 可自动跳转登录页或尝试刷新 token。

### 7.5 常见安全问题与防护

- **XSS**：token 存储在 localStorage 时，需防范脚本注入。
- **CSRF**：token 放在 httpOnly Cookie 时，需配合 CSRF Token 防护。
- **token 泄露**：token 一旦泄露，攻击者可冒充用户，建议定期失效、绑定设备/UA/IP 等。

### 7.6 JWT 与 Session 的区别

- **Session**：服务端存储，需维护会话，适合小型应用。
- **JWT**：无状态，前后端分离友好，适合分布式和微服务架构。

### 7.7 适用场景与不适用场景

- **适用**：SPA、移动端、微服务、API 鉴权。
- **不适用**：高安全性、需频繁失效、服务端需主动控制会话的场景。

---

## 8. 关键代码文件示例

### 8.1 mock 后端接口（mock/login.js）

```js
import jwt from "jsonwebtoken";
const secret = "!$123asdfg";
export default [
  {
    url: "/api/login",
    method: "post",
    timeout: 2000,
    response: (req, res) => {
      const { username, password } = req.body;
      if (username !== "admin" || password !== "123456") {
        return { code: 1, message: "用户名或密码错误" };
      }
      const token = jwt.sign(
        { user: { id: "001", username: "admin", level: 4 } },
        secret,
        { expiresIn: "1h" }
      );
      return { token, data: { id: "001", username: "admin", level: 4 } };
    },
  },
  {
    url: "/api/user",
    method: "get",
    response: (req, res) => {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return { code: 1, message: "未携带 token" };
      const token = authHeader.split(" ")[1];
      try {
        const decode = jwt.decode(token, secret);
        return { code: 0, data: decode.user, message: "获取用户信息成功" };
      } catch (err) {
        return { code: 1, message: "Invalid token" };
      }
    },
  },
];
```

### 8.2 axios 拦截器（src/api/config.js）

```js
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5173/api";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axios.interceptors.response.use((res) => {
  return res;
});
export default axios;
```

### 8.3 用户状态管理（src/store/user.js）

```js
import { create } from "zustand";
import { doLogin } from "../api/user";
export const useUserStore = create((set) => ({
  user: null,
  isLogin: false,
  login: async ({ username = "", password = "" }) => {
    const res = await doLogin({ username, password });
    const { token, data: user } = res.data;
    localStorage.setItem("token", token);
    set({ user, isLogin: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isLogin: false });
  },
}));
```

### 8.4 路由守卫（src/components/RequireAuth/index.jsx）

```jsx
import { useUserStore } from "../../store/user";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
const RequireAuth = ({ children }) => {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (!isLogin) {
      navigate("/login", { from: pathname });
    }
  }, [isLogin, navigate, pathname]);
  if (!isLogin) {
    return null;
  }
  return <>{children}</>;
};
export default RequireAuth;
```

### 8.5 登录页面（src/views/Login/index.jsx）

```jsx
import { useRef } from "react";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const { login } = useUserStore();
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (!username || !password) {
      alert("请输入用户名和密码");
      return;
    }
    login({ username, password });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          ref={usernameRef}
          placeholder="请输入用户名"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          ref={passwordRef}
          placeholder="请输入密码"
          required
        />
      </div>
      <div>
        <button type="submit">登录</button>
      </div>
    </form>
  );
};
export default Login;
```

---

> 以上为本项目最核心的代码文件片段，配合知识点讲解可帮助读者快速理解和实践 JWT 登录鉴权的完整流程。
