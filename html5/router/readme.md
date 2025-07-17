# 路由

history
hash

- 传统页面开发
  重要的用户体验缺失
  - 需要去到后端拿到新的HTML，重新渲染
    白屏
  - a 链接切换页面
  - 相比于react-router-dom 局部热更新
  前端路由 去负责

- 新的react-router-dom SPA Single Page Application 单页应用
  只有一个页面 但能带来多页面效果

## SPA 单页面应用

- Single Page Application 单页面应用
- 只有一个页面
  - react 组件
    页面级别组件
  - Routes/Route 申明 文档流中占位
  - Routes 外面，Outlet 外面
  - url
  - Route 内部显示哪个页面组件
    热更新

  - 用一个页面完成了多个页面的显示
  - SPA 用户体验特别棒

## 核心

- url 切换
  不能用a
  Link
  不去重新发送请求,
  事件,JS 动态加载

- 事件 hashchange/pushState
- 根据当前的url，取对应的组件
  替换之前的页面级别组件
- 体验是
  URL 改变了，竟然不用刷新整个页面
- 不再看白屏
  页面很快
  About
  Home 全是前端组件

## url 改变，但不重新渲染的解决方案

- hash 的改变 很早就有
  原来是用来做页面锚点，长页面的电梯
  不会刷新页面
  #/
  #/about
- 事件
  hashchange

## 这篇博客已写完

## 基于SPA

- url 可以改变，但不会向后端发送请求 前端路由
  - hash + hashchange 事件 + DOM
  - history + pushState + popState 事件 + DOM
- 前端路由 react-router-dom 配置 页面级别组件
  热更新 Route
  Outlet
- 单页应用
  只有一个页面 但可以有多个url 路由状态
  页面级别组件
  window.location window.history
  栈
  State

- history
  很早就有，在浏览器历史记录里游走
  - html5 赋予history 新的功能
  - hash + hashchange 有优点，但是有很大的缺点
    兼容性好
    缺点 <http://127.0.0.1:5500/html5/router/3.html#home>
    hash 不能理解
    不这样，传统后端路由一样
    <http://127.0.0.1:5500/html5/router/3.html> 首页
    <http://127.0.0.1:5500/html5/router/3.html/home> 首页
    <http://127.0.0.1:5500/html5/router/3.html/about> 关于我们
    <http://127.0.0.1:5500/html5/router/3.html/contact> 联系我们

  - 怎么样像后端路由，不刷新页面
  html5 升级了history API 来实现之
  - pushState
    - 添加一条历史记录
    - 不会刷新页面
    - 可以添加数据
    - 可以添加标题
    - 可以添加图标
