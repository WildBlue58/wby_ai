<template>
  <div>
    <h4>组件B - 事件总线订阅者</h4>
    <p>监听组件A发布的事件</p>
    <p>打开控制台查看事件接收情况</p>
  </div>
</template>

<script setup>
import mitter from "../mitt.js";
import { onUnmounted } from "vue";

/**
 * 组件B - 事件总线订阅者
 * 展示如何通过事件总线订阅事件
 *
 * 关键概念：
 * - 订阅者: 监听事件的组件
 * - on: 订阅事件总线上的事件
 * - off: 取消订阅，防止内存泄漏
 * - 生命周期: 在组件卸载时清理事件监听
 */
// 事件处理函数
const someMethod = () => {
  console.log("组件B收到了事件！");
};

// 订阅事件
mitter.on("handleChange", someMethod);

// 组件卸载时取消订阅，防止内存泄漏
onUnmounted(() => {
  mitter.off("handleChange", someMethod);
});
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
