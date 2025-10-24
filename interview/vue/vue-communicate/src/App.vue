<script setup>
import { ref } from "vue";

// 导入所有通信示例组件
import ParentOne from "./components/ParentOne.vue";
import ParentTwo from "./components/ParentTwo.vue";
import EmitParent from "./components/EmitParent.vue";
import ExposeParent from "./components/ExposeParent.vue";
import ProvideParent from "./components/ProvideParent.vue";
import MittA from "./components/MittA.vue";
import MittB from "./components/MittB.vue";

/**
 * Vue 组件通信学习应用
 * 展示六种主要的Vue组件通信方式
 *
 * 功能特性：
 * - 左侧导航菜单，切换不同通信方式
 * - 每个示例都有详细的说明和代码展示
 * - 适合新手小白学习Vue组件通信
 */

// 当前选中的通信方式
const currentMethod = ref("props-options");

// 通信方式配置
const communicationMethods = [
  {
    id: "props-options",
    title: "📤 Props (Options API)",
    description: "Vue 2风格的父传子通信",
    component: ParentOne,
  },
  {
    id: "props-composition",
    title: "📤 Props (Composition API)",
    description: "Vue 3风格的父传子通信",
    component: ParentTwo,
  },
  {
    id: "emit",
    title: "📥 Emit 子传父",
    description: "子组件向父组件发送事件",
    component: EmitParent,
  },
  {
    id: "expose",
    title: "🔗 defineExpose",
    description: "父组件调用子组件方法",
    component: ExposeParent,
  },
  {
    id: "provide-inject",
    title: "🌐 Provide/Inject",
    description: "跨层级组件通信",
    component: ProvideParent,
  },
  {
    id: "mitt",
    title: "📡 Mitt 事件总线",
    description: "兄弟组件和跨组件通信",
    component: null, // 特殊处理，需要同时显示两个组件
  },
];

// 切换通信方式
const switchMethod = (methodId) => {
  currentMethod.value = methodId;
};

// 获取当前选中的通信方式配置
const getCurrentMethod = () => {
  return communicationMethods.find(
    (method) => method.id === currentMethod.value
  );
};
</script>

<template>
  <div class="app">
    <!-- 头部标题 -->
    <header class="header">
      <h1>🚀 Vue 组件通信学习项目</h1>
      <p>通过实际代码示例学习Vue 3的六种主要通信方式</p>
    </header>

    <div class="main-container">
      <!-- 左侧导航菜单 -->
      <nav class="sidebar">
        <h3>📚 通信方式导航</h3>
        <ul class="nav-list">
          <li
            v-for="method in communicationMethods"
            :key="method.id"
            :class="{ active: currentMethod === method.id }"
            @click="switchMethod(method.id)"
            class="nav-item"
          >
            <div class="nav-title">{{ method.title }}</div>
            <div class="nav-desc">{{ method.description }}</div>
          </li>
        </ul>
      </nav>

      <!-- 右侧内容区域 -->
      <main class="content">
        <!-- Props Options API -->
        <div v-if="currentMethod === 'props-options'" class="example-section">
          <div class="example-header">
            <h2>📤 Props 父传子 (Options API)</h2>
            <p>使用Vue 2风格的Options API，通过props向子组件传递数据</p>
          </div>
          <div class="example-content">
            <ParentOne />
          </div>
        </div>

        <!-- Props Composition API -->
        <div
          v-if="currentMethod === 'props-composition'"
          class="example-section"
        >
          <div class="example-header">
            <h2>📤 Props 父传子 (Composition API)</h2>
            <p>使用Vue 3的Composition API，通过ref创建响应式数据传递给子组件</p>
          </div>
          <div class="example-content">
            <ParentTwo />
          </div>
        </div>

        <!-- Emit 子传父 -->
        <div v-if="currentMethod === 'emit'" class="example-section">
          <div class="example-header">
            <h2>📥 Emit 子传父通信</h2>
            <p>子组件通过emit向父组件发送事件，父组件监听并处理</p>
          </div>
          <div class="example-content">
            <EmitParent />
          </div>
        </div>

        <!-- defineExpose -->
        <div v-if="currentMethod === 'expose'" class="example-section">
          <div class="example-header">
            <h2>🔗 defineExpose 父调用子方法</h2>
            <p>父组件通过ref直接调用子组件的方法和访问数据</p>
          </div>
          <div class="example-content">
            <ExposeParent />
          </div>
        </div>

        <!-- Provide/Inject -->
        <div v-if="currentMethod === 'provide-inject'" class="example-section">
          <div class="example-header">
            <h2>🌐 Provide/Inject 跨层级通信</h2>
            <p>祖先组件通过provide提供数据，后代组件通过inject接收数据</p>
          </div>
          <div class="example-content">
            <ProvideParent />
          </div>
        </div>

        <!-- Mitt 事件总线 -->
        <div v-if="currentMethod === 'mitt'" class="example-section">
          <div class="example-header">
            <h2>📡 Mitt 事件总线通信</h2>
            <p>通过事件总线实现兄弟组件和跨组件通信</p>
          </div>
          <div class="example-content">
            <div class="mitt-container">
              <div class="mitt-component">
                <MittA />
              </div>
              <div class="mitt-component">
                <MittB />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 底部说明 -->
    <footer class="footer">
      <p>💡 提示：打开浏览器控制台查看详细的通信过程和日志输出</p>
    </footer>
  </div>
</template>

<style scoped>
/* 全局重置 */
* {
  box-sizing: border-box;
}

/* 应用整体布局 */
.app {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 头部样式 */
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 主容器布局 */
.main-container {
  display: flex;
  min-height: calc(100vh - 200px);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* 左侧导航 */
.sidebar {
  width: 300px;
  min-width: 300px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.sidebar h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.3rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.nav-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.nav-desc {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* 右侧内容区域 */
.content {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #333;
  overflow-x: hidden;
}

.example-section {
  height: 100%;
}

.example-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.example-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
}

.example-header p {
  margin: 0;
  color: #34495e;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
}

.example-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Mitt 事件总线特殊布局 */
.mitt-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.mitt-component {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 底部说明 */
.footer {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  text-align: center;
  color: white;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    order: 2;
  }

  .content {
    order: 1;
    margin: 0;
    border-radius: 0;
  }

  .mitt-container {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
