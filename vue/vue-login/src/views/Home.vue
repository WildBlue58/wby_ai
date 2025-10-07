<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <el-header class="home-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">Vue Login System</h1>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="40" :src="userAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userDisplayName }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="home-main">
      <div class="welcome-section">
        <el-card class="welcome-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="welcome-icon"><House /></el-icon>
              <span>欢迎回来</span>
            </div>
          </template>
          <div class="welcome-content">
            <h2 class="welcome-title">
              你好，{{ userStore.userDisplayName }}！👋
            </h2>
            <p class="welcome-description">
              欢迎使用Vue Login System，您已成功登录系统。
            </p>
            <div class="user-stats">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-number">{{ loginTime }}</div>
                    <div class="stat-label">登录时间</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-number">{{ userRole }}</div>
                    <div class="stat-label">用户角色</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-number">在线</div>
                    <div class="stat-label">状态</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 功能卡片 -->
      <div class="features-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <el-icon class="feature-icon"><User /></el-icon>
                <h3>用户管理</h3>
                <p>管理系统用户和权限</p>
                <el-button type="primary" plain>进入管理</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <el-icon class="feature-icon"><Setting /></el-icon>
                <h3>系统设置</h3>
                <p>配置系统参数和选项</p>
                <el-button type="primary" plain>进入设置</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="feature-card" shadow="hover">
              <div class="feature-content">
                <el-icon class="feature-icon"><DataAnalysis /></el-icon>
                <h3>数据分析</h3>
                <p>查看系统使用统计</p>
                <el-button type="primary" plain>查看报告</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  House,
  DataAnalysis,
} from "@element-plus/icons-vue";

const userStore = useUserStore();
const router = useRouter();

// 计算属性
const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || "";
});

const loginTime = computed(() => {
  if (!userStore.loginTime) return "未知";
  const date = new Date(parseInt(userStore.loginTime));
  return date.toLocaleString("zh-CN");
});

const userRole = computed(() => {
  return userStore.userInfo?.role || "普通用户";
});

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case "profile":
      ElMessage.info("个人资料功能开发中...");
      break;
    case "settings":
      ElMessage.info("设置功能开发中...");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "确认退出", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logout();
      ElMessage.success("已退出登录");
      router.push("/login");
    })
    .catch(() => {
      // 用户取消
    });
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.home-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.1);
}

.username {
  font-weight: 500;
  color: #333;
}

.dropdown-icon {
  font-size: 12px;
  color: #999;
}

.home-main {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-card {
  border-radius: 16px;
  border: none;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.welcome-icon {
  font-size: 20px;
  color: #667eea;
}

.welcome-content {
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 30px 0;
}

.user-stats {
  margin-top: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.features-section {
  margin-top: 40px;
}

.feature-card {
  height: 200px;
  border-radius: 16px;
  border: none;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-content {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.feature-icon {
  font-size: 3rem;
  color: #667eea;
}

.feature-content h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.feature-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-header {
    padding: 0 15px;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .home-main {
    padding: 20px 15px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .user-stats .el-col {
    margin-bottom: 15px;
  }
}

/* 动画效果 */
.welcome-card {
  animation: fadeInUp 0.6s ease-out;
}

.feature-card {
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:nth-child(2) {
  animation-delay: 0.1s;
}

.feature-card:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
