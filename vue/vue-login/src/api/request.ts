import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { ApiResponse, ResponseCode } from "@/types/api";

const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    const appStore = useAppStore();

    // 显示加载状态
    appStore.setLoading(true);

    // 添加认证token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }

    // 添加请求时间戳
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  (error) => {
    const appStore = useAppStore();
    appStore.setLoading(false);
    appStore.setError("请求配置错误");
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const appStore = useAppStore();
    appStore.setLoading(false);
    appStore.clearError();

    const { data, code, message } = response.data;

    // 成功响应
    if (code === ResponseCode.SUCCESS) {
      return data;
    }

    // 业务错误
    ElMessage.error(message || "请求失败");
    return Promise.reject(new Error(message || "请求失败"));
  },
  (error) => {
    const appStore = useAppStore();
    const userStore = useUserStore();

    appStore.setLoading(false);

    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case ResponseCode.UNAUTHORIZED:
          ElMessageBox.confirm("登录状态已过期，请重新登录", "系统提示", {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            userStore.logout();
            window.location.href = "/login";
          });
          break;

        case ResponseCode.FORBIDDEN:
          ElMessage.error("没有权限访问该资源");
          break;

        case ResponseCode.NOT_FOUND:
          ElMessage.error("请求的资源不存在");
          break;

        case ResponseCode.INTERNAL_SERVER_ERROR:
          ElMessage.error("服务器内部错误");
          break;

        default:
          ElMessage.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 网络错误
      ElMessage.error("网络连接失败，请检查网络设置");
    } else {
      // 其他错误
      ElMessage.error("请求配置错误");
    }

    appStore.setError(error.message);
    return Promise.reject(error);
  }
);

export default service;
