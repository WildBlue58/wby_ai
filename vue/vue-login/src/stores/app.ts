import { defineStore } from "pinia";
import { Theme, Language } from "@/types/common";

export const useAppStore = defineStore("app", {
  state: () => ({
    loading: false,
    error: null as string | null,
    theme: (localStorage.getItem("theme") as Theme) || "light",
    language: (localStorage.getItem("language") as Language) || "zh-CN",
    sidebarCollapsed: false,
    pageTitle: "Vue Login System",
  }),

  getters: {
    isDarkTheme(): boolean {
      return this.theme === "dark";
    },

    currentLanguage(): string {
      return this.language;
    },

    hasError(): boolean {
      return !!this.error;
    },
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
      if (error) {
        console.error("应用错误:", error);
      }
    },

    clearError() {
      this.error = null;
    },

    setTheme(theme: Theme) {
      this.theme = theme;
      localStorage.setItem("theme", theme);

      // 应用主题到document
      document.documentElement.setAttribute("data-theme", theme);
    },

    setLanguage(language: Language) {
      this.language = language;
      localStorage.setItem("language", language);
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed;
    },

    setPageTitle(title: string) {
      this.pageTitle = title;
      document.title = title;
    },

    // 初始化应用设置
    initializeApp() {
      // 应用保存的主题
      document.documentElement.setAttribute("data-theme", this.theme);

      // 设置页面标题
      document.title = this.pageTitle;
    },

    // 重置应用状态
    resetApp() {
      this.loading = false;
      this.error = null;
      this.sidebarCollapsed = false;
      this.pageTitle = "Vue Login System";
    },
  },
});
