<template>
  <div>
    <h2>Home页面</h2>
    <input type="text" v-model="text" placeholder="输入点什么" />
    <p>输入内容：{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const text = ref("");
</script>

<style scoped></style>
