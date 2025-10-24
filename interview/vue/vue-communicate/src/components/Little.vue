<template>
  <div>
    <h4>后代组件 - 接收inject数据</h4>
    <p>从祖先组件注入的数据: {{ name }}</p>
  </div>
</template>

<script setup>
import { inject } from "vue";

/**
 * 后代组件 - Provide/Inject 跨层级通信
 * 展示如何注入祖先组件提供的数据
 *
 * 关键概念：
 * - inject: 注入祖先组件提供的数据
 * - 默认值: 如果祖先没有提供数据，使用默认值
 * - 跨层级: 可以跳过中间层直接获取祖先数据
 */
// 注入祖先组件提供的数据，如果没有则使用默认值
const name = inject("name", "默认名称");
</script>

<style scoped>
h4,
p {
  color: #2c3e50 !important;
  font-weight: 600;
}

h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

p {
  color: #34495e !important;
  font-weight: 500;
  margin: 0.5rem 0;
}
</style>
