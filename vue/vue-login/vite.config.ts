import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteMockServe } from "vite-plugin-mock";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: "src/mocks",
      enable: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: true,
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          "element-plus": [
            "ElMessage",
            "ElMessageBox",
            "ElNotification",
            "ElLoading",
          ],
        },
      ],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Vue相关库打包到vendor chunk
          "vue-vendor": ["vue", "vue-router", "pinia"],
          // 将Element Plus打包到单独的chunk
          "element-plus": ["element-plus"],
          // 将工具库打包到utils chunk
          utils: ["axios"],
        },
      },
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 压缩配置
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 资源内联阈值
    assetsInlineLimit: 4096,
    // 启用gzip压缩
    reportCompressedSize: true,
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    // 启用热更新
    hmr: {
      overlay: true,
    },
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
  },
  // 依赖优化
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "element-plus",
      "axios",
      "@vueuse/core",
    ],
  },
  // 环境变量配置
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
});
