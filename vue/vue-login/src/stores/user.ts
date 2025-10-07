import { defineStore } from "pinia";
import { UserInfo, LoginCredentials, LoginResponse } from "@/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    userInfo: null as UserInfo | null,
    loginTime: localStorage.getItem("loginTime") || "",
    rememberMe: localStorage.getItem("rememberMe") === "true",
  }),

  getters: {
    isLogin(): boolean {
      return !!this.token && !this.isTokenExpired;
    },

    isTokenExpired(): boolean {
      if (!this.loginTime) return true;
      const now = Date.now();
      const loginTime = parseInt(this.loginTime);
      // 24小时过期
      return now - loginTime > 24 * 60 * 60 * 1000;
    },

    userDisplayName(): string {
      return this.userInfo?.username || this.username || "未知用户";
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    setUsername(username: string) {
      this.username = username;
      localStorage.setItem("username", username);
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },

    setLoginTime() {
      const now = Date.now().toString();
      this.loginTime = now;
      localStorage.setItem("loginTime", now);
    },

    setRememberMe(remember: boolean) {
      this.rememberMe = remember;
      localStorage.setItem("rememberMe", remember.toString());
    },

    async login(credentials: LoginCredentials) {
      try {
        // 这里应该调用API，现在使用模拟数据
        const mockResponse: LoginResponse = {
          token: "mock-token-" + Date.now(),
          username: credentials.username,
          userInfo: {
            id: "1",
            username: credentials.username,
            email: credentials.username + "@example.com",
            role: "user",
          },
        };

        this.setToken(mockResponse.token);
        this.setUsername(mockResponse.username);
        this.setUserInfo(mockResponse.userInfo);
        this.setLoginTime();
        this.setRememberMe(credentials.rememberMe || false);

        return mockResponse;
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },

    logout() {
      this.token = "";
      this.username = "";
      this.userInfo = null;
      this.loginTime = "";
      this.rememberMe = false;

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("rememberMe");
    },

    updateUserInfo(updates: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updates };
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      }
    },

    checkTokenValidity() {
      if (this.isTokenExpired) {
        this.logout();
        return false;
      }
      return true;
    },
  },
});
