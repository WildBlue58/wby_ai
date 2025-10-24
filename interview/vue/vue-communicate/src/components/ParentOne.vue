<template>
  <div>
    <h1>📤 Props 父传子 (Options API)</h1>
    <p>使用Vue 2风格的Options API，通过props向子组件传递数据</p>
    <ChildOne :msg="msg1" :msg2="msg2" />
  </div>
</template>

<script>
import ChildOne from "./ChildOne.vue";

/**
 * 父组件 - Options API 风格
 * 展示如何通过props向子组件传递数据
 *
 * 关键概念：
 * - data(): 定义组件的数据状态
 * - props: 子组件接收父组件传递的数据
 * - methods: 定义组件的方法
 * - components: 注册子组件
 */
export default {
  // 组件数据 - 父组件的数据状态
  data() {
    return {
      msg1: "父组件传递给子组件的信息1",
      msg2: "父组件传递给子组件的信息2",
    };
  },

  // 组件方法 - 可以修改数据状态
  methods: {
    updateMsg2() {
      this.msg2 = "更新后的信息";
    },
  },

  // 注册子组件
  components: {
    ChildOne,
  },
};
</script>

<style scoped>
h1,
h4,
p {
  color: #2c3e50 !important;
  font-weight: 600;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

p {
  color: #34495e !important;
  font-weight: 500;
}
</style>
