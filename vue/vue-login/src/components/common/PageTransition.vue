<template>
  <transition
    :name="transitionName"
    :mode="mode"
    :duration="duration"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

interface Props {
  name?: string;
  mode?: "out-in" | "in-out";
  duration?: number | { enter: number; leave: number };
  type?: "fade" | "slide" | "zoom" | "flip" | "custom";
  direction?: "left" | "right" | "up" | "down";
}

const props = withDefaults(defineProps<Props>(), {
  name: "page",
  mode: "out-in",
  duration: 300,
  type: "fade",
  direction: "right",
});

const route = useRoute();
const transitionName = ref(props.name);

// 监听路由变化，设置不同的过渡效果
watch(
  () => route.path,
  (to, from) => {
    if (!from) return;

    const toDepth = to.split("/").length;
    const fromDepth = from.split("/").length;

    // 根据路由层级决定过渡方向
    if (toDepth > fromDepth) {
      transitionName.value = `page-${props.direction}`;
    } else if (toDepth < fromDepth) {
      transitionName.value = `page-${getReverseDirection(props.direction)}`;
    } else {
      transitionName.value = `page-${props.type}`;
    }
  }
);

// 获取反向方向
const getReverseDirection = (direction: string) => {
  const reverseMap: Record<string, string> = {
    left: "right",
    right: "left",
    up: "down",
    down: "up",
  };
  return reverseMap[direction] || direction;
};

// 过渡事件处理
const onBeforeEnter = () => {
  console.log("页面进入前");
};

const onEnter = (_el: Element, done: () => void) => {
  console.log("页面进入中");
  done();
};

const onAfterEnter = () => {
  console.log("页面进入后");
};

const onBeforeLeave = () => {
  console.log("页面离开前");
};

const onLeave = (_el: Element, done: () => void) => {
  console.log("页面离开中");
  done();
};

const onAfterLeave = () => {
  console.log("页面离开后");
};
</script>

<style scoped>
/* 淡入淡出效果 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* 滑动效果 - 向右 */
.page-right-enter-active,
.page-right-leave-active {
  transition: all 0.3s ease;
}

.page-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.page-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 滑动效果 - 向左 */
.page-left-enter-active,
.page-left-leave-active {
  transition: all 0.3s ease;
}

.page-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.page-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 滑动效果 - 向上 */
.page-up-enter-active,
.page-up-leave-active {
  transition: all 0.3s ease;
}

.page-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.page-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 滑动效果 - 向下 */
.page-down-enter-active,
.page-down-leave-active {
  transition: all 0.3s ease;
}

.page-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.page-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 缩放效果 */
.page-zoom-enter-active,
.page-zoom-leave-active {
  transition: all 0.3s ease;
}

.page-zoom-enter-from {
  transform: scale(0.8);
  opacity: 0;
}

.page-zoom-leave-to {
  transform: scale(1.2);
  opacity: 0;
}

/* 翻转效果 */
.page-flip-enter-active,
.page-flip-leave-active {
  transition: all 0.3s ease;
}

.page-flip-enter-from {
  transform: rotateY(90deg);
  opacity: 0;
}

.page-flip-leave-to {
  transform: rotateY(-90deg);
  opacity: 0;
}

/* 自定义效果 - 弹性 */
.page-bounce-enter-active {
  animation: bounceIn 0.5s ease;
}

.page-bounce-leave-active {
  animation: bounceOut 0.3s ease;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  70% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0;
  }
}

/* 自定义效果 - 旋转 */
.page-rotate-enter-active,
.page-rotate-leave-active {
  transition: all 0.3s ease;
}

.page-rotate-enter-from {
  transform: rotate(180deg) scale(0.8);
  opacity: 0;
}

.page-rotate-leave-to {
  transform: rotate(-180deg) scale(1.2);
  opacity: 0;
}

/* 自定义效果 - 3D翻转 */
.page-3d-flip-enter-active,
.page-3d-flip-leave-active {
  transition: all 0.4s ease;
  transform-style: preserve-3d;
}

.page-3d-flip-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}

.page-3d-flip-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}
</style>
