<template>
  <div>
    <h1>📡 Mitt 事件总线通信示例</h1>
    <p>组件A作为发布者，向事件总线发送事件</p>
    <button @click="handleClick">📤 发布事件</button>
  </div>
</template>

<script setup>
import mitter from "../mitt.js";

/**
 * 组件A - 事件总线发布者
 * 展示如何通过事件总线发布事件
 *
 * 关键概念：
 * - 事件总线: 解耦组件间的直接依赖
 * - 发布者: 发出事件的组件
 * - emit: 发布事件到事件总线
 * - 解耦: 组件不需要直接引用其他组件
 */
const handleClick = () => {
  // 发布事件到事件总线
  mitter.emit("handleChange");
  console.log("组件A发布了事件");
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
  background: #9b59b6;
  color: white !important;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  font-weight: 500;
}

button:hover {
  background: #8e44ad;
}
</style>
