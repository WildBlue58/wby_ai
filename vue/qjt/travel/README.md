# 渡归乡 XiangTravel

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.10-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**现代化旅游预订与行程管理平台**

[在线演示](https://duguixiang-travel.vercel.app) • [功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始)

</div>

---

## 📖 项目简介

**渡归乡 XiangTravel** 是一个基于 Vue 3 + TypeScript 构建的现代化旅游预订与行程管理平台。为用户提供一站式旅游服务，包括景点门票预订、酒店住宿、交通出行、租车服务等全方位旅游解决方案。

### 🎯 核心理念

- **渡归乡情** - 渡过千山万水，归来仍是故乡，让每一次旅行都承载着乡愁与美好
- **智能推荐** - 基于用户偏好的个性化旅游推荐
- **一站式服务** - 整合旅游全产业链资源
- **专业体验** - 提供专业级的旅游规划服务

---

## ✨ 功能特性

### 🏠 首页探索

- **智能搜索** - 支持目的地、活动、景点等多维度搜索
- **分类浏览** - 游览体验、景点门票、酒店住宿、交通出行、租车服务
- **推荐内容** - 基于用户行为的个性化推荐
- **最近浏览** - 快速访问历史浏览内容

### 🔍 智能搜索

- **多条件筛选** - 价格范围、评分、分类等多维度筛选
- **智能排序** - 按评分、价格、发布时间等排序
- **搜索历史** - 记录用户搜索偏好
- **实时搜索** - 快速响应的搜索体验

### 🛍️ 产品详情

- **详细信息** - 完整的产品介绍、图片、价格信息
- **用户评价** - 真实用户评价和评分系统
- **预订功能** - 在线预订和支付集成
- **收藏功能** - 一键收藏心仪产品

### ❤️ 个人中心

- **用户认证** - 安全的用户注册和登录系统
- **个人资料** - 头像上传、个人信息管理
- **会员体系** - Basic、Gold、Premium 多级会员
- **偏好设置** - 个性化推荐设置

### 📋 行程管理

- **行程规划** - 创建和管理个人旅行计划
- **行程状态** - 即将出发、已完成、已取消状态管理
- **行程分享** - 与朋友分享旅行计划
- **提醒功能** - 重要日期和事件提醒

### ⭐ 收藏系统

- **分类收藏** - 按产品类型分类管理收藏
- **快速访问** - 便捷的收藏内容浏览
- **收藏统计** - 收藏数量和分类统计
- **批量管理** - 支持批量删除和整理

---

## 🛠️ 技术栈

### 前端框架

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vue Router** - 官方路由管理器
- **Pinia** - 现代状态管理库

### UI 组件库

- **Vant** - 轻量、可靠的移动端组件库
- **TailwindCSS** - 实用优先的 CSS 框架

### 后端服务

- **Supabase** - 开源 Firebase 替代方案
  - 实时数据库
  - 用户认证
  - 文件存储
  - 边缘函数

### 开发工具

- **Vite** - 下一代前端构建工具
- **Vue TSC** - TypeScript 类型检查
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 环境配置

1. 复制环境变量模板：

```bash
cp .env.example .env.local
```

2. 配置 Supabase 环境变量：

```env
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

### 启动开发服务器

```bash
# 开发模式
pnpm dev

# 或
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

---

## 📁 项目结构

```
src/
├── api/                 # API 接口层
│   └── supabase.ts      # Supabase 客户端配置
├── components/          # 公共组件
├── router/              # 路由配置
│   └── index.ts
├── store/               # 状态管理
│   ├── userStore.ts     # 用户状态
│   ├── productStore.ts  # 产品状态
│   ├── favoriteStore.ts # 收藏状态
│   └── tripStore.ts     # 行程状态
├── types/               # TypeScript 类型定义
│   └── api.ts
├── views/               # 页面组件
│   ├── HomePage/        # 首页
│   ├── Search/         # 搜索页面
│   ├── Product/         # 产品详情
│   ├── Account/        # 个人中心
│   ├── Collection/   # 收藏页面
│   ├── Trip/           # 行程管理
│   └── Auth/           # 认证页面
└── App.vue              # 根组件
```

---

## 🎨 设计特色

### 视觉设计

- **现代简约** - 简洁清爽的界面设计
- **响应式布局** - 完美适配各种设备尺寸
- **橙色主题** - 温暖活力的品牌色彩
- **流畅动画** - 细腻的交互动效

### 用户体验

- **直观导航** - 清晰的页面结构和导航
- **快速响应** - 优化的加载性能
- **智能推荐** - 基于用户行为的个性化内容
- **无缝体验** - 流畅的页面切换和交互

---

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 和 Prettier 保持代码风格一致
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 提交规范

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

---

## 📈 未来规划

### 短期目标

- [ ] 移动端 PWA 支持
- [ ] 多语言国际化
- [ ] 支付系统集成
- [ ] 实时聊天客服

### 长期愿景

- [ ] AI 智能推荐算法
- [ ] 社交分享功能
- [ ] 旅游攻略社区
- [ ] VR/AR 体验预览

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解如何参与项目开发。

### 开发流程

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情。

---

## 📞 联系我们

- **项目主页**: [https://github.com/WildBlue58/duguixiang-travel](https://github.com/WildBlue58/duguixiang-travel)
- **问题反馈**: [Issues](https://github.com/WildBlue58/duguixiang-travel/issues)
- **功能建议**: [Discussions](https://github.com/WildBlue58/duguixiang-travel/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**

Made with ❤️ by [WildBlue58](https://github.com/WildBlue58)

</div>
