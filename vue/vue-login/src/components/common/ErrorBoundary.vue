<template>
  <div v-if="hasError" class="error-boundary">
    <el-alert
      :title="errorTitle"
      :description="errorMessage"
      type="error"
      show-icon
      :closable="closable"
      @close="handleClose"
    >
      <template #default>
        <div class="error-content">
          <div class="error-details">
            <p><strong>错误信息：</strong>{{ errorMessage }}</p>
            <p v-if="errorStack"><strong>错误堆栈：</strong></p>
            <pre v-if="errorStack" class="error-stack">{{ errorStack }}</pre>
          </div>
          <div class="error-actions">
            <el-button type="primary" @click="handleRetry">
              <el-icon><Refresh /></el-icon>
              重试
            </el-button>
            <el-button @click="handleReload">
              <el-icon><RefreshRight /></el-icon>
              刷新页面
            </el-button>
            <el-button v-if="showReport" @click="handleReport">
              <el-icon><Warning /></el-icon>
              报告问题
            </el-button>
          </div>
        </div>
      </template>
    </el-alert>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";
import { ElAlert, ElButton, ElIcon } from "element-plus";
import { Refresh, RefreshRight, Warning } from "@element-plus/icons-vue";

interface Props {
  fallback?: string;
  onError?: (error: Error, errorInfo: any) => void;
  closable?: boolean;
  showReport?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: "页面出现错误",
  closable: true,
  showReport: true,
  autoRetry: false,
  maxRetries: 3,
});

const emit = defineEmits<{
  error: [error: Error, errorInfo: any];
  retry: [];
  reload: [];
  report: [error: Error];
}>();

const hasError = ref(false);
const errorMessage = ref("");
const errorStack = ref("");
const errorTitle = ref("页面错误");
const retryCount = ref(0);

// 捕获子组件错误
onErrorCaptured((error: Error, instance, info) => {
  console.error("ErrorBoundary捕获到错误:", error);
  console.error("组件实例:", instance);
  console.error("错误信息:", info);

  hasError.value = true;
  errorMessage.value = error.message || props.fallback;
  errorStack.value = error.stack || "";
  errorTitle.value = `错误 ${
    retryCount.value > 0 ? `(重试 ${retryCount.value}/${props.maxRetries})` : ""
  }`;

  // 触发错误事件
  emit("error", error, info);

  // 调用外部错误处理函数
  if (props.onError) {
    props.onError(error, info);
  }

  // 自动重试
  if (props.autoRetry && retryCount.value < props.maxRetries) {
    setTimeout(() => {
      handleRetry();
    }, 1000);
  }

  return false; // 阻止错误继续传播
});

// 处理重试
const handleRetry = () => {
  if (retryCount.value < props.maxRetries) {
    retryCount.value++;
    hasError.value = false;
    errorMessage.value = "";
    errorStack.value = "";
    emit("retry");
  } else {
    console.error("重试次数已达上限");
  }
};

// 处理页面刷新
const handleReload = () => {
  window.location.reload();
  emit("reload");
};

// 处理问题报告
const handleReport = () => {
  const errorInfo = {
    message: errorMessage.value,
    stack: errorStack.value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.log("错误报告:", errorInfo);
  emit("report", new Error(errorMessage.value));

  console.log("问题已报告，感谢您的反馈");
};

// 处理关闭
const handleClose = () => {
  hasError.value = false;
};

// 重置错误状态
const reset = () => {
  hasError.value = false;
  errorMessage.value = "";
  errorStack.value = "";
  retryCount.value = 0;
};

// 暴露方法给父组件
defineExpose({
  reset,
  hasError: () => hasError.value,
});
</script>

<style scoped>
.error-boundary {
  padding: 20px;
}

.error-content {
  margin-top: 16px;
}

.error-details {
  margin-bottom: 16px;
}

.error-details p {
  margin: 8px 0;
  color: #666;
}

.error-stack {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  color: #666;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.error-actions .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-actions {
    flex-direction: column;
  }

  .error-actions .el-button {
    width: 100%;
  }
}
</style>
