# Vue Login System

一个基于 Vue 3 + TypeScript 的现代化登录系统，提供完整的用户认证、权限管理和优雅的用户界面。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Element Plus** - Vue 3 组件库
- **Pinia** - Vue 状态管理库
- **Axios** - HTTP 客户端
- **@vueuse/core** - Vue 组合式 API 工具集

## ✨ 功能特性

### 🔐 用户认证

- 用户登录/登出
- Token 自动管理
- 记住我功能
- 登录状态持久化
- Token 过期检查

### 🛡️ 权限管理

- 路由权限控制
- 角色权限验证
- 页面访问守卫
- 权限状态管理

### 🎨 用户界面

- 现代化登录界面
- 响应式设计
- 优雅的动画效果
- 暗色主题支持
- 移动端适配

### 🔧 开发体验

- TypeScript 类型安全
- 自动导入配置
- Mock 数据支持
- 热更新开发
- 代码分割优化

## 📁 项目结构

```
src/
├── api/                 # API 接口
│   ├── login.ts        # 登录相关接口
│   ├── request.ts      # 请求封装
│   └── types.ts        # API 类型定义
├── components/         # 公共组件
│   ├── common/         # 通用组件
│   └── HelloWorld.vue  # 示例组件
├── mocks/              # Mock 数据
│   └── login.ts        # 登录 Mock
├── router/             # 路由配置
│   ├── guards.ts       # 路由守卫
│   └── index.ts        # 路由定义
├── stores/             # 状态管理
│   ├── app.ts          # 应用状态
│   └── user.ts         # 用户状态
├── styles/             # 样式文件
│   ├── animations.css  # 动画样式
│   └── variables.css   # CSS 变量
├── types/              # 类型定义
│   ├── api.ts          # API 类型
│   ├── common.ts       # 通用类型
│   └── user.ts         # 用户类型
├── utils/              # 工具函数
│   ├── auth.ts         # 认证工具
│   ├── errorHandler.ts # 错误处理
│   ├── format.ts       # 格式化工具
│   ├── storage.ts      # 存储工具
│   └── validation.ts   # 验证工具
└── views/              # 页面组件
    ├── Home.vue        # 首页
    ├── Login.vue       # 登录页
    └── NotFound.vue    # 404页面
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 🔑 演示账户

- **用户名**: admin
- **密码**: 123456

## 🎯 主要功能

### 登录系统

- 表单验证（用户名 3-20 字符，密码 6-20 字符）
- 记住我功能
- 登录状态管理
- 自动跳转

### 权限控制

- 路由守卫
- Token 验证
- 角色权限检查
- 页面访问控制

### 用户体验

- 加载状态提示
- 错误信息展示
- 成功反馈
- 响应式布局

## 🛠️ 配置说明

### Vite 配置

- 自动导入 Element Plus 组件
- 路径别名配置 (`@` 指向 `src`)
- Mock 数据支持
- 代码分割优化
- 开发服务器配置

### TypeScript 配置

- 严格类型检查
- 路径映射
- 自动类型生成

### 样式系统

- CSS 变量系统
- 响应式断点
- 主题色彩
- 工具类

## 📱 响应式设计

- 移动端优先设计
- 断点适配
- 触摸友好
- 性能优化

## 🔒 安全特性

- Token 自动过期
- 路由权限验证
- 输入验证
- XSS 防护

## 🎨 主题定制

项目使用 CSS 变量系统，支持：

- 颜色主题定制
- 暗色模式
- 响应式字体
- 动画效果

## 📦 构建优化

- 代码分割
- 资源压缩
- Tree Shaking
- 缓存优化

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
