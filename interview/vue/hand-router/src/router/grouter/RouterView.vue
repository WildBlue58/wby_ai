<template>
  <div>
    <!-- 动态组件 -->
    <component :is="component" />
  </div>
</template>
<script setup>
import { computed } from "vue"; // 计算属性
import { useRouter } from "../grouter/index"; // hooks 路由实例
let router = useRouter();
// 计算属性
const component = computed(() => {
  const route = router.routes.find(
    (route) => route.path === window.location.hash.slice(1)
  );
  console.log(route.component, "/////");
  return route ? route.component : null;
});
</script>

<style scoped></style>
