<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <div class="error-description">抱歉，您访问的页面不存在或已被删除</div>
      <div class="action-buttons">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { House, ArrowLeft } from "@element-plus/icons-vue";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.error-message {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.error-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-message {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
