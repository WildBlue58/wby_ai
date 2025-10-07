<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">欢迎登录</h1>
          <p class="login-subtitle">请输入您的账户信息</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="form.rememberMe"> 记住我 </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-button"
            >
              {{ loading ? "登录中..." : "登录" }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <p class="demo-account">演示账户：admin / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { login } from "@/api/login";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const formRef = ref<FormInstance>();

const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

const rules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await login({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe,
    });

    ElMessage.success("登录成功");
    router.push("/");
  } catch (err: any) {
    console.error("登录失败:", err);
    ElMessage.error(err.message || "登录失败，请检查用户名和密码");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-background {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.login-form {
  margin-bottom: 20px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
}

.demo-account {
  color: #999;
  font-size: 0.85rem;
  margin: 0;
  padding: 10px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border: 1px dashed #667eea;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }

  .login-title {
    font-size: 1.5rem;
  }
}

/* 动画效果 */
.login-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框聚焦效果 */
.login-form .el-input__wrapper {
  transition: all 0.3s ease;
}

.login-form .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #667eea;
}

.login-form .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}
</style>
