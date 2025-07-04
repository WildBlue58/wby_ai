# Storage 存储

- 前端存储
  - localStorage
  - sessionStorage
  - indexedDB
  - cookie
    - 存储啥玩意
      - 登录状态
      - 购物车
- 后端存储
  - MySQL
  - NoSQL
  - MongoDB
- 缓存

## 首页

- 用户的登陆状态
  cookie
  - 服务器识别用户
  - B/S 架构软件 http 协议
  - http 0.9 版本 没有身份
  - http 是无状态协议
    请求一次和一千次，拿到的内容都一致
    身份状态？
  - http 1.0 正式版
    header 请求头
    Content-Type 请求体
    Authorization 授权
    Cookie uid=20050308
    用户带上，服务器解析 你的身份
    http 协议还是无状态的，请求头 可以夹带一些私货
  - 界面有哪些状态
    未登录 已登录 用户身份 时间 过期 主动登出

- 前后端联调
  - 前端表单
    阻止默认行为
    收集表单值
    fetch 请求 await 等待服务器端相应请求
    POST /login api 地址 前后端接口