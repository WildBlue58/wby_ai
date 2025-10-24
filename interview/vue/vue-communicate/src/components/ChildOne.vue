<template>
  <div>
    <h4>子组件接收到的数据：</h4>
    <p>📥 消息1: {{ msg1 }}</p>
    <p>📥 消息2: {{ msg2 }}</p>
  </div>
</template>

<script>
/**
 * 子组件 - Options API 风格
 * 展示如何接收父组件通过props传递的数据
 *
 * 关键概念：
 * - props: 定义接收父组件传递的数据
 * - data(): 组件自身的响应式数据
 * - this: 在Options API中访问props和data
 */
export default {
  // 接收父组件传递的props
  // 数组形式：简单但缺少类型检查
  props: ["msg1", "msg2"],

  // 组件自身的数据状态
  data() {
    return {
      // 可以将props赋值给data，但通常直接使用props
      msg: this.msg1,
      msg2: this.msg2,
    };
  },
};
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
