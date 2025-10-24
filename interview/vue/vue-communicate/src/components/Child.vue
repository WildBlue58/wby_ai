<template>
  <div>
    <h4>中间层组件 - 传递provide数据</h4>
    <Little />
  </div>
</template>

<script setup>
import Little from "./Little.vue";
import { provide } from "vue";

/**
 * 中间层组件 - Provide/Inject 跨层级通信
 * 展示如何在中间层组件中提供数据给后代组件
 *
 * 关键概念：
 * - provide: 向所有后代组件提供数据
 * - 跨层级: 不需要逐层传递props
 * - 依赖注入: 后代组件可以注入祖先提供的数据
 */
// 向所有后代组件提供数据
provide("name", "杜贵乡");
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
