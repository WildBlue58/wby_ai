<template>
  <div>
    <h4>子组件操作区域：</h4>
    <button @click="handleClick">📤 发送消息给父组件</button>
    <button @click="emit('myClick', 'hello')">📤 直接发送事件</button>
  </div>
</template>

<script setup>
/**
 * 子组件 - 子传父通信
 * 展示如何通过emit向父组件发送事件和数据
 *
 * 关键概念：
 * - defineEmits(): 定义组件可以发出的事件
 * - emit(): 发出事件，可以传递数据
 * - 事件名: 遵循Vue的事件命名规范
 */
// 定义组件可以发出的事件
const emit = defineEmits(["myClick"]);

// 处理点击事件，向父组件发送数据
const handleClick = () => {
  emit("myClick", "子组件发送给父组件的消息");
};
</script>

<style scoped>
h4,
p,
button {
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

button {
  background: #3498db;
  color: white !important;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  font-weight: 500;
}

button:hover {
  background: #2980b9;
}
</style>
