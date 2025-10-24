<template>
  <div>
    <h4>子组件接收到的数据：</h4>
    <p>📥 消息1: {{ msg1 }}</p>
    <p>📥 消息2: {{ msg2 }}</p>
  </div>
</template>

<script setup>
/**
 * 子组件 - Composition API 风格
 * 展示如何使用defineProps接收父组件传递的数据
 *
 * 关键概念：
 * - defineProps(): 定义组件接收的props
 * - 类型检查: 可以指定props的类型和默认值
 * - 响应式: props是响应式的，父组件数据变化时子组件自动更新
 */
defineProps({
  msg1: {
    type: String, // 指定数据类型
    default: "", // 设置默认值
  },
  msg2: {
    type: String,
    default: "",
  },
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
