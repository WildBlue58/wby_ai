<template>
  <div>
    <h1>📤 Props 父传子 (Composition API)</h1>
    <p>使用Vue 3的Composition API，通过ref创建响应式数据传递给子组件</p>
    <ChildTwo :msg1="msg1" :msg2="msg2" />
  </div>
</template>

<script setup>
import ChildTwo from "./ChildTwo.vue";
import { ref } from "vue";

/**
 * 父组件 - Composition API 风格
 * 展示如何使用Vue 3的setup语法糖和ref创建响应式数据
 *
 * 关键概念：
 * - <script setup>: Vue 3的语法糖，自动暴露变量和方法
 * - ref(): 创建响应式引用，返回一个响应式对象
 * - 响应式数据: 数据变化时自动更新视图
 */
// 创建响应式数据 - 使用ref包装基本类型
const msg1 = ref("父组件通过Composition API传递的信息1");
const msg2 = ref("父组件通过Composition API传递的信息2");
</script>

<style scoped>
h1,
p {
  color: #2c3e50 !important;
  font-weight: 600;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

p {
  color: #34495e !important;
  font-weight: 500;
}
</style>
