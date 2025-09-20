# Next.js JWT 双Token认证项目

一个基于Next.js 15的全栈项目，实现了安全的JWT双Token认证系统。

## 🚀 功能特性

- ✅ **用户认证系统** - 注册、登录、JWT双Token认证
- ✅ **文章管理系统** - 创建、查看文章
- ✅ **安全中间件** - 路由保护和自动Token刷新
- ✅ **数据库集成** - Prisma ORM + MySQL
- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **现代化UI** - Tailwind CSS响应式设计

## 🔐 双Token认证机制

### 为什么使用双Token？

单Token存储在localStorage中长期保存容易被第三方拦截，存在安全风险。双Token机制提供了更好的安全性：

- **AccessToken** - 用于身份验证，有效期短（15分钟），存储在HttpOnly Cookie中
- **RefreshToken** - 用于刷新AccessToken，有效期长（7天），存储在HttpOnly Cookie中

### 工作流程

1. 用户登录后获得两个Token
2. AccessToken过期时，自动使用RefreshToken刷新
3. RefreshToken过期时，用户需要重新登录
4. 所有Token都存储在HttpOnly Cookie中，防止XSS攻击

## 开发流程

- .env
  mysql url
  create database jwt;建立数据库
- prisma 初始化
  orm 工具
  object relation mapping
  User(表) => User类
  一行 => new User() 实例
  底层数据库操作 映射成 高级的面向对象操作

- Prisma Schema 是定义数据库模型、关系和数据类型的配置文件，用于生成类型安全的数据库客户端。
  数据库的设计图
  navicat 好的地方，schema + git 留下数据库设计和修改的历史
  文档型的，可以追踪。留底

- Model 表的映射模型
  @@map("users") 指定模型对应的表名
  posts Post[] 一对多的关系
  createdAt updatedAt prisma 自动维护
  @id 主键 @unique 唯一索引
  Model User{
    columns name type @default
    索引
    relation
  }

  - migration 迁移
      记录

- restful API
- lib/复用的js 模块
- regexp
  前端，后端都要会正则
  /^.+?[]{}$/ test
  ^ 开始 $ 结束 ^$ 严格匹配整个字符
  ? 0次或一次
  -+ 一次或多次
  [] 范围
  {} 长度
- bcryptjs 加密js 模块 单项的加密算法(不能被解密)
  register 加密一次
  login password 加密一次
  比较的加密后的串是否一样？
- 状态码
  - 200 OK
  - 201 创建 Created
  - 204 无内容
  - 400 请求错误 Bad Request
  - 401 未授权 Unauthorized Forbidden
  - 403 禁止访问
  - 404 未找到 Not Found
  - 409 冲突 Conflict
  - 500 服务器错误 Internal Server Error

- middleware 的概念
  中间件 配置一个列表
  /dashboard
  Middleware 是中间件，用于在请求和响应之间执行预处理逻辑，如日志、认证、数据解析等。
  - 配置一个需要登录的页面数组
  - some startWith
  - response.next() 放行
  - response.redirect() 跳转

  - 通过jwt verify方法拿到payload后，添加了自定义的请求头
    x-user-id
    后续页面就可以拿到这个值

- JWT 的构成
  - 头部
    签名算法 HS256
  - 载荷
    {userId:....}
  - 签名
    secretKey

- cookie
  httpOnly:true
  HttpOnly 可防止 Javascript 访问 Cookie，有效抵御XSS 攻击导致的令牌泄漏。
  服务器端设置
  SameSite 可防止跨站请求伪造(CSRF)攻击，限制 Cookie 在跨域请求中的自动发送，提升安全性。

- 后端安全和性能
  - 一定要做容错处理
    try{}catch{}finally{}
  - 释放数据库对象
    await prisma.$disconnect();
- prisma client 的CRUD方法
  prisma.user.create()
  prisma.user.fineUnique()
  prisma.user.update({
    where:{},
    data:{}
  })
