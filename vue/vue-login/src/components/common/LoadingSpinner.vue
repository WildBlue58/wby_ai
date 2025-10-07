<template>
  <div
    v-if="visible"
    class="loading-spinner"
    :class="[`loading-${size}`, `loading-${type}`]"
  >
    <div class="spinner-container">
      <div class="spinner" :class="spinnerClass">
        <div v-for="i in 8" :key="i" class="spinner-dot"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  visible?: boolean;
  text?: string;
  size?: "small" | "medium" | "large";
  type?: "default" | "primary" | "success" | "warning" | "error";
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  text: "",
  size: "medium",
  type: "primary",
  overlay: false,
});

const spinnerClass = computed(() => {
  return {
    "spinner-dots": props.type === "default",
    "spinner-ring": props.type === "primary",
    "spinner-pulse": props.type === "success",
    "spinner-wave": props.type === "warning",
    "spinner-bounce": props.type === "error",
  };
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.loading-spinner.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.loading-small {
  font-size: 14px;
}

.loading-medium {
  font-size: 16px;
}

.loading-large {
  font-size: 20px;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-text {
  color: #666;
  font-size: 0.9em;
  text-align: center;
}

/* 点状加载动画 */
.spinner-dots {
  display: flex;
  gap: 4px;
}

.spinner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.spinner-dot:nth-child(1) {
  animation-delay: -0.32s;
}
.spinner-dot:nth-child(2) {
  animation-delay: -0.16s;
}
.spinner-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 环形加载动画 */
.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: ring-spin 1s linear infinite;
}

@keyframes ring-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 脉冲加载动画 */
.spinner-pulse {
  width: 40px;
  height: 40px;
  background: #67c23a;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 波浪加载动画 */
.spinner-wave {
  display: flex;
  gap: 3px;
}

.spinner-wave .spinner-dot {
  width: 6px;
  height: 20px;
  border-radius: 3px;
  background: #e6a23c;
  animation: wave 1.2s ease-in-out infinite;
}

.spinner-wave .spinner-dot:nth-child(1) {
  animation-delay: -1.1s;
}
.spinner-wave .spinner-dot:nth-child(2) {
  animation-delay: -1s;
}
.spinner-wave .spinner-dot:nth-child(3) {
  animation-delay: -0.9s;
}
.spinner-wave .spinner-dot:nth-child(4) {
  animation-delay: -0.8s;
}
.spinner-wave .spinner-dot:nth-child(5) {
  animation-delay: -0.7s;
}

@keyframes wave {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* 弹跳加载动画 */
.spinner-bounce {
  display: flex;
  gap: 4px;
}

.spinner-bounce .spinner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f56c6c;
  animation: bounce 1.4s ease-in-out infinite both;
}

.spinner-bounce .spinner-dot:nth-child(1) {
  animation-delay: -0.32s;
}
.spinner-bounce .spinner-dot:nth-child(2) {
  animation-delay: -0.16s;
}
.spinner-bounce .spinner-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 主题颜色 */
.loading-primary .spinner-dot,
.loading-primary .spinner-ring,
.loading-primary .spinner-pulse {
  background: #409eff;
  border-top-color: #409eff;
}

.loading-success .spinner-dot,
.loading-success .spinner-ring,
.loading-success .spinner-pulse {
  background: #67c23a;
  border-top-color: #67c23a;
}

.loading-warning .spinner-dot,
.loading-warning .spinner-ring,
.loading-warning .spinner-pulse {
  background: #e6a23c;
  border-top-color: #e6a23c;
}

.loading-error .spinner-dot,
.loading-error .spinner-ring,
.loading-error .spinner-pulse {
  background: #f56c6c;
  border-top-color: #f56c6c;
}
</style>
