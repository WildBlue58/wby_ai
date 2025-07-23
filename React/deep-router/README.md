# deep router

- router
- 401
- 301/302 重定向
- 404
- 性能优化

- SPA 带来了优质的用户体验
  - 快
  - 不会白屏，不依赖于 http 去服务器端请求页面
- 前端首先加路由,SPA 应用
  React
  ReactRouter
  Redux
- 导航，封装
- 路由懒加载
  - lazyload
  - /home
  - /about About
    只加载当前需要的，
    其他的不加载
    首页
- es6 module 引入模块并且会执行
- 懒加载的流程
  - import es6 module 加载并执行太多非必要组件
    影响首页的加载，特别是页面多的时候
  - 导入 lazy，suspense
    lazy 高阶组件(返回值是组件)
  - import('./pages/Home') 动态加载
  - `<Route/>`匹配到 才会去动态加载相应的组件
  - Suspense 在还未加载前 fallback

## 补充说明

### 1. 目录结构说明

本项目主要目录结构如下：

```bash
src/
  ├── App.jsx                // 路由主入口，配置所有路由
  ├── main.jsx               // React 应用入口
  ├── components/            // 公共组件（如导航栏）
  └── pages/                 // 各页面目录
        ├── Home/           // 首页
        ├── About/          // 关于页
        ├── Login/          // 登录页
        ├── Pay/            // 支付页（受保护路由示例）
        ├── NotFound/       // 404 页面
        └── ProtectRoute/   // 路由守卫组件
```

### 2. 主要功能点

- **路由懒加载**：使用 React.lazy 和 Suspense 实现页面级组件的按需加载，提升首屏性能。
- **路由守卫/鉴权**：通过 ProtectRoute 组件实现对敏感页面（如支付页）的访问控制，未登录用户会被重定向到登录页。
- **登录逻辑**：简单的本地存储登录状态，用户名 admin，密码 123456。
- **404 页面**：未匹配到的路由自动跳转到 NotFound 页面。
- **导航栏**：通过 Navigation 组件实现页面间跳转。

### 3. 关键代码说明

- **App.jsx**：集中管理路由，演示了懒加载、路由守卫、404 处理等。
- **ProtectRoute**：判断 localStorage 中 isLogin 字段，未登录则重定向到 /login，并记录来源页面。
- **Login**：登录成功后自动跳转回来源页面或首页。

### 4. 运行方式

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动项目

   ```bash
   npm start
   ```

3. 访问 `http://localhost:5173` 查看效果。

### 5. 进阶建议

- 可将登录鉴权逻辑替换为真实后端接口。
- 可扩展更多页面和更复杂的路由嵌套。
- 可引入 Redux、MobX 等状态管理工具。
