<template>
  <div>
    <h1>📥 Emit 子传父通信示例</h1>
    <p>子组件通过emit向父组件发送事件，父组件监听并处理</p>
    <p>点击次数: {{ count }}</p>
    <!-- 监听子组件发出的事件 -->
    <EmitChild @myClick="onMyClick" />
  </div>
</template>

<script setup>
import EmitChild from "./EmitChild.vue";
import { ref } from "vue";

/**
 * 父组件 - 子传父通信
 * 展示如何监听子组件发出的事件并处理数据
 *
 * 关键概念：
 * - @事件名: 监听子组件发出的事件
 * - emit: 子组件向父组件通信的方式
 * - 事件处理函数: 接收子组件传递的数据
 */
// 响应式数据 - 记录点击次数
const count = ref(0);

// 处理子组件发出的事件
const onMyClick = (msg) => {
  console.log("父组件收到子组件消息:", msg);
  count.value++; // 更新计数
};
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
