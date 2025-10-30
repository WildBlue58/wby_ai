<script setup>
import { RouterView, RouterLink } from "vue-router";
// active 切换？
import { onActivated, onDeactivated } from "vue";

onActivated(() => {
  console.log("Home activated");
});
onDeactivated(() => {
  console.log("Home deactivated");
});
</script>

<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <router-view v-slot="{ Component }"
      ><KeepAlive include="Home">
        <component :is="Component" />
      </KeepAlive>
    </router-view>
  </div>
</template>
