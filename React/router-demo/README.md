# react-router-dom

- 路由?
  - 后端路由
    暴露资源
  - 前端路由
    - 首页
    - 列表页
    - 登录...
      前端页面导航由前端路由负责
- react 开头
  react 生态系统的一部分
  - react
    响应式、状态管理，组件、hooks 等核心功能
    - 体积大、笨重
    - 页面慢
    - 少就是多
- react-router-dom
- redux/mbox
- axios

## react 开发全家桶

- react 19
- react-dom 19
- react-router-dom 7.6.3

## react 特色

- 全面组件化
  vue 更执着
  react 函数化编程

- 动态路由
  <https://juejin.cn/users/123?a=1&b=2>
  path /users/:id params

## restful 国际规范

url 定义是核心部分

Method 资源的描述
GET /user/:id
GET /post/:id 显示某篇文章
POST /post 新增文章
PATCH /post/:id 修改文章
DELETE /post/:id 删除文章
HEAD /post/:id 获取资源的元信息

PUT(替换) PATCH(局部) 修改
上传头像 PUT /avatar/:id

- 后端路由 暴露资源

- 前端路由

- 后端路由
  早期只有后端路由
  server -> http -> 路由 -> 相应 HTML 网页 传统的后端驱动的 web 开发方式
  展示下一个页面 再来一个请求
  /
  /abot

  - 优点是足够简单
  - 前后端耦合 后端要写前端的页面
  - 浪费沟通时间
  - 逻辑，数据库，套页面 MVC 开发方式 Model(数据) View(视图) Controller(控制器)
  - 不在以返回页面为目的
  - /api/user/123 接口 返回 JSON 数据

- 前后端分离 MVVM Model(fetch api) View(JSX) ViewModel(视图模型层 useState,数据绑定 JSX)
  - 前后端连调 api 开发文档，约定
  - 前后端分离开发,以 API 开发文档为约定
  - 前端当家作主
  - 前端也有了路由
    /user/:id path 页面级别组件
  - html/css/js react 框架
    useState
    useEffect
    fetch 后端 api 接口，拿到数据
    完成 web 应用
    PC/Mobile/App/小程序/桌面端 大前端

## 项目结构

```md
src/
├── App.jsx                 # 主应用组件，配置路由
├── App.css                 # 应用样式
└── pages/                  # 页面组件目录
    ├── Home/               # 首页
    │   └── index.jsx
    ├── About/              # 关于页面
    │   └── index.jsx
    ├── UserProfile/        # 用户资料页面
    │   └── index.jsx
    └── Products/           # 产品相关页面
        ├── index.jsx       # 产品列表
        ├── ProductDetails.jsx  # 产品详情
        └── NewProduct.jsx  # 新增产品
```

## 核心概念

### 1. BrowserRouter

- 使用 HTML5 History API 的路由器
- 提供干净的 URL，无需#号
- 需要服务器配置支持

### 2. Routes & Route

- `Routes`: 路由容器，包含所有路由规则
- `Route`: 单个路由配置
- `element`: 指定渲染的组件
- `path`: 路由路径

### 3. 动态路由参数

- 使用`:参数名`定义动态参数
- 通过`useParams`钩子获取参数值

### 4. 嵌套路由

- 支持多级路由嵌套
- 子路由可以访问父路由的参数

## 实际代码示例

### 主路由配置 (App.jsx)

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/products" element={<Products />} />
        {/* 二级路由 */}
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/products/new" element={<NewProduct />} />
      </Routes>
    </Router>
  );
}
```

### 动态路由参数获取

```jsx
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log("用户ID:", id);
    console.log("当前URL:", window.location);
  }, [id]);

  return <>UserProfile {id}</>;
};
```

### 路由导航

```jsx
import { Link } from "react-router-dom";

// 基础导航
<Link to="/products">产品列表</Link>

// 带参数的导航
<Link to={`/products/${product.id}`}>查看详情</Link>

// 带样式的导航
<Link
  to="/products/new"
  style={{
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  }}
>
  添加新产品
</Link>
```

## 路由配置详解

### 1. 基础路由

```jsx
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
```

### 2. 动态路由

```jsx
<Route path="/user/:id" element={<UserProfile />} />
<Route path="/products/:productId" element={<ProductDetails />} />
```

### 3. 嵌套路由

```jsx
<Route path="/products" element={<Products />} />
<Route path="/products/:productId" element={<ProductDetails />} />
<Route path="/products/new" element={<NewProduct />} />
```

### 4. 路由优先级

- 具体路径优先于动态路径
- `/products/new` 会匹配到 `NewProduct` 组件
- `/products/123` 会匹配到 `ProductDetails` 组件

## 常用 Hook

### useParams

获取 URL 参数

```jsx
const { id, productId } = useParams();
```

### useNavigate

编程式导航

```jsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/products"); // 跳转到产品列表
navigate(-1); // 返回上一页
```

### useLocation

获取当前路由信息

```jsx
import { useLocation } from "react-router-dom";

const location = useLocation();
console.log(location.pathname); // 当前路径
console.log(location.search); // 查询参数
```

## 最佳实践

### 1. 路由组织

- 按功能模块组织路由
- 使用嵌套路由减少重复代码
- 保持路由结构清晰

### 2. 组件设计

- 页面级组件放在 pages 目录
- 可复用组件放在 components 目录
- 使用 index.jsx 作为默认导出

### 3. 参数处理

- 使用 TypeScript 定义参数类型
- 添加参数验证
- 处理参数不存在的情况

### 4. 性能优化

- 使用 React.lazy 进行代码分割
- 实现路由级别的懒加载
- 合理使用缓存策略

## 常见问题

### 1. 路由不匹配

- 检查路径拼写
- 确认路由配置顺序
- 验证组件导入

### 2. 参数获取失败

- 确认参数名称正确
- 检查 useParams 使用位置
- 验证路由配置

### 3. 导航问题

- 使用 Link 组件而非 a 标签
- 检查 to 属性值
- 确认路由存在

## 部署注意事项

### 1. 服务器配置

- 配置所有路由都指向 index.html
- 启用 HTML5 History API 支持
- 处理 404 页面

### 2. 静态资源

- 确保资源路径正确
- 配置 CDN 加速
- 优化加载性能

## 扩展阅读

- [React Router 官方文档](https://reactrouter.com/)
- [React Router v6 迁移指南](https://reactrouter.com/docs/en/v6/upgrading/v5)
- [路由设计最佳实践](https://reactrouter.com/docs/en/v6/start/overview)
