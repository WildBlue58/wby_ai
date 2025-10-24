<template>
  <div>
    <h4>子组件 - 等待父组件调用</h4>
    <p>这个子组件暴露了方法和数据给父组件</p>
  </div>
</template>

<script setup>
/**
 * 子组件 - 暴露方法和数据
 * 展示如何使用defineExpose向父组件暴露方法和数据
 *
 * 关键概念：
 * - defineExpose: 向父组件暴露方法和数据
 * - 组件封装: 只有暴露的内容才能被父组件访问
 * - 方法调用: 父组件可以直接调用暴露的方法
 */
// 向父组件暴露方法和数据
defineExpose({
  childName: "子组件",
  showMethod: function () {
    console.log("子组件的方法被调用了！");
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
