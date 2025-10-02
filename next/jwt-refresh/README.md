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

## 大文件上传

当文件比较大的时候，由于各种原因，容易失败，而且上传速度慢。
一旦失败，需要重新上传，会让用户沮丧。

采用分片上传策略（ 并发，并发限流 ），将文件切分为多个小块,并行上传，提升稳定性和效率。上传前通过Web Worker 计算文件整体以及分片的 hash，向服务器校验，若文件已存在则直接秒传。前端记录上传进度和已成功分片，支持断点续传，避免重复上传。服务器按序接受分片，存储后进行合并，并检验最终文件的完整性，结合唯一标志和分片索引，确保上传可靠。整个过程配合进度条和错误重试机制，提升用户体验与系统健壮性。

- worker hash计算
- 性能优化
  上传文件的处理函数 handleFile 使用useCallback 缓存，避免重复创建
- typescript 的使用
  - 主线程和worker 线程间的通信，数据约定
  HashWorkerIn
  HashWorkerOut
  as 断言
  非空断言 ! file!.size

- useRef的高级使用场景
  可变对象
  - DOM对象
  - 对象
  - 值
  AbortController 取消请求对象，推迟到上传再实例化
  暂停的值也用 ref 保存

- es6 特性
  - Set 已经上传的分片索引
  - ?? 空值合并操作符
  - Promise.all 并发

- restful api
  - uploadChunk POST/api/upload/chunk url 设计
  - 自定义请求头
  这里的 headers通过自定义请求头传递元数据(文件哈希、分片序号)，使服务端能在不解析请求体的情况下快速识别分片归属和顺序，提升处理效率和可扩展性。
  解析请求头就可以判断是否已上传的chunk 更快，避免重复上传。

## 项目的难点

- 分片上传的并发控制
  Promise.all + 递归
  并发限流的核心是：一开始只启动不超过 MAX_CONCURRENCY 个工人函数，每个工人执行完一个任务后会递归调用 next()，继续从队列取下一个任务，从而保证始终只有固定数量的工人在运行。这样既避免了同时创建过多 Promise 占用资源，又能充分利用并行度；等所有工人都把队列清空才 resolve，Promise.all 就能精确等待整个批次完成。

## merge 的流程

- fileHash 传入

## 虚拟列表

- 数据从何而来？
  爬取一下
- 怎么渲染列表
  - 时间分片
    setTimeout + requestAnimationFrame + createDocumentFragment
  - 虚拟列表
    按需加载
  - 分页
    滚动到底部加载更多，
    后端分页

## 🛠️ 项目设置

### 环境变量配置

1. 在项目根目录创建 `.env.local` 文件：

```bash
# 数据库连接字符串
DATABASE_URL="mysql://root:password@localhost:3306/jwt"

# JWT 密钥 (请使用一个长随机字符串)
JWT_SECRET_KEY="your-super-secret-jwt-key-here-make-it-long-and-random"

# 环境变量
NODE_ENV="development"
```

### 数据库设置

1. 创建 MySQL 数据库：

```sql
CREATE DATABASE jwt;
```

2. 运行 Prisma 迁移：

```bash
npx prisma migrate dev --name init
```

3. 生成 Prisma 客户端：

```bash
npx prisma generate
```

### 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🔧 故障排除

### 字体加载错误修复

如果遇到 `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'` 错误：

1. **已修复**：项目已移除 Turbopack 配置，使用标准 Next.js 构建
2. **字体问题**：已替换 Google Fonts 为系统字体，避免网络连接问题

### 网络连接问题

如果遇到字体获取失败的错误：

- 项目现在使用系统字体，无需网络连接
- 如需使用 Google Fonts，请确保网络连接正常
