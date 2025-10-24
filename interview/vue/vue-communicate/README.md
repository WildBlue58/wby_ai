# Vue 组件通信学习项目 🚀

> 一个完整的Vue 3组件通信方式学习项目，适合新手小白从零开始学习Vue组件间的各种通信方式。

## 📖 项目简介

本项目通过实际代码示例，全面展示Vue 3中六种主要的组件通信方式，帮助开发者理解不同场景下如何选择合适的通信方案。

### 🎯 学习目标

- 掌握Vue 3组件通信的六种核心方式
- 理解每种通信方式的使用场景和优缺点
- 能够根据实际需求选择合适的通信方案
- 为学习Vuex/Pinia等状态管理工具打下基础

## 🛠 技术栈

- **Vue 3.5.13** - 渐进式JavaScript框架
- **Vite 6.3.5** - 快速构建工具
- **Mitt 3.0.1** - 轻量级事件总线库
- **组合式API** - Vue 3推荐的开发方式

## 🚀 快速开始

### 安装依赖

```bash
# 使用pnpm (推荐)
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
```

### 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

### 构建生产版本

```bash
pnpm build
```

## 📚 六种通信方式详解

### 1. 📤 Props (父传子)

**适用场景**: 父组件向子组件传递数据

**特点**:

- 单向数据流，数据只能从父组件流向子组件
- 支持类型检查和默认值
- 是Vue中最基础的通信方式

**代码示例**:

```vue
<!-- 父组件 -->
<ChildComponent :message="parentData" />

<!-- 子组件 -->
<script setup>
defineProps({
  message: {
    type: String,
    default: '默认消息'
  }
})
</script>
```

### 2. 📥 Emit (子传父)

**适用场景**: 子组件向父组件传递数据或触发事件

**特点**:

- 通过事件机制实现子向父的通信
- 支持传递参数
- 遵循Vue的事件命名规范

**代码示例**:

```vue
<!-- 子组件 -->
<button @click="handleClick">发送消息</button>
<script setup>
const emit = defineEmits(['message'])
const handleClick = () => {
  emit('message', '来自子组件的消息')
}
</script>

<!-- 父组件 -->
<ChildComponent @message="handleMessage" />
```

### 3. 🔗 defineExpose (父调用子方法)

**适用场景**: 父组件需要直接调用子组件的方法或访问子组件的数据

**特点**:

- 通过ref引用直接访问子组件
- 适合需要精确控制子组件行为的场景
- 需要谨慎使用，避免破坏组件封装性

### 4. 🌐 Provide/Inject (跨层级通信)

**适用场景**: 祖先组件与后代组件之间的通信，避免props逐层传递

**特点**:

- 解决props drilling问题
- 支持依赖注入模式
- 适合深层嵌套的组件通信

**代码示例**:

```vue
<!-- 祖先组件 -->
<script setup>
import { provide } from 'vue'
provide('theme', 'dark')
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme', 'light')
</script>
```

### 5. 📡 Mitt事件总线 (兄弟/跨组件通信)

**适用场景**: 兄弟组件或任意组件间的通信

**特点**:

- 解耦组件间的直接依赖
- 支持一对多的通信模式
- 需要手动管理事件监听器的清理

**代码示例**:

```javascript
// 事件总线
import mitt from 'mitt'
const emitter = mitt()

// 发布事件
emitter.emit('event-name', data)

// 订阅事件
emitter.on('event-name', (data) => {
  console.log('收到数据:', data)
})
```

### 6. 🏪 全局状态管理 (Vuex/Pinia)

**适用场景**: 大型应用中的全局状态管理

**特点**:

- 集中式状态管理
- 支持状态持久化
- 提供开发工具支持

## 💡 使用场景建议

| 通信方式 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| Props | 父子组件数据传递 | 简单直观，类型安全 | 只能单向传递 |
| Emit | 子组件向父组件通信 | 符合Vue设计理念 | 需要父组件监听 |
| defineExpose | 父组件控制子组件 | 直接高效 | 破坏组件封装 |
| Provide/Inject | 跨层级通信 | 避免props drilling | 调试困难 |
| Mitt | 兄弟组件通信 | 解耦组件 | 需要手动清理 |
| Vuex/Pinia | 全局状态管理 | 功能强大 | 学习成本高 |

## 🎓 学习建议

1. **循序渐进**: 从简单的Props开始，逐步学习复杂的通信方式
2. **理解原理**: 每种通信方式都有其设计理念，理解原理比记住语法更重要
3. **实践为主**: 多动手编写代码，在实际项目中应用所学知识
4. **选择合适**: 根据具体场景选择合适的通信方式，避免过度设计

## 📁 项目结构

```
src/
├── components/          # 组件示例
│   ├── ParentOne.vue   # Options API父组件
│   ├── ChildOne.vue    # Options API子组件
│   ├── ParentTwo.vue   # Composition API父组件
│   ├── ChildTwo.vue    # Composition API子组件
│   ├── EmitParent.vue  # 子传父示例
│   ├── EmitChild.vue   # 子传父示例
│   ├── ExposeParent.vue # 父调子示例
│   ├── ExposeChild.vue  # 父调子示例
│   ├── ProvideParent.vue # 跨层级通信示例
│   ├── Child.vue       # 跨层级通信示例
│   ├── Little.vue      # 跨层级通信示例
│   ├── MittA.vue       # 事件总线示例
│   └── MittB.vue       # 事件总线示例
├── mitt.js             # 事件总线配置
└── App.vue             # 主应用组件
```

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License
