# tailwindcss 原子CSS

- 非常好用
- 几乎不用写CSS
- AI 生成代码 CSS 用的都是TailwindCSS
- 配置流程
  tailwindcss @vite/tailwindcss
- 有各种内置的CSS类名,分门别类
- 1rem = 4 个单位

- 文字行数限制
  -webkit-line-clamp: 2;不能独自生效
  -webkit 浏览器内核 Chrome + safari
  -mozilla 火狐浏览器内核代号
  实验阶段的属性 新的
  display:-webkit-box;
  -webkit-box-orient:vertical;
  overflow:hidden;

## 响应式设计

- 断点系统：sm(640px) md(768px) lg(1024px) xl(1280px) 2xl(1536px)
- 移动优先：默认样式为移动端，大屏幕需要加前缀
- 示例：`md:flex lg:text-xl` (中等屏幕以上显示flex，大屏幕文字更大)

## 状态变体

- hover: 鼠标悬停状态
- focus: 焦点状态
- active: 激活状态
- disabled: 禁用状态
- group-hover: 父元素悬停时子元素样式
- 示例：`hover:bg-blue-500 focus:ring-2`

## 暗黑模式

- dark: 前缀支持暗黑模式
- 需要配置 `darkMode: 'class'` 或 `darkMode: 'media'`
- 示例：`dark:bg-gray-900 dark:text-white`

## 自定义配置

- tailwind.config.js 文件配置主题
- 可以自定义颜色、字体、间距、断点等
- 支持扩展和覆盖默认配置

## 常用工具类

- 布局：flex, grid, container, columns
- 间距：p-4, m-2, gap-3, space-x-4
- 尺寸：w-full, h-screen, min-h-0, max-w-md
- 定位：relative, absolute, fixed, sticky
- 显示：block, inline, hidden, visible

## 动画和过渡

- transition: 过渡效果
- animate: 内置动画 (spin, ping, bounce等)
- transform: 变换 (scale, rotate, translate)
- 示例：`transition-all duration-300 ease-in-out`

## 实用技巧

- 使用 @apply 指令在CSS中应用Tailwind类
- 支持任意值：`w-[200px]`, `text-[#ff0000]`
- 支持CSS变量：`bg-[var(--primary-color)]`
- 支持嵌套和组合：`hover:focus:active:bg-red-500`

## 性能优化

- PurgeCSS 自动移除未使用的CSS类
- JIT (Just-In-Time) 模式按需生成CSS
- 支持 tree-shaking 减少打包体积
  