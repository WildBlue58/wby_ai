<template>
  <a :href="`#${to}`" @click="navigate">
    <slot />
  </a>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true,
    default: "",
  },
});
const navigate = (e) => {
  e?.preventDefault?.();
  router.push(props.to);
};
</script>

<style scoped>
a {
  color: #000;
  text-decoration: none;
}
</style>
