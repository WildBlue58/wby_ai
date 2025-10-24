<template>
  <div>
    <h3>🌐 Provide/Inject 跨层级通信示例</h3>
    <p>父组件通过 provide 提供数据，子组件通过 inject 接收数据</p>
    <Child />
  </div>
</template>

<script setup>
import Child from "./Child.vue";
</script>

<style scoped>
h3,
p {
  color: #2c3e50 !important;
  font-weight: 600;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

p {
  color: #34495e !important;
  font-weight: 500;
}
</style>
