<template>
  <div>
    <h1>🔗 defineExpose 父调用子方法示例</h1>
    <p>父组件通过ref直接调用子组件的方法和访问数据</p>
    <ExposeChild ref="comp" />
    <button @click="handlerClick">🎯 调用子组件的方法</button>
  </div>
</template>

<script setup>
import ExposeChild from "./ExposeChild.vue";
import { ref } from "vue";

/**
 * 父组件 - 父调用子方法
 * 展示如何通过ref直接访问子组件的方法和数据
 *
 * 关键概念：
 * - ref: 创建模板引用，获取子组件实例
 * - defineExpose: 子组件暴露给父组件的方法和数据
 * - 直接调用: 父组件可以直接调用子组件的方法
 */
// 创建子组件的引用
const comp = ref(null);

// 调用子组件的方法
const handlerClick = () => {
  console.log("子组件名称:", comp.value?.childName);
  comp.value?.showMethod(); // 调用子组件暴露的方法
};
</script>

<style scoped>
h1,
p,
button {
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

button {
  background: #e74c3c;
  color: white !important;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  font-weight: 500;
}

button:hover {
  background: #c0392b;
}
</style>
